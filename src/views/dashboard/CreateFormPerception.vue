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
import { useRoute, useRouter } from "vue-router";
import { getFieldErrors } from "../../utils/helpers";
import { useYearsStore } from "@/stores/years";

const yearsStore = useYearsStore();

const route = useRoute();
const router = useRouter();
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
  principe: { id: "", nom: "", position: 0 },
  indicateur: { id: "", nom: "", position: 0},
  key: "",
});

const currentGlobalPerceptionFormData = reactive({
  principe: "",
  indicateur: "",
  key: ""
});

const currentGlobalPerceptionFormData2 = reactive({
  principe: { id: "", position: 0 },
  indicateur: { id: "", position: 0 },
  key: ""
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
      
      //principe.questions_operationnelle.push({indicateur: submission.indicateur, position: submission.key});
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
      principe = { id: submission.principe.id, nom: submission.principe.nom, position: submission.principe.position, questions_operationnelle: [] };
      organisedData.principes_de_gouvernance.push(principe);
    }

    // Trouver ou créer l'indicateur de gouvernance
    let indicateur = principe.questions_operationnelle.find((i) => i.id === submission.indicateur.id);
    if (!indicateur) {
      indicateur = { id: submission.indicateur.id, nom: submission.indicateur.nom, position: submission.indicateur.position, key: submission.key };
      principe.questions_operationnelle.push(indicateur);
    }
  });

  return organisedData;
};

const resetCurrentPreviewPerceptionFormData = () => {
  /* for (const key in currentPreviewPerceptionFormData) {
    currentPreviewPerceptionFormData[key] = { id: "", nom: "" , position: 0 };
  } */

  currentPreviewPerceptionFormData.principe = { id: "", nom: "" , position: 0 };
  currentPreviewPerceptionFormData.indicateur = { id: "", nom: "" , position: 0 };
  currentPreviewPerceptionFormData.key = "";

  currentPreviewPerceptionFormDataArray.value = [];

  console.log(currentPreviewPerceptionFormData);
  console.log(currentPreviewPerceptionFormDataArray.value);
};

const resetCurrentGlobalPerceptionFormData = () => {
  Object.keys(currentGlobalPerceptionFormData).forEach((key) => {
    currentGlobalPerceptionFormData[key] = "";
  });

  currentGlobalPerceptionFormDataArray.value = [];
};
const resetAllForm = () => {
  resetCurrentGlobalPerceptionFormData();
  resetCurrentPreviewPerceptionFormData();
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

  const counter = new Set(
    (globalFormPerceptionData.value || [])
      .map(item => item.principe)
      .filter(val => val !== null && val !== undefined && val !== "")
  ).size;

  currentGlobalPerceptionFormDataArray.value.forEach((item) => {
    item.principe = currentGlobalPerceptionFormData.principe;
    item.key = item?.indicateur + item.principe;
    item.position = counter + 1;
  });

  currentPreviewPerceptionFormData.principe = { id: principe.id, nom: principe.nom, position: counter + 1};

  currentPreviewPerceptionFormDataArray.value.forEach((item2, index) => {
    item2.principe = currentPreviewPerceptionFormData.principe;
    item2.key = item2?.indicateur?.id + item2.principe.id;
  });
};

const currentGlobalPerceptionFormDataArray = ref([]);
const currentPreviewPerceptionFormDataArray = ref([]);

const getQuestion = (question) => {
  console.log("question", question);
  // changeIndexAccordion(2);
  currentGlobalPerceptionFormData.indicateur = question.id;

  const key = currentGlobalPerceptionFormData?.principe != "" ? question.id + currentGlobalPerceptionFormData?.principe : currentGlobalPerceptionFormData?.indicateur;

  let form = {
    key: key,
    principe: currentGlobalPerceptionFormData?.principe,
    indicateur: question.id,
    position: currentGlobalPerceptionFormDataArray.value.length + 1
  };

  currentGlobalPerceptionFormDataArray.value.push(form);

  console.log("currentGlobalPerceptionFormDataArray.value", currentGlobalPerceptionFormDataArray.value);

  currentPreviewPerceptionFormData.indicateur = { id: question.id, nom: question.nom, position: 1 };

  let form2 = {
    key: key,
    principe: currentPreviewPerceptionFormData.principe ?? {
      id: "",
      nom: "",
      position: 0
    },
    indicateur: {
      id: question.id,
      nom: question.nom,
      position: currentPreviewPerceptionFormDataArray.value.length + 1
    },
  };

  currentPreviewPerceptionFormDataArray.value.push(form2);

  console.log("currentPreviewPerceptionFormDataArray.value", currentPreviewPerceptionFormDataArray.value);
};

