<template>
  <div class="box">
    <canvas ref="chartCanvas" style="height: 500px; width: 100%"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { Chart } from "chart.js";

export default {
  setup() {
    const chartCanvas = ref(null);

    onMounted(() => {
      new Chart(chartCanvas.value, {
        type: "bar",
        data: {
          labels: ["Membre Administration", "Membre Association", "Employé Association"],
          datasets: [
            {
              label: "Ne peux répondre",
              backgroundColor: "blue",
              data: [3, 2, 1], // Remplacez par vos données
            },
            {
              label: "Pas du tout",
              backgroundColor: "red",
              data: [4, 5, 2],
            },
            {
              label: "Faiblement",
              backgroundColor: "orange",
              data: [6, 8, 4],
            },
            {
              label: "Moyennement",
              backgroundColor: "green",
              data: [5, 6, 3],
            },
            {
              label: "Dans une grande mesure",
              backgroundColor: "cyan",
              data: [2, 3, 6],
            },
            {
              label: "Totalement",
              backgroundColor: "purple",
              data: [1, 4, 5],
            },
          ],
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
                text: "Nombre Options de Réponses",
              },
              beginAtZero: true,
            },
          },
        },
      });
    });

    return {
      chartCanvas,
    };
  },
};
</script>

<style>
/* Ajoutez des styles personnalisés si nécessaire */
</style>
