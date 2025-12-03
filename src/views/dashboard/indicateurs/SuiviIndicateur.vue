<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Dashboard Suivi des Indicateurs</h2>
    
    <!-- Section Statistiques KPI -->
    <div v-if="!isLoadingDataCadre && suivis.length > 0" class="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4 intro-y">
      <div class="report-box zoom-in">
        <div class="box p-5">
          <div class="flex">
            <div class="flex-none w-2/4 2xl:w-3/4">
              <div class="text-lg font-semibold leading-8">{{ totalSuivis }}</div>
              <div class="text-base text-slate-500 mt-1">Total Suivis</div>
            </div>
            <div class="flex-none w-2/4 2xl:w-1/4 relative">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
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
              <div class="text-lg font-semibold leading-8 text-success">{{ averagePerformance }}%</div>
              <div class="text-base text-slate-500 mt-1">Performance Moyenne</div>
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
              <div class="text-lg font-semibold leading-8 text-warning">{{ indicateursActifs }}</div>
              <div class="text-base text-slate-500 mt-1">Indicateurs Actifs</div>
            </div>
            <div class="flex-none w-2/4 2xl:w-1/4 relative">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div class="text-lg font-semibold leading-8 text-danger">{{ suivisRecentCount }}</div>
              <div class="text-base text-slate-500 mt-1">Suivis ce Mois</div>
            </div>
            <div class="flex-none w-2/4 2xl:w-1/4 relative">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h.5a2.5 2.5 0 012.5 2.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5A2.5 2.5 0 016.5 7H8z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    
    <!-- Section Filtres Améliorés avec Compteurs et Badges -->
    <div v-if="!isLoadingDataCadre" class="mt-6 intro-y">
      <div class="box p-6 bg-gradient-to-br from-white to-gray-50">
        <!-- En-tête avec compteur de résultats -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              Filtres Avancés
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              <span class="font-semibold text-blue-600">{{ filteredData.length }}</span> résultat(s) sur {{ totalSuivis }}
            </p>
          </div>
          
          <!-- Badges des filtres actifs -->
          <div v-if="hasActiveFilters" class="flex items-center gap-2">
            <span class="text-xs font-medium text-gray-600">Filtres actifs:</span>
            <div class="flex gap-2 flex-wrap">
              <span v-if="search" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                🔍 {{ search }}
                <button @click="search = ''" class="ml-1 hover:text-blue-900">×</button>
              </span>
              <span v-if="selectedTrimestre" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                📅 T{{ selectedTrimestre }}
                <button @click="selectedTrimestre = ''" class="ml-1 hover:text-green-900">×</button>
              </span>
              <span v-if="selectedYear" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                📆 {{ selectedYear }}
                <button @click="selectedYear = ''" class="ml-1 hover:text-purple-900">×</button>
              </span>
              <span v-if="selectedIndicateur" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                📊 Indicateur
                <button @click="selectedIndicateur = ''" class="ml-1 hover:text-orange-900">×</button>
              </span>
            </div>
          </div>
        </div>

        <!-- Grille de filtres -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <!-- Recherche -->
          <div class="relative">
            <label class="form-label text-sm font-semibold text-gray-700 mb-2">
              🔍 Rechercher
            </label>
            <div class="relative">
              <input 
                v-model="search" 
                type="text" 
                class="form-control pl-10 pr-10 border-2 focus:border-blue-500 transition-all" 
                placeholder="Nom indicateur ou auteur..."
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <button v-if="search" @click="search = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Trimestre -->
          <div>
            <label class="form-label text-sm font-semibold text-gray-700 mb-2">
              📅 Trimestre
              <span v-if="selectedTrimestre" class="ml-2 text-xs font-normal text-green-600">({{ trimestreCount }} résultat(s))</span>
            </label>
            <select v-model="selectedTrimestre" class="form-select border-2 focus:border-green-500 transition-all">
              <option value="">Tous les trimestres</option>
              <option value="1">Trimestre 1 ({{ getTrimestreCount(1) }})</option>
              <option value="2">Trimestre 2 ({{ getTrimestreCount(2) }})</option>
              <option value="3">Trimestre 3 ({{ getTrimestreCount(3) }})</option>
              <option value="4">Trimestre 4 ({{ getTrimestreCount(4) }})</option>
            </select>
          </div>

          <!-- Année -->
          <div>
            <label class="form-label text-sm font-semibold text-gray-700 mb-2">
              📆 Année
              <span v-if="selectedYear" class="ml-2 text-xs font-normal text-purple-600">({{ yearCount }} résultat(s))</span>
            </label>
            <select v-model="selectedYear" class="form-select border-2 focus:border-purple-500 transition-all">
              <option value="">Toutes les années</option>
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }} ({{ getYearCount(year) }})
              </option>
            </select>
          </div>

          <!-- Bouton Réinitialiser -->
          <div class="flex items-end">
            <button 
              @click="resetFilters" 
              :disabled="!hasActiveFilters"
              :class="hasActiveFilters ? 'btn-outline-secondary hover:bg-gray-100' : 'btn-outline-secondary opacity-50 cursor-not-allowed'"
              class="btn w-full transition-all flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Réinitialiser
            </button>
          </div>
        </div>

        <!-- Statistiques rapides des filtres -->
        <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-gray-200">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="bg-blue-50 p-3 rounded-lg">
              <div class="text-xs text-blue-600 font-medium">Indicateurs uniques</div>
              <div class="text-lg font-bold text-blue-800">{{ filteredUniqueIndicateurs }}</div>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <div class="text-xs text-green-600 font-medium">Performance moy.</div>
              <div class="text-lg font-bold text-green-800">{{ filteredAveragePerformance }}%</div>
            </div>
            <div class="bg-purple-50 p-3 rounded-lg">
              <div class="text-xs text-purple-600 font-medium">Validés</div>
              <div class="text-lg font-bold text-purple-800">{{ filteredValidatedCount }}</div>
            </div>
            <div class="bg-orange-50 p-3 rounded-lg">
              <div class="text-xs text-orange-600 font-medium">Ce mois</div>
              <div class="text-lg font-bold text-orange-800">{{ filteredThisMonthCount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Graphiques Améliorée avec Support Agrégé -->
    <div v-if="!isLoadingDataCadre && suivis.length > 0" class="mt-6 intro-y">
      <!-- Sélecteur de clé pour indicateurs agrégés -->
      <div class="box p-5 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800">Analyse Graphique des Indicateurs</h3>
              <p class="text-sm text-gray-600">Visualisez les données selon différentes dimensions</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <!-- Sélecteur de clé -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-semibold text-gray-700">📊 Dimension:</label>
              <select v-model="selectedKey" @change="updateAllCharts" class="form-select w-48 border-2 border-indigo-300 focus:border-indigo-500">
                <option value="moy">Moyenne (moy)</option>
                <option value="gar">Garçons (gar)</option>
                <option value="test">Test</option>
                <option value="all">Toutes les dimensions</option>
              </select>
            </div>
            
            <!-- Bouton export -->
            <button @click="exportAllCharts" class="btn btn-primary flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Exporter
            </button>
          </div>
        </div>
      </div>

      <!-- Première ligne avec 2 graphiques -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        <!-- Graphique 1 : Répartition par Trimestre -->
        <div class="box p-5 relative group">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
              Répartition par Trimestre
            </h3>
            <div class="flex gap-2">
              <button @click="exportChart('trimestre')" class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded" title="Exporter">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>
              <button @click="toggleFullscreen('trimestre')" class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded" title="Plein écran">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="relative" style="height: 300px;">
            <canvas ref="trimestreChart"></canvas>
          </div>
        </div>
        
        <!-- Graphique 2 : Performance Moyenne -->
        <div class="box p-5 relative group">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              Performance Moyenne par Mois
            </h3>
            <div class="flex gap-2">
              <button @click="exportChart('performance')" class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded" title="Exporter">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>
              <button @click="toggleFullscreen('performance')" class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded" title="Plein écran">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="relative" style="height: 300px;">
            <canvas ref="performanceChart"></canvas>
          </div>
        </div>
      </div>
      
      <!-- Deuxième ligne : Graphique de comparaison avec support multi-clés -->
      <div class="box p-5 relative group">
        <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
              Comparaison Cibles vs Réalisées
              <span v-if="selectedKey !== 'all'" class="text-sm font-normal text-gray-600">
                ({{ getKeyLabel(selectedKey) }})
              </span>
            </h3>
            <p class="text-xs text-gray-500 mt-1">
              {{ selectedIndicateur ? 'Mode évolution temporelle' : 'Vue d\'ensemble par indicateur' }}
            </p>
          </div>
          
          <div class="flex items-center gap-3 flex-wrap">
            <!-- Filtre par indicateur -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700">🎯 Indicateur:</label>
              <select v-model="selectedIndicateur" @change="updateComparisonChart" class="form-select w-64 border-2 border-purple-300 focus:border-purple-500">
                <option value="">Tous les indicateurs</option>
                <option v-for="indicateur in availableIndicateurs" :key="indicateur.id" :value="indicateur.id">
                  {{ indicateur.nom.length > 50 ? indicateur.nom.substring(0, 50) + '...' : indicateur.nom }}
                </option>
              </select>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-2">
              <button @click="exportChart('comparison')" class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded" title="Exporter">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>
              <button @click="toggleFullscreen('comparison')" class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded" title="Plein écran">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="relative" style="height: 400px;">
          <canvas ref="comparisonChart"></canvas>
        </div>
        
        <!-- Légende pour mode multi-clés -->
        <div v-if="selectedKey === 'all' && !selectedIndicateur" class="mt-4 p-3 bg-gray-50 rounded-lg">
          <p class="text-xs text-gray-600 mb-2 font-semibold">📌 Légende des dimensions:</p>
          <div class="flex flex-wrap gap-3">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-red-500 rounded"></div>
              <span class="text-xs">Cibles</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-green-500 rounded"></div>
              <span class="text-xs">Réalisées</span>
            </div>
            <div class="text-xs text-gray-500 ml-4">
              Les barres sont groupées par dimension (moy, gar, test)
            </div>
          </div>
        </div>
      </div>
    </div>

    <LoaderSnipper v-if="isLoadingDataCadre" />
    <TabulatorSuiviIndicateur v-else :data="filteredData" :years="annees" :isDataLoading="isLoadingDataCadre" @refreshData="getDatasCadre"/>
    <div v-if="!isLoadingDataCadre" class="flex justify-center gap-3 my-8">
      <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-3 btn btn-outline-primary"><ChevronsLeftIcon class="size-5" /></button>
      <div class="flex items-center justify-center gap-3 overflow-x-auto scroll-pagination custom-scroll">
        <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="page === currentPage ? 'btn-primary' : 'btn-outline-primary'" class="px-4 py-3 btn">
          {{ page }}
        </button>
      </div>

      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-3 btn btn-outline-primary"><ChevronsRightIcon class="size-5" /></button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import ResultatCadreRendementService from "@/services/modules/resultat.cadre.rendement.service";
import IndicateursService from "@/services/modules/indicateur.service";
import AuthService from "@/services/modules/auth.service";
import { toast } from "vue3-toastify";
import TabulatorSuiviIndicateur from "../../../components/TabulatorSuiviIndicateur.vue";
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

// Enregistrer Chart.js une seule fois
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

const suivis = ref([]);
const isLoadingDataCadre = ref(false);
const debutProgramme = ref("");
const finProgramme = ref("");
const search = ref("");
const selectedTrimestre = ref("");
const selectedYear = ref("");
const selectedIndicateur = ref("");
const selectedKey = ref("moy"); // Nouvelle ref pour la clé sélectionnée

// Etat de la page et items par page
const currentPage = ref(1);
const itemsPerPage = 20;

// Refs pour les graphiques
const trimestreChart = ref(null);
const performanceChart = ref(null);
const comparisonChart = ref(null);
let trimestreChartInstance = null;
let performanceChartInstance = null;
let comparisonChartInstance = null;
const chartsRendered = ref({ trimestre: false, performance: false, comparison: false });

// Fonction pour obtenir le label d'une clé
const getKeyLabel = (key) => {
  const labels = {
    moy: "Moyenne",
    gar: "Garçons",
    test: "Test",
    all: "Toutes les dimensions"
  };
  return labels[key] || key;
};

// Fonction pour exporter un graphique en image
const exportChart = (chartType) => {
  let chartInstance = null;
  let fileName = "";
  
  switch(chartType) {
    case 'trimestre':
      chartInstance = trimestreChartInstance;
      fileName = "repartition_trimestre.png";
      break;
    case 'performance':
      chartInstance = performanceChartInstance;
      fileName = "performance_mensuelle.png";
      break;
    case 'comparison':
      chartInstance = comparisonChartInstance;
      fileName = "comparaison_cibles_realisees.png";
      break;
  }
  
  if (chartInstance) {
    const url = chartInstance.toBase64Image();
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();
    toast.success(`Graphique exporté : ${fileName}`);
  }
};

// Fonction pour exporter tous les graphiques
const exportAllCharts = () => {
  exportChart('trimestre');
  setTimeout(() => exportChart('performance'), 100);
  setTimeout(() => exportChart('comparison'), 200);
  toast.success("Tous les graphiques ont été exportés !");
};

// Fonction pour basculer en plein écran
const toggleFullscreen = (chartType) => {
  let element = null;
  
  switch(chartType) {
    case 'trimestre':
      element = trimestreChart.value?.parentElement?.parentElement;
      break;
    case 'performance':
      element = performanceChart.value?.parentElement?.parentElement;
      break;
    case 'comparison':
      element = comparisonChart.value?.parentElement?.parentElement;
      break;
  }
  
  if (element) {
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => {
        console.error("Erreur plein écran:", err);
      });
    } else {
      document.exitFullscreen();
    }
  }
};

