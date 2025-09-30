<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
//import QuestionOperationnelle from "@/services/modules/questionOperationnelle.service";
import QuestionOperationnelle from "@/services/modules/enquetes_de_gouvernance/questionOperationnelle.service";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderData from "./LoaderData.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { getFieldErrors } from "../../utils/helpers";

const props = defineProps({
  isAvailable: Boolean,
  toReset: Boolean,
  excludedQuestions: {
    type: Array,
    default: () => []
  },
  currentPrincipe: {
    type: Object,
    default: () => ({ id: null })
  }
});

const emit = defineEmits(["selected"]);

// Reactive data structure
const payload = reactive({ nom: "", description: "", type: "perception" });
const idSelect = ref("");
const idsChecked = ref([]); // Changé de idChecked à idsChecked pour les choix multiples
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

// Fonction modifiée pour gérer les choix multiples
function choiceOption(data, isChecked) {
  if (isChecked) {
    // Vérifier si data.id n'est pas déjà dans idsChecked.value
    if (!idsChecked.value.includes(data.id)) {
      // Ajouter data.id à idsChecked.value
      idsChecked.value.push(data.id);

      // Filtrer datas.value pour récupérer les éléments sélectionnés
      let selectedItems = datas.value.filter((item) => idsChecked.value.includes(item.id));
      // Prendre le dernier élément ajouté
      selectedItems = selectedItems[selectedItems.length - 1] || {};
      console.log(selectedItems);
      // Émettre l'événement "selected" avec cet élément
      emit("selected", selectedItems);
    }
  } else {
    // Retirer data.id de idsChecked.value
    idsChecked.value = idsChecked.value.filter((id) => id !== data.id);
    // NE PAS émettre d'événement
  }
}

// Fonction pour vérifier si un élément est sélectionné
function isItemChecked(id) {
  return idsChecked.value.includes(id);
}

// Fetch data
const getDatas = async () => {
  try {
    isLoadingData.value = true;
    const { data } = await QuestionOperationnelle.get();
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
  const action = isCreate.value ? QuestionOperationnelle.create(payload) : QuestionOperationnelle.update(idSelect.value, payload);
  try {
    await action;
    toast.success(`Question ${isCreate.value ? "créee" : "modifiée"} avec succès.`);
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
    await QuestionOperationnelle.destroy(idSelect.value);
    toast.success("Question supprimée avec succès.");
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

// Computed pour filtrer les questions disponibles
const filterData = computed(() => {
  // Filtrer par recherche
  let filteredBySearch = datas.value.filter((data) => 
    data.nom.toLowerCase().includes(search.value.toLowerCase())
  );
  
  // Si un principe est sélectionné, exclure les questions déjà utilisées par ce principe
  if (props.currentPrincipe?.id) {
    // Récupérer les IDs des questions déjà utilisées par ce principe
    const questionsUsedByCurrentPrincipe = props.excludedQuestions
      .filter(exclusion => exclusion.principeId === props.currentPrincipe.id)
      .map(exclusion => exclusion.questionId);
    
    // Exclure ces questions de la liste
    filteredBySearch = filteredBySearch.filter(question => 
      !questionsUsedByCurrentPrincipe.includes(question.id)
    );
  }
  
  return filteredBySearch;
});

// Computed pour afficher un message informatif
const availableQuestionsCount = computed(() => filterData.value.length);
const totalQuestionsCount = computed(() => datas.value.length);
const excludedQuestionsCount = computed(() => totalQuestionsCount.value - availableQuestionsCount.value);

// Fonction pour sélectionner/désélectionner tous les éléments
const selectAll = () => {
  if (idsChecked.value.length === filterData.value.length) {
    // Désélectionner tout
    idsChecked.value = [];
  } else {
    // Sélectionner tout
    idsChecked.value = filterData.value.map((item) => item.id);
  }
  const selectedItems = datas.value.filter((item) => idsChecked.value.includes(item.id));
  emit("selected", selectedItems);
};

// Computed pour le statut "tout sélectionné"
const isAllSelected = computed(() => {
  return filterData.value.length > 0 && idsChecked.value.length === filterData.value.length;
});

const isPartiallySelected = computed(() => {
  return idsChecked.value.length > 0 && idsChecked.value.length < filterData.value.length;
});

watch(
  () => props.toReset,
  () => {
    idsChecked.value = []; // Réinitialiser le tableau
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
      <div class="flex gap-2">
        <button class="text-sm btn btn-outline-primary" @click="selectAll" :class="{ 'btn-warning': isPartiallySelected, 'btn-success': isAllSelected }">
          {{ isAllSelected ? "Désélectionner tout" : "Sélectionner tout" }}
        </button>
        <button class="text-sm btn btn-primary" @click="getDatas">
          <RotateCcwIcon class="mr-1 size-4" />
        </button>
        <button class="text-sm btn btn-primary" @click="openCreateModal"><PlusIcon class="mr-1 size-4" />Ajouter</button>
      </div>
    </div>

    <!-- Affichage du nombre d'éléments sélectionnés -->
    <div v-if="idsChecked.length > 0" class="mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
      <span class="text-sm text-blue-700"> {{ idsChecked.length }} élément{{ idsChecked.length > 1 ? "s" : "" }} sélectionné{{ idsChecked.length > 1 ? "s" : "" }} </span>
    </div>

    <!-- Message informatif sur le filtrage -->
    <div v-if="currentPrincipe?.id && excludedQuestionsCount > 0" class="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
      <div class="flex items-center">
        <svg class="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <span class="text-sm text-yellow-700">
          {{ availableQuestionsCount }} questions disponibles sur {{ totalQuestionsCount }} 
          ({{ excludedQuestionsCount }} déjà utilisée{{ excludedQuestionsCount > 1 ? "s" : "" }} par ce principe)
        </span>
      </div>
    </div>

    <!-- Data List -->
    <ul v-if="!isLoadingData" class="overflow-y-auto max-h-[40vh]">
      <li v-for="(data, index) in filterData" :key="data.id" class="flex items-center justify-between gap-2 px-1 py-1.5 text-base hover:bg-blue-100 list-data">
        <div class="p-2 form-check">
          <input :id="`${data.id}${index}`" @change="choiceOption(data, $event.target.checked)" class="form-check-input" type="checkbox" :checked="isItemChecked(data.id)" />
          <label class="form-check-label" :for="`${data.id}${index}`">{{ data.nom }}</label>
        </div>
        <div v-if="!isItemChecked(data.id)" class="flex items-center gap-1 space-x-1 transition-all opacity-0 container-buttons">
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
        <h2 class="mr-auto text-base font-medium">{{ modeText }} une question opérationnelle dklsds</h2>
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
          <div class="mt-2 text-slate-500">Supprimer la question?</div>
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
