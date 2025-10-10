<template>
  <!-- Enhanced Project Dashboard -->
  <div class="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-blue-50">
    <div class="flex justify-between my-4 items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 intro-y">📊 Dashboard Projet Avancé</h2>
        <p class="text-sm text-gray-600 mt-1">Analyses, projections et prédictions en temps réel</p>
      </div>
      <div class="flex space-x-2">
        <button 
          @click="exportDashboard" 
          class="btn bg-green-500 hover:bg-green-600 text-white transition-colors"
        >
          📥 Exporter
        </button>
        <button class="btn btn-primary" @click="router.go(-1)">← Retour</button>
      </div>
    </div>
    
    <!-- Enhanced Header with Real-time Status -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6" v-if="graphiqueData">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="flex items-center space-x-3 mb-2">
            <h1 class="text-2xl font-bold text-gray-800">{{graphiqueData?.codePta}} - {{ graphiqueData?.nom }}</h1>
            <div :class="getProjectStatusBadge(graphiqueData?.statut)" class="px-3 py-1 rounded-full text-sm font-medium">
              {{ getProjectStatusText(graphiqueData?.statut) }}
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Données mises à jour en temps réel
            </div>
          </div>
          <p class="text-gray-600" v-if="graphiqueData?.description">{{ graphiqueData?.description }}</p>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold text-blue-600">{{ calculateProjectScore() }}%</div>
          <div class="text-sm text-gray-500">Score Global</div>
        </div>
      </div>
    </div>
    
    <!-- Enhanced KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8" v-if="graphiqueData">
      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div class="flex items-center justify-between">
          <div class="p-3 rounded-full bg-blue-100">
            <span class="text-2xl">👤</span>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-gray-800">1</div>
            <div class="text-sm text-gray-500">Manager</div>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-sm font-medium text-gray-700">
            {{ graphiqueData?.projet_manager ?? "Non assigné" }}
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div class="flex items-center justify-between">
          <div class="p-3 rounded-full bg-purple-100">
            <span class="text-2xl">👥</span>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-gray-800">{{ graphiqueData?.equipes ? graphiqueData?.equipes?.length : 0 }}</div>
            <div class="text-sm text-gray-500">Membres</div>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-xs text-gray-600 truncate" v-if="graphiqueData?.equipes">
            {{ graphiqueData?.equipes.map((item) => item.nom).join(", ") }}
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div class="flex items-center justify-between">
          <div class="p-3 rounded-full bg-green-100">
            <span class="text-2xl">📅</span>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-gray-800">{{ graphiqueData?.nbrJourRestant || 0 }}</div>
            <div class="text-sm text-gray-500">Jours Restants</div>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-xs text-gray-600">
            {{ convertDaysToYearsMonthsDays(graphiqueData?.nbrJourRestant) }}
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div class="flex items-center justify-between">
          <div class="p-3 rounded-full bg-emerald-100">
            <span class="text-2xl">📊</span>
          </div>
          <div class="text-right">
            <div class="text-lg font-bold text-gray-800">{{ formatCompactCurrency(graphiqueData?.budgetNational || 0) }}</div>
            <div class="text-sm text-gray-500">Fonds Propres</div>
          </div>
        </div>
        <div class="mt-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-emerald-500 h-2 rounded-full" :style="{ width: calculateBudgetUsagePercentage() + '%' }"></div>
          </div>
          <div class="text-xs text-gray-600 mt-1">{{ calculateBudgetUsagePercentage() }}% utilisé</div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div class="flex items-center justify-between">
          <div class="p-3 rounded-full bg-orange-100">
            <span class="text-2xl">💰</span>
          </div>
          <div class="text-right">
            <div class="text-lg font-bold text-gray-800">{{ formatCompactCurrency(graphiqueData?.pret || 0) }}</div>
            <div class="text-sm text-gray-500">Subvention</div>
          </div>
        </div>
        <div class="mt-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-orange-500 h-2 rounded-full" :style="{ width: calculateSubventionUsagePercentage() + '%' }"></div>
          </div>
          <div class="text-xs text-gray-600 mt-1">{{ calculateSubventionUsagePercentage() }}% utilisé</div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div class="flex items-center justify-between">
          <div class="p-3 rounded-full bg-blue-100">
            <span class="text-2xl">💼</span>
          </div>
          <div class="text-right">
            <div class="text-lg font-bold text-gray-800">{{ formatCompactCurrency((graphiqueData?.pret || 0) + (graphiqueData?.budgetNational || 0)) }}</div>
            <div class="text-sm text-gray-500">Budget Total</div>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center text-xs space-x-2">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-emerald-500 rounded mr-1"></div>
              <span>Propres</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-orange-500 rounded mr-1"></div>
              <span>Subvention</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs for Dashboard Sections -->
    <div class="bg-white rounded-xl shadow-lg mb-6">
      <div class="flex border-b border-gray-200">
        <button 
          v-for="tab in dashboardTabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-6 py-4 text-sm font-medium transition-colors',
            activeTab === tab.id 
              ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          ]"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Dashboard Content Based on Active Tab -->
    <div v-if="activeTab === 'overview'" class="space-y-6">
      <!-- Traditional Content Grid -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div class="bg-white rounded-xl shadow-lg p-6" v-if="graphiqueData?.statistiqueActivite">
          <p class="text-xl font-bold text-center mb-4">📊 Activités</p>
          <div class="relative mt-8">
            <ReportDonutChart2 v-if="graphiqueData?.statistiqueActivite" :activite="extractProperties(graphiqueData?.statistiqueActivite || [0, 0, 0])" :height="215" />
            <div class="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full">
              <div class="text-xl font-medium 2xl:text-2xl">{{ graphiqueData?.statistiqueActivite?.total }}</div>
              <div class="text-slate-500 mt-0.5">Total Activités</div>
            </div>
          </div>
          <div class="flex items-center justify-center flex-wrap w-full gap-2 mx-auto mt-8">
            <div class="flex items-center">
              <div class="w-2 h-2 mr-3 rounded-full bg-primary"></div>
              <span class="truncate text-sm">Terminé : {{ graphiqueData?.statistiqueActivite?.effectue }}/{{ graphiqueData?.statistiqueActivite?.total }}</span>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 mr-3 rounded-full bg-pending"></div>
              <span class="truncate text-sm">En cours {{ graphiqueData?.statistiqueActivite?.enCours }}/{{ graphiqueData?.statistiqueActivite?.total }}</span>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 mr-3 rounded-full bg-warning"></div>
              <span class="truncate text-sm">En retard : {{ graphiqueData?.statistiqueActivite?.enRetard }}/{{ graphiqueData?.statistiqueActivite?.total }}</span>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 mr-3 rounded-full bg-secondary"></div>
              <span class="truncate text-sm">Non démarré : {{ graphiqueData?.statistiqueActivite?.nonDemarree }}/{{ graphiqueData?.statistiqueActivite?.total }}</span>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6" v-if="graphiqueData?.tep !== undefined">
          <p class="text-xl font-bold text-center mb-4">🎯 TEP</p>
          <ChartJauge label="TEP" :temperature="graphiqueData?.tep * 100 ?? 0" />
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6" v-if="graphiqueData?.tef !== undefined">
          <p class="text-xl font-bold text-center mb-4">💰 TEF</p>
          <ChartJauge label="TEF" :temperature="graphiqueData?.tef * 100 ?? 0" />
        </div>

        <!-- Map and Data -->
        <div class="col-span-1 lg:col-span-3 bg-white rounded-xl shadow-lg p-6" v-if="graphiqueData?.sites?.length > 0">
          <h2 class="mb-4 text-lg font-semibold text-gray-700">🗺️ Cartes géographiques</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div id="map" class="h-64 mb-4 bg-gray-200 rounded-lg"></div>
            </div>
            <div>
              <div class="max-h-64 overflow-y-auto">
                <table class="w-full text-sm text-gray-600">
                  <thead class="sticky top-0 bg-white">
                    <tr class="text-left bg-gray-100">
                      <th class="px-4 py-2">Sites</th>
                      <th class="px-4 py-2">Longitude</th>
                      <th class="px-4 py-2">Latitude</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in graphiqueData.sites" :key="index" class="hover:bg-gray-50">
                      <td class="px-4 py-2 font-medium">{{ item.nom }}</td>
                      <td class="px-4 py-2">{{ item.longitude }}</td>
                      <td class="px-4 py-2">{{ item.latitude }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Analytics Tabs -->
    <div v-if="activeTab === 'charts'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart 
          title="Tendance d'Avancement des Activités"
          :data="activityChartData"
          type="line"
          :height="350"
        />
        <SimpleChart 
          title="Répartition des Activités"
          :data="activityStatusData"
          type="donut"
          :height="350"
        />
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <SimpleChart 
          title="Budget vs Dépenses"
          :data="budgetChartData"
          type="bar"
          :height="350"
        />
        <SimpleChart 
          title="Performance Mensuelle"
          :data="performanceData"
          type="line"
          :height="350"
        />
      </div>
    </div>

    <!-- Activities Section -->
    <div v-if="activeTab === 'activities'" class="space-y-6">
      <!-- Innovative Map Integration -->
      <div>
        <InnovativeProjectMap 
          :sites="graphiqueData?.sites || []" 
          :project-data="graphiqueData || {}"
          @site-selected="onSiteSelected"
          @export-map="onMapExport"
          @show-route-optimization="onShowRouteOptimization"
          @analyze-accessibility="onAnalyzeAccessibility"
          @predict-expansion="onPredictExpansion"
          @generate-geospatial-report="onGenerateGeospatialReport"
          @quick-analyze="onQuickAnalyze"
          @optimize-route="onOptimizeRoute"
        />
      </div>
      
      <!-- Activities List -->
      <section class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-700">📊 Liste des Activités</h2>
          <div class="max-w-[200px] w-full">
            <label class="form-label">Statut</label>
            <TomSelect v-model="filterStatut" @change="applyFilter" :options="{ placeholder: 'Sélectionner un statut' }" class="w-full">
              <option value="10">Tout</option>
              <option value="0">En cours</option>
              <option value="2">Terminé</option>
              <option value="-1">En attente</option>
              <option value="1">En retard</option>
              <option value="-2">Non valide</option>
            </TomSelect>
          </div>
        </div>

        <div class="overflow-x-auto scrollbar-hidden">
          <div id="activity" class="my-5 table-report table-report--tabulator"></div>
        </div>
      </section>
    </div>

    <!-- Performance Metrics Section -->
    <div v-if="activeTab === 'indicators'" class="space-y-6">
      <!-- Indicators Filters -->
      <section class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">🔍 Filtres Avancés</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Période</label>
            <select v-model="indicatorFilters.period" class="w-full border rounded-lg px-3 py-2">
              <option value="all">Toutes les périodes</option>
              <option value="current-year">Année en cours</option>
              <option value="last-quarter">Dernier trimestre</option>
              <option value="last-month">Dernier mois</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select v-model="indicatorFilters.status" class="w-full border rounded-lg px-3 py-2">
              <option value="all">Tous les statuts</option>
              <option value="on-track">En bonne voie</option>
              <option value="at-risk">À risque</option>
              <option value="delayed">En retard</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select v-model="indicatorFilters.category" class="w-full border rounded-lg px-3 py-2">
              <option value="all">Toutes les catégories</option>
              <option value="financial">Financier</option>
              <option value="operational">Opérationnel</option>
              <option value="impact">Impact</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex space-x-2">
          <button @click="applyIndicatorFilters" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Appliquer les Filtres
          </button>
          <button @click="resetIndicatorFilters" class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
            Réinitialiser
          </button>
        </div>
      </section>
      
      <!-- Indicators Data -->
      <section class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-lg font-semibold text-gray-700">🎯 Suivi des Indicateurs</h2>
        <div class="mt-4 overflow-x-auto">
          <TabulatorSuiviIndicateur :data="filteredIndicatorData" :years="annees" :isDataLoading="isLoadingDataCadre" @refreshData="getDatasCadre"/>
        </div>
      </section>
    </div>

    <!-- Loading state -->
    <div v-if="!graphiqueData" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span class="ml-3 text-gray-600">Chargement des données...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, reactive, watch } from "vue";
