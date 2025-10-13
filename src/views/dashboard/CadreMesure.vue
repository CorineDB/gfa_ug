<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Cadre de mesure</h2>
    
    <!-- Debug section -->
    <div class="mt-6 intro-y">
      <div class="box p-5 bg-yellow-50">
        <h3 class="font-bold mb-2">🔍 Debug Info</h3>
        <div class="text-sm space-y-1">
          <p><strong>Loading:</strong> {{ isLoadingDataCadre }}</p>
          <p><strong>Data length:</strong> {{ cadreRendement.length }}</p>
          <p><strong>Programme ID:</strong> {{ idProgramme }}</p>
          <p><strong>Années:</strong> {{ annees }}</p>
          <p><strong>Total Indicateurs:</strong> {{ totalIndicators }}</p>
        </div>
      </div>
    </div>

    <!-- Section Statistiques KPI -->
    <div v-if="!isLoadingDataCadre && cadreRendement.length > 0" class="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4 intro-y">
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
              <div class="text-lg font-semibold leading-8 text-success">{{ averageRealizationRate }}%</div>
              <div class="text-base text-slate-500 mt-1">Taux Moyen Réalisation</div>
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
              <div class="text-base text-slate-500 mt-1">Indicateurs Sur Cible</div>
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
              <div class="text-base text-slate-500 mt-1">Indicateurs À Risque</div>
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

    <!-- Section Graphiques -->
    <div v-if="!isLoadingDataCadre" class="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2 intro-y">
      <div class="box p-5">
        <h3 class="text-lg font-medium mb-4">Performance par Type de Résultat</h3>
        <canvas ref="performanceChart" style="height: 300px !important;"></canvas>
      </div>

      <div class="box p-5">
        <h3 class="text-lg font-medium mb-4">Évolution des Réalisations</h3>
        <canvas ref="evolutionChart" style="height: 300px !important;"></canvas>
      </div>
    </div>

    <!-- Section Filtres -->
    <div v-if="!isLoadingDataCadre" class="mt-6 intro-y">
      <div class="box p-5">
        <h3 class="text-lg font-medium mb-4">Filtres et Recherche</h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <div>
            <label class="form-label">Rechercher</label>
            <input 
              v-model="searchTerm" 
              type="text" 
              class="form-control" 
              placeholder="Nom indicateur..."
            />
          </div>
          <div>
            <label class="form-label">Type de Résultat</label>
            <select v-model="selectedResultType" class="form-select">
              <option value="">Tous les types</option>
              <option v-for="type in resultTypes" :key="type" :value="type">{{ type }}</option>
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

    <LoaderSnipper v-if="isLoadingDataCadre" />
    <TabulatorCadreMesure v-else :data="filteredData" :years="annees" />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { onMounted } from "vue";
import ResultatCadreRendementService from "@/services/modules/resultat.cadre.rendement.service";
import AuthService from "@/services/modules/auth.service";
import { toast } from "vue3-toastify";
import TabulatorCadreMesure from "@/components/TabulatorCadreMesure.vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Chart } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const cadreRendement = ref([]);
const isLoadingDataCadre = ref(false);
const idProgramme = ref("");
const debutProgramme = ref("");
const finProgramme = ref("");

// Refs pour les filtres
const searchTerm = ref("");
const selectedResultType = ref("");
const selectedPerformance = ref("");
const selectedYear = ref("");

// Refs pour les graphiques
const performanceChart = ref(null);
const evolutionChart = ref(null);
let performanceChartInstance = null;
let evolutionChartInstance = null;
const getcurrentUser = async () => {
  isLoadingDataCadre.value = true;

  await AuthService.getCurrentUser()
    .then((result) => {
      idProgramme.value = result.data.data.programme.id;
      debutProgramme.value = result.data.data.programme.debut;
      finProgramme.value = result.data.data.programme.fin;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue.");
    });
};

// Fetch data
const getDatasCadre = async () => {
  try {
    const { data } = await ResultatCadreRendementService.getCadreRendement(idProgramme.value);
    cadreRendement.value = data.data;
    console.log("Données chargées:", cadreRendement.value);
  } catch (e) {
    console.error("Erreur lors du chargement:", e);
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingDataCadre.value = false;
  }
};

