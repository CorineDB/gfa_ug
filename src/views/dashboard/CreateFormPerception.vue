<script setup>
import { onBeforeUnmount, reactive, ref, computed, onMounted, watch } from "vue";
import { toast } from "vue3-toastify";
import PrincipeGouvernance from "@/components/create-form/PrincipeGouvernance.vue";
import PerceptionStructureMultiple from "@/components/create-form/PerceptionStructureMultiple.vue";

//import OptionsResponse from "@/components/create-form/OptionsResponse.vue";
import OptionsResponsePerception from "@/components/create-form/OptionsResponsePerception.vue";
import PrincipeDeGouvernancPerception from "@/components/create-form/PrincipeDeGouvernancPerception.vue";

import QuestionsOperationnel from "@/components/create-form/QuestionsOperationnel.vue";

import ListAccordionQuestion from "@/components/create-form/ListAccordionQuestion.vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
//import FormulaireFactuel from "@/services/modules/formFactuel.service";
import FormulaireDePerception from "@/services/modules/enquetes_de_gouvernance/formPerception.service";
import PreviewPerceptionForm from "@/components/create-form/PreviewPerceptionForm.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import ListFormPerception from "@/components/create-form/ListFormPerception.vue";
import ListOptionsResponse from "@/components/create-form/ListOptionsResponse.vue";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { useRoute, useRouter } from "vue-router";
import { getFieldErrors } from "../../utils/helpers";
import { useYearsStore } from "@/stores/years";
import AuthService from "@/services/modules/auth.service";

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

const canEditQuestion = ref([]);
const canEditPrincipe = ref([]);

const debutProgramme = ref("");
const finProgramme = ref("");

const annees = computed(() => {
  let anneeDebut = parseInt(debutProgramme.value.split("-")[0], 10);
  let anneeFin = parseInt(finProgramme.value.split("-")[0], 10);
  let annees = [];
  for (let annee = anneeDebut; annee <= anneeFin; annee++) {
    annees.push(annee);
  }
  return annees;
});

const getcurrentUser = async () => {
  await AuthService.getCurrentUser()
    .then((result) => {
      // responsablesForm.value.ug = result.data.data.profil.id;
      // ugs.value.push({ id: result.data.data.profil.id, nom: result.data.data.profil.nom });
      // idProgramme.value = result.data.data.programme.id;
      debutProgramme.value = result.data.data.programme.debut;
      finProgramme.value = result.data.data.programme.fin;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Utilisateur connecté .");
    });
};

const previewFormulaire = ref(false);

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
  indicateur: { id: "", nom: "", position: 0 },
  key: "",
});

const currentGlobalPerceptionFormData = reactive({
  principe: "",
  indicateur: "",
  key: "",
});

const currentGlobalPerceptionFormData2 = reactive({
  principe: { id: "", position: 0 },
  indicateur: { id: "", position: 0 },
  key: "",
});

const resetErrors = () => {
  modalForm.value = false;
  errors.value = {};
};

// Fonction pour générer une clé unique pour chaque soumission
const generateKey = (id) => {
  return `${id}`;
};

const currentGlobalPerceptionFormDataArray = ref([]);
const currentPreviewPerceptionFormDataArray = ref([]);

