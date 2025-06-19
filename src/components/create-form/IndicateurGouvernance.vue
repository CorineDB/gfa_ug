<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import IndicateurDeGouvernanceFactuel from "@/services/modules/enquetes_de_gouvernance/indicateurGouvernance.service";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderData from "./LoaderData.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { getFieldErrors } from "../../utils/helpers";

const props = defineProps({
  isAvailable: Boolean,
  toReset: Boolean,
  monTableau: {
    type: Array,
    default: () => [],
  },
});

// Extraction des ID à exclure
const idsExclus = computed(() =>
  props.monTableau.map(e => e.indicateur?.id)
)

// Liste filtrée
const datasFiltrees = computed(() =>
  filterData.value.filter(item => !idsExclus.value.includes(item.id))
)

 

const emit = defineEmits(["selected"]);

// Reactive data structure
const payload = reactive({ nom: "", description: "", type: "factuel" });
const idSelect = ref("");
// CHANGEMENT: Remplacer idChecked par selectedIds (tableau)
const selectedIds = ref([]);
const nameSelect = ref("");
const search = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const isEditOrDelete = ref(false);
const datas = ref([]);
const errors = ref({});

// CHANGEMENT: Nouvelle fonction pour gérer les sélections multiples
function choiceOption(data) {
  const index = selectedIds.value.indexOf(data.id);
  if (index > -1) {
    // Si déjà sélectionné, le retirer
    selectedIds.value.splice(index, 1);
  } else {
    // Sinon l'ajouter
    selectedIds.value.push(data.id);
  }
  
  // Émettre les données sélectionnées
  let selectedData = datas.value.filter(item => selectedIds.value.includes(item.id));
  selectedData = selectedData[selectedData.length - 1] || {}; // Prendre le dernier élément sélectionné ou un objet vide si aucun
  emit("selected", selectedData);
}

// CHANGEMENT: Fonction pour vérifier si un item est sélectionné
function isSelected(id) {
  return selectedIds.value.includes(id);
}

// Fetch data
const getDatas = async () => {
  try {
    isLoadingData.value = true;
    const { data } = await IndicateurDeGouvernanceFactuel.get();
    datas.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingData.value = false;
  }
};

// Submit data (create or update)
const submitData = async () => {
  isLoading.value = true;
  const action = isCreate.value ? IndicateurDeGouvernanceFactuel.create(payload) : IndicateurDeGouvernanceFactuel.update(idSelect.value, payload);
  try {
    await action;
    toast.success(`Indicateur ${isCreate.value ? "crée" : "modifié"} avec succès.`);
    getDatas();
    resetForm();
  } catch (e) {
    if (e.response && e.response.status === 422) {
      errors.value = e.response.data.errors;
    } else {
      toast.error(getAllErrorMessages(e));
    }
  } finally {
    isLoading.value = false;
  }
};

// Delete data
const deleteData = async () => {
  try {
    isLoading.value = true;
    await IndicateurDeGouvernanceFactuel.destroy(idSelect.value);
    toast.success("Indicateur supprimé avec succès.");
    getDatas();
  } catch (e) {
    console.error(e);
    toast.error(getAllErrorMessages(e));
  } finally {
    isLoading.value = false;
    deleteModalPreview.value = false;
  }
};

// Handle edit action
const handleEdit = (data) => {
  isCreate.value = false;
  idSelect.value = data.id;
  payload.nom = data.nom;
  payload.description = data.description;
  showModalCreate.value = true;
};

// Handle delete action
const handleDelete = (data) => {
  idSelect.value = data.id;
  nameSelect.value = data.nom;
  deleteModalPreview.value = true;
};

// UI related functions
const resetForm = () => {
  payload.nom = "";
  payload.description = "";
  showModalCreate.value = false;
  errors.value = {};
};

const openCreateModal = () => {
  resetForm();
  isCreate.value = true;
  showModalCreate.value = true;
};

const cancelDelete = () => {
  idSelect.value = "";
  deleteModalPreview.value = false;
};

const closeModal = () => (showModalCreate.value = false);
const closeDeleteModal = () => (deleteModalPreview.value = false);

const modeText = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));
const filterData = computed(() => datas.value.filter((data) => data.nom.toLowerCase().includes(search.value.toLowerCase())));

// CHANGEMENT: Watch pour reset les sélections
watch(
  () => props.toReset,
  () => {
    selectedIds.value = [];
  }
);

// Fetch data on component mount
onMounted(getDatas);
</script>

<template>
  <div :class="[isAvailable ? '' : 'opacity-50 pointer-events-none']">
    <!-- Button to open modal -->
    <div class="flex items-center justify-between gap-2 mb-4">
      <input type="text" class="form-control form-control-sm max-w-[300px]" placeholder="Rechercher..." v-model="search" />
      <button class="text-sm btn btn-primary" @click="getDatas"><RotateCcwIcon class="mr-1 size-4" /></button>
      <button class="text-sm btn btn-primary" @click="openCreateModal"><PlusIcon class="mr-1 size-4" />Ajouter</button>
    </div>

    <!-- Data List avec sélection multiple -->
    <ul v-if="!isLoadingData" class="overflow-y-auto max-h-[40vh]">
      <li v-for="data in datasFiltrees" :key="data.id" class="flex items-center justify-between gap-2 px-1 py-1.5 text-base hover:bg-blue-100 list-data">
        <div class="p-2 form-check">
          <!-- CHANGEMENT: Utiliser :checked au lieu de v-model -->
          <input
            :id="data.id"
            @change="choiceOption(data)"
            class="form-check-input"
            type="checkbox"
            :checked="isSelected(data.id)"
          />
          <label class="form-check-label" :for="data.id">{{ data.nom }}</label>
        </div>
        <!-- CHANGEMENT: Modifier la condition pour utiliser isSelected -->
        <div v-if="!isSelected(data.id)" class="flex items-center gap-1 space-x-1 transition-all opacity-0 container-buttons">
          <button class="p-1.5 text-primary" @click="handleEdit(data)">
            <Edit3Icon class="size-5" />
          </button>
          <button class="p-1.5 text-danger" @click="handleDelete(data)">
            <TrashIcon class="size-5" />
          </button>
        </div>
      </li>
    </ul>

    <LoaderData v-else />

    <!-- Modal for creating/updating -->
    <Modal backdrop="static" :show="showModalCreate" @hidden="closeModal">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">{{ modeText }} un indicateur de gouvernance</h2>
      </ModalHeader>
      <form @submit.prevent="submitData">
        <ModalBody>
          <div class="grid grid-cols-1 gap-4">
            <InputForm label="Nom" v-model="payload.nom" :control="getFieldErrors(errors.nom)" />
            <div class="flex-1">
              <label class="form-label" for="description">Description</label>
              <div class="">
                <textarea name="description" class="form-control" id="description" v-model="payload.description" cols="30" rows="3"></textarea>
                <div v-if="errors.description" class="mt-2 text-danger">{{ getFieldErrors(errors.description) }}</div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div class="flex gap-2">
            <button type="button" @click="resetForm" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
            <VButton :loading="isLoading" :label="modeText" />
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
          <div class="mt-2 text-slate-500">Supprimer l'indicateur de gouvernance?</div>
        </div>
        <div class="flex justify-center gap-3 py-4">
          <button type="button" @click="cancelDelete" class="btn btn-outline-secondary">Annuler</button>
          <DeleteButton :loading="isLoading" @click="deleteData" />
        </div>
      </ModalBody>
    </Modal>
  </div>
</template>

<style scoped>
.list-data:hover .container-buttons {
  opacity: 1;
}
</style>