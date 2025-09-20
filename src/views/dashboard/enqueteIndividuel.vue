<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Enquête Individuelle</h2>
    <LoaderSnipper v-if="loading" />
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div v-show="!loading" class="col-span-12">
        <div class="p-5 box max-h-[80vh] overflow-y-auto">
          <h3 class="text-lg font-medium sticky top-0 bg-white pb-2 z-10">Créateur de formulaire</h3>

          <!-- Form Field Creator -->
          <div class="grid grid-cols-4 gap-4 mt-4 sticky top-12 bg-white pb-4 z-10 border-b">
            <div>
              <label class="form-label">Type de champ</label>
              <select v-model="newField.type_champ" class="form-select">
                <option value="">Sélectionner</option>
                <option value="text">Texte</option>
                <option value="number">Nombre</option>
                <option value="email">Email</option>
                <option value="select">Liste déroulante</option>
                <option value="radio">Boutons radio</option>
                <option value="checkbox">Cases à cocher</option>
                <option value="textarea">Zone de texte</option>
                <option value="date">Date</option>
              </select>
            </div>
            <div>
              <label class="form-label">Attribut</label>
              <input v-model="newField.attribut" type="text" class="form-control" placeholder="nom du champ">
            </div>
            <div>
              <label class="form-label">Label</label>
              <input v-model="newField.label" type="text" class="form-control" placeholder="libellé du champ">
            </div>
            <div>
              <label class="form-label">Valeur par défaut</label>
              <input v-model="newField.value" type="text" class="form-control" placeholder="valeur">
            </div>
            <div class="col-span-4">
              <label class="form-label">Options (séparées par des virgules)</label>
              <input v-model="newField.options" type="text" class="form-control" placeholder="option1,option2,option3">
            </div>
          </div>

          <div class="flex gap-2 mt-4 sticky top-40 bg-white py-2 z-10 border-b">
            <button @click="addField" class="btn btn-primary">Ajouter le champ</button>
            <button @click="clearForm" class="btn btn-secondary">Vider le formulaire</button>
            <button @click="copyJson" class="btn btn-success">Copier JSON</button>
          </div>

          <!-- Form Preview -->
          <div v-if="formFields.length > 0" class="mt-6">
            <h4 class="text-md font-medium mb-3">Aperçu du formulaire</h4>
            <div class="p-4 bg-slate-50 rounded max-h-60 overflow-y-auto">
              <div v-for="(field, index) in formFields" :key="index" class="mb-4 p-3 bg-white rounded border">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <strong>{{ field.label }}</strong> ({{ field.type_champ }})
                    <div class="text-sm text-slate-500">Attribut: {{ field.attribut }}</div>
                    <div v-if="field.value" class="text-sm text-slate-600">Valeur par défaut: {{ field.value }}</div>
                    <div v-if="field.options && field.options.length > 0" class="text-sm text-slate-600">
                      Options: {{ field.options.join(', ') }}
                    </div>
                  </div>
                  <button @click="removeField(index)" class="btn btn-sm btn-danger">Supprimer</button>
                </div>
              </div>
            </div>
          </div>

          <!-- JSON Output -->
          <div v-if="formFields.length > 0" class="mt-6">
            <h4 class="text-md font-medium mb-3">JSON résultant</h4>
            <textarea ref="jsonOutput" :value="formJson" class="form-control h-48" readonly></textarea>
          </div>
        </div>
      </div>
    </div>
    <ManagementEvaluationIndividuel :formulaires="datas" />
    <div v-show="!isLoadingData" class="!z-0 p-5 mt-4 box">
      <p class="mt-2 text-lg font-medium intro-y">Liste des formulaires</p>
      

      <div class="overflow-x-auto scrollbar-hidden">
        <div id="tabulator" ref="tabulator" class="mt-5 table-report table-report--tabulator"></div>
      </div>
    </div>
    <LoaderSnipper v-if="isLoadingData" />
  </div>

  <button class="fixed !z-30 bottom-2 btn btn-primary right-5" @click="openCreateModal"><PlusIcon class="mr-3 size-5" /> Créer un formulaire</button>

  <!-- Modal for creating/updating -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="closeModal">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ modeText }} un formulaire</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Libelle" v-model="payload.libelle" :control="getFieldErrors(errors.libelle)" />
          <div class="flex-1">
            <label class="form-label" for="description">Description</label>
            <div class="">
              <textarea name="description" class="form-control" id="description" v-model="payload.description" cols="30" rows="3"></textarea>
              <div v-if="errors.description" class="mt-2 text-danger">{{ getFieldErrors(errors.description) }}</div>
            </div>
          </div>
          <div class="flex-1">
            <label class="form-label" for="description">Structure Formulaire <span class="text-danger">*</span> </label>
            <div class="">
              <div class="flex gap-2 mb-2">
                <button type="button" @click="updateFormDataFromBuilder" class="btn btn-secondary btn-sm">
                  Récupérer depuis le créateur
                </button>
              </div>
              <textarea name="form_data" class="form-control" id="form_data" v-model="payload.form_data" cols="30" rows="3"></textarea>
              <div v-if="errors.form_data" class="mt-2 text-danger">{{ getFieldErrors(errors.form_data) }}</div>
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
        <div class="mt-2 text-slate-500">Supprimer le formulaire?</div>
      </div>
      <div class="flex justify-center gap-3 py-4">
        <button type="button" @click="cancelDelete" class="btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>

  <Modal backdrop="static" size="modal-xl" :show="showModalPreview" @hidden="showModalPreview = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ currentForm.libelle }}</h2>
    </ModalHeader>
    <ModalBody>
      <div class="max-h-[65vh] h-[65vh] overflow-y-auto">
        <div class="p-4">
          <h3 class="text-lg font-medium mb-3">Aperçu du formulaire</h3>
          <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto">{{ JSON.stringify(currentForm.form_data, null, 2) }}</pre>
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <div class="flex gap-2">
        <button type="button" @click="showModalPreview = false" class="flex-1 w-full px-2 py-2 my-3 btn btn-outline-secondary">Retour</button>
      </div>
    </ModalFooter>
  </Modal>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { computed } from "vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { getFieldErrors } from "../../utils/helpers";
