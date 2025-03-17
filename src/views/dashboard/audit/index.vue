<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import Tabulator from "tabulator-tables";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import ProgrammeService from "@/services/modules/programme.service";
import ProjetService from "@/services/modules/projet.service";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import AuditService from "@/services/modules/audit.service";
import FormulaireFactuel from "@/services/modules/formFactuel.service";
import { useRouter } from "vue-router";
import OngService from "@/services/modules/ong.service";
import { getAllErrorMessages } from "@/utils/gestion-error";
import ChartProgressionByTime from "../../../components/news/ChartProgressionByTime.vue";
import ProgressBar from "../../../components/news/ProgressBar.vue";
import ChartScroreByPrincipe from "../../../components/news/ChartScroreByPrincipe.vue";
import { getFieldErrors } from "../../../utils/helpers";
import SyntheseService from "../../../services/modules/synthese.service";
import { helper as $h } from "@/utils/helper";
import { data } from "jquery";
import pagination from "@/components/news/pagination.vue";

// Pagination :
const datas = ref([]);
const totalItems = ref(null);
const itemsPerPage = ref(3);
const currentPage = ref(1);

const onPageChanged = function (newPage) {
  console.log(newPage);

  currentPage.value = newPage;
};

const onItemsPerPageChanged = function (itemsPerPage) {
  console.log("itemsPerPage.value ", itemsPerPage.value);
  itemsPerPage.value = itemsPerPage;
};

const search = ref("");

const paginatedAndFilteredData = computed(() => {
  const { paginatedData, totalFilteredItems } = $h.filterData({
    itemsPerPage: itemsPerPage.value,
    search: search.value,
    data: datas.value,
    currentPage: currentPage.value,
    keys: ["entreprise"],
  });

  // Mettre à jour le total pour recalculer la pagination
  totalItems.value = totalFilteredItems;

  return paginatedData;
});

const router = useRouter();

const idFormFactuel = ref("");
const idFormPerception = ref("");
const payload = reactive({
  annee: "",
  entreprise: "",
  entrepriseContact: "",
  dateDeTransmission: "",
  etat: "",
  statut: "",
  projetId: "",
  categorie: "",
});

const usersId = ref([]);

const selectedFile = ref(null);

const imagePreview = ref(null);

const FormAjout = new FormData();

const fileInput = ref(null);

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

const resetFileInput = () => {
  if (fileInput.value) {
    fileInput.value.value = ""; // Réinitialiser l'input file
    selectedFile.value = null;
    document.querySelector('input[type="file"]').value = ""; // Vider l'input
  }
};

const programmeId = JSON.parse(localStorage.getItem("authenticateUser")).programme.id;
const users = ref([]);
const projets = ref([]);

const getProjet = function () {
  ProjetService.get(programmeId)
    .then((data) => {
      projets.value = data.data.data;
      // console.log(users.value);
    })
    .catch((error) => {
      console.log(error);
    });
};

const getUserListe = function () {
  console.log("id du programme", programmeId);
  ProgrammeService.getUsers(programmeId)
    .then((data) => {
      users.value = data.data.data;
      console.log(users.value);
    })
    .catch((error) => {
      console.log(error);
    });
};

const tabulator = ref();
const idSelect = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isLoadingDataScore = ref(false);
const isCreate = ref(true);

const errors = ref({});

const createData = async () => {
  const hasData = Array.from(FormAjout.entries()).length > 0;

  if (hasData) {
    for (const key of Array.from(FormAjout.keys())) {
      FormAjout.delete(key);
    }
  }

  $h.ajouterObjetDansFormData(payload, FormAjout);

  if (selectedFile.value) {
    FormAjout.append("fichier[]", selectedFile.value);
  }

  // Ajouter manuellement le tableau `sites` à FormData
  console.log("userId", usersId.value);
  if (usersId.value.length > 0) {
    usersId.value.forEach((item) => {
      FormAjout.append(`sharedId[]`, item);
    });
  }

  // payload.formulaires_de_gouvernance = [idFormFactuel.value, idFormPerception.value];
  isLoading.value = true;
  await AuditService.create(payload)
    .then(() => {
      isLoading.value = false;
      const hasData = Array.from(FormAjout.entries()).length > 0;

      if (hasData) {
        $h.clearFormData(FormAjout);
      }
      // $h.clearObjectValues(this.formData);
      getDatas();
      resetForm();
      toast.success("audit créer.");
    })
    .catch((error) => {
      console.log(e);
      isLoading.value = false;

      if (error.response && error.response.data && Object.keys(error.response.data.errors).length > 0) {
        messageErreur.value = error.response.data.errors;
        toast.error("Une erreur s'est produite dans votre formulaire");
      } else {
        toast.error(error.response.data.message);
      }
      toast.error("Une erreur est survenue, ressayer");

      // if (e.response && e.response.status === 422) {
      //   errors.value = e.response.data.errors;
      // } else {
      //   toast.error(getAllErrorMessages(e));
      // }
    });
};
const getDatas = async () => {
  isLoadingData.value = true;
  await AuditService.get()
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
  payload.formulaires_de_gouvernance = [idFormFactuel.value, idFormPerception.value];
  await AuditService.update(idSelect.value, payload)
    .then(() => {
      getDatas();
      resetForm();
      toast.success("Audit modifiée.");
    })
    .catch((error) => {
      // if (e.response && e.response.status === 422) {
      //   errors.value = e.response.data.errors;
      // } else {
      //   toast.error(getAllErrorMessages(e));
      // }

      toast.error("Une erreur s'est produite");

      // Mettre à jour les messages d'erreurs dynamiquement
      if (error.response && error.response.data && Object.keys(error.response.data.errors).length > 0) {
        messageErreur.value = error.response.data.errors;
      } else {
        toast.error(error.response.data.errors.message);
      }
      console.error(e);
    })
    .finally(() => {
      isLoading.value = false;
    });
};
const messageErreur = ref({});

