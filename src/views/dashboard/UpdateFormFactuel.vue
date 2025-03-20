<script setup>
import { onBeforeUnmount, reactive, ref, computed, onMounted } from "vue";
import { toast } from "vue3-toastify";
import OptionsResponse from "@/components/create-form/OptionsResponse.vue";
import TypeGouvernance from "@/components/create-form/TypeGouvernance.vue";
import PrincipeGouvernance from "@/components/create-form/PrincipeGouvernance.vue";
import CritereGouvernance from "@/components/create-form/CritereGouvernance.vue";
import IndicateurGouvernance from "@/components/create-form/IndicateurGouvernance.vue";
import FactuelStructure from "@/components/create-form/FactuelStructure.vue";
import ListAccordionIndicateur from "@/components/create-form/ListAccordionIndicateur.vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import FormulaireFactuel from "@/services/modules/formFactuel.service";
import PreviewFactuelForm from "@/components/create-form/PreviewFactuelForm.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import ListFormFactuel from "@/components/create-form/ListFormFactuel.vue";
import ListOptionsResponse from "@/components/create-form/ListOptionsResponse.vue";
import DeleteButton from "@/components/news/DeleteButton.vue";

import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const idForm = route.params.id;
const currentTab = ref(0);
const indexAccordion = ref(0);
const resetCurrentForm = ref(false);
const modalForm = ref(false);
const isLoadingForm = ref(false);
const resetOptions = ref(false);
const fetchListForms = ref(false);
const showDeleteForm = ref(false);
const isLoadingOneForm = ref(false);
const previewFormFactuelData = ref([]);
const globalFormFactuelData = ref([]);
const previewTypesGouvernance = ref({});
const globalTypesGouvernance = ref({});
const currentForm = ref({});
const previewOptionResponses = ref({ options_de_reponse: [] });
const globalOptionResponses = ref({ options_de_reponse: [] });
const typesGouvernance = ref({ types_de_gouvernance: [] });
const uniqueKeys = new Map();
const globalData = localStorage.getItem("globalFormFactuelData");
const previewData = localStorage.getItem("previewFormFactuelData");

const goBackToCreate = function () {
  router.push({ name: "create_form_factuel" });
};

const isAvailable = reactive({
  option: true,
  type: true,
  principe: true,
  critere: true,
  indicateur: true,
  question: true,
});

const payload = reactive({
  libelle: "",
  annee_exercice: new Date().getFullYear(),
  type: "factuel",
  factuel: { options_de_reponse: globalOptionResponses.value.options_de_reponse, types_de_gouvernance: typesGouvernance.value.types_de_gouvernance },
});

const currentPreviewFactuelFormData = reactive({
  type: { id: "", nom: "" },
  principe: { id: "", nom: "" },
  critere: { id: "", nom: "" },
  indicateur: { id: "", nom: "" },
});

const currentGlobalFactuelFormData = reactive({
  type: "",
  principe: "",
  critere: "",
  indicateur: "",
});

// Fonction pour générer une clé unique pour chaque soumission
const generateKey = (id) => {
  return `${id}`;
};

const organiseGlobalFormFactuelData = (submissions) => {
  const organisedData = { types_de_gouvernance: [] };
  submissions.forEach((submission) => {
    // Trouver ou créer le type de gouvernance
    let type = organisedData.types_de_gouvernance.find((t) => t.id === submission.type);
    if (!type) {
      type = { id: submission.type, principes_de_gouvernance: [] };
      organisedData.types_de_gouvernance.push(type);
    }

    // Trouver ou créer le principe de gouvernance
    let principe = type.principes_de_gouvernance.find((p) => p.id === submission.principe);
    if (!principe) {
      principe = { id: submission.principe, criteres_de_gouvernance: [] };
      type.principes_de_gouvernance.push(principe);
    }

    // Trouver ou créer le critère de gouvernance
    let critere = principe.criteres_de_gouvernance.find((c) => c.id === submission.critere);
    if (!critere) {
      critere = { id: submission.critere, indicateurs_de_gouvernance: [] };
      principe.criteres_de_gouvernance.push(critere);
    }

    // Ajouter l'indicateur de gouvernance s'il n'est pas déjà présent
    if (!critere.indicateurs_de_gouvernance.includes(submission.indicateur)) {
      critere.indicateurs_de_gouvernance.push(submission.indicateur);
    }
  });

  return organisedData;
};

