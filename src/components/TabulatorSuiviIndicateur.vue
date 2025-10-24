<template>
  <div class="flex justify-end my-1">
    <ExportationSuiviIndicateur :datas="data" :years="years" class="mr-3" />
    <button @click="generatePDFAdvanced" class="btn btn-primary text-left">Télécharger PDF</button>
  </div>

  <div class="overflow-x-auto">
    <table id="my-table5" class="w-full max-w-full bg-white border-collapse editor_listing_table border-slate-500" cellpadding="6" cellspacing="0">
      <thead class="text-white border-white bg-primary">
        <tr>
          <th rowspan="2" class="py-3 border border-white min-w-[500px]">Indicateurs</th>
          <th rowspan="2" class="py-3 border border-white min-w-[80px]">Trimestre</th>
          <th rowspan="2" class="py-3 border border-white min-w-[80px]">Cumul</th>
          <th :colspan="years.length + 1" class="py-3 border border-white min-w-[70px]">Cibles</th>
          <th :colspan="years.length + 1" class="py-3 border border-white min-w-[70px]">Réalisation</th>
          <th rowspan="2" class="py-3 border border-white min-w-[180px]">Taux de realisation</th>
          <!-- <th class="py-3 border border-white min-w-[280px]">Source de données</th>
          <th class="py-3 border border-white min-w-[180px]">Fréquence de la collecte de données</th>
          <th class="py-3 border border-white min-w-[280px]">Méthode de collecte</th> -->
          <th rowspan="2" class="py-3 border border-white min-w-[120px]">Date de suivie</th>
          <!-- <th class="py-3 border border-white min-w-[120px]">Responsables</th> -->
          <th rowspan="2" class="py-3 border border-slate-900 min-w-[200px]">Actions</th>
        </tr>
        <tr>
          <th v-for="(year, index) in years" :key="index" class="py-3 border border-white min-w-[70px]">{{ year }}</th>
          <th class="py-3 border border-white min-w-[100px]">Total</th>
          <th v-for="(year, index) in years" :key="index" class="py-3 border border-white min-w-[70px]">{{ year }}</th>
          <th class="py-3 border border-white min-w-[100px]">Total</th>
        </tr>
      </thead>
      <tbody>
        <LoaderSnipper v-if="isDataLoading" />
        <template v-else v-for="(suiviIndicateur, j) in data" :key="suiviIndicateur.id">
          <tr>
            <td class="font-semibold p-2">
              {{ suiviIndicateur.indicateur.nom }}
            </td>
            <td class="text-center">{{ suiviIndicateur.trimestre }}</td>
            <td class="text-center">{{ suiviIndicateur.cumul.join(", ") }}</td>
            <td class="text-center" v-for="(year, index) in years" :key="index">
              <span v-html="formatObject(suiviIndicateur.indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeurCible)"></span>
            </td>
            <td class="text-center" v-html="formatObject(suiviIndicateur.indicateur.valeurCibleTotal)"></td>

            <td class="text-center" v-for="(year, index) in years" :key="index">
              <span v-html="formatObject(suiviIndicateur.indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeur_realiser)"></span>
            </td>
            <td class="text-center" v-html="formatObject(suiviIndicateur.indicateur.valeurRealiserTotal)"></td>
            <td class="text-center" v-html="formatObject(suiviIndicateur.indicateur.taux_realisation)"></td>
            <!-- <td class="">{{ indicateur.sources_de_donnee }}</td>
            <td class="">{{ indicateur.indicateur.frequence_de_la_collecte }}</td>
            <td class="">{{ indicateur.indicateur.methode_de_la_collecte }}</td> -->
            <td class="text-center">{{ formatDateOnly(suiviIndicateur.dateSuivie) }}</td>

            <td class="space-x-3 p-2 text-center">
              <button title="Suivre" @click="handleSuivi(suiviIndicateur)" class="btn text-primary">Suivi</button>
              <button title="Voir" @click="goToDetailSuivi(suiviIndicateur.indicateur.id)" class="btn text-primary">Details</button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <!-- SUIVIE  -->
  <Modal size="modal-lg" backdrop="static" :show="showModalSuivi" @hidden="closeModal">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Enregistrer un suivi </h2>
    </ModalHeader>
    <form @submit.prevent="submitSuivi">
      <ModalBody>
        <div class="grid grid-cols-1 gap-5">
          <div class="flex-1">
            <label class="form-label" for="annee-suivi-indicateur">Année de suivi</label>
            <TomSelect 
              id="annee-suivi-indicateur"
              name="annee"
              v-model="payloadSuivi.annee" 
              :options="{ placeholder: 'Selectionez une année' }" 
              class="w-full"
            >
              <option v-for="annee in years" :key="annee" :value="annee">{{ annee }}</option>
            </TomSelect>
            <div v-if="errors.annee" class="mt-2 text-danger">{{ getFieldErrors(errors.annee) }}</div>
          </div>

          <div v-if="!isAgregerCurrentIndicateur" class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex-1">
              <InputForm 
                id="valeur-cible-simple"
                name="valeurCible"
                label="Valeur cible" 
                v-model="payloadSuivi.valeurCible" 
                type="number" 
                :disabled="shouldDisableNonAgregerFields" 
              />
              <div v-if="errors.valeurCible" class="mt-2 text-danger">{{ getFieldErrors(errors.valeurCible) }}</div>
            </div>
            <div class="flex-1">
              <InputForm 
                id="valeur-realisee-simple"
                name="valeurRealise"
                label="Valeur réalisée" 
                v-model="payloadSuivi.valeurRealise" 
                type="number" 
              />
              <div v-if="errors.valeurRealise" class="mt-2 text-danger">{{ getFieldErrors(errors.valeurRealise) }}</div>
            </div>
          </div>

          <div v-if="valueKeysIndicateurSuivi.length > 0 && isAgregerCurrentIndicateur" class="">
            <label class="form-label" for="valeur-cible-agregee">Valeur Cible</label>
            <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
              <div v-for="(base, index) in valueKeysIndicateurSuivi" :key="index" class="input-group">
                <div class="flex items-center justify-center text-sm truncate input-group-text">{{ base.libelle }}</div>
                <input 
                  :id="`valeur-cible-agregee-${base.id}`"
                  :name="`valeurCible_${base.id}`"
                  type="number" 
                  class="form-control" 
                  :disabled="shouldDisableAgregerFields" 
                  v-model="valeurCible.find((item) => item.keyId === base.id).value" 
                  @input="updateValueCible(base.id, $event.target.value)" 
                  placeholder="valeur cible" 
                  aria-label="valeur" 
                  aria-describedby="input-group-valeur" 
                />
              </div>
            </div>
          </div>

          <div v-if="valueKeysIndicateurSuivi.length > 0 && isAgregerCurrentIndicateur" class="">
            <label class="form-label" for="valeur-realisee-agregee">Valeur Réalisée</label>
            <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
              <div v-for="(base, index) in valueKeysIndicateurSuivi" :key="index" class="input-group">
                <div class="flex items-center justify-center text-sm truncate input-group-text">{{ base.libelle }}</div>
                <input 
                  :id="`valeur-realisee-agregee-${base.id}`"
                  :name="`valeurRealise_${base.id}`"
                  type="number" 
                  class="form-control" 
                  v-model="valeurRealise.find((item) => item.keyId === base.id).value" 
                  @input="updateValueRealiser(base.id, $event.target.value)" 
                  placeholder="valeur réalisée" 
                  aria-label="valeur" 
                  aria-describedby="input-group-valeur" 
                />
              </div>
            </div>
          </div>

          <div class="flex-1">
            <label id="label-option-suivi">Suivi par date ou trimestre?</label>
            <div class="flex flex-col gap-3 mt-2 sm:flex-row">
              <div v-for="(item, index) in optionsSuivi" :key="index" class="mr-2 form-check">
                <input 
                  :id="`option-suivi-${item.id}`" 
                  class="form-check-input" 
                  type="radio" 
                  name="option_suivi" 
                  v-model="suiviOption" 
                  :value="item.id" 
                />
                <label class="form-check-label" :for="`option-suivi-${item.id}`">{{ item.label }}</label>
              </div>
            </div>
          </div>

          <div v-if="suiviOption == 'trimestre'" class="flex-1">
            <label class="form-label" for="trimestre-suivi-indicateur">Trimestre</label>
            <TomSelect 
              id="trimestre-suivi-indicateur"
              name="trimestre"
              v-model="payloadSuivi.trimestre" 
              :options="{ placeholder: 'Selectionez un trimestre' }" 
              class="w-full"
            >
              <option value=""></option>
              <option v-for="trimestre in trimestres" :key="trimestre" :value="trimestre">Trimestre {{ trimestre }}</option>
            </TomSelect>
            <div v-if="errors.trimestre" class="mt-2 text-danger">{{ getFieldErrors(errors.trimestre) }}</div>
          </div>

          <div v-else class="flex-1">
            <InputForm 
              id="date-suivi-indicateur"
              name="dateSuivie"
              label="Date de suivi" 
              v-model="payloadSuivi.dateSuivie" 
              type="date" 
            />
            <div v-if="errors.dateSuivie" class="mt-2 text-danger">{{ getFieldErrors(errors.dateSuivie) }}</div>
          </div>

          <div class="flex-1">
            <label class="form-label" for="source-donnees-suivi">Source de données</label>
            <TomSelect 
              id="source-donnees-suivi"
              name="sources_de_donnee"
              v-model="payloadSuivi.sources_de_donnee" 
              :options="{ placeholder: 'Selectionez une source' }" 
              class="w-full"
            >
              <option value=""></option>
              <option v-for="(source, index) in sourcesDonnees" :key="index" :value="source">{{ source }}</option>
            </TomSelect>
            <div v-if="errors.sources_de_donnee" class="mt-2 text-danger">{{ getFieldErrors(errors.sources_de_donnee) }}</div>
          </div>

          <div class="flex-1">
            <label class="form-label" for="commentaire-suivi-indicateur">Commentaire</label>
            <div class="">
              <textarea 
                id="commentaire-suivi-indicateur"
                name="commentaire"
                class="form-control" 
                v-model="payloadSuivi.commentaire" 
                cols="30" 
                rows="2"
              ></textarea>
            </div>
            <div v-if="errors.commentaire" class="mt-2 text-danger">{{ getFieldErrors(errors.commentaire) }}</div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button 
            type="button" 
            @click="resetFormSuivi" 
            class="w-full px-2 py-2 my-3 btn btn-outline-secondary"
            id="annuler-suivi-indicateur"
          >
            Annuler
          </button>
          <VButton 
            id="enregistrer-suivi-indicateur"
            :loading="isLoading" 
            label="Enrégistrer" 
            type="submit"
          />
        </div>
      </ModalFooter>
    </form>
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
import { sourcesDonnees } from "@/utils/constants";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { useRouter } from "vue-router";
import IndicateursService from "@/services/modules/indicateur.service";

