<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
//import OptionReponse from "@/services/modules/optionReponse.service";
import OptionReponse from "@/services/modules/enquetes_de_gouvernance/optionReponse.service";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderData from "./LoaderData.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
//import FormulaireFactuel from "@/services/modules/formFactuel.service";
import FormulaireFactuel from "@/services/modules/enquetes_de_gouvernance/formFactuel.service";
import { getFieldErrors } from "../../utils/helpers";

const props = defineProps({
  toReset: Boolean,
  isUpdate: {
    type: Boolean,
    default: false,
  },
  idForm: {
    type: String,
    default: "",
  },
});

// Reactive data structure
const payload = reactive({ libelle: "", type: "factuel", description: "" });
const idSelect = ref("");
const idChecked = ref([]);
const nameSelect = ref("");
const search = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const isEditOrDelete = ref(false);
const globalOptionResponses = defineModel("globalOptionResponses");
const previewOptionResponsesModel = defineModel("previewOptionResponses");
const datas = ref([]);
const updateOptionsResponse = ref([]);
const previewData = localStorage.getItem("previewOptionResponsesModel");
const globalData = localStorage.getItem("globalOptionResponses");
const errors = ref({});

// Fetch data
const getDatas = async () => {
  try {
    isLoadingData.value = true;
    const { data } = await OptionReponse.factuel();
    datas.value = data.data;
    console.log(datas.value);
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingData.value = false;
  }
};

// Submit data (create or update)
const submitData = async () => {
  isLoading.value = true;
  const action = isCreate.value ? OptionReponse.create(payload) : OptionReponse.update(idSelect.value, payload);
  try {
    await action;
    toast.success(`Option de réponse ${isCreate.value ? "créée" : "modifiée"} avec succès.`);
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
    await OptionReponse.destroy(idSelect.value);
    toast.success("Option de réponse supprimée avec succès.");
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
  payload.libelle = data.libelle;
  payload.type = "factuel";
  payload.description = data.description;
  showModalCreate.value = true;
};

// Handle delete action
const handleDelete = (data) => {
  idSelect.value = data.id;
  nameSelect.value = data.libelle;
  deleteModalPreview.value = true;
};

// UI related functions
const resetForm = () => {
  payload.libelle = "";
  payload.type = "factuel";
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
function getLibelleById(id) {
  const option = datas.value.find((data) => data.id === id);
  return option ? option.libelle : "";
}
function updateTemporyOption(id, point) {
  const index = globalOptionResponses.value.options_de_reponse.findIndex((option) => option.id === id);
  if (index !== -1) {
    globalOptionResponses.value.options_de_reponse[index].point = point;
  } else {
    globalOptionResponses.value.options_de_reponse.push({ id, point });
  }
  if (!props.isUpdate) localStorage.setItem("globalOptionResponses", JSON.stringify(globalOptionResponses.value));
}
function removeTemporyOption(id) {
  globalOptionResponses.value.options_de_reponse = globalOptionResponses.value.options_de_reponse.filter((option) => option.id !== id);
  if (!props.isUpdate) localStorage.setItem("globalOptionResponses", JSON.stringify(globalOptionResponses.value));
}
const getOneForm = async () => {
  try {
    const { data } = await FormulaireFactuel.getOne(props.idForm);
    updateOptionsResponse.value = data.data.options_de_reponse;
  } catch (e) {
    toast.error("Erreur récupération du  formulaire.");
    console.log(e);
  } finally {
  }
};
const modeText = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));
const filterData = computed(() => datas.value.filter((data) => data.libelle.toLowerCase().includes(search.value.toLowerCase())));

const refresh = () => {
  previewOptionResponsesModel.value.options_de_reponse = globalOptionResponses.value.options_de_reponse.map((option) => ({
    id: option.id,
    point: option.point,
    libelle: getLibelleById(option.id),
  }));
};
watch(
  () => globalOptionResponses.value.options_de_reponse,
  (newOptions) => {
    previewOptionResponsesModel.value.options_de_reponse = newOptions.map((option) => ({
      id: option.id,
      point: option.point,
      libelle: getLibelleById(option.id),
    }));
    if (!props.isUpdate) localStorage.setItem("previewOptionResponsesModel", JSON.stringify(previewOptionResponsesModel.value));
  },
  { deep: true }
);

watch(idChecked, (newChecked, oldChecked) => {
  oldChecked.forEach((id) => {
    if (!newChecked.includes(id)) {
      removeTemporyOption(id);
    }
  });
});

watch(
  () => props.toReset,
  () => {
    idChecked.value = [];
  }
);

function fixerOptionsDeReponse(){
  idChecked.value =
  datas.value.map((item) => {
    if(item.libelle.toLowerCase() == 'oui'){
      updateTemporyOption(item.id, 1);
    }
    else if(item.libelle.toLowerCase() == 'non'){
      updateTemporyOption(item.id, 0);

    }
    else if(item.libelle.toLowerCase() == 'partiellement'){
      updateTemporyOption(item.id, 0.5);
    }
    return item.id;
  });
}

