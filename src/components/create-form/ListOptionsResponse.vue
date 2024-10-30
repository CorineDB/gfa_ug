<template>
  <ul v-if="options && options.length > 0" class="flex flex-wrap items-center gap-2">
    <li class="px-2 py-1 text-sm font-medium bg-white rounded-full shadow text-primary" v-for="option in options" :key="option.id">{{ option.libelle }} : {{ option.point }}</li>
  </ul>
  <div v-else class="flex justify-center py-3">
    <p class="text-lg font-medium text-gray-600">Ajouter des options pour voir la liste ici.</p>
  </div>
</template>

<script setup>
defineProps({
  options: {
    type: Array,
  },
});
</script>