const organiseGlobalFormPerceptionData = (submissions) => {
  // const organisedData = { principes_de_gouvernance: [] };

  submissions.forEach((submission) => {
    // Trouver ou créer le principe de gouvernance
    //let principe = principesGouvernance.value.principes_de_gouvernance.find((p) => p.id === submission.principe.id);

    let principe = principesGouvernance.value.principes_de_gouvernance.find((p) => p.id === submission.principe.id);
    if (!principe) {
      //principe = { id: submission.principe, questions_operationnelle: [] };
      principe = { id: submission.principe.id, position: submission.principe.position, questions_operationnelle: [] };
      principesGouvernance.value.principes_de_gouvernance.push(principe);
    }

    // Ajouter l'indicateur de gouvernance s'il n'est pas déjà présent
    //if (!principe.questions_operationnelle.includes(submission.indicateur)) {

    let indicateur = principe.questions_operationnelle.find((i) => i.id === submission.indicateur.id);
    if (!indicateur) {
      principe.questions_operationnelle.push({ id: submission.indicateur.id, position: submission.indicateur.position });
      //principe.questions_operationnelle.push(submission.indicateur);
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

  currentPreviewPerceptionFormData.principe = { id: "", nom: "", position: 0 };
  currentPreviewPerceptionFormData.indicateur = { id: "", nom: "", position: 0 };
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
  //globalPrincipesGouvernance.value = organiseGlobalFormPerceptionData(globalFormPerceptionData.value);
  globalPrincipesGouvernance.value = organiseGlobalFormPerceptionData(previewFormPerceptionData.value);
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

  const counter = new Set((globalFormPerceptionData.value || []).map((item) => item.principe).filter((val) => val !== null && val !== undefined && val !== "")).size;

  currentGlobalPerceptionFormDataArray.value.forEach((item) => {
    item.principe = currentGlobalPerceptionFormData.principe;
    item.key = item?.indicateur + item.principe;
    item.position = counter + 1;
  });

  currentPreviewPerceptionFormData.principe = { id: principe.id, nom: principe.nom, position: counter + 1 };

  currentPreviewPerceptionFormDataArray.value.forEach((item2, index) => {
    item2.principe = currentPreviewPerceptionFormData.principe;
    item2.key = item2?.indicateur?.id + item2.principe.id;
  });
};

const getQuestion = (question) => {
  //console.log("question", question);
  // changeIndexAccordion(3);
  currentGlobalPerceptionFormData.indicateur = question.id;

  const key = currentGlobalPerceptionFormData?.principe != "" ? question.id + currentGlobalPerceptionFormData?.principe : currentGlobalPerceptionFormData?.indicateur;

  let form = {
    key: key,
    principe: currentGlobalPerceptionFormData?.principe,
    indicateur: question.id,
    position: currentGlobalPerceptionFormDataArray.value.length + 1,
  };

  currentGlobalPerceptionFormDataArray.value.push(form);

  console.log("currentGlobalPerceptionFormDataArray.value", currentGlobalPerceptionFormDataArray.value);

  currentPreviewPerceptionFormData.indicateur = { id: question.id, nom: question.nom, position: 1 };

  let form2 = {
    key: key,
    principe: currentPreviewPerceptionFormData.principe ?? {
      id: "",
      nom: "",
      position: 0,
    },
    indicateur: {
      id: question.id,
      nom: question.nom,
      position: currentPreviewPerceptionFormDataArray.value.length + 1,
    },
  };

  currentPreviewPerceptionFormDataArray.value.push(form2);

  currentPreviewPerceptionFormDataArray.value.sort((a, b) => {
    return a.principe.position - b.principe.position || a.indicateur.position - b.indicateur.position;
  });

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

      uniqueKeys.set(key, true);

      // ✅ Sort after unshift
      globalFormPerceptionData.value.sort((a, b) => a.position ?? 0 - b.position ?? 0);
      //previewFormPerceptionData.value.sort((a, b) => a.position ?? 0 - b.position ?? 0)

      previewFormPerceptionData.value.sort((a, b) => {
        return a.principe.position - b.principe.position || a.indicateur.position - b.indicateur.position;
      });

      localStorage.setItem("globalFormPerceptionData", JSON.stringify(globalFormPerceptionData.value));
      localStorage.setItem("previewFormPerceptionData", JSON.stringify(previewFormPerceptionData.value));

      updateAllTypesGouvernance();

      if (index === currentGlobalPerceptionFormDataArray.value.length - 1) {
        resetCurrentPreviewPerceptionFormData();
        resetCurrentGlobalPerceptionFormData();
        resetCurrentForm.value = !resetCurrentForm.value;
      }

      toast.success("Question operationnelle ajouté.");
    } else {
      toast.info("Question operationnelle deja ajouté.");
    }
  });
};

