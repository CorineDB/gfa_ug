<template>
  <div>
    <canvas ref="chartCanvas" style="height: 400px; width: 100%"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, defineProps, watch, nextTick } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "GroupedBarChart",
  props: {
    datas: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    const createChart = () => {
      // Détruire l'ancien graphique s'il existe
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Vérification de la présence des données
      if (!props.datas || !Array.isArray(props.datas) || props.datas.length === 0) {
        return;
      }

      nextTick(() => {
        // Vérification si le canvas existe
        const ctx = chartCanvas.value ? chartCanvas.value.getContext("2d") : null;

        if (ctx) {
          const labels = props.datas.map((item) => item.nom);
          const factuel = props.datas.map((item) => item.indice_factuel);
          const perception = props.datas.map((item) => item.indice_de_perception);
          const synthese = props.datas.map((item) => item.indice_synthetique);

          chartInstance = new Chart(ctx, {
            type: "bar",
            data: {
              labels, // Les labels extraits des données
              datasets: [
                {
                  label: "Indice Factuel",
                  data: factuel, // Données pour "Indice Factuel"
                  backgroundColor: "rgba(54, 162, 235, 0.5)",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 1,
                },
                {
                  label: "Indice Perception",
                  data: perception, // Données pour "Indice Perception"
                  backgroundColor: "rgba(75, 192, 19, 0.5)",
                  borderColor: "rgba(75, 192, 19, 1)",
                  borderWidth: 1,
                },
                {
                  label: "Indice Synthétique",
                  data: synthese, // Données pour "Indice Synthétique"
                  backgroundColor: "rgba(255, 205, 86, 0.8)",
                  borderColor: "rgba(255, 205, 86, 1)",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Scores par Indice",
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
        }
      });
    };

    // Créer le graphique au montage
    onMounted(() => {
      createChart();
    });

    // Recréer le graphique quand les données changent
    watch(() => props.datas, () => {
      createChart();
    }, { deep: true });

    return {
      chartCanvas,
    };
  },
};
</script>