const addNewIndicator = () => {
  console.log("currentGlobalPerceptionFormDataArray.value", currentGlobalPerceptionFormDataArray.value);

  console.log("currentPreviewPerceptionFormDataArray.value", currentPreviewPerceptionFormDataArray.value);

  currentGlobalPerceptionFormDataArray.value.forEach((item, index) => {
    const key = generateKey(item.indicateur + item.principe);

    if (!uniqueKeys.has(key)) {
      globalFormPerceptionData.value.unshift({ ...item });

      previewFormPerceptionData.value.unshift(JSON.parse(JSON.stringify(currentPreviewPerceptionFormDataArray.value[index])));

      console.log("previewFormPerceptionData.value", previewFormPerceptionData.value);
      uniqueKeys.set(key, true);
      localStorage.setItem("globalFormPerceptionData", JSON.stringify(globalFormPerceptionData.value));
      localStorage.setItem("previewFormPerceptionData", JSON.stringify(previewFormPerceptionData.value));

      updateAllTypesGouvernance();

      if (index === currentGlobalPerceptionFormDataArray.value.length - 1) {
        resetCurrentPreviewPerceptionFormData();
        resetCurrentGlobalPerceptionFormData();
        resetCurrentForm.value = !resetCurrentForm.value;
      }

      toast.success("Indicateur ajouté.");
    } else {
      toast.info("Indicateur exisant.");
    }
  });
};

const removeIndicator = (key) => {
  //const key = generateKey(indicateur.id);
  // Trouver l'index de la soumission à supprimer
  //const index = globalFormPerceptionData.value.findIndex((s) => s.indicateur === indicateur.id);
  const index = globalFormPerceptionData.value.findIndex((s) => s.key === key);
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

  updateAllTypesGouvernance();
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
  return Object.values(currentPreviewPerceptionFormData).every((value) => {
    if (typeof value === "object" && value !== null && "id" in value) {
      return value.id.trim() !== "";
    }
    return true; // skip non-object or irrelevant values like "key"
  });
});

const showForm = computed(() => {
  return globalFormPerceptionData.value.length > 0;
});

const goBackToFormList = function () {
  resetAllFormWithDataLocalStorage();
  router.push({ name: "Ajouter_un_formulaire_Perception" });
};

