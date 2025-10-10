<template>
  <div class="w-full bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-gray-800">📊 Comparaison & Benchmarking</h3>
      <div class="flex space-x-2">
        <select v-model="comparisonType" @change="updateComparison" class="border rounded px-3 py-1 text-sm">
          <option value="similar">Projets similaires</option>
          <option value="same-org">Même organisation</option>
          <option value="sector">Même secteur</option>
          <option value="budget">Budget équivalent</option>
        </select>
        <button @click="refreshData" class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
          🔄 Actualiser
        </button>
      </div>
    </div>

    <!-- Métriques de comparaison clés -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-4 text-white">
        <div class="text-2xl font-bold">{{ benchmarkData.ranking }}</div>
        <div class="text-sm opacity-90">Classement</div>
        <div class="text-xs mt-1">Sur {{ benchmarkData.totalProjects }} projets</div>
      </div>
      
      <div class="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-4 text-white">
        <div class="text-2xl font-bold">{{ benchmarkData.percentile }}%</div>
        <div class="text-sm opacity-90">Percentile</div>
        <div class="text-xs mt-1">Performance relative</div>
      </div>
      
      <div class="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-4 text-white">
        <div class="text-2xl font-bold">{{ benchmarkData.efficiency }}%</div>
        <div class="text-sm opacity-90">Efficacité</div>
        <div class="text-xs mt-1">vs Moyenne: {{ benchmarkData.avgEfficiency }}%</div>
      </div>
      
      <div class="bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg p-4 text-white">
        <div class="text-2xl font-bold">{{ benchmarkData.competitiveIndex }}</div>
        <div class="text-sm opacity-90">Indice Compétitif</div>
        <div class="text-xs mt-1">Score normalisé</div>
      </div>
    </div>

    <!-- Graphique radar de comparaison -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div>
        <h4 class="text-lg font-semibold mb-4">Analyse Radar Comparative</h4>
        <apexchart
          :options="radarOptions"
          :series="radarSeries"
          type="radar"
          height="350"
        />
      </div>
      
      <div>
        <h4 class="text-lg font-semibold mb-4">Performance vs Peers</h4>
        <apexchart
          :options="scatterOptions"
          :series="scatterSeries"
          type="scatter"
          height="350"
        />
      </div>
    </div>

    <!-- Tableau de comparaison détaillé -->
    <div class="mb-6">
      <h4 class="text-lg font-semibold mb-4">Comparaison Détaillée</h4>
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-3 text-left">Métrique</th>
              <th class="border p-3 text-center">Ce Projet</th>
              <th class="border p-3 text-center">Moyenne Secteur</th>
              <th class="border p-3 text-center">Meilleur Performance</th>
              <th class="border p-3 text-center">Écart</th>
              <th class="border p-3 text-center">Tendance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="metric in comparisonMetrics" :key="metric.name" class="hover:bg-gray-50">
              <td class="border p-3 font-medium">{{ metric.name }}</td>
              <td class="border p-3 text-center" :class="getValueClass(metric.current, metric.average)">
                {{ formatMetricValue(metric.current, metric.unit) }}
              </td>
              <td class="border p-3 text-center">{{ formatMetricValue(metric.average, metric.unit) }}</td>
              <td class="border p-3 text-center text-green-600">{{ formatMetricValue(metric.best, metric.unit) }}</td>
              <td class="border p-3 text-center" :class="getGapClass(metric.gap)">
                {{ metric.gap > 0 ? '+' : '' }}{{ metric.gap }}%
              </td>
              <td class="border p-3 text-center">
                <span :class="getTrendClass(metric.trend)">
                  {{ getTrendIcon(metric.trend) }} {{ metric.trend }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Analyses et recommandations -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Forces et faiblesses -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h4 class="font-semibold text-gray-800 mb-3">💪 Forces & Faiblesses</h4>
        <div class="space-y-3">
          <div>
            <h5 class="text-sm font-medium text-green-800 mb-2">Points Forts</h5>
            <ul class="text-sm space-y-1">
              <li v-for="strength in strengths" :key="strength.id" class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                <span>{{ strength.text }}</span>
                <span class="ml-auto text-green-600 text-xs">{{ strength.percentile }}%ile</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h5 class="text-sm font-medium text-red-800 mb-2">Axes d'Amélioration</h5>
            <ul class="text-sm space-y-1">
              <li v-for="weakness in weaknesses" :key="weakness.id" class="flex items-center">
                <span class="text-red-500 mr-2">⚠</span>
                <span>{{ weakness.text }}</span>
                <span class="ml-auto text-red-600 text-xs">{{ weakness.percentile }}%ile</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Recommandations stratégiques -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h4 class="font-semibold text-gray-800 mb-3">🎯 Recommandations Stratégiques</h4>
        <div class="space-y-3">
          <div v-for="recommendation in strategicRecommendations" :key="recommendation.id" class="border-l-4 border-blue-500 pl-3">
            <h5 class="font-medium text-blue-800">{{ recommendation.title }}</h5>
            <p class="text-sm text-gray-600">{{ recommendation.description }}</p>
            <div class="flex items-center justify-between mt-2">
              <span class="text-xs text-blue-600">Impact: {{ recommendation.impact }}</span>
              <span class="text-xs text-gray-500">Délai: {{ recommendation.timeframe }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Best practices et leçons apprises -->
    <div class="mt-6 bg-blue-50 rounded-lg p-4">
      <h4 class="font-semibold text-blue-800 mb-3">💡 Best Practices du Secteur</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="practice in bestPractices" :key="practice.id" class="bg-white rounded p-3">
          <h5 class="font-medium text-blue-800 mb-1">{{ practice.title }}</h5>
          <p class="text-sm text-gray-600 mb-2">{{ practice.description }}</p>
          <div class="flex items-center justify-between text-xs">
            <span class="text-blue-600">Adoptée par {{ practice.adoptionRate }}% des top performers</span>
            <span class="text-gray-500">ROI: +{{ practice.roi }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'ProjectComparison',
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
      comparisonType: 'similar',
      benchmarkData: {
        ranking: 0,
        totalProjects: 0,
        percentile: 0,
        efficiency: 0,
        avgEfficiency: 0,
        competitiveIndex: 0
      }
    }
  },
  computed: {
    radarSeries() {
      return [
        {
          name: 'Ce Projet',
          data: [
            this.calculateProjectMetric('budget_efficiency'),
            this.calculateProjectMetric('time_efficiency'),
            this.calculateProjectMetric('quality_score'),
            this.calculateProjectMetric('team_productivity'),
            this.calculateProjectMetric('stakeholder_satisfaction'),
            this.calculateProjectMetric('risk_management')
          ]
        },
        {
          name: 'Moyenne Secteur',
          data: [75, 68, 72, 65, 70, 68]
        },
        {
          name: 'Top Performers',
          data: [90, 85, 88, 82, 87, 85]
        }
      ]
    },
    
    radarOptions() {
      return {
        chart: {
          type: 'radar',
          toolbar: { show: false }
        },
        colors: ['#3B82F6', '#F59E0B', '#10B981'],
        xaxis: {
          categories: [
            'Efficacité Budgétaire',
            'Respect Délais',
            'Qualité',
            'Productivité Équipe',
            'Satisfaction Parties Prenantes',
            'Gestion Risques'
          ]
        },
        yaxis: {
          show: true,
          min: 0,
          max: 100
        },
        markers: {
          size: 4
        },
        legend: {
          position: 'bottom'
        }
      }
    },
    
    scatterSeries() {
      const projects = this.generatePeerProjects()
      
      return [
        {
          name: 'Projets Pairs',
          data: projects.map(p => ({
            x: p.budget,
            y: p.efficiency,
            name: p.name
          }))
        },
        {
          name: 'Ce Projet',
          data: [{
            x: this.getProjectBudget(),
            y: this.calculateProjectEfficiency(),
            name: this.projectData.nom || 'Projet Actuel'
          }]
        }
      ]
    },
    
    scatterOptions() {
      return {
        chart: {
          type: 'scatter'
        },
        colors: ['#94A3B8', '#EF4444'],
        xaxis: {
          title: { text: 'Budget Total (Millions FCFA)' },
          labels: {
            formatter: (val) => (val / 1000000).toFixed(0) + 'M'
          }
        },
        yaxis: {
          title: { text: 'Efficacité (%)' },
          min: 0,
          max: 100
        },
        tooltip: {
          custom: ({ dataPointIndex, seriesIndex }) => {
            const series = this.scatterSeries[seriesIndex]
            const point = series.data[dataPointIndex]
            return `<div class="p-2">
              <strong>${point.name}</strong><br>
              Budget: ${(point.x / 1000000).toFixed(1)}M FCFA<br>
              Efficacité: ${point.y.toFixed(1)}%
            </div>`
          }
        }
      }
    },
    
    comparisonMetrics() {
      return [
        {
          name: 'Efficacité Budgétaire',
          current: this.calculateProjectMetric('budget_efficiency'),
          average: 75,
          best: 92,
          gap: this.calculateGap(this.calculateProjectMetric('budget_efficiency'), 75),
          trend: 'Stable',
          unit: '%'
        },
        {
          name: 'Respect des Délais',
          current: this.calculateProjectMetric('time_efficiency'),
          average: 68,
          best: 89,
          gap: this.calculateGap(this.calculateProjectMetric('time_efficiency'), 68),
          trend: 'Amélioration',
          unit: '%'
        },
        {
          name: 'Productivité Équipe',
          current: this.calculateProjectMetric('team_productivity'),
          average: 65,
          best: 85,
          gap: this.calculateGap(this.calculateProjectMetric('team_productivity'), 65),
          trend: 'Déclin',
          unit: '%'
        },
        {
          name: 'Qualité Livrables',
          current: this.calculateProjectMetric('quality_score'),
          average: 72,
          best: 88,
          gap: this.calculateGap(this.calculateProjectMetric('quality_score'), 72),
          trend: 'Stable',
          unit: '%'
        },
        {
          name: 'Coût par Résultat',
          current: this.calculateCostPerResult(),
          average: 125000,
          best: 89000,
          gap: this.calculateGap(this.calculateCostPerResult(), 125000),
          trend: 'Amélioration',
          unit: 'FCFA'
        }
      ]
    },
    
    strengths() {
      return this.comparisonMetrics
        .filter(m => m.gap > 10)
        .map((m, index) => ({
          id: index,
          text: `${m.name}: ${m.gap}% au-dessus de la moyenne`,
          percentile: Math.min(95, 50 + m.gap)
        }))
        .slice(0, 3)
    },
    
    weaknesses() {
      return this.comparisonMetrics
        .filter(m => m.gap < -10)
        .map((m, index) => ({
          id: index,
          text: `${m.name}: ${Math.abs(m.gap)}% en-dessous de la moyenne`,
          percentile: Math.max(5, 50 + m.gap)
        }))
        .slice(0, 3)
    },
    
    strategicRecommendations() {
      const recommendations = []
      
      if (this.benchmarkData.efficiency < 70) {
        recommendations.push({
          id: 1,
          title: 'Optimiser les Processus Opérationnels',
          description: 'Identifier et éliminer les goulots d\'étranglement pour améliorer l\'efficacité globale',
          impact: 'Élevé (+15-20%)',
          timeframe: '2-3 mois'
        })
      }
      
      if (this.calculateProjectMetric('team_productivity') < 60) {
        recommendations.push({
          id: 2,
          title: 'Renforcer les Capacités de l\'Équipe',
          description: 'Formation ciblée et redistribution des rôles pour maximiser la productivité',
          impact: 'Moyen (+10-15%)',
          timeframe: '1-2 mois'
        })
      }
      
      recommendations.push({
        id: 3,
        title: 'Adopter les Best Practices Sectorielles',
        description: 'Implémenter les pratiques des top performers pour accélérer les résultats',
        impact: 'Élevé (+20-25%)',
        timeframe: '3-6 mois'
      })
      
      return recommendations
    },
    
    bestPractices() {
      return [
        {
          id: 1,
          title: 'Gestion de Projet Agile',
          description: 'Méthodologie itérative avec des cycles courts et feedback continu',
          adoptionRate: 78,
          roi: 25
        },
        {
          id: 2,
          title: 'Suivi en Temps Réel',
          description: 'Tableaux de bord automatisés pour monitoring continu des KPIs',
          adoptionRate: 65,
          roi: 18
        },
        {
          id: 3,
          title: 'Engagement Communautaire',
          description: 'Implication active des bénéficiaires dans la conception et l\'exécution',
          adoptionRate: 82,
          roi: 35
        },
        {
          id: 4,
          title: 'Partenariats Stratégiques',
          description: 'Collaboration avec acteurs locaux pour démultiplier l\'impact',
          adoptionRate: 59,
          roi: 42
        }
      ]
    }
  },
  
  methods: {
    calculateProjectMetric(metric) {
      const stats = this.projectData.statistiqueActivite
      
      switch (metric) {
        case 'budget_efficiency':
          return this.calculateBudgetEfficiency()
        case 'time_efficiency':
          return this.calculateTimeEfficiency()
        case 'quality_score':
          return this.calculateQualityScore()
        case 'team_productivity':
          return this.calculateTeamProductivity()
        case 'stakeholder_satisfaction':
          return 75 + (Math.random() * 20) // Simulated
        case 'risk_management':
          return this.calculateRiskManagement()
        default:
          return 50
      }
    },
    
    calculateBudgetEfficiency() {
      const totalBudget = (this.projectData.budgetNational || 0) + (this.projectData.pret || 0)
      const stats = this.projectData.statistiqueActivite
      
      if (!stats || totalBudget === 0) return 50
      
      const completion = (stats.effectue / stats.total) * 100
      const expectedSpending = completion
      const actualSpending = completion + (Math.random() * 20) // Simulated variance
      
      return Math.max(0, Math.min(100, 100 - (actualSpending - expectedSpending)))
    },
    
    calculateTimeEfficiency() {
      const today = new Date()
      const startDate = new Date(this.projectData.debut)
      const endDate = new Date(this.projectData.fin)
      
      const totalDuration = endDate - startDate
      const elapsedTime = today - startDate
      const timeProgress = (elapsedTime / totalDuration) * 100
      
      const stats = this.projectData.statistiqueActivite
      const workProgress = stats ? (stats.effectue / stats.total) * 100 : 0
      
      // Efficiency = work progress vs time progress
      if (timeProgress === 0) return 100
      return Math.max(0, Math.min(100, (workProgress / timeProgress) * 100))
    },
    
    calculateQualityScore() {
      const stats = this.projectData.statistiqueActivite
      if (!stats) return 70
      
      // Quality based on low delay rate and high completion
      const delayRate = (stats.enRetard / stats.total) * 100
      const completionRate = (stats.effectue / stats.total) * 100
      
      return Math.max(0, Math.min(100, completionRate - (delayRate * 2)))
    },
    
    calculateTeamProductivity() {
      const stats = this.projectData.statistiqueActivite
      const teamSize = this.projectData.equipes ? this.projectData.equipes.length : 1
      
      if (!stats || teamSize === 0) return 60
      
      const activitiesPerMember = stats.total / teamSize
      const completionRate = (stats.effectue / stats.total) * 100
      
      // Productivity score based on activities per member and completion rate
      const productivityBase = Math.min(100, activitiesPerMember * 10)
      return (productivityBase * 0.7) + (completionRate * 0.3)
    },
    
    calculateRiskManagement() {
      const stats = this.projectData.statistiqueActivite
      if (!stats) return 65
      
      // Risk management based on delay rate and project status
      const delayRate = (stats.enRetard / stats.total) * 100
      const riskScore = Math.max(0, 100 - (delayRate * 3))
      
      return riskScore
    },
    
    calculateProjectEfficiency() {
      const metrics = [
        this.calculateProjectMetric('budget_efficiency'),
        this.calculateProjectMetric('time_efficiency'),
        this.calculateProjectMetric('quality_score'),
        this.calculateProjectMetric('team_productivity')
      ]
      
      return metrics.reduce((sum, metric) => sum + metric, 0) / metrics.length
    },
    
    getProjectBudget() {
      return (this.projectData.budgetNational || 0) + (this.projectData.pret || 0)
    },
    
    calculateCostPerResult() {
      const totalBudget = this.getProjectBudget()
      const stats = this.projectData.statistiqueActivite
      
      if (!stats || stats.effectue === 0) return totalBudget
      
      return totalBudget / stats.effectue
    },
    
    calculateGap(current, average) {
      if (average === 0) return 0
      return Math.round(((current - average) / average) * 100)
    },
    
    generatePeerProjects() {
      // Generate sample peer projects for comparison
      const peers = []
      const baseBudget = this.getProjectBudget()
      
      for (let i = 0; i < 15; i++) {
        peers.push({
          name: `Projet ${i + 1}`,
          budget: baseBudget + (Math.random() - 0.5) * baseBudget * 0.5,
          efficiency: 40 + (Math.random() * 50)
        })
      }
      
      return peers
    },
    
    formatMetricValue(value, unit) {
      if (unit === '%') {
        return `${value.toFixed(1)}%`
      } else if (unit === 'FCFA') {
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XOF',
          minimumFractionDigits: 0
        }).format(value)
      }
      return value.toString()
    },
    
    getValueClass(current, average) {
      if (current > average * 1.1) return 'text-green-600 font-semibold'
      if (current < average * 0.9) return 'text-red-600 font-semibold'
      return 'text-gray-800'
    },
    
    getGapClass(gap) {
      if (gap > 10) return 'text-green-600 font-semibold'
      if (gap < -10) return 'text-red-600 font-semibold'
      return 'text-gray-600'
    },
    
    getTrendClass(trend) {
      if (trend === 'Amélioration') return 'text-green-600'
      if (trend === 'Déclin') return 'text-red-600'
      return 'text-gray-600'
    },
    
    getTrendIcon(trend) {
      if (trend === 'Amélioration') return '↗'
      if (trend === 'Déclin') return '↘'
      return '→'
    },
    
    updateComparison() {
      this.calculateBenchmarkData()
    },
    
    calculateBenchmarkData() {
      // Simulate benchmark calculation based on comparison type
      const efficiency = this.calculateProjectEfficiency()
      
      this.benchmarkData = {
        ranking: Math.floor(Math.random() * 50) + 1,
        totalProjects: 127,
        percentile: Math.min(95, Math.max(5, efficiency + (Math.random() * 20))),
        efficiency: efficiency.toFixed(1),
        avgEfficiency: 71.5,
        competitiveIndex: (efficiency / 100 * 10).toFixed(1)
      }
    },
    
    refreshData() {
      this.calculateBenchmarkData()
      this.$emit('data-refreshed')
    }
  },
  
  mounted() {
    this.calculateBenchmarkData()
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