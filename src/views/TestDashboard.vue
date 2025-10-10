<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Test Dashboard Avancé</h1>
    
    <!-- Test SimpleChart -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <SimpleChart 
        title="Test Line Chart"
        :data="lineData"
        type="line"
        :height="300"
      />
      
      <SimpleChart 
        title="Test Donut Chart"
        :data="donutData"
        type="donut"
        :height="300"
      />
    </div>
    
    <!-- Test with real project data structure -->
    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <h2 class="text-lg font-bold mb-4">Test avec données du projet</h2>
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center p-4 bg-blue-50 rounded">
          <div class="text-2xl font-bold text-blue-600">{{ mockProject.score }}%</div>
          <div class="text-sm">Score Global</div>
        </div>
        <div class="text-center p-4 bg-green-50 rounded">
          <div class="text-2xl font-bold text-green-600">{{ mockProject.budget }}</div>
          <div class="text-sm">Budget</div>
        </div>
        <div class="text-center p-4 bg-purple-50 rounded">
          <div class="text-2xl font-bold text-purple-600">{{ mockProject.activities.total }}</div>
          <div class="text-sm">Activités</div>
        </div>
      </div>
    </div>
    
    <!-- Test ApexCharts directement -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-bold mb-4">Test ApexCharts Direct</h2>
      <apexchart
        :options="chartOptions"
        :series="series"
        type="line"
        height="300"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SimpleChart from '@/components/charts/SimpleChart.vue'
import VueApexCharts from 'vue3-apexcharts'

// Register ApexCharts component
const apexchart = VueApexCharts

// Test data
const lineData = ref([
  { label: 'Jan', value: 30 },
  { label: 'Feb', value: 45 },
  { label: 'Mar', value: 25 },
  { label: 'Apr', value: 60 },
  { label: 'May', value: 40 }
])

const donutData = ref([
  { label: 'Terminé', value: 15 },
  { label: 'En cours', value: 8 },
  { label: 'En retard', value: 3 },
  { label: 'Non démarré', value: 2 }
])

const mockProject = ref({
  score: 78,
  budget: '2.5M FCFA',
  activities: {
    total: 28,
    completed: 15,
    inProgress: 8,
    delayed: 3,
    notStarted: 2
  }
})

// Direct ApexCharts test
const series = ref([{
  name: 'Test Series',
  data: [30, 40, 45, 50, 49, 60, 70, 91]
}])

const chartOptions = ref({
  chart: {
    height: 350,
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight'
  },
  title: {
    text: 'Test ApexCharts',
    align: 'left'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'],
      opacity: 0.5
    },
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  }
})

// Register components
export default {
  components: {
    SimpleChart,
    apexchart
  }
}
</script>