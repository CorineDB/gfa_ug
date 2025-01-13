<template>
  <div>
    <TomSelect v-model="selectedIndex" class="max-w-[250px] px-8" @change="renderChart">
      <option value="indice_factuel_avg">Indice Factuel</option>
      <option value="indice_de_perception_avg">Indice de Perception</option>
      <option value="indice_synthetique_avg">Indice Synthétique</option>
    </TomSelect>
    <canvas ref="barChart" style="height: 500px !important; width: 100% !important; max-height: 500px !important"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart } from "chart.js";

// Props
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

// Refs
const barChart = ref(null);
const selectedIndex = ref("indice_factuel_avg");
let chartInstance = null;

// Generate unique colors for each organisation
const generateColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
  }
  return colors;
};

// Method to format data for Chart.js
const formatChartData = () => {
  const selectedData = props.data[selectedIndex.value];
  const labels = selectedData.greater_than_avg.map((item) => item.organisationName);
  const values = selectedData.greater_than_avg.map((item) => {
    if (selectedIndex.value === "indice_factuel_avg") {
      return item.indice_factuel;
    } else if (selectedIndex.value === "indice_de_perception_avg") {
      return item.indice_de_perception;
    } else {
      return item.indice_synthetique;
    }
  });

  const colors = generateColors(labels.length);

  return {
    labels,
    datasets: [
      {
        label: selectedIndex.value.replace("_", " ").toUpperCase(),
        data: values,
        backgroundColor: colors,
        borderColor: colors.map((color) => color.replace("0.6", "1")),
        borderWidth: 1,
        barThickness: 40,
      },
    ],
  };
};

// Method to render chart
const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  const chartData = formatChartData();
  chartInstance = new Chart(barChart.value, {
    type: "bar",
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Organisations",
          },
        },
        y: {
          title: {
            display: true,
            text: "Indices",
          },
          beginAtZero: true,
        },
      },
    },
  });
};

// Watch for changes in data and re-render chart
watch(
  () => props.data,
  () => {
    renderChart();
  },
  { deep: true }
);

// Mount chart
onMounted(() => {
  renderChart();
});
</script>

<style>
canvas {
  max-width: 100%;
  height: auto;
}
</style>
