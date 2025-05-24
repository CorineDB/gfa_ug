<script setup>
import { onBeforeUnmount, reactive, ref, computed, onMounted, watch } from "vue";
import { toast } from "vue3-toastify";
import OptionsResponse from "@/components/create-form/OptionsResponse.vue";
import TypeGouvernance from "@/components/create-form/TypeGouvernance.vue";
import PrincipeGouvernance from "@/components/create-form/PrincipeGouvernance.vue";
import CritereGouvernance from "@/components/create-form/CritereGouvernance.vue";
import IndicateurGouvernance from "@/components/create-form/IndicateurGouvernance.vue";
import FactuelStructure from "@/components/create-form/FactuelStructure.vue";
import MultipleFactuelStructure from "@/components/create-form/MultipleFactuelStructure.vue";
import ListAccordionIndicateur from "@/components/create-form/ListAccordionIndicateur.vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import FormulaireFactuel from "@/services/modules/formFactuel.service";
import PreviewFactuelForm from "@/components/create-form/PreviewFactuelForm.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import ListFormFactuel from "@/components/create-form/ListFormFactuel.vue";
import ListOptionsResponse from "@/components/create-form/ListOptionsResponse.vue";
import DeleteButton from "@/components/news/DeleteButton.vue";
import AuthService from "@/services/modules/auth.service";
import { useRoute, useRouter } from "vue-router";
import { getFieldErrors } from "../../utils/helpers";
import { useYearsStore } from "@/stores/years";
// import { helper as $h } from "@/utils/helper";

const yearsStore = useYearsStore();

const route = useRoute();
const router = useRouter();

const tabs = [
  {
    label: "FORMULAIRE FACTUEL",
    key: 0,
  },
  {
    label: "LISTE FORMULAIRE FACTUEL",
    key: 1,
  },
];

const currentTab = ref(0);
const indexAccordion = ref(0);
const resetCurrentForm = ref(false);
const modalForm = ref(false);
const isLoadingForm = ref(false);
const resetOptions = ref(false);
const fetchListForms = ref(false);
const showDeleteForm = ref(false);
const previewFormFactuelData = ref([]);
const globalFormFactuelData = ref([]);
const previewTypesGouvernance = ref({});
const globalTypesGouvernance = ref({});
const errors = ref({});
const previewOptionResponses = ref({ options_de_reponse: [] });
const globalOptionResponses = ref({ options_de_reponse: [] });
const typesGouvernance = ref({ types_de_gouvernance: [] });
const uniqueKeys = new Map();
const globalData = localStorage.getItem("globalFormFactuelData");
const previewData = localStorage.getItem("previewFormFactuelData");

const previewFormulaire = ref(false);

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
  factuel: { options_de_reponse: [], types_de_gouvernance: typesGouvernance.value.types_de_gouvernance },
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
  indicateurPosition: ""
});

const resetErrors = () => {
  modalForm.value = false;
  errors.value = {};
};

// Fonction pour générer une clé unique pour chaque soumission
const generateKey = (id) => {
  return `${id}`;
};

const currentGlobalFactuelFormDataArray = ref([]);
const currentPreviewFactuelFormDataArray = ref([]);

