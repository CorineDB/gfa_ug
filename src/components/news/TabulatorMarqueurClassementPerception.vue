<template>
  <table class="w-full my-12 border border-collapse table-auto border-slate-500" cellpadding="4" cellspacing="0">
    <thead class="text-left bg-gray-400"></thead>
    <thead>
      <tr class="bg-white">
        <th class="py-3 font-semibold text-center bg-slate-200">Questions</th>
        <!-- <th class="py-3 font-semibold text-center bg-slate-200"></th> -->
        <th class="px-4 py-3" :style="{ 'background-color': getColorForValue(0) }">Non oberservé [0-0,25]</th>
        <th class="px-4 py-3" :style="{ 'background-color': getColorForValue(0.3) }">Partiellement observé [0,25-0,50]</th>
        <th class="px-4 py-3" :style="{ 'background-color': getColorForValue(0.6) }">Moyennement observé [0,50-0,75]</th>
        <th class="px-4 py-3" :style="{ 'background-color': getColorForValue(1) }">Observé [0,75-1]</th>
      </tr>
    </thead>
    <tbody class="text-black">
      <template v-for="(principe, pIndex) in data" :key="principe.id">
        <tr :style="{ 'background-color': getColorForValue(principe.indice_de_perception) }">
          <td colspan="5" class="p-2 font-semibold bg-slate-200">{{ principe.nom }}</td>
        </tr>

        <tr v-for="(question, qIndex) in principe.questions_de_gouvernance" :key="question.id">
          <!-- <td class="py-2 font-semibold bg-slate-200">QOP{{}}</td> -->
          <td class="py-2 bg-slate-200">{{ question.nom }}</td>
          <td class="py-2" :style="{ 'background-color': getColorForValue(0) }">
            <div class="text-center">
              <Tippy
                class="tooltip"
                :content="organisationsTooltipContent(question.score_ranges['0-0.25']?.organisations)"
                :options="{
                  theme: 'light',
                }"
                >{{ question.score_ranges["0-0.25"]?.organisations.map((ong) => ong.nom).join(", ") }}</Tippy
              >
            </div>
          </td>
          <td class="py-2" :style="{ 'background-color': getColorForValue(0.3) }">
            <div class="text-center">
              <Tippy
                class="tooltip"
                :content="organisationsTooltipContent(question.score_ranges['0.25-0.5']?.organisations)"
                :options="{
                  theme: 'light',
                }"
                >{{ question.score_ranges["0.25-0.5"]?.organisations.map((ong) => ong.nom).join(", ") }}</Tippy
              >
            </div>
          </td>
          <td class="py-2" :style="{ 'background-color': getColorForValue(0.6) }">
            <div class="text-center">
              <Tippy
                class="tooltip"
                :content="organisationsTooltipContent(question.score_ranges['0.5-0.75']?.organisations)"
                :options="{
                  theme: 'light',
                }"
                >{{ question.score_ranges["0.5-0.75"]?.organisations.map((ong) => ong.nom).join(", ") }}</Tippy
              >
            </div>
          </td>
          <td class="py-2" :style="{ 'background-color': getColorForValue(1) }">
            <div class="text-center">
              <Tippy
                class="tooltip"
                :content="organisationsTooltipContent(question.score_ranges['0.75-1']?.organisations)"
                :options="{
                  theme: 'light',
                }"
                >{{ question.score_ranges["0.75-1"]?.organisations.map((ong) => ong.nom).join(", ") }}</Tippy
              >
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script setup>
import { onMounted } from "vue";
import { getColorForValue } from "../../utils/findColorIndicator";

const props = defineProps({
  data: Array,
});

function organisationsTooltipContent(ong) {
  if (!ong) return "";
  return ong.map((org) => `${org.nom} : ${org.moyenne_ponderee}`).join(",");
}

// const cumulativeIndex = (pIndex, qIndex) => {
//   let totalQuestions = 0;
//   for (let i = 0; i < pIndex; i++) {
//     totalQuestions += props.data[i].questions_de_gouvernance.length;
//   }
//   return totalQuestions + qIndex + 1; // +1 to start index from 1
// };
</script>

<style scoped>
table td {
  border: 1px solid rgb(46, 46, 46);
  padding-inline: 6px;
}
</style>