const comeBackToCreation = function () {
  router.push({ name: "Ajouter_un_formulaire_Perception" });
};


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
            <OptionsResponse :reset-to="resetOptions" v-model:previewOptionResponses="previewOptionResponses"
              v-model:globalOptionResponses="globalOptionResponses" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Questions opérationnelles</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <QuestionsOperationnel :to-reset="resetCurrentForm" :is-available="isAvailable.indicateur"
              @selected="getQuestion" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Principe de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <PrincipeGouvernance :to-reset="resetCurrentForm" :is-available="isAvailable.principe"
              @selected="getPrincipe" />
          </AccordionPanel>
        </AccordionItem>
      </AccordionGroup>
    </section>

    <section class="w-[70%] pt-5">
      <TabGroup :selectedIndex="currentTab">
        <TabList class="nav-boxed-tabs">
          <Tab @click="currentTab = tab.key" v-for="(tab, indexTab) in tabs" :key="indexTab" class="w-full py-2"
            tag="button">{{ tab.label }}</Tab>
        </TabList>
        <TabPanels class="mt-5">
          <TabPanel class="leading-relaxed">
            <div v-if="currentPreviewPerceptionFormData.indicateur.nom !== ''" class="flex items-end justify-end">
              <button @click="showDeleteForm = true" class="btn btn-outline-danger">Supprimer le formulaire</button>
            </div>
            <div class="flex flex-col gap-8">
              <div class="space-y-2">
                <p class="text-lg font-medium">Liste des options de réponses</p>
                <ListOptionsResponse :options="previewOptionResponses.options_de_reponse" />
              </div>
              <div class="space-y-2">
                <p class="text-lg font-medium">Ajouter des questions opérationnelles</p>

                <PerceptionStructureMultiple :principe="currentPreviewPerceptionFormData.principe.nom"
                  :indicateurArray="currentPreviewPerceptionFormDataArray.length > 0 ? currentPreviewPerceptionFormDataArray : undefined" />
                <button :disabled="!isCurrentFormValid" @click="addNewIndicator" class="my-4 text-sm btn btn-primary">
                  <PlusIcon class="mr-1 size-4" />Ajouter
                </button>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between items-center py-2">
                  <p class="text-lg font-medium">Constitution du Formulaire </p>
                  
                  <div class="flex justify-spacely py-2"  v-if="previewPrincipesGouvernance?.principes_de_gouvernance?.length">
                    <button :disabled="!showForm" @click="previewForm" class="mr-5 px-5 text-base btn btn-primary">
                      <CheckIcon class="mr-1 size-5" />Enregistrer
                    </button>
                    <button :disabled="!showForm" @click="previewForm" class="px-5 text-base btn btn-primary">
                      <EyeIcon class="mr-1 size-5" />Voir le formumlaire
                    </button>
                  </div>
                </div>
                <div class="max-h-[75vh] py-2 border-t overflow-y-auto mb-10 mt-2">
                  <table class="w-full border-collapse table-auto border-slate-500" cellpadding="10"
                    cellspacing="0">
                    <thead class="text-white bg-blue-900">
                      <!-- First header row -->
                      <tr>
                        <th class="py-3 border border-slate-900">Principes</th>
                        <th class="py-3 border border-slate-900">Indicateurs</th>
                        <th class="py-3 border border-slate-900 max-w-[200px]">Actions</th>
                      </tr>
                    </thead>

                    <tbody v-if="previewPrincipesGouvernance?.principes_de_gouvernance?.length">
                      <template v-for="principe_de_gouvernance in [...previewPrincipesGouvernance.principes_de_gouvernance].reverse()"
                        :key="principe_de_gouvernance.id">
                        <template
                          v-for="(question_operationnelle, qIndex) in [...principe_de_gouvernance.questions_operationnelle].reverse()"
                          :key="question_operationnelle.id">
                          <tr>
                            <td class="font-semibold" v-if="qIndex === 0"
                              :rowspan="principe_de_gouvernance.questions_operationnelle.length">
                              {{ principe_de_gouvernance.position }} - {{ principe_de_gouvernance.nom }}
                            </td>

                            <td>
                              {{ question_operationnelle.position }} - {{ question_operationnelle.nom }}
                            </td>

                            <td>
                              <div class="flex items-center">
                                <button class="p-1.5 text-primary">
                                  <Edit3Icon class="size-5" />
                                </button>
                                <button class="p-1.5 text-danger" @click="removeIndicator(question_operationnelle.key)">
                                  <TrashIcon class="size-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        </template>
                      </template>
                    </tbody>
                    <tbody v-else>
                      <tr class="bg-transparent text-center">
                        <td colspan="3" class="font-semibold">Constituer le formulaire de perception</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- <div class="max-h-[25vh] h-[25vh] py-2 border-t overflow-y-auto">
                  <ListAccordionQuestion :indicateurs-array="previewFormPerceptionData" @remove="removeIndicator" />
                </div> -->
                <div class="flex justify-between py-2 my-2 items-center">
                  <button @click="goBackToFormList" class="px-5 text-base btn btn-danger"><ArrowLeftIcon class="mr-1 size-5" />Annuler la creation</button>
                  <button @click="comeBackToCreation" class="px-5 text-base btn btn-primary"><RotateCcwIcon class="mr-1 size-5" />Revenir pour continuer la creation</button>
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

  <div v-if="!isLoadingForm && previewPrincipesGouvernance?.principes_de_gouvernance?.length" class="w-full my-10">
    <p class="text-lg font-medium">Prévisualisation du formulaire de perception</p>

    <table class="w-full mt-5 border-collapse table-auto border-slate-500" cellpadding="10" cellspacing="0">
      <thead class="text-white bg-blue-900">
        <!-- First header row -->
        <tr>
          <th :rowspan="2" class="py-3 border border-slate-900">Principes</th>
          <th :rowspan="2" class="py-3 border border-slate-900">Indicateurs</th>
          <th :colspan="previewOptionResponses.options_de_reponse.length"
            class="py-3 border border-slate-900 text-center">
            Réponses
          </th>
        </tr>
        <!-- Second header row -->
        <tr>
          <template v-for="(option_de_reponse, idx) in previewOptionResponses.options_de_reponse"
            :key="option_de_reponse.id">
            <th class="py-3 border border-slate-900 text-center">{{ option_de_reponse.libelle }}</th>
          </template>
        </tr>
      </thead>

      <tbody>
        <template v-for="principe_de_gouvernance in previewPrincipesGouvernance.principes_de_gouvernance"
          :key="principe_de_gouvernance.id">
          <template v-for="(question_operationnelle, qIndex) in principe_de_gouvernance.questions_operationnelle"
            :key="question_operationnelle.id">
            <tr>
              <td class="font-semibold" v-if="qIndex === 0"
                :rowspan="principe_de_gouvernance.questions_operationnelle.length">
                {{ principe_de_gouvernance.nom }}
              </td>

              <td>
                {{ question_operationnelle.nom }}
              </td>

              <template v-for="(option_de_reponse, optionIdx) in previewOptionResponses.options_de_reponse"
                :key="option_de_reponse.id">
                <td class="border border-slate-900 text-center">
                  {{ }}
                </td>
              </template>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
  <!-- BEGIN: Modal Content -->
  <!-- size="modal-xl"  -->
  <Modal backdrop="static" :show="modalForm" @hidden="modalForm = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Enregistrer le formulaire</h2>
    </ModalHeader>
    <form @submit.prevent="createForm">
      <ModalBody class="space-y-5">
       <!--  <div class="flex gap-4"></div> -->
        <div class="gap-4">
          <InputForm label="Libellé" class="w-full mb-4" :control="getFieldErrors(errors.libelle)"
            v-model="payload.libelle" />
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
        </div><!-- 
        <div class="max-h-[50vh] h-[50vh] overflow-y-auto">
          <p class="mb-3">Formulaire de perception</p>
          <PreviewPerceptionForm :principes="previewPrincipesGouvernance.principes_de_gouvernance" />
        </div> -->
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetErrors"
            class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
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