const emit = defineEmits(["refreshData"]);

const router = useRouter();

// Variable pour stocker les erreurs de validation
const errors = ref({});

// Fonction pour gérer l'affichage des erreurs
const getFieldErrors = (fieldErrors) => {
  if (!fieldErrors || !Array.isArray(fieldErrors)) return "";
  return fieldErrors.join(", ");
};

//generer pdf
// const generatePDF = () => {
//   const doc = new jsPDF({ orientation: "landscape", format: "a0" });
//   autoTable(doc, { html: "#my-table5" });

//   doc.text("Suivi indicateur", 10, 10);

//   doc.save("suivi_indicateur.pdf");
// };

const generatePDFAdvanced = () => {
  const doc = new jsPDF({
    orientation: "landscape",
    format: "a0",
    unit: "mm",
  });

  const pageWidth = doc.internal.pageSize.width;

  // Get current date and time
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();

  // Add date and time to the top right corner
  doc.setFontSize(12);
  const dateTimeStr = `Générer le: ${dateStr} à ${timeStr}`;
  const textXOffset = pageWidth - doc.getTextWidth(dateTimeStr) - 10;
  doc.text(dateTimeStr, textXOffset, 10);

  // Récupérer les données du tableau depuis le DOM
  const table = document.getElementById("my-table5");
  const rows = [];
  const headers = [];

  // Extraire les en-têtes
  const headerRows = table.querySelectorAll("thead tr");
  headerRows.forEach((row) => {
    const headerRow = [];
    row.querySelectorAll("th").forEach((th) => {
      headerRow.push({
        content: th.textContent.trim(),
        colSpan: th.colSpan || 1,
        rowSpan: th.rowSpan || 1,
      });
    });
    headers.push(headerRow);
  });

  // Extraire les données du corps
  const bodyRows = table.querySelectorAll("tbody tr");
  bodyRows.forEach((row) => {
    const rowData = [];
    const backgroundColor = row.style.backgroundColor;
    const textColor = window.getComputedStyle(row).color;

    row.querySelectorAll("td").forEach((td) => {
      rowData.push({
        content: td.textContent.trim(),
        styles: {
          fillColor: backgroundColor ? hexToRgb(backgroundColor) : [255, 255, 255],
          textColor: textColor ? hexToRgb(textColor) : [0, 0, 0],
        },
      });
    });

    if (rowData.length > 0) {
      rows.push(rowData);
    }
  });

  // Fonction pour convertir hex/rgb en tableau RGB
  function hexToRgb(color) {
    if (color.startsWith("rgb")) {
      const matches = color.match(/\d+/g);
      return matches ? matches.map(Number) : [255, 255, 255];
    } else if (color.startsWith("#")) {
      const hex = color.substring(1);
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return [r, g, b];
    }
    return [255, 255, 255];
  }

  // Ajouter le titre
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Suivi indicateur", 14, 15);

  // Configuration du tableau
  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20,
    theme: "plain",
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [15, 52, 96],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    didParseCell: function (data) {
      // Appliquer les styles personnalisés pour chaque cellule
      if (data.row.raw && data.row.raw[data.column.index] && data.row.raw[data.column.index].styles) {
        Object.assign(data.cell.styles, data.row.raw[data.column.index].styles);
      }
    },
  });

  doc.save("suivi_indicateur.pdf");
};