const removeElement = (key) => {
  key = globalFormPerceptionData.value.find((s) => s.key === key);
  if (key) {
    key = key["principe"];
    // Remove from globalFormPerceptionData
    for (let i = globalFormPerceptionData.value.length - 1; i >= 0; i--) {
      if (globalFormPerceptionData.value[i]["principe"] === key) {
        globalFormPerceptionData.value.splice(i, 1);

        // Remove key from unique se
        if (uniqueKeys.has(globalFormPerceptionData.value[i]?.["key"])) {
          uniqueKeys.delete(globalFormPerceptionData.value[i]["key"]);
        }
      }
    }

    // ✅ Sort after unshift
    globalFormPerceptionData.value.sort((a, b) => a.position ?? 0 - b.position ?? 0);

    // Remove from previewFormPerceptionData
    for (let i = previewFormPerceptionData.value.length - 1; i >= 0; i--) {
      if (previewFormPerceptionData.value[i]["principe"]["id"] === key) {
        previewFormPerceptionData.value.splice(i, 1);
      }
    }

    previewFormPerceptionData.value.sort((a, b) => {
      return a.principe.position - b.principe.position || a.indicateur.position - b.indicateur.position;
    });

    // Recalculate and update
    updateAllTypesGouvernance();

    // Persist to localStorage
    localStorage.setItem("globalFormPerceptionData", JSON.stringify(globalFormPerceptionData.value));
    localStorage.setItem("previewFormPerceptionData", JSON.stringify(previewFormPerceptionData.value));

    toast.success("Principe supprimé.");
  } else {
    Object.keys(currentGlobalPerceptionFormData).forEach((key) => {
      currentGlobalPerceptionFormData[key] = "";
    });

    currentPreviewPerceptionFormData.principe = { id: "", nom: "", position: 0 };
    currentPreviewPerceptionFormData.indicateur = { id: "", nom: "", position: 0 };
    currentPreviewPerceptionFormData.key = "";
  }
};

const updateTemporyPrincipe = (id, position, isCurrent = false) => {
  if (isCurrent == false) {
    // Update position from previewFormPerceptionData
    previewFormPerceptionData.value = previewFormPerceptionData.value
      .map((item) => {
        if (item.principe.id == id) {
          item.principe.position = position;
        }
        return item;
      })
      .sort((a, b) => {
        return a.principe.position - b.principe.position || a.indicateur.position - b.indicateur.position;
      });

    // Recalculate and update
    updateAllTypesGouvernance();

    // Persist to localStorage
    localStorage.setItem("globalFormPerceptionData", JSON.stringify(globalFormPerceptionData.value));
    localStorage.setItem("previewFormPerceptionData", JSON.stringify(previewFormPerceptionData.value));
  } else {
    currentPreviewPerceptionFormData.principe.position = position;

    currentPreviewPerceptionFormDataArray.value = currentPreviewPerceptionFormDataArray.value
      .map((item) => {
        if (item.principe.id == id) {
          item.principe.position = position;
        }
        return item;
      })
      .sort((a, b) => {
        return a.principe.position - b.principe.position || a.indicateur.position - b.indicateur.position;
      });
  }
};

const updateTemporyQuestions = (key, position, isCurrent = false) => {
  if (!isCurrent) {
    previewFormPerceptionData.value = previewFormPerceptionData.value
      .map((item) => {
        if (item.key == key) {
          item.indicateur.position = position;
        }
        return item;
      })
      .sort((a, b) => {
        return a.principe.position - b.principe.position || a.indicateur.position - b.indicateur.position;
      });

    globalFormPerceptionData.value = globalFormPerceptionData.value
      .map((item) => {
        if (item.key == key) {
          item.position = position;
        }
        return item;
      })
      .sort((a, b) => {
        return a.position - b.position;
      });

    updateAllTypesGouvernance();

    localStorage.setItem("globalFormPerceptionData", JSON.stringify(globalFormPerceptionData.value));
    localStorage.setItem("previewFormPerceptionData", JSON.stringify(previewFormPerceptionData.value));

    toast.success("Question operationnelle update.");
  } else {
    currentPreviewPerceptionFormDataArray.value = currentPreviewPerceptionFormDataArray.value
      .map((item) => {
        if (item.key == key) {
          item.indicateur.position = position;
        }
        return item;
      })
      .sort((a, b) => {
        return a.principe.position - b.principe.position || a.indicateur.position - b.indicateur.position;
      });

    currentGlobalPerceptionFormDataArray.value = currentGlobalPerceptionFormDataArray.value
      .map((item) => {
        if (item.key == key) {
          item.position = position;
        }
        return item;
      })
      .sort((a, b) => {
        return a.position - b.position;
      });
  }
};