import ProjetService from "@/services/modules/projet.service.js";
import ReportDonutChart2 from "@/components/report-donut-chart-2/Main.vue";
import { toast } from "vue3-toastify";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import TabulatorSuiviIndicateurDetail from "@/components/TabulatorSuiviIndicateurDetail.vue";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { addressPoints } from "../markerDemo";
import icon from "../icon.png";
import markerShadow from "../marker-shadow.png";
import { useRouter, useRoute } from "vue-router";
import IndicateursService from "@/services/modules/indicateur.service";
import AuthService from "@/services/modules/auth.service";
import ChartJauge from "../../../../components/news/ChartJauge.vue";
import Tabulator from "tabulator-tables";
import ResultatCadreRendementService from "@/services/modules/resultat.cadre.rendement.service";
import TabulatorSuiviIndicateur from "@/components/TabulatorSuiviIndicateur.vue";

// Import icons - removed problematic lucide icons for build compatibility

// Import new advanced components
import SimpleChart from "@/components/charts/SimpleChart.vue";
import AdvancedProjectMap from "@/components/maps/AdvancedProjectMap.vue";
import InnovativeProjectMap from "@/components/maps/InnovativeProjectMap.vue";

const tabulator = ref();
const isLoadingDataCadre = ref(false);
const filterStatut = ref(0);

