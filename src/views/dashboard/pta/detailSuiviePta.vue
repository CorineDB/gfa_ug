<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import Tabulator from "tabulator-tables";
import DeleteButton from "@/components/news/DeleteButton.vue";
import ActiviteService from "@/services/modules/activite.service";
import { useYearsStore } from "@/stores/years";

import { toast } from "vue3-toastify";

import LoaderSnipper from "@/components/LoaderSnipper.vue";
import SuiviFinancierService from "@/services/modules/suiviFinancier.service";

import { useRouter, useRoute } from "vue-router";

import { getAllErrorMessages } from "@/utils/gestion-error";

import { getFieldErrors } from "../../../utils/helpers";

import { helper as $h } from "@/utils/helper";
import { data } from "jquery";

const router = useRouter();
const route = useRoute();
//Store years
const yearsStore = useYearsStore();

const idFormFactuel = ref("");
const idFormPerception = ref("");
const payload = reactive({
  activiteId: route.params.activiteId,
  trimestre: 1, // Trimestre actuel
  annee: new Date().getFullYear(), // Set current year as default
  consommer: 0,
  type: 0,
});

const usersId = ref([]);

const selectedFile = ref(null);

const imagePreview = ref(null);

const FormAjout = new FormData();

const handleFileChange = function (event) {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;

    // Créer une prévisualisation de l'image
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file); // Lire le fichier en tant qu'URL de données
  }
};

const programmeId = JSON.parse(localStorage.getItem("authenticateUser")).programme.id;
// const users = ref([]);
// const projets = ref([]);

// const getProjet = function () {
//   ProjetService.get(programmeId)
//     .then((data) => {
//       projets.value = data.data.data;
//       // console.log(users.value);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

// const getUserListe = function () {
//   console.log("id du programme", programmeId);
//   ProgrammeService.getUsers(programmeId)
//     .then((data) => {
//       users.value = data.data.data;
//       console.log(users.value);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

const tabulator = ref();
const idSelect = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isLoadingDataScore = ref(false);
const isCreate = ref(true);
const datas = ref([]);

const errors = ref({});

const createData = async () => {
  isLoading.value = true;
  await SuiviFinancierService.create(payload)
    .then(() => {
      isLoading.value = false;

      // $h.clearObjectValues(this.formData);
      getDatas();
      resetForm();
      toast.success(" suivi créer.");
    })
    .catch((e) => {
      console.log(e);
      isLoading.value = false;
      if (e.response && e.response.status === 422) {
        errors.value = e.response.data.errors;
      } else {
        toast.error(getAllErrorMessages(e));
      }
    });
};

const infoActivite = ref(null);

const getActivitesDatas = async () => {
  isLoadingData.value = true;

  await ActiviteService.get(route.params.activiteId)
    .then((result) => {
      console.log(result.data.data);
      infoActivite.value = result.data.data;
      // isLoadingData.value = false;
    })
    .catch((e) => {
      isLoadingData.value = false;
      toast.error(getAllErrorMessages(e));
    });
  // initTabulator();
};

const getDatas = async () => {
  isLoadingData.value = true;

  await SuiviFinancierService.get(route.params.activiteId)
    .then((result) => {
      datas.value = result.data.data;
      isLoadingData.value = false;
    })
    .catch((e) => {
      isLoadingData.value = false;
      toast.error(getAllErrorMessages(e));
    });
  // initTabulator();
};

const updateData = async () => {
  isLoading.value = true;
  // payload.formulaires_de_gouvernance = [idFormFactuel.value, idFormPerception.value];
  await SuiviFinancierService.update(idSelect.value, payload)
    .then(() => {
      getDatas();
      resetForm();
      toast.success("Suivi  modifiée.");
    })
    .catch((e) => {
      if (e.response && e.response.status === 422) {
        errors.value = e.response.data.errors;
      } else {
        toast.error(getAllErrorMessages(e));
      }
      console.error(e);
    })
    .finally(() => {
      isLoading.value = false;
    });
};
const submitData = () => (isCreate.value ? createData() : updateData());
const deleteData = async () => {
  isLoading.value = true;
  await SuiviFinancierService.destroy(idSelect.value)
    .then(() => {
      deleteModalPreview.value = false;
      isLoading.value = false;
      toast.success("Suivi   supprimée");
      getDatas();
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Une erreur est survenue, ressayer");
    });
};

const handleEdit = (params) => {
  console.log(params);
  //fetchOrganisationsAndFormulaires();
  isCreate.value = false;
  idSelect.value = params.id;

  payload.annee = params.annee;
  payload.trimestre = params.trimestre;
  payload.consommer = params.consommer;
  payload.type = params.type;

  console.log(payload);

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
  payload.annee = "";
  payload.trimestre = "";
  payload.consommer = "";
  payload.type = "";

  showModalCreate.value = false;
  errors.value = {};
};
const openCreateModal = () => {
  // fetchOrganisationsAndFormulaires();
  showModalCreate.value = true;
  isCreate.value = true;
};

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

onMounted(async () => {
  // getUserListe();
  // getProjet();
  await getDatas();
  await getActivitesDatas();
});
</script>

