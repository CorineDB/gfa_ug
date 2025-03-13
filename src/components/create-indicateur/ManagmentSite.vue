<script setup>
import { computed, onMounted, reactive, onBeforeMount, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import SiteService from "@/services/modules/site.service";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderData from "./LoaderData.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { getFieldErrors } from "../../utils/helpers";
import contries from "@/pays.json";
import decoupage from "@/decoupage_territorial_benin.json";

const props = defineProps({});
const emit = defineEmits(["update-datas"]);
// Reactive data structure
const payload = reactive({
  nom: "",
  longitude: "",
  latitude: "",
  quartier: "",
  arrondissement: "",
  pays: "",
  departement: "",
  commune: "",
});

const departements = ref([]);
const pays = ref([]);
const indexBenin = ref(1);
const selectedDepartementData = ref("");
const isBenin = ref(false);

// Propriétés calculées pour filtrer les options
const filteredCommunes = computed(() => {
  if (!payload.departement > 0) return [];
  selectedDepartementData.value = departements.value.find((dep) => dep.lib_dep == payload.departement);
  return selectedDepartementData.value ? selectedDepartementData.value.communes : [];
});

const filteredArrondissements = computed(() => {
  if (!payload.commune) return [];
  const communeData = selectedDepartementData.value.communes.find((com) => com.lib_com === payload.commune);
  return communeData ? communeData.arrondissements : [];
});

const filteredQuartiers = computed(() => {
  if (!payload.arrondissement) return [];
  const arrondissementData = filteredArrondissements.value.find((arrond) => arrond.lib_arrond === payload.arrondissement);
  return arrondissementData ? arrondissementData.quartiers : [];
});

// Méthodes pour mettre à jour et réinitialiser les sélections
function updateCommunes() {
  payload.commune = "";
  payload.arrondissement = "";
  payload.quartier = "";
}

function updateArrondissements() {
  payload.arrondissement = "";
  payload.quartier = "";
}

function updateQuartiers() {
  payload.quartier = "";
}

const changeCountry = () => {
  if (payload.pays === "Bénin") {
    indexBenin.value = -1;
    isBenin.value = true;
    updateCommunes();
  } else {
    indexBenin.value++;
    if (indexBenin.value == 0) {
      payload.quartier = "";
      payload.arrondissement = "";
      payload.commune = "";
      payload.departement = "";
    }
    isBenin.value = false;
  }
};

const showCommune = computed(() => !payload.departement);
const showArrondissement = computed(() => !payload.commune);
const showQuatier = computed(() => !payload.arrondissement);

onBeforeMount(() => {
  departements.value = decoupage;
  pays.value = Object.values(contries);
});

function resetPayload() {
  Object.keys(payload).forEach((key) => {
    payload[key] = "";
  });
}

// UI related functions

const idSelect = ref("");
const nameSelect = ref("");
const search = ref("");
const showModalCreate = defineModel("showModal");
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const datas = ref([]);
const errors = ref({});

// Fetch data
const getDatas = async () => {
  try {
    isLoadingData.value = true;
    const { data } = await SiteService.get();
    datas.value = data.data;
    emit("update-datas", datas.value);
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingData.value = false;
  }
};

// Submit data (create or update)
const submitData = async () => {
  isLoading.value = true;
  const action = isCreate.value ? SiteService.create(payload) : SiteService.update(idSelect.value, payload);
  try {
    await action;
    toast.success(`Zone d'intervention ${isCreate.value ? "crée" : "modifié"} avec succès.`);
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
    await SiteService.destroy(idSelect.value);
    toast.success("Zone d'intervention supprimée avec succès.");
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
  payload.pays = data.pays;
  payload.departement = data.departement;
  payload.arrondissement = data.arrondissement;
  payload.quartier = data.quartier;
  payload.longitude = data.longitude;
  payload.latitude = data.latitude;
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
  Object.keys(payload).forEach((key) => {
    payload[key] = "";
  });
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

// Fetch data on component mount
onMounted(getDatas);
</script>

<template>
  <div>
    <!-- Button to open modal -->
    <div class="flex items-center justify-between gap-2 mb-4">
      <input type="text" class="form-control form-control-sm max-w-[300px]" placeholder="Rechercher..." v-model="search" />
      <button class="text-sm btn btn-primary" @click="openCreateModal"><PlusIcon class="mr-1 size-4" />Ajouter</button>
    </div>

    <!-- Data List -->
    <ul v-if="!isLoadingData" class="overflow-y-auto max-h-[40vh]">
      <li v-for="data in filterData" :key="data.id" class="flex items-center justify-between gap-2 px-1 py-1.5 text-base hover:bg-blue-100 list-data">
        <div class="p-2 form-check">
          <span class="form-check-label">{{ data.nom }}</span>
        </div>
        <div class="flex items-center gap-1 space-x-1 transition-all opacity-0 container-buttons">
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
    <Modal size="modal-lg" backdrop="static" :show="showModalCreate" @hidden="closeModal">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">{{ modeText }} une zone d'intervention</h2>
      </ModalHeader>
      <form @submit.prevent="submitData">
        <ModalBody>
          <div class="grid grid-cols-1 gap-4">
            <InputForm label="Nom" v-model="payload.nom" :control="getFieldErrors(errors.nom)" class="col-span-12" />
            <div class="col-span-12">
              <label class="form-label">Pays<span class="text-danger">*</span> </label>
              <TomSelect v-model="payload.pays" @change="changeCountry" :options="{ placeholder: 'Selectionez  un pays' }" class="w-full">
                <option value=""></option>
                <option v-for="(country, index) in pays" :key="index" :value="country">{{ country }}</option>
              </TomSelect>
              <div v-if="errors.pays" class="mt-2 text-danger">{{ getFieldErrors(errors.pays) }}</div>
            </div>
            <div v-if="isBenin" class="col-span-12">
              <div class="w-full mb-4">
                <label class="form-label">Départements<span class="text-danger">*</span> </label>
                <TomSelect v-model="payload.departement" @change="updateCommunes" :options="{ placeholder: 'Selectionez un département' }" class="w-full">
                  <option value=""></option>
                  <option v-for="(dep, index) in departements" :key="index" :value="dep.lib_dep">{{ dep.lib_dep }}</option>
                </TomSelect>
                <div v-if="errors.departement" class="mt-2 text-danger">{{ getFieldErrors(errors.departement) }}</div>
              </div>
              <div class="mb-4" :class="[!showCommune ? '' : 'opacity-50 cursor-not-allowed pointer-events-none']">
                <label class="form-label">Communes<span class="text-danger">*</span> </label>
                <TomSelect v-model="payload.commune" :options="{ placeholder: 'Sélectionner la commune' }" class="w-full" @change="updateArrondissements">
                  <option v-for="commune in filteredCommunes" :key="commune.lib_com" :value="commune.lib_com">
                    {{ commune.lib_com }}
                  </option>
                </TomSelect>
                <div v-if="errors.commune" class="mt-2 text-danger">{{ getFieldErrors(errors.commune) }}</div>
              </div>
            </div>

            <div v-if="isBenin" class="col-span-12">
              <div class="w-full mb-4" :class="[!showArrondissement ? '' : 'opacity-50 cursor-not-allowed pointer-events-none']">
                <label class="form-label">Arrondissemnt<span class="text-danger">*</span> </label>
                <TomSelect v-model="payload.arrondissement" @change="updateQuartiers" :options="{ placeholder: 'Selectionez  arrondissement' }" class="w-full">
                  <option v-for="(arrond, index) in filteredArrondissements" :key="index" :value="arrond.lib_arrond">{{ arrond.lib_arrond }}</option>
                </TomSelect>
                <div v-if="errors.arrondissement" class="mt-2 text-danger">{{ getFieldErrors(errors.arrondissement) }}</div>
              </div>
              <div class="w-full mb-4" :class="[!showQuatier ? '' : 'opacity-50 cursor-not-allowed pointer-events-none']">
                <label class="form-label">Quartier<span class="text-danger">*</span> </label>
                <TomSelect v-model="payload.quartier" :options="{ placeholder: 'Sélectionner le quatier' }" class="w-full">
                  <option v-for="quart in filteredQuartiers" :key="quart.lib_quart" :value="quart.lib_quart">
                    {{ quart.lib_quart }}
                  </option>
                </TomSelect>
                <div v-if="errors.quartier" class="mt-2 text-danger">{{ getFieldErrors(errors.quartier) }}</div>
              </div>
            </div>
            <div v-if="!isBenin" class="col-span-12">
              <InputForm :required="false" :optionel="false" label="Département" v-model="payload.departement" :control="getFieldErrors(errors.departement)" class="mb-4" />
              <InputForm :required="false" :optionel="false" label="Commune" v-model="payload.commune" :control="getFieldErrors(errors.commune)" class="mb-4" />
              <InputForm label="Quartier" v-model="payload.quartier" :control="getFieldErrors(errors.quartier)" />
            </div>
            <!-- <InputForm label="Pays" v-model="payload.pays" :control="getFieldErrors(errors.pays)" />
            <InputForm label="Departement" v-model="payload.departement" :control="getFieldErrors(errors.departement)" />
            <InputForm label="Commune" v-model="payload.commune" :control="getFieldErrors(errors.commune)" />
            <InputForm label="Arrondissement" v-model="payload.arrondissement" :control="getFieldErrors(errors.arrondissement)" />
            <InputForm label="Quartier" v-model="payload.quartier" :control="getFieldErrors(errors.quartier)" /> -->
            <div class="flex items-center justify-between gap-3 col-span-12">
              <InputForm label="Longitude" :control="getFieldErrors(errors.longitude)" class="flex-1" v-model="payload.longitude" type="number" />
              <InputForm label="Latitude" :control="getFieldErrors(errors.latitude)" class="flex-1" v-model="payload.latitude" type="number" />
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
          <div class="mt-2 text-slate-500">Supprimer la zone?</div>
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
