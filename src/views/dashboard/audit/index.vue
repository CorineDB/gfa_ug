<script setup>
import { computed, onMounted, reactive, ref ,getCurrentInstance } from "vue";
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

//vérifier numéro de téléphone
const { proxy } = getCurrentInstance();
const currentPhone = ref("");

const isValid = computed(() => {
  return proxy.$isValidPhoneNumber(payload.entrepriseContact, "BJ");
});


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

  if(!isValid.value) {
    toast.error("Numéro de téléphone invalide");
    isLoading.value = false;
    return;
  }


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

 if(!isValid.value) {
    toast.error("Numéro de téléphone invalide");
    isLoading.value = false;
    return;
  }

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
      <table class="w-full text-left table-auto min-w-max">
        <thead class="bg-gray-100 text-gray-700 text-sm">
          <tr>
            <th class="p-4 border-b border-slate-300 bg-slate-50">#</th>
            <th class="p-4 border-b border-slate-300 bg-slate-50">Projets</th>
            <th class="p-4 border-b border-slate-300 bg-slate-50">Prestataire</th>
            <th class="p-4 border-b border-slate-300 bg-slate-50">Contact</th>
            <th class="p-4 border-b border-slate-300 bg-slate-50">Exercice audité</th>
            <th class="p-4 border-b border-slate-300 bg-slate-50">Date de transmission</th>
            <th class="p-4 border-b border-slate-300 bg-slate-50">Etat d'avancement</th>
            <th class="p-4 border-b border-slate-300 bg-slate-50">Catégorie</th>
            <th class="p-4 border-b border-slate-300 bg-slate-50">Statut du projet</th>
            <th class="p-4 border-b border-slate-300 bg-slate-50">Date creation</th>
            <th class="p-4 border-b border-slate-300 bg-slate-50">Actions</th>
          </tr>
        </thead>
        <tbody class="text-sm divide-y divide-gray-200 bg-white">
          <tr v-for="(data, index) in paginatedAndFilteredData" :key="index"  class="hover:bg-gray-50">
            <td class="p-4 border-b border-slate-200" >{{ index + 1 }}</td>
            <td class="p-4 border-b border-slate-200" >{{ data.projet.nom }}</td>
            <td class="p-4 border-b border-slate-200" >{{ data.entreprise }}</td>

            <td class="p-4 border-b border-slate-200" >{{ data.entrepriseContact }}</td>
            <td class="p-4 border-b border-slate-200" >{{ data.annee }}</td>
            
            <td class="p-4 border-b border-slate-200" >{{ data.dateDeTransmission }}</td>
            <td class="p-4 border-b border-slate-200" >{{ data.etat }}</td>
            <td class="p-4 border-b border-slate-200" >{{ data.categorie }}</td>
            <td class="p-4 border-b border-slate-200" >
              <span v-if="data.statut == 1">Terminer</span>
              <span v-if="data.statut == 0">En cours</span>
              <span v-if="data.statut == -1">En attente</span>
            </td>
            
           

            

            <td class="p-4 border-b border-slate-200">{{ data.created_at }}</td>
            <td class="p-4 border-b border-slate-200">
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
  <Modal size="modal-xl" backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} un audit</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-12 gap-4">
          <!-- Prestataire -->
          <div class="col-span-12 md:col-span-6">
            <InputForm label="Prestataire" v-model="payload.entreprise" :control="getFieldErrors(errors.entreprise)" />
            <p class="text-red-500 text-[12px] -mt-2" v-if="messageErreur.entreprise">{{ $h.extractContentFromArray(messageErreur.entreprise) }}</p>
          </div>

          <!-- Contact -->
          <div class="col-span-12 md:col-span-6">
            <InputForm
              label="Contact"
              :control="getFieldErrors(errors.entrepriseContact)"
              v-model="payload.entrepriseContact"
              maxlength="13"
              placeholder="+229xxxxxxxxxx"
              type="text"
            />
            <div class="mt-4 _min-h-[1.5rem]">
              <p v-if="isValid" class="flex items-center text-green-600 font-medium text-sm animate-pulse">
                <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Numéro valide
              </p>
              <p v-else-if="payload.entrepriseContact && payload.entrepriseContact.length > 0" class="flex items-center text-red-500 font-medium text-sm">
                <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                Numéro invalide
              </p>
            </div>
            <p class="text-red-500 text-[12px] -mt-2" v-if="messageErreur.entrepriseContact">{{ $h.extractContentFromArray(messageErreur.entrepriseContact) }}</p>
          </div>

          <!-- Exercice audité -->
          <div class="col-span-12 md:col-span-6">
            <InputForm label="Exercice audité" type="text" v-model="payload.annee" :control="getFieldErrors(errors.annee)" />
            <p class="text-red-500 text-[12px] -mt-2" v-if="messageErreur.annee">{{ $h.extractContentFromArray(messageErreur.annee) }}</p>
          </div>

          <!-- Date de transmission -->
          <div class="col-span-12 md:col-span-6">
            <InputForm label="Date de transmission" type="date" v-model="payload.dateDeTransmission" :control="getFieldErrors(errors.dateDeTransmission)" />
            <p class="text-red-500 text-[12px] -mt-2" v-if="messageErreur.dateDeTransmission">{{ $h.extractContentFromArray(messageErreur.dateDeTransmission) }}</p>
          </div>

          <!-- État d’avancement -->
          <div class="col-span-12 md:col-span-6">
            <InputForm label="État d’avancement" v-model="payload.etat" :control="getFieldErrors(errors.etat)" />
            <p class="text-red-500 text-[12px] -mt-2" v-if="messageErreur.etat">{{ $h.extractContentFromArray(messageErreur.etat) }}</p>
          </div>

          <!-- Rapport -->
          <div class="col-span-12 md:col-span-6" v-if="isCreate">
            <InputForm ref="fileInput" type="file" @change="handleFileChange" required="required" placeHolder="choisir un fichier" label="Rapport" />
            <p class="text-red-500 text-[12px] -mt-2" v-if="messageErreur.fichier">{{ $h.extractContentFromArray(messageErreur.fichier) }}</p>
          </div>

          <!-- Partager à -->
          <div class="col-span-12 md:col-span-6" v-if="isCreate">
            <label class="form-label">Partager à</label>
            <TomSelect v-model="usersId" multiple :options="{ placeholder: 'Sélectionnez un utilisateur' }" class="w-full">
              <option v-for="(form, index) in users" :key="index" :value="form.id">{{ form.nom }}</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2" v-if="messageErreur.usersId">{{ $h.extractContentFromArray(messageErreur.usersId) }}</p>
          </div>

          <!-- Catégories -->
          <div class="col-span-12 md:col-span-6">
            <label class="form-label">Catégories</label>
            <TomSelect v-model="payload.categorie" :options="{ placeholder: 'Sélectionnez une catégorie' }" class="w-full">
              <option value="">Choisir une catégorie</option>
              <option value="0">Audit comptable et financier</option>
              <option value="1">Audit de conformité environnementale et sociale</option>
              <option value="2">Audit des acquisitions</option>
              <option value="3">Audit technique</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2" v-if="messageErreur.categorie">{{ $h.extractContentFromArray(messageErreur.categorie) }}</p>
          </div>

          <!-- Statut -->
          <div class="col-span-12 md:col-span-6">
            <label class="form-label">Statut</label>
            <TomSelect v-model="payload.statut" :options="{ placeholder: 'Sélectionnez un statut' }" class="w-full">
              <option value="">Choisir un statut</option>
              <option value="1">Terminé</option>
              <option value="0">En cours</option>
              <option value="-1">En attente</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2" v-if="messageErreur.statut">{{ $h.extractContentFromArray(messageErreur.statut) }}</p>
          </div>

          <!-- Projet -->
          <div class="col-span-12 md:col-span-6">
            <label class="form-label">Projet</label>
            <TomSelect v-model="payload.projetId" :options="{ placeholder: 'Sélectionnez un projet' }" class="w-full">
              <option v-for="(form, index) in projets" :key="index" :value="form.id">{{ form.nom }}</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2" v-if="messageErreur.projetId">{{ $h.extractContentFromArray(messageErreur.projetId) }}</p>
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