const props = defineProps({
  data: Array,
  years: Array,
  isDataLoading: Boolean,
});

const showModalSuivi = ref(false);
const isLoading = ref(false);

const valueKeysIndicateurSuivi = ref([]);
const isAgregerCurrentIndicateur = ref(false);

const valeurCible = ref([]);
const valeurRealise = ref([]);

// Computed pour déterminer si les champs doivent être désactivés
const shouldDisableNonAgregerFields = computed(() => {
  if (isAgregerCurrentIndicateur.value) return false;

  const valeur = payloadSuivi.valeurCible;
  // Vérifier que la valeur existe et n'est pas vide (0 est accepté comme valeur valide)
  return valeur !== "" && valeur !== null && valeur !== undefined && String(valeur).trim() !== "";
});

// Computed pour désactiver les champs de valeurs cibles agrégées
const shouldDisableAgregerFields = computed(() => {
  return isAgregerCurrentIndicateur.value &&
         valeurCible.value.length > 0 &&
         valeurCible.value.some(item => item.value !== "" && item.value !== null && item.value !== undefined);
});

const getCurrentQuarter = function () {
  const month = new Date().getMonth() + 1; // Les mois sont indexés à partir de 0
  return Math.ceil(month / 3); // Calcul du trimestre actuel
};

