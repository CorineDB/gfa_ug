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
import { update } from "lodash";
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
      search: "",
      isLoadingOutcome: true,
      itemsPerPage: 3, // Nombre d'éléments par page
      totalItems: 0,
      currentPage: 1, // Page courante
      messageErreur: {},
      projets: [],
      projetId: "",
      composants: [],
      isLoadingData: false,
      showModal: false,
      isUpdate: false,
      update:false,
      isLoading: false,
      formData: {
        nom: "",
        description: "",
        poids: 0,
        projetId: "",
        pret: 0,
        budgetNational: 0,
      },
      composantsId: "",
      labels: "Ajouter",
      showDeleteModal: false,
      deleteLoader: false,
      fondPropreProjet: 0,
      SubventionProjet: 0,
      // fondRestant: 0,
      // subventionRestant: 0,
    };
  },
  computed: {
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
    paginatedAndFilteredData() {
      const { paginatedData, totalFilteredItems } = $h.filterData({
        itemsPerPage: this.itemsPerPage,
        search: this.search,
        data: this.composants,
        currentPage: this.currentPage,
        keys: ["nom"],
      });

      // Mettre à jour le total pour recalculer la pagination
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
     
    getBudgetRestant() {
      return this.budgetRestant;
    },
    fondRestant() {
      let totalFondUtilise = 0;


      if (this.composants.length == 0) {
        return this.fondPropreProjet;
      }

      this.composants.forEach((item) => {
        totalFondUtilise += item.budgetNational ? item.budgetNational : 0;
      });

      return this.fondPropreProjet - totalFondUtilise;
    },
    subventionRestant() {
      let totalSubventionUtilise = 0;


      if (this.composants.length == 0) {
        return this.SubventionProjet;
      }

      this.composants.forEach((item) => {
        totalSubventionUtilise += item.pret ? item.pret : 0;
      });

      return this.SubventionProjet - totalSubventionUtilise;
    },
  },
  watch: {
    projetId(newValue, oldValue) {
      if (this.projets.length > 0) {
        if (newValue == "") {
          this.composants = this.projets[0].composantes;
        } else {
          const projetFiltre = this.projets.filter((item) => item.id == newValue);

          if (projetFiltre.length > 0) {
            this.composants = projetFiltre[0].composantes;
          } else {
            this.composants = [];
          }
        }
      }
    },
  },

  methods: {
    closeDeleteOutputModal(){
     document.activeElement.blur();
     this.showDeleteModal = false
    },
    text() {},
    cancel() {
      this.formData = {
        nom: "",
        poids: 0,
        projetId: "",
        pret: 0,
        budgetNational: 0,
      };
      document.activeElement.blur();
      this.showModal = false;
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
      this.composantsId = data.id;
    },

    deleteComposants() {
      this.deleteLoader = true;
      ComposantesService.destroy(this.composantsId)
        .then((data) => {
          this.deleteLoader = false;
          this.showDeleteModal = false;
          toast.success("Suppression  éffectuée avec succès");
          this.getListeProjet();
        })
        .catch((error) => {
          this.deleteLoader = false;
          toast.error("Erreur lors de la suppression");
        });
    },
    
    modifierComposante(data) {
       
      this.messageErreur = {};
      this.labels = "Modifier";
      this.showModal = true;
      
      this.update = true;
      this.formData.nom = data.nom;
      this.formData.description = data.description;
      this.formData.poids = data.poids;
      this.formData.pret = data.pret ?? "";
      this.formData.projetId = data.projetId;
      this.formData.budgetNational = data.budgetNational;
      this.composantsId = data.id;
    },
    addComposants() {
      this.messageErreur = {};
      this.showModal = true;
      this.isUpdate = false;
      this.formData.projetId = this.projetId;
      this.labels = "Ajouter";
      
    },
    sendForm() {

      if (this.update) {
        ComposantesService.update(this.composantsId, this.formData)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.update = false;
              this.isLoading = false;
              this.showModal = false;
              toast.success("Modification éffectuée");
              this.formData.projetId = this.projetId;

              this.clearObjectValues(this.formData);
              this.getListeProjet();
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
              //
            }
          });
      } else {
        this.isLoading = true;
        this.formData.budgetNational = parseInt(this.formData.budgetNational);
        this.formData.pret = parseInt(this.formData.pret);
        ComposantesService.create(this.formData)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.isLoading = false;
              toast.success("Ajout éffectué");
              this.showModal = false;
              this.clearObjectValues(this.formData);

              this.getListeProjet();
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
      this.isLoadingOutcome = true;
      ProjetService.get()
        .then((data) => {
          this.projets = data.data.data;
          this.fondPropreProjet;
          this.getProjetById();
        })
        .catch((error) => {
          this.isLoadingOutcome = false;
        });
    },
    getProjetById() {
      if (this.projetId == "") {
        this.projetId = this.projets[0].id;
        this.fondPropreProjet = this.projets[0].budgetNational;
        this.SubventionProjet = this.projets[0].pret;

      }

      ProjetService.getDetailProjet(this.projetId)
        .then((data) => {
          this.composants = data.data.data.composantes;
          this.fondPropreProjet = data.data.data.budgetNational;
          this.SubventionProjet = data.data.data.pret;

          // this.fondRestant
          // this.subventionRestant

          this.isLoadingOutcome = false;
        })
        .catch((error) => {
          this.isLoadingOutcome = false;
        });
    },
    getListeComposants(data) {
      this.composants = data.composantes;
    },
    filter() {},
    
    // Méthode pour naviguer vers les outputs avec filtre automatique
    navigateToOutputs(outcomeId, outcomeName) {
      // Naviguer vers la page des outputs avec les paramètres de l'outcome sélectionné
      this.$router.push({
        name: 'OutPuts',
        query: {
          projetId: this.projetId,
          composantId: outcomeId,
          composantName: outcomeName
        }
      });
    },
  },

  created() {},
  mounted() {
    this.getListeProjet();
  },
};
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">OutComes</h2>

  <!-- Filtre -->
  <div class="container px-4 mx-auto">
    <!-- Combined Filter Section -->
    <div class="relative p-6 mt-3 space-y-3 bg-white rounded-lg shadow-md">
      <h2 class="mb-4 text-base font-bold">Filtre</h2>

      <div class="grid grid-cols-3 gap-4">
        <div class="flex col-span-12">
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
            <option value=""></option>
            <option v-for="(element, index) in projets" :key="index" :value="element.id">{{ element.codePta }} - {{ element.nom }}</option>
          </TomSelect>
        </div>
      </div>
    </div>
  </div>

  <!-- Titre de la page -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y">
      <div class="w-auto">
        <div class="relative w-56 text-slate-500">
          <input type="text" v-model="search" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div v-if="verifyPermission('creer-un-outcome')" class="flex mt-4 sm:mt-0">
        <button class="mr-2 shadow-md btn btn-primary" @click="addComposants()"><PlusIcon class="w-4 h-4 mr-3" />Ajouter un OutCome</button>
      </div>
    </div>
  </div>

  <LoaderSnipper v-if="isLoadingOutcome" />
  <div v-if="!isLoadingOutcome" class="grid grid-cols-12 gap-6 mt-5">
    <NoRecordsMessage class="col-span-12" v-if="!paginatedAndFilteredData.length" title="Aucun outCome trouvée" description="Il semble qu'il n'y ait pas d'outComes à afficher. Veuillez en créer un. " />
     <div v-for="(item, index) in paginatedAndFilteredData" :key="index" 
     class="col-span-12 p-2 sm:p-3 md:p-4 lg:col-span-6 xl:col-span-4">
  <div
    v-if="verifyPermission('voir-un-outcome')"
    class="p-3 sm:p-4 lg:p-5 transition-all duration-300 bg-white border-l-4 rounded-lg shadow-lg box border-primary hover:scale-[1.02] hover:bg-gray-50 cursor-pointer"
    title="Cliquer pour voir les outputs de cet outcome"
  >
    <!-- En-tête avec sigle et titre -->
    <div class="relative flex items-start p-4">
      <div class="flex items-center gap-3 sm:gap-4 cursor-pointer"    @click.stop="navigateToOutputs(item.id, item.nom)" >
        <!-- Circle with initial or image -->
        <div class="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-xs sm:text-sm md:text-base text-white rounded-full shadow-md bg-primary flex-shrink-0">
          {{ item.codePta }}
        </div>
        
        <div class="flex flex-col flex-1 min-w-0">
          <!-- Item details -->
          <h3 class="text-xs sm:text-sm md:text-base font-semibold text-gray-800 hover:text-primary break-words break-all w-11/12">
            {{ item.nom }}
          </h3>
          
          <!-- Bouton Voir Outputs avec le même style que "Tâches" -->
          <!-- <button
            @click.stop="navigateToOutputs(item.id, item.nom)"
            class="mt-2 px-3 py-1.5 bg-primary text-white rounded-md text-xs flex items-center gap-2 hover:bg-primary/90 shadow w-fit"
            title="Voir les outputs de cet outcome"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            Voir Outputs
          </button> -->
        </div>
      </div>
      <!-- Dropdown for actions -->
      <Dropdown class="absolute top-0 right-0 mt-1 sm:mt-2 mr-1 sm:mr-2">
        <DropdownToggle tag="a" class="block w-4 h-4 sm:w-5 sm:h-5 cursor-pointer">
          <MoreVerticalIcon class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-colors hover:text-gray-600" />
        </DropdownToggle>
        <DropdownMenu class="w-32 sm:w-36 md:w-40 bg-white rounded-md shadow-lg z-10">
          <DropdownContent>
            <DropdownItem v-if="verifyPermission('modifier-un-outcome')" @click="modifierComposante(item)" class="text-xs sm:text-sm">
              <Edit2Icon class="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-600" /> Modifier
            </DropdownItem>
            <DropdownItem v-if="verifyPermission('supprimer-un-outcome')" @click="supprimerComposant(item)" class="text-xs sm:text-sm">
              <TrashIcon class="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-red-500" /> Supprimer
            </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
    </div>

    <!-- Description section with distinct styling -->
    <div class="mt-4 sm:mt-5 lg:mt-6">
      <p class="mb-2 sm:mb-3 text-base sm:text-lg font-semibold text-primary text-center lg:text-left">Description</p>
      <p class="p-2 sm:p-3 text-sm sm:text-base text-gray-600 rounded-lg shadow-sm bg-gray-50 min-h-[60px] sm:min-h-[80px] flex items-center justify-center">
        {{ item.description == null ? "Aucune description" : item.description }}
      </p>

      <!-- Other details with iconized section headers -->
      <div class="mt-4 sm:mt-5 space-y-2 sm:space-y-3 text-gray-600">
        <div class="flex items-center text-sm sm:text-base">
          <LinkIcon class="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
          <span class="truncate">Fonds propre: {{ item.budgetNational == null || item.budgetNational == 0 ? 0 : $h.formatCurrency(item.budgetNational) }}</span>
          <div class="ml-1 sm:ml-2 italic font-bold text-xs sm:text-sm flex-shrink-0">Fcfa</div>
        </div>

        <div class="flex items-center text-sm sm:text-base">
          <LinkIcon class="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
          <span class="truncate">Subvention: {{ item.pret == null || item.pret == 0 ? 0 : $h.formatCurrency(item.pret) }}</span>
          <div class="ml-1 sm:ml-2 italic font-bold text-xs sm:text-sm flex-shrink-0">Fcfa</div>
        </div>

        <div class="flex items-center text-xs sm:text-sm font-medium text-gray-700">
          <CheckSquareIcon class="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-primary flex-shrink-0" />
          Statut:
          <span v-if="item.statut == -2" class="ml-1 sm:ml-2 text-gray-900 truncate">Non validé</span>
          <span v-else-if="item.statut == -1" class="ml-1 sm:ml-2 text-gray-900 truncate">Pas démarré</span>
          <span v-else-if="item.statut == 0" class="ml-1 sm:ml-2 text-gray-900 truncate">En cours</span>
          <span v-else-if="item.statut == 1" class="ml-1 sm:ml-2 text-gray-900 truncate">En retard</span>
          <span v-else-if="item.statut == 2" class="ml-1 sm:ml-2 text-gray-900 truncate">Terminé</span>
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
  <LoaderSnipper v-if="isLoadingData" />

  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!update" class="mr-auto text-base font-medium">Ajouter un Outcome</h2>
      <h2 v-else class="mr-auto text-base font-medium">Modifier un OutCome</h2>
    </ModalHeader>
    <form @submit.prevent="sendForm">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <InputForm v-model="formData.nom" class="col-span-12" type="text" required="required" placeHolder="Nom de l'organisation" label="Nom" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>

        <div class="input-form mt-3 col-span-12">
          <label for="validation-form-6" class="form-label w-full"> Description </label>
          <textarea v-model="formData.description" class="form-control w-full" name="comment" placeholder="Ajouter une description"></textarea>
        </div>

        <InputForm v-model="formData.budgetNational" class="col-span-12 no-spin" type="number" required="required" placeHolder="Ex : 2" label="Fond propre" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.budgetNational">{{ messageErreur.budgetNational }}</p>

        <InputForm v-model="formData.pret" class="col-span-12" type="number" required="required" placeHolder="Ex : 2" label="Subvention" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.pret">{{ messageErreur.pret }}</p>

        <div class="flex col-span-12 mt-4">
          <label for="_input-wizard-10" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Projets</label>
          <TomSelect
            v-model="formData.projetId"
            :options="{
              placeholder: 'Choisir un Output',
              create: false,
              onOptionAdd: text(),
            }"
            class="w-full"
          >
            <option value="">Choisir un projet</option>
            <option v-for="(element, index) in projets" :key="index" :value="element.id">{{ element.codePta }} - {{ element.nom }}</option>
          </TomSelect>
        </div>
        <div v-if="getPlageProjet" class="flex items-center mt-2 col-span-12">
          <ClockIcon class="w-4 h-4 mr-2" />
          <div>
            Durée du projet : Du <span class="pr-1 font-bold"> {{ $h.reformatDate(getPlageProjet.debut) }}</span> au <span class="font-bold"> {{ $h.reformatDate(getPlageProjet.fin) }}</span>
          </div>
        </div>

        <div class="col-span-12 mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Budget disponible</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center">
              <p class="text-xs text-gray-500">Fond propre restant</p>

              <p class="text-lg font-bold" :class="fondRestant >= 0 ? 'text-green-600' : 'text-red-600'">{{ fondRestant === 0 ? "0" : $h.formatCurrency(fondRestant) }} FCFA</p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500">Subvention restante</p>
              <p class="text-lg font-bold" :class="subventionRestant >= 0 ? 'text-green-600' : 'text-red-600'">{{ subventionRestant === 0 ? "0" : $h.formatCurrency(subventionRestant) }} FCFA</p>
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
        <div class="mt-2 text-slate-500">Voulez vous supprimer l'outcome ? <br />Cette action ne peut être annulé</div>
      </div>
      <div class="flex gap-2 px-5 pb-8 text-center">
        <button type="button" @click="closeDeleteOutputModal" class="w-full my-3 mr-1 btn btn-outline-secondary">Annuler</button>
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
