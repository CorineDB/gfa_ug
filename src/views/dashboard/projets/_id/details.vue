<template>
  <!-- New sample -->
  <div class="bg-gray-50 min-h-screen p-6">
    <!-- Header -->
    <div class="flex justify-between items-center bg-white rounded-md shadow p-4 mb-6">
      <div>
        <h1 class="text-xl font-semibold text-gray-800">Nom Projet</h1>
        <p class="text-gray-500">Organisation : <span class="font-medium">Nom de l'Organisation</span></p>
      </div>
      <div>
        <p class="text-sm text-gray-600"><strong>TEP :</strong> 12 mois</p>
        <p class="text-sm text-gray-600"><strong>TEF :</strong> 8 mois</p>
        <p class="text-sm text-gray-600">Effectif de l'organisation: <span class="font-semibold text-gray-800">12987323</span></p>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Map and Data -->
      <div class="col-span-2 bg-white rounded-md shadow p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Cartes géographiques</h2>
        <div class="grid grid-cols-2 gap-4">
          <!-- Map -->
          <div>
            <div class="bg-gray-200 rounded-md h-48 mb-4"></div>
            <p class="text-sm text-gray-500">Total Number of Sessions within Date Range Users</p>
          </div>
          <!-- Data Table -->
          <div>
            <table class="w-full text-sm text-gray-600">
              <thead>
                <tr class="bg-gray-100 text-left">
                  <th class="py-2 px-4">Sites</th>
                  <th class="py-2 px-4">Longitudes</th>
                  <th class="py-2 px-4">Latitudes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-2 px-4">Montana</td>
                  <td class="py-2 px-4">120</td>
                  <td class="py-2 px-4 text-red-500">-3.2%</td>
                </tr>
                <tr>
                  <td class="py-2 px-4">Seoul</td>
                  <td class="py-2 px-4">454</td>
                  <td class="py-2 px-4 text-green-500">+5.64%</td>
                </tr>
                <!-- Add more rows as needed -->
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Activity Stream -->
      <div class="bg-white rounded-md shadow p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Listes des activités</h2>
        <ul class="space-y-4">
          <li class="flex items-center">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">✓</div>
            <div class="ml-4">
              <p class="text-gray-800 font-semibold">Order Verification</p>
              <p class="text-sm text-gray-500">Product ID: #9823</p>
            </div>
          </li>
          <li class="flex items-center">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-500">✓</div>
            <div class="ml-4">
              <p class="text-gray-800 font-semibold">Order Completed</p>
              <p class="text-sm text-gray-500">Product ID: #9823</p>
            </div>
          </li>
          <!-- Add more items as needed -->
        </ul>
      </div>

      <!-- <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"> -->
      <div class="bg-white shadow-md rounded-md p-6">
        <h2 class="text-lg font-semibold text-gray-700">Budget</h2>
        <div class="mt-4 space-y-2">
          <p class="flex justify-between text-gray-600">
            <span>Consommé :</span>
            <span class="font-medium text-red-500">€45,000</span>
          </p>
          <p class="flex justify-between text-gray-600">
            <span>Alloué :</span>
            <span class="font-medium">€60,000</span>
          </p>
          <p class="flex justify-between text-gray-600">
            <span>Fonds Propres :</span>
            <span class="font-medium text-green-500">€15,000</span>
          </p>
        </div>
      </div>
      <div class="bg-white shadow-md rounded-md p-6">
        <h2 class="text-lg font-semibold text-gray-700">Jours Restants</h2>
        <p class="mt-4 text-2xl font-bold text-gray-800">120 jours</p>
      </div>
      <div class="bg-white shadow-md rounded-md p-6">
        <h2 class="text-lg font-semibold text-gray-700">Statut Global</h2>
        <div class="mt-4">
          <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-4 bg-green-500" style="width: 75%"></div>
          </div>
          <p class="mt-2 text-sm text-gray-600">75% réalisé</p>
        </div>
      </div>
      <!-- </section> -->

      <!-- Sales Analytics -->
      <div class="bg-white rounded-md shadow p-6 col-span-2 mb-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Sales Analytics</h2>
        <div class="grid grid-cols-2 gap-4">
          <!-- Chart Placeholder -->
          <div class="bg-gray-200 rounded-md h-40"></div>
          <!-- Data -->
          <div>
            <p class="text-gray-500">Audience Breakdown</p>
            <div class="mt-4">
              <p class="text-sm text-gray-700">Online Sales</p>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full" style="width: 60%"></div>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-gray-700">Offline Sales</p>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-orange-500 h-2 rounded-full" style="width: 40%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Activities Section -->
    <section class="bg-white shadow-md rounded-md p-6 mb-6">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-700">Liste des Activités</h2>
        <select class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600">
          <option>Filtrer par Statut</option>
          <option>En cours</option>
          <option>Terminé</option>
          <option>Non commencé</option>
        </select>
      </div>
      <div class="mt-4 overflow-x-auto">
        <table class="table-auto w-full text-left border-collapse">
          <thead class="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th class="px-4 py-2">Activité</th>
              <th class="px-4 py-2">Responsable</th>
              <th class="px-4 py-2">Statut</th>
              <th class="px-4 py-2">Début</th>
              <th class="px-4 py-2">Fin prévue</th>
            </tr>
          </thead>
          <tbody class="text-gray-600">
            <tr>
              <td class="border px-4 py-2">Conception</td>
              <td class="border px-4 py-2">Jean Dupont</td>
              <td class="border px-4 py-2">En cours</td>
              <td class="border px-4 py-2">01/01/2024</td>
              <td class="border px-4 py-2">31/01/2024</td>
            </tr>
            <tr>
              <td class="border px-4 py-2">Développement</td>
              <td class="border px-4 py-2">Marie Curie</td>
              <td class="border px-4 py-2">Non commencé</td>
              <td class="border px-4 py-2">01/02/2024</td>
              <td class="border px-4 py-2">30/06/2024</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Performance Metrics Section -->
    <section class="bg-white shadow-md rounded-md p-6">
      <h2 class="text-lg font-semibold text-gray-700">Cadre de Mesure de Rendement</h2>
      <div class="mt-4 overflow-x-auto">
        <table class="table-auto w-full text-left border-collapse">
          <thead class="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th class="px-4 py-2">Indicateur</th>
              <th class="px-4 py-2">Cible (année)</th>
              <th class="px-4 py-2">Réalisé (année)</th>
              <th class="px-4 py-2">Taux (%)</th>
            </tr>
          </thead>
          <tbody class="text-gray-600">
            <tr>
              <td class="border px-4 py-2">Chiffre d'affaires</td>
              <td class="border px-4 py-2">500,000 €</td>
              <td class="border px-4 py-2">450,000 €</td>
              <td class="border px-4 py-2">90%</td>
            </tr>
            <tr>
              <td class="border px-4 py-2">Projets livrés</td>
              <td class="border px-4 py-2">10</td>
              <td class="border px-4 py-2">8</td>
              <td class="border px-4 py-2">80%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <h2 class="my-2">Budget</h2>
    <PieChart :height="400" />
    <h2 class="my-2">Activités</h2>
    <ReportBarChart :height="400" class="py-4 mt-6" />
    <h2 class="my-2">Rendements</h2>
    <VerticalBarChart class="mt-4" :height="400" />
    <div class="report-chart">
      <h2 class="my-2">Statistiques financiers</h2>
      <ReportLineChart :height="275" class="mt-6 -mb-6" />
    </div>
  </div>
  <!-- fin new sample -->
</template>

<script setup>
import { ref, onMounted } from "vue";
import ChartCircular from "../../../../components/news/ChartCircular.vue";
import ReportBarChart from "@/components/report-bar-chart/Main.vue";
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import ProjetService from "@/services/modules/projet.service.js";
import VerticalBarChart from "@/components/vertical-bar-chart/Main.vue";
import ReportLineChart from "@/components/report-line-chart/Main.vue";
import PieChart from "@/components/pie-chart/Main.vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

console.log("projetId", route.params.id);

const loadingOption = ref(true);
const graphiqueData = ref([]);
const getStat = function () {
  ProjetService.statistiques(route.params.id)
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
};

onMounted(() => {
  console.log("projetId", route.params.id);
  getStat();
});
</script>
<style scoped></style>