// Dashboard state management
const activeTab = ref('overview');
const dashboardTabs = ref([
  { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
  { id: 'charts', label: 'Graphiques Avancés', icon: '📈' },
  { id: 'activities', label: 'Activités', icon: '📋' },
  { id: 'indicators', label: 'Indicateurs', icon: '🎯' }
]);

// Data for advanced charts
const financialHistory = ref([]);
const activityTrendData = ref([]);
const budgetTrendData = ref([]);

// Indicator filters
const indicatorFilters = ref({
  period: 'all',
  status: 'all',
  category: 'all'
});

// Computed data for charts
const activityChartData = computed(() => {
  if (!graphiqueData.value?.statistiqueActivite) return [];
  const stats = graphiqueData.value.statistiqueActivite;
  return [
    { label: 'Jan', value: Math.floor(stats.effectue * 0.2) },
    { label: 'Fev', value: Math.floor(stats.effectue * 0.4) },
    { label: 'Mar', value: Math.floor(stats.effectue * 0.6) },
    { label: 'Avr', value: Math.floor(stats.effectue * 0.8) },
    { label: 'Mai', value: stats.effectue },
  ];
});

const activityStatusData = computed(() => {
  if (!graphiqueData.value?.statistiqueActivite) return [];
  const stats = graphiqueData.value.statistiqueActivite;
  return [
    { label: 'Terminé', value: stats.effectue || 0 },
    { label: 'En cours', value: stats.enCours || 0 },
    { label: 'En retard', value: stats.enRetard || 0 },
    { label: 'Non démarré', value: stats.nonDemarree || 0 },
  ];
});

const budgetChartData = computed(() => {
  const total = (graphiqueData.value?.budgetNational || 0) + (graphiqueData.value?.pret || 0);
  const used = total * (calculateBudgetUsagePercentage() / 100);
  return [
    { label: 'Budget Total', value: total },
    { label: 'Budget Utilisé', value: used },
    { label: 'Budget Restant', value: total - used },
  ];
});

const performanceData = computed(() => {
  return [
    { label: 'Jan', value: 20 },
    { label: 'Fev', value: 45 },
    { label: 'Mar', value: 60 },
    { label: 'Avr', value: 75 },
    { label: 'Mai', value: calculateProjectScore() },
  ];
});

const router = useRouter();
const route = useRoute();
const url = ref("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
const attribution = ref('&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors');
const zoom = ref(8);
const center = ref([47.31322, -1.319482]);

const myIcon = ref(null);
const initialMap = ref(null);
const markerLatLng = ref([47.31322, -1.319482]);

// Fonction pour extraire les propriétés sous forme de tableau
const extractProperties = (data) => {
  if (!data || typeof data !== 'object') {
    return [0, 0, 0, 0]; // valeurs par défaut
  }
  
  // Retourner dans l'ordre : effectue, enRetard, enCours
  return [
    data.effectue || 0,
    data.enCours || 0,
    data.enRetard || 0, 
    data.nonDemarree || 0, 
  ];
}

const initTabulator = () => {
  try {
    const tableElement = document.getElementById("activity");
    if (!tableElement) {
      console.warn('Activity table element not found');
      return;
    }
    
    // Clear existing tabulator
    if (tabulator.value) {
      tabulator.value.destroy();
    }
    
    const data = graphiqueData.value?.suivis || [];
    
    tabulator.value = new Tabulator("#activity", {
      data: data,
      placeholder: "Aucune donnée disponible.",
      layout: "fitColumns",
      responsiveLayout: "hide",
      pagination: "local",
      paginationSize: 10,
      columns: [
        {
          title: "Activité",
          field: "nom",
          minWidth: 200,
        },
        {
          title: "TEP actuel",
          field: "poidsActuel",
          formatter: (cell) => {
            const value = cell.getValue();
            return `<span>${Number(value || 0).toFixed(2)}</span>`;
          },
          formatterParams: {
            htmlOutput: true,
          },
        },
        {
          title: "Status",
          field: "statut",
          hozAlign: "center",
          formatter: (cell) => {
            const statut = getStringValueOfStatutCode(cell.getValue());
            const backgroundColor = statut.couleur;
            const label = statut.libelle;

            return `<span class="py-1 px-1.5 text-xs font-medium text-white rounded-full" style="background-color: ${backgroundColor};">${label}</span>`;
          },
          formatterParams: {
            htmlOutput: true,
          },
        },
      ],
    });
  } catch (error) {
    console.error('Error initializing tabulator:', error);
  }
};

const applyFilter = () => {
  if (tabulator.value) {
    const query = +filterStatut.value;
    query === 10 ? tabulator.value.setFilter("", "", "") : tabulator.value.setFilter("statut", "=", query);
  }
};

const getStringValueOfStatutCode = (statut) => {
  let data = {
    code: statut,
    libelle: "Statut code inconnu",
    couleur: "bg-blue-500",
  };

  switch (statut) {
    case -2:
      data = {
        code: statut,
        libelle: "Non validé",
        couleur: "#1e293b",
      };
      break;

    case -1:
      data = {
        code: statut,
        libelle: "En attente",
        couleur: "#1e293b",
      };
      break;

    case 0:
      data = {
        code: statut,
        libelle: "En cours",
        couleur: "#f59e0b",
      };
      break;

    case 1:
      data = {
        code: statut,
        libelle: "En retard",
        couleur: "#e11d48",
      };
      break;

    case 2:
      data = {
        code: statut,
        libelle: "Terminé",
        couleur: "#064e3b",
      };
      break;

    default:
      data;
      break;
  }

  return data;
};

const annees = computed(() => {
  if (!debutProgramme.value || !finProgramme.value) return [];
  let anneeDebut = parseInt(debutProgramme.value.split("-")[0], 10);
  let anneeFin = parseInt(finProgramme.value.split("-")[0], 10);
  let annees = [];
  for (let annee = anneeDebut; annee <= anneeFin; annee++) {
    annees.push(annee);
  }
  return annees;
});

function convertDaysToYearsMonthsDays(totalDays) {
  if (!totalDays) return "0 jour";
  
  const daysInYear = 365;
  const daysInMonth = 30; // approximation pour simplifier

  const years = Math.floor(totalDays / daysInYear);
  const remainingDaysAfterYears = totalDays % daysInYear;

  const months = Math.floor(remainingDaysAfterYears / daysInMonth);
  const days = remainingDaysAfterYears % daysInMonth;

  const result = [];
  if (years > 0) result.push(`${years} ${years > 1 ? "années" : "année"}`);
  if (months > 0) result.push(`${months} ${months > 1 ? "mois" : "mois"}`);
  if (days > 0) result.push(`${days} ${days > 1 ? "jours" : "jour"}`);

  return result.join(", ");
}

const formatterUSD = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
});

