<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">Période:</span>
        <select v-model="selectedPeriod" @change="updateChart" class="text-sm border rounded px-2 py-1">
          <option value="3m">3 mois</option>
          <option value="6m">6 mois</option>
          <option value="1y">1 an</option>
          <option value="all">Tout</option>
        </select>
      </div>
    </div>
    <div class="relative">
      <apexchart
        :options="chartOptions"
        :series="series"
        type="line"
        :height="height"
        ref="chart"
      />
      <div v-if="prediction" class="absolute top-2 right-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
        🔮 Prédiction activée
      </div>
    </div>
    <div class="grid grid-cols-3 gap-4 mt-4">
      <div class="text-center p-3 bg-green-50 rounded">
        <div class="text-lg font-bold text-green-600">{{ stats.trend }}%</div>
        <div class="text-sm text-gray-600">Tendance</div>
      </div>
      <div class="text-center p-3 bg-blue-50 rounded">
        <div class="text-lg font-bold text-blue-600">{{ stats.predicted }}</div>
        <div class="text-sm text-gray-600">Prédiction</div>
      </div>
      <div class="text-center p-3 bg-purple-50 rounded">
        <div class="text-lg font-bold text-purple-600">{{ stats.confidence }}%</div>
        <div class="text-sm text-gray-600">Confiance</div>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'TrendChart',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    title: {
      type: String,
      default: 'Analyse de Tendance'
    },
    height: {
      type: Number,
      default: 350
    },
    prediction: {
      type: Boolean,
      default: true
    },
    metric: {
      type: String,
      default: 'value'
    }
  },
  data() {
    return {
      selectedPeriod: '6m',
      stats: {
        trend: 0,
        predicted: 0,
        confidence: 85
      }
    }
  },
  computed: {
    filteredData() {
      const now = new Date()
      const cutoff = new Date()
      
      switch (this.selectedPeriod) {
        case '3m':
          cutoff.setMonth(now.getMonth() - 3)
          break
        case '6m':
          cutoff.setMonth(now.getMonth() - 6)
          break
        case '1y':
          cutoff.setFullYear(now.getFullYear() - 1)
          break
        default:
          return this.data
      }
      
      return this.data.filter(item => new Date(item.date) >= cutoff)
    },
    
    series() {
      const actualData = this.filteredData.map(item => ({
        x: new Date(item.date).getTime(),
        y: item[this.metric]
      }))
      
      const series = [{
        name: 'Données réelles',
        data: actualData,
        color: '#3B82F6'
      }]
      
      if (this.prediction && actualData.length > 0) {
        const predictionData = this.generatePrediction(actualData)
        series.push({
          name: 'Prédiction',
          data: predictionData,
          color: '#10B981',
          stroke: {
            dashArray: 5
          }
        })
      }
      
      return series
    },
    
    chartOptions() {
      return {
        chart: {
          type: 'line',
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true
            }
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 3
        },
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeFormatter: {
              year: 'yyyy',
              month: 'MMM \'yy',
              day: 'dd MMM',
              hour: 'HH:mm'
            }
          }
        },
        yaxis: {
          title: {
            text: this.metric
          },
          labels: {
            formatter: (value) => {
              if (typeof value === 'number') {
                return value.toFixed(2)
              }
              return value
            }
          }
        },
        tooltip: {
          x: {
            format: 'dd/MM/yyyy'
          },
          y: {
            formatter: (value, { seriesIndex }) => {
              const prefix = seriesIndex === 1 ? '~' : ''
              return `${prefix}${value.toFixed(2)}`
            }
          }
        },
        legend: {
          position: 'top'
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          }
        },
        markers: {
          size: 4,
          hover: {
            sizeOffset: 2
          }
        }
      }
    }
  },
  methods: {
    generatePrediction(actualData) {
      if (actualData.length < 3) return []
      
      // Algorithme de prédiction simple basé sur la régression linéaire
      const n = actualData.length
      const lastDate = actualData[n - 1].x
      const timeStep = n > 1 ? actualData[n - 1].x - actualData[n - 2].x : 86400000 // 1 jour par défaut
      
      // Calculer la tendance
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
      
      actualData.forEach((point, index) => {
        sumX += index
        sumY += point.y
        sumXY += index * point.y
        sumX2 += index * index
      })
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
      const intercept = (sumY - slope * sumX) / n
      
      // Générer les points de prédiction
      const predictionPoints = []
      const numPredictions = Math.min(Math.ceil(n * 0.3), 10) // 30% de la série actuelle, max 10 points
      
      for (let i = 1; i <= numPredictions; i++) {
        const futureX = lastDate + (timeStep * i)
        const futureY = slope * (n + i - 1) + intercept
        
        // Ajouter un peu de randomness pour rendre la prédiction plus réaliste
        const noise = (Math.random() - 0.5) * 0.1 * futureY
        
        predictionPoints.push({
          x: futureX,
          y: Math.max(0, futureY + noise) // Éviter les valeurs négatives
        })
      }
      
      // Mettre à jour les stats
      this.updateStats(slope, predictionPoints[predictionPoints.length - 1]?.y || 0)
      
      return predictionPoints
    },
    
    updateStats(slope, lastPrediction) {
      // Calculer le trend en pourcentage
      const firstValue = this.filteredData[0]?.[this.metric] || 0
      const lastValue = this.filteredData[this.filteredData.length - 1]?.[this.metric] || 0
      
      if (firstValue !== 0) {
        this.stats.trend = ((lastValue - firstValue) / firstValue * 100).toFixed(1)
      }
      
      this.stats.predicted = lastPrediction.toFixed(2)
      
      // Confiance basée sur la variance des données
      const values = this.filteredData.map(d => d[this.metric])
      const mean = values.reduce((a, b) => a + b, 0) / values.length
      const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
      const cv = Math.sqrt(variance) / mean // Coefficient de variation
      
      this.stats.confidence = Math.max(60, 100 - (cv * 100)).toFixed(0)
    },
    
    updateChart() {
      this.$nextTick(() => {
        if (this.$refs.chart) {
          this.$refs.chart.updateSeries(this.series)
        }
      })
    }
  },
  
  watch: {
    data: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.apexcharts-canvas {
  margin: 0 auto;
}
</style>