<template>
  <div>
    <canvas ref="chartCanvas" style="height: 600px; width: 100%"></canvas>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default defineComponent({
  name: "LineChart",
  setup() {
    const chartCanvas = ref(null);
    const chartInstance = ref(null);

    const data = {
      labels: ["2020", "2021", "2022"], // Années
      datasets: [
        {
          label: "Redevabilité",
          data: [0.5, 0.6, 0.7],
          borderColor: "orange",
          backgroundColor: "orange",
          fill: false,
        },
        {
          label: "Participation",
          data: [0.6, 0.7, 0.8],
          borderColor: "red",
          backgroundColor: "red",
          fill: false,
        },
        {
          label: "Transparence",
          data: [0.4, 0.5, 0.6],
          borderColor: "pink",
          backgroundColor: "pink",
          fill: false,
        },
        {
          label: "Efficacité",
          data: [0.7, 0.8, 0.85],
          borderColor: "magenta",
          backgroundColor: "magenta",
          fill: false,
        },
        {
          label: "Inclusion",
          data: [0.6, 0.7, 0.9],
          borderColor: "blue",
          backgroundColor: "blue",
          fill: false,
        },
      ],
    };

    const options = {
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
            text: "Année",
          },
        },
        y: {
          title: {
            display: true,
            text: "Score",
          },
          min: 0.4,
          max: 0.9,
        },
      },
    };

    onMounted(() => {
      if (chartCanvas.value) {
        chartInstance.value = new Chart(chartCanvas.value, {
          type: "line",
          data,
          options,
        });
      }
    });

    return {
      chartCanvas,
    };
  },
});
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: auto;
}
</style>