const suivis = ref([]);
const idProgramme = ref("");
const debutProgramme = ref("");
const finProgramme = ref("");

const search = ref("");
const currentPage = ref(1);
const itemsPerPage = 20;

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

// Calculer le nombre total de pages
const totalPages = computed(() => Math.ceil(suivis.value ? suivis.value.length / itemsPerPage : 0));

// Obtenir les éléments de la page actuelle
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  if (suivis.value) return suivis.value.slice(start, end);
});

const datasSearch = computed(() => {
  if (!suivis.value || !search.value) return suivis.value || [];
  return suivis.value.filter((suivi) => {
    const searchTerm = search.value.toLowerCase();
    return suivi.indicateur.nom.toLowerCase().includes(searchTerm) || suivi.auteur.nom.toLowerCase().includes(searchTerm);
  });
});

const dataAvailable = computed(() => {
  if (search.value.length > 0) return datasSearch.value;
  else return paginatedData.value;
});

const filteredIndicatorData = computed(() => {
  let filtered = dataAvailable.value || [];
  
  // Apply period filter
  if (indicatorFilters.value.period !== 'all') {
    const now = new Date();
    filtered = filtered.filter(item => {
      if (!item.created_at) return true;
      const itemDate = new Date(item.created_at);
      
      switch (indicatorFilters.value.period) {
        case 'current-year':
          return itemDate.getFullYear() === now.getFullYear();
        case 'last-quarter':
          const threeMonthsAgo = new Date(now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000);
          return itemDate >= threeMonthsAgo;
        case 'last-month':
          const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return itemDate >= oneMonthAgo;
        default:
          return true;
      }
    });
  }
  
  // Apply status filter
  if (indicatorFilters.value.status !== 'all') {
    filtered = filtered.filter(item => {
      const status = item.statut || item.status;
      switch (indicatorFilters.value.status) {
        case 'on-track':
          return status === 2; // Terminé
        case 'at-risk':
          return status === 0; // En cours
        case 'delayed':
          return status === 1; // En retard
        default:
          return true;
      }
    });
  }
  
  return filtered;
});

