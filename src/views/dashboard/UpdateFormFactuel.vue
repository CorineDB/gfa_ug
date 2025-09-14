<script setup>
import { onBeforeUnmount, reactive, ref, computed, onMounted, watch } from "vue";
import { toast } from "vue3-toastify";
/*import OptionsResponse from "@/components/create-form/OptionsResponse.vue";
import TypeGouvernance from "@/components/create-form/TypeGouvernance.vue";
import PrincipeGouvernance from "@/components/create-form/PrincipeGouvernance.vue";
import CritereGouvernance from "@/components/create-form/CritereGouvernance.vue";*/

import OptionsResponseFactuel from "@/components/create-form/OptionsResponseFactuel.vue";
import TypeGouvernance from "@/components/create-form/TypeGouvernance.vue";
import PrincipeDeGouvernanceFactuel from "@/components/create-form/PrincipeDeGouvernanceFactuel.vue";
import CritereDeGouvernanceFactuel from "@/components/create-form/CritereDeGouvernanceFactuel.vue";

import IndicateurGouvernance from "@/components/create-form/IndicateurGouvernance.vue";
import FactuelStructure from "@/components/create-form/FactuelStructure.vue";
import MultipleFactuelStructure from "@/components/create-form/MultipleFactuelStructure.vue";
import ListAccordionIndicateur from "@/components/create-form/ListAccordionIndicateur.vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
//import FormulaireFactuel from "@/services/modules/formFactuel.service";
import FormulaireFactuel from "@/services/modules/enquetes_de_gouvernance/formFactuel.service";
import PreviewFactuelForm from "@/components/create-form/PreviewFactuelForm.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import ListFormFactuel from "@/components/create-form/ListFormFactuel.vue";
import ListOptionsResponse from "@/components/create-form/ListOptionsResponse.vue";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { useYearsStore } from "@/stores/years";
import AuthService from "@/services/modules/auth.service";

import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { useRoute, useRouter } from "vue-router";

const yearsStore = useYearsStore();

const route = useRoute();
const router = useRouter();

const idForm = route.params.id;

const tabs = [
  {
    label: "MODIFIER FORMULAIRE FACTUEL",
    key: 0,
  },
  {
    label: "LISTE FORMULAIRE FACTUEL",
    key: 1,
  },
];

const currentTab = ref(0);

// Navigation functions
const selectTab = (index) => {
  currentTab.value = index;
  router.replace({ query: { ...route.query, tab: index } });
};

// Watch for route changes
watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab !== undefined) {
      currentTab.value = Number(newTab);
    } else {
      currentTab.value = 0;
    }
  },
  { immediate: true }
);
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
const currentGlobalFactuelFormDataArray = ref([]);
const currentPreviewFactuelFormDataArray = ref([]);
const previewTypesGouvernance = ref({});
const globalTypesGouvernance = ref({});
const currentForm = ref({});
const previewOptionResponses = ref({ options_de_reponse: [] });
const globalOptionResponses = ref({ options_de_reponse: [] });
const typesGouvernance = ref({ types_de_gouvernance: [] });
const uniqueKeys = new Map();
const globalData = localStorage.getItem("globalFormFactuelData");
const previewData = localStorage.getItem("previewFormFactuelData");

const STORAGE_KEYS = {
  lastTypeIndex: "lastTypeIndexGlobal",
  lastPrincipeIndex: "lastPrincipeIndexByType",
  lastCritereIndex: "lastCritereIndexByPrincipe",
  lastIndicateurIndex: "lastIndicateurIndexByCritere",
};

// Fonction pour charger une Map depuis localStorage
const loadMapFromStorage = (storageKey) => {
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return new Map(Object.entries(parsed));
    } catch (e) {
      console.warn(`Erreur lors du chargement de ${storageKey}:`, e);
    }
  }
  return new Map();
};

// Fonction pour sauvegarder une Map dans localStorage
const saveMapToStorage = (map, storageKey) => {
  try {
    const obj = Object.fromEntries(map);
    localStorage.setItem(storageKey, JSON.stringify(obj));
  } catch (e) {
    console.warn(`Erreur lors de la sauvegarde de ${storageKey}:`, e);
  }
};

// Initialiser les Maps avec les données persistées
const lastTypeIndexGlobal = loadMapFromStorage(STORAGE_KEYS.lastTypeIndex);
const lastPrincipeIndexByType = loadMapFromStorage(STORAGE_KEYS.lastPrincipeIndex);
const lastCritereIndexByPrincipe = loadMapFromStorage(STORAGE_KEYS.lastCritereIndex);
const lastIndicateurIndexByCritere = loadMapFromStorage(STORAGE_KEYS.lastIndicateurIndex);

const makeUniqueKey = (baseKey, parentKey, map, allKeys) => {
  // Récupérer le dernier index utilisé pour ce parent
  let index = map.get(parentKey) ?? -1;

  // Incrémenter pour avoir le prochain index
  index++;
  let key = `${baseKey}_${index}`;

  // Continuer à incrémenter tant que la clé existe
  while (allKeys.has(key)) {
    index++;
    key = `${baseKey}_${index}`;
  }

  // Sauvegarder le nouvel index pour ce parent
  map.set(parentKey, index);

  return key;
};

const previewFormulaire = ref(false);

// Variables d'état manquantes de CreateFormFactuel
const extractMessage = function (errorArray) {
  return Array.isArray(errorArray) && errorArray.length > 0 ? errorArray[0] : "";
};

const isAvailable = reactive({
  option: true,
  type: true,
  principe: true,
  critere: true,
  indicateur: true,
  question: true,
});

const errors = ref({});

const goBackToCreate = function () {
  router.push({ name: "Ajouter_un_formulaire_Factuel" });
};

const canEditType = ref([]);
const canEditPrincipe = ref([]);
const canEditCritere = ref([]);
const canEditIndicateur = ref([]);

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

const payload = reactive({
  libelle: "",
  annee_exercice: new Date().getFullYear(),
  type: "factuel",
  factuel: { options_de_reponse: globalOptionResponses.value.options_de_reponse, types_de_gouvernance: typesGouvernance.value.types_de_gouvernance },
});

const currentPreviewFactuelFormData = reactive({
  type: { id: "", nom: "", key: "", position: 0 },
  principe: { id: "", nom: "", key: "", position: 0 },
  critere: { id: "", nom: "", key: "", position: 0 },
  indicateur: { id: "", nom: "", key: "", position: 0 },
});

