<template>
  <div class="w-full">
    <div class="flex justify-end mb-4">
      <div class="w-64">
        <label for="scoreTypeSelect" class="block mb-2 text-sm font-medium text-gray-700">Type de Score :</label>
        <select
          id="scoreTypeSelect"
          v-model="scoreType"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="indice_synthetique">Synthétique</option>
          <option value="indice_factuel">Factuel</option>
          <option value="indice_de_perception">Perception</option>
        </select>
      </div>
    </div>
    <div>
      <canvas ref="chartCanvas" style="height: 600px; max-height: 600px; width: 100%"></canvas>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default defineComponent({
  name: "ChartProgressionByTime",
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    filterYear: {
      type: [String, Number],
      default: "all",
    },
  },
  setup(props) {
    const chartCanvas = ref(null);
    const chartInstance = ref(null);
    const scoreType = ref("indice_synthetique");

    // Fonction pour générer des couleurs uniques avec transparence
    const getRandomColor = () => {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      return `rgba(${r}, ${g}, ${b}, 0.8)`;
    };

    // Fonction pour générer une couleur de fond avec transparence pour l'aire
    const getAreaColor = (color) => {
      return color.replace(/0\.8\)$/, "0.2)");
    };

    const getScoreTypeText = (type) => {
      const types = {
        indice_synthetique: "Synthétique",
        indice_factuel: "Factuel",
        indice_de_perception: "Perception",
      };
      return types[type] || type;
    };

    const createChart = (processedData) => {
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }

      chartInstance.value = new Chart(chartCanvas.value, {
        type: "line",
        data: processedData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `Évolution des scores ${getScoreTypeText(scoreType.value)}`,
              font: {
                size: 18,
              },
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
            legend: {
              position: "top",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Évaluations",
              },
            },
            y: {
              title: {
                display: true,
                text: `Score ${getScoreTypeText(scoreType.value)}`,
              },
              beginAtZero: true,
              max: 1,
            },
          },
        },
      });
    };

    const processChartData = () => {
      const labels = [];
      const principlesMap = new Map();

      // Vérifier si chartData est valide
      if (!props.chartData || Object.keys(props.chartData).length === 0) {
        return { labels: [], datasets: [] };
      }

      // Déterminer les années à traiter
      let yearsToProcess = Object.keys(props.chartData).sort();
      if (props.filterYear && props.filterYear !== "all" && props.filterYear !== "") {
        // Convertir en string pour la comparaison car les clés sont des strings
        const filterYearStr = String(props.filterYear);
        if (yearsToProcess.includes(filterYearStr)) {
          yearsToProcess = [filterYearStr];
        } else {
           // Si l'année demandée n'existe pas dans les données, on ne traite rien (ou on pourrait tout afficher, mais vide c'est mieux)
           yearsToProcess = [];
        }
      }

      // Parcourir les scores par année, puis par évaluation
      yearsToProcess.forEach((year) => {
          const evaluations = props.chartData[year];
          if (Array.isArray(evaluations)) {
            evaluations.forEach((evaluation) => {
              // Ajouter le label de l'évaluation
              labels.push(`${year} - ${evaluation.intitule}`);

              // Collecter tous les noms de principes pour cette évaluation
              const resultats = Array.isArray(evaluation.resultats) ? evaluation.resultats : [];
              
              const currentEvaluationPrinciples = new Set(
                resultats.map((r) => r.nom)
              );

              // S'assurer que tous les principes déjà rencontrés sont initialisés avec des données (0)
              principlesMap.forEach((dataArray, principleName) => {
                if (
                  !currentEvaluationPrinciples.has(principleName) &&
                  dataArray.length < labels.length
                ) {
                  dataArray.push(0);
                }
              });

              // Ajouter les scores de l'évaluation actuelle
              resultats.forEach((result) => {
                if (!principlesMap.has(result.nom)) {
                  // Initialiser avec des 0 pour les évaluations précédentes
                  principlesMap.set(
                    result.nom,
                    Array(labels.length - 1).fill(0)
                  );
                }
                const score =
                  result[scoreType.value] !== undefined &&
                  result[scoreType.value] !== null
                    ? result[scoreType.value]
                    : 0;
                principlesMap.get(result.nom).push(score);
              });

              // Compléter les principes manquants pour cette étape
              principlesMap.forEach((dataArray) => {
                if (dataArray.length < labels.length) {
                  dataArray.push(0);
                }
              });
            });
          }
        });

      const datasets = [];
      principlesMap.forEach((data, principleName) => {
        const color = getRandomColor();
        datasets.push({
          label: principleName,
          data: data,
          borderColor: color,
          backgroundColor: getAreaColor(color),
          tension: 0.3,
          fill: true,
          pointBackgroundColor: "white",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        });
      });

      return { labels, datasets };
    };

    onMounted(() => {
      const initialData = processChartData();
      createChart(initialData);
    });

    watch(
      [() => props.chartData, scoreType, () => props.filterYear],
      () => {
        const updatedData = processChartData();
        createChart(updatedData);
      },
      { deep: true }
    );

    return {
      chartCanvas,
      scoreType,
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