const trimestres = [1, 2, 3, 4];
const optionsSuivi = [
  { label: "Par date", id: "date" },
  { label: "Par trimestre", id: "trimestre" },
];
const suiviOption = ref(optionsSuivi[0].id);

const payloadSuivi = reactive({
  annee: new Date().getFullYear(),
  trimestre: getCurrentQuarter(),
  valeurCible: "",
  valeurRealise: "",
  commentaire: "",
  dateSuivie: "",
  indicateurId: "",
  sources_de_donnee: "",
});

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

const submitSuivi = async () => {
  payloadSuivi.trimestre = Number(payloadSuivi.trimestre);
  payloadSuivi.annee = Number(payloadSuivi.annee);
  if (optionsSuivi[0].id == suiviOption.value) {
    delete payloadSuivi.trimestre;
  } else {
    delete payloadSuivi.dateSuivie;
  }

  if (isAgregerCurrentIndicateur.value) {
    payloadSuivi.valeurCible = valeurCible.value;
    payloadSuivi.valeurRealise = valeurRealise.value;
  }

 

  isLoading.value = true;
  errors.value = {}; // Reset errors

  const action = IndicateursService.createSuivi(payloadSuivi);
  try {
    await action;
    toast.success(`Suivi Ajouté avec succès.`);
    isLoading.value = false;
    await resetFormSuivi();
    emit("refreshData", data);
  } catch (e) {
    isLoading.value = false;
    

    // Gestion des erreurs de validation (422)
    if (e.response && e.response.status === 422) {
      const errorData = e.response.data;

      // Structure: { data: { errors: { field: ["message"] } } } ou { errors: { field: ["message"] } }
      if (errorData.data && errorData.data.errors) {
        errors.value = errorData.data.errors;
      } else if (errorData.errors) {
        errors.value = errorData.errors;
      }

      toast.error(errorData.data?.message || errorData.message || "Erreur de validation du formulaire");
    } else {
      toast.error(getAllErrorMessages(e));
    }
  }
};

