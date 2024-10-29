<script setup>
defineProps({
  indicateursArray: Array,
});

const emit = defineEmits(["remove"]);
const remove = (index) => {
  emit("remove", index);
};
</script>

<template>
  <div class="w-full max-w-full mx-auto">
    <div v-if="indicateursArray.length > 0">
      <AccordionGroup :selectedIndex="null" class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))]">
        <AccordionItem v-for="(indicateur, index) in indicateursArray" :key="index" class="">
          <Accordion class="text-lg !p-3 font-semibold bg-primary !text-white flex items-center justify-between">
            <p class="truncate">{{ indicateur.indicateur.nom }}</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2 bg-white">
            <div class="w-full space-y-0.5">
              <div class="flex justify-end">
                <button class="p-1.5 text-white btn btn-danger" @click="remove(indicateur.indicateur)">
                  <TrashIcon class="size-5" />
                </button>
              </div>
              <div class="text-black border-yellow-200 border-l-2 shadow rounded bg-white px-2 py-2.5 text-base font-medium truncate transition-all">{{ indicateur.critere.nom }}</div>
              <div class="text-black border-yellow-200 border-l-2 shadow rounded bg-white px-2 py-2.5 text-base font-medium truncate transition-all">{{ indicateur.principe.nom }}</div>
              <div class="text-black border-yellow-200 border-l-2 shadow rounded bg-white px-2 py-2.5 text-base font-medium truncate transition-all">{{ indicateur.type.nom }}</div>
            </div>
          </AccordionPanel>
        </AccordionItem>
      </AccordionGroup>
    </div>
    <div v-else class="flex justify-center py-3">
      <p class="text-lg font-medium text-gray-600">Ajouter des indicateurs pour voir la liste ici.</p>
    </div>
  </div>
</template>

<style scoped></style>