const organisePreviewFormFactuelData = (submissions) => {
  const organisedData = { types_de_gouvernance: [] };

  submissions.forEach((submission) => {
    // Trouver ou créer le type de gouvernance
    let type = organisedData.types_de_gouvernance.find((t) => t.id === submission.type.id);
    if (!type) {
      type = { id: submission.type.id, nom: submission.type.nom, principes_de_gouvernance: [] };
      organisedData.types_de_gouvernance.push(type);
    }

    // Assurer que principes_de_gouvernance est un tableau
    type.principes_de_gouvernance = type.principes_de_gouvernance || [];

    // Trouver ou créer le principe de gouvernance
    let principe = type.principes_de_gouvernance.find((p) => p.id === submission.principe.id);
    if (!principe) {
      principe = { id: submission.principe.id, nom: submission.principe.nom, criteres_de_gouvernance: [] };
      type.principes_de_gouvernance.push(principe);
    }

    // Assurer que criteres_de_gouvernance est un tableau
    principe.criteres_de_gouvernance = principe.criteres_de_gouvernance || [];

    // Trouver ou créer le critère de gouvernance
    let critere = principe.criteres_de_gouvernance.find((c) => c.id === submission.critere.id);
    if (!critere) {
      critere = { id: submission.critere.id, nom: submission.critere.nom, indicateurs_de_gouvernance: [] };
      principe.criteres_de_gouvernance.push(critere);
    }

    // Assurer que indicateurs_de_gouvernance est un tableau
    critere.indicateurs_de_gouvernance = critere.indicateurs_de_gouvernance || [];

    // Trouver ou créer l'indicateur de gouvernance
    let indicateur = critere.indicateurs_de_gouvernance.find((i) => i.id === submission.indicateur.id);
    if (!indicateur) {
      indicateur = { id: submission.indicateur.id, nom: submission.indicateur.nom };
      critere.indicateurs_de_gouvernance.push(indicateur);
    }
  });

  return organisedData;
};

const flattenGovernanceData = (organisedData) => {
  const submissions = [];

  organisedData.types_de_gouvernance.forEach((type) => {
    type.principes_de_gouvernance.forEach((principe) => {
      principe.criteres_de_gouvernance.forEach((critere) => {
        critere.indicateurs_de_gouvernance.forEach((indicateur) => {
          submissions.push({
            type: { id: type.id, nom: type.nom },
            principe: { id: principe.id, nom: principe.nom },
            critere: { id: critere.id, nom: critere.nom },
            indicateur: { id: indicateur.id, nom: indicateur.nom },
          });
        });
      });
    });
  });

  return submissions;
};


function organiseUpdateFormGlobal(types) {
  
  const submissions = [];
  types.forEach((type) =>
    type.categories_de_gouvernance.forEach((principe) => 
      principe.categories_de_gouvernance.forEach((critere) => 
        critere.questions_de_gouvernance.forEach((question) => {
          submissions.push({
            type: type.categorieableId,
            principe: principe.categorieableId,
            critere: critere.categorieableId,
            indicateur: question.indicateur_de_gouvernance.id
          });
        })
      )
    )
  );
  return submissions;

  return principeCurrent.flatMap((principe) =>
    principe.questions_de_gouvernance.map((question) => ({
      principe: principe.id,
      indicateur: question.question_operationnelle.id,
    }))
  );
}

function organiseUpdateFormPreview(types) {
  
  const submissions = [];

  types.forEach((type) =>
    type.categories_de_gouvernance.forEach((principe) => 
      principe.categories_de_gouvernance.forEach((critere) => 
        critere.questions_de_gouvernance.forEach((question) => {
          submissions.push({
            type: { id: type.categorieableId, nom: type.nom },
            principe: { id: principe.categorieableId, nom: principe.nom },
            critere: { id: critere.categorieableId, nom: critere.nom },
            indicateur: { id: question.indicateur_de_gouvernance.id, nom: question.indicateur_de_gouvernance.nom }
          });
          
            /* principe: {
              id: principe.id,
              nom: principe.nom,
            },
            indicateur: {
              id: question.question_operationnelle.id,
              nom: question.question_operationnelle.nom,
            } */
          }
        )
      )
    )
  );
  return submissions;
}

