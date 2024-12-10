<template>
  <!-- test de positionnement -->
  <div class="h-auto mt-4">
    <Chart type="pie" :width="width" :height="height" :data="data" :options="options" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDarkModeStore } from "@/stores/dark-mode";
import { useColorSchemeStore } from "@/stores/color-scheme";
import { colors } from "@/utils/colors";

const props = defineProps({
  width: {
    type: [Number, String],
    default: "auto",
  },
  height: {
    type: [Number, String],
    default: "auto",
  },
});

const darkMode = computed(() => useDarkModeStore().darkMode);
const colorScheme = computed(() => useColorSchemeStore().colorScheme);

const chartData = [15, 10, 65];
const chartColors = () => [colors.pending(0.9), colors.warning(0.9), colors.primary(0.9)];

const data = computed(() => {
  return {
    labels: ["Gouvernance Politique", "Gouvernance financière", "Gouvernance administrative"],
    datasets: [
      {
        data: chartData,
        backgroundColor: colorScheme.value ? chartColors() : "",
        hoverBackgroundColor: colorScheme.value ? chartColors() : "",
        borderWidth: 5,
        borderColor: darkMode.value ? colors.darkmode[700]() : colors.white,
      },
    ],
  };
});

const options = computed(() => {
  return {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: colors.slate["500"](0.8),
        },
      },
    },
  };
});
</script>
