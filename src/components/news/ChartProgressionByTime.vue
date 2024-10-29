<template>
  <div>
    <canvas ref="lineChartCanvas"></canvas>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { Chart, registerables } from "chart.js";

// Enregistrement des composants de Chart.js
Chart.register(...registerables);

export default {
  name: "LineChart",
  setup() {
    const lineChartCanvas = ref(null);

    const createChart = () => {
      const ctx = lineChartCanvas.value.getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["2020", "2021", "2022"],
          datasets: [
            {
              label: "Redevabilité",
              data: [0.5, 0.6, 0.7],
              borderColor: "orange",
              fill: false,
              tension: 0.1,
              pointBackgroundColor: "orange",
            },
            {
              label: "Participation",
              data: [0.4, 0.5, 0.6],
              borderColor: "red",
              fill: false,
              tension: 0.1,
              pointBackgroundColor: "red",
            },
            {
              label: "Transparence",
              data: [0.6, 0.68, 0.8],
              borderColor: "yellow",
              fill: false,
              tension: 0.1,
              pointBackgroundColor: "yellow",
            },
            {
              label: "Efficacité",
              data: [0.7, 0.8, 0.85],
              borderColor: "pink",
              fill: false,
              tension: 0.1,
              pointBackgroundColor: "pink",
            },
            {
              label: "Inclusion",
              data: [0.65, 0.7, 0.9],
              borderColor: "blue",
              fill: false,
              tension: 0.1,
              pointBackgroundColor: "blue",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Progression des Scores au Fil du Temps",
            },
            legend: {
              display: true,
              position: "top",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Année",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Score",
              },
            },
          },
        },
      });
    };

    onMounted(() => {
      createChart();
    });

    return {
      lineChartCanvas,
    };
  },
};
</script>