function setKeyForUpdate(types) {
  
  return types.forEach((type) =>
    type.categories_de_gouvernance.forEach((principe) => 
      principe.categories_de_gouvernance.forEach((critere) => 
        critere.questions_de_gouvernance.forEach((question) => {
        const key = generateKey(question.indicateur_de_gouvernance.id + critere.categorieableId + principe.categorieableId + type.categorieableId);

          uniqueKeys.set(key, true);
        })
      )
    )
  );

  return principeCurrent.flatMap((principe) =>
    principe.questions_de_gouvernance.forEach((question) => {
      uniqueKeys.set(question.question_operationnelle.id, true);
    })
  );
}

function matchDataUpdateWithCurrentDatas(typesCurrent) {
  
  globalFormFactuelData.value = organiseUpdateFormGlobal(typesCurrent);
  previewFormFactuelData.value = organiseUpdateFormPreview(typesCurrent);

  localStorage.setItem("globalFormFactuelData", JSON.stringify(globalFormFactuelData.value));
  localStorage.setItem("previewFormFactuelData", JSON.stringify(previewFormFactuelData.value));

  setKeyForUpdate(typesCurrent);

  updateAllTypesGouvernance();
  resetCurrentPreviewFactuelFormData();
  resetCurrentGlobalFactuelFormData();
  resetCurrentForm.value = !resetCurrentForm.value;

}

const resetCurrentPreviewFactuelFormData = () => {
  // for (const key in currentPreviewFactuelFormData) {
  //   currentPreviewFactuelFormData[key] = { id: "", nom: "" };
  // }
  currentPreviewFactuelFormData.indicateur = { id: "", nom: "" };
};

const resetCurrentGlobalFactuelFormData = () => {
  // Object.keys(currentGlobalFactuelFormData).forEach((key) => {
  //   currentGlobalFactuelFormData[key] = "";
  // });
  currentGlobalFactuelFormData.indicateur = "";
};

const resetAllForm = () => {
  resetCurrentGlobalFactuelFormData();
  resetCurrentPreviewFactuelFormData();
  // resetOptions.value = !resetOptions.value;
  // resetCurrentForm.value = !resetCurrentForm.value;
  // globalOptionResponses.value.options_de_reponse = [];
  // principesGouvernance.value.principes_de_gouvernance = [];
  // previewOptionResponses.value.options_de_reponse = [];
  // globalTypesGouvernance.value.types_de_gouvernance = [];
  // previewTypesGouvernance.value.types_de_gouvernance = [];
  globalFormFactuelData.value = [];
  previewFormFactuelData.value = [];
};

const updateAllTypesGouvernance = () => {
  console.log(globalFormFactuelData.value)
  console.log(previewFormFactuelData.value)
  globalTypesGouvernance.value = organiseGlobalFormFactuelData(globalFormFactuelData.value);
  previewTypesGouvernance.value = organisePreviewFormFactuelData(previewFormFactuelData.value);
  console.log(globalTypesGouvernance.value)
  console.log(previewTypesGouvernance.value)
  // console.log("PREVIEW", previewTypesGouvernance.value);
};

const changeIndexAccordion = (index) => {
  indexAccordion.value = index;
};

const getType = (type) => {
  changeIndexAccordion(1);
  currentGlobalFactuelFormData.type = type.id;
  currentPreviewFactuelFormData.type = { id: type.id, nom: type.nom };
};
const getPrincipe = (principe) => {
  changeIndexAccordion(4);
  currentGlobalFactuelFormData.principe = principe.id;
  currentPreviewFactuelFormData.principe = { id: principe.id, nom: principe.nom };
};

const getCritere = (critere) => {
  changeIndexAccordion(3);
  currentGlobalFactuelFormData.critere = critere.id;
  currentPreviewFactuelFormData.critere = { id: critere.id, nom: critere.nom };
};

const getIndicateur = (indicateur) => {
  changeIndexAccordion(2);
  currentGlobalFactuelFormData.indicateur = indicateur.id;
  currentPreviewFactuelFormData.indicateur = { id: indicateur.id, nom: indicateur.nom };
};

