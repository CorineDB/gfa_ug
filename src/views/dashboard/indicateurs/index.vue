<template>
  <div class="p-4">
    <div class="overflow-x-auto shadow-lg rounded-lg">
      <table class="min-w-full bg-white">
        <!-- En-tête du tableau -->
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 p-2 w-1/4">Résultats accomplis</th>
            <th class="border border-gray-300 p-2 w-16"></th>
            <th class="border border-gray-300 p-2">Indicateurs</th>
            <th colspan="3" class="border border-gray-300 p-2 text-center">Cibles</th>
            <th class="border border-gray-300 p-2 text-center">Total (A)</th>
            <th colspan="3" class="border border-gray-300 p-2 text-center">Réalisation</th>
            <th class="border border-gray-300 p-2 text-center">Total (B)</th>
            <th class="border border-gray-300 p-2 text-center">(B/A)</th>
            <th class="border border-gray-300 p-2">Sources de données</th>
          </tr>
          <tr class="bg-gray-50">
            <th colspan="3"></th>
            <th class="border border-gray-300 p-2">Année 1</th>
            <th class="border border-gray-300 p-2">Année 2</th>
            <th class="border border-gray-300 p-2">Année n</th>
            <th class="border border-gray-300 p-2"></th>
            <th class="border border-gray-300 p-2">Année 1</th>
            <th class="border border-gray-300 p-2">Année 2</th>
            <th class="border border-gray-300 p-2">Année n</th>
            <th colspan="3"></th>
          </tr>
        </thead>
        <!-- Corps du tableau -->
        <tbody>
          <template v-for="(impact, index) in impacts" :key="index">
            <!-- Ligne d'impact -->
            <tr class="bg-blue-50">
              <td colspan="13" class="border border-gray-300 p-2 font-bold">
                {{ impact.title }}
              </td>
            </tr>
            <!-- Lignes d'indicateurs -->
            <tr v-for="(indicator, indIndex) in impact.indicators" 
                :key="indIndex" 
                class="hover:bg-gray-50">
              <td v-if="indIndex === 0" 
                  :rowspan="impact.indicators.length" 
                  class="border border-gray-300 p-2 align-top text-sm">
                {{ impact.description }}
              </td>
              <td class="border border-gray-300 p-2 text-sm font-medium">{{ indicator.code }}</td>
              <td class="border border-gray-300 p-2 text-sm">{{ indicator.description }}</td>
              <td class="border border-gray-300 p-2 text-center">{{ indicator.targets?.year1 }}</td>
              <td class="border border-gray-300 p-2 text-center">{{ indicator.targets?.year2 }}</td>
              <td class="border border-gray-300 p-2 text-center">{{ indicator.targets?.yearN }}</td>
              <td class="border border-gray-300 p-2 text-center">{{ indicator.totalA }}</td>
              <td class="border border-gray-300 p-2 text-center">{{ indicator.realization?.year1 }}</td>
              <td class="border border-gray-300 p-2 text-center">{{ indicator.realization?.year2 }}</td>
              <td class="border border-gray-300 p-2 text-center">{{ indicator.realization?.yearN }}</td>
              <td class="border border-gray-300 p-2 text-center">{{ indicator.totalB }}</td>
              <td class="border border-gray-300 p-2 text-center">{{ indicator.ratio }}</td>
              <td class="border border-gray-300 p-2 text-sm">{{ indicator.source }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableauIndicateurs',
  data() {
    return {
      impacts: [
        {
          title: "Impact",
          description: "Les citoyens jouissent de plus en plus de leurs droits socio-économiques et politiques grâce à la systématisation de la demande",
          indicators: [
            {
              code: "Ind 0.1",
              description: "Espérance de vie à la naissance",
              source: "INSAE",
              targets: {
                year1: 65,
                year2: 67,
                yearN: 70
              },
              realization: {
                year1: 64,
                year2: 66,
                yearN: 68
              },
              totalA: 70,
              totalB: 68,
              ratio: "97%"
            },
            {
              code: "Ind 0.2",
              description: "Proportion de la population utilisant des services d'eau potable à gestion sécurisée",
              source: "EDSB",
              targets: {
                year1: 75,
                year2: 80,
                yearN: 85
              },
              realization: {
                year1: 73,
                year2: 78,
                yearN: 82
              },
              totalA: 85,
              totalB: 82,
              ratio: "96%"
            }
          ]
        },
        {
          title: "EFFET 1",
          description: "Les citoyens sont conscients de leurs droits et devoirs",
          indicators: [
            {
              code: "Ind 1.1",
              description: "Taux de recouvrement des impôts et taxes",
              source: "DGI",
              targets: {
                year1: 80,
                year2: 85,
                yearN: 90
              },
              realization: {
                year1: 78,
                year2: 82,
                yearN: 85
              },
              totalA: 90,
              totalB: 85,
              ratio: "94%"
            }
          ]
        }
      ]
    }
  }
}
</script>