const organiseGlobalFormFactuelData = (submissions) => {
  submissions.forEach((submission) => {
    // Trouver ou créer le type de gouvernance
    let type = typesGouvernance.value.types_de_gouvernance.find((t) => t.id === submission.type);
    if (!type) {
      type = { id: submission.type, principes_de_gouvernance: [] };
      typesGouvernance.value.types_de_gouvernance.push(type);
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

  return typesGouvernance.value;
};

const organisePreviewFormFactuelData = (submissions) => {
  const organisedData = { types_de_gouvernance: [] };

  submissions.forEach((submission) => {
    // Trouver ou créer le type de gouvernance
    let type = organisedData.types_de_gouvernance.find((t) => t.id === submission.type.id);
    if (!type) {
      type = { id: submission.type.id, nom: submission.type.nom, key: submission.type.key, position: submission.type.position, principes_de_gouvernance: [] };
      organisedData.types_de_gouvernance.push(type);
    }

    // Assurer que principes_de_gouvernance est un tableau
    type.principes_de_gouvernance = type.principes_de_gouvernance || [];

    // Trouver ou créer le principe de gouvernance
    let principe = type.principes_de_gouvernance.find((p) => p.id === submission.principe.id);
    if (!principe) {
      principe = { id: submission.principe.id, nom: submission.principe.nom, key: submission.principe.key, position: submission.principe.position, criteres_de_gouvernance: [] };
      type.principes_de_gouvernance.push(principe);
    }

    // Assurer que criteres_de_gouvernance est un tableau
    principe.criteres_de_gouvernance = principe.criteres_de_gouvernance || [];

    // Trouver ou créer le critère de gouvernance
    let critere = principe.criteres_de_gouvernance.find((c) => c.id === submission.critere.id);
    if (!critere) {
      critere = { id: submission.critere.id, nom: submission.critere.nom, key: submission.critere.key, position: submission.critere.position, indicateurs_de_gouvernance: [] };
      principe.criteres_de_gouvernance.push(critere);
    }

    // Assurer que indicateurs_de_gouvernance est un tableau
    critere.indicateurs_de_gouvernance = critere.indicateurs_de_gouvernance || [];

    // Trouver ou créer l'indicateur de gouvernance
    let indicateur = critere.indicateurs_de_gouvernance.find((i) => i.id === submission.indicateur.id);
    if (!indicateur) {
      indicateur = { id: submission.indicateur.id, nom: submission.indicateur.nom, key: submission.indicateur.key, position: submission.indicateur.position };
      critere.indicateurs_de_gouvernance.push(indicateur);
    }
  });

  return organisedData;
};

const resetCurrentPreviewFactuelFormData = () => {
  // for (const key in currentPreviewFactuelFormData) {
  //   currentPreviewFactuelFormData[key] = { id: "", nom: "" };
  // }  

  currentPreviewFactuelFormData.principe = { id: "", nom: "", position: 0 };
  currentPreviewFactuelFormData.critere = { id: "", nom: "", position: 0 };
  currentPreviewFactuelFormData.indicateur = { id: "", nom: "", position: 0 };
  currentPreviewFactuelFormData.type = { id: "", nom: "", position: 0 };

  currentPreviewFactuelFormDataArray.value = [];
};

const resetCurrentGlobalFactuelFormData = () => {
  // Object.keys(currentGlobalFactuelFormData).forEach((key) => {
  //   currentGlobalFactuelFormData[key] = "";
  // });
  //currentGlobalFactuelFormData.indicateur = "";

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

const updateAllTypesGouvernance = () => {
  globalTypesGouvernance.value = organiseGlobalFormFactuelData(globalFormFactuelData.value);
  previewTypesGouvernance.value = organisePreviewFormFactuelData(previewFormFactuelData.value);
};

const changeIndexAccordion = (index) => {
  indexAccordion.value = index;
};

const getType = (type) => {
  changeIndexAccordion(1);
  currentGlobalFactuelFormData.type = type.id;
  currentPreviewFactuelFormData.type = { id: type.id, nom: type.nom };
};

const getTypes = (type) => {
  changeIndexAccordion(1);
  currentGlobalFactuelFormData.type = type.id;

  let position = new Set(
    (globalFormFactuelData.value || [])
      .map(item => item.type)
      .filter(val => val !== null && val !== undefined && val !== "")
  ).size;

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

const getPrincipe = (principe) => {
  changeIndexAccordion(2);
  currentGlobalFactuelFormData.principe = principe.id;
  currentPreviewFactuelFormData.principe = { id: principe.id, nom: principe.nom };
};

const getPrincipes = (principe) => {
  changeIndexAccordion(2);
  currentGlobalFactuelFormData.principe = principe.id;

  let position = new Set(
    (globalFormFactuelData.value || [])
      .filter(val => val.type == currentGlobalFactuelFormData.type)
      .map(item => item.principe)
      .filter(val => val !== null && val !== undefined && val !== "")
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

const getCritere = (critere) => {
  changeIndexAccordion(3);
  currentGlobalFactuelFormData.critere = critere.id;
  currentPreviewFactuelFormData.critere = { id: critere.id, nom: critere.nom };
};

const getCriteres = (critere) => {
  changeIndexAccordion(3);
  currentGlobalFactuelFormData.critere = critere.id;

  let position = new Set(
    (globalFormFactuelData.value || [])
      .filter(val => val.principe == currentGlobalFactuelFormData.principe)
      .map(item => item.critere)
      .filter(val => val !== null && val !== undefined && val !== "")
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

const getIndicateur = (indicateur) => {
  changeIndexAccordion(4);
  currentGlobalFactuelFormData.indicateur = indicateur.id;
  currentPreviewFactuelFormData.indicateur = { id: indicateur.id, nom: indicateur.nom };
};

const getIndicateurs = (indicateur) => {
  console.log("indicateur", indicateur);
  changeIndexAccordion(4);
  currentGlobalFactuelFormData.indicateur = indicateur.id;

  /* 
    let donnee = (globalFormFactuelData.value || [])
    .filter(item => item.critere === currentGlobalFactuelFormData.critere)
    .map(item => item.indicateur)
    .filter(val => val !== null && val !== undefined && val !== "");
  */

  let donnee = (currentGlobalFactuelFormDataArray.value || [])
    .filter(item => item.critere === currentGlobalFactuelFormData.critere)
    .map(item => item.indicateur)
    .filter(val => val !== null && val !== undefined && val !== "");

  console.log("donnee");
  console.log(donnee);
  console.log(donnee.length);

  let position = new Set(donnee).size;

  /* let position = new Set(
    (globalFormFactuelData.value || [])
      .map(item => item.indicateur)
      .filter(val => { console.log(val); return val !== null && val !== undefined && val !== "" && val.critere == currentGlobalFactuelFormData.critere;})
  ).size; */
  console.log(position);

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
    indicateurPosition: position
  };

  currentGlobalFactuelFormDataArray.value.push(form);

  console.log("currentGlobalFactuelFormDataArray.value", currentGlobalFactuelFormDataArray.value);

  currentPreviewFactuelFormData.indicateur = { id: indicateur.id, nom: indicateur.nom, key: key, position: position };

  let form2 = {
    type: currentPreviewFactuelFormData.type ?? {
      id: "",
      nom: "",
      key: "",
      position: 0
    },
    principe: currentPreviewFactuelFormData.principe ?? {
      id: "",
      nom: "",
      key: "",
      position: 0
    },
    critere: currentPreviewFactuelFormData.critere ?? {
      id: "",
      nom: "",
      key: key,
      position: 0
    },
    indicateur: currentPreviewFactuelFormData.indicateur
  };

  currentPreviewFactuelFormDataArray.value.push(form2);

  console.log("currentPreviewFactuelFormDataArray.value", currentPreviewFactuelFormDataArray.value);
};

/* 
const addNewIndicator = () => {
  const key = generateKey(currentGlobalFactuelFormData.indicateur);

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
*/

const addNewIndicator = () => {

  currentGlobalFactuelFormDataArray.value.forEach((item, index) => {
    const typeKey = generateKey(item.typeKey);
    const critereKey = generateKey(item.critereKey + typeKey);
    const principeKey = generateKey(item.principeKey + critereKey);
    const indicateurKey = generateKey(item.indicateurKey + critereKey);
    const key = indicateurKey;

    console.log("critereKey.value", critereKey)

    if (!uniqueKeys.has(key)) {

      item = {
        ...item,
        typeKey: typeKey,
        principeKey: principeKey,
        critereKey: critereKey,
        indicateurKey: indicateurKey,
      };

      const preview = {
        ...currentPreviewFactuelFormDataArray.value[index],
      };

      preview.type.key = typeKey;
      preview.principe.key = principeKey;
      preview.critere.key = critereKey;
      preview.indicateur.key = indicateurKey;


      console.log("preview.critere.key", preview.critere.key)

      globalFormFactuelData.value.unshift({ ...item });

      //previewFormFactuelData.value.unshift(JSON.parse(JSON.stringify(currentPreviewFactuelFormDataArray.value[index])));
      previewFormFactuelData.value.unshift(JSON.parse(JSON.stringify(preview)));

      console.log("previewFormFactuelData.value", previewFormFactuelData.value);
      console.log("critereKey.value", critereKey)
      uniqueKeys.set(key, true);
      uniqueKeys.set(critereKey, true);
      uniqueKeys.set(principeKey, true);
      uniqueKeys.set(typeKey, true);
      localStorage.setItem("globalFormFactuelData", JSON.stringify(globalFormFactuelData.value));
      localStorage.setItem("previewFormFactuelData", JSON.stringify(previewFormFactuelData.value));

      updateAllTypesGouvernance();

      if (index === currentGlobalFactuelFormDataArray.value.length - 1) {
        resetCurrentPreviewFactuelFormData();
        resetCurrentGlobalFactuelFormData();
        resetCurrentForm.value = !resetCurrentForm.value;
      }

      toast.success("Indicateur ajouté.");
    } else {
      toast.info("Indicateur deja ajouté.");
    }
  });
  console.log("currentGlobalFactuelFormDataArray.value", currentGlobalFactuelFormDataArray.value);

  console.log("currentPreviewFactuelFormDataArray.value", currentPreviewFactuelFormDataArray.value);
};

const removeIndicator = (key) => {
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

  updateAllTypesGouvernance();
  showDeleteForm.value = false;
  // toast.success("Formulaire supprimé.");
};

const removeElement = (key, type = 'critere') => {
  console.log(key);
  const typeKey = type + "Key";

  // Remove from globalFormFactuelData
  for (let i = globalFormFactuelData.value.length - 1; i >= 0; i--) {
    if (globalFormFactuelData.value[i][typeKey] === key) {
      globalFormFactuelData.value.splice(i, 1);

      if (uniqueKeys.has(globalFormFactuelData.value[i]?.[typeKey])) {
        uniqueKeys.delete(globalFormFactuelData.value[i][typeKey]);
      }

      if (uniqueKeys.has(globalFormFactuelData.value[i]?.["indicateurKey"])) {
        uniqueKeys.delete(globalFormFactuelData.value[i]["indicateurKey"]);
      }

      if (type == "principe") {
        if (uniqueKeys.has(globalFormFactuelData.value[i]?.["critereKey"])) {
          uniqueKeys.delete(globalFormFactuelData.value[i]["critereKey"]);
        }
      }

      if (type == "type") {
        if (uniqueKeys.has(globalFormFactuelData.value[i]?.["critereKey"])) {
          uniqueKeys.delete(globalFormFactuelData.value[i]["critereKey"]);
        }

        if (uniqueKeys.has(globalFormFactuelData.value[i]?.["principeKey"])) {
          uniqueKeys.delete(globalFormFactuelData.value[i]["principeKey"]);
        }
      }

    }
  }

  // Remove from previewFormFactuelData
  for (let i = previewFormFactuelData.value.length - 1; i >= 0; i--) {
    console.log(previewFormFactuelData.value[i]);
    if (previewFormFactuelData.value[i][type]["key"] === key) {
      previewFormFactuelData.value.splice(i, 1);
    }
  }

  // Recalculate and update
  updateAllTypesGouvernance();

  // Persist to localStorage
  localStorage.setItem("globalFormFactuelData", JSON.stringify(globalFormFactuelData.value));
  localStorage.setItem("previewFormFactuelData", JSON.stringify(previewFormFactuelData.value));

  toast.success("Élément(s) supprimé(s).");
};


const showDeleteButton = computed(() => {
  if (localStorage.getItem("globalFormFactuelData") || localStorage.getItem("previewFormFactuelData") || localStorage.getItem("globalOptionResponses")) {
    return true;
  } else {
    return false;
  }
});
const resetForm = () => {
  payload.libelle = "";
  modalForm.value = false;
};
const createForm = async () => {
  isLoadingForm.value = true;
  payload.factuel.options_de_reponse = globalOptionResponses.value.options_de_reponse;

  try {
    await FormulaireFactuel.create(payload);
    toast.success(`Formulaire créé avec succès.`);
    fetchListForms.value = !fetchListForms.value;
    // resetForm();
    resetAllFormWithDataLocalStorage();
    clearUniqueKeys();
    errors.value = {};
    modalForm.value = false;
    router.push({ name: "Ajouter_un_formulaire_Factuel", query: { tab: 1 } });
  } catch (e) {
    if (e.response && e.response.status === 422) {
      errors.value = e.response.data.errors;
      toast.error(`Une erreur est survenu dans le formulaire.`);
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

const selectTab = function (tab) {
  currentTab.value = tab
  if (tab) {
    router.push({ name: "Ajouter_un_formulaire_Factuel", query: { tab: tab } });
  }
  else {
    router.push({ name: "Ajouter_un_formulaire_Factuel" });
  }
}

onBeforeUnmount(() => {
  clearUniqueKeys();
});

watch(() => {
  console.log(route.query.tab)
  console.log(currentTab.value)
  if (route.query.tab) {
    currentTab.value = Number(route.query.tab);
  }
  else { currentTab.value = 0 }
  console.log(currentTab.value)
});

onMounted(() => {
  if (route.query.tab) currentTab.value = Number(route.query.tab);

  if (globalData && previewData) {
    globalFormFactuelData.value = JSON.parse(globalData);
    previewFormFactuelData.value = JSON.parse(previewData);
    // previewOptionResponsesModel.value = JSON.parse(localStorage.getItem("previewOptionResponsesModel"));
    // globalOptionResponses.value = JSON.parse(localStorage.getItem("globalOptionResponses"));
  }
  updateAllTypesGouvernance();
  getcurrentUser();
});
</script>

<template>
  <div class="flex w-full gap-2">
    <section v-if="!currentTab" class=" max-h-[50%] pr-1 overflow-y-auto border-r-2 pt-5"
      :class="currentTab ? 'w-0' : 'w-[30%]'">
      <AccordionGroup :selectedIndex="indexAccordion" class="space-y-1">
        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Type de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <TypeGouvernance :to-reset="false" :is-available="isAvailable.type" @selected="getTypes" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Principe de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <PrincipeGouvernance :to-reset="false" :is-available="isAvailable.principe" @selected="getPrincipes" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Critères de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <CritereGouvernance :to-reset="false" :is-available="isAvailable.critere" @selected="getCriteres" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Indicateurs de gouvernance</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <IndicateurGouvernance :to-reset="resetCurrentForm" :is-available="isAvailable.indicateur"
              @selected="getIndicateurs" />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Options de réponses</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <OptionsResponse :is-reset="resetOptions" :factuel="true"
              v-model:previewOptionResponses="previewOptionResponses"
              v-model:globalOptionResponses="globalOptionResponses" />
          </AccordionPanel>
        </AccordionItem>
      </AccordionGroup>
    </section>

    <section class="w-[70%] max-h-[50%] pt-5" :class="{ 'w-full': currentTab }">
      <TabGroup :selectedIndex="currentTab">
        <TabList class="nav-boxed-tabs">
          <Tab @click="selectTab(tab.key)" v-for="(tab, indexTab) in tabs" :key="indexTab" class="w-full py-2"
            tag="button">{{ tab.label }}</Tab>
        </TabList>
        <TabPanels class="mt-5">
          <TabPanel class="leading-relaxed">
            <div v-if="currentPreviewFactuelFormData.indicateur.nom !== ''" class="flex items-end justify-end"><button
                @click="showDeleteForm = true" class="btn btn-outline-danger">Supprimer le formulaire</button></div>
            <div class="flex flex-col gap-8">
              <div class="space-y-2">
                <p class="text-lg font-medium">Liste des options de réponses</p>
                <ListOptionsResponse :options="previewOptionResponses.options_de_reponse" />
              </div>
              <div class="space-y-2">
                <!-- <pre>{{ currentPreviewFactuelFormData.indicateur.nom }}</pre> -->
                <p class="text-lg font-medium">Ajouter des indicateurs</p>
                <MultipleFactuelStructure :type="currentPreviewFactuelFormData.type.nom"
                  :principe="currentPreviewFactuelFormData.principe.nom"
                  :critere="currentPreviewFactuelFormData.critere.nom"
                  :indicateurArray="currentPreviewFactuelFormDataArray.length > 0 ? currentPreviewFactuelFormDataArray : []" />
                <button :disabled="!isCurrentFormValid" @click="addNewIndicator" class="my-4 text-sm btn btn-primary">
                  <PlusIcon class="mr-1 size-4" />Ajouter
                </button>
              </div>
            </div>
          </TabPanel>
          <TabPanel class="">
            <ListFormFactuel :fetch-data="fetchListForms" />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </section>
  </div>

  <div v-if="!currentTab" class="space-y-2 mt-6">
    <div class="flex justify-between items-center py-2">
      <p class="text-lg font-medium">Previsualisation du formulaire factuel</p>

      <div class="flex justify-spacely py-2" v-if="previewTypesGouvernance?.types_de_gouvernance?.length">
        <button :disabled="!showForm" @click="previewForm" class="mr-5 px-5 text-base btn btn-primary">
          <CheckIcon class="mr-1 size-5" />Enregistrer
        </button>
        <button :disabled="!showForm" @click="previewFormulaire = true" class="px-5 text-base btn btn-primary">
          <EyeIcon class="mr-1 size-5" />Voir le formumlaire
        </button>
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
          <template v-for="type_de_gouvernance in previewTypesGouvernance.types_de_gouvernance.reverse()"
            :key="type_de_gouvernance.id">
            <tr class="bg-green-100 list-data">
              <td colspan="3" class="font-semibold">{{ type_de_gouvernance.nom }}</td>

              <td class="items-center transition-all opacity-0 container-buttons">
                <button class="p-1.5 text-primary">
                  <Edit3Icon class="size-5" />
                </button>
                <button class="p-1.5 text-danger" @click="removeElement(type_de_gouvernance.key, 'type')">
                  <TrashIcon class="size-5" />
                </button>
              </td>
            </tr>
            <template v-for="principe_de_gouvernance in type_de_gouvernance.principes_de_gouvernance.reverse()"
              :key="principe_de_gouvernance.id">
              <template v-for="(critere_de_gouvernance, scIndex) in principe_de_gouvernance.criteres_de_gouvernance.reverse()"
                :key="critere_de_gouvernance.id">
                <template
                  v-for="(indicateur_de_gouvernance, qIndex) in critere_de_gouvernance.indicateurs_de_gouvernance.reverse()"
                  :key="indicateur_de_gouvernance.id">
                  <tr>
                    <!-- Première cellule de catégorie principale avec rowspan -->
                    <td class="font-semibold text-center list-data" v-if="scIndex === 0 && qIndex === 0"
                      :rowspan="principe_de_gouvernance.criteres_de_gouvernance.reduce((sum, sc) => sum + sc.indicateurs_de_gouvernance.length, 0)">
                      <div class="flex items-center gap-1">{{ principe_de_gouvernance.nom }}</div>

                      <div class="items-center transition-all opacity-0 container-buttons">
                        <button class="p-1.5 text-primary">
                          <Edit3Icon class="size-5" />
                        </button>
                        <button class="p-1.5 text-danger"
                          @click="removeElement(principe_de_gouvernance.key, 'principe')">
                          <TrashIcon class="size-5" />
                        </button>
                      </div>
                    </td>
                    <!-- Première cellule de sous-catégorie avec rowspan -->
                    <td class="text-center list-data" v-if="qIndex === 0"
                      :rowspan="critere_de_gouvernance.indicateurs_de_gouvernance.length">
                      <div class="flex items-center gap-1">{{ critere_de_gouvernance.nom }}</div>

                      <div class="flex items-center transition-all opacity-0 container-buttons">
                        <button class="p-1.5 text-primary">
                          <Edit3Icon class="size-5" />
                        </button>
                        <button class="p-1.5 text-danger" @click="removeElement(critere_de_gouvernance.key, 'critere')">
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
                        <button class="p-1.5 text-danger" @click="removeIndicator(indicateur_de_gouvernance.key)">
                          <TrashIcon class="size-5" />
                        </button>
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
      <button @click="goBackToFormList" class="px-5 text-base btn btn-danger">
        <ArrowLeftIcon class="mr-1 size-5" />Annuler
      </button>
      <button @click="comeBackToCreation" class="px-5 text-base btn btn-primary">
        <RotateCcwIcon class="mr-1 size-5" />Revenir pour continuer
      </button>
    </div>
  </div>
  <Modal backdrop="static" :show="previewFormulaire" size="modal-xl" @hidden="previewFormulaire = false">

    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Formulaire factuel de gouvernance </h2>
    </ModalHeader>
    <ModalBody class="space-y-5">
      <table class="w-full border-collapse table-auto border-slate-500" cellpadding="10" cellspacing="0">
        <thead class="text-white bg-blue-900">
          <tr>
            <th class="py-3 border border-slate-900">Principes</th>
            <th class="py-3 border border-slate-900">Critères</th>
            <th class="py-3 border border-slate-900">Indicateurs</th>
            <th class="py-3 border border-slate-900">
              Réponses <br />(
              <template class="py-3 border border-slate-900"
                v-for="(options_de_reponse, idx) in previewOptionResponses.options_de_reponse"
                :key="options_de_reponse.id">
                {{ options_de_reponse.libelle }} {{ idx < (previewOptionResponses.options_de_reponse.length - 1) ? ' / '
                  : '' }} </template>)
            </th>
            <th class="py-3 border border-slate-900">Source de validation</th><!-- 
            <th class="py-3 border border-slate-900">Réponses</th>
            <th class="py-3 border border-slate-900">Note</th>
            <th class="py-3 border border-slate-900">Source de validation</th>
            <th class="py-3 border border-slate-900 max-w-[200px]">Preuves</th> -->
          </tr>
        </thead>
        <tbody>

          <template v-for="type_de_gouvernance in previewTypesGouvernance.types_de_gouvernance"
            :key="type_de_gouvernance.id">
            <tr class="bg-green-100">
              <td colspan="7" class="font-semibold">{{ type_de_gouvernance.nom }}</td>
            </tr>
            <template v-for="principe_de_gouvernance in type_de_gouvernance.principes_de_gouvernance"
              :key="principe_de_gouvernance.id">
              <template v-for="(critere_de_gouvernance, scIndex) in principe_de_gouvernance.criteres_de_gouvernance"
                :key="critere_de_gouvernance.id">
                <template
                  v-for="(indicateur_de_gouvernance, qIndex) in critere_de_gouvernance.indicateurs_de_gouvernance"
                  :key="indicateur_de_gouvernance.id">

                  <tr>
                    <!-- Première cellule de catégorie principale avec rowspan -->
                    <td class="font-semibold text-center" v-if="scIndex === 0 && qIndex === 0"
                      :rowspan="principe_de_gouvernance.criteres_de_gouvernance.reduce((sum, sc) => sum + sc.indicateurs_de_gouvernance.length, 0)">
                      {{ principe_de_gouvernance.nom }}
                    </td>

                    <!-- Première cellule de sous-catégorie avec rowspan -->
                    <td class="text-center" v-if="qIndex === 0"
                      :rowspan="critere_de_gouvernance.indicateurs_de_gouvernance.length">
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
    </ModalBody>
    <ModalFooter>
      <div class="flex gap-2">
        <button type="button" @click="previewFormulaire = false;"
          class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Fermer</button>
        <button type="button" @click="previewFormulaire = false; previewForm();"
          class="w-full px-2 py-2 my-3 btn btn-primary">Enregistrer</button>
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
          <InputForm label="Libellé" class="w-full mb-4" :control="getFieldErrors(errors.libelle)"
            v-model="payload.libelle" />
          <div class="w-full">
            <label for="annee" class="form-label">Année<span class="text-danger">*</span> </label>
            <TomSelect v-model="payload.annee_exercice" :options="{ placeholder: 'Selectionez une année' }"
              class="w-full">
              <option v-for="(year, index) in annees" :key="index" :value="year">{{ year }}</option>
            </TomSelect>
            <!-- <input id="annee" type="number" required v-model.number="payload.annee_exercice" class="form-control" placeholder="Année" /> -->
            <div v-if="errors.annee_exercice" class="mt-2 text-danger">{{ getFieldErrors(errors.annee_exercice) }}</div>
          </div>

          <div>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12 my-2"
              v-if="errors['factuel.options_de_reponse.0.point']">
              {{ extractMessage(errors["factuel.options_de_reponse.0.point"]) }}</p>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12 my-2"
              v-if="errors['factuel.options_de_reponse.0.point']">
              {{ extractMessage(errors["factuel.options_de_reponse.0.point"]) }}</p>
          </div>
        </div>
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

  <!-- BEGIN: Modal Content -->
  <!-- <Modal backdrop="static" size="modal-xl" :show="modalForm === !modalForm" @hidden="modalForm = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Enregistrer le formulaire</h2>
    </ModalHeader>
    <form @submit.prevent="createForm">
      <ModalBody class="space-y-5">
        <div class="flex gap-4">
          <InputForm label="Libellé" class="w-full" :control="getFieldErrors(errors.libelle)"
            v-model="payload.libelle" />
          <div class="w-full">
            <div class="flex-1">
              <label class="form-label">Année cible<span class="text-danger">*</span> </label>
              <TomSelect v-model="payload.annee_exercice" name="annee_aggrer"
                :options="{ placeholder: 'Selectionez une année' }" class="w-full">
                <option value=""></option>
                <option v-for="annee in annees" :key="annee" :value="annee">{{ annee }}</option>
              </TomSelect>

              <TomSelect v-model="payload.annee_exercice" :options="{ placeholder: 'Selectionez une année' }"
                class="w-full">
                <option v-for="(year, index) in yearsStore.getYears" :key="index" :value="year">{{ year }}</option>
              </TomSelect>

            </div>
            <div v-if="errors.annee_exercice" class="mt-2 text-danger">{{ getFieldErrors(errors.annee_exercice) }}</div>
          </div>
        </div>
        <div>
          <p class="text-red-500 text-[12px] -mt-2 col-span-12 my-2"
            v-if="errors['factuel.options_de_reponse.0.point']">
            {{ extractMessage(errors["factuel.options_de_reponse.0.point"]) }}</p>
          <p class="text-red-500 text-[12px] -mt-2 col-span-12 my-2"
            v-if="errors['factuel.options_de_reponse.0.point']">
            {{ extractMessage(errors["factuel.options_de_reponse.0.point"]) }}</p>

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
          <button type="button" @click="resetErrors"
            class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoadingForm" label="Enregistrer" />
        </div>
      </ModalFooter>
    </form>
  </Modal> -->
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
</style>