const addNewIndicator = () => {
  //const key = generateKey(currentGlobalFactuelFormData.indicateur);

  const key = generateKey(currentGlobalFactuelFormData.indicateur + currentGlobalFactuelFormData.critere + currentGlobalFactuelFormData.principe + currentGlobalFactuelFormData.type);


  // Ajouter la soumission si la clé est absente
  if (!uniqueKeys.has(key)) {
    globalFormFactuelData.value.unshift({ ...currentGlobalFactuelFormData });
    previewFormFactuelData.value.unshift(JSON.parse(JSON.stringify(currentPreviewFactuelFormData)));
    uniqueKeys.set(key, true);
    localStorage.setItem("globalFormFactuelData", JSON.stringify(globalFormFactuelData.value));
    localStorage.setItem("previewFormFactuelData", JSON.stringify(previewFormFactuelData.value));
    // console.log("global:", globalFormFactuelData.value);
    // console.log("preview:", previewFormFactuelData.value);
    updateAllTypesGouvernance();
    resetCurrentPreviewFactuelFormData();
    resetCurrentGlobalFactuelFormData();
    resetCurrentForm.value = !resetCurrentForm.value;
    toast.success("Indicateur ajouté.");
  } else {
    toast.info("Indicateur exisant.");
  }
};

const deplacerElement = (element, type = 'indicateur') => {
  if(type == 'indicateur'){
    globalFormFactuelData.value.findIndex((s) => s.indicateur === element.id);
  }
  else if(type == 'critere'){
    globalFormFactuelData.value.findIndex((s) => s.critere === element.id);
  }
  else if(type == 'principe'){
    globalFormFactuelData.value.findIndex((s) => s.principe === element.id);
  }
  else if(type == 'type'){
    globalFormFactuelData.value.findIndex((s) => s.type === element.id);
  }
}

const removeIndicator = (indicateur) => {
  //const key = generateKey(indicateur.id);
  // Trouver l'index de la soumission à supprimer
  const index = globalFormFactuelData.value.findIndex((s) => s.indicateur === indicateur.id);

  // Supprimer la soumission et sa clé si elle est trouvée
  if (index !== -1) {
    globalFormFactuelData.value.splice(index, 1);
    previewFormFactuelData.value.splice(index, 1);

    const key = generateKey(index.indicateur + index.critere + index.principe + index.type);
    uniqueKeys.delete(key);
    updateAllTypesGouvernance();
    localStorage.setItem("globalFormFactuelData", JSON.stringify(globalFormFactuelData.value));
    localStorage.setItem("previewFormFactuelData", JSON.stringify(previewFormFactuelData.value));
    toast.success("Indicateur supprimé.");
    // console.log("Nouvelle Global:", globalFormFactuelData.value);
    // console.log("Nouvelle preview:", previewFormFactuelData.value);
  }
};