const removeIndicator = (key) => {
  const index = globalFormPerceptionData.value.findIndex((s) => s.key === key);

  if (index !== -1) {
    globalFormPerceptionData.value.splice(index, 1);
    previewFormPerceptionData.value.splice(index, 1);
    uniqueKeys.delete(key);

    // ✅ Sort after unshift
    globalFormPerceptionData.value.sort((a, b) => a.position ?? 0 - b.position ?? 0);

    previewFormPerceptionData.value.sort((a, b) => {
      return a.principe.position - b.principe.position || a.indicateur.position - b.indicateur.position;
    });

    updateAllTypesGouvernance();
    localStorage.setItem("globalFormPerceptionData", JSON.stringify(globalFormPerceptionData.value));
    localStorage.setItem("previewFormPerceptionData", JSON.stringify(previewFormPerceptionData.value));

    toast.success("Question operationnelle supprimé.");
  } else {
    const indice = currentPreviewPerceptionFormDataArray.value.findIndex((s) => s.key === key);

    if (indice !== -1) {
      currentGlobalPerceptionFormDataArray.value.splice(indice, 1);
      currentPreviewPerceptionFormDataArray.value.splice(indice, 1);
      uniqueKeys.delete(key);

      // ✅ Sort after unshift
      currentGlobalPerceptionFormDataArray.value.sort((a, b) => a.position ?? 0 - b.position ?? 0);

      currentPreviewPerceptionFormDataArray.value.sort((a, b) => {
        return a.principe.position - b.principe.position || a.indicateur.position - b.indicateur.position;
      });

      toast.success("Supprimé.");
    }
  }
};

function editPrincipe(id) {
  canEditPrincipe.value[id] = true;
}

// Handle edit action
const handleEdit = (key) => {
  canEditQuestion.value[key] = true;
};

function editTemporyPrincipe(id, position) {
  updateTemporyPrincipe(id, position, false);
  canEditPrincipe.value[id] = false;
}

function editTemporyQuestion(key, position) {
  updateTemporyQuestions(key, position, false);
  canEditQuestion.value[key] = false;
}

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
    await FormulaireDePerception.create(payload);
    toast.success(`Formulaire créé avec succès.`);
    fetchListForms.value = !fetchListForms.value;
    // resetForm();
    resetAllFormWithDataLocalStorage();
    clearUniqueKeys();
    errors.value = {};
    modalForm.value = false;
    router.push({ name: "Ajouter_un_formulaire_Perception", query: { tab: 1 } });
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
  router.push({ name: "Ajouter_un_formulaire_Perception", query: { tab: 1 } });
};

const comeBackToCreation = function () {
  router.push({ name: "Ajouter_un_formulaire_Perception", query: { tab: 1 } });
};

const selectTab = function (tab) {
  currentTab.value = tab;
  if (tab) {
    router.push({ name: "Ajouter_un_formulaire_Perception", query: { tab: tab } });
  } else {
    router.push({ name: "Ajouter_un_formulaire_Perception" });
  }
};

watch(() => {
  console.log(route.query.tab);
  console.log(currentTab.value);
  if (route.query.tab) {
    currentTab.value = Number(route.query.tab);
  } else {
    currentTab.value = 0;
  }
  console.log(currentTab.value);
});

onBeforeUnmount(() => {
  clearUniqueKeys();
  resetAllFormWithDataLocalStorage();
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
  getcurrentUser();
});
</script>

