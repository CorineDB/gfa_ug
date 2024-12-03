<template>
  <div class="box">
    <canvas ref="chartCanvas" style="height: 500px; width: 100%"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Chart } from "chart.js";

// Props
const props = defineProps({
  datasx: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// Référence pour le canvas
const chartCanvas = ref(null);

// Labels pour les catégories (axe X)
const labels = ref([]);

// Configuration des réponses et couleurs
const responsesConfig = [
  { label: "Ne peux répondre", backgroundColor: "blue" },
  { label: "Pas du tout", backgroundColor: "red" },
  { label: "Faiblement", backgroundColor: "orange" },
  { label: "Moyennement", backgroundColor: "green" },
  { label: "Totalement", backgroundColor: "purple" },
  { label: "Dans une grande mesure", backgroundColor: "cyan" },
];

// Initialisation des datasets
const datasets = responsesConfig.map((response) => ({
  label: response.label,
  backgroundColor: response.backgroundColor,
  data: [], // Nous allons remplir ces données dynamiquement
}));

// Remplir les données avec la nouvelle structure
const fillData = () => {
  // Clear previous datasets data
  datasets.forEach((dataset) => (dataset.data = []));
  labels.value = []; // Clear previous labels

  props.datasx.forEach(({ categorieDeParticipant, options_de_reponse }) => {
    labels.value.push(categorieDeParticipant); // Ajouter la catégorie au label
    options_de_reponse.forEach((option, index) => {
      datasets[index].data.push(option.count); // Ajouter le count correspondant à chaque option
    });
  });
};

// Initialisation du graphique après le montage
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

<style>
/* Ajoutez des styles personnalisés si nécessaire */
</style>
