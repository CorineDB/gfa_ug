<script setup>
import { onBeforeUnmount, reactive, ref, computed, onMounted } from "vue";
import { toast } from "vue3-toastify";
import OptionsResponse from "@/components/create-form/OptionsResponse.vue";
import PrincipeGouvernance from "@/components/create-form/PrincipeGouvernance.vue";
import QuestionsOperationnel from "@/components/create-form/QuestionsOperationnel.vue";
import PerceptionStructureMultiple from "@/components/create-form/PerceptionStructureMultiple.vue";
import ListAccordionQuestion from "@/components/create-form/ListAccordionQuestion.vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import FormulaireFactuel from "@/services/modules/formFactuel.service";
import PreviewPerceptionForm from "@/components/create-form/PreviewPerceptionForm.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import ListFormPerception from "@/components/create-form/ListFormPerception.vue";
import ListOptionsResponse from "@/components/create-form/ListOptionsResponse.vue";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { useRoute } from "vue-router";
import { getFieldErrors } from "../../utils/helpers";
import { useYearsStore } from "@/stores/years";

const yearsStore = useYearsStore();

const route = useRoute();
const tabs = [
  {
    label: "FORMULAIRE DE PERCEPTION",
    key: 0,
  },
  {
    label: "LISTE FORMULAIRE DE PERCEPTION",
    key: 1,
  },
];

const currentTab = ref(0);
const indexAccordion = ref(0);
const resetCurrentForm = ref(false);
const modalForm = ref(false);
const isLoadingForm = ref(false);
const fetchListForms = ref(false);
const resetOptions = ref(false);
const showDeleteForm = ref(false);
const previewFormPerceptionData = ref([]);
const globalFormPerceptionData = ref([]);
const previewPrincipesGouvernance = ref({});
const globalPrincipesGouvernance = ref({});
const errors = ref({});
const globalOptionResponses = ref({ options_de_reponse: [] });
const previewOptionResponses = ref({ options_de_reponse: [] });
const principesGouvernance = ref({ principes_de_gouvernance: [] });
const uniqueKeys = new Map();
const globalData = localStorage.getItem("globalFormPerceptionData");
const previewData = localStorage.getItem("previewFormPerceptionData");

const isAvailable = reactive({
  option: true,
  principe: true,
  indicateur: true,
});

const payload = reactive({
  libelle: "",
  annee_exercice: new Date().getFullYear(),
  type: "perception",
  perception: { options_de_reponse: [], principes_de_gouvernance: principesGouvernance.value.principes_de_gouvernance },
});

const currentPreviewPerceptionFormData = reactive({
  principe: { id: "", nom: "" },
  indicateur: { id: "", nom: "" },
});

const currentGlobalPerceptionFormData = reactive({
  principe: "",
  indicateur: "",
});

const resetErrors = () => {
  modalForm.value = false;
  errors.value = {};
};

// Fonction pour générer une clé unique pour chaque soumission
const generateKey = (id) => {
  return `${id}`;
};

const organiseGlobalFormPerceptionData = (submissions) => {
  // const organisedData = { principes_de_gouvernance: [] };

  submissions.forEach((submission) => {
    // Trouver ou créer le principe de gouvernance
    let principe = principesGouvernance.value.principes_de_gouvernance.find((p) => p.id === submission.principe);
    if (!principe) {
      principe = { id: submission.principe, questions_operationnelle: [] };
      principesGouvernance.value.principes_de_gouvernance.push(principe);
    }

    // Ajouter l'indicateur de gouvernance s'il n'est pas déjà présent
    if (!principe.questions_operationnelle.includes(submission.indicateur)) {
      principe.questions_operationnelle.push(submission.indicateur);
    }
  });

  return principesGouvernance.value;
};

const organisePreviewFormPerceptionData = (submissions) => {
  const organisedData = { principes_de_gouvernance: [] };

  submissions.forEach((submission) => {
    // Trouver ou créer le principe de gouvernance
    let principe = organisedData.principes_de_gouvernance.find((p) => p.id === submission.principe.id);
    if (!principe) {
      principe = { id: submission.principe.id, nom: submission.principe.nom, questions_operationnelle: [] };
      organisedData.principes_de_gouvernance.push(principe);
    }

    // Trouver ou créer l'indicateur de gouvernance
    let indicateur = principe.questions_operationnelle.find((i) => i.id === submission.indicateur.id);
    if (!indicateur) {
      indicateur = { id: submission.indicateur.id, nom: submission.indicateur.nom };
      principe.questions_operationnelle.push(indicateur);
    }
  });

  return organisedData;
};

