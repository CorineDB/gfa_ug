<script>
import { mapGetters, mapActions } from "vuex";

import { getStringValueOfStatutCode } from "@/utils/index";
import ProjetService from "@/services/modules/projet.service.js";
import ComposantesService from "@/services/modules/composante.service";
import InputForm from "@/components/news/InputForm.vue";
import verifyPermission from "@/utils/verifyPermission";
import VButton from "@/components/news/VButton.vue";
import pagination from "@/components/news/pagination.vue";
import { helper as $h } from "@/utils/helper";
import NoRecordsMessage from "@/components/NoRecordsMessage.vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";

import { toast } from "vue3-toastify";
export default {
  components: {
    InputForm,
    VButton,
    pagination,
    LoaderSnipper,
    NoRecordsMessage,
  },
  
  data() {
    return {
      selectedIds: {
        composantId: "",
        sousComposantId: "",
      },
      search: "",
      isLoadingOutput: false,
      itemsPerPage: 3, // Nombre d'éléments par page
      totalItems: null,
      currentPage: 1, // Page courante
      messageErreur: {},
      projets: [],
      projetId: "",
      composants: [],
      sousComposants: [],
      isLoadingData: false,
      showModal: false,
      isUpdate: false,
      update:false,
      isLoading: false,
      formData: {
        nom: "",
        description: "",
        poids: 0,
        pret: "",
        composanteId: "",
        budgetNational: 0,
      },
      composantsId: "",
      sousComposantId: "",
      labels: "Ajouter",
      showDeleteModal: false,
      deleteLoader: false,
      fondPropreOutcome: 0,
      SubventionOutcome: 0,
      composantData: [],
      fondTotalOutcome: 0,
      subventionTotalOutcome: 0,
      fondAttribuerOutcome: 0,
      subventionAttribuerOutcome: 0,
      fondRestantOutcome: 0,
      subventionRestantOutcome: 0,
    };
  },
  computed: {
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
    paginatedAndFilteredData() {
      const { paginatedData, totalFilteredItems } = $h.filterData({
        itemsPerPage: this.itemsPerPage,
        search: this.search,
        data: this.sousComposants,
        currentPage: this.currentPage,
        keys: ["nom"],
      });

      this.totalItems = totalFilteredItems;

      return paginatedData;
    },
    getPlageProjet() {
      let obj = null;

      if (this.projetId !== "") {
        obj = this.projets.find((item) => item.id === this.projetId);
      }

      return obj ? obj : null;
    },
    fontPropreRestantOutcome() {
      let totalBudgetUtilise = 0;

      // Parcours des souscomposants et somme des budgetNational
      if (this.sousComposants && this.sousComposants.length > 0) {
        this.sousComposants.forEach((sousComposant) => {
          totalBudgetUtilise += sousComposant.budgetNational ? sousComposant.budgetNational : 0;
        });
      }

      // Parcours des activités du composant et somme des budgetNational
      if (this.composantData && this.composantData.activites && this.composantData.activites.length > 0) {
        this.composantData.activites.forEach((activite) => {
          totalBudgetUtilise += activite.budgetNational ? activite.budgetNational : 0;
        });
      }

      // Soustraire du fond propre de l'outcome
      return (this.composantData?.budgetNational || 0) - totalBudgetUtilise;
    },
    SubventionRestantOutcome() {
      let totalPretUtilise = 0;

      // Parcours des souscomposants et somme des prets
      if (this.sousComposants && this.sousComposants.length > 0) {
        this.sousComposants.forEach((sousComposant) => {
          totalPretUtilise += sousComposant.pret ? sousComposant.pret : 0;
        });
      }

      // Parcours des activités du composant et somme des prets
      if (this.composantData && this.composantData.activites && this.composantData.activites.length > 0) {
        this.composantData.activites.forEach((activite) => {
          totalPretUtilise += activite.pret ? activite.pret : 0;
        });
      }

      // Soustraire de la subvention de l'outcome
      return (this.composantData?.pret || 0) - totalPretUtilise;
    },
  },
  watch: {
    projetId(newValue) {
      if (newValue) {
        this.loadProjetDetails(newValue);
      }
    },
    "selectedIds.composantId": "loadComposantDetails",
    
    // Watcher pour détecter les changements dans l'URL
    '$route.query': {
      handler(newQuery) {
        // Si on arrive avec des paramètres de navigation depuis les outcomes
        if (newQuery.projetId && newQuery.composantId) {
          this.projetId = newQuery.projetId;
          this.selectedIds.composantId = newQuery.composantId;
          
          // Afficher un message de confirmation du filtre
          if (newQuery.composantName) {
            toast.info(`Affichage des outputs pour l'outcome: ${newQuery.composantName}`);
          }
        }
      },
      immediate: true // Exécuter immédiatement au montage
    }
  },

  methods: {
    closeOutputDeleteModal(){
      document.activeElement.blur()
      this.showDeleteModal = false
    },
    mettreAjoutOutcome(id) {
      //alert("ok")
      this.selectedIds.composantId = id;
    },
    text() {},
    
    // Méthode pour effacer le filtre et retourner à la vue normale
    clearFilter() {
      // Réinitialiser les sélections
      this.selectedIds.composantId = "";
      this.projetId = "";
      
      // Supprimer les paramètres de l'URL
      this.$router.replace({
        name: 'OutPuts',
        query: {}
      });
      
      toast.success("Filtre effacé. Affichage de tous les outputs.");
    },
    
    // Méthode pour naviguer vers les activités avec filtre automatique
    navigateToActivities(outputId, outputName) {
      // Naviguer vers la page des activités avec les paramètres de l'output sélectionné
      this.$router.push({
        name: 'Activités',
        query: {
          projetId: this.projetId,
          composantId: this.selectedIds.composantId,
          sousComposantId: outputId,
          sousComposantName: outputName
        }
      });
    },
    onPageChanged(newPage) {
      this.currentPage = newPage;
      // Charger les données pour la page actuelle
      // this.loadDataForPage(newPage);
    },
    onItemsPerPageChanged(itemsPerPage) {
      this.itemsPerPage = itemsPerPage;
    },
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
    verifyPermission,
    supprimerComposant(data) {
      this.showDeleteModal = true;
      this.sousComposantId = data.id;
    },
    deleteComposants() {
      this.deleteLoader = true;
      ComposantesService.destroy(this.sousComposantId)
        .then((data) => {
          this.deleteLoader = false;
          this.showDeleteModal = false;
          toast.success("Suppression  éffectuée avec succès");
           
          if(this.selectedIds.composantId !== ''){
            this.loadComposantDetails();
          }
        
          this.getListeProjet();
        })
        .catch((error) => {
          this.deleteLoader = false;
          toast.error("Erreur lors de la suppression");
        });
    },
    modifierSousComposante(data) {
      this.messageErreur = {};
      this.labels = "Modifier";
      this.showModal = true;
      this.update = true;

      this.formData.nom = data.nom;
      this.formData.description = data.description;
      this.formData.poids = data.poids;
      this.formData.pret = data.pret;
      this.formData.composanteId = data.composanteId;
      this.formData.budgetNational = data.budgetNational;

      this.sousComposantId = data.id;
    },
    addSousComposants() {
      this.messageErreur = {};
      this.showModal = true;
      this.isUpdate = false;
      this.formData.composanteId = this.selectedIds.composantId;
      this.labels = "Ajouter";
    },
    sendForm() {
      if (this.update) {
        // this.formData.projetId = this.projetId.id
        this.isLoading = true;
        ComposantesService.update(this.sousComposantId, this.formData)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.update = false;
              this.isLoading = false;
              this.showModal = false;
              toast.success("Modification éffectuée");
              this.selectedIds.composantId = this.formData.composanteId;
              this.clearObjectValues(this.formData);

              this.loadComposantDetails();
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
        this.formData.budgetNational = parseInt(this.formData.budgetNational);
        this.formData.pret = parseInt(this.formData.pret);
        this.selectedIds.composantId = this.formData.composanteId;
        ComposantesService.create(this.formData)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.isLoading = false;
              toast.success("Ajout éffectué");
              this.showModal = false;
              this.clearObjectValues(this.formData);
              this.loadComposantDetails();

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
              toast.error(error.response.data.message);
            }
          });
      }
    },
    getListeProjet() {
      this.isLoadingData = true;

      ProjetService.get()
        .then((data) => {
          this.projets = data.data.data;
          if (Object.keys(this.projetId).length === 0) {
            this.projetId = this.projets[0];
          }

          this.getProjetById(this.projetId.id);
        })
        .catch((error) => {
          this.isLoadingData = false;
        });
    },
    cancel() {
      this.formData = {
        nom: "",
        poids: 0,
        pret: "",
        composanteId: "",
        budgetNational: 0,
      };
      document.activeElement.blur()
      this.showModal = false;
    },
    async loadProjets() {
      this.isLoadingData = true;

      try {
        const response = await ProjetService.get();
        this.projets = response.data.data;
        this.projetId = this.projets[0]?.id || "";
        this.isLoadingData = false;
      } catch (error) {
        this.isLoadingData = false;
      } finally {
        if (this.projetId == "") this.isLoadingData = false;
      }
    },
    async loadProjetDetails(projetId) {
      this.composants = [];
      this.sousComposants = [];
      // this.activites = [];
      this.isLoadingData = true;
      try {
        this.isLoadingData = false;
        const response = await ProjetService.getDetailProjet(projetId);
        this.composants = response.data.data.composantes;

        this.selectedIds.composantId = this.composants[0]?.id || "";

        // alert("ok");
      } catch (error) {
        this.isLoadingData = false;
      } finally {
        if (this.selectedIds.composantId == "") this.isLoadingData = false;
      }
    },
    async loadComposantDetails() {
      if (!this.selectedIds.composantId || this.selectedIds.composantId == "") return;
      this.isLoadingData = true;
      try {
        const response = await ComposantesService.detailComposant(this.selectedIds.composantId);

        this.composantData = response.data.data;

        this.fondPropreOutcome = this.composantData.budgetNational || 0;
        this.SubventionOutcome = this.composantData.pret || 0;

        // Étape 1 : Récupérer fondTotalOutcome et subventionTotalOutcome
        this.fondTotalOutcome = this.composantData.budgetNational || 0;
        this.subventionTotalOutcome = this.composantData.pret || 0;

        // Étape 2 : Calculer fondAttribuerOutcome (somme fondActivite + somme fondOutput)
        const sommeFondActivite = (this.composantData.activites || []).reduce((total, activite) => {
          return total + (activite.budgetNational || 0);
        }, 0);

        const sommeFondOutput = (this.composantData.souscomposantes || []).reduce((total, output) => {
          return total + (output.budgetNational || 0);
        }, 0);

        this.fondAttribuerOutcome = sommeFondActivite + sommeFondOutput;

        // Étape 3 : Calculer subventionAttribuerOutcome (somme subventionActivite + somme subventionOutput)
        const sommeSubventionActivite = (this.composantData.activites || []).reduce((total, activite) => {
          return total + (activite.pret || 0);
        }, 0);

        const sommeSubventionOutput = (this.composantData.souscomposantes || []).reduce((total, output) => {
          return total + (output.pret || 0);
        }, 0);

        this.subventionAttribuerOutcome = sommeSubventionActivite + sommeSubventionOutput;

        // Étape 4 : Calculer fondRestantOutcome (fondTotalOutcome - fondAttribuerOutcome)
        this.fondRestantOutcome = this.fondTotalOutcome - this.fondAttribuerOutcome;

        // Étape 5 : Calculer subventionRestantOutcome (subventionTotalOutcome - subventionAttribuerOutcome)
        this.subventionRestantOutcome = this.subventionTotalOutcome - this.subventionAttribuerOutcome;

        this.isLoadingData = false;
        // Mettre à jour les sous-composants et activités du composant
        this.sousComposants = this.composantData.souscomposantes || [];
      } catch (error) {
        this.isLoadingData = false;
      } finally {
        this.isLoadingData = false;
      }
    },

    filter() {},
  },

  created() {},
  async mounted() {
    await this.loadProjets();

    // this.getListeProjet();
  },
};
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">OutPut</h2>
  <!-- Filtre -->
  <div class="container px-4 mx-auto">
    <!-- Combined Filter Section -->
    <div class="relative p-6 mt-3 space-y-3 bg-white rounded-lg shadow-md">
      <h2 class="mb-4 text-base font-bold">Filtre</h2>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex col-span-12 md:col-span-6">
          <!-- :reduce="(projet) => projet.id" -->
          <TomSelect
            id="filtre-projets-outputs"
            name="filtre-projets-outputs"
            v-model="projetId"
            :options="{
              placeholder: 'Choisir un Output',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
          >
            <option value=""></option>
            <option v-for="(element, index) in projets" :key="index" :value="element.id">{{ element.codePta }} {{ element.nom }}</option>
          </TomSelect>
          <!-- <v-select class="w-full" v-model="projetId" label="nom" :options="projets">
            <template #search="{ attributes, events }">
              <input class="vs__search form-input" :required="!projetId" v-bind="attributes" v-on="events" />
            </template>
          </v-select> -->
          <label for="filtre-projets-outputs" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Projets</label>
        </div>
        <div class="flex col-span-12 md:col-span-6">
          <TomSelect
            id="filtre-outcomes-outputs"
            name="filtre-outcomes-outputs"
            v-model="selectedIds.composantId"
            :options="{
              placeholder: 'Choisir un Outcome',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
          >
            <option v-for="(element, index) in composants" :key="index" :value="element.id">{{ element.codePta }} {{ element.nom }}</option>
          </TomSelect>
          <label for="filtre-outcomes-outputs" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OUtComes</label>
        </div>
      </div>

      <!-- <button class="absolute px-4 py-2 text-white transform -translate-x-1/2 bg-blue-500 rounded -bottom-3 left-1/2" @click="filter()">Filtrer</button> -->
    </div>
    
    <!-- Indicateur de filtre actif -->
    <div v-if="$route.query.composantName" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-blue-700 font-medium">
            Filtre actif: Outputs de l'outcome "{{ $route.query.composantName }}"
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
          <input id="recherche-outputs" name="recherche-outputs" type="text" v-model="search" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div v-if="verifyPermission('creer-un-output')" class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="addSousComposants()"><PlusIcon class="w-4 h-4 mr-3" />Ajouter un Output</button>
      </div>
    </div>
  </div>

  <LoaderSnipper v-if="isLoadingData" />

  <div v-if="!isLoadingData" class="grid grid-cols-12 gap-6 mt-5">
    <!-- BEGIN: Users Layout -->

    <NoRecordsMessage class="col-span-12" v-if="!paginatedAndFilteredData.length" title="Aucun output trouvé" description="Il semble qu'il n'y ait pas d'output à afficher. Veuillez en créer un. " />

     <div v-for="(item, index) in paginatedAndFilteredData" :key="index" 
           class="col-span-12 intro-y p-2 sm:p-3 md:p-4 md:col-span-6 xl:col-span-4">
          <div
            v-if="verifyPermission('voir-un-output')"
            class="bg-white border-l-4 border-primary rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transform transition duration-300 cursor-pointer flex flex-col h-full"
          >
            <!-- En-tête -->
            <div class="relative flex items-start justify-between p-4">
              <div class="flex items-center gap-4 cursor-pointer" @click.stop="navigateToActivities(item.id, item.nom)" title="Voir les activités de cet output">
                <div
                  class="flex items-center justify-center w-20 h-20 rounded-full bg-primary text-white font-semibold shadow-md flex-shrink-0"
                >
                  {{ item.codePta }}
                </div>
                <div class="flex flex-col">
                  <h3 class="text-xs sm:text-sm md:text-base font-semibold text-gray-800 hover:text-primary break-words break-all w-11/12">
                    {{ item.nom }}
                  </h3>
                </div>
              </div>

              <!-- Menu -->
              <Dropdown class="absolute top-3 right-3">
                <DropdownToggle tag="a" href="javascript:;" class="block w-5 h-5">
                  <MoreVerticalIcon class="w-5 h-5 text-slate-500" />
                </DropdownToggle>
                <DropdownMenu class="w-40">
                  <DropdownContent>
                    <DropdownItem v-if="verifyPermission('modifier-un-output')" @click="modifierSousComposante(item)">
                      <Edit2Icon class="w-4 h-4 mr-2" /> Modifier
                    </DropdownItem>
                    <DropdownItem v-if="verifyPermission('supprimer-un-output')" @click="supprimerComposant(item)">
                      <TrashIcon class="w-4 h-4 mr-2" /> Supprimer
                    </DropdownItem>
                  </DropdownContent>
                </DropdownMenu>
              </Dropdown>
            </div>

            <!-- Corps avec scroll interne -->
            <div class="flex flex-col flex-grow p-4 border-t">
              <!-- Description -->
              <div class="mb-4">
                <p class="text-primary font-semibold mb-2">Description</p>
                <p class="text-sm text-gray-600 bg-gray-50 p-2 rounded shadow-sm">
                  {{ item.description || "Aucune description" }}
                </p>
              </div>

              <!-- Section fixe en bas: Budget et statut -->
              <div class="space-y-2 text-gray-700 text-sm flex-shrink-0">
                <div class="flex items-center">
                  <LinkIcon class="w-4 h-4 mr-2 text-primary" />
                  Fonds propre :
                  <span class="font-semibold ml-1">{{
                    $h.formatCurrency(item.budgetNational || 0)
                  }}</span>
                  <span class="italic ml-1">Fcfa</span>
                </div>

                <div class="flex items-center">
                  <LinkIcon class="w-4 h-4 mr-2 text-primary" />
                  Subvention :
                  <span class="font-semibold ml-1">{{
                    $h.formatCurrency(item.pret || 0)
                  }}</span>
                  <span class="italic ml-1">Fcfa</span>
                </div>

                <div class="flex items-center">
                  <CheckSquareIcon class="w-4 h-4 mr-2 text-primary" />
                  Statut :
                  <span class="ml-1 font-semibold">{{
                    item.statut == -2
                      ? "Non validé"
                      : item.statut == -1
                      ? "Pas démarré"
                      : item.statut == 0
                      ? "En cours"
                      : item.statut == 1
                      ? "En retard"
                      : "Terminé"
                  }}</span>
                </div>
              </div>
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
  <!-- END: Users Layout -->

  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!update" class="mr-auto text-base font-medium">Ajouter un Output</h2>
      <h2 v-else class="mr-auto text-base font-medium">Modifier un Output</h2>
    </ModalHeader>
     <form @submit.prevent="sendForm">
        <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
          <InputForm
            id="nom-output"
            name="nom"
            v-model="formData.nom"
            class="col-span-12 mt-4"
            type="text"
            required="required"
            label="Nom"
          />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>

          <div class="input-form mt-3 col-span-12">
            <label for="description-output" class="form-label w-full"> Description </label>
            <textarea
              id="description-output"
              name="description"
              v-model="formData.description"
              class="form-control w-full"
              placeholder="Ajouter une description"
            ></textarea>
          </div>

          <InputForm
            id="budget-national-output"
            name="budgetNational"
            v-model="formData.budgetNational"
            class="col-span-12 mt-4 no-spin"
            type="number"
            required="required"
            placeHolder="Ex : 2"
            label="Fond propre"
          />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.budgetNational">{{ messageErreur.budgetNational }}</p>

          <InputForm
            id="pret-output"
            name="pret"
            v-model="formData.pret"
            class="col-span-12 mt-4 no-spin"
            type="number"
            required="required"
            placeHolder="Fond propre"
            label="Subvention"
          />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.pret">{{ messageErreur.pret }}</p>

          <!-- <pre>{{ formData.composanteId }}</pre> -->
          <div class="flex col-span-12 mt-4">
            <TomSelect
              id="outcome-output"
              name="composanteId"
              @change="mettreAjoutOutcome(formData.composanteId)"
              v-model="formData.composanteId"
              :options="{
                placeholder: 'Choisir un Outcome',
                create: false,
                onOptionAdd: text(),
              }"
              class="w-full"
            >
              <option value=""></option>
              <option v-for="(element, index) in composants" :key="index" :value="element.id">{{ element.codePta }} {{ element.nom }}</option>
            </TomSelect>

            <label for="outcome-output" class="absolute z-10 px-3 ml-1 text-sm font-bold duration-100 ease-linear -translate-y-3 bg-white _font-medium form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">OutComes</label>
          </div>
          <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.composanteId">{{ messageErreur.composanteId }}</p>

          <div v-if="getPlageProjet" class="flex items-center mt-2 col-span-12">
            <ClockIcon class="w-4 h-4 mr-2" />
            <div>
              Durée du projet : Du <span class="pr-1 font-bold"> {{ $h.reformatDate(getPlageProjet.debut) }}</span> au <span class="font-bold"> {{ $h.reformatDate(getPlageProjet.fin) }}</span>
            </div>
          </div>
          
          <!-- Affiche fondRestantOutcome et subventionRestantOutcome-->
          <div class="col-span-12 mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Budget disponible (Outcome)</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <p class="text-xs text-gray-500">Fond propre restant</p>
                <p class="text-lg font-bold" :class="fondRestantOutcome >= 0 ? 'text-green-600' : 'text-red-600'">{{ fondRestantOutcome === 0 ? "0" : $h.formatCurrency(fondRestantOutcome) }} FCFA</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-500">Subvention restante</p>
                <p class="text-lg font-bold" :class="subventionRestantOutcome >= 0 ? 'text-green-600' : 'text-red-600'">{{ subventionRestantOutcome === 0 ? "0" : $h.formatCurrency(subventionRestantOutcome) }} FCFA</p>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div class="flex items-center justify-center">
            <button type="button" @click="cancel" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
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
        <div class="mt-2 text-slate-500">Voulez vous supprimer l'organisation ? <br />Cette action ne peut être annulé</div>
      </div>
      <div class="flex gap-2 px-5 pb-8 text-center">
        <button type="button" @click="closeOutputDeleteModal" class="w-full my-3 mr-1 btn btn-outline-secondary">Annuler</button>
        <VButton :loading="deleteLoader" label="Supprimer" @click="deleteComposants" />
      </div>
    </ModalBody>
  </Modal>
</template>

<style>
.no-spin {
  /* Cacher les icônes pour Chrome, Edge, et Safari */
  -webkit-appearance: none;
  margin: 0;

  /* Cacher les icônes pour Firefox */
  -moz-appearance: textfield;

  /* Compatibilité supplémentaire */
  appearance: none;

  /* Optionnel : personnaliser les styles du champ */
  /* border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px; */
}
</style>
