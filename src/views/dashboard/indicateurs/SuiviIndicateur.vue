<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Suivi Indicateurs</h2>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
        <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
          <div class="relative w-56 text-slate-500">
            <input type="text" id="search_suivi_indicateur" name="search_suivi_indicateur" v-model="search" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
            <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
          </div>
        </div>
      </div>
    </div>

    <LoaderSnipper v-if="isLoadingDataCadre" />
    <TabulatorSuiviIndicateur v-else :data="dataAvailable" :years="annees" :isDataLoading="isLoadingDataCadre"/>
    <div v-if="!isLoadingDataCadre" class="flex justify-center gap-3 my-8">
      <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-3 btn btn-outline-primary"><ChevronsLeftIcon class="size-5" /></button>
      <div class="flex items-center justify-center gap-3 overflow-x-auto scroll-pagination custom-scroll">
        <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="page === currentPage ? 'btn-primary' : 'btn-outline-primary'" class="px-4 py-3 btn">
          {{ page }}
        </button>
      </div>

      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-3 btn btn-outline-primary"><ChevronsRightIcon class="size-5" /></button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { onMounted } from "vue";
import ResultatCadreRendementService from "@/services/modules/resultat.cadre.rendement.service";
import IndicateursService from "@/services/modules/indicateur.service";
import AuthService from "@/services/modules/auth.service";
import { toast } from "vue3-toastify";
import { computed } from "vue";
import TabulatorSuiviIndicateur from "../../../components/TabulatorSuiviIndicateur.vue";

const suivis = ref([]);
const isLoadingDataCadre = ref(false);
const debutProgramme = ref("");
const finProgramme = ref("");
const search = ref("");
// Etat de la page et items par page
const currentPage = ref(1);
const itemsPerPage = 20;

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
const goToPage = (page) => {
  currentPage.value = page;
};
const getcurrentUser = async () => {
  isLoadingDataCadre.value = true;

  await AuthService.getCurrentUser()
    .then((result) => {
      debutProgramme.value = result.data.data.programme.debut;
      finProgramme.value = result.data.data.programme.fin;
    })
    .catch((e) => {
      toast.error("Une erreur est survenue.");
    });
};

// Fetch data
const getDatasCadre = async () => {
  try {
    const { data } = await IndicateursService.getAllSuivis();
    suivis.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingDataCadre.value = false;
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

// Calculer le nombre total de pages
const totalPages = computed(() => Math.ceil(suivis.value ? suivis.value.length / itemsPerPage : 0));

// Obtenir les éléments de la page actuelle
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  if (suivis.value) return suivis.value.slice(start, end);
});

const datasSearch = computed(() => {
  return suivis.value.filter((suivi) => {
    const searchTerm = search.value.toLowerCase();
    return suivi.indicateur.nom.toLowerCase().includes(searchTerm) || suivi.auteur.nom.toLowerCase().includes(searchTerm);
  });
});

const dataAvailable = computed(() => {
  if (search.value.length > 0) return datasSearch.value;
  else return paginatedData.value;
});

onMounted(async () => {
  await getcurrentUser();
  getDatasCadre();
});
</script>

<style>
.custom-scroll {
  scrollbar-width: thin; /* Pour Firefox */
  scrollbar-color: #e5e7eb #e5e7eb; /* Pour Firefox : Couleurs */
}

.custom-scroll::-webkit-scrollbar {
  height: 1px; /* Hauteur de la barre pour le défilement horizontal */
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #e5e7eb; /* Couleur du curseur */
  border-radius: 10px; /* Arrondi du curseur */
  display: none;
}

.custom-scroll::-webkit-scrollbar-track {
  background-color: #e5e7eb; /* Couleur de la piste */
}
</style>
