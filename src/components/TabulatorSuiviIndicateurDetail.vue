<template>
  <div class="flex justify-end my-1">
    <ExportationSuiviIndicateur :datas="data" :years="years" />
  </div>
  <div class="overflow-x-auto table-container">
    <div ref="tableWrapper" class="table-wrapper">

      <table id="my-table" class="w-full max-w-full my-2 border-collapse editor_listing_table border-slate-500" cellpadding="6" cellspacing="0">
                <thead class="text-white bg-primary">
                  <tr>
                    <th rowspan="2" class="py-3 sticky-header border !border-slate-800 min-w-[500px] sticky-column">Résultats escomptés</th>
                    <th rowspan="2" class="py-3 sticky-header border !border-slate-800 min-w-[80px] sticky-column-second">Indice</th>
                    <th rowspan="2" class="py-3 !z-[1] sticky-header border !border-slate-800 min-w-[500px]">Indicateurs</th>
                    <th rowspan="2" class="py-3 !z-[1] sticky-header border !border-slate-800 min-w-[300px]">Description de l'indicateur</th>
                    <th rowspan="2" class="py-3 !z-[1] sticky-header border !border-slate-800 min-w-[100px]">Situation de référence</th>
                    <th :colspan="years.length + 1" class="py-3 !z-[1] sticky-header border !border-slate-800 min-w-[70px]">Cibles</th>
                    <th :colspan="years.length + 1" class="py-3 !z-[1] sticky-header border !border-slate-800 min-w-[70px]">Réalisation</th>
                    <th rowspan="2" class="py-3 sticky-header !z-[1] border !border-slate-800 min-w-[150px]">Taux de réalisation</th>
                    <th rowspan="2" class="py-3 sticky-header !z-[1] border !border-slate-800 min-w-[150px]">Sources de données</th>
                    <th rowspan="2" class="py-3 sticky-header !z-[1] border !border-slate-800 min-w-[150px]">Méthode de collecte des données</th>
                    <th rowspan="2" class="py-3 sticky-header !z-[1] border !border-slate-800 min-w-[150px]">Fréquence de la collecte de données</th>
                    <th rowspan="2" class="py-3 sticky-header !z-[1] border !border-slate-800 min-w-[150px]">Responsable</th>
                  </tr>
                  <tr>
                    <th v-for="(year, index) in years" :key="index" class="py-3 !z-[1] sticky top-0 sticky-header border !border-slate-800 min-w-[70px]">{{ year }}</th>
                    <th class="py-3 border !border-slate-800 min-w-[100px] sticky-header !z-[1] sticky top-0">Total</th>
                    <th v-for="(year, index) in years" :key="index" class="py-3 !z-[1] sticky-header border !border-slate-800 min-w-[70px] sticky top-0">{{ year }}</th>
                    <th class="py-3 border !border-slate-800 min-w-[100px] sticky-header !z-[1] sticky top-0">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(result, i) in data" :key="result.id">
                    <tr class="uppercase" v-if="result.indicateurs && result.indicateurs.length > 0" :class="[result.type == 'produit' ? 'text-black' : 'text-white']" :style="{ 'background-color': findColorCadreMesure(result.type) }">
                      <td :colspan="13 + years.length * 2" class="font-semibold">{{ result.type }} {{ result.indice }}</td>
                    </tr>
                    <template v-for="(indicateur, j) in result.indicateurs" :key="indicateur.id">
                      <tr>
                        <!-- Première colonne fixe -->
                        <td class="font-semibold sticky-column" v-if="j === 0" :rowspan="result.indicateurs.length" style="left: 0">
                          {{ result.nom }}
                        </td>

                        <!-- Deuxième colonne fixe -->
                        <td class="font-semibold sticky-column-second" style="left: 500px">Ind {{ indicateur.code }}</td>

                        <!-- Troisième colonne fixe -->
                        <td class="">
                          {{ indicateur.nom }}
                        </td>

                        <!-- Colonnes restantes -->
                        <td>{{ indicateur.description ?? "" }}</td>
                        <td v-html="formatObject(indicateur.valeurDeBase)"></td>
                        <td v-for="(year, index) in years" :key="index">
                          <span v-html="formatObject(indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeurCible)"></span>
                        </td>
                        <td v-html="formatObject(indicateur.valeurCibleTotal)"></td>
                        <td v-for="(year, index) in years" :key="index">
                          <span v-html="formatObject(indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeur_realiser)"></span>
                        </td>
                        <td v-html="formatObject(indicateur.valeurRealiserTotal)"></td>
                        <td v-html="formatObject(indicateur.taux_realisation)"></td>
                        <td>{{ indicateur.sources_de_donnee }}</td>
                        <td>{{ indicateur.methode_de_la_collecte }}</td>
                        <td>{{ indicateur.frequence_de_la_collecte }}</td>
                        <td>
                          <span v-html="formatResponsable(indicateur.organisations_responsable)"></span><br />
                          {{ indicateur.ug_responsable?.nom ?? "" }}
                          {{}}
                        </td>
                      </tr>
                    </template>
                    <template v-for="(result, i) in result.categories" :key="result.id">
                      <tr class="uppercase" v-if="result.indicateurs && result.indicateurs.length > 0" :class="[result.type == 'produit' ? 'text-black' : 'text-white']" :style="{ 'background-color': findColorCadreMesure(result.type) }">
                        <td :colspan="13 + years.length * 2" class="font-semibold">{{ result.type }} {{ result.indice }}</td>
                      </tr>
                      <template v-for="(indicateur, j) in result.indicateurs" :key="indicateur.id">
                        <tr>
                          <!-- Première colonne fixe -->
                          <td class="font-semibold sticky-column" v-if="j === 0" :rowspan="result.indicateurs.length" style="left: 0">
                            {{ result.nom }}
                          </td>

                          <!-- Deuxième colonne fixe -->
                          <td class="font-semibold sticky-column-second" style="left: 500px">Ind {{ indicateur.code }}</td>

                          <!-- Troisième colonne fixe -->
                          <td class="">
                            {{ indicateur.nom }}
                          </td>

                          <!-- Colonnes restantes -->
                          <td>{{ indicateur.description ?? "" }}</td>
                          <td v-html="formatObject(indicateur.valeurDeBase)"></td>
                          <td v-for="(year, index) in years" :key="index">
                            <span v-html="formatObject(indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeurCible)"></span>
                          </td>
                          <td v-html="formatObject(indicateur.valeurCibleTotal)"></td>
                          <td v-for="(year, index) in years" :key="index">
                            <span v-html="formatObject(indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeur_realiser)"></span>
                          </td>
                          <td v-html="formatObject(indicateur.valeurRealiserTotal)"></td>
                          <td v-html="formatObject(indicateur.taux_realisation)"></td>
                          <td>{{ indicateur.sources_de_donnee }}</td>
                          <td>{{ indicateur.methode_de_la_collecte }}</td>
                          <td>{{ indicateur.frequence_de_la_collecte }}</td>
                          <td>
                            <span v-html="formatResponsable(indicateur.organisations_responsable)"></span><br />
                            {{ indicateur.ug_responsable?.nom ?? "" }}
                            {{}}
                          </td>
                        </tr>
                      </template>
                      <template v-for="(result, i) in result.categories" :key="result.id">
                        <tr class="uppercase" v-if="result.indicateurs && result.indicateurs.length > 0" :class="[result.type == 'produit' ? 'text-black' : 'text-white']" :style="{ 'background-color': findColorCadreMesure(result.type) }">
                          <td :colspan="13 + years.length * 2" class="font-semibold">{{ result.type }} {{ result.indice }}</td>
                        </tr>
                        <template v-for="(indicateur, j) in result.indicateurs" :key="indicateur.id">
                          <tr>
                            <!-- Première colonne fixe -->
                            <td class="font-semibold sticky-column" v-if="j === 0" :rowspan="result.indicateurs.length" style="left: 0">
                              {{ result.nom }}
                            </td>

                            <!-- Deuxième colonne fixe -->
                            <td class="font-semibold sticky-column-second" style="left: 500px">Ind {{ indicateur.code }}</td>

                            <!-- Troisième colonne fixe -->
                            <td class="">
                              {{ indicateur.nom }}
                            </td>

                            <!-- Colonnes restantes -->
                            <td>{{ indicateur.description ?? "" }}</td>
                            <td v-html="formatObject(indicateur.valeurDeBase)"></td>
                            <td v-for="(year, index) in years" :key="index">
                              <span v-html="formatObject(indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeurCible)"></span>
                            </td>
                            <td v-html="formatObject(indicateur.valeurCibleTotal)"></td>
                            <td v-for="(year, index) in years" :key="index">
                              <span v-html="formatObject(indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeur_realiser)"></span>
                            </td>
                            <td v-html="formatObject(indicateur.valeurRealiserTotal)"></td>
                            <td v-html="formatObject(indicateur.taux_realisation)"></td>
                            <td>{{ indicateur.sources_de_donnee }}</td>
                            <td>{{ indicateur.methode_de_la_collecte }}</td>
                            <td>{{ indicateur.frequence_de_la_collecte }}</td>
                            <td>
                              <span v-html="formatResponsable(indicateur.organisations_responsable)"></span><br />
                              {{ indicateur.ug_responsable?.nom ?? "" }}
                              {{}}
                            </td>
                          </tr>
                        </template>
                      </template>
                    </template>
                  </template>
                </tbody>
              </table>

    </div>
  </div>

  <!-- Modal for creating/updating -->
  <Modal size="modal-lg" backdrop="static" :show="showModalSuivi" @hidden="closeModal">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Modifier un site</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <!-- <InputForm label="Nom" v-model="payload.nom" />
            <InputForm label="Pays" v-model="payload.pays" />
            <InputForm label="Departement" v-model="payload.departement" />
            <InputForm label="Commune" v-model="payload.commune" />
            <InputForm label="Arrondissement" v-model="payload.arrondissement" />
            <InputForm label="Quartier" v-model="payload.quartier" />
            <div class="flex items-center justify-between gap-3">
              <InputForm label="Longitude" class="flex-1" v-model="payload.longitude" type="number" />
              <InputForm label="Latitude" class="flex-1" v-model="payload.latitude" type="number" />
            </div> -->
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="showModalSuivi = false" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" label="Modifier" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <!-- Modal for deleting -->
  <Modal :show="deleteModalPreview" @hidden="closeDeleteModal">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-lg">{{ nameSelect }}</div>
        <div class="mt-2 text-slate-500">Supprimer l'indicateur?</div>
      </div>
      <div class="flex justify-center gap-3 py-4">
        <button type="button" @click="cancelDelete" class="btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import SiteService from "@/services/modules/site.service";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { findColorCadreMesure } from "../utils/findColorIndicator";
