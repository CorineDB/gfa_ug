<template>
  <div class="w-full">
    <div class="text-sm mb-1">{{ Number(prop.percent).toFixed(2) }} %</div>
    <div class="h-4 progress w-full">
      <div :style="`width:${prop.percent >= 100 ? 100 : prop.percent}%`" :class="color" class="rounded-full progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const prop = defineProps({
  percent: [Number, String],
});

const color = computed(() => {
  if (prop.percent < 40) {
    return "bg-pending";
  } else if (prop.percent < 80) {
    return "bg-primary";
  } else {
    return "bg-success";
  }
});
</script>

<style scoped>
.progress {
  width: 100%;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  transition: width 0.3s ease;
}
</style>
