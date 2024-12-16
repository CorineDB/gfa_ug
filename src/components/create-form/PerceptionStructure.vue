<script setup>
defineProps({
  principe: String,
  indicateur: String,
});
</script>
<template>
  <div class="flex flex-col-reverse items-start w-full gap-2">
    <div :class="[principe ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="w-[94%] px-2 py-2.5 text-base truncate font-medium transition-all">{{ principe || principe?.length < 0 ? principe : "Principe" }}</div>
    <div :class="[indicateur ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="w-full px-2 py-2.5 text-base truncate font-medium transition-all">{{ indicateur || indicateur?.length < 0 ? indicateur : "Question opérationnelle" }}</div>
  </div>
</template>

<style scoped></style>