import ExportationSuiviIndicateur from "./news/ExportationSuiviIndicateur.vue";

const props = defineProps({
  data: Array,
  years: Array,
});

const idSelect = ref("");
const nameSelect = ref("");
const showModalSuivi = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);

function formatDateOnly(dateTimeString) {
  // Vérifie si la chaîne est valide
  if (!dateTimeString) return null;

  // Utilise split pour extraire uniquement la date
  const [date] = dateTimeString.split(" ");
  return date;
}

function formatObject(obj) {
  if (!obj) return "";
  return Object.entries(obj)
    .map(([key, value]) => (key === "moy" ? value : `${key}: ${value}`))
    .join("<br>");
}

// Submit data (create or update)
const submitData = async () => {
  isLoading.value = true;
  const action = SiteService.update(idSelect.value, payload);
  try {
    await action;
    toast.success(`Indicateur modifié avec succès.`);
    getDatas();
    resetForm();
  } catch (e) {
    toast.error(getAllErrorMessages(e));
  } finally {
    isLoading.value = false;
  }
};

// Delete data
const deleteData = async () => {
  try {
    isLoading.value = true;
    await SiteService.destroy(idSelect.value);
    toast.success("Indicateur supprimé avec succès.");
    // getDatas();
  } catch (e) {
    toast.error(getAllErrorMessages(e));
  } finally {
    isLoading.value = false;
    deleteModalPreview.value = false;
  }
};

