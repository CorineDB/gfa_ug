<template>
  <div class="w-full bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-gray-800">⏱️ Suivi Temporel & Prédictions</h3>
      <div class="flex space-x-2">
        <button 
          v-for="view in timelineViews" 
          :key="view.value"
          @click="currentView = view.value"
          :class="[
            'px-3 py-1 rounded text-sm font-medium transition-colors',
            currentView === view.value 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ view.label }}
        </button>
      </div>
    </div>

    <!-- Métriques temporelles clés -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-4 text-white">
        <div class="text-xl font-bold">{{ timeMetrics.progressPercentage }}%</div>
        <div class="text-sm opacity-90">Progression Globale</div>
        <div class="text-xs mt-1">{{ timeMetrics.daysElapsed }} / {{ timeMetrics.totalDays }} jours</div>
      </div>
      
      <div class="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-4 text-white">
        <div class="text-xl font-bold">{{ timeMetrics.remainingDays }}</div>
        <div class="text-sm opacity-90">Jours Restants</div>
        <div class="text-xs mt-1">{{ formatDate(projectData.fin) }}</div>
      </div>
      
      <div class="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-4 text-white">
        <div class="text-xl font-bold">{{ timeMetrics.velocity.toFixed(2) }}</div>
        <div class="text-sm opacity-90">Vélocité Projet</div>
        <div class="text-xs mt-1">Activités/semaine</div>
      </div>
      
      <div class="bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg p-4 text-white">
        <div class="text-xl font-bold">{{ predictedCompletion.date }}</div>
        <div class="text-sm opacity-90">Fin Prédite</div>
        <div class="text-xs mt-1" :class="predictedCompletion.onTime ? 'text-green-200' : 'text-red-200'">
          {{ predictedCompletion.onTime ? 'Dans les temps' : 'En retard' }}
        </div>
      </div>
    </div>

    <!-- Graphique principal -->
    <div class="mb-6">
      <apexchart
        :options="chartOptions"
        :series="chartSeries"
        :type="currentChartType"
        :height="400"
        ref="timelineChart"
      />
    </div>

    <!-- Analyses et prédictions détaillées -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Analyse de tendance -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h4 class="font-semibold text-gray-800 mb-3">📊 Analyse de Tendance</h4>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm">Tendance de progression:</span>
            <span :class="trendAnalysis.progression >= 0 ? 'text-green-600' : 'text-red-600'" class="font-medium">
              {{ trendAnalysis.progression >= 0 ? '+' : '' }}{{ trendAnalysis.progression.toFixed(2) }}%/semaine
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm">Efficacité temporelle:</span>
            <span :class="getEfficiencyColor(trendAnalysis.efficiency)" class="font-medium">
              {{ trendAnalysis.efficiency.toFixed(1) }}%
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm">Prévisibilité:</span>
            <span class="font-medium text-blue-600">{{ trendAnalysis.predictability }}%</span>
          </div>
        </div>
      </div>

      <!-- Scénarios de projection -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h4 class="font-semibold text-gray-800 mb-3">🔮 Scénarios de Projection</h4>
        <div class="space-y-3">
          <div v-for="scenario in projectionScenarios" :key="scenario.name" class="border rounded p-3">
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium">{{ scenario.name }}</span>
              <span :class="scenario.badgeClass" class="px-2 py-1 rounded text-xs">
                {{ scenario.probability }}%
              </span>
            </div>
            <div class="text-sm text-gray-600">
              <div>Date de fin: {{ scenario.endDate }}</div>
              <div>Écart: {{ scenario.deviation }} jours</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline détaillée des milestones -->
    <div class="mb-6">
      <h4 class="font-semibold text-gray-800 mb-4">🎯 Milestones & Jalons Critiques</h4>
      <div class="relative">
        <!-- Timeline horizontale -->
        <div class="flex items-center justify-between mb-4 px-4">
          <div class="text-sm text-gray-500">{{ formatDate(projectData.debut) }}</div>
          <div class="text-sm text-gray-500">Aujourd'hui</div>
          <div class="text-sm text-gray-500">{{ formatDate(projectData.fin) }}</div>
        </div>
        
        <div class="relative h-20 bg-gray-100 rounded-lg mb-4">
          <!-- Barre de progression -->
          <div 
            class="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg transition-all duration-500"
            :style="{ width: timeMetrics.progressPercentage + '%' }"
          ></div>
          
          <!-- Indicateur temps actuel -->
          <div 
            class="absolute top-0 w-1 h-full bg-red-500"
            :style="{ left: timeMetrics.timeProgressPercentage + '%' }"
          ></div>
          
          <!-- Milestones -->
          <div 
            v-for="milestone in milestones" 
            :key="milestone.id"
            class="absolute transform -translate-x-1/2 cursor-pointer"
            :style="{ left: milestone.position + '%', top: '100%' }"
            @click="selectMilestone(milestone)"
          >
            <div class="w-4 h-4 rounded-full border-2 border-white shadow-md mt-2"
                 :class="milestone.completed ? 'bg-green-500' : 'bg-yellow-500'">
            </div>
            <div class="text-xs text-center mt-1 w-20 -ml-8">{{ milestone.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alertes temporelles -->
    <div v-if="timeAlerts.length > 0" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <h4 class="text-sm font-medium text-yellow-800 mb-2">⚠️ Alertes Temporelles</h4>
      <ul class="text-sm text-yellow-700 space-y-1">
        <li v-for="alert in timeAlerts" :key="alert.id" class="flex items-center">
          <span class="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
          {{ alert.message }}
        </li>
      </ul>
    </div>

    <!-- Recommandations d'optimisation -->
    <div class="bg-blue-50 rounded-lg p-4">
      <h4 class="font-semibold text-blue-800 mb-3">💡 Recommandations d'Optimisation</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="recommendation in timeRecommendations" :key="recommendation.id" class="text-sm">
          <div class="flex items-start">
            <span class="text-blue-500 mr-2 mt-1">{{ recommendation.icon }}</span>
            <div>
              <div class="font-medium text-blue-800">{{ recommendation.title }}</div>
              <div class="text-blue-600">{{ recommendation.description }}</div>
              <div class="text-blue-500 text-xs mt-1">Impact estimé: {{ recommendation.impact }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'ProjectTimelinePredictor',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    projectData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentView: 'timeline',
      timelineViews: [
        { value: 'timeline', label: 'Timeline' },
        { value: 'burndown', label: 'Burn-down' },
        { value: 'velocity', label: 'Vélocité' },
        { value: 'forecast', label: 'Prévisions' }
      ],
      selectedMilestone: null
    }
  },
  computed: {
    timeMetrics() {
      const startDate = new Date(this.projectData.debut)
      const endDate = new Date(this.projectData.fin)
      const today = new Date()
      
      const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
      const daysElapsed = Math.max(0, Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)))
      const remainingDays = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)))
      
      const timeProgressPercentage = Math.min(100, (daysElapsed / totalDays) * 100)
      
      // Calcul de la progression des activités
      const stats = this.projectData.statistiqueActivite
      const progressPercentage = stats ? (stats.effectue / stats.total) * 100 : 0
      
      // Calcul de la vélocité (activités complétées par semaine)
      const weeksElapsed = Math.max(1, daysElapsed / 7)
      const velocity = stats ? stats.effectue / weeksElapsed : 0
      
      return {
        totalDays,
        daysElapsed,
        remainingDays,
        progressPercentage: progressPercentage.toFixed(1),
        timeProgressPercentage: timeProgressPercentage.toFixed(1),
        velocity
      }
    },
    
    predictedCompletion() {
      const stats = this.projectData.statistiqueActivite
      if (!stats || this.timeMetrics.velocity === 0) {
        return {
          date: 'Indéterminé',
          onTime: false
        }
      }
      
      const remainingActivities = stats.total - stats.effectue
      const weeksToComplete = remainingActivities / this.timeMetrics.velocity
      const predictedEndDate = new Date()
      predictedEndDate.setDate(predictedEndDate.getDate() + (weeksToComplete * 7))
      
      const actualEndDate = new Date(this.projectData.fin)
      const onTime = predictedEndDate <= actualEndDate
      
      return {
        date: this.formatDate(predictedEndDate),
        onTime
      }
    },
    
    trendAnalysis() {
      // Analyse de tendance basée sur les données simulées
      const progressionRate = this.timeMetrics.progressPercentage / this.timeMetrics.timeProgressPercentage
      const efficiency = Math.min(100, progressionRate * 100)
      
      // Simulation de la progression hebdomadaire
      const weeklyProgression = this.timeMetrics.velocity * 2 // Approximation
      
      return {
        progression: weeklyProgression,
        efficiency,
        predictability: Math.min(100, 85 + (Math.random() * 15)) // Simulation
      }
    },
    
    projectionScenarios() {
      const baseEndDate = new Date(this.projectData.fin)
      const currentVelocity = this.timeMetrics.velocity
      
      return [
        {
          name: 'Optimiste',
          probability: 25,
          endDate: this.calculateScenarioEndDate(currentVelocity * 1.2),
          deviation: this.calculateDeviation(currentVelocity * 1.2),
          badgeClass: 'bg-green-100 text-green-800'
        },
        {
          name: 'Réaliste',
          probability: 50,
          endDate: this.calculateScenarioEndDate(currentVelocity),
          deviation: this.calculateDeviation(currentVelocity),
          badgeClass: 'bg-blue-100 text-blue-800'
        },
        {
          name: 'Pessimiste',
          probability: 25,
          endDate: this.calculateScenarioEndDate(currentVelocity * 0.8),
          deviation: this.calculateDeviation(currentVelocity * 0.8),
          badgeClass: 'bg-red-100 text-red-800'
        }
      ]
    },
    
    milestones() {
      const startDate = new Date(this.projectData.debut)
      const endDate = new Date(this.projectData.fin)
      const totalDuration = endDate - startDate
      
      return [
        {
          id: 1,
          name: 'Démarrage',
          position: 0,
          completed: true,
          date: startDate
        },
        {
          id: 2,
          name: '25% Complété',
          position: 25,
          completed: this.timeMetrics.progressPercentage >= 25,
          date: new Date(startDate.getTime() + totalDuration * 0.25)
        },
        {
          id: 3,
          name: 'Mi-parcours',
          position: 50,
          completed: this.timeMetrics.progressPercentage >= 50,
          date: new Date(startDate.getTime() + totalDuration * 0.5)
        },
        {
          id: 4,
          name: '75% Complété',
          position: 75,
          completed: this.timeMetrics.progressPercentage >= 75,
          date: new Date(startDate.getTime() + totalDuration * 0.75)
        },
        {
          id: 5,
          name: 'Finalisation',
          position: 100,
          completed: this.timeMetrics.progressPercentage >= 100,
          date: endDate
        }
      ]
    },
    
    timeAlerts() {
      const alerts = []
      
      if (this.timeMetrics.timeProgressPercentage > this.timeMetrics.progressPercentage + 10) {
        alerts.push({
          id: 1,
          message: 'Projet en retard par rapport au planning temporel'
        })
      }
      
      if (this.timeMetrics.velocity < 1 && this.timeMetrics.remainingDays < 30) {
        alerts.push({
          id: 2,
          message: 'Vélocité faible avec échéance proche'
        })
      }
      
      if (!this.predictedCompletion.onTime) {
        alerts.push({
          id: 3,
          message: 'Risque de dépassement de l\'échéance prévue'
        })
      }
      
      return alerts
    },
    
    timeRecommendations() {
      const recommendations = []
      
      if (this.trendAnalysis.efficiency < 80) {
        recommendations.push({
          id: 1,
          icon: '🚀',
          title: 'Accélérer l\'exécution',
          description: 'Mobiliser plus de ressources sur les activités critiques',
          impact: '+15% de vélocité'
        })
      }
      
      if (this.timeMetrics.velocity < 2) {
        recommendations.push({
          id: 2,
          icon: '⚡',
          title: 'Optimiser les processus',
          description: 'Simplifier les workflow et éliminer les goulots d\'étranglement',
          impact: '+20% d\'efficacité'
        })
      }
      
      if (this.timeAlerts.length > 0) {
        recommendations.push({
          id: 3,
          icon: '📋',
          title: 'Replanification',
          description: 'Réviser le planning et prioriser les livrables essentiels',
          impact: 'Respect de l\'échéance'
        })
      }
      
      recommendations.push({
        id: 4,
        icon: '📊',
        title: 'Suivi renforcé',
        description: 'Mettre en place des points de contrôle hebdomadaires',
        impact: '+10% de prévisibilité'
      })
      
      return recommendations
    },
    
    chartSeries() {
      switch (this.currentView) {
        case 'timeline':
          return this.getTimelineSeries()
        case 'burndown':
          return this.getBurndownSeries()
        case 'velocity':
          return this.getVelocitySeries()
        case 'forecast':
          return this.getForecastSeries()
        default:
          return []
      }
    },
    
    currentChartType() {
      switch (this.currentView) {
        case 'velocity':
          return 'bar'
        default:
          return 'line'
      }
    },
    
    chartOptions() {
      const baseOptions = {
        chart: {
          toolbar: { show: true },
          animations: { enabled: true }
        },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
        legend: { position: 'bottom' },
        stroke: {
          curve: 'smooth',
          width: 3
        }
      }
      
      switch (this.currentView) {
        case 'timeline':
          return {
            ...baseOptions,
            xaxis: {
              type: 'datetime',
              title: { text: 'Période' }
            },
            yaxis: {
              title: { text: 'Progression (%)' },
              min: 0,
              max: 100
            }
          }
        
        case 'velocity':
          return {
            ...baseOptions,
            xaxis: {
              categories: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
              title: { text: 'Semaines' }
            },
            yaxis: {
              title: { text: 'Activités complétées' }
            }
          }
        
        default:
          return baseOptions
      }
    }
  },
  
  methods: {
    getTimelineSeries() {
      const startDate = new Date(this.projectData.debut)
      const endDate = new Date(this.projectData.fin)
      const today = new Date()
      
      // Série de progression planifiée
      const plannedSeries = []
      const actualSeries = []
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
        const weekProgress = ((d - startDate) / (endDate - startDate)) * 100
        plannedSeries.push({
          x: d.getTime(),
          y: Math.min(100, weekProgress)
        })
        
        // Progression réelle (simulée avec des variations)
        if (d <= today) {
          const actualProgress = weekProgress + (Math.random() - 0.5) * 10
          actualSeries.push({
            x: d.getTime(),
            y: Math.max(0, Math.min(100, actualProgress))
          })
        }
      }
      
      return [
        {
          name: 'Progression planifiée',
          data: plannedSeries
        },
        {
          name: 'Progression réelle',
          data: actualSeries
        }
      ]
    },
    
    getBurndownSeries() {
      const stats = this.projectData.statistiqueActivite
      if (!stats) return []
      
      const totalActivities = stats.total
      const weeksData = []
      
      // Simulation du burn-down sur 6 semaines
      for (let week = 0; week <= 6; week++) {
        const completed = Math.min(totalActivities, stats.effectue + (week * this.timeMetrics.velocity))
        const remaining = totalActivities - completed
        
        weeksData.push({
          x: `Semaine ${week}`,
          y: remaining
        })
      }
      
      return [{
        name: 'Activités restantes',
        data: weeksData
      }]
    },
    
    getVelocitySeries() {
      // Simulation de la vélocité sur 6 semaines
      const velocityData = []
      for (let week = 1; week <= 6; week++) {
        const velocity = this.timeMetrics.velocity + (Math.random() - 0.5) * 2
        velocityData.push(Math.max(0, velocity))
      }
      
      return [{
        name: 'Vélocité (activités/semaine)',
        data: velocityData
      }]
    },
    
    getForecastSeries() {
      const series = this.getTimelineSeries()
      
      // Ajouter les prévisions
      const today = new Date()
      const endDate = new Date(this.projectData.fin)
      const forecastData = []
      
      for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 7)) {
        const weeksFromNow = (d - today) / (1000 * 60 * 60 * 24 * 7)
        const currentProgress = parseFloat(this.timeMetrics.progressPercentage)
        const predictedProgress = currentProgress + (weeksFromNow * this.timeMetrics.velocity * 2)
        
        forecastData.push({
          x: d.getTime(),
          y: Math.min(100, predictedProgress)
        })
      }
      
      series.push({
        name: 'Prévision',
        data: forecastData,
        stroke: { dashArray: 5 }
      })
      
      return series
    },
    
    calculateScenarioEndDate(velocity) {
      const stats = this.projectData.statistiqueActivite
      if (!stats || velocity === 0) return 'Indéterminé'
      
      const remainingActivities = stats.total - stats.effectue
      const weeksToComplete = remainingActivities / velocity
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + (weeksToComplete * 7))
      
      return this.formatDate(endDate)
    },
    
    calculateDeviation(velocity) {
      const actualEndDate = new Date(this.projectData.fin)
      const stats = this.projectData.statistiqueActivite
      
      if (!stats || velocity === 0) return 0
      
      const remainingActivities = stats.total - stats.effectue
      const weeksToComplete = remainingActivities / velocity
      const predictedEndDate = new Date()
      predictedEndDate.setDate(predictedEndDate.getDate() + (weeksToComplete * 7))
      
      const deviationDays = Math.ceil((predictedEndDate - actualEndDate) / (1000 * 60 * 60 * 24))
      return deviationDays
    },
    
    getEfficiencyColor(efficiency) {
      if (efficiency >= 80) return 'text-green-600'
      if (efficiency >= 60) return 'text-yellow-600'
      return 'text-red-600'
    },
    
    formatDate(date) {
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(new Date(date))
    },
    
    selectMilestone(milestone) {
      this.selectedMilestone = milestone
      this.$emit('milestone-selected', milestone)
    }
  }
}
</script>

<style scoped>
.scrollbar-hidden {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
</style>