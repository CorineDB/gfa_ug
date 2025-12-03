
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
        <h2 class="text-lg font-medium intro-y">Dashboard des Indicateurs</h2>
        <div v-if="verifyPermission('voir-un-indicateur')" class="flex items-center justify-end gap-2">
          <button class="text-base btn btn-primary" @click="openCreateModal">
            <Plus class="mr-1 size-4" />Ajouter
          </button>
        </div>
      </div>

      <!-- Section Statistiques KPI simplifiée -->
      <div class="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4 intro-y">
        <div class="report-box zoom-in">
          <div class="box p-5">
            <div class="flex">
              <div class="flex-none w-2/4 2xl:w-3/4">
                <div class="text-lg font-semibold leading-8">{{ totalIndicators }}</div>
                <div class="text-base text-slate-500 mt-1">Total Indicateurs</div>
              </div>
              <div class="flex-none w-2/4 2xl:w-1/4 relative">
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="report-box zoom-in">
          <div class="box p-5">
            <div class="flex">
              <div class="flex-none w-2/4 2xl:w-3/4">
                <div class="text-lg font-semibold leading-8 text-success">{{ averageProgress }}%</div>
                <div class="text-base text-slate-500 mt-1">Progression Moyenne</div>
              </div>
              <div class="flex-none w-2/4 2xl:w-1/4 relative">
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="report-box zoom-in">
          <div class="box p-5">
            <div class="flex">
              <div class="flex-none w-2/4 2xl:w-3/4">
                <div class="text-lg font-semibold leading-8 text-warning">{{ indicatorsOnTrack }}</div>
                <div class="text-base text-slate-500 mt-1">Sur Cible</div>
              </div>
              <div class="flex-none w-2/4 2xl:w-1/4 relative">
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="report-box zoom-in">
          <div class="box p-5">
            <div class="flex">
              <div class="flex-none w-2/4 2xl:w-3/4">
                <div class="text-lg font-semibold leading-8 text-danger">{{ indicatorsAtRisk }}</div>
                <div class="text-base text-slate-500 mt-1">À Risque</div>
              </div>
              <div class="flex-none w-2/4 2xl:w-1/4 relative">
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Filtres Avancés -->
      <div v-if="!isLoadingDataCadre" class="mt-6 intro-y">
        <div class="box p-5">
          <h3 class="text-lg font-medium mb-4">Filtres et Recherche</h3>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <label class="form-label">Rechercher</label>
              <input 
                v-model="search" 
                type="text" 
                class="form-control" 
                placeholder="Nom indicateur..."
              />
            </div>
            <div>
              <label class="form-label">Catégorie</label>
              <select v-model="selectedCategory" class="form-select">
                <option value="">Toutes les catégories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.nom }}</option>
              </select>
            </div>
            <div>
              <label class="form-label">Performance</label>
              <select v-model="selectedPerformance" class="form-select">
                <option value="">Toutes</option>
                <option value="excellent">Excellent (≥100%)</option>
                <option value="good">Bon (80-99%)</option>
                <option value="average">Moyen (60-79%)</option>
                <option value="poor">Faible (<60%)</option>
              </select>
            </div>
            <div>
              <label class="form-label">Année</label>
              <select v-model="selectedYear" class="form-select">
                <option value="">Toutes les années</option>
                <option v-for="year in annees" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
            <div class="flex items-end">
              <button @click="resetFilters" class="btn btn-outline-secondary w-full">
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tables and Pagination -->
      <div>
        <LoaderSnipper v-if="isLoadingDataCadre" />
        <TabulatorCadreMesure v-else :data="dataAvailable" :unites="unites" :categories="categories" :years="annees" :ongs="responsables" :ugs="ugs" :prop-sites="sites" @update-datas="getDatasCadre" @refreshData="refreshDatasCadreSilently" @edit-indicator="openEditModal" />
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
      v-model:showModalCategorie="showModalCategorie"
      v-model:showModalUniteMesure="showModalUniteMesure"
      v-model:showModalZone="showModalZone"
      v-model:showModalKey="showModalKey"
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
const selectedCategory = ref("");
const selectedPerformance = ref("");
const selectedYear = ref("");
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

// Calcul des statistiques dynamiques basées sur les vraies données
const getAllIndicators = computed(() => {
  const indicators = [];
  cadreRendement.value.forEach(result => {
    if (result.indicateurs) {
      indicators.push(...result.indicateurs);
    }
    if (result.categories) {
      result.categories.forEach(category => {
        if (category.indicateurs) {
          indicators.push(...category.indicateurs);
        }
        if (category.categories) {
          category.categories.forEach(subCategory => {
            if (subCategory.indicateurs) {
              indicators.push(...subCategory.indicateurs);
            }
          });
        }
      });
    }
  });
  return indicators;
});

const totalIndicators = computed(() => {
  return getAllIndicators.value.length;
});

const averageProgress = computed(() => {
  const indicators = getAllIndicators.value;
  if (indicators.length === 0) return 0;
  
  const rates = indicators
    .map(ind => parseFloat(ind.taux_realisation?.moy || 0))
    .filter(rate => !isNaN(rate));
  
  if (rates.length === 0) return 0;
  return Math.round(rates.reduce((sum, rate) => sum + rate, 0) / rates.length);
});

const indicatorsOnTrack = computed(() => {
  return getAllIndicators.value.filter(ind => {
    const rate = parseFloat(ind.taux_realisation?.moy || 0);
    return rate >= 80;
  }).length;
});

