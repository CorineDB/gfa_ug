
<template>
  <div class="flex w-full gap-2">
    <!-- Side Menu -->
    <Transition name="menu">
      <section :class="[showMenu ? 'translate-x-0 w-[30%] border-r-2' : '-translate-x-full w-0']" class="h-screen pt-[130px] pr-1 overflow-y-auto transition-transform duration-300 transform menu-crud">
        <div :class="['transition-all', showMenu ? '' : 'hidden']">
          <AccordionGroup :selectedIndex="null" class="space-y-1">
            <AccordionItem>
              <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between"><p>Unité de Mesure</p><ChevronsDown /></Accordion>
              <AccordionPanel class="p-2"><UniteMesure @update-datas="getUnites" v-model:showModal="showModalUniteMesure" /></AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between"><p>Clé valeur</p><ChevronsDown /></Accordion>
              <AccordionPanel class="p-2"><CleValeur @update-datas="getKeys" v-model:showModal="showModalKey" /></AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between"><p>Catégorie</p><ChevronsDown /></Accordion>
              <AccordionPanel class="p-2"><ManagmentCategorie @update-datas="getCategories" v-model:showModal="showModalCategorie" /></AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between"><p>Zone d'intervention</p><ChevronsDown /></Accordion>
              <AccordionPanel class="p-2"><ManagmentSite @update-datas="getSites" v-model:showModal="showModalZone" /></AccordionPanel>
            </AccordionItem>
          </AccordionGroup>
        </div>
      </section>
    </Transition>

    <!-- Main Content -->
    <section :class="[showMenu ? 'w-[70%]' : 'w-[100%]']" class="pt-5">
      <button class="text-sm btn" @click="displayMenu">
        <ChevronsLeft class="mr-1 size-3" />{{ showMenu ? "Cacher le menu" : "Afficher le menu" }}
      </button>

      <div class="flex items-center justify-between gap-2 my-2">
        <h2 class="text-lg font-medium intro-y">Liste des indicateurs shjds</h2>
        <div v-if="verifyPermission('voir-un-indicateur')" class="flex items-center justify-end gap-2">
          <button class="text-base btn btn-primary" @click="openCreateModal">
            <Plus class="mr-1 size-4" />Ajouter
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="grid grid-cols-12 gap-6 mt-5">
        <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
          <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div class="relative w-56 text-slate-500">
              <input type="text" v-model="search" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
              <Search class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
            </div>
          </div>
        </div>
      </div>

      <!-- Tables and Pagination -->
      <div>
        <LoaderSnipper v-if="isLoadingDataCadre" />
        <TabulatorCadreMesure v-else :data="dataAvailable" :unites="unites" :categories="categories" :years="annees" :ongs="responsables" :ugs="ugs" :prop-sites="sites" @update-datas="getDatasCadre" @refreshData="refreshDatasCadreSilently" @edit-indicator="openEditModal" />

        <!-- <h2 class="mt-8 text-lg font-medium intro-y">Nouveau Cadre de Mesure (Refactored)</h2>
        <CadreDeMesure v-if="!isLoadingDataCadre" :data="dataAvailable" :unites="unites" :categories="categories" :years="annees" :ongs="responsables" :ugs="ugs" :prop-sites="sites" @update-datas="getDatasCadre" @refreshData="refreshDatasCadreSilently" @edit-indicator="openEditModal" />
        <LoaderSnipper v-else /> -->

        <div v-if="!isLoadingDataCadre && verifyPermission('voir-un-indicateur')" class="flex justify-center gap-3 my-8">
            <!-- Pagination controls -->
        </div>
      </div>
    </section>

    <!-- Reusable Indicator Form Modal -->
    <IndicatorForm
      :show="showModalCreate"
      @update:show="showModalCreate = $event"
      @submit="handleSubmit"
      :is-create="!isEditMode"
      :initial-data="currentIndicator"
      :categories="categories"
      :unites="unites"
      :keys="keys"
      :ugs="ugs"
      :responsables="responsables"
      :sites="sites"
      :annees="annees"
    />

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { toast } from "vue3-toastify";
import { getAllErrorMessages } from "@/utils/gestion-error";
import CategoriesService from "@/services/modules/categorie.service";
import OngService from "@/services/modules/ong.service";
import SiteService from "@/services/modules/site.service";
import UniteeDeMesureService from "@/services/modules/unitee.mesure.service";
import IndicateurValueKeys from "@/services/modules/key.value.service";
import AuthService from "@/services/modules/auth.service";
import ResultatCadreRendementService from "@/services/modules/resultat.cadre.rendement.service";
import IndicateursService from "@/services/modules/indicateur.service";
import verifyPermission from "@/utils/verifyPermission";