// Fonction pour mettre à jour tous les graphiques selon la clé sélectionnée
const updateAllCharts = () => {
  chartsRendered.value = { trimestre: false, performance: false, comparison: false };
  
  setTimeout(() => {
    renderTrimestreChart();
    renderPerformanceChart();
    renderComparisonChart(true);
  }, 100);
};


const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
const goToPage = (page) => {
  currentPage.value = page;
};
const getcurrentUser = async () => {
  isLoadingDataCadre.value = true;

  await AuthService.getCurrentUser()
    .then((result) => {
      debutProgramme.value = result.data.data.programme.debut;
      finProgramme.value = result.data.data.programme.fin;
    })
    .catch((e) => {
      toast.error("Une erreur est survenue.");
    });
};

// Fetch data
const getDatasCadre = async () => {
  try {
    const { data } = await IndicateursService.getAllSuivis();
    suivis.value = data.data;
  } catch (e) {
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

// Calculer le nombre total de pages
const totalPages = computed(() => {
  if (search.value.length > 0 || selectedTrimestre.value || selectedYear.value) {
    return 1; // Pas de pagination pour les résultats filtrés
  }
  return Math.ceil(suivis.value ? suivis.value.length / itemsPerPage : 0);
});

// Statistiques calculées
const totalSuivis = computed(() => suivis.value.length);

const averagePerformance = computed(() => {
  if (suivis.value.length === 0) return 0;
  const rates = suivis.value
    .map(suivi => {
      const taux = suivi.indicateur?.taux_realisation?.moy;
      return taux ? parseFloat(taux) : 0;
    })
    .filter(rate => !isNaN(rate));
  
  if (rates.length === 0) return 0;
  return Math.round(rates.reduce((sum, rate) => sum + rate, 0) / rates.length);
});

const indicateursActifs = computed(() => {
  const uniqueIndicateurs = new Set(suivis.value.map(suivi => suivi.indicateur?.id));
  return uniqueIndicateurs.size;
});

const suivisRecentCount = computed(() => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  return suivis.value.filter(suivi => {
    if (!suivi.dateSuivie) return false;
    const suiviDate = new Date(suivi.dateSuivie);
    return suiviDate.getMonth() + 1 === currentMonth && suiviDate.getFullYear() === currentYear;
  }).length;
});

const availableYears = computed(() => {
  const years = new Set();
  suivis.value.forEach(suivi => {
    if (suivi.dateSuivie) {
      const year = new Date(suivi.dateSuivie).getFullYear();
      years.add(year);
    }
  });
  return Array.from(years).sort((a, b) => b - a);
});

const availableIndicateurs = computed(() => {
  const indicateursMap = new Map();
  
  suivis.value.forEach(suivi => {
    const indicateur = suivi.indicateur;
    if (indicateur && indicateur.id && indicateur.nom) {
      indicateursMap.set(indicateur.id, {
        id: indicateur.id,
        nom: indicateur.nom
      });
    }
  });
  
  return Array.from(indicateursMap.values()).sort((a, b) => a.nom.localeCompare(b.nom));
});

// Données filtrées
const filteredData = computed(() => {
  let filtered = suivis.value;

  // Filtre par recherche
  if (search.value.length > 0) {
    const searchTerm = search.value.toLowerCase();
    filtered = filtered.filter(suivi => 
      suivi.indicateur.nom.toLowerCase().includes(searchTerm) || 
      suivi.auteur.nom.toLowerCase().includes(searchTerm)
    );
  }

  // Filtre par trimestre
  if (selectedTrimestre.value) {
    filtered = filtered.filter(suivi => 
      suivi.trimestre === parseInt(selectedTrimestre.value)
    );
  }

  // Filtre par année
  if (selectedYear.value) {
    filtered = filtered.filter(suivi => {
      if (!suivi.dateSuivie) return false;
      return new Date(suivi.dateSuivie).getFullYear() === parseInt(selectedYear.value);
    });
  }

  // Pagination
  if (search.value.length > 0 || selectedTrimestre.value || selectedYear.value) {
    return filtered;
  } else {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filtered.slice(start, end);
  }
});

// Fonction pour réinitialiser les filtres
const resetFilters = () => {
  search.value = "";
  selectedTrimestre.value = "";
  selectedYear.value = "";
  selectedIndicateur.value = "";
};

// Computed pour vérifier si des filtres sont actifs
const hasActiveFilters = computed(() => {
  return search.value || selectedTrimestre.value || selectedYear.value || selectedIndicateur.value;
});

// Fonctions pour compter les résultats par trimestre
const getTrimestreCount = (trimestre) => {
  return suivis.value.filter(suivi => suivi.trimestre === trimestre).length;
};

// Fonction pour compter les résultats par année
const getYearCount = (year) => {
  return suivis.value.filter(suivi => {
    if (!suivi.dateSuivie) return false;
    return new Date(suivi.dateSuivie).getFullYear() === year;
  }).length;
};

// Computed pour le compteur du trimestre sélectionné
const trimestreCount = computed(() => {
  if (!selectedTrimestre.value) return 0;
  return getTrimestreCount(parseInt(selectedTrimestre.value));
});

// Computed pour le compteur de l'année sélectionnée
const yearCount = computed(() => {
  if (!selectedYear.value) return 0;
  return getYearCount(parseInt(selectedYear.value));
});

// Statistiques sur les données filtrées
const filteredUniqueIndicateurs = computed(() => {
  const uniqueIndicateurs = new Set(filteredData.value.map(suivi => suivi.indicateur?.id));
  return uniqueIndicateurs.size;
});

const filteredAveragePerformance = computed(() => {
  if (filteredData.value.length === 0) return 0;
  const rates = filteredData.value
    .map(suivi => {
      const taux = suivi.indicateur?.taux_realisation?.moy;
      return taux ? parseFloat(taux) : 0;
    })
    .filter(rate => !isNaN(rate));
  
  if (rates.length === 0) return 0;
  return Math.round(rates.reduce((sum, rate) => sum + rate, 0) / rates.length);
});

const filteredValidatedCount = computed(() => {
  return filteredData.value.filter(suivi => suivi.estValider === true).length;
});

const filteredThisMonthCount = computed(() => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  return filteredData.value.filter(suivi => {
    if (!suivi.dateSuivie) return false;
    const suiviDate = new Date(suivi.dateSuivie);
    return suiviDate.getMonth() + 1 === currentMonth && suiviDate.getFullYear() === currentYear;
  }).length;
});

