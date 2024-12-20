<template>
  <div>
    <canvas ref="chartCanvas" style="height: 400px; width: 100%"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, nextTick } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "ObjectivesChart",
  props: {
    objectifs: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const chartCanvas = ref(null);

    onMounted(() => {
      nextTick(() => {
        const ctx = chartCanvas.value ? chartCanvas.value.getContext("2d") : null;

        if (ctx) {
          // Labels for the chart
          const labels = props.objectifs.map((item) => item.nom);

          // Extract data for the objectifs, offsetting the first and last points
          const objectifsData = props.objectifs.map((item, index) => {
            if (index === 0) {
              return { x: -0.5, y: item.objectif_attendu }; // Offset the first point to the left
            } else if (index === props.objectifs.length - 1) {
              return { x: index + 0.5, y: item.objectif_attendu }; // Offset the last point to the right
            } else {
              return { x: index, y: item.objectif_attendu };
            }
          });

          new Chart(ctx, {
            type: "scatter",
            data: {
              datasets: [
                {
                  label: "Objectif Attendu",
                  data: objectifsData,
                  pointBackgroundColor: "rgba(255, 0, 0, 1)", // Red color for the cross
                  pointBorderColor: "rgba(255, 0, 0, 1)",
                  pointStyle: "cross",
                  pointRadius: 8,
                  showLine: false, // Disable connecting line
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
                  text: "Objectifs Attendus par Principe vs Score par principe",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Objectif Attendu",
                  },
                },
                x: {
                  type: "category", // Change to category for labels to display as boxes
                  labels: labels, // Assign the labels directly
                  title: {
                    display: true,
                    text: "Principe",
                  },
                  offset: true, // Add spacing to the edges
                },
              },
            },
          });
        } else {
          console.error("Le contexte du canvas est introuvable");
        }
      });
    });

    return {
      chartCanvas,
    };
  },
};
</script>
