<script>
import { mapGetters, mapActions } from "vuex";

import { getStringValueOfStatutCode } from "@/utils/index";
import ProjetService from "@/services/modules/projet.service.js";
import ComposantesService from "@/services/modules/composante.service";
import ActiviteService from "@/services/modules/activite.service";
import InputForm from "@/components/news/InputForm.vue";
import verifyPermission from "@/utils/verifyPermission";
import VButton from "@/components/news/VButton.vue";
import ActivitiesComponent from "./activities.vue";
import PlanDecaissementComponent from "./plan-decaissement.vue";
import { helper as $h } from "@/utils/helper";

import { toast } from "vue3-toastify";
export default {
  components: {
    InputForm,
    VButton,
    ActivitiesComponent,
    PlanDecaissementComponent,
  },
  data() {
    return {
      messageErreur: {},
      projets: [],
      projetId: {},
      composants: [],
      sousComposants: [],
      activites: [],
      haveSousComposantes: false,
      isLoadingData: false,
      showModal: false,
      isUpdate: false,
      isLoading: false,
      formData: {
        nom: "",
        poids: "",
        debut: "",
        fin: "",
        pret: 0,
        type: "pta",
        composanteId: "",
        budgetNational: 0,
      },
      composantsId: {},
      composantId: "",
      sousComposantId: {},
      activiteId: {},
      labels: "Ajouter",
      showDeleteModal: false,
      deleteLoader: false,

      seeStatistique: false,
      seePlan: false,
      seeActivite: true,
    };
  },
  computed: {
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
  },
  watch: {
    projetId(newValue, oldValue) {
      if (this.projets.length > 0 && newValue != null && newValue != undefined) {
        this.getProjetById(newValue.id);
      }
    },
    composantsId(newValue, oldValue) {
      if (newValue != null && newValue != undefined) {
        this.composantId = newValue.id;
      }
    },
    composantId(newValue, oldValue) {
      if (this.composants.length > 0 && newValue != null && newValue != undefined) {
        //this.getComposantById(newValue);
      }
    },

    sousComposantId(newValue, oldValue) {
      if (this.sousComposants.length > 0 && newValue != null && newValue != undefined) {
        console.log("composantsId : ", newValue.id);
        //this.getComposantById(newValue.id);
      }
    },
    composantId(newValue, oldValue) {
      if (this.sousComposants.length > 0 || newValue) {
        this.getComposantById(newValue.id);
      }
    },
  },

  methods: {
    text() {},
    verifyPermission,
    clearObjectValues(obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          let value = obj[key];

          if (typeof value === "string") {
            obj[key] = "";
          } else if (typeof value === "number") {
            obj[key] = 0;
          } else if (typeof value === "boolean") {
            obj[key] = false;
          } else if (Array.isArray(value)) {
            obj[key] = [];
          } else if (typeof value === "object" && value !== null) {
            obj[key] = {}; // ou appliquer récursion pour vider les objets imbriqués
            clearObjectValues(obj[key]); // récursion pour les objets imbriqués
          } else {
            obj[key] = null; // pour les autres types (null, undefined, etc.)
          }
        }
      }
    },
    supprimerComposant(data) {
      this.showDeleteModal = true;
      this.activiteId = data.id;
    },
    deleteComposants() {
      this.deleteLoader = true;
      ActiviteService.destroy(this.activiteId)
        .then((data) => {
          this.deleteLoader = false;
          this.showDeleteModal = false;
          this.getComposantById(this.composantsId.id);
          toast.success("Suppression  éffectuée avec succès");
          //this.getListeProjet();
        })
        .catch((error) => {
          this.deleteLoader = false;
          toast.error("Erreur lors de la suppression");
        });
    },
    modifierActivite(data) {
      this.messageErreur = {};
      this.labels = "Modifier";
      this.showModal = true;
      this.update = true;
      console.log("data", data);
      this.formData.nom = data.nom;
      this.formData.pret = data.pret;
      this.formData.poids = data.poids;
      this.formData.debut = data.durees[0].debut;
      this.formData.fin = data.durees[0].fin;
      this.formData.type = "pta";
      this.formData.composanteId = Object.keys(this.sousComposantId).length === 0 ? this.composantsId : this.sousComposantId;
      this.formData.budgetNational = data.budgetNational;
      this.activiteId = data.id;
    },
    addActivite() {
      this.messageErreur = {};
      this.showModal = true;
      this.isUpdate = false;
      if (this.haveSousComposantes) {
        this.formData.composanteId = this.sousComposantId;
      } else {
        this.formData.composanteId = this.composantsId;
      }

      this.labels = "Ajouter";
    },
    sendForm() {
      let data = {
        nom: this.formData.nom,
        poids: this.formData.poids,
        debut: this.formData.debut,
        fin: this.formData.fin,
        pret: this.formData.pret,
        type: this.formData.type,
        composanteId: this.formData.composanteId.id,
        budgetNational: this.formData.budgetNational,
      };
      data.budgetNational = parseInt(data.budgetNational);
      data.pret = parseInt(data.pret);

      if (this.update) {
        // this.formData.projetId = this.projetId
        this.isLoading = true;
        ActiviteService.update(this.activiteId, data)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.update = false;
              this.isLoading = false;
              this.showModal = false;
              toast.success("Modification éffectuée");

              this.composantsId = this.formData.composanteId;
              $h.clearObjectValues(this.formData);
              // delete this.formData.projetId;
              //this.getListeProjet();
              this.getComposantById(this.composantsId.id);
              //this.sendRequest = false;
            }
          })
          .catch((error) => {
            // delete this.formData.projetId;
            this.isLoading = false;
            if (error.response && error.response.data && error.response.data.errors) {
              this.messageErreur = error.response.data.errors;
            } else {
              toast.error("Une erreur inconnue s'est produite");
            }
            toast.error("Erreur lors de la modification");
          });
      } else {
        this.isLoading = true;
        // this.formData.budgetNational = parseInt(this.formData.budgetNational);
        // this.formData.pret = parseInt(this.formData.pret);
        // console.log(this.formData);

        ActiviteService.create(data)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.isLoading = false;
              toast.success("Ajout éffectué");
              this.showModal = false;
              this.getComposantById(this.composantsId.id);
              // $h.clearObjectValues(this.formData);

              this.getListeProjet();
            }
          })
          .catch((error) => {
            console.log("error", error);
            this.isLoading = false;
            if (error.response && error.response.data && error.response.data.errors) {
              this.messageErreur = error.response.data.errors;
            } else {
              toast.error("Une erreur inconnue s'est produite");
            }
            toast.error("Erreur lors de l'ajout");
          });
      }
    },
    getListeProjet() {
      this.isLoadingData = true;
      ProjetService.get()
        .then((data) => {
          this.isLoadingData = false;
          this.projets = data.data.data;
          if (Object.keys(this.projetId).length === 0) {
            this.projetId = this.projets[0];
          }

          this.getProjetById(this.projetId.id);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getProjetById(data) {
      ProjetService.getDetailProjet(data)
        .then((datas) => {
          this.composants = datas.data.data.composantes;
          this.composantsId = this.composants[0];
          // if (Object.keys(this.composantsId).length === 0) {

          // }
          this.getComposantById(this.composantsId.id);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getComposantById(data) {
      ComposantesService.detailComposant(data)
        .then((data) => {
          if (data.data.data.souscomposantes.length > 0) {
            this.sousComposants = data.data.data.souscomposantes;
            this.haveSousComposantes = true;
            this.sousComposantsId = this.sousComposants[0].id;

            /* if ((this.sousComposantsId == "") && (this.sousComposants.length > 0) ) {
              this.sousComposantsId = this.sousComposants[0].id;
            } */
          }

          //this.activites = data.data.data.activites;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    filter() {},
    seeActivities() {
      this.seePlan = false;
      this.seeActivite = true;
      this.seeStatistique = false;
      //this.fetchActivites(this.composanteId)
    },

    seeStats() {
      this.seePlan = false;
      this.seeActivite = false;
      this.seeStatistique = true;
    },

    seePlanDecaissement() {
      this.seePlan = true;
      this.seeActivite = false;
      this.seeStatistique = false;
    },
  },

  created() {},
  mounted() {
    this.getListeProjet();
  },
};
</script>

<template>
  <div class="flex items-center justify-between my-2 flex-wrap sm:flex-nowrap">
    <div class="flex space-x-2 md:space-x-4 w-full sm:w-4/5">
      <span :class="{ 'border-primary border-b-8 font-bold': seeActivite }" @click="seeActivities()" class="inline-block cursor-pointer text-xs sm:text-sm md:text-base uppercase border-primary py-2 mb-2">Activités</span>
      <span :class="{ 'border-primary border-b-8 font-bold': seePlan }" @click="seePlanDecaissement()" class="inline-block cursor-pointer text-xs sm:text-sm md:text-base uppercase py-2 mb-2">Plan de décaissement </span>

      <span :class="{ 'border-primary border-b-8 font-bold': seeStatistique }" @click="seeStats()" class="inline-block cursor-pointer text-xs sm:text-sm md:text-base uppercase py-2 mb-2">Statistiques </span>
    </div>
    <div>
      <button v-if="seeActivite && activiteAdd" @click="addActivite" title="ajouter une activite" class="px-4 py-2 flex overflow-hidden items-center text-xs font-semibold text-white uppercase bg-primary focus:outline-none focus:shadow-outline">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: rgba(255, 255, 255, 1); transform: ; msfilter: ">
            <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg
        ></span>
        <span class="mx-2 text-xs font-semibold">ajouter </span>
      </button>

      <button v-if="seePlan && planDeDecaissement" @click="addPlan" title="ajouter" class="p-2 overflow-hidden flex space-x-2 items-center text-xs font-semibold text-white uppercase bg-primary focus:outline-none focus:shadow-outline">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: rgba(255, 255, 255, 1); transform: ; msfilter: ">
            <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg
        ></span>
        <span class="mx-2 text-xs md:text-sm font-semibold">ajouter</span>
      </button>
    </div>
  </div>
  <h2 class="mt-10 text-lg font-medium intro-y">Activités</h2>

  <!-- Filtre -->
  <div class="container px-4 mx-auto">
    <!-- Combined Filter Section -->
    <div class="relative p-6 mt-3 space-y-3 bg-white rounded-lg shadow-md">
      <h2 class="mb-4 text-base font-bold">Filtre</h2>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex w-full">
          <!-- :reduce="(projet) => projet.id" -->
          <v-select class="w-full" v-model="projetId" label="nom" :options="projets">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!projetId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Projets</label>
        </div>
        <div class="flex w-full">
          <!-- :reduce="(composant) => composant.id" -->
          <v-select class="w-full" v-model="composantsId" label="nom" :options="composants">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!composantsId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OUtComes</label>
        </div>
        <div class="flex w-full" v-if="haveSousComposantes">
          <!-- :reduce="(souscomposant) => souscomposant.id" -->
          <v-select class="w-full" v-model="sousComposantId" label="nom" :options="sousComposants">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!sousComposantId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OUtPut</label>
        </div>

        <!-- <div class="flex w-full" v-if="haveSousComposantes">
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OUtPut</label>
          <TomSelect
            v-model="sousComposantId"
            :options="{
              placeholder: 'Choisir un Output',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
          >
            <option v-for="(element, index) in sousComposants" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
        </div> -->
      </div>

      <!-- <button class="absolute px-4 py-2 text-white transform -translate-x-1/2 bg-blue-500 rounded -bottom-3 left-1/2" @click="filter()">Filtrer</button> -->
    </div>

    <!-- Results or other components -->
    <div class="mt-6">
      <!-- Place the table or grid component here -->
    </div>
  </div>

  <ActivitiesComponent v-if="seeActivite" :projetsId="projetId" :composantId="composantId" :sousComposantsId="sousComposantsId" @getProjetById="getProjetById" />
  <PlanDecaissementComponent v-if="seePlan" :projetsId="projetId.id" :composantId="composantId" :sousComposantsId="sousComposantsId" @getProjetById="getProjetById" />

  <div v-if="false == true">
    <!-- Titre de la page -->
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
        <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
          <div class="relative w-56 text-slate-500">
            <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
            <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
          </div>
        </div>
        <div v-if="verifyPermission('creer-une-activite')" class="flex">
          <button class="mr-2 shadow-md btn btn-primary" @click="addActivite()"><PlusIcon class="w-4 h-4 mr-3" />Ajouter une Activité test</button>
        </div>
      </div>
    </div>

    <div v-if="!isLoadingData" class="grid grid-cols-12 gap-6 mt-5">
      <!-- BEGIN: Users Layout -->
      <!-- <pre>{{sousComposants}}</pre>   -->

      <div v-for="(item, index) in activites" :key="index" class="col-span-12 p-4 md:col-span-6 lg:col-span-4">
        <div v-if="verifyPermission('voir-une-activite')" class="p-5 transition-transform transform bg-white border-l-4 rounded-lg shadow-lg box border-primary hover:scale-105 hover:bg-gray-50">
          <div class="relative flex items-start pt-5">
            <div class="flex flex-col items-center w-full lg:flex-row">
              <div class="flex items-center justify-center w-16 h-16 text-white rounded-full shadow-md bg-primary">
                {{ item.type }}
                <!-- <img alt="Midone Tailwind HTML Admin Template" class="rounded-full" :src="faker.photos[0]" /> -->
              </div>
              <div class="mt-3 text-center lg:ml-4 lg:text-left lg:mt-0">
                <a href="" class="text-lg font-semibold text-gray-800 transition-colors hover:text-primary">{{ item.nom }}</a>
                <div class="mt-2 text-xs text-gray-500">
                  <span v-if="item.statut == -2" class="px-2 py-1 text-xs font-medium text-white rounded-md bg-primary"> Non validé </span>
                  <span v-else-if="item.statut == -1" class="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-md"> Validé </span>
                  <span v-else-if="item.statut == 0" class="px-2 py-1 text-xs font-medium text-white bg-yellow-500 rounded-md"> En cours </span>
                  <span v-else-if="item.statut == 1" class="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-md"> En retard </span>
                  <span v-else-if="item.statut == 2" class="pl-2 font-medium">Terminé</span>
                </div>
              </div>
            </div>
            <Dropdown class="absolute top-0 right-0 mt-3 mr-5">
              <DropdownToggle tag="a" class="block w-5 h-5" href="javascript:;">
                <MoreVerticalIcon class="w-5 h-5 text-slate-500" />
              </DropdownToggle>
              <DropdownMenu class="w-40">
                <DropdownContent>
                  <DropdownItem v-if="verifyPermission('modifier-une-activite')" @click="modifierActivite(item)"> <Edit2Icon class="w-4 h-4 mr-2" /> Modifier </DropdownItem>
                  <DropdownItem v-if="verifyPermission('supprimer-une-activite')" @click="supprimerComposant(item)"> <TrashIcon class="w-4 h-4 mr-2" /> Supprimer </DropdownItem>
                </DropdownContent>
              </DropdownMenu>
            </Dropdown>
          </div>

          <div class="mt-5 text-center lg:text-left">
            <p class="mb-3 text-lg font-semibold text-primary">Description</p>
            <p class="p-3 text-gray-600 rounded-lg shadow-sm bg-gray-50">{{ item.description }}</p>

            <div class="mt-5 space-y-3 text-gray-600">
              <div class="flex items-center text-sm font-medium text-gray-700">
                <LinkIcon class="w-4 h-4 mr-2 text-primary" /> Budget:
                <span class="ml-2 font-semibold text-gray-900">{{ item.budgetNational }}</span>
              </div>

              <div class="flex items-center text-sm font-medium text-gray-700">
                <GlobeIcon class="w-4 h-4 mr-2 text-primary" /> Taux d'exécution physique:
                <span class="ml-2 font-semibold text-gray-900">{{ item.tep }}</span>
              </div>

              <div class="flex items-center text-sm font-medium text-gray-700">
                <CheckSquareIcon class="w-4 h-4 mr-2 text-primary" /> Statut:
                <span v-if="item.statut == -2" class="ml-2 text-gray-900">Non validé</span>
                <span v-else-if="item.statut == -1" class="ml-2 text-gray-900">Validé</span>
                <span v-else-if="item.statut == 0" class="ml-2 text-gray-900">En cours</span>
                <span v-else-if="item.statut == 1" class="ml-2 text-gray-900">En retard</span>
                <span v-else-if="item.statut == 2" class="ml-2 text-gray-900">Terminé</span>
              </div>

              <div class="flex items-center text-sm font-medium text-gray-700">
                <CheckSquareIcon class="w-4 h-4 mr-2 text-primary" /> Poids:
                <span class="ml-2 font-semibold text-gray-900">{{ item.poids }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Users Layout -->
    <LoaderSnipper v-if="isLoadingData" />

    <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
      <ModalHeader>
        <h2 v-if="!update" class="mr-auto text-base font-medium">Ajouter une Activité test</h2>
        <h2 v-else class="mr-auto text-base font-medium">Modifier un Activité</h2>
      </ModalHeader>
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <InputForm v-model="formData.nom" class="col-span-12" type="text" required="required" placeHolder="Nom de l'activité" label="Nom test" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>

        <InputForm v-model="formData.poids" class="col-span-12" type="number" required="required" placeHolder="Poids de l'activité " label="Poids" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.poids">{{ messageErreur.poids }}</p>

        <InputForm v-model="formData.pret" class="col-span-12" type="number" required="required" placeHolder="Montant financé" label="Montant financé" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.pret">{{ messageErreur.pret }}</p>

        <InputForm v-model="formData.debut" class="col-span-12" type="date" required="required" placeHolder="Entrer la date de début" label="Début de l'activité" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.debut">{{ messageErreur.debut }}</p>

        <InputForm v-model="formData.fin" class="col-span-12" type="date" required="required" placeHolder="Entrer la date de fin" label="Fin de l'activité" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.fin">{{ messageErreur.fin }}</p>

        <!-- <pre>{{ composants }}</pre> -->
        <div class="flex col-span-12">
          <!-- :reduce="(composant) => composant.id" -->
          <v-select class="w-full" v-model="formData.composanteId" label="nom" :options="composants">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!formData.composanteId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.composanteId">{{ messageErreur.composanteId }}</p>

          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-bold duration-100 ease-linear -translate-y-3 bg-white _font-medium form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OutComes</label>
        </div>

        <!-- <div class="flex col-span-12" v-if="haveSousComposantes">
        <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OUtPut</label>
        <TomSelect
          v-model="formData.composanteId"
          :options="{
            placeholder: 'Choisir un Output',
            create: false,
            onOptionAdd: text(),
          }"
          class="w-full"
        >
          <option v-for="(element, index) in sousComposants" :key="index" :value="element.id">{{ element.nom }}</option>
        </TomSelect>
      </div> -->
        <div class="flex col-span-12" v-if="haveSousComposantes">
          <!-- :reduce="(composant) => composant.id" -->
          <v-select class="w-full" v-model="formData.composanteId" label="nom" :options="sousComposants">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!formData.composanteId" v-bind="attributes" v-on="events" />
            </template>
          </v-select>
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-bold duration-100 ease-linear -translate-y-3 bg-white _font-medium form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OutPut test</label>
        </div>

        <!-- <div class="flex col-span-12">
        <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OutComes</label>
        <TomSelect
          v-model="formData.composanteId"
          :options="{
            placeholder: 'Choisir un Output',
            create: false,
            onOptionAdd: text(),
          }"
          class="w-full"
        >
          <option v-for="(element, index) in composants" :key="index" :value="element.id">{{ element.nom }}</option>
        </TomSelect>
      </div> -->
        <!--<div class="flex col-span-12">
        <v-select class="w-full" :reduce="(composant) => composant.id" v-model="formData.composanteId" label="nom" :options="composants">
          <template #search="{ attributes, events }">
            <input class="vs__search form-input" :required="!formData.composanteId" v-bind="attributes" v-on="events" />
          </template>
        </v-select>
        <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-bold duration-100 ease-linear -translate-y-3 bg-white _font-medium form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OutComes</label>
      </div>-->

        <InputForm v-model="formData.budgetNational" class="col-span-12" type="number" required="required" placeHolder="Ex : 2" label="Fond Propre" />
      </ModalBody>
      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="showModal = false" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" :label="labels" :loading="isLoading" @click="sendForm" />
        </div>
      </ModalFooter>
    </Modal>

    <Modal :show="showDeleteModal" @hidden="showDeleteModal = false">
      <ModalBody class="p-0">
        <div class="p-5 text-center">
          <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
          <div class="mt-5 text-3xl">Etes vous sûr?</div>
          <div class="mt-2 text-slate-500">Voulez vous supprimer l'activité ? <br />Cette action ne peut être annulé</div>
        </div>
        <div class="flex gap-2 px-5 pb-8 text-center">
          <button type="button" @click="showDeleteModal = false" class="w-full my-3 mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton :loading="deleteLoader" label="Supprimer" @click="deleteComposants" />
        </div>
      </ModalBody>
    </Modal>
  </div>
</template>

<style></style>
