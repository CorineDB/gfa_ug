<template>
  <div class="w-full bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
    <div v-else>
      <apexchart
        :options="chartOptions"
        :series="series"
        :type="type"
        :height="height"
      />
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'SimpleChart',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    title: {
      type: String,
      default: 'Graphique'
    },
    data: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'line'
    },
    height: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    series() {
      if (this.type === 'donut' || this.type === 'pie') {
        return this.data.map(item => item.value || 0)
      }
      
      return [{
        name: this.title,
        data: this.data.map(item => ({
          x: item.label || item.x,
          y: item.value || item.y || 0
        }))
      }]
    },
    
    chartOptions() {
      const baseOptions = {
        chart: {
          toolbar: { show: true },
          animations: { enabled: true }
        },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
        legend: { 
          position: 'bottom',
          show: true
        },
        dataLabels: {
          enabled: true
        }
      }
      
      if (this.type === 'donut' || this.type === 'pie') {
        return {
          ...baseOptions,
          labels: this.data.map(item => item.label || ''),
          plotOptions: {
            pie: {
              donut: {
                size: this.type === 'donut' ? '60%' : '0%'
              }
            }
          }
        }
      }
      
      return {
        ...baseOptions,
        xaxis: {
          type: 'category',
          title: { text: 'Categories' }
        },
        yaxis: {
          title: { text: 'Values' }
        },
        stroke: {
          curve: 'smooth',
          width: 2
        }
      }
    }
  }
}
</script>