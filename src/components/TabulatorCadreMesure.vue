<template>
  <div class="overflow-x-auto">
    <table class="w-full max-w-full my-10 border-collapse editor_listing_table border-slate-500" cellpadding="6" cellspacing="0">
      <thead class="text-black">
        <tr>
          <th class="py-3 border border-slate-900 min-w-[500px]">Résultats escomptés</th>
          <th class="py-3 border border-slate-900 min-w-[80px]">Indice</th>
          <th class="py-3 border border-slate-900 min-w-[500px]">Indicateurs</th>
          <th class="py-3 border border-slate-900 min-w-[300px]">Description de l'indicateur</th>
          <th class="py-3 border border-slate-900 min-w-[100px]">Situation de référence</th>
          <th v-for="(year, index) in years" :key="index" class="py-3 border border-slate-900 min-w-[70px]">{{ year }}</th>
          <th class="py-3 border border-slate-900 min-w-[100px]">Total</th>
          <th class="py-3 border border-slate-900 min-w-[150px]">Sources de données</th>
          <th class="py-3 border border-slate-900 min-w-[150px]">Méthode de collecte des données</th>
          <th class="py-3 border border-slate-900 min-w-[150px]">Fréquence de la collecte de données</th>
          <th class="py-3 border border-slate-900 min-w-[150px]">Responsable</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(result, i) in data" :key="result.id">
          <tr class="uppercase" :class="[result.type == 'produit' ? 'text-black' : 'text-white']" :style="{ 'background-color': findColorCadreMesure(result.type) }">
            <td :colspan="11 + years.length" class="font-semibold">{{ result.type }} {{ result.indice }}</td>
          </tr>
          <template v-for="(indicateur, j) in result.indicateurs" :key="indicateur.id">
            <tr>
              <!-- <td class="max-w-[700px]">{{ result.nom }}</td> -->
              <td class="font-semibold" v-if="j === 0" :rowspan="result.indicateurs.length">
                {{ result.nom }}
              </td>
              <td class="font-semibold">Ind {{ indicateur.code }}</td>
              <td>{{ indicateur.nom }}</td>
              <td>{{ indicateur.description ?? "" }}</td>
              <td v-html="formatValeurDeBase(indicateur.valeurDeBase)"></td>
              <td v-for="(year, index) in years" :key="index">
                <span v-html="formatObject(indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeurCible)"></span>
              </td>
              <td></td>
              <td>{{ indicateur.sources_de_donnee }}</td>
              <td>{{ indicateur.methode_de_la_collecte }}</td>
              <td>{{ indicateur.frequence_de_la_collecte }}</td>
              <td>
                {{ indicateur.ug_responsable?.nom ?? "" }} <br />
                {{ formatResponsable(indicateur.organisations_responsable) }}
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { findColorCadreMesure } from "../utils/findColorIndicator";

const props = defineProps({
  data: Array,
  years: Array,
});

function formatValeurDeBase(obj) {
  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${value}`)
    .join("<br>");
}

function formatResponsable(responsable) {
  return responsable.map((item) => item.nom).join("<br>");
}

function valeurCibleForYear(year, valeur_cible) {
  return valeur_cible.find((valeur) => valeur.annee === year)?.valeurCible;
}

function formatObject(obj) {
  if (!obj) return "";
  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${value}`)
    .join("<br>");
}
</script>

<style scoped>
table td {
  border: 1px solid rgb(46, 46, 46);
  padding-block: 8px;
}
</style>