// Fetch data on component mount
onMounted(async () => {
  await getDatas();
  fixerOptionsDeReponse();
  if (previewData && globalData && !props.isUpdate) {
    setTimeout(() => {
      globalOptionResponses.value = JSON.parse(globalData);
      previewOptionResponsesModel.value = JSON.parse(previewData);
      setTimeout(() => {
        idChecked.value = globalOptionResponses.value.options_de_reponse.map((option) => option.id);
      }, 100);
    }, 100);
  }

  if (props.isUpdate) {
    await getOneForm();
    setTimeout(() => {
      if (updateOptionsResponse.value.length > 0) {
        globalOptionResponses.value = {
          options_de_reponse: updateOptionsResponse.value.map((option) => ({
            id: option.id,
            point: option.point,
          })),
        };

        previewOptionResponsesModel.value = {
          options_de_reponse: updateOptionsResponse.value.map((option) => ({
            id: option.id,
            point: option.point,
            libelle: option.libelle,
          })),
        };

        idChecked.value = updateOptionsResponse.value.map((option) => option.id);
      }
    }, 100);
  }
});
</script>

<template>
  <div>
    <!-- Button to open modal -->
    <div class="flex items-center justify-between gap-2 mb-4">
      <!-- <div class="form-check form-switch">
        <input id="response" class="form-check-input" type="checkbox" v-model="isEditOrDelete" />
        <label class="form-check-label" for="response">Modifier/Supprimer</label>
      </div> -->
      <input type="text" class="form-control form-control-sm max-w-[300px]" placeholder="Rechercher..." v-model="search" />
      <button class="text-sm btn btn-primary" @click="getDatas"><RotateCcwIcon class="mr-1 size-4" /></button>
      <button class="text-sm btn btn-primary" @click="openCreateModal"><PlusIcon class="mr-1 size-4" />Ajouter</button>
    </div>

    <!-- Data List -->
    <ul v-if="!isLoadingData" class="overflow-y-auto listes max-h-[40vh]">
      <li v-for="(data, index) in filterData" :key="data.id">
        <div class="flex items-center justify-between gap-2 px-1 py-1.5 text-base hover:bg-blue-100 list-data">
          <div class="flex items-center gap-1">
            <div class="p-2 form-check">
              <input :id="data.id" class="form-check-input" type="checkbox" :value="data.id" v-model="idChecked" />
              <label class="form-check-label" :for="data.id">{{ data.libelle }}</label>
            </div>
            <div v-if="idChecked.includes(data.id)" class="flex items-center gap-1 transition-all">
              <input type="number" min="0.05" max="1" step="0.05" name="point" :id="`${data.id}${index}`" :value="globalOptionResponses.options_de_reponse.find((option) => option.id === data.id)?.point || ''" @input="updateTemporyOption(data.id, $event.target.value)" class="w-[75px] form-control" />
            </div>
          </div>
          <div v-if="!idChecked.includes(data.id)" class="flex items-center gap-1 space-x-1 transition-all opacity-0 container-buttons">
            <button class="p-1.5 text-primary" @click="handleEdit(data)">
              <Edit3Icon class="size-5" />
            </button>
            <button class="p-1.5 text-danger" @click="handleDelete(data)">
              <TrashIcon class="size-5" />
            </button>
          </div>
        </div>
      </li>
    </ul>
    <LoaderData v-else />

    <!-- Modal for creating/updating -->
    <Modal backdrop="static" :show="showModalCreate" @hidden="closeModal">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">{{ modeText }} une option de réponse</h2>
      </ModalHeader>
      <form @submit.prevent="submitData">
        <ModalBody>
          <div class="grid grid-cols-1 gap-4">
            <InputForm label="Libellé" v-model="payload.libelle" :control="getFieldErrors(errors.libelle)" />

            <!-- <pre>{{ payload.description }}</pre> -->

            <!-- <div class="flex-1">
              <label class="form-label" for="description">Description</label>
              <div class="">
                <textarea name="description" class="form-control" id="description" v-model="payload.description" cols="30" rows="3"></textarea>
                <div v-if="errors.description" class="mt-2 text-danger">{{ getFieldErrors(errors.description) }}</div>
              </div>
            </div> -->
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
          <div class="mt-2 text-slate-500">Supprimer l'option de réponse?</div>
        </div>
        <div class="flex justify-center gap-3 py-4">
          <button type="button" @click="cancelDelete" class="btn btn-outline-secondary">Annuler</button>
          <DeleteButton :loading="isLoading" @click="deleteData" />
        </div>
      </ModalBody>
    </Modal>
  </div>
</template>

<style>
.list-data:hover .container-buttons {
  opacity: 1;
}

.listes {
  scrollbar-color: #a8a8a8 transparent;
  scrollbar-arrow-color: transparent;
}
</style>