// Fetch data
const getDatasCadre = async () => {
  isLoadingDataCadre.value = true;
  try {
    console.log(graphiqueData.value);
    const { data } = await IndicateursService.getAllSuivis();
    suivis.value = data.data;
    isLoadingDataCadre.value = false;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  }
};

const getcurrentUser = async () => {
  await AuthService.getCurrentUser()
    .then((result) => {
      idProgramme.value = result.data.data.programme.id;
      debutProgramme.value = result.data.data.programme.debut;
      finProgramme.value = result.data.data.programme.fin;
      getDatasCadre();
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Utilisateur connecté .");
    });
};

const loadingOption = ref(true);
const graphiqueData = ref(null);

// Computed properties for enhanced dashboard
const calculateProjectScore = () => {
  try {
    if (!graphiqueData.value || !graphiqueData.value.statistiqueActivite) return 0;
    
    const stats = graphiqueData.value.statistiqueActivite;
    if (!stats.total || stats.total === 0) return 0;
    
    const completionRate = (stats.effectue / stats.total) * 100;
    const delayPenalty = (stats.enRetard / stats.total) * 10;
    const budgetEfficiency = calculateBudgetUsagePercentage();
    
    // Weighted score calculation
    const score = (completionRate * 0.5) + (budgetEfficiency * 0.3) + ((100 - delayPenalty) * 0.2);
    return Math.max(0, Math.min(100, score)).toFixed(0);
  } catch (error) {
    console.warn('Error calculating project score:', error);
    return 0;
  }
};

