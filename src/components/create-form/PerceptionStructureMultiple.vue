<script setup>
defineProps({
  principe: String,
  indicateurArray: {
    type: Array,
    default: () => [
      {
        indicateur: {
          id: "",
          nom: "",
        },
      },
    ],
  },
});
</script>
<template>
  <div class="flex flex-col-reverse items-start w-full gap-2">
    <div :class="[principe ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="w-[94%] px-2 py-2.5 text-base truncate font-medium transition-all">{{ principe || principe?.length < 0 ? principe : "Principe" }}</div>
    <p v-if="principe !== ''" class="text-sm font-bold my-2">Principe</p>

    <div v-for="item in [...indicateurArray].reverse()" :key="item.id" :class="[item.indicateur.nom ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="w-full px-2 py-2.5 text-base truncate font-medium transition-all">{{ item.indicateur.position }} - {{ item.indicateur.nom || item.indicateur.nom?.length < 0 ? item.indicateur.nom : "Question opérationnelle" }}</div>
    <p v-if="indicateurArray[0].indicateur.nom !== ''" class="text-sm font-bold my-2">Question opérationnelle</p>
  </div>
</template>

<style scoped></style>
