<script>
import { mapGetters, mapActions } from "vuex";

import { getStringValueOfStatutCode } from "@/utils/index";
import ProjetService from "@/services/modules/projet.service.js";
import ComposantesService from "@/services/modules/composante.service";
import ActiviteService from "@/services/modules/activite.service";
import TachesService from "@/services/modules/tache.service";
import verifyPermission from "@/utils/verifyPermission";
import InputForm from "@/components/news/InputForm.vue";
import VButton from "@/components/news/VButton.vue";
import { toast } from "vue3-toastify";
import pagination from "@/components/news/pagination.vue";
import { helper as $h } from "@/utils/helper";
import NoRecordsMessage from "@/components/NoRecordsMessage.vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import TacheService from "@/services/modules/tache.service.js";


export default {
  components: {
    InputForm,
    VButton,
    pagination,
    NoRecordsMessage,
    LoaderSnipper,
  },

  data() {
    return {
      search: "",
      isLoadingTaches: false,
      itemsPerPage: 3, // Nombre d'éléments par page
      totalItems: null,
      currentPage: 1, // Page courante
      messageErreur: {},
      projets: [],
      projetId: "",
      composants: [],
      sousComposants: [],
      selectedIds: {
        composantId: "",
        sousComposantId: "",
        activiteId: "",
      },
      activites: [],
      // allActivite: [],
      haveSousComposantes: false,
      isLoadingData: false,
      showModal: false,
      isUpdate: false,
      update : false,
      isLoading: false,
      formData: this.getInitialFormData(),
      composantsId: {},
      sousComposantId: {},
      activitesId: {},
      labels: "Ajouter",
      showDeleteModal: false,
      deleteLoader: false,
      taches: [],
      tacheId: "",
      dateDebutMin: "",
      dateFinMax: "",
    };
  },

  computed: {
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
    paginatedAndFilteredData() {
      const { paginatedData, totalFilteredItems } = $h.filterData({
        itemsPerPage: this.itemsPerPage,
        search: this.search,
        data: this.taches,
        currentPage: this.currentPage,
        keys: ["nom"],
      });

      // Mettre à jour le total pour recalculer la pagination
      this.totalItems = totalFilteredItems;

      return paginatedData;
    },
    getPlageActivite() {
      let obj = null;

      if (this.formData.activiteId !== "") {
        obj = this.activites.find((item) => item.id === this.formData.activiteId);
      }

      if (this.selectedIds.activiteId !== "") {
        obj = this.activites.find((item) => item.id === this.selectedIds.activiteId);
      }

      return obj ? obj.durees : null;
      // Retourne le nom ou `null` si non trouvé
    },
  },
  
  watch: {
    
    projetId(newId) {
      if (newId) {
        this.loadProjetDetails(newId);
      }
    },

    "selectedIds.composantId": "loadComposantDetails",

    "selectedIds.sousComposantId": "loadSousComposantDetails",

    "selectedIds.activiteId": "loadActiviteDetails",
    
    // Watcher pour détecter les changements dans l'URL
    '$route.query': {
      handler(newQuery) {
        // Si on arrive avec des paramètres de navigation depuis les activités
        if (newQuery.projetId && newQuery.composantId && newQuery.activiteId) {
          this.projetId = newQuery.projetId;
          this.selectedIds.composantId = newQuery.composantId;
          if (newQuery.sousComposantId) {
            this.selectedIds.sousComposantId = newQuery.sousComposantId;
          }
          this.selectedIds.activiteId = newQuery.activiteId;
          
          // Afficher un message de confirmation du filtre
          if (newQuery.activiteName) {
            toast.info(`Affichage des tâches pour l'activité: ${newQuery.activiteName}`);
          }
        }
      },
      immediate: true // Exécuter immédiatement au montage
    }
  },

  methods: {
     togglesuivie(pta) {
      var form = {
        tacheId: pta.id,
        poidsActuel: pta.poids,
      };

      TacheService.suiviTache(form)
        .then((data) => {
          toast.success("suivie éffectué avec succès");
        })
        .catch((error) => {
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
          }
        });
      //}
      this.chargement = false;
    },
     closeDeleteTacheModal(){
      document.activeElement.blur()
      this.showDeleteModal = false
    },
     closeAddTacheModal(){
      document.activeElement.blur()
      this.showModal = false
    },
    handleChange(data) {
      this.getPlageActivite(data);
    },
    onPageChanged(newPage) {
      this.currentPage = newPage;
      // Charger les données pour la page actuelle
      // this.loadDataForPage(newPage);
    },
    onItemsPerPageChanged(itemsPerPage) {
      this.itemsPerPage = itemsPerPage;
    },
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
            this.clearObjectValues(obj[key]); // récursion pour les objets imbriqués
          } else {
            obj[key] = null; // pour les autres types (null, undefined, etc.)
          }
        }
      }
    },
    supprimerTache(data) {
      this.showDeleteModal = true;
      this.tacheId = data.id;
    },
    deleteTache() {
      this.deleteLoader = true;
      TachesService.destroy(this.tacheId)
        .then((data) => {
          this.deleteLoader = false;
          this.showDeleteModal = false;
          toast.success("Suppression  éffectuée avec succès");
          // this.getListeProjet();
          this.loadActiviteDetails();
        })
        .catch((error) => {
          this.deleteLoader = false;
          toast.error("Erreur lors de la suppression");
        });
    },
    modifierTache(data) {
      this.messageErreur = {};
      this.labels = "Modifier";
      this.showModal = true;
      this.update = true;
      this.formData.nom = data.nom;
      this.formData.description = data.description;
      this.formData.poids = data.poids;
      this.formData.debut = data.debut;
      this.formData.fin = data.fin;
      this.formData.activiteId = this.selectedIds.activiteId;
      //this.formData.budgetNational = data.budgetNational;
      this.tacheId = data.id;
    },
    addTache() {
      this.update = false;
      this.messageErreur = {};
      this.resetFormData();
      // this.clearObjectValues(this.formData);
      this.showModal = true;
      this.isUpdate = false;

      // this.formData.activiteId = this.activitesId;

      this.labels = "Ajouter";
    },
    sendForm() {
      let data = {
        nom: this.formData.nom,
        poids: this.formData.poids,
        debut: this.formData.debut,
        fin: this.formData.fin,
        activiteId: this.formData.activiteId,
      };
      if (this.update) {
        this.isLoading = true;
        TachesService.update(this.tacheId, data)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.update = false;
              this.isLoading = false;
              this.showModal = false;
              toast.success("Modification éffectuée");
              this.activitesId = this.formData.activiteId;
              this.clearObjectValues(this.formData);
              this.loadActiviteDetails();

              // delete this.formData.projetId;
              //this.getActiviteById(this.activitesId.id);
              // this.getListeProjet();
              //this.sendRequest = false;
            }
          })
          .catch((error) => {
            this.isLoading = false;
            if (error.response && error.response.data && Object.keys(error.response.data.errors).length > 0) {
              this.messageErreur = error.response.data.errors;
              Object.keys(this.messageErreur).forEach((key) => {
                this.messageErreur[key] = $h.extractContentFromArray(this.messageErreur[key]);
              });
              toast.error("Une erreur s'est produite.Vérifier le formulaire de soumission");
            } else {
              toast.error(error.response.data.message);
            }
          });
      } else {
        this.isLoading = true;
        this.selectedIds.activiteId = this.formData.activiteId;
        //this.formData.budgetNational = parseInt(this.formData.budgetNational);
        TachesService.create(data)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.loadActiviteDetails();
              this.isLoading = false;
              toast.success("Ajout éffectué");
              this.showModal = false;

              this.resetFormData();

              // this.getListeProjet();
            }
          })
          .catch((error) => {
            this.isLoading = false;
            if (error.response && error.response.data && Object.keys(error.response.data.errors).length > 0) {
              this.messageErreur = error.response.data.errors;
              Object.keys(this.messageErreur).forEach((key) => {
                this.messageErreur[key] = $h.extractContentFromArray(this.messageErreur[key]);
              });
              toast.error("Une erreur s'est produite.Vérifier le formulaire de soumission");
            } else {
              toast.error(error.message);
            }
          });
      }
    },
    getInitialFormData() {
      return {
        nom: "",
        description: "",
        poids: 0,
        debut: "",
        fin: "",
        activiteId: "",
      };
    },
    resetFormData() {
      this.formData = this.getInitialFormData();
    },

    async loadProjets() {
      this.isLoadingData = true;
      try {
        const response = await ProjetService.get();
        this.projets = response.data.data;
        this.projetId = this.projets[0]?.id || "";
        this.isLoadingData = false;
      } catch (error) {
      } finally {
        this.isLoadingData = false;
      }
    },
    async loadProjetDetails(projetId) {
      this.isLoadingData = true;
      try {
        const response = await ProjetService.getDetailProjet(projetId);
        this.isLoadingData = false;
        this.composants = response.data.data.composantes;
        this.selectedIds.composantId = this.composants[0]?.id || "";

      } catch (error) {
        this.isLoadingData = false;
      }
    },
    async loadComposantDetails() {
      if (!this.selectedIds.composantId || this.selectedIds.composantId == "") return;

      this.isLoadingData = true;

      try {
        const response = await ComposantesService.detailComposant(this.selectedIds.composantId);
        const composantData = response.data.data;
        this.isLoadingData = false;
        this.sousComposants = composantData.souscomposantes || [];
        this.activites = composantData.activites || [];

        if (this.sousComposants.length > 0) {
          this.haveSousComposantes = true;
        } else {
          this.haveSousComposantes = false;

          this.updateActivitesList(this.activites);
        }
      } catch (error) {
      }
    },
    async loadSousComposantDetails() {
      if (!this.selectedIds.sousComposantId || this.selectedIds.sousComposantId == "") return;
      this.isLoadingData = true;
      try {
        const response = await ComposantesService.detailComposant(this.selectedIds.sousComposantId);
        const sousComposantData = response.data.data;
        this.isLoadingData = false;

        this.updateActivitesList(sousComposantData.activites || []);
      } catch (error) {
        this.isLoadingData = false;
      }
    },
    updateActivitesList(activites) {
      this.activites = activites;
    },
    text() {},
    async loadActiviteDetails() {
      if (!this.selectedIds.activiteId || this.selectedIds.activiteId == "") return;
      this.isLoadingData = true;
      try {
        const response = await ActiviteService.get(this.selectedIds.activiteId);

        // Parcours getPlageActivite et détermine la date de début min et la date de fin max de la plage
        if (this.getPlageActivite && this.getPlageActivite.length > 0) {
          const dates = this.getPlageActivite.map(plage => ({
            debut: new Date(plage.debut),
            fin: new Date(plage.fin)
          }));

          this.dateDebutMin = dates.reduce((min, plage) =>
            plage.debut < min ? plage.debut : min, dates[0].debut
          ).toISOString().split('T')[0];

          this.dateFinMax = dates.reduce((max, plage) =>
            plage.fin > max ? plage.fin : max, dates[0].fin
          ).toISOString().split('T')[0];
        }

        this.taches = response.data.data.taches;
        this.isLoadingData = false;
      } catch (error) {
        this.isLoadingData = false;
      }
    },
    resetSousComposantsId() {
      this.selectedIds.sousComposantId = "";
      this.loadComposantDetails();
    },
    
    // Méthode pour effacer le filtre et retourner à la vue normale
    clearFilter() {
      // Réinitialiser les sélections
      this.selectedIds.composantId = "";
      this.selectedIds.sousComposantId = "";
      this.selectedIds.activiteId = "";
      this.projetId = "";
      
      // Supprimer les paramètres de l'URL
      this.$router.replace({
        name: 'Tâches',
        query: {}
      });
      
      toast.success("Filtre effacé. Affichage de toutes les tâches.");
    },

    filter() {},
  },

  created() {},
  mounted() {
    this.loadProjets();
  },
};
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Taches</h2>

  <!-- Filtre -->
  <div class="container px-4 mx-auto">
    <!-- Combined Filter Section -->
    <div class="relative p-6 mt-3 space-y-3 bg-white rounded-lg shadow-md">
      <h2 class="mb-4 text-base font-bold">Filtre</h2>

      <div class="grid grid-cols-2 gap-4">
        <!-- v-if="projets.length > 0" -->
        <div class="flex col-span-6">
          <label for="filtre-projets-taches" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Projets</label>
          <TomSelect
            id="filtre-projets-taches"
            name="filtre-projets-taches"
            v-model="projetId"
            :options="{
              placeholder: 'Choisir un Output',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
          >
            <option value="">Choisir un projet</option>

            <option v-for="(element, index) in projets" :key="index" :value="element.id">{{ element.codePta }}-{{ element.nom }}</option>
          </TomSelect>
        </div>

        <!-- v-if="composants.length > 0" -->
        <div class="flex col-span-6">
          <label for="filtre-outcomes-taches" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Outcomes</label>
          <TomSelect
            id="filtre-outcomes-taches"
            name="filtre-outcomes-taches"
            v-model="selectedIds.composantId"
            :options="{
              placeholder: 'Choisir un Outcome',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
          >
            <option v-for="(element, index) in composants" :key="index" :value="element.id">{{ element.codePta }}-{{ element.nom }}</option>
          </TomSelect>
        </div>

        <!-- v-if="composants.length > 0 && sousComposants.length > 0" -->
        <div class="col-span-6 flex items-center justify-center">
          <div class="flex w-full mr-4">
            <label for="filtre-outputs-taches" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Output</label>
            <TomSelect
              id="filtre-outputs-taches"
              name="filtre-outputs-taches"
              v-model="selectedIds.sousComposantId"
              :options="{
                placeholder: 'Choisir un Output',
                create: false,
                onOptionAdd: text(),
              }"
              class="w-full"
            >
              <option value="">Choisir un Output</option>

              <option v-for="(element, index) in sousComposants" :key="index" :value="element.id">{{ element.codePta }}-{{ element.nom }}</option>
            </TomSelect>
          </div>
          <button v-if="sousComposants.length > 0" type="button" class="btn btn-outline-primary" @click="resetSousComposantsId()" title="Rester dans le composant"><TrashIcon class="w-4 h-4" /></button>
        </div>

        <!-- v-if="activites.length > 0 && (sousComposants.length > 0 || composants.length > 0)" -->
        <div class="flex col-span-6">
          <label for="filtre-activites-taches" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Activités</label>
          <TomSelect
            id="filtre-activites-taches"
            name="filtre-activites-taches"
            v-model="selectedIds.activiteId"
            :options="{
              placeholder: 'Choisir une activité',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
            title="Veuillez sélectionner une activité pour afficher son plan de décaissement"
          >
            <option value="">Choisir une activité</option>

            <option v-for="(element, index) in activites" :key="index" :value="element.id">{{ element.codePta }}-{{ element.nom }}</option>
          </TomSelect>
        </div>
      </div>

      <!-- <button class="absolute px-4 py-2 text-white transform -translate-x-1/2 bg-blue-500 rounded -bottom-3 left-1/2" @click="filter()">Filtrer</button> -->
    </div>
    
    <!-- Indicateur de filtre actif -->
    <div v-if="$route.query.activiteName" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-blue-700 font-medium">
            Filtre actif: Tâches de l'activité "{{ $route.query.activiteName }}"
          </span>
        </div>
        <button 
          @click="clearFilter" 
          class="text-blue-600 hover:text-blue-800 text-sm underline"
          title="Effacer le filtre"
        >
          Effacer le filtre
        </button>
      </div>
    </div>
  </div>

  <!-- Titre de la page -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y">
      <div class="w-auto">
        <div class="relative w-56 text-slate-500">
          <input id="recherche-taches" name="recherche-taches" type="text" v-model="search" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div v-if="verifyPermission('creer-une-tache')" class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="addTache()"><PlusIcon class="w-4 h-4 mr-3" />Ajouter une tâche</button>
      </div>
    </div>
  </div>

  <LoaderSnipper v-if="isLoadingData" />

  <div v-if="!isLoadingData" class="grid grid-cols-12 gap-6 mt-5">
    <!-- BEGIN: Users Layout -->
    <!-- <pre>{{sousComposants}}</pre>   -->
    <NoRecordsMessage class="col-span-12" v-if="!paginatedAndFilteredData.length" title="Aucune tâche trouvée" description="Il semble qu'il n'y ait pas de tâche à afficher. Veuillez en créer un." />
    <div v-for="(item, index) in paginatedAndFilteredData" :key="index" class="col-span-12 intro-y md:col-span-6 xl:col-span-4">
      <!-- <pre>{{ item }}</pre> -->
      <div v-if="verifyPermission('voir-une-tache')" class="p-5 box">
        <div class="flex items-start pt-5 _px-5">
          <div class="_flex _flex-col _items-center w-full _lg:flex-row">
            <div class="mt-3 text-left _lg:ml-4 _lg:text-left lg:mt-0">
              <span class="pr-2 font-bold">Nom :</span><a href="" class="font-medium">{{ item.nom }}</a>
            </div>
          </div>
          <Dropdown class="absolute top-0 right-0 mt-3 mr-5">
            <DropdownToggle tag="a" class="block w-5 h-5" href="javascript:;">
              <MoreVerticalIcon class="w-5 h-5 text-slate-500" />
            </DropdownToggle>
            <DropdownMenu class="w-40">
              <DropdownContent>
                <DropdownItem v-if="verifyPermission('modifier-une-tache')" @click="modifierTache(item)"> <Edit2Icon class="w-4 h-4 mr-2" /> Modifier </DropdownItem>
                <DropdownItem v-if="verifyPermission('supprimer-une-tache')" @click="supprimerTache(item)"> <TrashIcon class="w-4 h-4 mr-2" /> Supprimer </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div class="text-center lg:text-left mt-4">
          <p class="mb-3 text-md font-semibold text-primary">Description</p>
          <p class="p-3 text-gray-600 rounded-lg shadow-sm bg-gray-50">{{ item.description == null ? "Aucune description" : item.description }}</p>
          <div class="m-5 text-slate-600 dark:text-slate-500">
            <!-- <div class="flex items-center"><GlobeIcon class="w-4 h-4 mr-2" /> Taux d'exécution physique: {{ item.tep }}</div> -->

            <div class="flex items-center mt-2">
              <CheckSquareIcon class="w-4 h-4 mr-2" /> Statut :
              <span class="px-2 py-1 m-5 text-xs text-white rounded bg-primary/80" v-if="item.statut == -2"> Non validé </span>
              <span class="px-2 py-1 m-5 text-xs text-white rounded bg-success/80" v-else-if="item.statut == -1"> Pas démarré </span>
              <span class="px-2 py-1 m-5 text-xs text-white rounded bg-pending/80" v-else-if="item.statut == 0"> En cours </span>
              <span class="px-2 py-1 m-5 text-xs text-white rounded bg-danger/80" v-else-if="item.statut == 1"> En retard </span>
              <span class="pl-2" v-else-if="item.statut == 2">Terminé</span>
            </div>
            <div class="suivi-container">
              <span class="suivi-label">Suivre</span>
              <select :id="'suivi-tache-' + item.id" :name="'suivi-tache-' + item.id" class="suivi-select" aria-label="Niveau de suivi" @change="togglesuivie(item)">
                <option :value="0">0%</option>
                <option :value="50">50%</option>
                <option :value="100">100%</option>
              </select>
            </div>
            <div class="flex items-center mt-2">
              <ClockIcon class="w-4 h-4 mr-2" />
              <div>
                Date : Du <span class="pr-1 font-bold"> {{ $h.reformatDate(item.debut) }}</span> au <span class="font-bold"> {{ $h.reformatDate(item.fin) }}</span>
              </div>
            </div>
            <div class="flex items-center mt-2" v-for="(plage, t) in item.durees" :key="t">
              <ClockIcon class="w-4 h-4 mr-2" />
              <div>
                Plage de date {{ t + 1 }} : Du <span class="pr-1 font-bold"> {{ $h.reformatDate(plage.debut) }}</span> au <span class="font-bold"> {{ $h.reformatDate(plage.fin) }}</span>
              </div>
            </div>
            <!-- <div class="flex items-center mt-2"><CheckSquareIcon class="w-4 h-4 mr-2" /> Poids : {{ item.poids }}</div> -->
          </div>
        </div>
      </div>
    </div>
    <pagination class="col-span-12" :total-items="totalItems" :items-per-page="itemsPerPage" :is-loading="isLoadingData" @page-changed="onPageChanged" @items-per-page-changed="onItemsPerPageChanged">
      <!-- Slots personnalisés (facultatif) -->
      <template #prev-icon>
        <span>&laquo; Précédent</span>
      </template>
      <template #next-icon>
        <span>Suivant &raquo;</span>
      </template>
    </pagination>
  </div>

  <!-- END: Users Layout -->

  <Modal size="modal-xl" backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!update" class="mr-auto text-base font-medium">Ajouter une tache</h2>
      <h2 v-else class="mr-auto text-base font-medium">Modifier une tache</h2>
    </ModalHeader>
    <form @submit.prevent="sendForm">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <!-- Nom -->
        <div class="col-span-12 md:col-span-6">
          <InputForm 
            id="nom-tache"
            name="nom"
            v-model="formData.nom" 
            class="col-span-6" 
            type="text" 
            required="required" 
            placeHolder="Nom de la tache" 
            label="Nom" 
          />
          <p class="text-red-500 text-[12px] mt-2 col-span-6" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>
        </div>

        <!-- Description (pleine ligne) -->
        <div class="input-form _mt-3 col-span-12 md:col-span-6">
          <label for="description-tache" class="form-label w-full"> Description </label>
          <textarea 
            id="description-tache"
            name="description"
            v-model="formData.description" 
            class="form-control w-full" 
            placeholder="Ajouter une description"
          ></textarea>
        </div>

        <!-- Projets -->
        <div class="col-span-12 md:col-span-6 mt-4" v-if="!update">
          <label for="projet-selection" class="form-label">Projets</label>
          <TomSelect 
            id="projet-selection"
            name="projetId"
            v-model="projetId" 
            :options="{ placeholder: 'Choisir un projet', create: false, onOptionAdd: text() }" 
            class="w-full"
          >
            <option value="">Choisir un projet</option>
            <option v-for="(element, index) in projets" :key="index" :value="element.id">{{ element.codePta }}-{{ element.nom }}</option>
          </TomSelect>
        </div>

        <!-- Outcomes -->
        <div class="col-span-12 md:col-span-6 mt-4" v-if="!update">
          <label for="outcome-selection" class="form-label">Outcomes</label>
          <TomSelect 
            id="outcome-selection"
            name="composantId"
            v-model="selectedIds.composantId" 
            :options="{ placeholder: 'Choisir un Outcome', create: false, onOptionAdd: text() }" 
            class="w-full"
          >
            <option v-for="(element, index) in composants" :key="index" :value="element.id">{{ element.codePta }}-{{ element.nom }}</option>
          </TomSelect>
        </div>

        <!-- Output -->
        <div class="col-span-12 md:col-span-6 mt-4" v-if="!update">
          <label for="output-selection" class="form-label">Outputs</label>
          <TomSelect 
            id="output-selection"
            name="sousComposantId"
            v-model="selectedIds.sousComposantId" 
            :options="{ placeholder: 'Choisir un Output', create: false, onOptionAdd: text() }" 
            class="w-full"
          >
            <option value="">Choisir un Output</option>
            <option v-for="(element, index) in sousComposants" :key="index" :value="element.id">{{ element.codePta }}-{{ element.nom }}</option>
          </TomSelect>
        </div>

        <!-- Activités -->
        <div class="col-span-12 md:col-span-6 mt-4" v-if="!update">
          <label for="activite-selection-tache" class="form-label">Activités</label>
          <TomSelect 
            id="activite-selection-tache"
            name="activiteId"
            v-model="formData.activiteId" 
            :options="{ placeholder: 'Choisir une activité', create: false, onOptionAdd: text() }" 
            class="w-full" 
            title="Veuillez sélectionner une activité pour afficher son plan de décaissement"
          >
            <option value="">Choisir une activité</option>
            <option v-for="(element, index) in activites" :key="index" :value="element.id">{{ element.codePta }}-{{ element.nom }}</option>
          </TomSelect>
          <p class="text-red-500 text-[12px] mt-2" v-if="messageErreur.activiteId">{{ messageErreur.activiteId }}</p>
        </div>

        <!-- Date début -->
        <div class="col-span-12 md:col-span-6">
          <InputForm 
            id="date-debut-tache"
            name="debut"
            v-model="formData.debut" 
            class="col-span-6" 
            type="date" 
            required="required" 
            placeHolder="Entrer la date de début" 
            label="Début de la tâche" 
            :min="dateDebutMin" 
            :max="dateFinMax" 
          />
          <p class="text-red-500 text-[12px] mt-2 col-span-6" v-if="messageErreur.debut">{{ messageErreur.debut }}</p>
        </div>
        
        <!-- Date fin -->
        <div class="col-span-12 md:col-span-6">
          <InputForm 
            id="date-fin-tache"
            name="fin"
            v-model="formData.fin" 
            class="col-span-6" 
            type="date" 
            required="required" 
            placeHolder="Entrer la date de fin" 
            label="Fin de la tâche" 
            :min="dateDebutMin" 
            :max="dateFinMax" 
          />
          <p class="text-red-500 text-[12px] mt-2 col-span-6" v-if="messageErreur.fin">{{ messageErreur.fin }}</p>
        </div>

        <!-- Plage de date -->
        <div v-if="getPlageActivite" class="col-span-12">
          <span class="font-bold text-md">Plage de date de l'activité :</span>
          
          <div class="flex items-center mt-2" v-for="(plage, t) in getPlageActivite" :key="t">
            <ClockIcon class="w-4 h-4 mr-2" />
            <div>
              Plage de date {{ t + 1 }} : Du <span class="pr-1 font-bold"> {{ $h.reformatDate(plage.debut) }}</span> au <span class="font-bold"> {{ $h.reformatDate(plage.fin) }}</span>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div class="flex items-center justify-center">
          <button 
            type="button" 
            @click="closeAddTacheModal" 
            class="w-full mr-1 btn btn-outline-secondary"
            id="annuler-tache"
          >
            Annuler
          </button>
          <VButton 
            id="enregistrer-tache"
            class="inline-block" 
            :label="labels" 
            :loading="isLoading" 
            type="submit"
          />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <Modal backdrop="static" :show="showDeleteModal" @hidden="showDeleteModal = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Etes vous sûr?</div>
        <div class="mt-2 text-slate-500">Voulez vous supprimer la tache ? <br />Cette action ne peut être annulé</div>
      </div>
      <div class="flex gap-2 px-5 pb-8 text-center">
        <button type="button" @click="closeDeleteTacheModal" class="w-full my-3 mr-1 btn btn-outline-secondary">Annuler</button>
        <VButton :loading="deleteLoader" label="Supprimer" @click="deleteTache" />
      </div>
    </ModalBody>
  </Modal>
