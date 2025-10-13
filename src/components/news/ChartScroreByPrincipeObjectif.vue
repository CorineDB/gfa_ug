<template>
  <div>
    <TomSelect v-model="selectedDataset" class="max-w-[250px] px-8" name="indice_type" :options="{ placeholder: 'Selectionez un indice' }">
      <option value="factuel">Indice Factuel</option>
      <option value="perception">Indice Perception</option>
      <option value="synthetique">Indice Synthétique</option>
    </TomSelect>
    <!-- Canvas for the chart -->
    <canvas ref="chartCanvas" style="height: 500px !important; max-height: 500px !important; width: 100%"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, nextTick, watch } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "FilteredChartWithGoals",
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
    const selectedDataset = ref("factuel"); // Default to "factuel"
    let chartInstance = null;

    // Color configuration for each dataset
    const datasetColors = {
      factuel: {
        backgroundColor: "rgba(54, 162, 235, 0.5)", // Light green
        borderColor: "rgba(54, 162, 230, 1)", // Dark green
      },
      perception: {
        backgroundColor: "rgba(75, 192, 19, 0.5)", // Light purple
        borderColor: "rgba(75, 192, 19, 1)", // Dark purple
      },
      synthetique: {
        backgroundColor: "rgba(255, 205, 86, 0.5 )", // Light orange
        borderColor: "rgba(255, 205, 86, 1)", // Dark orange
      },
    };

    const renderChart = () => {
      const ctx = chartCanvas.value ? chartCanvas.value.getContext("2d") : null;

      if (ctx) {
        if (chartInstance) {
          chartInstance.destroy(); // Destroy previous chart instance
        }

        const labels = props.datas.map((item) => item.nom);

        const factuel = props.datas.map((item) => item.indice_factuel);
        const perception = props.datas.map((item) => item.indice_de_perception);
        const synthese = props.datas.map((item) => item.indice_synthetique);

        const objectifsFactuel = props.objectifs.map((item) => item.objectif_attendu.find((obj) => obj.type === "factuel")?.objectif_attendu);
        const objectifsPerception = props.objectifs.map((item) => item.objectif_attendu.find((obj) => obj.type === "perception")?.objectif_attendu);
        const objectifsSynthese = props.objectifs.map((item) => item.objectif_attendu.find((obj) => obj.type === "synthetique")?.objectif_attendu);

        const datasetMap = {
          factuel: { data: factuel, objectifs: objectifsFactuel },
          perception: { data: perception, objectifs: objectifsPerception },
          synthetique: { data: synthese, objectifs: objectifsSynthese },
        };

        const selectedData = datasetMap[selectedDataset.value].data;
        const selectedObjectifs = datasetMap[selectedDataset.value].objectifs || [];
        const colors = datasetColors[selectedDataset.value]; // Get the colors for the selected dataset

        chartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: `Indice ${selectedDataset.value.charAt(0).toUpperCase() + selectedDataset.value.slice(1)}`,
                data: selectedData,
                backgroundColor: colors.backgroundColor,
                borderColor: colors.borderColor,
                borderWidth: 1,
                barThickness: 90, // Fixed bar width
              },
              {
                label: `Objectif ${selectedDataset.value.charAt(0).toUpperCase() + selectedDataset.value.slice(1)}`,
                data: selectedObjectifs.map((y, index) => ({
                  x: labels[index],
                  y,
                })),
                type: "scatter",
                pointBackgroundColor: "rgba(255, 99, 132, 1)", // Red color for cross
                pointBorderColor: "rgba(255, 99, 132, 1)",
                pointStyle: "cross", // Cross for objectives
                pointRadius: 12, // Larger size for cross
                pointBorderWidth: 3,
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
                text: `Graphique des ${selectedDataset.value}`,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Score / Objectif",
                },
              },
              x: {
                type: "category",
                labels: labels,
                title: {
                  display: true,
                  text: "Principe",
                },
              },
            },
          },
        });
      } else {
      }
    };

    onMounted(() => {
      nextTick(() => {
        renderChart();
      });
    });

    watch(selectedDataset, () => {
      renderChart();
    });

    watch(
      () => props.datas,
      () => {
        renderChart();
      },
      { deep: true }
    );

    return {
      chartCanvas,
      selectedDataset,
    };
  },
};
</script>