const currentGlobalFactuelFormData = reactive({
  type: "",
  principe: "",
  critere: "",
  indicateur: "",
  typeKey: "",
  principeKey: "",
  critereKey: "",
  indicateurKey: "",
  typePosition: "",
  principePosition: "",
  criterePosition: "",
  indicateurPosition: "",
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
      type = { id: submission.type, key: submission.typeKey, position: Number(submission.typePosition), principes_de_gouvernance: [] };
      organisedData.types_de_gouvernance.push(type);
    }

    // Trouver ou créer le principe de gouvernance
    let principe = type.principes_de_gouvernance.find((p) => p.id === submission.principe);
    if (!principe) {
      principe = { id: submission.principe, key: submission.principeKey, position: Number(submission.principePosition), criteres_de_gouvernance: [] };
      type.principes_de_gouvernance.push(principe);
    }

    // Trouver ou créer le critère de gouvernance
    let critere = principe.criteres_de_gouvernance.find((c) => c.id === submission.critere);
    if (!critere) {
      console.log(submission.critereKey);
      critere = { id: submission.critere, key: submission.critereKey, position: Number(submission.criterePosition), indicateurs_de_gouvernance: [] };
      principe.criteres_de_gouvernance.push(critere);
    } /* 

    // Ajouter l'indicateur de gouvernance s'il n'est pas déjà présent
    if (!critere.indicateurs_de_gouvernance.includes(submission.indicateur)) {
      critere.indicateurs_de_gouvernance.push(submission.indicateur);
    } */

    // Trouver ou créer l'indicateur de gouvernance
    let indicateur = critere.indicateurs_de_gouvernance.find((i) => i.id === submission.indicateur);
    if (!indicateur) {
      indicateur = { id: submission.indicateur, key: submission.indicateurKey, position: Number(submission.indicateurPosition) };
      critere.indicateurs_de_gouvernance.push(indicateur);
    }
  });

  console.log(organisedData);
  return organisedData;
};

const organisePreviewFormFactuelData = (submissions) => {
  const organisedData = { types_de_gouvernance: [] };

  submissions.forEach((submission) => {
    // Trouver ou créer le type de gouvernance
    let type = organisedData.types_de_gouvernance.find((t) => t.id === submission.type.id);
    if (!type) {
      type = { id: submission.type.id, nom: submission.type.nom, key: submission.type.key, position: Number(submission.type.position), principes_de_gouvernance: [] };
      organisedData.types_de_gouvernance.push(type);
    }

    // Assurer que principes_de_gouvernance est un tableau
    type.principes_de_gouvernance = type.principes_de_gouvernance || [];

    // Trouver ou créer le principe de gouvernance
    let principe = type.principes_de_gouvernance.find((p) => p.id === submission.principe.id);
    if (!principe) {
      principe = { id: submission.principe.id, nom: submission.principe.nom, key: submission.principe.key, position: Number(submission.principe.position), criteres_de_gouvernance: [] };
      type.principes_de_gouvernance.push(principe);
    }

    // Assurer que criteres_de_gouvernance est un tableau
    principe.criteres_de_gouvernance = principe.criteres_de_gouvernance || [];

    // Trouver ou créer le critère de gouvernance
    let critere = principe.criteres_de_gouvernance.find((c) => c.id === submission.critere.id);
    if (!critere) {
      console.log(submission.critere.key);
      critere = { id: submission.critere.id, nom: submission.critere.nom, key: submission.critere.key, position: Number(submission.critere.position), indicateurs_de_gouvernance: [] };
      principe.criteres_de_gouvernance.push(critere);
    }

    // Assurer que indicateurs_de_gouvernance est un tableau
    critere.indicateurs_de_gouvernance = critere.indicateurs_de_gouvernance || [];

    // Trouver ou créer l'indicateur de gouvernance
    let indicateur = critere.indicateurs_de_gouvernance.find((i) => i.id === submission.indicateur.id);
    if (!indicateur) {
      indicateur = { id: submission.indicateur.id, nom: submission.indicateur.nom, key: submission.indicateur.key, position: Number(submission.indicateur.position) };
      critere.indicateurs_de_gouvernance.push(indicateur);
    }
  });

  console.log(organisedData);

  return organisedData;
};

// Fonctions de nettoyage et utilitaires importées de CreateFormFactuel
const resetCurrentPreviewFactuelFormData = () => {
  currentPreviewFactuelFormData.principe = { id: "", nom: "", key: "", position: 0 };
  currentPreviewFactuelFormData.critere = { id: "", nom: "", key: "", position: 0 };
  currentPreviewFactuelFormData.indicateur = { id: "", nom: "", key: "", position: 0 };
  currentPreviewFactuelFormData.type = { id: "", nom: "", key: "", position: 0 };

  console.log(currentPreviewFactuelFormDataArray.value);

  currentPreviewFactuelFormDataArray.value = [];
};

const resetCurrentGlobalFactuelFormData = () => {
  Object.keys(currentGlobalFactuelFormData).forEach((key) => {
    currentGlobalFactuelFormData[key] = "";
  });

  currentGlobalFactuelFormDataArray.value = [];
};

const resetAllForm = () => {
  resetCurrentGlobalFactuelFormData();
  resetCurrentPreviewFactuelFormData();
  (previewOptionResponses.value.options_de_reponse = []), (globalOptionResponses.value.options_de_reponse = []);
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

const resetErrors = () => {
  modalForm.value = false;
  errors.value = {};
};

const changeIndexAccordion = (index) => {
  indexAccordion.value = index;
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
            indicateur: question.indicateur_de_gouvernance.id,

            typePosition: Number(type.position),
            typeKey: type.position + type.categorieableId,

            principePosition: Number(principe.position),
            principeKey: principe.position + principe.categorieableId + (type.position + type.categorieableId),

            criterePosition: Number(critere.position),
            critereKey: critere.position + critere.categorieableId + (principe.position + principe.categorieableId + (type.position + type.categorieableId)),

            indicateurPosition: Number(question.position),
            indicateurKey: question.position + question.indicateur_de_gouvernance.id + (critere.position + critere.categorieableId + (principe.position + principe.categorieableId + (type.position + type.categorieableId))),
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
          const typeKey = type.position + type.categorieableId;
          const principeKey = principe.position + principe.categorieableId + typeKey;
          const critereKey = critere.position + critere.categorieableId + principeKey;
          const indicateurKey = question.position + question.indicateur_de_gouvernance.id + critereKey;

          submissions.push({
            type: { id: type.categorieableId, nom: type.nom, position: Number(type.position), key: typeKey },
            principe: { id: principe.categorieableId, nom: principe.nom, position: Number(principe.position), key: principeKey },
            critere: { id: critere.categorieableId, nom: critere.nom, position: Number(critere.position), key: critereKey },
            indicateur: { id: question.indicateur_de_gouvernance.id, nom: question.indicateur_de_gouvernance.nom, position: Number(question.position), key: indicateurKey },
          });
        })
      )
    )
  );
  return submissions;
}