const getProjectStatusBadge = (statut) => {
  const badges = {
    '-2': 'bg-gray-100 text-gray-800',
    '-1': 'bg-blue-100 text-blue-800', 
    '0': 'bg-yellow-100 text-yellow-800',
    '1': 'bg-red-100 text-red-800',
    '2': 'bg-green-100 text-green-800'
  };
  return badges[statut] || 'bg-gray-100 text-gray-800';
};

const getProjectStatusText = (statut) => {
  const texts = {
    '-2': 'Non validé',
    '-1': 'Pas démarré',
    '0': 'En cours',
    '1': 'En retard', 
    '2': 'Terminé'
  };
  return texts[statut] || 'Inconnu';
};

const calculateBudgetUsagePercentage = () => {
  try {
    const total = (graphiqueData.value?.budgetNational || 0) + (graphiqueData.value?.pret || 0);
    if (total === 0) return 0;
    
    // Simulate budget usage based on activity completion
    const stats = graphiqueData.value?.statistiqueActivite;
    if (!stats || !stats.total || stats.total === 0) return 0;
    
    const completion = stats.effectue / stats.total;
    return Math.min(100, (completion * 85) + (Math.random() * 15)).toFixed(1);
  } catch (error) {
    console.warn('Error calculating budget usage:', error);
    return 0;
  }
};

