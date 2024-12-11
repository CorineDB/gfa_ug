<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Réponses de l'evaluation</h2>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import EnqueteIndividuelService from "../../services/modules/enquete.individuel.service";
import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();

const datas = ref([]);
const evaluation = route.params.id;
const isLoadingData = ref(false);

const getDatas = async () => {
  isLoadingData.value = true;
  try {
    const { data } = await EnqueteIndividuelService.getResponseEvaluation(evaluation);
    datas.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingData.value = false;
  }
};

onMounted(() => {
  // getDatas()
});
</script>

<style scoped></style>