const removeElement = (element, type = 'indicateur') => {
  var index = -1;
  if(type == 'critere'){
    index = globalFormFactuelData.value.findIndex((s) => s.critere === element.id);
  }
  else if(type == 'principe'){
    index = globalFormFactuelData.value.findIndex((s) => s.principe === element.id);
  }
  else if(type == 'type'){
    index = globalFormFactuelData.value.findIndex((s) => s.type === element.id);
  }
  
  // Supprimer la soumission et sa clé si elle est trouvée
  if (index !== -1) {
    globalFormFactuelData.value.splice(index, 1);
    previewFormFactuelData.value.splice(index, 1);
    
    updateAllTypesGouvernance();
    localStorage.setItem("globalFormFactuelData", JSON.stringify(globalFormFactuelData.value));
    localStorage.setItem("previewFormFactuelData", JSON.stringify(previewFormFactuelData.value));
    toast.success(type + " supprimé.");
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
  localStorage.removeItem("globalFormFactuelData");
  localStorage.removeItem("previewFormFactuelData");
  localStorage.removeItem("previewOptionResponsesModel");
  localStorage.removeItem("globalOptionResponses");
  showDeleteForm.value = false;
  // toast.success("Formulaire supprimé.");
};

const resetForm = () => {
  payload.libelle = "";
  modalForm.value = false;
};
const getOneForm = async () => {
  isLoadingOneForm.value = true;
  try {
    const { data } = await FormulaireFactuel.getOne(idForm);
    currentForm.value = data.data;
    console.log(currentForm.value)

    previewOptionResponses.value.options_de_reponse = currentForm.value.options_de_reponse;

    matchDataUpdateWithCurrentDatas(currentForm.value.categories_de_gouvernance);
    payload.libelle = currentForm.value.libelle;
    payload.annee_exercice = currentForm.value.annee_exercice;

  } catch (e) {
    toast.error("Erreur récupération du  formulaire.");
    console.log(e);
  } finally {
    isLoadingOneForm.value = false;
  }
};

const updateForm = async () => {
  isLoadingForm.value = true;
  payload.factuel.options_de_reponse = previewOptionResponses.value.options_de_reponse;
  payload.factuel.types_de_gouvernance = globalTypesGouvernance.value.types_de_gouvernance;

  try {
    await FormulaireFactuel.update(idForm, payload);
    toast.success(`Formulaire modifiée avec succès.`);
    fetchListForms.value = !fetchListForms.value;
    clearUniqueKeys();
    resetAllForm();
    modalForm.value = false;
    router.push({ name: "create_form_factuel", query: { tab: 1 } });
  } catch (e) {
    toast.error(getAllErrorMessages(e));
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
  return Object.values(currentPreviewFactuelFormData).every((value) => value.id.trim() !== "");
});

const showForm = computed(() => {
  return globalFormFactuelData.value.length > 0;
});

onBeforeUnmount(() => {
  clearUniqueKeys();
});

onMounted(async () => {
  await getOneForm();
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
            <OptionsResponse :is-reset="resetOptions" :is-update="true" :id-form="idForm" v-model:previewOptionResponses="previewOptionResponses" v-model:globalOptionResponses="globalOptionResponses" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Indicateurs de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <IndicateurGouvernance :to-reset="resetCurrentForm" :is-available="isAvailable.indicateur" @selected="getIndicateur" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Critères de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <CritereGouvernance :to-reset="false" :is-available="isAvailable.critere" @selected="getCritere" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Principe de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <PrincipeGouvernance :to-reset="false" :is-available="isAvailable.principe" @selected="getPrincipe" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Type de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <TypeGouvernance :to-reset="false" :is-available="isAvailable.type" @selected="getType" />
          </AccordionPanel>
        </AccordionItem>
      </AccordionGroup>
    </section>

    <section class="w-[70%] pt-5">
      <TabGroup :selectedIndex="currentTab">
        <TabList class="nav-boxed-tabs">
          <Tab class="w-full py-2" tag="button">{{ currentForm.libelle ?? "Formulaire" }}</Tab>
        </TabList>
        <TabPanels class="mt-5">
          <TabPanel class="leading-relaxed">
            <div class="flex flex-col gap-8">
              <div class="space-y-2">
                <p class="text-lg font-medium">Liste des options de réponses</p>
                <ListOptionsResponse :options="previewOptionResponses.options_de_reponse" />
              </div>
              <div class="space-y-2">
                <p class="text-lg font-medium">Ajouter des indicateurs</p>
                <FactuelStructure :type="currentPreviewFactuelFormData.type.nom" :principe="currentPreviewFactuelFormData.principe.nom" :critere="currentPreviewFactuelFormData.critere.nom" :indicateur="currentPreviewFactuelFormData.indicateur.nom" />
                <button :disabled="!isCurrentFormValid" @click="addNewIndicator" class="my-4 text-sm btn btn-primary"><PlusIcon class="mr-1 size-4" />Ajouter</button>
              </div>
              <div v-if="!isLoadingOneForm" class="space-y-2">
                <p class="text-lg font-medium">Liste des indicateurs</p>
                
                <!-- <div class="max-h-[25vh] h-[25vh] py-2 border-t overflow-y-auto">
                  <ListAccordionIndicateur :indicateurs-array="previewFormFactuelData" @remove="removeIndicator" />
                  <PreviewFactuelForm :types-gouvernance="previewTypesGouvernance.types_de_gouvernance" @remove="removeIndicator"  />
                </div> -->
                
                <div class="max-h-[50vh] h-[50vh] overflow-y-auto">
                  <table class="w-full border-collapse table-auto border-slate-500" cellpadding="10" cellspacing="0">
                    <thead class="text-white bg-blue-900">
                      <tr>
                        <th class="py-3 border border-slate-900">Principes</th>
                        <th class="py-3 border border-slate-900">Critères</th>
                        <th class="py-3 border border-slate-900">Indicateurs</th>
                        <th class="py-3 border border-slate-900 max-w-[200px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="type_de_gouvernance in previewTypesGouvernance.types_de_gouvernance" :key="type_de_gouvernance.id">
                        <tr class="bg-green-100 list-data">
                          <td colspan="3" class="font-semibold">{{ type_de_gouvernance.nom }}</td>
                          
                          <td class="items-center transition-all opacity-0 container-buttons">
                            <button class="p-1.5 text-primary">
                              <Edit3Icon class="size-5" />
                            </button>
                            <button class="p-1.5 text-danger" @click="removeElement(type_de_gouvernance, 'type')">
                              <TrashIcon class="size-5" />
                            </button>
                          </td>
                        </tr>
                        <template v-for="principe_de_gouvernance in type_de_gouvernance.principes_de_gouvernance" :key="principe_de_gouvernance.id">
                          <template v-for="(critere_de_gouvernance, scIndex) in principe_de_gouvernance.criteres_de_gouvernance" :key="critere_de_gouvernance.id">
                            <template v-for="(indicateur_de_gouvernance, qIndex) in critere_de_gouvernance.indicateurs_de_gouvernance" :key="indicateur_de_gouvernance.id">
                              <tr>
                                <!-- Première cellule de catégorie principale avec rowspan -->
                                <td class="font-semibold text-center list-data" v-if="scIndex === 0 && qIndex === 0" :rowspan="principe_de_gouvernance.criteres_de_gouvernance.reduce((sum, sc) => sum + sc.indicateurs_de_gouvernance.length, 0)">
                                  <div class="flex items-center gap-1">{{ principe_de_gouvernance.nom }}</div>
                                  
                                  <div class="items-center transition-all opacity-0 container-buttons">
                                    <button class="p-1.5 text-primary">
                                      <Edit3Icon class="size-5" />
                                    </button>
                                    <button class="p-1.5 text-danger" @click="removeElement(principe_de_gouvernance, 'principe')">
                                      <TrashIcon class="size-5" />
                                    </button>
                                  </div>
                                </td>
                                <!-- Première cellule de sous-catégorie avec rowspan -->
                                <td class="text-center list-data" v-if="qIndex === 0" :rowspan="critere_de_gouvernance.indicateurs_de_gouvernance.length">
                                  <div class="flex items-center gap-1">{{ critere_de_gouvernance.nom }}</div>
                                  
                                  <div class="flex items-center transition-all opacity-0 container-buttons">
                                    <button class="p-1.5 text-primary">
                                      <Edit3Icon class="size-5" />
                                    </button>
                                    <button class="p-1.5 text-danger" @click="removeElement(critere_de_gouvernance, 'critere')">
                                      <TrashIcon class="size-5" />
                                    </button>
                                  </div>
                                </td>
                                <td>{{ indicateur_de_gouvernance.nom }}</td>
                                <td>
                                  <div class="flex items-center">
                                    <button class="p-1.5 text-primary">
                                      <Edit3Icon class="size-5" />
                                    </button>
                                    <button class="p-1.5 text-danger" @click="removeIndicator(indicateur_de_gouvernance)">
                                      <TrashIcon class="size-5" />
                                    </button>
                                  </div>

                                  <!-- <button class="p-1 text-white btn btn-primary">
                                    <Edit3Icon class="size-5" />
                                  </button>
                                  <button class="p-1 text-white btn btn-danger" @click="removeIndicator(question)">
                                    <TrashIcon class="size-5" />
                                  </button> -->
                                </td>
                              </tr>
                            </template>
                          </template>
                          <!-- Ligne Score factuel après chaque catégorie principale -->
                        </template>
                      </template>
                    </tbody>
                  </table>
                </div>
                
                <div class="flex justify-between py-2">
                  <button @click="goBackToCreate" class="px-5 text-base btn btn-primary"><ArrowLeftIcon class="mr-1 size-5" />Annuler les modifications</button>

                  <button :disabled="!showForm" :loading="isLoadingForm" @click="updateForm" class="px-5 text-base btn btn-primary"><CheckIcon class="mr-1 size-5" />Modifier le formumlaire</button>

                  <!-- <button :disabled="!showForm" @click="previewForm" class="px-5 text-base btn btn-primary"><CheckIcon class="mr-1 size-5" />Prévisualiser le formumlaire</button> -->
                </div>
              </div>
              <LoaderSnipper v-else />
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </section>
  </div>

  <div class="w-full">
      <p class="text-lg font-medium">Prévisualisation du formulaire "{{ payload.libelle }}"</p>
    
      <table class="w-full my-10 border-collapse table-auto border-slate-500" cellpadding="10" cellspacing="0">
        <thead class="text-white bg-blue-900">
          <tr>
            <th class="py-3 border border-slate-900">Principes</th>
            <th class="py-3 border border-slate-900">Critères</th>
            <th class="py-3 border border-slate-900">Indicateurs</th>
            <th class="py-3 border border-slate-900">
              Réponses <br/>(
              <template class="py-3 border border-slate-900" v-for="(options_de_reponse, idx) in previewOptionResponses.options_de_reponse" :key="options_de_reponse.id">
                {{ options_de_reponse.libelle }} {{ idx < (previewOptionResponses.options_de_reponse.length-1) ? ' / ' : '' }}
              </template>)
            </th>
            <th class="py-3 border border-slate-900">Source de validation</th><!-- 
            <th class="py-3 border border-slate-900">Réponses</th>
            <th class="py-3 border border-slate-900">Note</th>
            <th class="py-3 border border-slate-900">Source de validation</th>
            <th class="py-3 border border-slate-900 max-w-[200px]">Preuves</th> -->
          </tr>
        </thead>
        <tbody>
          
          <template v-for="type_de_gouvernance in previewTypesGouvernance.types_de_gouvernance" :key="type_de_gouvernance.id">
            <tr class="bg-green-100">
              <td colspan="7" class="font-semibold">{{ type_de_gouvernance.nom }}</td>
            </tr>            
            <template v-for="principe_de_gouvernance in type_de_gouvernance.principes_de_gouvernance" :key="principe_de_gouvernance.id">
              <template v-for="(critere_de_gouvernance, scIndex) in principe_de_gouvernance.criteres_de_gouvernance" :key="critere_de_gouvernance.id">
                <template v-for="(indicateur_de_gouvernance, qIndex) in critere_de_gouvernance.indicateurs_de_gouvernance" :key="indicateur_de_gouvernance.id">

                  <tr>
                    <!-- Première cellule de catégorie principale avec rowspan -->
                    <td class="font-semibold text-center" v-if="scIndex === 0 && qIndex === 0" :rowspan="principe_de_gouvernance.criteres_de_gouvernance.reduce((sum, sc) => sum + sc.indicateurs_de_gouvernance.length, 0)">
                      {{ principe_de_gouvernance.nom }}
                    </td>

                    <!-- Première cellule de sous-catégorie avec rowspan -->
                    <td class="text-center" v-if="qIndex === 0" :rowspan="critere_de_gouvernance.indicateurs_de_gouvernance.length">
                      {{ critere_de_gouvernance.nom }}
                    </td>
                    <td>{{ indicateur_de_gouvernance.nom }}</td>
                    <td>{{ }}</td>
                    <td>{{ }}</td>
                  </tr>
                </template>
              </template>
              <!-- Ligne Score factuel après chaque catégorie principale -->
            </template>
          </template>
        </tbody>
      </table>
  </div>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" size="modal-xl" :show="modalForm" @hidden="modalForm = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Enregistrer le formulaire</h2>
    </ModalHeader>
    <form @submit.prevent="updateForm">
      <ModalBody class="space-y-5">
        <div class="flex gap-4">
          <InputForm label="Libellé" class="w-full" v-model="payload.libelle" />
          <div class="w-full">
            <label for="annee" class="form-label">Année</label>
            <input id="annee" type="number" required v-model.number="payload.annee_exercice" class="form-control" placeholder="Année" />
          </div>
        </div>
        <div>
          <p class="mb-3">Options de réponses</p>
          <ListOptionsResponse :options="previewOptionResponses.options_de_reponse" />
        </div>
        <div class="max-h-[50vh] h-[50vh] overflow-y-auto">
          <p class="mb-3">Formulaire factuel</p>
          <PreviewFactuelForm :types-gouvernance="previewTypesGouvernance.types_de_gouvernance" />
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="modalForm = false" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoadingForm" label="Modifier" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- END: Modal Content -->
</template>

<style scoped>
.accordion .accordion-item .accordion-header .accordion-button:not(.collapsed) {
  background: rgb(var(--color-primary)) !important;
}
.accordion .accordion-item:first-child {
  margin-top: 0 !important;
}
table td {
  border: 1px solid rgb(46, 46, 46);
  padding-block: 8px;
  padding-inline: 4px;
}

.list-data:hover .container-buttons {
  opacity: 1;
}

.listes {
  scrollbar-color: #a8a8a8 transparent;
  scrollbar-arrow-color: transparent;
}
</style>