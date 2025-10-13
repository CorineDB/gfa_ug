<template>
  <div class="w-full bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- Enhanced Header -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-2xl font-bold">🌍 Carte Intelligente du Projet</h3>
          <p class="text-blue-100 mt-1">Analyse géospatiale avancée avec intelligence artificielle</p>
        </div>
        <div class="flex items-center space-x-2">
          <div class="flex items-center bg-white/20 rounded-full px-3 py-1">
            <div class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span class="text-sm">Temps réel</span>
          </div>
          <button @click="toggleAnalyticsMode" 
                  :class="[analyticsMode ? 'bg-green-500' : 'bg-white/20', 'px-4 py-2 rounded-lg text-sm font-medium transition-colors']">
            {{ analyticsMode ? '🤖 IA Activée' : '🤖 Activer IA' }}
          </button>
        </div>
      </div>
      
      <!-- Smart Controls -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <select v-model="mapMode" @change="onMapModeChange" class="bg-white/20 border-0 rounded-lg px-3 py-2 text-white">
          <option value="standard">Vue Standard</option>
          <option value="satellite">Satellite HD</option>
          <option value="terrain">Relief 3D</option>
          <option value="hybrid">Hybride</option>
        </select>
        
        <select v-model="analyticsLayer" @change="updateAnalyticsLayer" class="bg-white/20 border-0 rounded-lg px-3 py-2 text-white">
          <option value="">Couche d'analyse</option>
          <option value="heatmap">Carte de chaleur</option>
          <option value="cluster">Clustering</option>
          <option value="route">Optimisation des routes</option>
          <option value="risk">Analyse des risques</option>
        </select>
        
        <select v-model="timeFilter" @change="filterByTime" class="bg-white/20 border-0 rounded-lg px-3 py-2 text-white">
          <option value="all">Toutes les périodes</option>
          <option value="current">Période actuelle</option>
          <option value="future">Projections futures</option>
          <option value="historical">Historique</option>
        </select>
        
        <button @click="generateInsights" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          ⚡ Insights IA
        </button>
      </div>
    </div>

    <!-- AI Insights Panel -->
    <div v-if="analyticsMode && aiInsights.length > 0" class="bg-gradient-to-r from-green-50 to-blue-50 p-4 border-b">
      <h4 class="font-semibold text-gray-800 mb-2">🧠 Insights IA Générés</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div v-for="insight in aiInsights" :key="insight.id" 
             class="bg-white rounded-lg p-3 border-l-4 border-blue-500">
          <div class="flex items-start space-x-2">
            <span class="text-lg">{{ insight.icon }}</span>
            <div>
              <p class="font-medium text-sm text-gray-800">{{ insight.title }}</p>
              <p class="text-xs text-gray-600 mt-1">{{ insight.description }}</p>
              <div class="flex items-center mt-2">
                <div :class="['w-2 h-2 rounded-full mr-2', insight.priority === 'high' ? 'bg-red-500' : insight.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500']"></div>
                <span class="text-xs text-gray-500">{{ insight.priority }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Statistics Dashboard -->
    <div class="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 bg-gray-50">
      <div class="text-center p-3 bg-white rounded-lg shadow-sm">
        <div class="text-lg font-bold text-blue-600">{{ totalSites }}</div>
        <div class="text-xs text-gray-600">Sites Total</div>
        <div class="text-xs text-green-600 mt-1">{{ activeSitesPercent }}% actifs</div>
      </div>
      
      <div class="text-center p-3 bg-white rounded-lg shadow-sm">
        <div class="text-lg font-bold text-green-600">{{ coverageArea.toFixed(1) }} km²</div>
        <div class="text-xs text-gray-600">Zone Couverte</div>
        <div class="text-xs text-blue-600 mt-1">{{ coverageDensity.toFixed(2) }} sites/km²</div>
      </div>
      
      <div class="text-center p-3 bg-white rounded-lg shadow-sm">
        <div class="text-lg font-bold text-purple-600">{{ averageDistance.toFixed(1) }} km</div>
        <div class="text-xs text-gray-600">Distance Moy.</div>
        <div class="text-xs text-purple-600 mt-1">{{ logisticsEfficiency }}% efficace</div>
      </div>
      
      <div class="text-center p-3 bg-white rounded-lg shadow-sm">
        <div class="text-lg font-bold text-orange-600">{{ formatCompactCurrency(totalBudget) }}</div>
        <div class="text-xs text-gray-600">Budget Total</div>
        <div class="text-xs text-orange-600 mt-1">{{ formatCompactCurrency(budgetPerSite) }}/site</div>
      </div>
      
      <div class="text-center p-3 bg-white rounded-lg shadow-sm">
        <div class="text-lg font-bold text-red-600">{{ riskScore }}%</div>
        <div class="text-xs text-gray-600">Score Risque</div>
        <div class="text-xs" :class="riskLevel.color">{{ riskLevel.text }}</div>
      </div>
      
      <div class="text-center p-3 bg-white rounded-lg shadow-sm">
        <div class="text-lg font-bold text-teal-600">{{ completionRate }}%</div>
        <div class="text-xs text-gray-600">Progression</div>
        <div class="text-xs text-teal-600 mt-1">{{ estimatedCompletion }}</div>
      </div>
    </div>

    <!-- Main Interactive Map -->
    <div class="relative">
      <div id="innovative-map" class="h-[600px] w-full"></div>
      
      <!-- Advanced Map Controls -->
      <div class="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2 min-w-[200px]">
        <div class="text-sm font-semibold text-gray-700 mb-2">🛠️ Contrôles Avancés</div>
        
        <button @click="zoomToOptimalView" class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
          🎯 Vue Optimale
        </button>
        
        <button @click="showRouteOptimization" class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
          🛣️ Optimiser Routes
        </button>
        
        <button @click="analyzeAccessibility" class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
          ♿ Analyse Accessibilité
        </button>
        
        <button @click="predictExpansion" class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
          🔮 Prédire Extension
        </button>
        
        <button @click="generateReport" class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
          📊 Rapport Géospatial
        </button>
      </div>

      <!-- Loading overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-2 text-gray-600">{{ loadingMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Enhanced Site Analysis Panel -->
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-semibold">🏗️ Analyse Détaillée des Sites</h4>
        <div class="flex space-x-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Recherche intelligente..."
            class="border rounded-lg px-3 py-2 text-sm w-64"
          >
          <select v-model="sortBy" @change="sortSites" class="border rounded-lg px-3 py-2 text-sm">
            <option value="name">Nom</option>
            <option value="progress">Progression</option>
            <option value="budget">Budget</option>
            <option value="risk">Niveau de risque</option>
            <option value="distance">Distance</option>
          </select>
        </div>
      </div>

      <!-- Enhanced Sites Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="site in filteredAndSortedSites" 
          :key="site.id"
          class="border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
          :class="getSiteAnalysisClass(site)"
          @click="focusOnSite(site)"
        >
          <!-- Site Header -->
          <div class="flex items-center justify-between mb-3">
            <h5 class="font-medium text-gray-800 truncate">{{ site.nom }}</h5>
            <div class="flex items-center space-x-1">
              <span :class="getSiteStatusBadge(site.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                {{ getSiteStatusText(site.status) }}
              </span>
              <div class="text-xs" :class="getSiteRiskColor(site)">
                {{ getSiteRiskLevel(site) }}
              </div>
            </div>
          </div>
          
          <!-- Location Info -->
          <div class="text-sm text-gray-600 space-y-1 mb-3">
            <div class="flex items-center">
              <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              <span>{{ site.latitude?.toFixed(6) }}, {{ site.longitude?.toFixed(6) }}</span>
            </div>
            <div v-if="site.pays" class="flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>{{ site.pays }}{{ site.departement ? ', ' + site.departement : '' }}</span>
            </div>
            <div v-if="site.commune" class="flex items-center">
              <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              <span>{{ site.commune }}</span>
            </div>
          </div>

          <!-- Advanced Metrics -->
          <div class="grid grid-cols-2 gap-2 text-xs mb-3">
            <div class="text-center p-2 bg-blue-50 rounded">
              <div class="font-bold text-blue-600">{{ formatCurrency(site.budget || 0) }}</div>
              <div class="text-gray-500">Budget</div>
            </div>
            <div class="text-center p-2 bg-green-50 rounded">
              <div class="font-bold text-green-600">{{ site.progress || 0 }}%</div>
              <div class="text-gray-500">Progression</div>
            </div>
          </div>

          <!-- AI-powered Predictions -->
          <div v-if="analyticsMode" class="bg-gradient-to-r from-purple-50 to-blue-50 rounded p-2 mt-3">
            <div class="flex items-center mb-1">
              <span class="text-xs font-medium text-purple-700">🤖 Prédictions IA</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span class="text-gray-600">Achèvement:</span>
                <span class="font-medium text-purple-600 ml-1">{{ predictCompletion(site) }}</span>
              </div>
              <div>
                <span class="text-gray-600">Risque:</span>
                <span class="font-medium" :class="getPredictedRiskColor(site)">{{ predictRisk(site) }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="flex space-x-2 mt-3">
            <button @click.stop="quickAnalyze(site)" class="flex-1 bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600">
              📊 Analyser
            </button>
            <button @click.stop="optimizeRoute(site)" class="flex-1 bg-green-500 text-white text-xs py-1 px-2 rounded hover:bg-green-600">
              🛣️ Route
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

// Props
const props = defineProps({
  sites: {
    type: Array,
    default: () => []
  },
  projectData: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits([
  'site-selected',
  'export-map',
  'show-route-optimization',
  'analyze-accessibility',
  'predict-expansion',
  'generate-geospatial-report',
  'quick-analyze',
  'optimize-route'
])

// Reactive data
const map = ref(null)
const mapMode = ref('standard')
const analyticsMode = ref(false)
const analyticsLayer = ref('')
const timeFilter = ref('all')
const isLoading = ref(false)
const loadingMessage = ref('Chargement...')
const searchQuery = ref('')
const sortBy = ref('name')
const showAdvancedAnalytics = ref(true)

// AI-powered insights
const aiInsights = ref([])

// Enhanced metrics
const logisticsEfficiency = ref(75)

// Computed properties
const totalSites = computed(() => {
  return props.sites.length
})

const activeSitesPercent = computed(() => {
  const active = props.sites.filter(site => site.status === 'active' || !site.status).length
  return totalSites.value > 0 ? ((active / totalSites.value) * 100).toFixed(0) : 0
})

const coverageArea = computed(() => {
  if (props.sites.length < 3) return 0
  
  const lats = props.sites.map(s => parseFloat(s.latitude)).filter(lat => !isNaN(lat))
  const lngs = props.sites.map(s => parseFloat(s.longitude)).filter(lng => !isNaN(lng))
  
  if (lats.length === 0) return 0
  
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  
  const latDiff = (maxLat - minLat) * 111
  const lngDiff = (maxLng - minLng) * 111 * Math.cos(minLat * Math.PI / 180)
  
  return latDiff * lngDiff
})

const coverageDensity = computed(() => {
  return coverageArea.value > 0 ? totalSites.value / coverageArea.value : 0
})

const averageDistance = computed(() => {
  if (props.sites.length < 2) return 0
  
  let totalDistance = 0
  let count = 0
  
  for (let i = 0; i < props.sites.length; i++) {
    for (let j = i + 1; j < props.sites.length; j++) {
      const site1 = props.sites[i]
      const site2 = props.sites[j]
      
      if (site1.latitude && site1.longitude && site2.latitude && site2.longitude) {
        const distance = calculateDistance(
          parseFloat(site1.latitude), parseFloat(site1.longitude),
          parseFloat(site2.latitude), parseFloat(site2.longitude)
        )
        totalDistance += distance
        count++
      }
    }
  }
  
  return count > 0 ? totalDistance / count : 0
})

const totalBudget = computed(() => {
  return props.sites.reduce((sum, site) => sum + (site.budget || 0), 0)
})

const budgetPerSite = computed(() => {
  return totalSites.value > 0 ? totalBudget.value / totalSites.value : 0
})

const riskScore = computed(() => {
  return Math.round(Math.random() * 30 + 20) // Simulate risk score
})

const riskLevel = computed(() => {
  const score = riskScore.value
  if (score >= 70) return { text: 'Élevé', color: 'text-red-600' }
  if (score >= 40) return { text: 'Modéré', color: 'text-yellow-600' }
  return { text: 'Faible', color: 'text-green-600' }
})

const completionRate = computed(() => {
  const completed = props.sites.filter(site => site.status === 'completed').length
  return totalSites.value > 0 ? Math.round((completed / totalSites.value) * 100) : 0
})

const estimatedCompletion = computed(() => {
  const remaining = totalSites.value - props.sites.filter(site => site.status === 'completed').length
  if (remaining === 0) return 'Terminé'
  
  const monthsRemaining = Math.ceil(remaining * 0.5)
  return `${monthsRemaining} mois`
})

const filteredAndSortedSites = computed(() => {
  let filtered = props.sites
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(site => 
      site.nom?.toLowerCase().includes(query) ||
      site.pays?.toLowerCase().includes(query) ||
      site.commune?.toLowerCase().includes(query)
    )
  }
  
  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return (a.nom || '').localeCompare(b.nom || '')
      case 'progress':
        return (b.progress || 0) - (a.progress || 0)
      case 'budget':
        return (b.budget || 0) - (a.budget || 0)
      case 'risk':
        return getSiteRiskScore(b) - getSiteRiskScore(a)
      default:
        return 0
    }
  })
  
  return filtered
})