// Import Components
import CleValeur from "@/components/create-indicateur/CleValeur.vue";
import ManagmentCategorie from "@/components/create-indicateur/ManagmentCategorie.vue";
import ManagmentSite from "@/components/create-indicateur/ManagmentSite.vue";
import UniteMesure from "@/components/create-indicateur/UniteMesure.vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import CadreDeMesure from "@/components/CadreDeMesure.vue";
import TabulatorCadreMesure from "@/components/TabulatorCadreMesure.vue";
import IndicatorForm from "@/components/forms/IndicatorForm.vue";
import { ChevronsLeft, Plus, Search, ChevronsDown, ChevronsRight } from "lucide-vue-next";

// Page-specific state
const cadreRendement = ref([]);
const isLoadingDataCadre = ref(false);
const idProgramme = ref("");
const debutProgramme = ref("");
const finProgramme = ref("");
const search = ref("");
const currentPage = ref(1);
const itemsPerPage = 2;
const showMenu = ref(false);

// Data for props
const categories = ref([]);
const responsables = ref([]);
const ugs = ref([]);
const sites = ref([]);
const unites = ref([]);
const keys = ref([]);

// Modal visibility
const showModalCreate = ref(false);
const showModalZone = ref(false);
const showModalCategorie = ref(false);
const showModalUniteMesure = ref(false);
const showModalKey = ref(false);

// Edit state
const isEditMode = ref(false);
const currentIndicator = ref(null);

// Errors from backend
const formErrors = ref({});

// --- DATA FETCHING ---
const getDatasCadre = async () => {
  isLoadingDataCadre.value = true;
  try {
    const { data } = await ResultatCadreRendementService.getCadreRendement(idProgramme.value);
    cadreRendement.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données du cadre.");
  } finally {
    isLoadingDataCadre.value = false;
  }
};

const refreshDatasCadreSilently = async () => {
  try {
    const { data } = await ResultatCadreRendementService.getCadreRendement(idProgramme.value);
    cadreRendement.value = data.data;
  } catch (e) { console.error(e); }
};

const getCategories = async () => {
  try {
    const { data } = await CategoriesService.get();
    categories.value = data.data;
  } catch (e) { toast.error("Erreur lors de la récupération des categories."); }
};

const getResponsables = async () => {
  try {
    const { data } = await OngService.get();
    responsables.value = data.data.filter((ong) => ong.type !== "autre_osc" && (ong.projet !== null));
  } catch (e) { toast.error("Erreur lors de la récupération des organisations."); }
};

const getSites = async () => {
  try {
    const { data } = await SiteService.get();
    sites.value = data.data;
  } catch (e) { toast.error("Erreur lors de la récupération des sites."); }
};

const getUnites = async () => {
    try {
        const { data } = await UniteeDeMesureService.get();
        unites.value = data.data;
    } catch (e) { toast.error("Erreur lors de la récupération des unités."); }
};

const getKeys = async () => {
  try {
    const { data } = await IndicateurValueKeys.get();
    keys.value = data.data;
  } catch (e) { toast.error("Erreur lors de la récupération des clés."); }
};

const getcurrentUser = async () => {
  isLoadingDataCadre.value = true;
  try {
    const result = await AuthService.getCurrentUser();
    ugs.value.push({ id: result.data.data.profil.id, nom: result.data.data.profil.nom });
    idProgramme.value = result.data.data.programme.id;
    debutProgramme.value = result.data.data.programme.debut;
    finProgramme.value = result.data.data.programme.fin;
  } catch (e) {
    toast.error("Une erreur est survenue: Utilisateur connecté .");
  }
};