// Handle edit action
const handleEdit = (data) => {
  // idSelect.value = data.id;
  // payload.nom = data.nom;
  // payload.pays = data.pays;
  // payload.departement = data.departement;
  // payload.arrondissement = data.arrondissement;
  // payload.quartier = data.quartier;
  // payload.longitude = data.longitude;
  // payload.latitude = data.latitude;
  showModalSuivi.value = true;
};

// Handle delete action
const handleDelete = (data) => {
  idSelect.value = data.id;
  nameSelect.value = data.nom;
  deleteModalPreview.value = true;
};

const cancelDelete = () => {
  idSelect.value = "";
  deleteModalPreview.value = false;
};
const closeModal = () => (showModalSuivi.value = false);
const closeDeleteModal = () => (deleteModalPreview.value = false);

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
</script>

<style scoped>
table td {
  border: 1px solid white;
  padding-block: 8px;
}

/* Optionnel : Ajout d'une bordure pour les colonnes fixes */
.sticky-column,
.sticky-column-second,
.stick-column-third {
  border-right: 1px solid #f3f3f3;
}

.table-container {
  position: relative;
  max-height: 75vh; /* Ajustez selon vos besoins */
  overflow: hidden;
}

.table-wrapper {
  overflow-y: auto;
  overflow-x: auto;
  max-height: calc(75vh - 20px); /* Ajustez selon vos besoins */
}
.sticky-header {
  background-color: rgb(15 52 96) !important;
}
.sticky-heade {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  z-index: 1;
  border-bottom: 2px solid #ddd;
  padding: 10px;
  text-align: left;
}

/* Fixe l'en-tête du tableau */
.editor_listing_table thead th {
  position: sticky; /* Garde l'en-tête en haut */
  top: 0; /* Positionnement par rapport au haut */
  background-color: #ffffff; /* Assure un fond blanc pour l'en-tête */
  z-index: 10; /* Évite que les lignes passent par-dessus */
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0); /* Optionnel : effet d'ombre pour séparation visuelle */
}

/* Style des colonnes collantes */
.sticky-column {
  position: sticky;
  left: 0;
  background-color: #ffffff;
  z-index: 5;
  border-right: 1px solid #ccc;
}

.sticky-column-second {
  position: sticky;
  left: 500px; /* Ajuster selon vos besoins */
  background-color: #ffffff;
  z-index: 5;
  border-right: 1px solid #ccc;
}

.sticky-column-third {
  position: sticky;
  left: 580px; /* Ajuster selon vos besoins */
  background-color: #ffffff;
  z-index: 5;
  border-right: 1px solid #ccc;
}

/* Ajout de bordures pour les lignes */
.editor_listing_table td,
.editor_listing_table th {
  border: 1px solid #ddd; /* Bordures légères */
}
</style>