const submitData = () => (isCreate.value ? createData() : updateData());
const deleteData = async () => {
  isLoading.value = true;
  await AuditService.destroy(idSelect.value)
    .then(() => {
      deleteModalPreview.value = false;
      isLoading.value = false;
      toast.success("Audit  supprimée");
      getDatas();
    })
    .catch((error) => {
      isLoading.value = false;

      toast.error(error.response.data.message);
    });
};

const handleEdit = (params) => {
  //fetchOrganisationsAndFormulaires();
  isCreate.value = false;
  idSelect.value = params.id;

  if (params.categorie === "Audit comptable et financier") {
    payload.categorie = "0";
  } else if (params.categorie === "Audit de conformité environnementale et social") {
    payload.categorie = "1";
  } else if (params.categorie === "Audit des acquisitions") {
    payload.categorie = "2";
  } else {
    payload.categorie = "3";
  }

  payload.annee = params.annee;
  payload.entreprise = params.entreprise;
  payload.entrepriseContact = params.entrepriseContact;
  payload.dateDeTransmission = params.dateDeTransmission;
  payload.etat = params.etat;
  payload.statut = String(params.statut);
  payload.projetId = params.projet.id;
  // payload.categorie = params.categorie;

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
  resetFileInput();
  payload.annee = "";
  payload.entreprise = "";
  payload.entrepriseContact = "";
  payload.dateDeTransmission = "";
  payload.etat = "";
  payload.statut = "";
  payload.fin = "";
  payload.projetId = "";
  payload.categorie = "";
  usersId.value = [];
  // idFormFactuel.value = formulairesFactuel.value[0].id;
  // idFormPerception.value = formulairesPerception.value[0].id;
  // payload.organisations = [];
  showModalCreate.value = false;
  errors.value = {};
};
const openCreateModal = () => {
  // fetchOrganisationsAndFormulaires();
  showModalCreate.value = isCreate.value = true;
};

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

const yearsCurrentScore = computed(() => Object.keys(currentScore.value));

onMounted(async () => {
  getUserListe();
  getProjet();
  await getDatas();
});
</script>

