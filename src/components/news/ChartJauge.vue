<template>
  <div>
    <canvas ref="gaugeChart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart, ArcElement, Tooltip, Title } from "chart.js";

// Enregistrement des éléments nécessaires pour Chart.js
Chart.register(ArcElement, Tooltip, Title);

const gaugeChart = ref(null);

// Props pour configurer la jauge
const props = defineProps({
  min: {
    type: Number,
    default: 0, // Valeur minimale
  },
  max: {
    type: Number,
    default: 100, // Valeur maximale
  },
  value: {
    type: Number,
    default: 50, // Valeur actuelle (position de l'aiguille)
  },
});

onMounted(() => {
  const ctx = gaugeChart.value.getContext("2d");

  // Fonction pour dessiner l'aiguille
  const drawNeedle = (chart, needleValue) => {
    const { width, height } = chart.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2.5;

    // Nettoyage avant de dessiner l'aiguille
    chart.ctx.save();
    chart.ctx.translate(centerX, centerY);
    chart.ctx.rotate(-Math.PI / 2);

    // Calcul de l'angle pour l'aiguille
    const angle = ((needleValue - props.min) / (props.max - props.min)) * Math.PI * 1.5;

    // Dessin de l'aiguille
    chart.ctx.beginPath();
    chart.ctx.moveTo(0, 0);
    chart.ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
    chart.ctx.lineWidth = 3;
    chart.ctx.strokeStyle = "black";
    chart.ctx.stroke();

    // Dessin du centre de l'aiguille
    chart.ctx.beginPath();
    chart.ctx.arc(0, 0, 5, 0, Math.PI * 2);
    chart.ctx.fillStyle = "black";
    chart.ctx.fill();

    chart.ctx.restore();
  };

  // Initialisation du graphique Chart.js
  const gaugeChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: Array.from({ length: 11 }, (_, i) => `${props.min + i * 10}`), // Étiquettes pour les graduations
      datasets: [
        {
          data: [30, 30, 40], // Rouge, Jaune, Vert
          backgroundColor: ["#ff0000", "#ffff00", "#00ff00"], // Couleurs des segments
          borderWidth: 0,
          cutout: "80%",
          rotation: -135, // Rotation pour démarrer à -135 degrés
          circumference: 270, // Arc limité à 270 degrés
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false, // Masque la légende
        },
        tooltip: {
          enabled: false, // Désactive les tooltips
        },
        title: {
          display: true,
          text: "Jauge avec Aiguille (0-100)",
          font: {
            size: 16,
          },
        },
      },
      animation: {
        animateRotate: true,
      },
    },
    plugins: [
      {
        id: "graduations-and-needle",
        beforeDraw(chart) {
          const { ctx, width, height } = chart;
          const centerX = width / 2;
          const centerY = height / 2;
          const radius = Math.min(width, height) / 2.5;

          // Dessin des graduations
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(-Math.PI / 2);

          for (let i = 0; i <= 10; i++) {
            const angle = (i / 10) * Math.PI * 1.5;
            const xStart = radius * 0.9 * Math.cos(angle);
            const yStart = radius * 0.9 * Math.sin(angle);
            const xEnd = radius * Math.cos(angle);
            const yEnd = radius * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(xStart, yStart);
            ctx.lineTo(xEnd, yEnd);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.stroke();

            // Texte des graduations
            const textX = radius * 1.1 * Math.cos(angle);
            const textY = radius * 1.1 * Math.sin(angle);
            ctx.font = "10px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(props.min + i * 10, textX, textY);
          }
          ctx.restore();

          // Dessin de l'aiguille
          drawNeedle(chart, props.value);
        },
      },
    ],
  });

  // Mettre à jour la jauge si la valeur change
  watch(
    () => props.value,
    () => {
      gaugeChartInstance.update();
    }
  );
});
</script>

<style>
canvas {
  max-width: 600px;
  margin: auto;
}
</style>