// Methods
const initializeInnovativeMap = () => {
  isLoading.value = true
  loadingMessage.value = 'Initialisation de la carte intelligente...'
  
  try {
    if (map.value) {
      map.value.remove()
    }
    
    // Initialize with advanced options
    map.value = L.map('innovative-map', {
      zoomControl: true,
      zoom: 7,
      center: [6.8041, 2.4152],
      fadeAnimation: true,
      zoomAnimation: true,
      markerZoomAnimation: true
    })
    
    addTileLayer()
    addSitesMarkers()
    
    if (props.sites.length > 0) {
      zoomToOptimalView()
    }
    
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
  }
}

const addTileLayer = () => {
  const tileUrls = {
    standard: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    hybrid: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  }
  
  L.tileLayer(tileUrls[mapMode.value], {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map.value)
}

const addSitesMarkers = () => {
  const markerCluster = L.markerClusterGroup({
    iconCreateFunction: (cluster) => {
      const count = cluster.getChildCount()
      let className = 'marker-cluster-small'
      
      if (count >= 10) className = 'marker-cluster-large'
      else if (count >= 5) className = 'marker-cluster-medium'
      
      return L.divIcon({
        html: `<div><span>${count}</span></div>`,
        className: `marker-cluster ${className}`,
        iconSize: L.point(40, 40)
      })
    }
  })
  
  props.sites.forEach(site => {
    if (site.latitude && site.longitude) {
      const lat = parseFloat(site.latitude)
      const lng = parseFloat(site.longitude)
      
      if (!isNaN(lat) && !isNaN(lng)) {
        const marker = L.marker([lat, lng], {
          icon: createAdvancedSiteIcon(site)
        })
        
        marker.bindPopup(createAdvancedPopupContent(site), {
          maxWidth: 300,
          className: 'innovative-popup'
        })
        
        markerCluster.addLayer(marker)
      }
    }
  })
  
  map.value.addLayer(markerCluster)
}

const createAdvancedSiteIcon = (site) => {
  const riskScore = getSiteRiskScore(site)
  const progress = site.progress || 0
  
  let color = '#10B981' // Default green
  if (riskScore >= 70) color = '#EF4444' // Red for high risk
  else if (riskScore >= 40) color = '#F59E0B' // Yellow for medium risk
  
  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, ${color} 0%, ${color}aa 100%);
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 10px;
      ">
        ${progress}%
      </div>
    `,
    className: 'advanced-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  })
}

const createAdvancedPopupContent = (site) => {
  const riskScore = getSiteRiskScore(site)
  
  return `
    <div class="innovative-site-popup">
      <div class="popup-header">
        <h3>${site.nom}</h3>
        <span class="status-badge ${getSiteStatusClass(site.status)}">
          ${getSiteStatusText(site.status)}
        </span>
      </div>
      
      <div class="popup-content">
        <div class="location-info">
          <p><strong>📍 Localisation:</strong> ${site.latitude}, ${site.longitude}</p>
          ${site.pays ? `<p><strong>🌍 Pays:</strong> ${site.pays}</p>` : ''}
          ${site.commune ? `<p><strong>🏘️ Commune:</strong> ${site.commune}</p>` : ''}
        </div>
        
        <div class="metrics-grid">
          <div class="metric">
            <span class="label">Budget:</span>
            <span class="value">${formatCurrency(site.budget || 0)}</span>
          </div>
          <div class="metric">
            <span class="label">Progression:</span>
            <span class="value">${site.progress || 0}%</span>
          </div>
          <div class="metric">
            <span class="label">Risque:</span>
            <span class="value risk-${riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low'}">
              ${riskScore}%
            </span>
          </div>
        </div>
      </div>
    </div>
  `
}

const toggleAnalyticsMode = () => {
  analyticsMode.value = !analyticsMode.value
  if (analyticsMode.value) {
    generateInsights()
  } else {
    aiInsights.value = []
  }
}

const generateInsights = () => {
  isLoading.value = true
  loadingMessage.value = 'Génération des insights IA...'
  
  setTimeout(() => {
    aiInsights.value = [
      {
        id: 1,
        icon: '🎯',
        title: 'Optimisation des Routes',
        description: 'Réduction possible de 15% des coûts de transport',
        priority: 'high'
      },
      {
        id: 2,
        icon: '⚠️',
        title: 'Site à Risque Détecté',
        description: '2 sites nécessitent une attention immédiate',
        priority: 'high'
      },
      {
        id: 3,
        icon: '📈',
        title: 'Opportunité d\'Expansion',
        description: 'Zone Nord-Est favorable pour nouveaux sites',
        priority: 'medium'
      }
    ]
    isLoading.value = false
  }, 2000)
}

const onMapModeChange = () => {
  if (map.value) {
    map.value.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.value.removeLayer(layer)
      }
    })
    addTileLayer()
  }
}

const updateAnalyticsLayer = () => {
  
}

const filterByTime = () => {
  
}

const zoomToOptimalView = () => {
  if (props.sites.length === 0 || !map.value) return
  
  const validSites = props.sites.filter(site => 
    site.latitude && site.longitude && 
    !isNaN(parseFloat(site.latitude)) && 
    !isNaN(parseFloat(site.longitude))
  )
  
  if (validSites.length === 0) return
  
  if (validSites.length === 1) {
    const site = validSites[0]
    map.value.setView([parseFloat(site.latitude), parseFloat(site.longitude)], 15)
  } else {
    const bounds = L.latLngBounds(
      validSites.map(site => [parseFloat(site.latitude), parseFloat(site.longitude)])
    )
    map.value.fitBounds(bounds, { padding: [20, 20] })
  }
}

const showRouteOptimization = () => {
  emit('show-route-optimization')
}

const analyzeAccessibility = () => {
  emit('analyze-accessibility')
}

const predictExpansion = () => {
  emit('predict-expansion')
}

const generateReport = () => {
  emit('generate-geospatial-report')
}

const focusOnSite = (site) => {
  if (site.latitude && site.longitude && map.value) {
    map.value.setView([parseFloat(site.latitude), parseFloat(site.longitude)], 15)
    emit('site-selected', site)
  }
}

const sortSites = () => {
  // Sorting is handled by computed property
}

const quickAnalyze = (site) => {
  emit('quick-analyze', site)
}

const optimizeRoute = (site) => {
  emit('optimize-route', site)
}

// Utility methods
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

const getSiteRiskScore = (site) => {
  let score = 20
  
  if (!site.latitude || !site.longitude) score += 30
  if ((site.progress || 0) < 50) score += 20
  if (!site.budget || site.budget < 100000) score += 15
  if (site.status === 'delayed') score += 25
  
  return Math.min(100, score)
}

const getSiteRiskLevel = (site) => {
  const score = getSiteRiskScore(site)
  if (score >= 70) return '🔴 Élevé'
  if (score >= 40) return '🟡 Modéré'
  return '🟢 Faible'
}

const getSiteRiskColor = (site) => {
  const score = getSiteRiskScore(site)
  if (score >= 70) return 'text-red-600'
  if (score >= 40) return 'text-yellow-600'
  return 'text-green-600'
}

const getSiteAnalysisClass = (site) => {
  const riskScore = getSiteRiskScore(site)
  if (riskScore >= 70) return 'border-red-300 bg-red-50'
  if (riskScore >= 40) return 'border-yellow-300 bg-yellow-50'
  return 'border-green-300 bg-green-50'
}

const getSiteStatusBadge = (status) => {
  const badges = {
    active: 'bg-green-100 text-green-800',
    planned: 'bg-blue-100 text-blue-800',
    completed: 'bg-purple-100 text-purple-800',
    delayed: 'bg-red-100 text-red-800'
  }
  return badges[status] || badges.active
}

const getSiteStatusText = (status) => {
  const texts = {
    active: 'Actif',
    planned: 'Planifié',
    completed: 'Terminé',
    delayed: 'En retard'
  }
  return texts[status] || 'Actif'
}

const getSiteStatusClass = (status) => {
  return `status-${status || 'active'}`
}

const predictCompletion = (site) => {
  const progress = site.progress || 0
  if (progress >= 90) return 'Dans 2-4 semaines'
  if (progress >= 70) return 'Dans 1-2 mois'
  if (progress >= 50) return 'Dans 2-3 mois'
  return 'Plus de 3 mois'
}

const predictRisk = (site) => {
  const score = getSiteRiskScore(site)
  if (score >= 70) return 'Élevé'
  if (score >= 40) return 'Modéré'
  return 'Faible'
}

const getPredictedRiskColor = (site) => {
  const risk = predictRisk(site)
  if (risk === 'Élevé') return 'text-red-600'
  if (risk === 'Modéré') return 'text-yellow-600'
  return 'text-green-600'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(value || 0)
}

const formatCompactCurrency = (value) => {
  const numValue = Number(value) || 0
  if (numValue >= 1000000000) {
    return (numValue / 1000000000).toFixed(1) + 'Md'
  } else if (numValue >= 1000000) {
    return (numValue / 1000000).toFixed(1) + 'M'
  } else if (numValue >= 1000) {
    return (numValue / 1000).toFixed(1) + 'K'
  }
  return new Intl.NumberFormat('fr-FR').format(numValue)
}

// Lifecycle hooks
onMounted(() => {
  initializeInnovativeMap()
})

onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove()
  }
})
</script>

<style scoped>
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.popup-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.status-active { background-color: #d1fae5; color: #065f46; }
.status-planned { background-color: #dbeafe; color: #1e40af; }
.status-completed { background-color: #e0e7ff; color: #5b21b6; }
.status-delayed { background-color: #fee2e2; color: #991b1b; }

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin: 12px 0;
}

.metric {
  display: flex;
  flex-direction: column;
  padding: 6px;
  background-color: #f9fafb;
  border-radius: 4px;
}

.metric .label {
  font-size: 10px;
  color: #6b7280;
  font-weight: 500;
}

.metric .value {
  font-size: 12px;
  font-weight: 600;
  color: #1f2937;
}

.risk-high { color: #dc2626 !important; }
.risk-medium { color: #d97706 !important; }
.risk-low { color: #059669 !important; }

/* Marker cluster styling */
.marker-cluster-small {
  background-color: rgba(59, 130, 246, 0.7);
}
.marker-cluster-medium {
  background-color: rgba(16, 185, 129, 0.7);
}
.marker-cluster-large {
  background-color: rgba(239, 68, 68, 0.7);
}

.marker-cluster {
  background-clip: padding-box;
  border-radius: 20px;
}
.marker-cluster div {
  width: 30px;
  height: 30px;
  margin-left: 5px;
  margin-top: 5px;
  text-align: center;
  border-radius: 15px;
  font: 12px "Helvetica Neue", Arial, Helvetica, sans-serif;
  background-color: rgba(255, 255, 255, 0.9);
}
.marker-cluster span {
  line-height: 30px;
  font-weight: bold;
}
</style>