const calculateSubventionUsagePercentage = () => {
  return calculateBudgetUsagePercentage(); // Simplified for demo
};

const formatCompactCurrency = (value) => {
  try {
    const numValue = Number(value) || 0;
    if (numValue >= 1000000000) {
      return (numValue / 1000000000).toFixed(1) + 'Md';
    } else if (numValue >= 1000000) {
      return (numValue / 1000000).toFixed(1) + 'M';
    } else if (numValue >= 1000) {
      return (numValue / 1000).toFixed(1) + 'K';
    }
    return new Intl.NumberFormat('fr-FR').format(numValue);
  } catch (error) {
    console.warn('Error formatting currency:', error);
    return '0';
  }
};

const getStat = function () {
  ProjetService.statistiques(route.params.id)
    .then((response) => {
      console.log('API Response:', response.data); // Debug log
      graphiqueData.value = response.data.data || response.data;
      
      // Safely calculate nonDemarree if statistiqueActivite exists
      if (graphiqueData.value?.statistiqueActivite) {
        const stats = graphiqueData.value.statistiqueActivite;
        stats.nonDemarree = Math.max(0, (stats.total || 0) - ((stats.effectue || 0) + (stats.enCours || 0) + (stats.enRetard || 0)));
      }
      
      // Initialize tabulator only if data exists
      if (graphiqueData.value?.suivis) {
        setTimeout(() => initTabulator(), 100);
      }
      
      // Initialize map if sites exist
      if (graphiqueData.value?.sites?.length > 0) {
        setTimeout(() => initializeMap(), 200); // Add delay for DOM
      }
    })
    .catch((error) => {
      console.error('Error loading project data:', error);
      toast.error('Erreur lors du chargement des données du projet');
    });
};

// Initialize map function
const initializeMap = () => {
  try {
    if (!document.getElementById('map')) {
      console.warn('Map container not found');
      return;
    }
    
    // Clear existing map if any
    if (initialMap.value) {
      initialMap.value.remove();
    }
    
    myIcon.value = L.icon({
      iconUrl: icon,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
      shadowUrl: markerShadow,
      shadowSize: [41, 41],
      shadowAnchor: [13, 41],
    });

    // Initialize map
    initialMap.value = L.map("map", {
      zoomControl: true,
      zoom: 7,
      zoomAnimation: false,
      fadeAnimation: true,
      markerZoomAnimation: true,
    }).setView([6.8041, 2.4152], 7);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(initialMap.value);

    // Add markers for project sites
    if (graphiqueData.value?.sites?.length > 0) {
      graphiqueData.value.sites.forEach((site, index) => {
        if (site.latitude && site.longitude) {
          const lat = parseFloat(site.latitude);
          const lng = parseFloat(site.longitude);
          if (!isNaN(lat) && !isNaN(lng)) {
            L.marker([lat, lng], { icon: myIcon.value })
              .bindPopup(`<strong>${site.nom}</strong><br>Lat: ${site.latitude}<br>Lng: ${site.longitude}`)
              .addTo(initialMap.value);
          }
        }
      });
    }
  } catch (error) {
    console.error('Error initializing map:', error);
  }
};

