<template>
  <div class="w-full bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold text-gray-800">🗺️ Carte Interactive du Projet</h3>
      <div class="flex space-x-2">
        <select v-model="mapView" @change="changeMapView" class="border rounded px-3 py-1 text-sm">
          <option value="standard">Vue Standard</option>
          <option value="satellite">Satellite</option>
          <option value="terrain">Terrain</option>
        </select>
        <button @click="showAllSites" class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
          📍 Voir Tous les Sites
        </button>
        <button @click="toggleHeatmap" class="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
          🔥 {{ showHeatmap ? 'Masquer' : 'Afficher' }} Heatmap
        </button>
      </div>
    </div>

    <!-- Map Statistics -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div class="text-center p-3 bg-blue-50 rounded">
        <div class="text-lg font-bold text-blue-600">{{ sites.length }}</div>
        <div class="text-sm text-gray-600">Sites Total</div>
      </div>
      <div class="text-center p-3 bg-green-50 rounded">
        <div class="text-lg font-bold text-green-600">{{ activeSites }}</div>
        <div class="text-sm text-gray-600">Sites Actifs</div>
      </div>
      <div class="text-center p-3 bg-yellow-50 rounded">
        <div class="text-lg font-bold text-yellow-600">{{ coverageArea.toFixed(1) }} km²</div>
        <div class="text-sm text-gray-600">Zone Couverte</div>
      </div>
      <div class="text-center p-3 bg-purple-50 rounded">
        <div class="text-lg font-bold text-purple-600">{{ averageDistance.toFixed(1) }} km</div>
        <div class="text-sm text-gray-600">Distance Moyenne</div>
      </div>
    </div>

    <!-- Main Map -->
    <div class="relative">
      <div id="advanced-map" class="h-96 w-full rounded-lg border-2 border-gray-200"></div>
      
      <!-- Map Controls Overlay -->
      <div class="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 space-y-2">
        <button @click="zoomToProject" class="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded">
          🎯 Zoom Projet
        </button>
        <button @click="measureDistance" class="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded">
          📏 Mesurer Distance
        </button>
        <button @click="exportMap" class="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded">
          💾 Exporter Carte
        </button>
      </div>

      <!-- Loading overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    </div>

    <!-- Sites List with Filters -->
    <div class="mt-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-semibold">Sites du Projet</h4>
        <div class="flex space-x-2">
          <input
            v-model="searchSite"
            type="text"
            placeholder="Rechercher un site..."
            class="border rounded px-3 py-1 text-sm w-48"
          >
          <select v-model="filterStatus" class="border rounded px-3 py-1 text-sm">
            <option value="">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="planned">Planifiés</option>
            <option value="completed">Terminés</option>
          </select>
        </div>
      </div>

      <!-- Sites Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="site in filteredSites" 
          :key="site.id"
          class="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          :class="getSiteCardClass(site)"
          @click="focusOnSite(site)"
        >
          <div class="flex items-center justify-between mb-2">
            <h5 class="font-medium text-gray-800">{{ site.nom }}</h5>
            <span :class="getSiteStatusBadge(site.status)" class="px-2 py-1 rounded text-xs font-medium">
              {{ getSiteStatusText(site.status) }}
            </span>
          </div>
          
          <div class="text-sm text-gray-600 space-y-1">
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
              <span>{{ site.commune }}{{ site.arrondissement ? ', ' + site.arrondissement : '' }}</span>
            </div>
            
            <div v-if="site.activities" class="flex items-center">
              <span class="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <span>{{ site.activities.length }} activité(s)</span>
            </div>
          </div>

          <!-- Site Metrics -->
          <div class="mt-3 pt-3 border-t border-gray-200">
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="text-center p-2 bg-gray-50 rounded">
                <div class="font-bold text-blue-600">{{ formatCurrency(site.budget || 0) }}</div>
                <div class="text-gray-500">Budget</div>
              </div>
              <div class="text-center p-2 bg-gray-50 rounded">
                <div class="font-bold text-green-600">{{ site.progress || 0 }}%</div>
                <div class="text-gray-500">Avancement</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Map Legend -->
    <div class="mt-6 bg-gray-50 rounded-lg p-4">
      <h5 class="font-medium mb-3">Légende de la Carte</h5>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div class="flex items-center">
          <div class="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span>Sites Actifs</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
          <span>Sites Planifiés</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span>Sites Terminés</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span>Sites en Problème</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

