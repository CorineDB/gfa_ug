<template>
  <table class="w-full my-10 border-collapse table-auto border-slate-500" cellpadding="6" cellspacing="0">
    <thead class="text-black">
      <tr>
        <th class="py-3 border border-slate-900">Résultats escomptés</th>
        <th class="py-3 border border-slate-900">Indice</th>
        <th class="py-3 border border-slate-900">Indicateurs</th>
        <th class="py-3 border border-slate-900">Description de l'indicateur</th>
        <th class="py-3 border border-slate-900">Situation de référence</th>
        <th v-for="(year, index) in years" :key="index" class="py-3 border border-slate-900">{{ year }}</th>
        <th class="py-3 border border-slate-900">Total</th>
        <th class="py-3 border border-slate-900">Sources de données</th>
        <th class="py-3 border border-slate-900">Méthode de collecte des données</th>
        <th class="py-3 border border-slate-900">Fréquence de la collecte de données</th>
        <th class="py-3 border border-slate-900">Responsable</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="result in data" :key="result.id">
        <tr class="text-white" :style="{ 'background-color': findColorCadreMesure(result.type) }">
          <td :colspan="11 + years.length" class="font-semibold">{{ result.type }}</td>
        </tr>
        <template v-for="indicateur in result.indicateurs" :key="indicateur.id">
          <tr>
            <td class="max-w-[700px]">{{ result.nom }}</td>
            <td class="font-semibold">Ind {{ indicateur.indice }}</td>
            <td>{{ indicateur.nom }}</td>
            <td>{{ indicateur.description ?? "" }}</td>
            <td v-html="formatValeurDeBase(indicateur.valeurDeBase)"></td>
            <td v-for="(year, index) in years" :key="index">{{ indicateur.valeursCible[index]?.annee == year ? "" : "" }}</td>
            <td></td>
            <td>{{ indicateur.sources_de_donnee }}</td>
            <td>{{ indicateur.methode_de_la_collecte }}</td>
            <td>{{ indicateur.frequence_de_la_collecte }}</td>
            <td v-html="`${formatResponsable(indicateur.ug_responsable ?? [])}${formatResponsable(indicateur.organisations_responsable ?? [])}`"></td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
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
</script>

<style scoped>
table td {
  border: 1px solid rgb(46, 46, 46);
  padding-block: 8px;
}
</style>
