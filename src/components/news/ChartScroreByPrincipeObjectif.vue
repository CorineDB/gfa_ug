<template>
  <div>
    <canvas ref="chartCanvas" style="height: 600px; width: 100%"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, nextTick } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "CombinedChart",
  props: {
    datas: {
      type: Array,
      required: true,
    },
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
          const labels = props.datas.map((item) => item.nom);

          // Data for the bar chart (scores)
          const factuel = props.datas.map((item) => item.indice_factuel);
          const perception = props.datas.map((item) => item.indice_de_perception);
          const synthese = props.datas.map((item) => item.indice_synthetique);

          // Data for the scatter plot (objectifs), offsetting first and last points
          const objectifsData = props.objectifs.map((item, index) => {
            if (index === 0) {
              return { x: -0.5, y: item.objectif_attendu }; // Offset first point left
            } else if (index === props.objectifs.length - 1) {
              return { x: index + 0.5, y: item.objectif_attendu }; // Offset last point right
            } else {
              return { x: index, y: item.objectif_attendu };
            }
          });

          new Chart(ctx, {
            type: "bar",
            data: {
              labels, // Assign the labels directly
              datasets: [
                {
                  label: "Indice Factuel",
                  data: factuel,
                  backgroundColor: "rgba(54, 162, 235, 0.5)",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 1,
                },
                {
                  label: "Indice Perception",
                  data: perception,
                  backgroundColor: "rgba(75, 192, 19, 0.5)",
                  borderColor: "rgba(75, 192, 19, 1)",
                  borderWidth: 1,
                },
                {
                  label: "Indice Synthétique",
                  data: synthese,
                  backgroundColor: "rgba(255, 205, 86, 0.8)",
                  borderColor: "rgba(255, 205, 86, 1)",
                  borderWidth: 1,
                },
                {
                  label: "Objectif Attendu",
                  data: objectifsData,
                  type: "scatter", // Scatter plot for objectifs
                  pointBackgroundColor: "rgba(127, 25, 280, 1)", // Red color for the cross
                  pointBorderColor: "rgba(127, 25, 280, 1)",
                  pointStyle: "cross",
                  pointRadius: 12, // Increased size for better visibility
                  pointBorderWidth: 2, // Increased border width for visibility
                  pointRotation: 45,
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
                  text: "Scores par Indice et Objectifs Attendus",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Score/Objectif",
                  },
                },
                x: {
                  type: "category", // Use category scale for labels
                  labels: labels,
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