const resetCurrentPreviewFactuelFormData = () => {
  for (const key in currentPreviewPerceptionFormData) {
    currentPreviewPerceptionFormData[key] = { id: "", nom: "" };
  }

  currentPreviewPerceptionFormDataArray.value = [];
  // currentPreviewPerceptionFormData.indicateur = { id: "", nom: "" };
};
const resetCurrentGlobalFactuelFormData = () => {
  Object.keys(currentGlobalPerceptionFormData).forEach((key) => {
    currentGlobalPerceptionFormData[key] = "";
  });

  currentGlobalPerceptionFormDataArray.value = [];

  // currentGlobalPerceptionFormData.indicateur = "";
};
const resetAllForm = () => {
  resetCurrentGlobalFactuelFormData();
  resetCurrentPreviewFactuelFormData();
  resetOptions.value = !resetOptions.value;
  resetCurrentForm.value = !resetCurrentForm.value;
  globalOptionResponses.value.options_de_reponse = [];
  previewOptionResponses.value.options_de_reponse = [];
  principesGouvernance.value.principes_de_gouvernance = [];
  globalFormPerceptionData.value = [];
  previewFormPerceptionData.value = [];
};

const updateAllTypesGouvernance = () => {
  globalPrincipesGouvernance.value = organiseGlobalFormPerceptionData(globalFormPerceptionData.value);
  previewPrincipesGouvernance.value = organisePreviewFormPerceptionData(previewFormPerceptionData.value);
  // console.log("GLOBAL", globalTypesGouvernance.value);
  // console.log("PREVIEW", previewTypesGouvernance.value);
};

const changeIndexAccordion = (index) => {
  indexAccordion.value = index;
};

const getPrincipe = (principe) => {
  changeIndexAccordion(1);
  currentGlobalPerceptionFormData.principe = principe.id;

  currentGlobalPerceptionFormDataArray.value.forEach((item) => {
    item.principe = currentGlobalPerceptionFormData.principe;
  });

  currentPreviewPerceptionFormData.principe = { id: principe.id, nom: principe.nom };

  currentPreviewPerceptionFormDataArray.value.forEach((item2) => {
    item2.principe = currentPreviewPerceptionFormData.principe;
  });
};

const currentGlobalPerceptionFormDataArray = ref([]);
const currentPreviewPerceptionFormDataArray = ref([]);

const getQuestion = (question) => {
  console.log("question", question);
  // changeIndexAccordion(2);
  currentGlobalPerceptionFormData.indicateur = question.id;

  let form = {
    principe: "",
    indicateur: question.id,
  };

  currentGlobalPerceptionFormDataArray.value.push(form);

  console.log("currentGlobalPerceptionFormDataArray.value", currentGlobalPerceptionFormDataArray.value);

  currentPreviewPerceptionFormData.indicateur = { id: question.id, nom: question.nom };

  let form2 = {
    principe: {
      id: "",
      nom: "",
    },
    indicateur: {
      id: question.id,
      nom: question.nom,
    },
  };
  currentPreviewPerceptionFormDataArray.value.push(form2);

  console.log("currentPreviewPerceptionFormDataArray.value", currentPreviewPerceptionFormDataArray.value);
};