const annees = computed(() => {
  let anneeDebut = parseInt(debutProgramme.value.split("-")[0], 10);
  let anneeFin = parseInt(finProgramme.value.split("-")[0], 10);
  let annees = [];
  for (let annee = anneeDebut; annee <= anneeFin; annee++) {
    annees.push(annee);
  }
  return annees;
});

// Fonctions pour calculer les statistiques
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
  const total = getAllIndicators.value.length;
  console.log("Total indicateurs:", total);
  return total;
});

const averageRealizationRate = computed(() => {
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

// Types de résultats uniques
const resultTypes = computed(() => {
  const types = new Set();
  cadreRendement.value.forEach(result => {
    if (result.type) types.add(result.type);
    if (result.categories) {
      result.categories.forEach(category => {
        if (category.type) types.add(category.type);
        if (category.categories) {
          category.categories.forEach(subCategory => {
            if (subCategory.type) types.add(subCategory.type);
          });
        }
      });
    }
  });
  return Array.from(types);
});

// Données filtrées
const filteredData = computed(() => {
  if (!searchTerm.value && !selectedResultType.value && !selectedPerformance.value && !selectedYear.value) {
    return cadreRendement.value;
  }

  return cadreRendement.value.map(result => {
    const filteredResult = { ...result };
    
    // Filtrer les indicateurs du niveau principal
    if (result.indicateurs) {
      filteredResult.indicateurs = result.indicateurs.filter(indicateur => {
        return matchesFilters(indicateur, result.type);
      });
    }

    // Filtrer les catégories et leurs indicateurs
    if (result.categories) {
      filteredResult.categories = result.categories.map(category => {
        const filteredCategory = { ...category };
        
        if (category.indicateurs) {
          filteredCategory.indicateurs = category.indicateurs.filter(indicateur => {
            return matchesFilters(indicateur, category.type);
          });
        }

        // Filtrer les sous-catégories
        if (category.categories) {
          filteredCategory.categories = category.categories.map(subCategory => {
            const filteredSubCategory = { ...subCategory };
            
            if (subCategory.indicateurs) {
              filteredSubCategory.indicateurs = subCategory.indicateurs.filter(indicateur => {
                return matchesFilters(indicateur, subCategory.type);
              });
            }
            
            return filteredSubCategory;
          }).filter(subCategory => 
            !subCategory.indicateurs || subCategory.indicateurs.length > 0
          );
        }
        
        return filteredCategory;
      }).filter(category => 
        (!category.indicateurs || category.indicateurs.length > 0) ||
        (!category.categories || category.categories.some(sub => 
          !sub.indicateurs || sub.indicateurs.length > 0
        ))
      );
    }

    return filteredResult;
  }).filter(result => 
    (!result.indicateurs || result.indicateurs.length > 0) ||
    (!result.categories || result.categories.some(cat => 
      (!cat.indicateurs || cat.indicateurs.length > 0) ||
      (!cat.categories || cat.categories.some(sub => 
        !sub.indicateurs || sub.indicateurs.length > 0
      ))
    ))
  );
});

const matchesFilters = (indicateur, resultType) => {
  // Filtre par nom
  if (searchTerm.value && !indicateur.nom.toLowerCase().includes(searchTerm.value.toLowerCase())) {
    return false;
  }

  // Filtre par type de résultat
  if (selectedResultType.value && resultType !== selectedResultType.value) {
    return false;
  }

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

// Fonction pour réinitialiser les filtres
const resetFilters = () => {
  searchTerm.value = "";
  selectedResultType.value = "";
  selectedPerformance.value = "";
  selectedYear.value = "";
};

// Fonctions pour les graphiques
const renderPerformanceChart = () => {
  try {
    if (!performanceChart.value) {
      console.log("Performance chart ref not found");
      return;
    }

    if (performanceChartInstance) {
      performanceChartInstance.destroy();
    }

    console.log("Rendering performance chart...");
    
    const typePerformance = {};
    resultTypes.value.forEach(type => {
      const indicators = getAllIndicators.value.filter(ind => {
        return findIndicatorType(ind.id) === type;
      });
      
      const avgRate = indicators.length > 0 
        ? indicators.reduce((sum, ind) => sum + parseFloat(ind.taux_realisation?.moy || 0), 0) / indicators.length
        : 0;
      
      typePerformance[type] = Math.round(avgRate);
    });

    console.log("Type performance data:", typePerformance);

    performanceChartInstance = new Chart(performanceChart.value, {
      type: 'doughnut',
      data: {
        labels: Object.keys(typePerformance),
        datasets: [{
          data: Object.values(typePerformance),
          backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      }
    });
    
    console.log("Performance chart rendered successfully");
  } catch (error) {
    console.error("Error rendering performance chart:", error);
  }
};

const renderEvolutionChart = () => {
  try {
    if (!evolutionChart.value) {
      console.log("Evolution chart ref not found");
      return;
    }

    if (evolutionChartInstance) {
      evolutionChartInstance.destroy();
    }

    console.log("Rendering evolution chart...");

    const yearlyData = {};
    annees.value.forEach(year => {
      yearlyData[year] = {
        cible: 0,
        realise: 0,
        count: 0
      };
    });

    getAllIndicators.value.forEach(indicator => {
      if (indicator.valeursCible) {
        indicator.valeursCible.forEach(valeur => {
          if (yearlyData[valeur.annee]) {
            yearlyData[valeur.annee].cible += parseFloat(valeur.valeurCible?.moy || 0);
            yearlyData[valeur.annee].realise += parseFloat(valeur.valeur_realiser?.moy || 0);
            yearlyData[valeur.annee].count++;
          }
        });
      }
    });

    const labels = Object.keys(yearlyData);
    const cibleData = labels.map(year => 
      yearlyData[year].count > 0 ? yearlyData[year].cible / yearlyData[year].count : 0
    );
    const realiseData = labels.map(year => 
      yearlyData[year].count > 0 ? yearlyData[year].realise / yearlyData[year].count : 0
    );

    console.log("Evolution chart data:", { labels, cibleData, realiseData });

    evolutionChartInstance = new Chart(evolutionChart.value, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Valeurs Cibles',
            data: cibleData,
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: false
          },
          {
            label: 'Valeurs Réalisées',
            data: realiseData,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Valeurs Moyennes'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Années'
            }
          }
        }
      }
    });
    
    console.log("Evolution chart rendered successfully");
  } catch (error) {
    console.error("Error rendering evolution chart:", error);
  }
};