function setKeyForUpdate(types) {
  return types.forEach((type) => {
    const typeKey = type.position + type.categorieableId;

    type.categories_de_gouvernance.forEach((principe) => {
      const principeKey = principe.position + principe.categorieableId + typeKey;

      principe.categories_de_gouvernance.forEach((critere) => {
        const critereKey = critere.position + critere.categorieableId + principeKey;

        critere.questions_de_gouvernance.forEach((question) => {
          const indicateurKey = question.position + question.indicateur_de_gouvernance.id + critereKey;
          uniqueKeys.set(generateKey(indicateurKey), true);
          uniqueKeys.set(generateKey(critereKey), true);
          uniqueKeys.set(generateKey(principeKey), true);
          uniqueKeys.set(generateKey(typeKey), true);
        });
      });
    });
  });

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


const updateAllTypesGouvernance = () => {
  console.log(globalFormFactuelData.value);
  console.log(previewFormFactuelData.value);
  console.log("currentPreviewFactuelFormDataArray:", currentPreviewFactuelFormDataArray.value);

  globalTypesGouvernance.value = organiseGlobalFormFactuelData(globalFormFactuelData.value);

  // Combiner les données existantes (previewFormFactuelData) avec les nouveaux indicateurs temporaires (currentPreviewFactuelFormDataArray)
  const allPreviewData = [
    ...previewFormFactuelData.value, // Données existantes du formulaire
    ...currentPreviewFactuelFormDataArray.value, // Nouveaux indicateurs en cours d'ajout
  ];

  previewTypesGouvernance.value = organisePreviewFormFactuelData(allPreviewData);

  console.log("Combined preview data:", allPreviewData);
  console.log(globalTypesGouvernance.value);
  console.log(previewTypesGouvernance.value);
  // console.log("PREVIEW", previewTypesGouvernance.value);
};

const getTypes = (type) => {
  changeIndexAccordion(1);
  currentGlobalFactuelFormData.type = type.id;

  let position = new Set((globalFormFactuelData.value || []).map((item) => item.type).filter((val) => val !== null && val !== undefined && val !== "")).size;

  position = position + 1;

  currentGlobalFactuelFormData.typeKey = position + type.id;

  currentGlobalFactuelFormDataArray.value.forEach((item) => {
    item.type = currentGlobalFactuelFormData.type;
    item.typeKey = currentGlobalFactuelFormData.typeKey;
    item.typePosition = currentGlobalFactuelFormData.typePosition;
  });

  currentPreviewFactuelFormData.type = { id: type.id, nom: type.nom, key: currentGlobalFactuelFormData.typeKey, position: position };

  currentPreviewFactuelFormDataArray.value.forEach((item2, index) => {
    item2.type = currentPreviewFactuelFormData.type;
  });
};

const getType = (type) => {
  changeIndexAccordion(1);
  currentGlobalFactuelFormData.type = type.id;
  currentPreviewFactuelFormData.type = { id: type.id, nom: type.nom };
};
const getPrincipes = (principe) => {
  changeIndexAccordion(2);
  currentGlobalFactuelFormData.principe = principe.id;

  let position = new Set(
    (globalFormFactuelData.value || [])
      .filter((val) => val.type == currentGlobalFactuelFormData.type)
      .map((item) => item.principe)
      .filter((val) => val !== null && val !== undefined && val !== "")
  ).size;

  position = position + 1;

  let key = position + principe.id;

  if (currentGlobalFactuelFormData.typeKey != "") {
    key = key + currentGlobalFactuelFormData.typeKey;
  }

  currentGlobalFactuelFormData.principeKey = key;

  currentGlobalFactuelFormDataArray.value.forEach((item) => {
    item.principe = currentGlobalFactuelFormData.principe;
    item.principeKey = currentGlobalFactuelFormData.principeKey;
  });

  currentPreviewFactuelFormData.principe = { id: principe.id, nom: principe.nom, key: currentGlobalFactuelFormData.principeKey, position: position };

  currentPreviewFactuelFormDataArray.value.forEach((item2, index) => {
    item2.principe = currentPreviewFactuelFormData.principe;
  });
};

const getPrincipe = (principe) => {
  changeIndexAccordion(2);
  currentGlobalFactuelFormData.principe = principe.id;
  currentPreviewFactuelFormData.principe = { id: principe.id, nom: principe.nom };
};

const getCriteres = (critere) => {
  changeIndexAccordion(3);
  currentGlobalFactuelFormData.critere = critere.id;

  let position = new Set(
    (globalFormFactuelData.value || [])
      .filter((val) => val.principe == currentGlobalFactuelFormData.principe)
      .map((item) => item.critere)
      .filter((val) => val !== null && val !== undefined && val !== "")
  ).size;

  position = position + 1;

  let key = position + critere.id;

  if (currentGlobalFactuelFormData.principeKey != "") {
    key = key + currentGlobalFactuelFormData.principeKey;
  }

  currentGlobalFactuelFormData.critereKey = key;

  currentGlobalFactuelFormDataArray.value.forEach((item) => {
    item.critere = currentGlobalFactuelFormData.critere;
    item.critereKey = currentGlobalFactuelFormData.critereKey;
    item.principePosition = currentGlobalFactuelFormData.principePosition;
  });

  currentPreviewFactuelFormData.critere = { id: critere.id, nom: critere.nom, key: currentGlobalFactuelFormData.critereKey, position: position };

  currentPreviewFactuelFormDataArray.value.forEach((item2, index) => {
    item2.critere = currentPreviewFactuelFormData.critere;
  });
};

const getCritere = (critere) => {
  changeIndexAccordion(3);
  currentGlobalFactuelFormData.critere = critere.id;
  currentPreviewFactuelFormData.critere = { id: critere.id, nom: critere.nom };
};

const getIndicateurs = (indicateur) => {
  // changeIndexAccordion(4);
  currentGlobalFactuelFormData.indicateur = indicateur.id;

  // Compter les indicateurs déjà persistés pour ce critère
  let indicateursPersistes = (globalFormFactuelData.value || []).filter((item) => item.critere === currentGlobalFactuelFormData.critere).map((item) => item.indicateur);

  // Compter les indicateurs en cours d'ajout pour ce critère
  let indicateursEnCours = (currentGlobalFactuelFormDataArray.value || []).filter((item) => item.critere === currentGlobalFactuelFormData.critere).map((item) => item.indicateur);

  // Combiner les deux et compter les uniques
  let tousIndicateurs = [...indicateursPersistes, ...indicateursEnCours].filter((val) => val !== null && val !== undefined && val !== "");

  let position = new Set(tousIndicateurs).size;

  console.log("indicateursPersistes:", indicateursPersistes);
  console.log("indicateursEnCours:", indicateursEnCours);
  console.log("tousIndicateurs:", tousIndicateurs);
  console.log("position:", position);

  position = position + 1;

  const typeKey = currentGlobalFactuelFormData?.typeKey != "" ? currentGlobalFactuelFormData?.typeKey : "";
  const principeKey = currentGlobalFactuelFormData?.principeKey != "" ? currentGlobalFactuelFormData?.principeKey : "";
  const critereKey = currentGlobalFactuelFormData?.critereKey != "" ? currentGlobalFactuelFormData?.critereKey : "";

  const key = position + currentGlobalFactuelFormData?.indicateur;

  currentGlobalFactuelFormData.indicateurKey = key;

  let form = {
    type: currentGlobalFactuelFormData?.type,
    typeKey: typeKey,
    principe: currentGlobalFactuelFormData?.principe,
    principeKey: principeKey,
    critere: currentGlobalFactuelFormData?.critere,
    critereKey: critereKey,
    indicateur: indicateur.id,
    indicateurKey: key,
    indicateurPosition: position,
  };

  currentGlobalFactuelFormDataArray.value.push(form);

  console.log("currentGlobalFactuelFormDataArray.value", currentGlobalFactuelFormDataArray.value);

  currentPreviewFactuelFormData.indicateur = { id: indicateur.id, nom: indicateur.nom, key: key, position: position };

  let form2 = {
    type: currentPreviewFactuelFormData.type ?? {
      id: "",
      nom: "",
      key: "",
      position: 0,
    },
    principe: currentPreviewFactuelFormData.principe ?? {
      id: "",
      nom: "",
      key: "",
      position: 0,
    },
    critere: currentPreviewFactuelFormData.critere ?? {
      id: "",
      nom: "",
      key: key,
      position: 0,
    },
    indicateur: currentPreviewFactuelFormData.indicateur,
  };

  currentPreviewFactuelFormDataArray.value.push(form2);

  console.log("currentPreviewFactuelFormDataArray.value", currentPreviewFactuelFormDataArray.value);
};

const getIndicateur = (indicateur) => {
  changeIndexAccordion(4);
  currentGlobalFactuelFormData.indicateur = indicateur.id;
  currentPreviewFactuelFormData.indicateur = { id: indicateur.id, nom: indicateur.nom };
};

const addNewIndicator = () => {
  const sessionKeys = new Set();

  console.log("currentGlobalFactuelFormDataArray.value", currentGlobalFactuelFormDataArray.value);
  console.log("currentPreviewFactuelFormDataArray.value", currentPreviewFactuelFormDataArray.value);

  currentGlobalFactuelFormDataArray.value.forEach((item, index) => {
    const allKeys = new Set([...uniqueKeys.keys(), ...sessionKeys]);

    console.log(allKeys);

    // 1. Générer typeKey normalement
    const typeKeyBase = generateKey(item.typeKey);
    const typeKey = makeUniqueKey(typeKeyBase, typeKeyBase, lastTypeIndexGlobal, allKeys);
    sessionKeys.add(typeKey);

    // 2. Générer principeKey unique par typeKey
    const principeKeyBase = generateKey(item.principeKey + typeKey);
    const principeKey = makeUniqueKey(principeKeyBase, typeKey, lastPrincipeIndexByType, allKeys);
    sessionKeys.add(principeKey);

    // 3. Générer critereKey unique par principeKey
    const critereKeyBase = generateKey(item.critereKey + principeKey);
    const critereKey = makeUniqueKey(critereKeyBase, principeKey, lastCritereIndexByPrincipe, allKeys);
    sessionKeys.add(critereKey);

    // 4. Générer indicateurKey unique par critereKey
    const indicateurKeyBase = generateKey(item.indicateurKey + critereKey);
    const indicateurKey = makeUniqueKey(indicateurKeyBase, critereKey, lastIndicateurIndexByCritere, allKeys);
    sessionKeys.add(indicateurKey);

    const key = indicateurKey;

    if (!uniqueKeys.has(key)) {
      // Vérifier les positions des indicateurs existants pour éviter les conflits
      const existingIndicateurs = previewFormFactuelData.value.filter(
        existingItem =>
          existingItem.type.id === currentPreviewFactuelFormDataArray.value[index].type.id &&
          existingItem.principe.id === currentPreviewFactuelFormDataArray.value[index].principe.id &&
          existingItem.critere.id === currentPreviewFactuelFormDataArray.value[index].critere.id
      );

      const existingPositions = existingIndicateurs.map(ind => Number(ind.indicateur.position));
      let newPosition = 1;

      // Trouver la première position disponible à partir de 1
      while (existingPositions.includes(newPosition)) {
        newPosition++;
      }

      // Mettre à jour la position dans les données temporaires
      currentGlobalFactuelFormDataArray.value[index].indicateurPosition = newPosition;
      currentPreviewFactuelFormDataArray.value[index].indicateur.position = newPosition;
      // Mettre à jour l'objet
      item = {
        ...item,
        typeKey,
        principeKey,
        critereKey,
        indicateurKey,
      };

      const preview = {
        ...currentPreviewFactuelFormDataArray.value[index],
      };

      preview.type.key = typeKey;
      preview.principe.key = principeKey;
      preview.critere.key = critereKey;
      preview.indicateur.key = indicateurKey;

      console.log("preview.indicateur", preview.indicateur);

      globalFormFactuelData.value.unshift({ ...item });
      previewFormFactuelData.value.unshift(JSON.parse(JSON.stringify(preview)));

      // Tri par position
      globalFormFactuelData.value.sort((a, b) => {
        return a.typePosition - b.typePosition || a.principePosition - b.principePosition || a.criterePosition - b.criterePosition || a.indicateurPosition - b.indicateurPosition;
      });

      previewFormFactuelData.value.sort((a, b) => {
        return a.type.position - b.type.position || a.principe.position - b.principe.position || a.critere.position - b.critere.position || a.indicateur.position - b.indicateur.position;
      });

      // Sauvegarde
      localStorage.setItem("globalFormFactuelData", JSON.stringify(globalFormFactuelData.value));
      localStorage.setItem("previewFormFactuelData", JSON.stringify(previewFormFactuelData.value));

      updateAllTypesGouvernance();

      if (index === currentGlobalFactuelFormDataArray.value.length - 1) {
        resetCurrentPreviewFactuelFormData();
        resetCurrentGlobalFactuelFormData();
        resetCurrentForm.value = !resetCurrentForm.value;

        // Réinitialiser les sélections d'accordéon
        changeIndexAccordion(0);

        // Réinitialiser les disponibilités pour forcer une nouvelle sélection
        isAvailable.type = true;
        isAvailable.principe = true;
        isAvailable.critere = true;
        isAvailable.indicateur = true;
      }

      toast.success("Indicateur ajouté.");
    } else {
      toast.info("Indicateur déjà ajouté.");
    }
  });

  // Sauvegarder les Maps mises à jour dans localStorage
  saveMapToStorage(lastTypeIndexGlobal, STORAGE_KEYS.lastTypeIndex);
  saveMapToStorage(lastPrincipeIndexByType, STORAGE_KEYS.lastPrincipeIndex);
  saveMapToStorage(lastCritereIndexByPrincipe, STORAGE_KEYS.lastCritereIndex);
  saveMapToStorage(lastIndicateurIndexByCritere, STORAGE_KEYS.lastIndicateurIndex);

  // Ajoute toutes les clés générées dans la session à uniqueKeys
  for (const key of sessionKeys) {
    uniqueKeys.set(key, true);
  }

  console.log("currentGlobalFactuelFormDataArray.value", currentGlobalFactuelFormDataArray.value);
  console.log("currentPreviewFactuelFormDataArray.value", currentPreviewFactuelFormDataArray.value);
};

const removeIndicator = (key) => {
  console.log("remove key", key);

  //const key = generateKey(indicateur.id);
  // Trouver l'index de la soumission à supprimer
  const index = globalFormFactuelData.value.findIndex((s) => s.indicateurKey === key);

  // Supprimer la soumission et sa clé si elle est trouvée
  if (index !== -1) {
    globalFormFactuelData.value.splice(index, 1);
    previewFormFactuelData.value.splice(index, 1);

    uniqueKeys.delete(key);
    updateAllTypesGouvernance();
    localStorage.setItem("globalFormFactuelData", JSON.stringify(globalFormFactuelData.value));
    localStorage.setItem("previewFormFactuelData", JSON.stringify(previewFormFactuelData.value));
    toast.success("Indicateur supprimé.");
    // console.log("Nouvelle Global:", globalFormFactuelData.value);
    // console.log("Nouvelle preview:", previewFormFactuelData.value);
  } else {
    currentGlobalFactuelFormData.indicateur = "";
    currentGlobalFactuelFormData.indicateurKey = "";
    currentGlobalFactuelFormData.indicateurPosition = 0;
    currentPreviewFactuelFormData.indicateur = { id: "", nom: "", key: "", position: 0 };
  }
};

const removeElement = (key, type = "critere", isCurrent = false) => {
  if (!isCurrent) {
    var index = -1;
    if (type == "critere") {
      index = globalFormFactuelData.value.findIndex((s) => s.critereKey === key);
    } else if (type == "principe") {
      index = globalFormFactuelData.value.findIndex((s) => s.principeKey === key);
    } else if (type == "type") {
      index = globalFormFactuelData.value.findIndex((s) => s.typeKey === key);
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
  } else {
    currentGlobalFactuelFormData[type] = "";
    currentGlobalFactuelFormData[type + "Key"] = "";
    currentGlobalFactuelFormData[type + "Position"] = 0;
    currentPreviewFactuelFormData[type] = { id: "", nom: "", key: "", position: 0 };
  }
};

const updateTemporyIndicateurs = (key, position, isCurrent = false) => {
  if (!isCurrent) {
    previewFormFactuelData.value = previewFormFactuelData.value
      .map((item) => {
        if (item.indicateur.key == key) {
          item.indicateur.position = Number(position);
        }
        return item;
      })
      .sort((a, b) => {
        return a.type.position - b.type.position || a.principe.position - b.principe.position || a.critere.position - b.critere.position || a.indicateur.position - b.indicateur.position;
      });

    globalFormFactuelData.value = globalFormFactuelData.value
      .map((item) => {
        if (item.indicateur.key == key) {
          item.position = Number(position);
        }
        return item;
      })
      .sort((a, b) => {
        return a.typePosition - b.typePosition || a.principePosition - b.principePosition || a.criterePosition - b.criterePosition || a.indicateurPosition - b.indicateurPosition;
      });

    updateAllTypesGouvernance();

    localStorage.setItem("globalFormFactuelData", JSON.stringify(globalFormFactuelData.value));
    localStorage.setItem("previewFormFactuelData", JSON.stringify(previewFormFactuelData.value));

    toast.success("Question operationnelle update.");
  } else {
    currentPreviewFactuelFormData.indicateur.position = Number(position);

    currentGlobalFactuelFormData.indicateurPosition = Number(position);
  }
};

const updateTemporyElement = (key, position, isCurrent = false, type = "critere") => {
  if (isCurrent == false) {
    console.log(position);
    console.log(type);
    // Update position from globalFormFactuelData
    globalFormFactuelData.value = globalFormFactuelData.value
      .map((item) => {
        if (type == "type") {
          if (item.typeKey == key) {
            item.typePosition = Number(position);
          }
        } else if (type == "principe") {
          if (item.principeKey == key) {
            item.principePosition = Number(position);
          }
        } else if (type == "critere") {
          console.log(item.critereKey, key);
          if (item.critereKey == key) {
            item.criterePosition = Number(position);
          }
        }

        return item;
      })
      .sort((a, b) => {
        return a.typePosition - b.typePosition || a.principePosition - b.principePosition || a.criterePosition - b.criterePosition || a.indicateurPosition - b.indicateurPosition;
      });

    // Update position from previewFormFactuelData
    previewFormFactuelData.value = previewFormFactuelData.value
      .map((item) => {
        if (type == "type") {
          if (item.type.key == key) {
            item.type.position = Number(position);
          }
        } else if (type == "principe") {
          if (item.principe.key == key) {
            item.principe.position = Number(position);
          }
        } else if (type == "critere") {
          if (item.critere.key == key) {
            item.critere.position = Number(position);
          }
        }

        return item;
      })
      .sort((a, b) => {
        return a.type.position - b.type.position || a.principe.position - b.principe.position || a.critere.position - b.critere.position || a.indicateur.position - b.indicateur.position;
      });

    // Recalculate and update
    updateAllTypesGouvernance();

    // Persist to localStorage
    localStorage.setItem("globalFormFactuelData", JSON.stringify(globalFormFactuelData.value));
    localStorage.setItem("previewFormFactuelData", JSON.stringify(previewFormFactuelData.value));

    if (type == "type") {
      canEditType.value[key] = false;
    } else if (type == "principe") {
      canEditPrincipe.value[key] = false;
    } else if (type == "critere") {
      canEditCritere.value[key] = false;
    }
    console.log(type);
  } else {
    if (type == "type") {
      currentPreviewFactuelFormData.type.position = Number(position);
      currentGlobalFactuelFormData.typePosition = Number(position);
    } else if (type == "principe") {
      currentPreviewFactuelFormData.principe.position = Number(position);
      currentGlobalFactuelFormData.principePosition = Number(position);
    } else if (type == "critere") {
      currentPreviewFactuelFormData.critere.position = Number(position);
      currentGlobalFactuelFormData.criterePosition = Number(position);
    }
  }
};

function editTemporyFormElement(key, position, type) {
  updateTemporyElement(key, position, false, type);
}

function editTemporyIndicateur(key, position) {
  updateTemporyIndicateurs(key, position, false);
  canEditIndicateur.value[key] = false;
}

// Handle edit action
const handleEdit = (key) => {
  canEditIndicateur.value[key] = true;
};

// Handle edit action
const handleEditElement = (key, type = "critere") => {
  if (type == "type") {
    canEditType.value[key] = true;
  } else if (type == "principe") {
    canEditPrincipe.value[key] = true;
  } else if (type == "critere") {
    canEditCritere.value[key] = true;
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
    console.log(currentForm.value);

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
  payload.factuel.types_de_gouvernance = previewTypesGouvernance.value.types_de_gouvernance;

  console.log(payload.factuel);

  try {
    await FormulaireFactuel.update(idForm, payload);
    toast.success(`Formulaire modifié avec succès.`);
    fetchListForms.value = !fetchListForms.value;
    // resetForm();
    resetAllFormWithDataLocalStorage();
    clearUniqueKeys();
    errors.value = {};
    modalForm.value = false;
    router.push({ name: "Modifier_un_formulaire_Factuel", query: { tab: 1 } });
  }                                                                                                                                                             catch (e) {
    if (e.response && e.response.status === 422) {
      errors.value = e.response.data.errors;
      toast.error(`Une erreur est survenue dans le formulaire.`);
    } else {
      toast.error(getAllErrorMessages(e));
    }
    console.log(e);
  } finally {
    isLoadingForm.value = false;
  }
};

const previewForm = () => {
  console.log("click");
  if (globalOptionResponses.value.options_de_reponse.length >= 2) {
    modalForm.value = true;
  } else {
    toast.error("Ajouter au moins deux options de réponses.");
  }
};

const isCurrentFormValid = computed(() => {
  return Object.values(currentPreviewFactuelFormData).every((value) => value.id.trim() !== "");
});

const showForm = computed(() => {
  return globalFormFactuelData.value.length > 0;
});

const goBackToFormList = function () {
  resetAllFormWithDataLocalStorage();
  router.push({ name: "Ajouter_un_formulaire_Factuel", query: { tab: 1 } });
};

const comeBackToCreation = function () {
  router.push({ name: "Ajouter_un_formulaire_Factuel", query: { tab: 1 } });
};

onBeforeUnmount(() => {
  clearUniqueKeys();
  localStorage.removeItem("globalFormFactuelData");
  localStorage.removeItem("previewFormFactuelData");
});

onMounted(async () => {
  await getOneForm();
  updateAllTypesGouvernance();
  getcurrentUser();
});
</script>

<template>
  <div class="flex w-full gap-2">
    <section class="w-[30%] max-h-[80%] pr-1 overflow-y-auto border-r-2 pt-5">
      <AccordionGroup :selectedIndex="indexAccordion" class="space-y-1">
        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Type de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <TypeGouvernance :to-reset="resetCurrentForm" :is-available="isAvailable.type" @selected="getTypes" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Principe de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <PrincipeDeGouvernanceFactuel :to-reset="resetCurrentForm" :is-available="isAvailable.principe" @selected="getPrincipes" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Critères de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <CritereDeGouvernanceFactuel :to-reset="resetCurrentForm" :is-available="isAvailable.critere" @selected="getCriteres" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Indicateurs de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <IndicateurGouvernance :to-reset="resetCurrentForm" :is-available="isAvailable.indicateur" @selected="getIndicateurs" :monTableau="previewFormFactuelData" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Options de réponses</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <OptionsResponseFactuel :is-reset="resetOptions" :is-update="true" :id-form="idForm" v-model:previewOptionResponses="previewOptionResponses" v-model:globalOptionResponses="globalOptionResponses" />
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
            <div class="flex flex-col gap-8">
              <div class="space-y-2">
                <p class="text-lg font-medium">Liste des options de réponses</p>
                <ListOptionsResponse :options="previewOptionResponses.options_de_reponse" />
              </div>
              <div class="space-y-2">
                <p class="text-lg font-medium">Ajouter des indicateurs</p>
                <MultipleFactuelStructure :type="currentPreviewFactuelFormData.type" :principe="currentPreviewFactuelFormData.principe" :critere="currentPreviewFactuelFormData.critere" @deleteIndicateur="removeIndicator" @deletePrincipe="removeElement" @deleteType="removeElement" @updatePositionIndicateur="updateTemporyIndicateurs" @deleteCritere="removeElement" @updateTemporyElement="updateTemporyElement" :indicateurArray="currentPreviewFactuelFormDataArray.length > 0 ? currentPreviewFactuelFormDataArray : []" />
                <button :disabled="!isCurrentFormValid" @click="addNewIndicator" class="my-4 text-sm btn btn-primary"><PlusIcon class="mr-1 size-4" />Ajouter</button>
              </div>
            </div>

            <div v-if="!isLoadingOneForm" class="space-y-2 mt-6">
    <div class="flex justify-between items-center py-2">
      <p class="text-lg font-medium">Previsualisation du Formulaire</p>

      <div class="flex justify-spacely py-2" v-if="previewTypesGouvernance?.types_de_gouvernance?.length">
        <button :disabled="!showForm" @click="previewForm()" class="mr-5 px-5 text-base btn btn-primary"><CheckIcon class="mr-1 size-5" />Modifier</button>
        <button :disabled="!showForm" @click="previewFormulaire = true" class="px-5 text-base btn btn-primary"><EyeIcon class="mr-1 size-5" />Voir le formumlaire</button>
      </div>
    </div>
    <div class="max-h-[80vh] py-2 border-t overflow-y-auto mb-10 my-2">
      <table class="w-full border-collapse table-auto border-slate-500" cellpadding="10" cellspacing="0">
        <thead class="text-white bg-blue-900">
          <tr>
            <th class="py-3 border border-slate-900">Principes</th>
            <th class="py-3 border border-slate-900">Critères</th>
            <th class="py-3 border border-slate-900">Indicateurs</th>
            <th class="py-3 border border-slate-900 max-w-[200px]">Actions</th>
          </tr>
        </thead>

        <tbody v-if="previewTypesGouvernance?.types_de_gouvernance?.length">
          <template v-for="type_de_gouvernance in previewTypesGouvernance.types_de_gouvernance" :key="type_de_gouvernance.id">
            <tr class="bg-green-100 list-data">
              <td colspan="3" class="font-semibold">{{ type_de_gouvernance.position }} - {{ type_de_gouvernance.nom }} - {{ type_de_gouvernance.id }}</td>

              <td class="items-center transition-all opacity-0 container-buttons">
                <template v-if="canEditType[type_de_gouvernance.key]">
                  <input type="number" min="1" step="1" name="position" :value="type_de_gouvernance.position" @keyup.enter="editTemporyFormElement(type_de_gouvernance.key, $event.target.value, 'type')" class="w-2/5 form-control" />
                </template>
                <template v-else>
                  <button class="p-1.5 text-primary" @click="handleEditElement(type_de_gouvernance.key, 'type')">
                    <Edit3Icon class="size-5" />
                  </button>
                  <button class="p-1.5 text-danger" @click="removeElement(type_de_gouvernance.key, 'type', false)">
                    <TrashIcon class="size-5" />
                  </button>
                </template>
              </td>
            </tr>
            <template v-for="principe_de_gouvernance in type_de_gouvernance.principes_de_gouvernance" :key="principe_de_gouvernance.id">
              <template v-for="(critere_de_gouvernance, scIndex) in principe_de_gouvernance.criteres_de_gouvernance" :key="critere_de_gouvernance.id">
                <template v-for="(indicateur_de_gouvernance, qIndex) in critere_de_gouvernance.indicateurs_de_gouvernance" :key="indicateur_de_gouvernance.id">
                  <tr>
                    <!-- Première cellule de catégorie principale avec rowspan -->
                    <td class="font-semibold list-data" v-if="scIndex === 0 && qIndex === 0" :rowspan="principe_de_gouvernance.criteres_de_gouvernance.reduce((sum, sc) => sum + sc.indicateurs_de_gouvernance.length, 0)">
                      <div class="flex items-center gap-1">{{ type_de_gouvernance.position }}.{{ principe_de_gouvernance.position }} - {{ principe_de_gouvernance.nom }}</div>
                      <div>{{ type_de_gouvernance.id  }}</div>
                      <div class="items-center transition-all opacity-0 container-buttons">
                        <template v-if="canEditPrincipe[principe_de_gouvernance.key]">
                          <input type="number" min="1" step="1" name="position" :value="principe_de_gouvernance.position" @keyup.enter="editTemporyFormElement(principe_de_gouvernance.key, $event.target.value, 'principe')" class="w-2/5 form-control" />
                        </template>
                        <template v-else>
                          <button class="p-1.5 text-primary" @click="handleEditElement(principe_de_gouvernance.key, 'principe')">
                            <Edit3Icon class="size-5" />
                          </button>
                          <button class="p-1.5 text-danger" @click="removeElement(principe_de_gouvernance.key, 'principe', false)">
                            <TrashIcon class="size-5" />
                          </button>
                        </template>
                      </div>
                    </td>
                    <!-- Première cellule de sous-catégorie avec rowspan -->
                    <td class="list-data" v-if="qIndex === 0" :rowspan="critere_de_gouvernance.indicateurs_de_gouvernance.length">
                      <div class="flex items-center gap-1">{{ type_de_gouvernance.position }}.{{ principe_de_gouvernance.position }}.{{ critere_de_gouvernance.position }} - {{ critere_de_gouvernance.nom }}</div>
                      <div>{{ principe_de_gouvernance.id  }}</div>
                      <div class="flex items-center transition-all opacity-0 container-buttons">
                        <template v-if="canEditCritere[critere_de_gouvernance.key]">
                          <input type="number" min="1" step="1" name="position" :value="critere_de_gouvernance.position" @keyup.enter="editTemporyFormElement(critere_de_gouvernance.key, $event.target.value, 'critere')" class="w-2/5 form-control" />
                        </template>
                        <template v-else>
                          <button class="p-1.5 text-primary" @click="handleEditElement(critere_de_gouvernance.key, 'critere')">
                            <Edit3Icon class="size-5" />
                          </button>
                          <button class="p-1.5 text-danger" @click="removeElement(critere_de_gouvernance.key, 'critere', false)">
                            <TrashIcon class="size-5" />
                          </button>
                        </template>
                      </div>
                    </td>
                    <td>{{ type_de_gouvernance.position }}.{{ principe_de_gouvernance.position }}.{{ critere_de_gouvernance.position }}.{{ indicateur_de_gouvernance.position }} - {{ indicateur_de_gouvernance.nom }} -  <div>{{ indicateur_de_gouvernance.id  }}</div></td>
 
                    <td>
                      <div class="flex items-center">
                        <template v-if="canEditIndicateur[indicateur_de_gouvernance.key]">
                          <input type="number" min="1" step="1" name="position" :value="indicateur_de_gouvernance.position" @keyup.enter="editTemporyIndicateur(indicateur_de_gouvernance.key, $event.target.value)" class="w-2/5 form-control" />
                        </template>
                        <template v-else>
                          <button class="p-1.5 text-primary" @click="handleEdit(indicateur_de_gouvernance.key)">
                            <Edit3Icon class="size-5" />
                          </button>
                          <button class="p-1.5 text-danger" @click="removeIndicator(indicateur_de_gouvernance.key)">
                            <TrashIcon class="size-5" />
                          </button>
                        </template>
                      </div>
                    </td>
                  </tr>
                </template>
              </template>
              <!-- Ligne Score factuel après chaque catégorie principale -->
            </template>
          </template>
        </tbody>

        <tbody v-else>
          <tr class="bg-transparent text-center">
            <td colspan="4" class="font-semibold">Aucune donnee</td>
          </tr>
        </tbody>
      </table>
    </div>

            <div class="flex justify-between py-2 my-2 items-center">
              <div class="flex justify-between">
                <button @click="goBackToFormList" class="px-5 mr-4 text-base btn btn-danger"><ArrowLeftIcon class="mr-1 size-5" />Annuler</button>
                <button @click="resetAllFormWithDataLocalStorage" class="px-5 text-base btn btn-outline-danger"><TrashIcon class="mr-1 size-5" />Vider</button>
              </div>
              <button @click="comeBackToCreation" class="px-5 text-base btn btn-primary"><RotateCcwIcon class="mr-1 size-5" />Revenir pour continuer</button>
            </div>
            </div>
            <LoaderSnipper v-else />
          </TabPanel>
          <TabPanel class="">
            <ListFormFactuel :fetch-data="fetchListForms" />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </section>
  </div>

  <Modal backdrop="static" :show="previewFormulaire" size="modal-xl" @hidden="previewFormulaire = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Formulaire factuel de gouvernance</h2>
    </ModalHeader>
    <ModalBody class="space-y-5">
      <table class="w-full border-collapse table-auto border-slate-500" cellpadding="10" cellspacing="0">
        <thead class="text-white bg-blue-900">
          <tr>
            <th class="py-3 border border-slate-900">Principes</th>
            <th class="py-3 border border-slate-900">Critères</th>
            <th class="py-3 border border-slate-900">Indicateurs</th>
            <th class="py-3 border border-slate-900">
              Réponses <br />( <template class="py-3 border border-slate-900" v-for="(options_de_reponse, idx) in previewOptionResponses.options_de_reponse" :key="options_de_reponse.id"> {{ options_de_reponse.libelle }} {{ idx < previewOptionResponses.options_de_reponse.length - 1 ? " / " : "" }} </template>)
            </th>
            <th class="py-3 border border-slate-900">Source de validation</th>
            <!-- 
            <th class="py-3 border border-slate-900">Réponses</th>
            <th class="py-3 border border-slate-900">Note</th>
            <th class="py-3 border border-slate-900">Source de validation</th>
            <th class="py-3 border border-slate-900 max-w-[200px]">Preuves</th> -->
          </tr>
        </thead>
        <tbody>
          <template v-for="type_de_gouvernance in previewTypesGouvernance.types_de_gouvernance" :key="type_de_gouvernance.id">
            <tr class="bg-green-100">
              <td colspan="7" class="font-semibold">{{ type_de_gouvernance.position }} - {{ type_de_gouvernance.nom }}</td>
            </tr>
            <template v-for="principe_de_gouvernance in type_de_gouvernance.principes_de_gouvernance" :key="principe_de_gouvernance.id">
              <template v-for="(critere_de_gouvernance, scIndex) in principe_de_gouvernance.criteres_de_gouvernance" :key="critere_de_gouvernance.id">
                <template v-for="(indicateur_de_gouvernance, qIndex) in critere_de_gouvernance.indicateurs_de_gouvernance" :key="indicateur_de_gouvernance.id">
                  <tr>
                    <!-- Première cellule de catégorie principale avec rowspan -->
                    <td class="font-semibold" v-if="scIndex === 0 && qIndex === 0" :rowspan="principe_de_gouvernance.criteres_de_gouvernance.reduce((sum, sc) => sum + sc.indicateurs_de_gouvernance.length, 0)">{{ principe_de_gouvernance.position }} - {{ principe_de_gouvernance.nom }}</td>

                    <!-- Première cellule de sous-catégorie avec rowspan -->
                    <td v-if="qIndex === 0" :rowspan="critere_de_gouvernance.indicateurs_de_gouvernance.length">{{ critere_de_gouvernance.position }} - {{ critere_de_gouvernance.nom }}</td>
                    <td>{{ indicateur_de_gouvernance.position }} - {{ indicateur_de_gouvernance.nom }}</td>
                    <td>{{}}</td>
                    <td>{{}}</td>
                  </tr>
                </template>
              </template>
              <!-- Ligne Score factuel après chaque catégorie principale -->
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
          Modifier
        </button>
      </div>
    </ModalFooter>
  </Modal>

  <!-- BEGIN: Modal Content -->
  <!-- size="modal-xl"  -->
  <Modal backdrop="static" :show="modalForm" @hidden="modalForm = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Modifier le formulaire</h2>
    </ModalHeader>
    <form @submit.prevent="updateForm">
      <ModalBody class="space-y-5">
        <!--  <div class="flex gap-4"></div> -->
        <div class="gap-4">
          <InputForm label="Libellé" class="w-full mb-4" v-model="payload.libelle" /><!-- 
          <div class="w-full">
            <label for="annee" class="form-label">Année</label>
            <TomSelect v-model="payload.annee_exercice" :options="{ placeholder: 'Selectionez une année' }"
              class="w-full">
              <option v-for="(year, index) in annees" :key="index" :value="year">{{ year }}</option>
            </TomSelect>
          </div> -->
        </div>
        <div>
          <p class="mb-3">Options de réponses</p>
          <ListOptionsResponse :options="previewOptionResponses.options_de_reponse" />
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