import { toast } from "vue3-toastify";
import Tabulator from "tabulator-tables";
import DeleteButton from "@/components/news/DeleteButton.vue";
import EnqueteIndividuelService from "../../services/modules/enquete.individuel.service";
import ManagementEvaluationIndividuel from "./ManagementEvaluationIndividuel.vue";
import { reactive } from "vue";

const payload = reactive({ libelle: "", description: "", form_data: "" });
const loading = ref(false);
const isLoading = ref(false);
const showModalCreate = ref(false);
const showModalPreview = ref(false);
const isLoadingData = ref(false);
const isCreate = ref(true);
const datas = ref([]);
const errors = ref({});
const currentForm = ref({});
const idSelect = ref("");
const nameSelect = ref("");
const deleteModalPreview = ref(false);
const tabulator = ref();

// Form builder variables
const newField = reactive({
  type_champ: "",
  attribut: "",
  label: "",
  value: "",
  options: ""
});
const formFields = ref([]);
const jsonOutput = ref();

// Form builder methods
const addField = () => {
  if (!newField.type_champ || !newField.attribut) {
    toast.error("Type de champ et attribut sont requis");
    return;
  }

  const field = {
    type_champ: newField.type_champ,
    attribut: newField.attribut,
    label: newField.label || newField.attribut,
    value: newField.value || "",
    options: newField.options ? newField.options.split(',').map(opt => opt.trim()) : []
  };

  formFields.value.push(field);

  // Reset form
  newField.type_champ = "";
  newField.attribut = "";
  newField.label = "";
  newField.value = "";
  newField.options = "";
};

const removeField = (index) => {
  formFields.value.splice(index, 1);
};

const clearForm = () => {
  formFields.value = [];
  newField.type_champ = "";
  newField.attribut = "";
  newField.label = "";
  newField.value = "";
  newField.options = "";
};

