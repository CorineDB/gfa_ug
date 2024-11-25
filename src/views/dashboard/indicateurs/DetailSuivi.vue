<script setup>
import { computed, onMounted, ref } from "vue";
import IndicateursService from "@/services/modules/indicateur.service";
import Tabulator from "tabulator-tables";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const tabulator = ref();
const isLoadingData = ref(true);
const datas = ref([]);

const getDatas = async () => {
  isLoadingData.value = true;
  await IndicateursService.detailSuivi(idIndicateur.value)
    .then((result) => {
      datas.value = result.data.data;
      isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);

      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste de sources.");
    });
  initTabulator();
};

const initTabulator = () => {
  tabulator.value = new Tabulator("#tabulator", {
    data: datas.value,
    placeholder: "Aucune donnée disponible.",
    layout: "fitColumns",
    columns: [
      {
        title: "Trimestre",
        field: "trimestre",
        vertAlign: "middle",
      },
      {
        title: "Valeur réalisée",
        field: "valeurRealise",
        hozAlign: "center",
        formatter(cell) {
          return `${formatObject(cell.getData().valeurRealise)}`;
        },
      },
      {
        title: "Cumul",
        field: "cumul",
        hozAlign: "center",
        vertAlign: "middle",

        formatter(cell) {
          return `${formatArrayToNewLines(cell.getData().cumul)}`;
        },
      },
      {
        title: "Année Cible",
        field: "anneeCible",
        hozAlign: "center",
        vertAlign: "middle",

        formatter(cell) {
          return `${cell.getData().valeurCible.annee}`;
        },
      },
      {
        title: "Valeur cible",
        field: "valeurCible",
        hozAlign: "center",

        formatter(cell) {
          return `${formatObject(cell.getData().valeurCible.valeurCible)}`;
        },
      },
      {
        title: "Date de suivie",
        field: "dateSuivie",
        hozAlign: "center",
        vertAlign: "middle",
        formatter(cell) {
          return `${formatDateOnly(cell.getData().dateSuivie)}`;
        },
      },
    ],
  });
};

const idIndicateur = computed(() => route.params.id);

function formatObject(obj) {
  if (!obj) return "";
  return Object.entries(obj)
    .map(([key, value]) => (key === "moy" ? value : `${key}: ${value}`))
    .join("<br>");
}

function formatArrayToNewLines(arr) {
  if (!Array.isArray(arr)) return "";
  return arr.join("<br>");
}

function formatDateOnly(dateTimeString) {
  // Vérifie si la chaîne est valide
  if (!dateTimeString) return null;

  // Utilise split pour extraire uniquement la date
  const [date] = dateTimeString.split(" ");
  return date;
}

onMounted(() => {
  getDatas();
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Détail du suivi</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap"></div>
  </div>
  <div v-if="datas.length > 0" class="p-4 space-y-3 text-base box">
    <p><span class="font-semibold uppercase">Indicateur : </span>{{ datas[0]?.valeurCible.indicateur.nom }}</p>
    <p><span class="font-semibold uppercase">Catégorie : </span>{{ datas[0]?.valeurCible.indicateur.categorie.nom }}</p>
    <p v-if="datas[0]?.valeurCible.indicateur.description"><span class="font-semibold uppercase">Description : </span>{{ datas[0]?.valeurCible.indicateur.description }}</p>
    <p><span class="font-semibold uppercase">Unité de mesure : </span>{{ datas[0]?.valeurCible.indicateur.unitee_mesure.nom }}</p>
    <!-- <p><span class="font-semibold">Valeur de base : </span>{{ formatValeurDeBase(datas[0]?.valeurCible.indicateur.valeurDeBase) }}</p> -->
  </div>
  <div class="p-5 mt-5 intro-y box">
    <div class="overflow-x-auto scrollbar-hidden" v-if="!isLoadingData">
      <div id="tabulator" class="mt-5 table-report table-report--tabulator"></div>
    </div>
    <LoaderSnipper v-if="isLoadingData" />
  </div>
</template>