<template>
  <h2 class="my-10 text-lg font-medium intro-y">Audit</h2>
  <div class="grid grid-cols-12 gap-6 mb-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" class="w-56 pr-10 form-control box" v-model="search" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="openCreateModal"><PlusIcon class="w-4 h-4 mr-3" />Ajouter un audit</button>
      </div>
    </div>
  </div>

  <div class="p-5 mt-5 intro-y">
    <LoaderSnipper v-if="isLoadingData" />
    <div v-else class="overflow-x-auto mt-5">
      <table class="table mt-5">
        <thead class="table-light">
          <tr>
            <th class="whitespace-nowrap">#</th>
            <th class="whitespace-nowrap">Projets</th>
            <th class="whitespace-nowrap">Prestataire</th>
            <th class="whitespace-nowrap">Contact</th>
            <th class="whitespace-nowrap">Exercice audité</th>
            <th class="whitespace-nowrap">Date de transmission</th>
            <th class="whitespace-nowrap">Etat d'avancement</th>
            <th class="whitespace-nowrap">Catégorie</th>
            <th class="whitespace-nowrap">Statut du projet</th>
            <th class="whitespace-nowrap">Date creation</th>
            <th class="whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in paginatedAndFilteredData" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ data.projet.nom }}</td>
            <td>{{ data.entreprise }}</td>

            <td>{{ data.entrepriseContact }}</td>
            <td>{{ data.annee }}</td>
            
            <td>{{ data.dateDeTransmission }}</td>
            <td>{{ data.etat }}</td>
            <td>{{ data.categorie }}</td>
            <td>
              <span v-if="data.statut == 1">Terminer</span>
              <span v-if="data.statut == 0">En cours</span>
              <span v-if="data.statut == -1">En attente</span>
            </td>
            
           

            

            <td>{{ data.created_at }}</td>
            <td class="_flex space-x-2">
              <span @click="handleEdit(data)" class="text-blue-500 cursor-pointer">
                <EditIcon />
              </span>

              <span @click="handleDelete(data)" class="text-red-500 cursor-pointer">
                <Trash2Icon />
              </span>
            </td>
            <!-- <td>
              <div class="flex justify-evenly">
                <EditIcon @click="openUpdateModal(data)" class="w-4 h-4 mr-3" />
                <TrashIcon class="w-4 h-4 mr-3" />
              </div>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>

    <!-- <pre>{{ paginatedAndFilteredData }}</pre> -->

    <pagination class="col-span-12" :total-items="totalItems" :items-per-page="itemsPerPage" :is-loading="isLoadingData" @page-changed="onPageChanged" @items-per-page-changed="onItemsPerPageChanged">
      <!-- Slots personnalisés (facultatif) -->
      <template #prev-icon>
        <span>&laquo; Précédent</span>
      </template>
      <template #next-icon>
        <span>Suivant &raquo;</span>
      </template>
    </pagination>
  </div>

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} un audit</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm class="col-span-12" label="Prestataire" v-model="payload.entreprise" :control="getFieldErrors(errors.entreprise)" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.entreprise">{{ $h.extractContentFromArray(messageErreur.entreprise) }}</p>

          <InputForm class="col-span-12" label="Contact" type="number" v-model="payload.entrepriseContact" :control="getFieldErrors(errors.entrepriseContact)" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.entrepriseContact">{{ $h.extractContentFromArray(messageErreur.entrepriseContact) }}</p>

          <InputForm class="col-span-12" label="Excercice audité" type="text" v-model="payload.annee" :control="getFieldErrors(errors.annee)" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.annee">{{ $h.extractContentFromArray(messageErreur.annee) }}</p>

          <InputForm class="col-span-12" label="Date de transmission" type="date" v-model="payload.dateDeTransmission" :control="getFieldErrors(errors.dateDeTransmission)" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.dateDeTransmission">{{ $h.extractContentFromArray(messageErreur.dateDeTransmission) }}</p>

          <InputForm class="col-span-12" label="Etat avancement" v-model="payload.etat" :control="getFieldErrors(errors.etat)" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.etat">{{ $h.extractContentFromArray(messageErreur.etat) }}</p>

          <InputForm v-if="isCreate" ref="fileInput" class="col-span-12" type="file" @change="handleFileChange" required="required" placeHolder="choisir un fichier" label="Rapport" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.fichier">{{ $h.extractContentFromArray(messageErreur.fichier) }}</p>

          <div v-if="isCreate" class="col-span-12">
            <label class="form-label">Partager à</label>
            <TomSelect v-model="usersId" multiple :options="{ placeholder: 'Selectionez un utilisateur' }" class="w-full">
              <option v-for="(form, index) in users" :key="index" :value="form.id">{{ form.nom }}</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.usersId">{{ $h.extractContentFromArray(messageErreur.usersId) }}</p>
          </div>

          <div class="col-span-12">
            <label class="form-label">Catérogies</label>
            <TomSelect v-model="payload.categorie" :options="{ placeholder: 'Selectionez une catégorie' }" class="w-full">
              <option value="">Choisir une catégorie</option>
              <option value="0">Audit comptable et financier</option>
              <option value="1">Audit de conformité environnementale et social</option>
              <option value="2">Audit des acquisitions</option>
              <option value="3">Audit techniques</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.categorie">{{ $h.extractContentFromArray(messageErreur.categorie) }}</p>
          </div>
          <div class="col-span-12">
            <label class="form-label">Statut</label>
            <TomSelect v-model="payload.statut" :options="{ placeholder: 'Selectionez un statut' }" class="w-full">
              <option value="">Choisir un statut</option>
              <option value="1">Terminer</option>
              <option value="0">En cours</option>
              <option value="-1">En attente</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.statut">{{ $h.extractContentFromArray(messageErreur.statut) }}</p>
          </div>

          <div class="col-span-12">
            <label class="form-label">Projet</label>
            <TomSelect v-model="payload.projetId" :options="{ placeholder: 'Selectionez un projet' }" class="w-full">
              <option v-for="(form, index) in projets" :key="index" :value="form.id">{{ form.nom }}</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.projetId">{{ $h.extractContentFromArray(messageErreur.projetId) }}</p>
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
        <div class="mt-2 text-slate-500">Supprimer un audit</div>
      </div>
      <div class="flex justify-center w-full gap-3 py-4 text-center">
        <button type="button" @click="cancelSelect" class="mr-1 btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>
  <!-- End Modal -->
</template>