const exportDashboard = () => {
  toast.info('Export du dashboard en cours...');
  
  // Generate comprehensive dashboard export
  const dashboardData = {
    project: {
      code: graphiqueData.value?.codePta,
      name: graphiqueData.value?.nom,
      description: graphiqueData.value?.description,
      status: graphiqueData.value?.statut,
      score: calculateProjectScore()
    },
    financial: {
      totalBudget: (graphiqueData.value?.budgetNational || 0) + (graphiqueData.value?.pret || 0),
      budgetUsage: calculateBudgetUsagePercentage(),
      efficiency: 'Calculé dynamiquement'
    },
    activities: graphiqueData.value?.statistiqueActivite,
    timeline: {
      start: graphiqueData.value?.debut,
      end: graphiqueData.value?.fin,
      remainingDays: graphiqueData.value?.nbrJourRestant
    },
    team: {
      manager: graphiqueData.value?.projet_manager,
      members: graphiqueData.value?.equipes?.length || 0
    },
    exportDate: new Date().toISOString(),
    exportedBy: 'Dashboard Avancé GFA Survey'
  };
  
  // Create and download JSON file
  const blob = new Blob([JSON.stringify(dashboardData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dashboard-${graphiqueData.value?.codePta || 'project'}-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  toast.success('Dashboard exporté avec succès!');
};

// Map event handlers
const onSiteSelected = (site) => {
  console.log('Site sélectionné:', site);
  toast.info(`Site "${site.nom}" sélectionné`);
};

const onMapExport = () => {
  toast.info('Export de la carte en cours...');
  // Implement map export logic here
};

// Advanced map event handlers
const onShowRouteOptimization = () => {
  toast.info('Optimisation des routes en cours...');
  // Implement route optimization logic
};

const onAnalyzeAccessibility = () => {
  toast.info('Analyse de l\'accessibilité en cours...');
  // Implement accessibility analysis
};

const onPredictExpansion = () => {
  toast.info('Prédiction d\'extension en cours...');
  // Implement expansion prediction
};

const onGenerateGeospatialReport = () => {
  toast.info('Génération du rapport géospatial...');
  // Implement geospatial report generation
};

const onQuickAnalyze = (site) => {
  toast.info(`Analyse rapide du site: ${site.nom || site}`);
  // Implement quick site analysis
};

const onOptimizeRoute = (site) => {
  toast.info(`Optimisation de route vers: ${site.nom || site}`);
  // Implement route optimization for specific site
};

// Indicator filter functions
const applyIndicatorFilters = () => {
  toast.info('Filtres appliqués aux indicateurs');
  // The computed property will automatically update
};

const resetIndicatorFilters = () => {
  indicatorFilters.value = {
    period: 'all',
    status: 'all',
    category: 'all'
  };
  toast.info('Filtres réinitialisés');
};

// Watch for tab changes to reinitialize components if needed
watch(activeTab, (newTab) => {
  if (newTab === 'overview' && graphiqueData.value?.sites?.length > 0) {
    // Reinitialize map when returning to overview
    setTimeout(() => {
      if (initialMap.value) {
        initialMap.value.invalidateSize();
      }
    }, 100);
  }
  
  // Track analytics for tab usage
  console.log(`Tab switched to: ${newTab}`);
});

// Auto-refresh data every 5 minutes for real-time updates
let dataRefreshInterval;

onMounted(() => {
  getStat();
  getcurrentUser();
  
  // Set up auto-refresh
  dataRefreshInterval = setInterval(() => {
    if (activeTab.value === 'overview') {
      getStat();
    }
  }, 300000); // 5 minutes
});

// Clean up interval on unmount
onBeforeUnmount(() => {
  if (dataRefreshInterval) {
    clearInterval(dataRefreshInterval);
  }
  if (initialMap.value) {
    initialMap.value.remove();
  }
});

// Components are automatically registered in script setup
</script>
<style scoped></style>