const addNewIndicator = () => {
  console.log("currentGlobalPerceptionFormDataArray.value", currentGlobalPerceptionFormDataArray.value);

  console.log("currentPreviewPerceptionFormDataArray.value", currentPreviewPerceptionFormDataArray.value);

  currentGlobalPerceptionFormDataArray.value.forEach((item, index) => {
    const key = generateKey(item.indicateur);

    if (!uniqueKeys.has(key)) {
      globalFormPerceptionData.value.unshift({ ...item });

      previewFormPerceptionData.value.unshift(JSON.parse(JSON.stringify(currentPreviewPerceptionFormDataArray.value[index])));

      console.log("previewFormPerceptionData.value", previewFormPerceptionData.value);
      uniqueKeys.set(key, true);
      localStorage.setItem("globalFormPerceptionData", JSON.stringify(globalFormPerceptionData.value));
      localStorage.setItem("previewFormPerceptionData", JSON.stringify(previewFormPerceptionData.value));

      updateAllTypesGouvernance();

      if (index === currentGlobalPerceptionFormDataArray.value.length - 1) {
        resetCurrentPreviewFactuelFormData();
        resetCurrentGlobalFactuelFormData();
        resetCurrentForm.value = !resetCurrentForm.value;
      }

      toast.success("Indicateur ajouté.");
    } else {
      toast.info("Indicateur exisant.");
    }
  });

  // const key = generateKey(currentGlobalPerceptionFormData.indicateur);

  // // Ajouter la soumission si la clé est absente
  // if (!uniqueKeys.has(key)) {
  //   console.log("{ ...currentGlobalPerceptionFormData }", { ...currentGlobalPerceptionFormData });

  //   globalFormPerceptionData.value.unshift({ ...currentGlobalPerceptionFormData });
  //   previewFormPerceptionData.value.unshift(JSON.parse(JSON.stringify(currentPreviewPerceptionFormData)));
  //   uniqueKeys.set(key, true);
  //   localStorage.setItem("globalFormPerceptionData", JSON.stringify(globalFormPerceptionData.value));
  //   localStorage.setItem("previewFormPerceptionData", JSON.stringify(previewFormPerceptionData.value));

  //   updateAllTypesGouvernance();
  //   resetCurrentPreviewFactuelFormData();
  //   resetCurrentGlobalFactuelFormData();
  //   resetCurrentForm.value = !resetCurrentForm.value;
  //   toast.success("Indicateur ajouté.");
  // } else {
  //   toast.info("Indicateur exisant.");
  // }
};
const removeIndicator = (indicateur) => {
  const key = generateKey(indicateur.id);
  // Trouver l'index de la soumission à supprimer
  const index = globalFormPerceptionData.value.findIndex((s) => s.indicateur === indicateur.id);
  // Supprimer la soumission et sa clé si elle est trouvée
  if (index !== -1) {
    globalFormPerceptionData.value.splice(index, 1);
    previewFormPerceptionData.value.splice(index, 1);
    uniqueKeys.delete(key);
    updateAllTypesGouvernance();
    localStorage.setItem("globalFormPerceptionData", JSON.stringify(globalFormPerceptionData.value));
    localStorage.setItem("previewFormPerceptionData", JSON.stringify(previewFormPerceptionData.value));

    toast.success("Indicateur supprimé.");
    // console.log("Nouvelle Global:", globalFormFactuelData.value);
    // console.log("Nouvelle preview:", previewFormFactuelData.value);
  }
};
const clearUniqueKeys = () => {
  uniqueKeys.clear(); // Supprime toutes les clés de uniqueKeys
};
const resetAllFormWithDataLocalStorage = () => {
  resetAllForm();
  clearUniqueKeys();
  localStorage.removeItem("globalFormPerceptionData");
  localStorage.removeItem("previewFormPerceptionData");
  localStorage.removeItem("previewOptionResponsesModel");
  localStorage.removeItem("globalOptionResponses");
  showDeleteForm.value = false;
  // toast.success("Formulaire supprimé.");
};

const resetForm = () => {
  payload.libelle = "";
  modalForm.value = false;
};
const createForm = async () => {
  isLoadingForm.value = true;
  payload.perception.options_de_reponse = globalOptionResponses.value.options_de_reponse;
  try {
    await FormulaireFactuel.create(payload);
    toast.success(`Formulaire créé avec succès.`);
    fetchListForms.value = !fetchListForms.value;
    // resetForm();
    resetAllFormWithDataLocalStorage();
    clearUniqueKeys();
    errors.value = {};
    modalForm.value = false;
  } catch (e) {
    if (e.response && e.response.status === 422) {
      errors.value = e.response.data.errors;
    } else {
      toast.error(getAllErrorMessages(e));
    }
    console.log(e);
  } finally {
    isLoadingForm.value = false;
  }
};

const previewForm = () => {
  if (globalOptionResponses.value.options_de_reponse.length >= 2) modalForm.value = true;
  else {
    toast.error("Ajouter au moins deux options de réponses.");
  }
};

const isCurrentFormValid = computed(() => {
  return Object.values(currentPreviewPerceptionFormData).every((value) => value.id.trim() !== "");
});

const showForm = computed(() => {
  return globalFormPerceptionData.value.length > 0;
});

onBeforeUnmount(() => {
  clearUniqueKeys();
});

onMounted(() => {
  if (route.query.tab) currentTab.value = Number(route.query.tab);
  if (globalData && previewData) {
    globalFormPerceptionData.value = JSON.parse(globalData);
    previewFormPerceptionData.value = JSON.parse(previewData);
    // previewOptionResponsesModel.value = JSON.parse(localStorage.getItem("previewOptionResponsesModel"));
    // globalOptionResponses.value = JSON.parse(localStorage.getItem("globalOptionResponses"));
  }
  updateAllTypesGouvernance();
});
</script>

