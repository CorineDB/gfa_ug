<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Cadre de mesure</h2>
    <LoaderSnipper v-if="isLoadingData" />
    <TabulatorCadreMesure v-else :data="cadreRendement" :years="annees" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { onMounted } from "vue";
import ResultatCadreRendementService from "../../services/modules/resultat.cadre.rendement.service";
import AuthService from "@/services/modules/auth.service";
import { toast } from "vue3-toastify";
import TabulatorCadreMesure from "../../components/TabulatorCadreMesure.vue";
import { computed } from "vue";

const cadreRendement = ref([]);
const isLoadingData = ref(false);
const idProgramme = ref("");
const debutProgramme = ref("");
const finProgramme = ref("");
const getcurrentUser = async () => {
  isLoadingData.value = true;

  await AuthService.getCurrentUser()
    .then((result) => {
      idProgramme.value = result.data.data.programme.id;
      debutProgramme.value = result.data.data.programme.debut;
      finProgramme.value = result.data.data.programme.fin;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue.");
    });
};

// Fetch data
const getDatas = async () => {
  try {
    const { data } = await ResultatCadreRendementService.getCadreRendement(idProgramme.value);
    cadreRendement.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingData.value = false;
  }
};

const annees = computed(() => {
  let anneeDebut = parseInt(debutProgramme.value.split("-")[0], 10);
  let anneeFin = parseInt(finProgramme.value.split("-")[0], 10);
  let annees = [];
  for (let annee = anneeDebut; annee <= anneeFin; annee++) {
    annees.push(annee);
  }
  return annees;
});

onMounted(async () => {
  await getcurrentUser();
  getDatas();
});
</script>

<style scoped></style>
