<template>
  <template v-for="item in data" :key="item.id">
    <!-- Render the category header row -->
    <tr
      v-if="item.indicateurs && item.indicateurs.length > 0"
      class="uppercase"
      :class="[item.type === 'produit' ? 'text-black' : 'text-white']"
      :style="{ 'background-color': findColorCadreMesure(item.type) }"
    >
      <td :colspan="14 + years.length * 2" class="font-semibold">
        {{ item.type }} {{ item.indice }}
      </td>
    </tr>

    <!-- Render the indicator rows for the current category -->
    <template v-for="(indicateur, j) in item.indicateurs" :key="indicateur.id">
      <tr>
        <td
          class="font-semibold sticky-column"
          v-if="j === 0"
          :rowspan="item.indicateurs.length"
        >
          {{ item.nom }}
        </td>
        <td class="font-semibold sticky-column-second">
          Ind {{ indicateur.code }}
        </td>
        <td class="sticky-column-third">{{ indicateur.nom }}</td>
        <td>{{ indicateur.description ?? "" }}</td>
        <td v-html="formatObject(indicateur.valeurDeBase)"></td>
        <td v-for="year in years" :key="year">
          <span
            v-html="
              formatObject(
                indicateur.valeursCible.find((valeur) => valeur.annee === year)
                  ?.valeurCible
              )
            "
          ></span>
        </td>
        <td v-html="formatObject(indicateur.valeurCibleTotal)"></td>
        <td v-for="year in years" :key="year">
          <span
            v-html="
              formatObject(
                indicateur.valeursCible.find((valeur) => valeur.annee === year)
                  ?.valeur_realiser
              )
            "
          ></span>
        </td>
        <td v-html="formatObject(indicateur.valeurRealiserTotal)"></td>
        <td v-html="formatObject(indicateur.taux_realisation)"></td>
        <td>{{ indicateur.sources_de_donnee }}</td>
        <td>{{ indicateur.hypothese }}</td>
        <td>{{ indicateur.methode_de_la_collecte }}</td>
        <td>{{ indicateur.frequence_de_la_collecte }}</td>
        <td>
          <span
            v-html="formatResponsable(indicateur.organisations_responsable)"
          ></span>
          <br />
          {{ indicateur.ug_responsable?.nom ?? "" }}
        </td>
        <td class="space-x-1">
            <button v-if="verifyPermission('creer-un-suivi-indicateur')" title="Suivre" @click="$emit('suivi', indicateur)" class="btn text-primary"><CornerLeftUp class="size-5" /></button>
            <button v-if="verifyPermission('voir-un-suivi-indicateur')" title="Voir" @click="$emit('detail-suivi', indicateur.id)" class="btn text-primary"><Eye class="size-5" /></button>
            <button v-if="verifyPermission('voir-un-suivi-indicateur')" title="Ajouter Structure" @click="$emit('structure', indicateur.id)" class="btn text-primary"><Plus class="size-5" />structure</button>
            <button v-if="verifyPermission('voir-un-suivi-indicateur')" title="Ajouter Année Cible" @click="$emit('year-cible', indicateur)" class="btn text-primary"><Plus class="size-5" />année cible</button>
            <button v-if="verifyPermission('supprimer-un-suivi-indicateur')" title="Modifier" @click="$emit('edit', indicateur)" class="btn text-pending"><Edit3 class="size-5" /></button>
            <button title="Modification complète" @click="$emit('comprehensive-edit', indicateur)" class="btn text-success"><Edit3 class="size-5" /></button>
            <button v-if="verifyPermission('supprimer-un-suivi-indicateur')" title="Supprimer" @click="$emit('delete', indicateur)" class="btn text-danger"><Trash class="size-5" /></button>
        </td>
      </tr>
    </template>

    <!-- Recursive call for sub-categories -->
    <CadreLogiqueRowGroup
      v-if="item.categories && item.categories.length > 0"
      :data="item.categories"
      :years="years"
      :verify-permission="verifyPermission"
      :find-color-cadre-mesure="findColorCadreMesure"
      :format-object="formatObject"
      :format-responsable="formatResponsable"
      @suivi="$emit('suivi', $event)"
      @detail-suivi="$emit('detail-suivi', $event)"
      @structure="$emit('structure', $event)"
      @year-cible="$emit('year-cible', $event)"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
  </template>
</template>

<script setup>
import { CornerLeftUp, Eye, Plus, Edit3, Trash } from 'lucide-vue-next';
import CadreLogiqueRowGroup from './CadreLogiqueRowGroup.vue';

defineProps({
  data: Array,
  years: Array,
  verifyPermission: Function,
  findColorCadreMesure: Function,
  formatObject: Function,
  formatResponsable: Function,
});

defineEmits(['suivi', 'detail-suivi', 'structure', 'year-cible', 'edit', 'comprehensive-edit', 'delete']);
</script>
