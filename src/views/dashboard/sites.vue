<script setup>
import { computed, onMounted, onBeforeMount, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import SiteService from "@/services/modules/site.service";
import TypeGouvernance from "@/services/modules/typeGouvernance.service";
import Tabulator from "tabulator-tables";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import contries from "@/pays.json";
import decoupage from "@/decoupage_territorial_benin.json";

onBeforeMount(() => {
  pays.value = Object.values(contries);
  departements.value = decoupage;
});

const getinitForm = () => {
  return {
    nom: "",
    longitude: "",
    latitude: "",
    arrondissement: "",
    commune: "",
    departement: "",
    pays: "",
    quartier: "",
  };
};

const selectedDepartementData = ref("");
const departements = ref([]);
const errors = ref({});
const pays = ref([]);
const indexBenin = ref(1);
const isBenin = ref(false);

const payload = reactive({
  nom: "",
  longitude: "",
  latitude: "",
  arrondissement: "",
  commune: "",
  departement: "",
  pays: "",
  quartier: "",
});

const getFieldErrors = function (errors) {
  if (!errors || !Array.isArray(errors)) return "";
  return errors.join(", ");
};

const updateQuartiers = function () {
  payload.quartier = "";
};
const updateArrondissements = function () {
  payload.arrondissement = "";
  payload.quartier = "";
};

const updateCommunes = function () {
  payload.commune = "";
  payload.arrondissement = "";
  payload.quartier = "";
};
const changeCountry = function () {
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

const filteredCommunes = function () {
  if (!payload.departement) return [];
  selectedDepartementData.value = departements.value.find((dep) => dep.lib_dep === payload.departement);
  return selectedDepartementData.value ? selectedDepartementData.value.communes : [];
};
const filteredArrondissements = function () {
  if (!payload.commune || !selectedDepartementData.value) return [];
  const communeData = selectedDepartementData.value.communes.find((com) => com.lib_com === payload.commune);
  return communeData ? communeData.arrondissements : [];
};
const filteredQuartiers = function () {
  if (!payload.arrondissement) return [];
  const arrondissementData = this.filteredArrondissements.find((arrond) => arrond.lib_arrond === payload.arrondissement);
  return arrondissementData ? arrondissementData.quartiers : [];
};
const showCommune = function () {
  return !payload.departement;
};
const showArrondissement = function () {
  return !payload.commune;
};
const showQuatier = function () {
  return !payload.arrondissement;
};

// const payload = reactive({
//   nom: "",
//   longitude: "",
//   latitude: "",
// });
const tabulator = ref();
const idSelect = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const programmes = ref([]);
const datas = ref([]);

const createData = async () => {
  isLoading.value = true;
  await SiteService.create(payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Sites créer.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Vérifier les informations et ressayer.");
    });
};
const getDatas = async () => {
  isLoadingData.value = true;
  await SiteService.get()
    .then((result) => {
      datas.value = result.data.data;
      isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste des type des options.");
    });
  initTabulator();
};
const updateData = async () => {
  isLoading.value = true;
  await SiteService.update(idSelect.value, payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Sites modifiée.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Vérifier les informations et ressayer.");
    });
};
const submitData = () => (isCreate.value ? createData() : updateData());
const deleteData = async () => {
  isLoading.value = true;
  await SiteService.destroy(idSelect.value)
    .then(() => {
      deleteModalPreview.value = false;
      isLoading.value = false;
      toast.success("Sites supprimée");
      getDatas();
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Une erreur est survenue, ressayer");
    });
};
const getProgrammes = () => {
  TypeGouvernance.getAllProgrammes()
    .then((result) => {
      programmes.value = result.data.data;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Liste des Programmes.");
    });
};
const initTabulator = () => {
  tabulator.value = new Tabulator("#tabulator", {
    data: datas.value,
    placeholder: "Aucune donnée disponible.",
    layout: "fitColumns",
    columns: [
      {
        title: "Nom",
        field: "nom",
      },
      {
        title: "Longitude",
        field: "longitude",
      },
      {
        title: "Latitude",
        field: "latitude",
        hozAlign: "center",
        width: 200,
      },
      {
        title: "Actions",
        field: "actions",
        formatter: (cell) => {
          const container = document.createElement("div");
          container.className = "flex items-center justify-center gap-3";

          const createButton = (label, className, onClick) => {
            const button = document.createElement("button");
            button.className = className;
            button.innerText = label;
            button.addEventListener("click", onClick);
            return button;
          };

          const modifyButton = createButton("Modifier", "btn btn-primary", () => {
            handleEdit(cell.getData());
          });

          const deleteButton = createButton("Supprimer", "btn btn-danger", () => {
            handleDelete(cell.getData());
          });

          container.append(modifyButton, deleteButton);

          return container;
        },
      },
    ],
  });
};
const handleEdit = (params) => {
  isCreate.value = false;
  idSelect.value = params.id;
  payload.nom = params.nom;
  payload.longitude = params.longitude;
  payload.latitude = params.latitude;
  showModalCreate.value = true;
};
const handleDelete = (params) => {
  idSelect.value = params.id;
  deleteModalPreview.value = true;
};
const cancelSelect = () => {
  deleteModalPreview.value = false;
  idSelect.value = "";
};
const resetForm = () => {
  payload.libelle = "";
  payload.description = "";
  payload.note = "";
  // payload.programmeId = "";
  showModalCreate.value = false;
};
const openCreateModal = () => {
  // payload.programmeId = "";
  showModalCreate.value = isCreate.value = true;
};

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

