<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "StackedBarChart",
  setup() {
    const chartCanvas = ref(null);

    onMounted(() => {
      const ctx = chartCanvas.value.getContext("2d");

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Conseil d'administration", "Employés", "Partenaires", "Bénéficiaires"],
          datasets: [
            {
              label: "Organisation A - Observé",
              data: [30, 50, 20, 40],
              backgroundColor: "rgba(255, 205, 86, 0.8)",
            },
            {
              label: "Organisation A - Non Observé",
              data: [20, 25, 10, 30],
              backgroundColor: "rgba(255, 99, 132, 0.8)",
            },
            {
              label: "Organisation A - Partiellement Observé",
              data: [15, 30, 15, 20],
              backgroundColor: "rgba(255, 159, 64, 0.8)",
            },
            {
              label: "Organisation B - Observé",
              data: [35, 40, 25, 35],
              backgroundColor: "rgba(54, 162, 235, 0.8)",
            },
            {
              label: "Organisation B - Non Observé",
              data: [10, 20, 15, 25],
              backgroundColor: "rgba(153, 102, 255, 0.8)",
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Nombre d'Options de Réponses par Catégorie de Membre et Type (Par Organisation)",
            },
            legend: {
              display: true,
              position: "top",
            },
          },
          responsive: true,
          scales: {
            x: {
              stacked: true, // Empiler les barres
              title: {
                display: true,
                text: "Catégorie de Membre",
              },
              // Ajustement des pourcentages de la largeur des barres
              barPercentage: 0.5, // Réduit la largeur des barres (0.5 = 50%)
              categoryPercentage: 0.5, // Réduit l'espace que chaque catégorie prend (0.5 = 50%)
            },
            y: {
              stacked: true, // Empiler les barres
              beginAtZero: true,
              title: {
                display: true,
                text: "Nombre d'options de Réponses",
              },
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
