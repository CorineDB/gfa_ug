<script setup>
defineProps({
  principes: Array,
});
</script>
<template>
  <div>
    <AccordionGroup>
      <AccordionItem v-for="(principe, indexPrincipe) in principes" :key="indexPrincipe">
        <Accordion class="text-lg !p-3 font-semibold bg-primary !text-white flex items-center justify-between">
          <p class="truncate">{{ principe.nom }}</p>
          <ChevronDownIcon />
        </Accordion>
        <AccordionPanel class="p-2 bg-white">
          <div class="w-full space-y-2">
            <div v-for="(indicateur, indexIndicateur) in principe.questions_operationnelle" :key="indexIndicateur" class="px-2 py-3 text-base font-normal text-black truncate transition-all bg-white border-l-2 border-yellow-200 rounded shadow">{{ indexIndicateur + 1 }} - {{ indicateur.nom }}</div>
          </div>
        </AccordionPanel>
      </AccordionItem>
    </AccordionGroup>
  </div>
</template>
