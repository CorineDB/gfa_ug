<template>
  <div class="w-full bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-gray-800">Analyse Financière & Projections</h3>
      <div class="flex space-x-2">
        <button 
          v-for="view in views" 
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

    <!-- Métriques financières clés -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-4 text-white">
        <div class="text-2xl font-bold">{{ formatCurrency(metrics.budgetUtilise) }}</div>
        <div class="text-sm opacity-90">Budget Utilisé</div>
        <div class="text-xs mt-1">{{ metrics.tauxUtilisation }}% du budget total</div>
      </div>
      
      <div class="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-4 text-white">
        <div class="text-2xl font-bold">{{ formatCurrency(metrics.budgetRestant) }}</div>
        <div class="text-sm opacity-90">Budget Restant</div>
        <div class="text-xs mt-1">{{ joursRestants }} jours restants</div>
      </div>
      
      <div class="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-4 text-white">
        <div class="text-2xl font-bold">{{ formatCurrency(metrics.depensesMoyennesParMois) }}</div>
        <div class="text-sm opacity-90">Dépenses/Mois</div>
        <div class="text-xs mt-1">Moyenne mobile</div>
      </div>
      
      <div class="bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg p-4 text-white">
        <div class="text-2xl font-bold">{{ metrics.efficaciteBudgetaire }}%</div>
        <div class="text-sm opacity-90">Efficacité</div>
        <div class="text-xs mt-1">Budget vs Objectifs</div>
      </div>
    </div>

    <!-- Graphique principal -->
    <div class="mb-6">
      <apexchart
        :options="chartOptions"
        :series="currentSeries"
        :type="currentChartType"
        :height="400"
        ref="financialChart"
      />
    </div>

    <!-- Alertes financières -->
    <div v-if="alerts.length > 0" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <h4 class="text-sm font-medium text-yellow-800 mb-2">⚠️ Alertes Financières</h4>
      <ul class="text-sm text-yellow-700 space-y-1">
        <li v-for="alert in alerts" :key="alert.id" class="flex items-center">
          <span class="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
          {{ alert.message }}
        </li>
      </ul>
    </div>

    <!-- Projections financières -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-gray-50 rounded-lg p-4">
        <h4 class="font-semibold text-gray-800 mb-3">📈 Projections</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span>Budget prévu à la fin:</span>
            <span class="font-medium">{{ formatCurrency(projections.budgetFinal) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Date d'épuisement estimée:</span>
            <span class="font-medium">{{ projections.dateEpuisement }}</span>
          </div>
          <div class="flex justify-between">
            <span>Économies possibles:</span>
            <span class="font-medium text-green-600">{{ formatCurrency(projections.economiesPossibles) }}</span>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg p-4">
        <h4 class="font-semibold text-gray-800 mb-3">🎯 Recommandations</h4>
        <ul class="text-sm space-y-2">
          <li v-for="rec in recommendations" :key="rec.id" class="flex items-start">
            <span class="text-blue-500 mr-2">•</span>
            <span>{{ rec.text }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'FinancialAnalysisChart',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    projectData: {
      type: Object,
      required: true
    },
    financialHistory: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentView: 'evolution',
      views: [
        { value: 'evolution', label: 'Évolution' },
        { value: 'repartition', label: 'Répartition' },
        { value: 'projection', label: 'Projections' },
        { value: 'performance', label: 'Performance' }
      ]
    }
  },
  computed: {
    metrics() {
      const budgetTotal = (this.projectData.budgetNational || 0) + (this.projectData.pret || 0)
      const budgetUtilise = this.calculateBudgetUtilise()
      const budgetRestant = budgetTotal - budgetUtilise
      const tauxUtilisation = budgetTotal > 0 ? ((budgetUtilise / budgetTotal) * 100).toFixed(1) : 0
      
      return {
        budgetTotal,
        budgetUtilise,
        budgetRestant,
        tauxUtilisation,
        depensesMoyennesParMois: this.calculateDepensesMoyennes(),
        efficaciteBudgetaire: this.calculateEfficacite()
      }
    },

    joursRestants() {
      if (!this.projectData.fin) return 0
      const today = new Date()
      const endDate = new Date(this.projectData.fin)
      const diffTime = endDate - today
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },

    alerts() {
      const alerts = []
      
      if (this.metrics.tauxUtilisation > 80) {
        alerts.push({
          id: 1,
          message: `Attention: ${this.metrics.tauxUtilisation}% du budget déjà utilisé`
        })
      }
      
      if (this.joursRestants < 30 && this.metrics.budgetRestant > 0) {
        alerts.push({
          id: 2,
          message: "Projet se termine bientôt avec budget restant important"
        })
      }
      
      if (this.metrics.depensesMoyennesParMois * 2 > this.metrics.budgetRestant) {
        alerts.push({
          id: 3,
          message: "Rythme de dépenses élevé par rapport au budget restant"
        })
      }
      
      return alerts
    },

    projections() {
      const depenseMoyenne = this.metrics.depensesMoyennesParMois
      const moisRestants = this.joursRestants / 30
      const budgetFinal = Math.max(0, this.metrics.budgetRestant - (depenseMoyenne * moisRestants))
      
      let dateEpuisement = "Non prévu"
      if (depenseMoyenne > 0) {
        const moisAvantEpuisement = this.metrics.budgetRestant / depenseMoyenne
        const dateEpuisementCalc = new Date()
        dateEpuisementCalc.setMonth(dateEpuisementCalc.getMonth() + moisAvantEpuisement)
        dateEpuisement = dateEpuisementCalc.toLocaleDateString('fr-FR')
      }
      
      return {
        budgetFinal,
        dateEpuisement,
        economiesPossibles: Math.max(0, budgetFinal * 0.1)
      }
    },

    recommendations() {
      const recs = []
      
      if (this.metrics.tauxUtilisation < 50 && this.joursRestants < 90) {
        recs.push({
          id: 1,
          text: "Accélérer l'exécution des activités pour optimiser l'utilisation du budget"
        })
      }
      
      if (this.metrics.efficaciteBudgetaire < 70) {
        recs.push({
          id: 2,
          text: "Revoir la planification budgétaire des activités"
        })
      }
      
      if (this.alerts.length > 0) {
        recs.push({
          id: 3,
          text: "Mettre en place un suivi renforcé des dépenses"
        })
      }
      
      return recs
    },

    currentSeries() {
      switch (this.currentView) {
        case 'evolution':
          return this.getEvolutionSeries()
        case 'repartition':
          return this.getRepartitionSeries()
        case 'projection':
          return this.getProjectionSeries()
        case 'performance':
          return this.getPerformanceSeries()
        default:
          return []
      }
    },

    currentChartType() {
      switch (this.currentView) {
        case 'repartition':
          return 'donut'
        case 'performance':
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
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
        legend: { position: 'bottom' }
      }

      switch (this.currentView) {
        case 'evolution':
          return {
            ...baseOptions,
            xaxis: {
              type: 'datetime',
              title: { text: 'Période' }
            },
            yaxis: {
              title: { text: 'Montant (FCFA)' },
              labels: {
                formatter: (value) => this.formatCurrency(value)
              }
            }
          }
        
        case 'repartition':
          return {
            ...baseOptions,
            plotOptions: {
              pie: {
                donut: {
                  size: '70%',
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      label: 'Total',
                      formatter: () => this.formatCurrency(this.metrics.budgetTotal)
                    }
                  }
                }
              }
            }
          }
        
        default:
          return baseOptions
      }
    }
  },

  methods: {
    calculateBudgetUtilise() {
      // Simulation du calcul basé sur les composantes
      if (this.projectData.composantes && this.projectData.composantes.length > 0) {
        return this.projectData.composantes.reduce((total, comp) => {
          return total + (comp.budgetNational || 0) + (comp.pret || 0)
        }, 0)
      }
      return (this.metrics?.budgetTotal || 0) * 0.65 // 65% utilisé par défaut
    },

    calculateDepensesMoyennes() {
      if (this.financialHistory.length === 0) {
        // Estimation basée sur les données du projet
        const budgetUtilise = this.calculateBudgetUtilise()
        const dateDebut = new Date(this.projectData.debut)
        const today = new Date()
        const moisEcoules = (today - dateDebut) / (1000 * 60 * 60 * 24 * 30)
        return moisEcoules > 0 ? budgetUtilise / moisEcoules : 0
      }
      
      // Calcul réel basé sur l'historique
      return this.financialHistory.reduce((sum, item) => sum + item.amount, 0) / this.financialHistory.length
    },

    calculateEfficacite() {
      // Algorithme d'efficacité basé sur le ratio objectifs atteints / budget utilisé
      const objectifsAtteints = this.projectData.statistiqueActivite?.effectue || 0
      const totalObjectifs = this.projectData.statistiqueActivite?.total || 1
      const ratioObjectifs = objectifsAtteints / totalObjectifs
      const ratioUtilisation = this.metrics.tauxUtilisation / 100
      
      if (ratioUtilisation === 0) return 100
      return Math.min(100, (ratioObjectifs / ratioUtilisation) * 100).toFixed(1)
    },

    getEvolutionSeries() {
      // Générer des données d'évolution budgétaire
      const series = []
      const dateDebut = new Date(this.projectData.debut)
      const dateFin = new Date(this.projectData.fin)
      const today = new Date()
      
      // Série des dépenses cumulées
      const depensesCumulees = []
      const budgetPlanifie = []
      
      for (let d = new Date(dateDebut); d <= today; d.setMonth(d.getMonth() + 1)) {
        const moisEcoules = (d - dateDebut) / (1000 * 60 * 60 * 24 * 30)
        const depenseCumulee = moisEcoules * this.metrics.depensesMoyennesParMois
        
        depensesCumulees.push({
          x: d.getTime(),
          y: Math.min(depenseCumulee, this.metrics.budgetUtilise)
        })
        
        // Budget planifié (linéaire)
        const progression = (d - dateDebut) / (dateFin - dateDebut)
        budgetPlanifie.push({
          x: d.getTime(),
          y: progression * this.metrics.budgetTotal
        })
      }
      
      series.push({
        name: 'Dépenses réelles',
        data: depensesCumulees
      })
      
      series.push({
        name: 'Budget planifié',
        data: budgetPlanifie
      })
      
      return series
    },

    getRepartitionSeries() {
      return [{
        name: 'Répartition budgétaire',
        data: [
          this.metrics.budgetUtilise,
          this.metrics.budgetRestant
        ]
      }]
    },

    getProjectionSeries() {
      const series = this.getEvolutionSeries()
      
      // Ajouter les projections
      const projectionData = []
      const today = new Date()
      const dateFin = new Date(this.projectData.fin)
      
      for (let d = new Date(today); d <= dateFin; d.setMonth(d.getMonth() + 1)) {
        const moisFuturs = (d - today) / (1000 * 60 * 60 * 24 * 30)
        const depenseProjetee = this.metrics.budgetUtilise + (moisFuturs * this.metrics.depensesMoyennesParMois)
        
        projectionData.push({
          x: d.getTime(),
          y: Math.min(depenseProjetee, this.metrics.budgetTotal)
        })
      }
      
      series.push({
        name: 'Projection',
        data: projectionData,
        stroke: { dashArray: 5 }
      })
      
      return series
    },

    getPerformanceSeries() {
      return [{
        name: 'Performance',
        data: [
          { x: 'Efficacité Budgétaire', y: this.metrics.efficaciteBudgetaire },
          { x: 'Taux d\'utilisation', y: this.metrics.tauxUtilisation },
          { x: 'Progression Activités', y: this.projectData.statistiqueActivite ? 
            (this.projectData.statistiqueActivite.effectue / this.projectData.statistiqueActivite.total * 100) : 0 },
          { x: 'Respect Planning', y: this.joursRestants > 0 ? 85 : 60 }
        ]
      }]
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