<template>
  <div class="flex w-full gap-2">
    <section class="w-[30%] h-screen pr-1 overflow-y-auto border-r-2 pt-5">
      <AccordionGroup :selectedIndex="indexAccordion" class="space-y-1">
        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Options de réponses</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <OptionsResponse :reset-to="resetOptions" v-model:previewOptionResponses="previewOptionResponses" v-model:globalOptionResponses="globalOptionResponses" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Questions opérationnelles</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <QuestionsOperationnel :to-reset="resetCurrentForm" :is-available="isAvailable.indicateur" @selected="getQuestion" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Principe de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <PrincipeGouvernance :to-reset="resetCurrentForm" :is-available="isAvailable.principe" @selected="getPrincipe" />
          </AccordionPanel>
        </AccordionItem>
      </AccordionGroup>
    </section>

    <section class="w-[70%] pt-5">
      <TabGroup :selectedIndex="currentTab">
        <TabList class="nav-boxed-tabs">
          <Tab @click="currentTab = tab.key" v-for="(tab, indexTab) in tabs" :key="indexTab" class="w-full py-2" tag="button">{{ tab.label }}</Tab>
        </TabList>
        <TabPanels class="mt-5">
          <TabPanel class="leading-relaxed">
            <div v-if="currentPreviewPerceptionFormData.indicateur.nom !== ''" class="flex items-end justify-end"><button @click="showDeleteForm = true" class="btn btn-outline-danger">Supprimer le formulaire</button></div>
            <div class="flex flex-col gap-8">
              <div class="space-y-2">
                <p class="text-lg font-medium">Liste des options de réponses</p>
                <ListOptionsResponse :options="previewOptionResponses.options_de_reponse" />
              </div>
              <div class="space-y-2">
                <p class="text-lg font-medium">Ajouter des questions opérationnelles</p>

                <PerceptionStructureMultiple :principe="currentPreviewPerceptionFormData.principe.nom" :indicateurArray="currentPreviewPerceptionFormDataArray.length > 0 ? currentPreviewPerceptionFormDataArray : undefined" />
                <button :disabled="!isCurrentFormValid" @click="addNewIndicator" class="my-4 text-sm btn btn-primary"><PlusIcon class="mr-1 size-4" />Ajouter</button>
              </div>
              <div class="space-y-2">
                <p class="text-lg font-medium">Liste des questions opérationnelles</p>
                <div class="max-h-[25vh] h-[25vh] py-2 border-t overflow-y-auto">
                  <ListAccordionQuestion :indicateurs-array="previewFormPerceptionData" @remove="removeIndicator" />
                </div>
                <div class="flex justify-start py-2">
                  <button :disabled="!showForm" @click="previewForm" class="px-5 text-base btn btn-primary"><CheckIcon class="mr-1 size-5" />Prévisualiser le formumlaire</button>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel class="">
            <ListFormPerception :fetch-data="fetchListForms" />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </section>
  </div>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" size="modal-xl" :show="modalForm" @hidden="modalForm = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Enregistrer le formulaire</h2>
    </ModalHeader>
    <form @submit.prevent="createForm">
      <ModalBody class="space-y-5">
        <div class="flex gap-4">
          <InputForm label="Libellé" class="w-full" :control="getFieldErrors(errors.libelle)" v-model="payload.libelle" />
          <div class="w-full">
            <label for="annee" class="form-label">Année<span class="text-danger">*</span> </label>
            <TomSelect v-model="payload.annee_exercice" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option v-for="(year, index) in yearsStore.getYears" :key="index" :value="year">{{ year }}</option>
            </TomSelect>
            <!-- <input id="annee" type="number" required v-model.number="payload.annee_exercice" class="form-control" placeholder="Année" /> -->
            <div v-if="errors.annee_exercice" class="mt-2 text-danger">{{ getFieldErrors(errors.annee_exercice) }}</div>
          </div>
        </div>
        <div>
          <p class="mb-3">Options de réponses</p>
          <ListOptionsResponse :options="previewOptionResponses.options_de_reponse" />
        </div>
        <div class="max-h-[50vh] h-[50vh] overflow-y-auto">
          <p class="mb-3">Formulaire de perception</p>
          <PreviewPerceptionForm :principes="previewPrincipesGouvernance.principes_de_gouvernance" />
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetErrors" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoadingForm" label="Enregistrer" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- END: Modal Content -->
  <!-- Modal for deleting -->
  <Modal :show="showDeleteForm" @hidden="showDeleteForm = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-2 text-slate-500">Netoyer le formulaire?</div>
      </div>
      <div class="flex justify-center gap-3 py-4">
        <button type="button" @click="showDeleteForm = false" class="btn btn-outline-secondary">Annuler</button>
        <DeleteButton @click="resetAllFormWithDataLocalStorage" />
      </div>
    </ModalBody>
  </Modal>
</template>

<style>
.accordion .accordion-item .accordion-header .accordion-button:not(.collapsed) {
  background: rgb(var(--color-primary)) !important;
}

.accordion .accordion-item:first-child {
  margin-top: 0 !important;
}

.Toastify__toast-container {
  z-index: 200000 !important;
}
</style>
