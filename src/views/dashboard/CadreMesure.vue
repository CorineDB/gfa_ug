<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Cadre de mesure</h2>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import ResultatCadreRendementService from "../../services/modules/resultat.cadre.rendement.service";
import AuthService from "@/services/modules/auth.service";
import { toast } from "vue3-toastify";

const cadreRendement = ref([]);
const isLoadingData = ref(false);
const idProgramme = ref("");

const getcurrentUser = async () => {
  await AuthService.getCurrentUser()
    .then((result) => {
      idProgramme.value = result.data.data.programme.id;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue.");
    });
};

// Fetch data
const getDatas = async () => {
  try {
    isLoadingData.value = true;
    const { data } = await ResultatCadreRendementService.getCadreRendement(idProgramme.value);
    cadreRendement.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingData.value = false;
  }
};

onMounted(async () => {
  await getcurrentUser();
  getDatas();
});
</script>

<style scoped></style>