// Fonction pour rendre le graphique trimestre
const renderTrimestreChart = () => {
  if (chartsRendered.value.trimestre || !trimestreChart.value || !suivis.value || suivis.value.length === 0) {
    return;
  }

  try {
    if (trimestreChartInstance) {
      trimestreChartInstance.destroy();
      trimestreChartInstance = null;
    }

    const staticTrimestreData = { 1: 0, 2: 0, 3: 0, 4: 0 };
    
    for (const suivi of suivis.value) {
      if (suivi.trimestre && suivi.trimestre >= 1 && suivi.trimestre <= 4) {
        staticTrimestreData[suivi.trimestre]++;
      }
    }

    const ctx = trimestreChart.value.getContext('2d');
    
    trimestreChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Trimestre 1', 'Trimestre 2', 'Trimestre 3', 'Trimestre 4'],
        datasets: [{
          data: [staticTrimestreData[1], staticTrimestreData[2], staticTrimestreData[3], staticTrimestreData[4]],
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + ' suivis';
              }
            }
          }
        }
      }
    });

    chartsRendered.value.trimestre = true;
    console.log("✅ Trimestre chart rendered successfully");
    
  } catch (error) {
    console.error("❌ Error rendering trimestre chart:", error);
  }
};

// Fonction pour rendre le graphique de performance moyenne par mois
const renderPerformanceChart = () => {
  if (chartsRendered.value.performance || !performanceChart.value || !suivis.value || suivis.value.length === 0) {
    return;
  }

  try {
    if (performanceChartInstance) {
      performanceChartInstance.destroy();
      performanceChartInstance = null;
    }

    // Grouper les données par mois selon la clé sélectionnée
    const monthlyPerformance = {};
    
    for (const suivi of suivis.value) {
      if (suivi.dateSuivie && suivi.indicateur?.taux_realisation) {
        const date = new Date(suivi.dateSuivie);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        // Support des clés agrégées
        const tauxValue = suivi.indicateur.taux_realisation[selectedKey.value];
        
        if (tauxValue !== undefined && tauxValue !== null) {
          if (!monthlyPerformance[monthKey]) {
            monthlyPerformance[monthKey] = { total: 0, count: 0 };
          }
          
          monthlyPerformance[monthKey].total += parseFloat(tauxValue);
          monthlyPerformance[monthKey].count++;
        }
      }
    }

    const sortedMonths = Object.keys(monthlyPerformance).sort();
    const labels = sortedMonths.map(month => {
      const [year, monthNum] = month.split('-');
      return `${monthNum}/${year}`;
    });
    const data = sortedMonths.map(month => 
      Math.round(monthlyPerformance[month].total / monthlyPerformance[month].count)
    );

    const ctx = performanceChart.value.getContext('2d');
    
    performanceChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `Performance Moyenne (%) - ${getKeyLabel(selectedKey.value)}`,
          data: data,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Performance (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Mois'
            }
          }
        }
      }
    });

    chartsRendered.value.performance = true;
    console.log("✅ Performance chart rendered successfully");
    
  } catch (error) {
    console.error("❌ Error rendering performance chart:", error);
  }
};