// Fonction helper pour trouver le type d'un indicateur
const findIndicatorType = (indicatorId) => {
  for (const result of cadreRendement.value) {
    if (result.indicateurs?.some(ind => ind.id === indicatorId)) {
      return result.type;
    }
    if (result.categories) {
      for (const category of result.categories) {
        if (category.indicateurs?.some(ind => ind.id === indicatorId)) {
          return category.type;
        }
        if (category.categories) {
          for (const subCategory of category.categories) {
            if (subCategory.indicateurs?.some(ind => ind.id === indicatorId)) {
              return subCategory.type;
            }
          }
        }
      }
    }
  }
  return null;
};

// Watcher pour re-rendre les graphiques quand les données changent
watch(cadreRendement, () => {
  nextTick(() => {
    renderPerformanceChart();
    renderEvolutionChart();
  });
}, { deep: true });

onMounted(async () => {
  console.log("🚀 Component mounted - starting data loading...");
  try {
    await getcurrentUser();
    console.log("✅ User data loaded");
    
    await getDatasCadre();
    console.log("✅ Cadre data loaded");
    
    // Attendre que Vue ait mis à jour le DOM
    await nextTick();
    console.log("✅ DOM updated, rendering charts...");
    
    // Attendre un peu plus pour s'assurer que les refs sont disponibles
    setTimeout(() => {
      console.log("🎨 Starting chart rendering...");
      renderPerformanceChart();
      renderEvolutionChart();
    }, 100);
    
  } catch (error) {
    console.error("❌ Error in onMounted:", error);
  }
});
</script>

<style scoped></style>
