<script setup>
defineProps({
  type: String,
  principe: String,
  critere: String,
  indicateur: String,
});
</script>
<template>
  <div class="flex flex-col items-center w-full gap-1.5">
    <div :class="[type ? 'text-white bg-primary' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="w-full px-1 py-3 text-base font-medium text-center truncate transition-all">{{ type || type?.length < 0 ? type : "Type de gouvernance" }}</div>
    <div :class="[principe ? 'text-white bg-primary' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="w-[95%] px-1 py-3 text-base truncate text-center font-medium transition-all">{{ principe || principe?.length < 0 ? principe : "Principe" }}</div>
    <div :class="[critere ? 'text-white bg-primary' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="w-[90%] px-1 py-3 text-base truncate text-center font-medium transition-all">{{ critere || critere?.length < 0 ? critere : "Critère" }}</div>
    <div :class="[indicateur ? 'text-white bg-primary' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="w-[85%] px-1 py-3 text-base truncate text-center font-medium transition-all">{{ indicateur || indicateur?.length < 0 ? indicateur : "Indicateur" }}</div>
  </div>
</template>

<style lang="css" scoped></style>
