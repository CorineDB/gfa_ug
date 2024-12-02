<template>
  <div>
    <canvas ref="chartCanvas" style="height: 500px; width: 100%"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, defineProps, computed, nextTick } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "GroupedBarChart",
  setup() {
    // const props = defineProps({
    //   data: {
    //     type: Array,
    //     required: false,
    //     default: [
    //       {
    //         id: 35,
    //         nom: "Redevabilité",
    //         indice_de_perception: 0.4017361111111111,
    //         indice_factuel: 0,
    //         indice_synthetique: 0.4017361111111111,
    //       },
    //       {
    //         id: 32,
    //         nom: "Transparence",
    //         indice_de_perception: 0.4375,
    //         indice_factuel: 0,
    //         indice_synthetique: 0.4375,
    //       },
    //       {
    //         id: 33,
    //         nom: "Participation",
    //         indice_de_perception: 0.3958333333333333,
    //         indice_factuel: 0,
    //         indice_synthetique: 0.3958333333333333,
    //       },
    //       {
    //         id: 36,
    //         nom: "Egalité et non- discrimination / inclusion",
    //         indice_de_perception: 0.4416666666666666,
    //         indice_factuel: 0,
    //         indice_synthetique: 0.4416666666666666,
    //       },
    //     ],
    //   },
    // });

    const data = [
      {
        id: 35,
        nom: "Redevabilité",
        indice_de_perception: 0.4017361111111111,
        indice_factuel: 0,
        indice_synthetique: 0.4017361111111111,
      },
      {
        id: 32,
        nom: "Transparence",
        indice_de_perception: 0.4375,
        indice_factuel: 0,
        indice_synthetique: 0.4375,
      },
      {
        id: 33,
        nom: "Participation",
        indice_de_perception: 0.3958333333333333,
        indice_factuel: 0,
        indice_synthetique: 0.3958333333333333,
      },
      {
        id: 36,
        nom: "Egalité et non- discrimination / inclusion",
        indice_de_perception: 0.4416666666666666,
        indice_factuel: 0,
        indice_synthetique: 0.4416666666666666,
      },
    ];

    const chartCanvas = ref(null);

    // Log de props.data pour vérifier si les données sont bien reçues
    onMounted(() => {
      // Vérification de la présence des données
      if (data && Array.isArray(data) && data.length > 0) {
        console.log("Données reçues : ", data);
      } else {
        console.error("Aucune donnée reçue ou les données sont mal formées.");
      }

      nextTick(() => {
        // Vérification si le canvas existe
        const ctx = chartCanvas.value ? chartCanvas.value.getContext("2d") : null;

        if (ctx) {
          const labels = data.map((item) => item.nom);
          const factuel = data.map((item) => item.indice_factuel);
          const perception = data.map((item) => item.indice_de_perception);
          const synthese = data.map((item) => item.indice_synthetique);

          new Chart(ctx, {
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
                  backgroundColor: "rgba(75, 192, 192, 0.5)",
                  borderColor: "rgba(75, 192, 192, 1)",
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
