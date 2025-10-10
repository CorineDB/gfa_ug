<template>
  <div class="p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-bold mb-4">Test ApexCharts</h2>
    
    <!-- Test simple chart -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">Graphique Simple</h3>
      <apexchart
        :options="chartOptions"
        :series="series"
        type="line"
        height="300"
      />
    </div>
    
    <!-- Test donut chart -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">Graphique Donut</h3>
      <apexchart
        :options="donutOptions"
        :series="donutSeries"
        type="donut"
        height="300"
      />
    </div>
    
    <!-- Data display -->
    <div class="mt-4 p-4 bg-gray-100 rounded">
      <h4 class="font-medium">Données de test:</h4>
      <pre>{{ JSON.stringify(testData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'TestChart',
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      testData: {
        line: [
          { x: 'Jan', y: 10 },
          { x: 'Feb', y: 20 },
          { x: 'Mar', y: 15 },
          { x: 'Apr', y: 25 },
          { x: 'May', y: 30 }
        ],
        donut: [44, 55, 13, 33]
      }
    }
  },
  computed: {
    series() {
      return [{
        name: 'Test Series',
        data: this.testData.line.map(item => item.y)
      }]
    },
    
    chartOptions() {
      return {
        chart: {
          type: 'line',
          toolbar: { show: true }
        },
        colors: ['#008FFB'],
        xaxis: {
          categories: this.testData.line.map(item => item.x)
        },
        yaxis: {
          title: { text: 'Values' }
        },
        title: {
          text: 'Test Line Chart'
        }
      }
    },
    
    donutSeries() {
      return this.testData.donut
    },
    
    donutOptions() {
      return {
        chart: {
          type: 'donut'
        },
        colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560'],
        labels: ['Team A', 'Team B', 'Team C', 'Team D'],
        title: {
          text: 'Test Donut Chart'
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  }
}
</script>