onMounted(() => {
  getDatas();
  getProgrammes();
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Sites</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="openCreateModal"><PlusIcon class="w-4 h-4 mr-3" />Ajouter un Site</button>
      </div>
    </div>
  </div>

  <div class="p-5 mt-5 intro-y box">
    <div class="flex flex-col sm:flex-row sm:items-end xl:items-start">
      <div></div>
      <div class="flex mt-5 sm:mt-0">
        <button id="tabulator-print" class="w-1/2 mr-2 btn btn-outline-secondary sm:w-auto"><PrinterIcon class="w-4 h-4 mr-2" /> Print</button>
        <Dropdown class="w-1/2 sm:w-auto">
          <DropdownToggle class="w-full btn btn-outline-secondary sm:w-auto">
            <FileTextIcon class="w-4 h-4 mr-2" /> Export
            <ChevronDownIcon class="w-4 h-4 ml-auto sm:ml-2" />
          </DropdownToggle>
          <DropdownMenu class="w-40">
            <DropdownContent>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export CSV </DropdownItem>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export JSON </DropdownItem>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export XLSX </DropdownItem>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export HTML </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="overflow-x-auto scrollbar-hidden" v-if="!isLoadingData">
      <div id="tabulator" class="mt-5 table-report table-report--tabulator"></div>
    </div>
    <LoaderSnipper v-if="isLoadingData" />
  </div>

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} une Sites</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <!-- <InputForm label="Nom" v-model="payload.nom" />
          <InputForm label="Longitude" v-model="payload.longitude" />
          <InputForm label="Latitude" v-model.number="payload.latitude" /> -->

          <!-- <div class="">
            <label class="form-label">Programmes </label>
            <TomSelect v-model="payload.programmeId" :options="{ placeholder: 'Selectionez un programme' }" class="w-full">
              <option v-for="(programme, index) in programmes" :key="index" :value="programme.id">{{ programme.nom }}</option>
            </TomSelect>
          </div> -->
          <InputForm label="Nom" v-model="payload.nom" class="col-span-12" />
          <InputForm label="Longitude" type="number" step="any" v-model="payload.longitude" class="col-span-12" />
          <div v-if="errors.longitude" class="mt-2 text-danger">{{ getFieldErrors(errors.longitude) }}</div>

          <InputForm label="Latitude" type="number" step="any" v-model.number="payload.latitude" class="col-span-12" />
          <div v-if="errors.latitude" class="mt-2 text-danger">{{ getFieldErrors(errors.latitude) }}</div>

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
            <div>{{payload.departement}}</div>
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
            <InputForm :required="false" :optionel="false" label="Arrondissement" v-model="payload.arrondissement" :control="getFieldErrors(errors.arrondissement)" class="mb-4" />
            <InputForm :required="false" :optionel="false" label="Quartier" v-model="payload.quartier" :control="getFieldErrors(errors.quartier)" class="mb-4" />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetForm" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" :label="mode" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- End Modal -->

  <!-- Modal Delete -->
  <Modal :show="deleteModalPreview" @hidden="deleteModalPreview = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Suppression</div>
        <div class="mt-2 text-slate-500">Supprimer cette Sites?</div>
      </div>
      <div class="flex justify-center w-full gap-3 py-4 text-center">
        <button type="button" @click="cancelSelect" class="mr-1 btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>
  <!-- End Modal -->
</template>