const closeModal = () => (showModalSuivi.value = false);

const handleSuivi = (data) => {
  

  // Récupérer les valeurs cibles pour l'année sélectionnée
  valeurCible.value = data.indicateur.valeursCible.filter((valeurCible) => valeurCible.annee === Number(payloadSuivi.annee)).map((v) => v.valeurCible);

  isAgregerCurrentIndicateur.value = data.indicateur.agreger;

  // Si l'indicateur n'est pas agrégé, pré-remplir la valeur cible simple
  if (isAgregerCurrentIndicateur.value == false) {
    // Vérifier que valeurCible.value[0] existe et n'est pas null/undefined
    if (valeurCible.value && valeurCible.value.length > 0 && valeurCible.value[0]) {
      Object.keys(valeurCible.value[0]).forEach((key) => {
        payloadSuivi.valeurCible = valeurCible.value[0][key];
      });
    }
  }

  payloadSuivi.annee = `${new Date().getFullYear()}`;

  payloadSuivi.indicateurId = data.indicateur.id;
  valueKeysIndicateurSuivi.value = data.indicateur.value_keys;
  resetValues();
  showModalSuivi.value = true;
};

const resetValues = () => {
  valeurCible.value = valueKeysIndicateurSuivi.value.map((item) => ({
    keyId: item.id,
    value: valeurCible.value[0][item.key] ?? "",
  }));
  valeurRealise.value = valueKeysIndicateurSuivi.value.map((item) => ({
    keyId: item.id,
    value: valeurRealise.value[item.key] ?? "",
  }));
};

const resetFormSuivi = async () => {
  if (isAgregerCurrentIndicateur.value) {
    resetValues();
  }
  Object.keys(payloadSuivi).forEach((key) => {
    payloadSuivi[key] = "";
  });

  payloadSuivi["annee"] = new Date().getFullYear();
  payloadSuivi["trimestre"] = getCurrentQuarter();
  payloadSuivi["valeurCible"] = "";
  payloadSuivi["valeurRealise"] = "";
  payloadSuivi["commentaire"] = "";
  payloadSuivi["dateSuivie"] = "";
  payloadSuivi["indicateurId"] = "";
  payloadSuivi["sources_de_donnee"] = "";

  errors.value = {}; // Reset errors
  showModalSuivi.value = false;
};

const updateValueCible = (keyId, newValue) => {
  const entry = valeurCible.value.find((item) => item.keyId === keyId);
  if (entry) {
    entry.value = newValue;
  }
};

const updateValueRealiser = (keyId, newValue) => {
  const entry = valeurRealise.value.find((item) => item.keyId === keyId);
  if (entry) {
    entry.value = newValue;
  }
};

const goToDetailSuivi = (id) => {
  
  router.push({
    name: "Détail du suivi",
    params: { id },
  });
};

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
  background-color: #ddd !important;
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
  background-color: rgb(15 52 96);
  z-index: 10; /* Évite que les lignes passent par-dessus */
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0); /* Optionnel : effet d'ombre pour séparation visuelle */
}

/* Style des colonnes collantes */
.sticky-column {
  position: sticky;
  left: 0;
  background-color: rgb(15 52 96);
  z-index: 15 !important;
  border-right: 1px solid #ccc;
}

.sticky-column-second {
  position: sticky;
  left: 500px; /* Ajuster selon vos besoins */
  background-color: rgb(15 52 96);
  z-index: 15 !important;
  border-right: 1px solid #ccc;
}

.sticky-column-third {
  position: sticky;
  left: 580px; /* Ajuster selon vos besoins */
  background-color: rgb(15 52 96);
  z-index: 5;
  border-right: 1px solid #ccc;
}

/* Ajout de bordures pour les lignes */
.editor_listing_table td,
.editor_listing_table th {
  border: 1px solid #ddd; /* Bordures légères */
}
</style>