const indicatorsAtRisk = computed(() => {
  return getAllIndicators.value.filter(ind => {
    const rate = parseFloat(ind.taux_realisation?.moy || 0);
    return rate < 60;
  }).length;
});

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
  } catch (e) {  }
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

const filteredData = computed(() => {
  if (!cadreRendement.value) return [];
  
  // Si aucun filtre n'est appliqué, retourner les données paginées
  if (!search.value && !selectedCategory.value && !selectedPerformance.value && !selectedYear.value) {
    return paginatedData.value;
  }

  // Appliquer les filtres de manière récursive
  const filtered = cadreRendement.value.map(result => {
    const filteredResult = { ...result };
    
    // Filtrer les indicateurs du niveau principal
    if (result.indicateurs) {
      filteredResult.indicateurs = result.indicateurs.filter(indicateur => {
        return matchesFilters(indicateur, null);
      });
    }

    // Filtrer les catégories et leurs indicateurs
    if (result.categories) {
      filteredResult.categories = result.categories.map(category => {
        const filteredCategory = { ...category };
        
        // Filtre par catégorie sélectionnée
        if (selectedCategory.value && category.id !== parseInt(selectedCategory.value)) {
          return null; // Exclure cette catégorie entière
        }
        
        if (category.indicateurs) {
          filteredCategory.indicateurs = category.indicateurs.filter(indicateur => {
            return matchesFilters(indicateur, category);
          });
        }

        // Filtrer les sous-catégories
        if (category.categories) {
          filteredCategory.categories = category.categories.map(subCategory => {
            const filteredSubCategory = { ...subCategory };
            
            // Filtre par catégorie sélectionnée pour sous-catégories
            if (selectedCategory.value && subCategory.id !== parseInt(selectedCategory.value)) {
              return null;
            }
            
            if (subCategory.indicateurs) {
              filteredSubCategory.indicateurs = subCategory.indicateurs.filter(indicateur => {
                return matchesFilters(indicateur, subCategory);
              });
            }
            
            return filteredSubCategory.indicateurs && filteredSubCategory.indicateurs.length > 0 ? filteredSubCategory : null;
          }).filter(subCategory => subCategory !== null);
        }
        
        return (filteredCategory.indicateurs && filteredCategory.indicateurs.length > 0) ||
               (filteredCategory.categories && filteredCategory.categories.length > 0) 
               ? filteredCategory : null;
      }).filter(category => category !== null);
    }

    return (filteredResult.indicateurs && filteredResult.indicateurs.length > 0) ||
           (filteredResult.categories && filteredResult.categories.length > 0) 
           ? filteredResult : null;
  }).filter(result => result !== null);

  return filtered;
});

const matchesFilters = (indicateur, parentCategory) => {
  // Filtre par nom
  if (search.value && !indicateur.nom.toLowerCase().includes(search.value.toLowerCase())) {
    return false;
  }

  // Pour le filtre par catégorie, on laisse la logique au niveau supérieur
  // car on filtre déjà par catégorie dans filteredData

  // Filtre par performance
  if (selectedPerformance.value) {
    const rate = parseFloat(indicateur.taux_realisation?.moy || 0);
    switch (selectedPerformance.value) {
      case 'excellent':
        if (rate < 100) return false;
        break;
      case 'good':
        if (rate < 80 || rate >= 100) return false;
        break;
      case 'average':
        if (rate < 60 || rate >= 80) return false;
        break;
      case 'poor':
        if (rate >= 60) return false;
        break;
    }
  }

  // Filtre par année
  if (selectedYear.value) {
    const hasDataForYear = indicateur.valeursCible?.some(v => v.annee === parseInt(selectedYear.value));
    if (!hasDataForYear) return false;
  }

  return true;
};

const dataAvailable = computed(() => {
  return filteredData.value;
});

// Version simplifiée sans calculs complexes

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const goToPage = (page) => { currentPage.value = page; };

// --- ACTIONS ---
const displayMenu = () => { showMenu.value = !showMenu.value; };

// Fonction pour réinitialiser les filtres
const resetFilters = () => {
  search.value = "";
  selectedCategory.value = "";
  selectedPerformance.value = "";
  selectedYear.value = "";
};

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
  } finally {
    isSubmitting.value = false;
  }
};

// Fonctions de graphiques supprimées pour éviter les erreurs

// --- LIFECYCLE ---
onMounted(async () => {
  console.log("🚀 Component mounted - chargement des données...");
  try {
    await getcurrentUser();
    await getDatasCadre();
    console.log("📊 Données cadre chargées:", cadreRendement.value.length, "éléments");
    console.log("📈 Statistiques calculées:", {
      total: totalIndicators.value,
      progress: averageProgress.value,
      onTrack: indicatorsOnTrack.value,
      atRisk: indicatorsAtRisk.value
    });
    
    await getCategories();
    console.log("📋 Catégories chargées:", categories.value);
    await getResponsables();
    await getSites();
    await getUnites();
    await getKeys();
    console.log("✅ Toutes les données chargées");
  } catch (error) {
    console.error("❌ Erreur lors du chargement:", error);
    // Continuer même en cas d'erreur
  }
});

</script>

<style scoped>
.menu-enter-active, .menu-leave-active { transition: opacity 0.5s ease; }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateX(-30px); }
.truncate-option { display: inline-block; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
