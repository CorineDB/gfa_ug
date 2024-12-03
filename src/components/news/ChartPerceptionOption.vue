<template>
  <div class="box">
    <canvas ref="chartCanvas" style="height: 500px; width: 100%"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Chart } from "chart.js";

const props = defineProps({
  datasx: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const chartCanvas = ref(null);

const labels = ref([]);

const responsesConfig = [
  { label: "Ne peux répondre", backgroundColor: "blue" },
  { label: "Pas du tout", backgroundColor: "red" },
  { label: "Faiblement", backgroundColor: "orange" },
  { label: "Moyennement", backgroundColor: "green" },
  { label: "Totalement", backgroundColor: "purple" },
  { label: "Dans une grande mesure", backgroundColor: "cyan" },
];

const datasets = responsesConfig.map((response) => ({
  label: response.label,
  backgroundColor: response.backgroundColor,
  data: [],
}));

const fillData = () => {
  datasets.forEach((dataset) => (dataset.data = []));
  labels.value = [];

  props.datasx.forEach(({ categorieDeParticipant, options_de_reponse }) => {
    labels.value.push(categorieDeParticipant);
    options_de_reponse.forEach((option, index) => {
      datasets[index].data.push(option.count); // Ajouter le count correspondant à chaque option
    });
  });
};

onMounted(() => {
  fillData();

  new Chart(chartCanvas.value, {
    type: "bar",
    data: {
      labels: labels.value,
      datasets: datasets,
    },
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
            text: "Catégories des participants",
          },
        },
        y: {
          title: {
            display: true,
            text: "Nombre d'options de réponses",
          },
          beginAtZero: true,
        },
      },
    },
  });
});
</script>
