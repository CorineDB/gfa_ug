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
  name: "GroupedBarChart",
  setup() {
    const chartCanvas = ref(null);

    onMounted(() => {
      const ctx = chartCanvas.value.getContext("2d");

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Redevabilité", "Participation", "Transparence", "Efficacité", "Inclusion"],
          datasets: [
            {
              label: "Score Perception",
              data: [0.6, 0.7, 0.4, 0.85, 0.9],
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "Score Factuel",
              data: [0.65, 0.75, 0.65, 0.75, 0.9],
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            title: {
              display: true,
              text: "Scores par Principe (Perception vs Factuel)",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Score",
              },
            },
            x: {
              title: {
                display: true,
                text: "Principe",
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