export default {
  name: 'AdvancedProjectMap',
  props: {
    sites: {
      type: Array,
      default: () => []
    },
    projectData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      map: null,
      mapView: 'standard',
      isLoading: false,
      showHeatmap: false,
      searchSite: '',
      filterStatus: '',
      markers: [],
      markerCluster: null,
      measureMode: false
    }
  },
  computed: {
    activeSites() {
      return this.sites.filter(site => site.status === 'active' || !site.status).length
    },
    
    coverageArea() {
      if (this.sites.length < 3) return 0
      
      // Calcul approximatif de la zone couverte (convex hull simplifié)
      const lats = this.sites.map(s => parseFloat(s.latitude)).filter(lat => !isNaN(lat))
      const lngs = this.sites.map(s => parseFloat(s.longitude)).filter(lng => !isNaN(lng))
      
      if (lats.length === 0) return 0
      
      const minLat = Math.min(...lats)
      const maxLat = Math.max(...lats)
      const minLng = Math.min(...lngs)
      const maxLng = Math.max(...lngs)
      
      // Conversion approximative en km²
      const latDiff = (maxLat - minLat) * 111 // 1 degré ≈ 111 km
      const lngDiff = (maxLng - minLng) * 111 * Math.cos(minLat * Math.PI / 180)
      
      return latDiff * lngDiff
    },
    
    averageDistance() {
      if (this.sites.length < 2) return 0
      
      let totalDistance = 0
      let count = 0
      
      for (let i = 0; i < this.sites.length; i++) {
        for (let j = i + 1; j < this.sites.length; j++) {
          const site1 = this.sites[i]
          const site2 = this.sites[j]
          
          if (site1.latitude && site1.longitude && site2.latitude && site2.longitude) {
            const distance = this.calculateDistance(
              parseFloat(site1.latitude), parseFloat(site1.longitude),
              parseFloat(site2.latitude), parseFloat(site2.longitude)
            )
            totalDistance += distance
            count++
          }
        }
      }
      
      return count > 0 ? totalDistance / count : 0
    },
    
    filteredSites() {
      let filtered = this.sites
      
      if (this.searchSite) {
        const search = this.searchSite.toLowerCase()
        filtered = filtered.filter(site => 
          site.nom?.toLowerCase().includes(search) ||
          site.pays?.toLowerCase().includes(search) ||
          site.commune?.toLowerCase().includes(search)
        )
      }
      
      if (this.filterStatus) {
        filtered = filtered.filter(site => site.status === this.filterStatus)
      }
      
      return filtered
    }
  },
  
  mounted() {
    this.initializeMap()
  },
  
  beforeUnmount() {
    if (this.map) {
      this.map.remove()
    }
  },
  
  methods: {
    initializeMap() {
      this.isLoading = true
      
      try {
        // Clear existing map
        if (this.map) {
          this.map.remove()
        }
        
        // Initialize map
        this.map = L.map('advanced-map', {
          zoomControl: true,
          zoom: 7,
          center: [6.8041, 2.4152] // Centré sur le Bénin par défaut
        })
        
        // Add tile layer
        this.addTileLayer()
        
        // Add sites
        this.addSitesMarkers()
        
        // Fit bounds if sites exist
        if (this.sites.length > 0) {
          this.zoomToProject()
        }
        
        this.isLoading = false
      } catch (error) {
        console.error('Error initializing map:', error)
        this.isLoading = false
      }
    },
    
    addTileLayer() {
      const tileUrls = {
        standard: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
      }
      
      L.tileLayer(tileUrls[this.mapView], {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map)
    },
    
    addSitesMarkers() {
      // Clear existing markers
      if (this.markerCluster) {
        this.map.removeLayer(this.markerCluster)
      }
      
      this.markerCluster = L.markerClusterGroup({
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
      
      this.sites.forEach(site => {
        if (site.latitude && site.longitude) {
          const lat = parseFloat(site.latitude)
          const lng = parseFloat(site.longitude)
          
          if (!isNaN(lat) && !isNaN(lng)) {
            const marker = L.marker([lat, lng], {
              icon: this.createSiteIcon(site)
            })
            
            // Create detailed popup
            const popupContent = this.createPopupContent(site)
            marker.bindPopup(popupContent, {
              maxWidth: 300,
              className: 'custom-popup'
            })
            
            // Add click event
            marker.on('click', () => {
              this.focusOnSite(site)
            })
            
            this.markerCluster.addLayer(marker)
          }
        }
      })
      
      this.map.addLayer(this.markerCluster)
    },
    
    createSiteIcon(site) {
      const colors = {
        active: '#10B981',
        planned: '#F59E0B', 
        completed: '#3B82F6',
        problem: '#EF4444'
      }
      
      const color = colors[site.status] || colors.active
      
      return L.divIcon({
        html: `
          <div style="
            background-color: ${color};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
          ">📍</div>
        `,
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    },
    
    createPopupContent(site) {
      return `
        <div class="site-popup">
          <div class="font-bold text-lg mb-2">${site.nom}</div>
          <div class="space-y-1 text-sm">
            <div><strong>Coordonnées:</strong> ${site.latitude}, ${site.longitude}</div>
            ${site.pays ? `<div><strong>Pays:</strong> ${site.pays}</div>` : ''}
            ${site.departement ? `<div><strong>Département:</strong> ${site.departement}</div>` : ''}
            ${site.commune ? `<div><strong>Commune:</strong> ${site.commune}</div>` : ''}
            ${site.arrondissement ? `<div><strong>Arrondissement:</strong> ${site.arrondissement}</div>` : ''}
            ${site.quartier ? `<div><strong>Quartier:</strong> ${site.quartier}</div>` : ''}
            <div class="mt-3 pt-2 border-t">
              <div class="flex justify-between">
                <span>Budget:</span>
                <span class="font-medium">${this.formatCurrency(site.budget || 0)}</span>
              </div>
              <div class="flex justify-between">
                <span>Avancement:</span>
                <span class="font-medium">${site.progress || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      `
    },
    
    changeMapView() {
      this.map.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
          this.map.removeLayer(layer)
        }
      })
      this.addTileLayer()
    },
    
    showAllSites() {
      if (this.markerCluster) {
        this.map.fitBounds(this.markerCluster.getBounds(), { padding: [20, 20] })
      }
    },
    
    zoomToProject() {
      if (this.sites.length === 0) return
      
      const validSites = this.sites.filter(site => 
        site.latitude && site.longitude && 
        !isNaN(parseFloat(site.latitude)) && 
        !isNaN(parseFloat(site.longitude))
      )
      
      if (validSites.length === 0) return
      
      if (validSites.length === 1) {
        const site = validSites[0]
        this.map.setView([parseFloat(site.latitude), parseFloat(site.longitude)], 15)
      } else {
        const bounds = L.latLngBounds(
          validSites.map(site => [parseFloat(site.latitude), parseFloat(site.longitude)])
        )
        this.map.fitBounds(bounds, { padding: [20, 20] })
      }
    },
    
    focusOnSite(site) {
      if (site.latitude && site.longitude) {
        this.map.setView([parseFloat(site.latitude), parseFloat(site.longitude)], 15)
        this.$emit('site-selected', site)
      }
    },
    
    toggleHeatmap() {
      this.showHeatmap = !this.showHeatmap
      // Implement heatmap logic here if needed
    },
    
    measureDistance() {
      this.measureMode = !this.measureMode
      // Implement distance measurement tool
    },
    
    exportMap() {
      // Implement map export functionality
      this.$emit('export-map')
    },
    
    calculateDistance(lat1, lng1, lat2, lng2) {
      const R = 6371 // Rayon de la Terre en km
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLng = (lng2 - lng1) * Math.PI / 180
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      return R * c
    },
    
    getSiteCardClass(site) {
      const classes = {
        active: 'border-green-300 bg-green-50',
        planned: 'border-yellow-300 bg-yellow-50',
        completed: 'border-blue-300 bg-blue-50',
        problem: 'border-red-300 bg-red-50'
      }
      return classes[site.status] || classes.active
    },
    
    getSiteStatusBadge(status) {
      const badges = {
        active: 'bg-green-100 text-green-800',
        planned: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-blue-100 text-blue-800',
        problem: 'bg-red-100 text-red-800'
      }
      return badges[status] || badges.active
    },
    
    getSiteStatusText(status) {
      const texts = {
        active: 'Actif',
        planned: 'Planifié',
        completed: 'Terminé',
        problem: 'Problème'
      }
      return texts[status] || 'Actif'
    },
    
    formatCurrency(value) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0
      }).format(value || 0)
    }
  }
}
</script>

<style>
.marker-cluster-small {
  background-color: rgba(59, 130, 246, 0.6);
}
.marker-cluster-medium {
  background-color: rgba(16, 185, 129, 0.6);
}
.marker-cluster-large {
  background-color: rgba(239, 68, 68, 0.6);
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

.custom-popup .leaflet-popup-content {
  margin: 12px 16px;
  line-height: 1.4;
}

.site-popup {
  max-width: 280px;
}
</style>