<template>
  <h2 class="my-10 text-lg font-medium intro-y">Suivi</h2>
  <div class="grid grid-cols-12 gap-6 mb-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="openCreateModal"><PlusIcon class="w-4 h-4 mr-3" />Ajouter un suivi</button>
      </div>
    </div>
  </div>
  <div class="p-5 mt-5 intro-y">
    <LoaderSnipper v-if="isLoadingData" />
    <div v-else class="overflow-x-auto mt-5">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-blue-100 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" rowspan="2" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Activités</th>
            <th scope="col" rowspan="2" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Année</th>
            <th scope="col" rowspan="2" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Trimestre</th>
            <th scope="col" colspan="4" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Période</th>
            <th scope="col" colspan="4" class="py-3 px-6 text-center border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Exercice</th>
            <th scope="col" colspan="4" class="py-3 px-6 text-center border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Cumul</th>
            <th scope="col" rowspan="2" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap text-center">Actions</th>
          </tr>
          <tr>
            <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Budget</th>
            <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Consommé</th>
            <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Disponible</th>
            <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TEF</th>
            <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Budget</th>
            <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Consommé</th>
            <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Disponible</th>
            <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TEF</th>
            <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Budget</th>
            <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Consommé</th>
            <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Disponible</th>
            <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TEF</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(suivi, index) in datas" :key="index" class="bg-white border-b hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
              <span class="font-bold">{{ suivi?.activite?.codePta }}-{{ suivi?.activite?.nom }}</span>
            </td>
            <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
              <span class="font-bold">{{ suivi.annee }}</span>
            </td>
            <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
              <span class="font-bold">{{ suivi.trimestre }}</span>
            </td>
            <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
              <span class="font-bold">{{ $h.formatCurrency(suivi.periode.budjet) }}</span>
            </td>
            <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
              <span class="font-bold">{{ $h.formatCurrency(suivi.periode.consommer) }}</span>
            </td>
            <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
              <span class="font-bold">{{ $h.formatCurrency(suivi.periode.disponible) }}</span>
            </td>
            <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
              <span class="font-bold">{{ suivi.periode.pourcentage }}</span>
            </td>
            <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
              <span class="font-bold">{{ $h.formatCurrency(suivi.exercice.budjet) }}</span>
            </td>
            <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
              <span class="font-bold">{{ $h.formatCurrency(suivi.exercice.consommer) }}</span>
            </td>
            <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
              <span class="font-bold">{{ $h.formatCurrency(suivi.exercice.disponible) }}</span>
            </td>
            <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
              <span class="font-bold">{{ suivi.exercice.pourcentage }}</span>
            </td>
            <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
              <span class="font-bold">{{ $h.formatCurrency(suivi.cumul.budjet) }}</span>
            </td>
            <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
              <span class="font-bold">{{ $h.formatCurrency(suivi.cumul.consommer) }}</span>
            </td>
            <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
              <span class="font-bold">{{ $h.formatCurrency(suivi.cumul.disponible) }}</span>
            </td>
            <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
              <span class="font-bold">{{ suivi.cumul.pourcentage }}</span>
            </td>
            <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700 text-center">
              <button @click="ouvrirModalSuiviFinancierActivite(suivi)" class="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-xs px-4 py-2 mr-2">Suivre</button>

              <button @click="handleEdit(suivi)" class="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-xs px-4 py-2 mr-2">Modifier</button>

              <button @click="handleDelete(suivi)" class="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-xs px-4 py-2">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} un suivi</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm class="col-span-12" label="Montant consommé" v-model="payload.consommer" :control="getFieldErrors(errors.consommer)" />
          

          <!-- <pre>{{ yearsStore.getYears }}</pre> -->
          <div class="col-span-12">
            <label class="form-label">Année</label>
            <TomSelect v-model="payload.annee" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option v-for="(year, index) in yearsStore.getYears" :key="index" :value="year">{{ year }}</option>
            </TomSelect>
          </div>
          <div v-if="getFieldErrors(errors.annee)" class="mt-2 text-danger">{{ getFieldErrors(errors.annee) }}</div>

          <!-- <InputForm class="col-span-12" label="Année de décaissement" type="number" min="2000" v-model="payload.annee" :control="getFieldErrors(errors.entrepriseContact)" /> -->
          <InputForm v-if="isCreate" class="col-span-12" type="file" @change="handleFileChange" required="required" placeHolder="choisir un fichier" label="Rapport" />

          <div class="col-span-12">
            <label class="form-label">Trimestre</label>
            <TomSelect v-model="payload.trimestre" :options="{ placeholder: 'Selectionez le trimestre' }" class="w-full">
              <option value="1">Trimestre 1</option>
              <option value="2">Trimestre 2</option>
              <option value="3">Trimestre 3</option>
              <option value="4">Trimestre 4</option>
            </TomSelect>
            <!-- <div v-if="errors.formulaires_de_gouvernance" class="mt-2 text-danger">{{ getFieldErrors(errors.formulaires_de_gouvernance) }}</div> -->
          </div>

          <div class="col-span-12">
            <label class="form-label">Catérogies</label>
            <TomSelect v-model="payload.type" :options="{ placeholder: 'Selectionez une source' }" class="w-full">
              <option value="0">Fond propre</option>
              <option value="1">Budget Alloue</option>
            </TomSelect>
            <!-- <div v-if="errors.formulaires_de_gouvernance" class="mt-2 text-danger">{{ getFieldErrors(errors.formulaires_de_gouvernance) }}</div> -->
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
        <div class="mt-2 text-slate-500">Supprimer un suivi</div>
      </div>
      <div class="flex justify-center w-full gap-3 py-4 text-center">
        <button type="button" @click="cancelSelect" class="mr-1 btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>
  <!-- End Modal -->
</template>