// Fonction pour rendre le graphique de comparaison avec filtre
const renderComparisonChart = (forceRender = false) => {
  if (!forceRender && (chartsRendered.value.comparison || !comparisonChart.value || !suivis.value || suivis.value.length === 0)) {
    return;
  }

  try {
    if (comparisonChartInstance) {
      comparisonChartInstance.destroy();
      comparisonChartInstance = null;
    }

    let indicateursData = [];
    
    // Si un indicateur spécifique est sélectionné, mode évolution
    if (selectedIndicateur.value) {
      // Mode évolution d'un seul indicateur
      for (const suivi of suivis.value) {
        const indicateur = suivi.indicateur;
        if (indicateur && indicateur.id === parseInt(selectedIndicateur.value) && indicateur.valeursCible) {
          for (const valeur of indicateur.valeursCible) {
            if (valeur.valeurCible?.moy && valeur.valeur_realiser?.moy) {
              indicateursData.push({
                label: `Année ${valeur.annee}`,
                nom: indicateur.nom,
                cible: parseFloat(valeur.valeurCible.moy),
                realise: parseFloat(valeur.valeur_realiser.moy),
                annee: valeur.annee,
                pourcentage: Math.round((parseFloat(valeur.valeur_realiser.moy) / parseFloat(valeur.valeurCible.moy)) * 100)
              });
            }
          }
        }
      }
      // Trier par année pour voir l'évolution
      indicateursData.sort((a, b) => a.annee - b.annee);
    } else {
      // Mode tous les indicateurs
      for (const suivi of suivis.value) {
        const indicateur = suivi.indicateur;
        if (indicateur && indicateur.nom && indicateur.valeursCible) {
          for (const valeur of indicateur.valeursCible) {
            if (valeur.valeurCible?.moy && valeur.valeur_realiser?.moy) {
              const nomCourt = indicateur.nom.length > 35 ? indicateur.nom.substring(0, 35) + '...' : indicateur.nom;
              const label = `${nomCourt} [${valeur.annee}]`;
              
              indicateursData.push({
                label: label,
                nom: indicateur.nom,
                cible: parseFloat(valeur.valeurCible.moy),
                realise: parseFloat(valeur.valeur_realiser.moy),
                annee: valeur.annee,
                pourcentage: Math.round((parseFloat(valeur.valeur_realiser.moy) / parseFloat(valeur.valeurCible.moy)) * 100)
              });
            }
          }
        }
      }
      // Trier par année puis par nom
      indicateursData.sort((a, b) => {
        if (a.annee !== b.annee) {
          return a.annee - b.annee;
        }
        return a.nom.localeCompare(b.nom);
      });
    }

    console.log(`📊 Collecté ${indicateursData.length} entrées d'indicateurs`);

    const labels = indicateursData.map(item => item.label);
    const valeursCibles = indicateursData.map(item => item.cible);
    const valeursRealisees = indicateursData.map(item => item.realise);
    const pourcentages = indicateursData.map(item => item.pourcentage);

    const ctx = comparisonChart.value.getContext('2d');
    
    // Type de graphique selon le mode
    const chartType = selectedIndicateur.value ? 'line' : 'bar';
    const chartTitle = selectedIndicateur.value 
      ? `Évolution: ${indicateursData[0]?.nom || 'Indicateur sélectionné'}`
      : 'Indicateurs [Année]';

    comparisonChartInstance = new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Valeurs Cibles',
            data: valeursCibles,
            backgroundColor: selectedIndicateur.value ? 'rgba(239, 68, 68, 0.1)' : '#EF4444',
            borderColor: '#DC2626',
            borderWidth: selectedIndicateur.value ? 3 : 1,
            barThickness: selectedIndicateur.value ? undefined : 'flex',
            maxBarThickness: selectedIndicateur.value ? undefined : 30,
            tension: selectedIndicateur.value ? 0.4 : undefined,
            fill: selectedIndicateur.value ? false : undefined
          },
          {
            label: 'Valeurs Réalisées',
            data: valeursRealisees,
            backgroundColor: selectedIndicateur.value ? 'rgba(16, 185, 129, 0.1)' : '#10B981',
            borderColor: '#059669',
            borderWidth: selectedIndicateur.value ? 3 : 1,
            barThickness: selectedIndicateur.value ? undefined : 'flex',
            maxBarThickness: selectedIndicateur.value ? undefined : 30,
            tension: selectedIndicateur.value ? 0.4 : undefined,
            fill: selectedIndicateur.value ? false : undefined
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'top',
            labels: {
              usePointStyle: true,
              font: { size: 12 }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: function(context) {
                const dataIndex = context[0].dataIndex;
                return selectedIndicateur.value 
                  ? `${indicateursData[dataIndex].nom} (${indicateursData[dataIndex].annee})`
                  : `${indicateursData[dataIndex].nom} (${indicateursData[dataIndex].annee})`;
              },
              label: function(context) {
                const dataIndex = context.dataIndex;
                const percentage = pourcentages[dataIndex];
                
                if (context.dataset.label === 'Valeurs Réalisées') {
                  return `${context.dataset.label}: ${context.parsed.y} (${percentage}% de la cible)`;
                }
                return `${context.dataset.label}: ${context.parsed.y}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Valeurs',
              font: { size: 12 }
            },
            ticks: { font: { size: 10 } }
          },
          x: {
            title: {
              display: true,
              text: chartTitle,
              font: { size: 12 }
            },
            ticks: {
              maxRotation: selectedIndicateur.value ? 0 : 90,
              minRotation: selectedIndicateur.value ? 0 : 45,
              font: { size: 9 }
            }
          }
        },
        interaction: {
          mode: 'index',
          intersect: false
        }
      }
    });

    chartsRendered.value.comparison = true;
    console.log(`✅ Comparison chart rendered with ${indicateursData.length} indicateurs`);
    
  } catch (error) {
    console.error("❌ Error rendering comparison chart:", error);
  }
};

// Fonction pour mettre à jour le graphique quand le filtre change
const updateComparisonChart = () => {
  chartsRendered.value.comparison = false;
  renderComparisonChart(true);
};

onMounted(async () => {
  console.log("🚀 SuiviIndicateur mounted - loading data...");
  try {
    await getcurrentUser();
    await getDatasCadre();
    
    // Rendre les graphiques une seule fois après le chargement des données
    if (suivis.value && suivis.value.length > 0) {
      setTimeout(() => {
        renderTrimestreChart();
        renderPerformanceChart();
        renderComparisonChart();
      }, 500); // Délai pour s'assurer que le DOM est prêt
    }
    
  } catch (error) {
    console.error("❌ Error in SuiviIndicateur onMounted:", error);
  }
});

// Cleanup à la destruction du composant
onUnmounted(() => {
  if (trimestreChartInstance) {
    trimestreChartInstance.destroy();
    trimestreChartInstance = null;
  }
  if (performanceChartInstance) {
    performanceChartInstance.destroy();
    performanceChartInstance = null;
  }
  if (comparisonChartInstance) {
    comparisonChartInstance.destroy();
    comparisonChartInstance = null;
  }
  chartsRendered.value = { trimestre: false, performance: false, comparison: false };
});
</script>

<style>
.custom-scroll {
  scrollbar-width: thin; /* Pour Firefox */
  scrollbar-color: #e5e7eb #e5e7eb; /* Pour Firefox : Couleurs */
}

.custom-scroll::-webkit-scrollbar {
  height: 1px; /* Hauteur de la barre pour le défilement horizontal */
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #e5e7eb; /* Couleur du curseur */
  border-radius: 10px; /* Arrondi du curseur */
  display: none;
}

.custom-scroll::-webkit-scrollbar-track {
  background-color: #e5e7eb; /* Couleur de la piste */
}
</style>
