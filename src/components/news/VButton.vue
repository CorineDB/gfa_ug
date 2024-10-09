<script setup>
import { defineProps } from "vue";
import IconLoading from "../icons/IconLoading.vue"; 

const props = defineProps({
  loading: Boolean,
  label: {
    type: String,
    default: "Ajouter",
  },
});
</script>

<template>
  <button class="w-full px-4 py-3 my-3 align-top btn btn-primary xl:mr-3" :disabled="props.loading">
    <span class="text-sm font-semibold" v-if="!props.loading">
      {{ props.label }}
    </span>
    <span v-else class="flex items-center justify-center space-x-2">
      <span class="px-4 font-semibold"> Chargement ... </span>
      <IconLoading />
    </span>
  </button>
</template>
