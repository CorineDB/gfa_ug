<script>
import { mapGetters } from "vuex";
import { toast } from "vue3-toastify";
import ProjetService from "@/services/modules/projet.service.js";
import ComposantesService from "@/services/modules/composante.service";
import ActiviteService from "@/services/modules/activite.service";
import InputForm from "@/components/news/InputForm.vue";
import VButton from "@/components/news/VButton.vue";
import ActivitiesComponent from "./activities.vue";
import verifyPermission from "@/utils/verifyPermission";
import NoRecordsMessage from "@/components/NoRecordsMessage.vue";
import pagination from "@/components/news/pagination.vue";
import { helper as $h } from "@/utils/helper";

export default {
  components: {
    InputForm,
    VButton,
    NoRecordsMessage,
    pagination,
    ActivitiesComponent,
  },

  data() {
    return {
      search: "",
      isLoadingActivites: false,
      itemsPerPage: 3, // Nombre d'éléments par page
      totalItems: null,
      currentPage: 1, // Page courante
      allActivite: [],
      messageErreur: {},
      projets: [],
      projetId: null,
      composants: [],
      sousComposants: [],
      activites: [],
      isLoadingData: false,
      showModal: false,
      isUpdate: false,
      isLoading: false,
      formData: this.getInitialFormData(),
      selectedIds: {
        composantId: null,
        sousComposantId: null,
        activiteId: null,
      },
      labels: "Ajouter",
      showDeleteModal: false,
      deleteLoader: false,

      seeStatistique: false,
      seePlan: false,
      seeActivite: true,
      seeActivitiesOfState: 3,
      haveSousComposantes: false,
    };
  },

  computed: {
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
    paginatedAndFilteredData() {
      const { paginatedData, totalFilteredItems } = $h.filterData({
        itemsPerPage: this.itemsPerPage,
        search: this.search,
        data: this.activites,
        currentPage: this.currentPage,
        keys: ["nom"],
      });

      // Mettre à jour le total pour recalculer la pagination
      this.totalItems = totalFilteredItems;

      return paginatedData;
    },
  },

  watch: {
    projetId(newId) {
      if (newId) {
        this.loadProjetDetails(newId);
      }
    },

    "selectedIds.composantId": "loadComposantDetails",
  },

  methods: {
    verifyPermission,
    onPageChanged(newPage) {
      this.currentPage = newPage;
      // console.log("Page actuelle :", this.currentPage);
      // // Charger les données pour la page actuelle
      // this.loadDataForPage(newPage);
    },
    onItemsPerPageChanged(itemsPerPage) {
      this.itemsPerPage = itemsPerPage;
    },
    seeTypeActivities(state) {
      state = parseInt(state);
      this.seeActivitiesOfState = state;

      if (state == 3) {
        this.activites = this.allActivite;
      } else {
        console.log("state", state);

        this.activites = this.allActivite.filter((item) => item.statut == state);

        console.log("activites", this.activites);
      }
    },

    getInitialFormData() {
      return {
        nom: "",
        poids: 0,
        debut: "",
        fin: "",
        pret: 0,
        type: "pta",
        composanteId: "",
        budgetNational: 0,
      };
    },

    resetFormData() {
      this.formData = this.getInitialFormData();
    },

    supprimerComposant(data) {
      this.showDeleteModal = true;
      this.selectedIds.activiteId = data.id;
    },

    async deleteComposants() {
      try {
        this.deleteLoader = true;
        await ActiviteService.destroy(this.selectedIds.activiteId);
        toast.success("Suppression effectuée avec succès");
        this.loadComposantDetails();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      } finally {
        this.deleteLoader = false;
        this.showDeleteModal = false;
      }
    },

    modifierActivite(data) {
      this.messageErreur = {};
      this.labels = "Modifier";
      this.showModal = true;
      this.isUpdate = true;
      this.formData = {
        ...data,
        debut: data.durees[0]?.debut || "",
        fin: data.durees[0]?.fin || "",
        composanteId: this.selectedIds.sousComposantId || this.selectedIds.composantId,
      };
      this.selectedIds.activiteId = data.id;
    },

    addActivite() {
      this.resetFormData();
      this.showModal = true;
      this.isUpdate = false;
      this.labels = "Ajouter";
      // this.formData.composanteId = this.selectedIds.composantId;
    },
    resetSousComposantsId() {
      this.selectedIds.composantId = null;
      this.text();
    },

    async sendForm() {
      const data = {
        ...this.formData,
        composanteId: this.selectedIds.composantId == null ? this.formData.composanteId.id : this.selectedIds.composantId,
        budgetNational: parseInt(this.formData.budgetNational),
        pret: parseInt(this.formData.pret),
      };

      this.isLoading = true;
      try {
        if (this.isUpdate) {
          await ActiviteService.update(this.selectedIds.activiteId, data);
          toast.success("Modification effectuée");
        } else {
          await ActiviteService.create(data);
          toast.success("Ajout effectué");
        }

        this.showModal = false;
        this.loadComposantDetails();
      } catch (error) {
        this.isLoading = false;
        this.messageErreur = error.response?.data?.errors || {};
        Object.keys(this.messageErreur).forEach((key) => {
          this.messageErreur[key] = $h.extractContentFromArray(this.messageErreur[key]);
        });
        toast.error("Erreur lors de l'envoi des données");
      } finally {
        this.isLoading = false;
      }
    },

    async loadProjets() {
      this.isLoadingData = true;
      try {
        const response = await ProjetService.get();
        this.projets = response.data.data;
        this.projetId = this.projets[0]?.id || null;
        this.isLoadingData = false;
      } catch (error) {
        console.error("Erreur lors du chargement des projets", error);
      } finally {
        this.isLoadingData = false;
      }
    },

    async loadProjetDetails(projetId) {
      try {
        const response = await ProjetService.getDetailProjet(projetId);
        this.composants = response.data.data.composantes;
        this.selectedIds.composantId = this.composants[0]?.id || null;
      } catch (error) {
        console.error("Erreur lors du chargement des détails du projet", error);
      }
    },

    async loadComposantDetails() {
      if (!this.selectedIds.composantId) return;

      try {
        const response = await ComposantesService.detailComposant(this.selectedIds.composantId);
        const composantData = response.data.data;

        // Mettre à jour les sous-composants et activités du composant
        this.sousComposants = composantData.souscomposantes || [];
        this.activites = composantData.activites || [];
        this.allActivite = this.activites;

        // Vérifier s'il y a des sous-composants
        if (this.sousComposants.length > 0) {
          this.haveSousComposantes = true;
          this.selectedIds.sousComposantId = this.sousComposants[0]?.id || null;

          this.loadSousComposantDetails(); // Charger les activités du premier sous-composant
        } else {
          this.haveSousComposantes = false;
          // Pas de sous-composants, afficher directement les activités du composant
          this.updateActivitesList(this.activites);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des détails du composant", error);
      }
    },

    async loadSousComposantDetails() {
      if (!this.selectedIds.sousComposantId) return;

      try {
        const response = await ComposantesService.detailComposant(this.selectedIds.sousComposantId);
        const sousComposantData = response.data.data;

        console.log("sousComposantData", sousComposantData);

        // Mettre à jour les activités du sous-composant
        this.updateActivitesList(sousComposantData.activites || []);
      } catch (error) {
        console.log("erreur", error);
        console.error("Erreur lors du chargement des détails du sous-composant", error);
      }
    },

    updateActivitesList(activites) {
      this.activites = activites;
      this.allActivite = this.activites;
      console.log(this.activites);
    },

    seeActivities() {
      this.seePlan = false;
      this.seeActivite = true;
      this.seeStatistique = false;
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
    text() {},
  },

  async mounted() {
    await this.loadProjets();
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
        <div class="flex col-span-6" v-if="projets.length > 0">
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Projets</label>
          <TomSelect
            v-model="projetId"
            :options="{
              placeholder: 'Choisir un Output',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
          >
            <option value="">Choisir un projet</option>

            <option v-for="(element, index) in projets" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
        </div>

        <div class="flex col-span-6" v-if="composants.length > 0">
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Composants</label>
          <TomSelect
            v-model="selectedIds.composantId"
            :options="{
              placeholder: 'Choisir un Output',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
          >
            <option v-for="(element, index) in composants" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
        </div>

        <div class="flex col-span-6" v-if="sousComposants.length > 0">
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Output</label>
          <TomSelect
            v-model="selectedIds.sousComposantId"
            :options="{
              placeholder: 'Choisir un Output',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
          >
            <option value="">Choisir un Output</option>

            <option v-for="(element, index) in sousComposants" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
        </div>
      </div>
    </div>
  </div>

  <!-- Filtre -->
  <div class="container mx-auto" v-if="seeActivite">
    <!-- Combined Filter Section -->
    <div class="relative p-6 mt-3 space-y-3 bg-white rounded-lg shadow-md">
      <div class="flex flex-wrap items-center justify-between col-span-12 sm:flex-nowrap">
        <div class="flex">
          <h2 class="text-base font-bold">Activites</h2>
        </div>
        <div class="flex">
          <button class="mr-2 shadow-md btn btn-primary" v-permission="['creer-une-activite']" @click="addActivite()"><PlusIcon class="w-4 h-4 mr-3" />Ajouter une Activité test</button>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between col-span-12">
        <div class="flex flex-wrap space-x-2 md:space-x-4">
          <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == 3 }" @click="seeTypeActivities(3)" class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">Tout</span>

          <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == -1 }" @click="seeTypeActivities(-1)" class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">Non demarre</span>
          <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == 0 }" @click="seeTypeActivities(0)" class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">En cours </span>

          <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == 1 }" @click="seeTypeActivities(1)" class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">En retard </span>

          <span :class="{ 'border-primary border-b-4 font-bold': seeActivitiesOfState == 2 }" @click="seeTypeActivities(2)" class="inline-block cursor-pointer text-xs sm:text-sm uppercase py-2 mb-2">Termine </span>
        </div>
        <div class="flex">
          <div class="relative text-slate-500">
            <input v-model="search" type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
            <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
          </div>
        </div>
      </div>
    </div>

    <!-- Results or other components -->
    <div class="mt-6">
      <LoaderSnipper v-if="isLoadingData" />
      <div v-if="!isLoadingData" class="grid grid-cols-12 gap-6 mt-5">
        <NoRecordsMessage class="col-span-12" v-if="!activites.length" title="Aucune activité trouvée" description="Il semble qu'il n'y ait pas d'activités à afficher. Veuillez revenir plus tard." />
        <div v-else v-for="(item, index) in paginatedAndFilteredData" :key="index" class="col-span-12 p-4 md:col-span-6 lg:col-span-4">
          <div v-if="verifyPermission('voir-une-activite')" class="p-5 transition-transform transform bg-white border-l-4 rounded-lg shadow-lg box border-primary hover:scale-105 hover:bg-gray-50">
            <div class="relative flex items-start pt-5">
              <div class="flex flex-col items-center w-full lg:flex-row">
                <div class="flex items-center justify-center w-[90px] h-[90px] text-white rounded-full shadow-md bg-primary flex-shrink-0">
                  {{ item.type }}
                  <!-- <img alt="Midone Tailwind HTML Admin Template" class="rounded-full" :src="faker.photos[0]" /> -->
                </div>
                <div class="text-lg font-semibold text-gray-800 transition-colors hover:text-primary _truncate text-center lg:text-left">
                  <a href="" class="text-lg font-semibold text-gray-800 transition-colors hover:text-primary">{{ item.nom }} </a>
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
              <p class="p-3 text-gray-600 rounded-lg shadow-sm bg-gray-50">{{ item.description == null ? "Aucune description" : item.description }}</p>

              <div class="mt-5 space-y-3 text-gray-600">
                <div class="flex items-center">
                  <LinkIcon class="w-4 h-4 mr-2" /> Fonds propre: {{ $h.formatCurrency(item.budgetNational) }}
                  <div class="ml-2 italic font-bold">Fcfa</div>
                </div>

                <div class="flex items-center">
                  <LinkIcon class="w-4 h-4 mr-2" /> Montant financé: {{ $h.formatCurrency(item.pret == null ? 0 : item.pret) }}
                  <div class="ml-2 italic font-bold">Fcfa</div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <pagination class="col-span-12" :total-items="totalItems" :items-per-page="itemsPerPage" :is-loading="isLoadingProjets" @page-changed="onPageChanged" @items-per-page-changed="onItemsPerPageChanged">
      <!-- Slots personnalisés (facultatif) -->
      <template #prev-icon>
        <span>&laquo; Précédent</span>
      </template>
      <template #next-icon>
        <span>Suivant &raquo;</span>
      </template>
    </pagination>
  </div>

  <PlanDecaissementComponent v-if="seePlan" :projetsId="projetId" :composantId="selectedIds.composantId" :sousComposantsId="selectedIds.sousComposantsId" @getProjetById="loadProjetDetails" />

  <!-- v-if="false == true" -->

  <!-- END: Users Layout -->

  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!update" class="mr-auto text-base font-medium">Ajouter une Activité</h2>
      <h2 v-else class="mr-auto text-base font-medium">Modifier un Activité</h2>
    </ModalHeader>
    <form @submit.prevent="sendForm">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <InputForm v-model="formData.nom" class="col-span-12" type="text" required="required" placeHolder="Nom de l'activité*" label="Nom test" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>

        <InputForm v-model="formData.pret" class="col-span-12" type="number" required="required" placeHolder="Montant financé*" label="Montant financé" />
        <InputForm v-model="formData.budgetNational" class="col-span-12" type="number" required="required" placeHolder="Ex : 2" label="Fond Propre*" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.pret">{{ messageErreur.pret }}</p>

        <InputForm v-model="formData.debut" class="col-span-12" type="date" required="required" placeHolder="Entrer la date de début*" label="Début de l'activité" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.debut">{{ messageErreur.debut }}</p>

        <InputForm v-model="formData.fin" class="col-span-12" type="date" required="required" placeHolder="Entrer la date de fin*" label="Fin de l'activité" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.fin">{{ messageErreur.fin }}</p>

        <div class="flex col-span-12">
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OutCome*</label>
          <TomSelect
            v-model="formData.composanteId"
            :options="{
              placeholder: 'Choisir un Outcome',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
          >
              <option value="">Choisir un Outcome</option>

            <option v-for="(element, index) in composants" :key="index" :value="element.id">{{ element.nom }}</option>
          </TomSelect>
        </div>

        <div class="flex col-span-12" v-if="haveSousComposantes">
          <div class="flex w-11/12">
            <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OutPut*</label>
            <TomSelect
              v-model="selectedIds.sousComposantId"
              :options="{
                placeholder: 'Choisir un Output',
                create: false,
                onOptionAdd: text(),
              }"
              class="w-full"
            >
              <option>Choisir une sous-composantes</option>
              <option v-for="(element, index) in sousComposants" :key="index" :value="element.id">{{ element.nom }}</option>
            </TomSelect>
          </div>
          <button class="btn btn-outline-primary" @click="resetSousComposantsId()" title="Rester dans le composant"><TrashIcon class="w-4 h-4" /></button>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="showModal = false" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" :label="labels" :loading="isLoading" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <Modal backdrop="static" :show="showDeleteModal" @hidden="showDeleteModal = false">
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
</template>

<style></style>