const copyJson = async () => {
  try {
    await navigator.clipboard.writeText(formJson.value);
    toast.success("JSON copié dans le presse-papier");
  } catch (err) {
    console.error("Erreur lors de la copie:", err);
    toast.error("Erreur lors de la copie du JSON");
  }
};

const updateFormDataFromBuilder = () => {
  if (formFields.value.length > 0) {
    payload.form_data = formJson.value;
    toast.success("Données du formulaire mises à jour depuis le créateur");
  } else {
    toast.error("Aucun champ créé dans le formulaire");
  }
};

const formJson = computed(() => {
  return JSON.stringify({
    title: "Formulaire créé",
    pages: [{
      name: "page1",
      elements: formFields.value.map(field => {
        const element = {
          type: field.type_champ,
          name: field.attribut,
          title: field.label
        };

        if (field.value) {
          element.defaultValue = field.value;
        }

        if (field.options && field.options.length > 0 && ['select', 'radio', 'checkbox'].includes(field.type_champ)) {
          element.choices = field.options;
        }

        return element;
      })
    }]
  }, null, 2);
});

const initTabulator = () => {
  tabulator.value = new Tabulator("#tabulator", {
    data: datas.value,
    placeholder: "Aucune donnée disponible.",
    layout: "fitColumns",
    responsiveLayout: "hide",
    pagination: "local",
    paginationSize: 5,
    columns: [
      {
        title: "Libellé",
        field: "libelle",
        vertAlign: "middle",
      },

      // {
      //   title: "Auteur",
      //   field: "auteur",
      //   hozAlign: "center",
      // },
      {
        title: "Actions",
        field: "actions",
        vertAlign: "middle",
        hozAlign: "center",
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

          const previewButton = createButton("voir", "btn btn-primary", () => {
            handlePreview(cell.getData());
          });

          const editButton = createButton("modifier", "btn btn-pending", () => {
            handleEdit(cell.getData());
          });

          const deleteButton = createButton("supprimer", "btn btn-danger", () => {
            handleDelete(cell.getData());
          });
          container.append(previewButton, editButton, deleteButton);
          return container;
        },
      },
    ],
  });
};
// Fetch data
const getDatas = async () => {
  isLoadingData.value = true;
  try {
    const { data } = await EnqueteIndividuelService.get();
    datas.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingData.value = false;
  }
  initTabulator();
};

// Submit data (create or update)
const submitData = async () => {
  isLoading.value = true;
  payload.form_data = JSON.parse(payload.form_data);
  const action = isCreate.value ? EnqueteIndividuelService.create(payload) : EnqueteIndividuelService.update(idSelect.value, payload);
  try {
    await action;
    toast.success(`Formulaire ${isCreate.value ? "crée" : "modifié"} avec succès.`);
    getDatas();
    payload.form_data = JSON.stringify(payload.form_data);
    resetForm();
  } catch (e) {
    payload.form_data = JSON.stringify(payload.form_data);
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
    await EnqueteIndividuelService.destroy(idSelect.value);
    toast.success("Formulaire supprimé avec succès.");
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
  payload.form_data = JSON.stringify(data.form_data);
  payload.description = data.description ?? "";
  showModalCreate.value = true;
};

const handlePreview = (data) => {
  currentForm.value = data;
  showModalPreview.value = true;
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
  errors.value = {};
  showModalCreate.value = false;
};
const openCreateModal = () => {
  // resetForm();
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

onMounted(() => {
  getDatas();
});
</script>

<style scoped>
.iframe-container {
  position: relative !important;
  width: 82vw !important;
  display: flex;
  justify-content: center;
  max-width: 82vw !important;
  height: 85vh !important;
  padding-top: 56.25% !important; /* Rapport d'aspect 16:9 */
}
iframe {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  border: none !important;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 82vw !important;
  height: 95px; /* Hauteur du header à masquer */
  background-color: white; /* Ou utilisez une autre couleur selon le contexte */
  z-index: 10;
}
</style>