</template>

<style scoped>
.suivi-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.suivi-container:hover {
  background: #ffffff;
  border-color: #0F3460;
  box-shadow: 0 0 0 2px rgba(15, 52, 96, 0.1);
}

.suivi-label {
  font-weight: 600;
  color: #0F3460;
  font-size: 14px;
  white-space: nowrap;
}

.suivi-select {
  padding: 6px 32px 6px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #ffffff url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%230F3460' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e") no-repeat right 8px center;
  background-size: 16px;
  font-size: 14px;
  color: #0F3460;
  cursor: pointer;
  appearance: none;
  min-width: 80px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.suivi-select:focus {
  outline: none;
  border-color: #0F3460;
  box-shadow: 0 0 0 2px rgba(15, 52, 96, 0.15);
}

.suivi-select:hover {
  border-color: #0F3460;
  background-color: #f8fafc;
}

/* Style pour les options */
.suivi-select option {
  padding: 8px;
  background: #ffffff;
  color: #0F3460;
}

/* Style pour l'option sélectionnée */
.suivi-select option:checked {
  background: #0F3460 linear-gradient(0deg, #0F3460 0%, #0F3460 100%);
  color: #ffffff;
}

/* Style au focus pour accessibilité */
.suivi-select:focus-visible {
  outline: 2px solid #0F3460;
  outline-offset: 1px;
}

</style>
