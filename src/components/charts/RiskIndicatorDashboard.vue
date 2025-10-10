<template>
  <div class="w-full bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-gray-800">🚨 Indicateurs de Risque & Alertes</h3>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">Niveau de risque global:</span>
        <div :class="getRiskBadgeClass(globalRisk.level)" class="px-3 py-1 rounded-full text-sm font-medium">
          {{ globalRisk.label }}
        </div>
      </div>
    </div>

    <!-- Score de risque global -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="col-span-2">
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
          <h4 class="text-lg font-semibold mb-4">Score de Risque Global</h4>
          <div class="relative">
            <apexchart
              :options="riskGaugeOptions"
              :series="[globalRisk.score]"
              type="radialBar"
              height="200"
            />
          </div>
        </div>
      </div>
      
      <div class="space-y-4">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <h5 class="font-medium text-red-800 mb-2">Risques Critiques</h5>
          <div class="text-2xl font-bold text-red-600">{{ criticalRisks.length }}</div>
          <div class="text-sm text-red-600">Nécessitent une action immédiate</div>
        </div>
        
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h5 class="font-medium text-yellow-800 mb-2">Risques Modérés</h5>
          <div class="text-2xl font-bold text-yellow-600">{{ moderateRisks.length }}</div>
          <div class="text-sm text-yellow-600">À surveiller</div>
        </div>
      </div>
    </div>

    <!-- Matrice des risques -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div>
        <h4 class="text-lg font-semibold mb-4">Matrice Impact/Probabilité</h4>
        <div class="bg-gray-50 rounded-lg p-4">
          <apexchart
            :options="riskMatrixOptions"
            :series="riskMatrixSeries"
            type="scatter"
            height="300"
          />
        </div>
      </div>
      
      <div>
        <h4 class="text-lg font-semibold mb-4">Évolution des Risques</h4>
        <div class="bg-gray-50 rounded-lg p-4">
          <apexchart
            :options="riskTrendOptions"
            :series="riskTrendSeries"
            type="line"
            height="300"
          />
        </div>
      </div>
    </div>

    <!-- Liste des risques détaillée -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="xl:col-span-2">
        <h4 class="text-lg font-semibold mb-4">Détail des Risques Identifiés</h4>
        <div class="space-y-3 max-h-96 overflow-y-auto">
          <div 
            v-for="risk in sortedRisks" 
            :key="risk.id"
            :class="getRiskCardClass(risk.level)"
            class="border rounded-lg p-4 transition-all hover:shadow-md"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-lg">{{ risk.icon }}</span>
                  <h5 class="font-medium">{{ risk.title }}</h5>
                  <span :class="getRiskBadgeClass(risk.level)" class="px-2 py-1 rounded text-xs font-medium">
                    {{ risk.level.toUpperCase() }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ risk.description }}</p>
                <div class="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Impact: {{ risk.impact }}/5</span>
                  <span>Probabilité: {{ risk.probability }}/5</span>
                  <span>Détecté: {{ formatDate(risk.detectedAt) }}</span>
                </div>
              </div>
              <div class="ml-4">
                <button 
                  @click="markAsResolved(risk.id)"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                  v-if="!risk.resolved"
                >
                  Résoudre
                </button>
                <span v-else class="text-green-600 text-sm">✓ Résolu</span>
              </div>
            </div>
            
            <!-- Actions recommandées -->
            <div v-if="risk.recommendations.length > 0" class="mt-3 pt-3 border-t border-gray-200">
              <h6 class="text-sm font-medium mb-2">Actions recommandées:</h6>
              <ul class="text-sm text-gray-600 space-y-1">
                <li v-for="rec in risk.recommendations" :key="rec" class="flex items-start">
                  <span class="text-blue-500 mr-2">•</span>
                  <span>{{ rec }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel de contrôle des alertes -->
      <div>
        <h4 class="text-lg font-semibold mb-4">Contrôle des Alertes</h4>
        
        <!-- Notifications en temps réel -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h5 class="font-medium text-blue-800 mb-2">🔔 Notifications</h5>
          <div class="space-y-2">
            <div v-for="notification in recentNotifications" :key="notification.id" class="text-sm">
              <div class="flex items-center justify-between">
                <span class="text-blue-700">{{ notification.message }}</span>
                <span class="text-blue-500 text-xs">{{ formatTime(notification.time) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Seuils d'alerte -->
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <h5 class="font-medium mb-3">Paramètres d'Alerte</h5>
          <div class="space-y-3">
            <div>
              <label class="text-sm text-gray-600">Seuil budget critique (%)</label>
              <input 
                v-model="alertThresholds.budget" 
                type="number" 
                class="w-full mt-1 px-3 py-2 border rounded text-sm"
                min="0" 
                max="100"
              >
            </div>
            <div>
              <label class="text-sm text-gray-600">Jours avant échéance</label>
              <input 
                v-model="alertThresholds.deadline" 
                type="number" 
                class="w-full mt-1 px-3 py-2 border rounded text-sm"
                min="1"
              >
            </div>
            <div>
              <label class="text-sm text-gray-600">Seuil performance (%)</label>
              <input 
                v-model="alertThresholds.performance" 
                type="number" 
                class="w-full mt-1 px-3 py-2 border rounded text-sm"
                min="0" 
                max="100"
              >
            </div>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="space-y-2">
          <button 
            @click="generateRiskReport"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors text-sm"
          >
            📊 Générer Rapport de Risques
          </button>
          <button 
            @click="scheduleReview"
            class="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors text-sm"
          >
            📅 Planifier Revue Risques
          </button>
          <button 
            @click="exportRiskData"
            class="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors text-sm"
          >
            💾 Exporter Données
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'RiskIndicatorDashboard',
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
      alertThresholds: {
        budget: 80,
        deadline: 30,
        performance: 70
      },
      recentNotifications: [
        {
          id: 1,
          message: "Budget critique atteint sur Composante A",
          time: new Date(Date.now() - 1000 * 60 * 30) // 30 min ago
        },
        {
          id: 2,
          message: "Retard détecté sur 3 activités",
          time: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2h ago
        }
      ]
    }
  },
  computed: {
    risks() {
      return this.analyzeProjectRisks()
    },
    
    sortedRisks() {
      return [...this.risks].sort((a, b) => {
        const levelOrder = { 'critique': 3, 'élevé': 2, 'modéré': 1, 'faible': 0 }
        return levelOrder[b.level] - levelOrder[a.level]
      })
    },
    
    criticalRisks() {
      return this.risks.filter(risk => risk.level === 'critique')
    },
    
    moderateRisks() {
      return this.risks.filter(risk => ['élevé', 'modéré'].includes(risk.level))
    },
    
    globalRisk() {
      const avgScore = this.risks.reduce((sum, risk) => {
        return sum + (risk.impact * risk.probability)
      }, 0) / this.risks.length || 0
      
      let level, label
      if (avgScore >= 20) {
        level = 'critique'
        label = 'CRITIQUE'
      } else if (avgScore >= 12) {
        level = 'élevé'
        label = 'ÉLEVÉ'
      } else if (avgScore >= 6) {
        level = 'modéré'
        label = 'MODÉRÉ'
      } else {
        level = 'faible'
        label = 'FAIBLE'
      }
      
      return {
        score: (avgScore / 25) * 100, // Normaliser sur 100
        level,
        label
      }
    },
    
    riskGaugeOptions() {
      return {
        chart: {
          type: 'radialBar'
        },
        colors: [this.getRiskColor(this.globalRisk.level)],
        plotOptions: {
          radialBar: {
            hollow: {
              size: '60%'
            },
            dataLabels: {
              show: true,
              name: {
                show: true,
                fontSize: '16px',
                fontWeight: 600,
                offsetY: -10
              },
              value: {
                show: true,
                fontSize: '24px',
                fontWeight: 700,
                offsetY: 5,
                formatter: (val) => `${val.toFixed(0)}%`
              }
            }
          }
        },
        labels: ['Score de Risque']
      }
    },
    
    riskMatrixSeries() {
      return [{
        name: 'Risques',
        data: this.risks.map(risk => ({
          x: risk.probability,
          y: risk.impact,
          fillColor: this.getRiskColor(risk.level),
          name: risk.title
        }))
      }]
    },
    
    riskMatrixOptions() {
      return {
        chart: {
          type: 'scatter'
        },
        xaxis: {
          title: { text: 'Probabilité' },
          min: 0,
          max: 5
        },
        yaxis: {
          title: { text: 'Impact' },
          min: 0,
          max: 5
        },
        grid: {
          show: true
        },
        tooltip: {
          custom: ({ dataPointIndex }) => {
            const risk = this.risks[dataPointIndex]
            return `<div class="p-2">
              <strong>${risk.title}</strong><br>
              Impact: ${risk.impact}/5<br>
              Probabilité: ${risk.probability}/5
            </div>`
          }
        }
      }
    },
    
    riskTrendSeries() {
      // Simuler l'évolution des risques sur les 6 derniers mois
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun']
      return [{
        name: 'Score de risque moyen',
        data: [45, 52, 48, 61, 55, this.globalRisk.score]
      }]
    },
    
    riskTrendOptions() {
      return {
        chart: {
          type: 'line'
        },
        xaxis: {
          categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun']
        },
        yaxis: {
          title: { text: 'Score de risque (%)' },
          min: 0,
          max: 100
        },
        stroke: {
          curve: 'smooth',
          width: 3
        },
        markers: {
          size: 6
        }
      }
    }
  },
  
  methods: {
    analyzeProjectRisks() {
      const risks = []
      
      // Analyse des risques budgétaires
      const budgetUsage = this.calculateBudgetUsage()
      if (budgetUsage > this.alertThresholds.budget) {
        risks.push({
          id: 'budget-critical',
          title: 'Dépassement budgétaire imminent',
          description: `${budgetUsage.toFixed(1)}% du budget déjà utilisé avec ${this.calculateRemainingDays()} jours restants`,
          level: budgetUsage > 90 ? 'critique' : 'élevé',
          impact: budgetUsage > 90 ? 5 : 4,
          probability: 4,
          icon: '💰',
          detectedAt: new Date(),
          resolved: false,
          recommendations: [
            'Réviser le plan de dépenses',
            'Négocier un budget supplémentaire',
            'Prioriser les activités essentielles'
          ]
        })
      }
      
      // Analyse des risques temporels
      const remainingDays = this.calculateRemainingDays()
      if (remainingDays < this.alertThresholds.deadline) {
        risks.push({
          id: 'deadline-risk',
          title: 'Échéance proche',
          description: `Seulement ${remainingDays} jours restants pour terminer le projet`,
          level: remainingDays < 15 ? 'critique' : 'modéré',
          impact: remainingDays < 15 ? 5 : 3,
          probability: 4,
          icon: '⏰',
          detectedAt: new Date(),
          resolved: false,
          recommendations: [
            'Accélérer l\'exécution des activités critiques',
            'Demander une extension de délai',
            'Redéfinir le scope du projet'
          ]
        })
      }
      
      // Analyse des risques de performance
      const performanceScore = this.calculatePerformanceScore()
      if (performanceScore < this.alertThresholds.performance) {
        risks.push({
          id: 'performance-low',
          title: 'Performance en dessous des attentes',
          description: `Score de performance actuel: ${performanceScore.toFixed(1)}%`,
          level: performanceScore < 50 ? 'critique' : 'modéré',
          impact: 4,
          probability: 3,
          icon: '📉',
          detectedAt: new Date(),
          resolved: false,
          recommendations: [
            'Analyser les causes de sous-performance',
            'Renforcer l\'équipe projet',
            'Revoir la méthodologie'
          ]
        })
      }
      
      // Risques liés aux activités
      if (this.projectData.statistiqueActivite) {
        const { enRetard, total } = this.projectData.statistiqueActivite
        const retardRate = (enRetard / total) * 100
        
        if (retardRate > 20) {
          risks.push({
            id: 'activities-delay',
            title: 'Retards sur les activités',
            description: `${enRetard} activités en retard sur ${total} (${retardRate.toFixed(1)}%)`,
            level: retardRate > 40 ? 'critique' : 'élevé',
            impact: 4,
            probability: 4,
            icon: '📋',
            detectedAt: new Date(),
            resolved: false,
            recommendations: [
              'Identifier les goulots d\'étranglement',
              'Réallouer les ressources',
              'Replanifier les activités critiques'
            ]
          })
        }
      }
      
      // Risques liés aux équipes
      if (this.projectData.equipes && this.projectData.equipes.length < 3) {
        risks.push({
          id: 'team-size',
          title: 'Équipe réduite',
          description: `Seulement ${this.projectData.equipes.length} membre(s) dans l'équipe`,
          level: 'modéré',
          impact: 3,
          probability: 3,
          icon: '👥',
          detectedAt: new Date(),
          resolved: false,
          recommendations: [
            'Recruter des membres supplémentaires',
            'Former l\'équipe existante',
            'Externaliser certaines tâches'
          ]
        })
      }
      
      return risks
    },
    
    calculateBudgetUsage() {
      const totalBudget = (this.projectData.budgetNational || 0) + (this.projectData.pret || 0)
      if (totalBudget === 0) return 0
      
      // Simulation du budget utilisé basé sur l'avancement
      const progression = this.projectData.statistiqueActivite 
        ? (this.projectData.statistiqueActivite.effectue / this.projectData.statistiqueActivite.total)
        : 0.5
      
      return (progression * 100) + Math.random() * 20 // Ajouter variabilité
    },
    
    calculateRemainingDays() {
      if (!this.projectData.fin) return 365
      const today = new Date()
      const endDate = new Date(this.projectData.fin)
      const diffTime = endDate - today
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },
    
    calculatePerformanceScore() {
      if (!this.projectData.statistiqueActivite) return 75
      
      const { effectue, total, enRetard } = this.projectData.statistiqueActivite
      const completionRate = (effectue / total) * 100
      const delayPenalty = (enRetard / total) * 20
      
      return Math.max(0, completionRate - delayPenalty)
    },
    
    getRiskColor(level) {
      const colors = {
        'critique': '#EF4444',
        'élevé': '#F97316',
        'modéré': '#F59E0B',
        'faible': '#10B981'
      }
      return colors[level] || '#6B7280'
    },
    
    getRiskBadgeClass(level) {
      const classes = {
        'critique': 'bg-red-100 text-red-800',
        'élevé': 'bg-orange-100 text-orange-800',
        'modéré': 'bg-yellow-100 text-yellow-800',
        'faible': 'bg-green-100 text-green-800'
      }
      return classes[level] || 'bg-gray-100 text-gray-800'
    },
    
    getRiskCardClass(level) {
      const classes = {
        'critique': 'border-red-300 bg-red-50',
        'élevé': 'border-orange-300 bg-orange-50',
        'modéré': 'border-yellow-300 bg-yellow-50',
        'faible': 'border-green-300 bg-green-50'
      }
      return classes[level] || 'border-gray-300 bg-gray-50'
    },
    
    formatDate(date) {
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date)
    },
    
    formatTime(date) {
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMins / 60)
      
      if (diffMins < 60) {
        return `${diffMins}min`
      } else {
        return `${diffHours}h`
      }
    },
    
    markAsResolved(riskId) {
      const risk = this.risks.find(r => r.id === riskId)
      if (risk) {
        risk.resolved = true
        this.$emit('risk-resolved', riskId)
      }
    },
    
    generateRiskReport() {
      this.$emit('generate-report', 'risk')
    },
    
    scheduleReview() {
      this.$emit('schedule-review')
    },
    
    exportRiskData() {
      const data = {
        globalRisk: this.globalRisk,
        risks: this.risks,
        alertThresholds: this.alertThresholds,
        exportDate: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `risk-analysis-${this.projectData.codePta || 'project'}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }
}
</script>