<template>
  <div class="flex w-full gap-2">
    <section v-if="!currentTab" class="max-h-[50%] pr-1 overflow-y-auto border-r-2 pt-5" :class="currentTab ? 'w-0' : 'w-[30%]'">
      <AccordionGroup :selectedIndex="indexAccordion" class="space-y-1">
        

        <AccordionItem>
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Principes de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <PrincipeDeGouvernancPerception :to-reset="resetCurrentForm" :is-available="isAvailable.principe" @selected="getPrincipe" />
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

        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Options de réponses</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <OptionsResponsePerception :reset-to="resetOptions" v-model:previewOptionResponses="previewOptionResponses" v-model:globalOptionResponses="globalOptionResponses" />
          </AccordionPanel>
        </AccordionItem>
      </AccordionGroup>
    </section>

    <section class="w-[70%] max-h-[50%] pt-5" :class="{ 'w-full': currentTab }">
      <TabGroup :selectedIndex="currentTab">
        <TabList class="nav-boxed-tabs">
          <Tab @click="selectTab(tab.key)" v-for="(tab, indexTab) in tabs" :key="indexTab" class="w-full py-2" tag="button">{{ tab.label }}</Tab>
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

                <PerceptionStructureMultiple @deleteQuestion="removeIndicator" @deletePrincipe="removeElement" @editPositionPrincipe="updateTemporyPrincipe" @editPositionQuestion="updateTemporyQuestions" :principe="currentPreviewPerceptionFormData.principe" :indicateurArray="currentPreviewPerceptionFormDataArray.length > 0 ? currentPreviewPerceptionFormDataArray : undefined" />
                <button :disabled="!isCurrentFormValid" @click="addNewIndicator" class="my-4 text-sm btn btn-primary"><PlusIcon class="mr-1 size-4" />Ajouter</button>
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

  <div class="space-y-2 mt-6" v-if="!isLoadingForm && !currentTab">
    <div class="flex justify-between items-center py-2">
      <p class="text-lg font-medium">Previsualisation du formulaire de perception</p>
      <div class="flex justify-spacely py-2" v-if="previewPrincipesGouvernance?.principes_de_gouvernance?.length">
        <button :disabled="!showForm" @click="previewForm" class="mr-5 px-5 text-base btn btn-primary"><CheckIcon class="mr-1 size-5" />Enregistrer</button>
        <button :disabled="!showForm" @click="previewFormulaire = true" class="px-5 text-base btn btn-primary"><EyeIcon class="mr-1 size-5" />Voir le formumlaire</button>
      </div>
    </div>
    <div class="max-h-[75vh] py-2 border-t overflow-y-auto mb-10 mt-2">
      <table class="w-full border-collapse table-auto border-slate-500" cellpadding="10" cellspacing="0">
        <thead class="text-white bg-blue-900">
          <!-- First header row -->
          <tr>
            <th class="py-3 border border-slate-900">Principes</th>
            <th class="py-3 border border-slate-900">Questions opérationnelle</th>
            <th class="py-3 border border-slate-900 max-w-[200px]">Actions</th>
          </tr>
        </thead>

        <tbody v-if="previewPrincipesGouvernance?.principes_de_gouvernance?.length">
          <template v-for="principe_de_gouvernance in [...previewPrincipesGouvernance.principes_de_gouvernance]" :key="principe_de_gouvernance.id">
            <template v-for="(question_operationnelle, qIndex) in [...principe_de_gouvernance.questions_operationnelle]" :key="question_operationnelle.id">
              <tr>
                <td class="font-semibold list-data" v-if="qIndex === 0" :rowspan="principe_de_gouvernance.questions_operationnelle.length">
                  <div class="flex items-center gap-1">{{ principe_de_gouvernance.position }} - {{ principe_de_gouvernance.nom }}</div>

                  <div class="items-center transition-all opacity-0 container-buttons">
                    <div v-if="canEditPrincipe[principe_de_gouvernance.id]">
                      <input type="number" min="1" step="1" name="position" :value="principe_de_gouvernance.position" @keyup.enter="editTemporyPrincipe(principe_de_gouvernance.id, $event.target.value)" class="w-2/5 form-control" />
                    </div>
                    <div v-else>
                      <button class="p-1.5 text-primary">
                        <Edit3Icon class="size-5" @click="editPrincipe(principe_de_gouvernance.id)" />
                      </button>
                      <button class="p-1.5 text-danger" @click="removeElement(question_operationnelle.key, 'principe')">
                        <TrashIcon class="size-5" />
                      </button>
                    </div>
                  </div>
                </td>

                <td>{{ question_operationnelle.position }} - {{ question_operationnelle.nom }}</td>

                <td>
                  <div class="flex items-center">
                    <div v-if="canEditQuestion[question_operationnelle.key]">
                      <input type="number" min="1" step="1" name="position" :value="question_operationnelle.position" @keyup.enter="editTemporyQuestion(question_operationnelle.key, $event.target.value)" class="w-2/5 form-control" />
                    </div>
                    <div v-else>
                      <button class="p-1.5 text-primary">
                        <Edit3Icon class="size-5" @click="handleEdit(question_operationnelle.key)" />
                      </button>
                      <button class="p-1.5 text-danger" @click="removeIndicator(question_operationnelle.key)">
                        <TrashIcon class="size-5" />
                      </button>
                    </div>
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

    <div class="flex justify-between py-2 my-2 items-center">
      <div class="flex justify-between">
        <button @click="goBackToFormList" class="px-5 mr-4 text-base btn btn-danger"><ArrowLeftIcon class="mr-1 size-5" />Annuler la creation</button>
        <button @click="resetAllFormWithDataLocalStorage" class="px-5 btn btn-outline-danger text-base"><TrashIcon class="mr-1 size-5" />Vider</button>
      </div>

      <button @click="comeBackToCreation" class="px-5 text-base btn btn-primary"><RotateCcwIcon class="mr-1 size-5" />Revenir pour continuer la creation</button>
    </div>
  </div>

  <LoaderSnipper v-else />

  <Modal backdrop="static" :show="previewFormulaire" size="modal-xl" @hidden="previewFormulaire = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Formulaire de perception de gouvernance</h2>
    </ModalHeader>
    <ModalBody class="space-y-5">
      <table class="w-full border-collapse table-auto border-slate-500" border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; font-family: Arial, sans-serif">
        <tr>
          <td rowspan="3"><strong>Vous êtes :</strong></td>
          <td style="background-color: white; color: black">Membre du Conseil d'administration</td>
        </tr>
        <tr>
          <td>Membre de l'association</td>
        </tr>
        <tr>
          <td>Employé de l'association</td>
        </tr>

        <tr>
          <td rowspan="1"></td>
          <td>Partenaires</td>
        </tr>
      </table>

      <table class="w-full mt-5 border-collapse table-auto border-slate-500" cellpadding="10" cellspacing="0">
        <thead class="text-white bg-blue-900">
          <!-- First header row -->
          <tr>
            <th :rowspan="2" class="py-3 border border-slate-900">Principes</th>
            <th :rowspan="2" class="py-3 border border-slate-900">Questions opérationnelle</th>
            <th :colspan="previewOptionResponses.options_de_reponse.length" class="py-3 border border-slate-900 text-center">Réponses</th>
          </tr>
          <!-- Second header row -->
          <tr>
            <template v-for="(option_de_reponse, idx) in previewOptionResponses.options_de_reponse" :key="option_de_reponse.id">
              <th class="py-3 border border-slate-900 text-center">{{ option_de_reponse.libelle }}</th>
            </template>
          </tr>
        </thead>

        <tbody>
          <template v-for="principe_de_gouvernance in previewPrincipesGouvernance.principes_de_gouvernance" :key="principe_de_gouvernance.id">
            <template v-for="(question_operationnelle, qIndex) in principe_de_gouvernance.questions_operationnelle" :key="question_operationnelle.id">
              <tr>
                <td class="font-semibold" v-if="qIndex === 0" :rowspan="principe_de_gouvernance.questions_operationnelle.length">{{ principe_de_gouvernance.position }} - {{ principe_de_gouvernance.nom }}</td>

                <td>{{ question_operationnelle.position }} - {{ question_operationnelle.nom }}</td>

                <template v-for="(option_de_reponse, optionIdx) in previewOptionResponses.options_de_reponse" :key="option_de_reponse.id">
                  <td class="border border-slate-900 text-center">
                    {{}}
                  </td>
                </template>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </ModalBody>
    <ModalFooter>
      <div class="flex gap-2">
        <button type="button" @click="previewFormulaire = false" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Fermer</button>
        <button
          type="button"
          @click="
            previewFormulaire = false;
            previewForm();
          "
          class="w-full px-2 py-2 my-3 btn btn-primary"
        >
          Enregistrer
        </button>
      </div>
    </ModalFooter>
  </Modal>
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
          <InputForm label="Libellé" class="w-full mb-4" :control="getFieldErrors(errors.libelle)" v-model="payload.libelle" />
          <!-- <div class="w-full">
            <label for="annee" class="form-label">Année<span class="text-danger">*</span> </label>
            <TomSelect v-model="payload.annee_exercice" :options="{ placeholder: 'Selectionez une année' }"
              class="w-full">
              <option v-for="(year, index) in annees" :key="index" :value="year">{{ year }}</option>
            </TomSelect>
            <-- <input id="annee" type="number" required v-model.number="payload.annee_exercice" class="form-control" placeholder="Année" /> ->
            <div v-if="errors.annee_exercice" class="mt-2 text-danger">{{ getFieldErrors(errors.annee_exercice) }}</div>
          </div> -->
        </div>
        <div>
          <p class="mb-3">Options de réponses</p>
          <ListOptionsResponse :options="previewOptionResponses.options_de_reponse" />
        </div>
        <!-- 
        <div class="max-h-[50vh] h-[50vh] overflow-y-auto">
          <p class="mb-3">Formulaire de perception</p>
          <PreviewPerceptionForm :principes="previewPrincipesGouvernance.principes_de_gouvernance" />
        </div> -->
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