// --- COMPUTED & PAGINATION ---
const annees = computed(() => {
  if (!debutProgramme.value || !finProgramme.value) return [];
  let anneeDebut = parseInt(debutProgramme.value.split("-")[0], 10);
  let anneeFin = parseInt(finProgramme.value.split("-")[0], 10);
  let years = [];
  for (let annee = anneeDebut; annee <= anneeFin; annee++) {
    years.push(annee);
  }
  return years;
});

const totalPages = computed(() => Math.ceil((cadreRendement.value?.length || 0) / itemsPerPage));
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return cadreRendement.value?.slice(start, end) || [];
});

const datasSearch = computed(() => {
  if (!search.value || !cadreRendement.value) return cadreRendement.value || [];
  return cadreRendement.value
    .map((group) => {
      const filteredIndicateurs = group.indicateurs.filter((indicateur) => indicateur.nom.toLowerCase().includes(search.value.toLowerCase()));
      return filteredIndicateurs.length > 0 ? { ...group, indicateurs: filteredIndicateurs } : null;
    })
    .filter((group) => group !== null);
});

const dataAvailable = computed(() => {
  return search.value ? datasSearch.value : paginatedData.value;
});

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const goToPage = (page) => { currentPage.value = page; };

// --- ACTIONS ---
const displayMenu = () => { showMenu.value = !showMenu.value; };

// ANCIENNE VERSION - Ouverture simple
// const openCreateModal = () => { showModalCreate.value = true; };

// NOUVELLE VERSION - Ouverture en mode création
const openCreateModal = () => {
  isEditMode.value = false;
  currentIndicator.value = null;
  showModalCreate.value = true;
};

// NOUVELLE FONCTION - Ouverture en mode édition
const openEditModal = (indicator) => {
  isEditMode.value = true;
  currentIndicator.value = indicator;
  showModalCreate.value = true;
};

const isSubmitting = ref(false);

// ANCIENNE VERSION - Seulement création
// const handleCreateSubmit = async ({ payload, onSuccess, onError }) => {
//   if (isSubmitting.value) return;
//   isSubmitting.value = true;
//   formErrors.value = {};
//   try {
//     await IndicateursService.create(payload);
//     toast.success(`Indicateur créé avec succès.`);
//     refreshDatasCadreSilently();
//     showModalCreate.value = false;
//     if (onSuccess) onSuccess();
//   } catch (e) {
//     if (e.response && e.response.status === 422) {
//       formErrors.value = e.response.data.errors || {};
//       if (onError) onError(formErrors.value);
//     } else {
//       toast.error(getAllErrorMessages(e));
//       if (onError) onError({});
//     }
//     console.error(e);
//   } finally {
//     isSubmitting.value = false;
//   }
// };

// NOUVELLE VERSION - Création et modification
const handleSubmit = async ({ payload, onSuccess, onError }) => {
  // Garde contre double soumission
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  formErrors.value = {}; // Réinitialiser les erreurs

  try {
    // Appeler create ou update selon le mode
    if (isEditMode.value && currentIndicator.value) {
      // ANCIENNE VERSION : await IndicateursService.update(currentIndicator.value.id, payload);
      // NOUVELLE VERSION : Utiliser updateComplet pour l'endpoint complet
      await IndicateursService.updateComplet(currentIndicator.value.id, payload);
      toast.success(`Indicateur modifié avec succès.`);
    } else {
      await IndicateursService.create(payload);
      toast.success(`Indicateur créé avec succès.`);
    }

    refreshDatasCadreSilently();
    showModalCreate.value = false;
    // Notifier le formulaire du succès
    if (onSuccess) onSuccess();
  } catch (e) {
    // Si erreur de validation (422), injecter les erreurs dans le formulaire
    if (e.response && e.response.status === 422) {
      formErrors.value = e.response.data.errors || {};
      // Notifier le formulaire des erreurs
      if (onError) onError(formErrors.value);
    } else {
      // Autre erreur
      toast.error(getAllErrorMessages(e));
      if (onError) onError({});
    }
    console.error(e);
  } finally {
    isSubmitting.value = false;
  }
};

// --- LIFECYCLE ---
onMounted(async () => {
  await getcurrentUser();
  getDatasCadre();
  getCategories();
  getResponsables();
  getSites();
  getUnites();
  getKeys();
});

</script>

<style scoped>
.menu-enter-active, .menu-leave-active { transition: opacity 0.5s ease; }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateX(-30px); }
.truncate-option { display: inline-block; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
