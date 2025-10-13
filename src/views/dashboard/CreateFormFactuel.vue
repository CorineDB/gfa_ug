<script setup>
import { onBeforeUnmount, reactive, ref, computed, onMounted, watch, provide } from "vue";
import { toast } from "vue3-toastify";
//import OptionsResponse from "@/components/create-form/OptionsResponse.vue";
import OptionsResponseFactuel from "@/components/create-form/OptionsResponseFactuel.vue";
import TypeGouvernance from "@/components/create-form/TypeGouvernance.vue";
import PrincipeDeGouvernanceFactuel from "@/components/create-form/PrincipeDeGouvernanceFactuel.vue";
import CritereDeGouvernanceFactuel from "@/components/create-form/CritereDeGouvernanceFactuel.vue";
import IndicateurGouvernance from "@/components/create-form/IndicateurGouvernance.vue";
import FactuelStructure from "@/components/create-form/FactuelStructure.vue";

//permet d'afficher les différents elements selectionnnés dans le formulaire factuel
import MultipleFactuelStructure from "@/components/create-form/MultipleFactuelStructure.vue";

import ListAccordionIndicateur from "@/components/create-form/ListAccordionIndicateur.vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
//import FormulaireFactuel from "@/services/modules/formFactuel.service";

import FormulaireFactuel from "@/services/modules/enquetes_de_gouvernance/formFactuel.service";
import OptionReponse from "@/services/modules/enquetes_de_gouvernance/optionReponse.service";

import PreviewFactuelForm from "@/components/create-form/PreviewFactuelForm.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import ListFormFactuel from "@/components/create-form/ListFormFactuel.vue";
import ListOptionsResponse from "@/components/create-form/ListOptionsResponse.vue";
import DeleteButton from "@/components/news/DeleteButton.vue";
import AuthService from "@/services/modules/auth.service";
import { useRoute, useRouter } from "vue-router";
import { getFieldErrors } from "../../utils/helpers";
import { useYearsStore } from "@/stores/years";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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
const showModifyModal = ref(false);
const modifyElement = reactive({
  key: '',
  type: '', // 'type', 'principe', 'critere', 'indicateur'
  currentData: {},
  newParentId: '',
  availableParents: []
});

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

// représente les informations du formulaire actuelle
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
    //let type = typesGouvernance.value.types_de_gouvernance.find((t) => t.id === submission.type);

    let type = typesGouvernance.value.types_de_gouvernance.find((p) => p.id === submission.type.id);

    if (!type) {
      type = { id: submission.type.id, position: submission.type.position, principes_de_gouvernance: [] };
      typesGouvernance.value.types_de_gouvernance.push(type);
    }

    // Trouver ou créer le principe de gouvernance
    let principe = type.principes_de_gouvernance.find((p) => p.id === submission.principe.id);
    if (!principe) {
      principe = { id: submission.principe.id, position: submission.principe.position, criteres_de_gouvernance: [] };
      type.principes_de_gouvernance.push(principe);
    }

    // Trouver ou créer le critère de gouvernance
    let critere = principe.criteres_de_gouvernance.find((c) => c.id === submission.critere.id);
    if (!critere) {
      //critere = { id: submission.critere, indicateurs_de_gouvernance: [] };
      critere = { id: submission.critere.id, position: submission.critere.position, indicateurs_de_gouvernance: [] };
      principe.criteres_de_gouvernance.push(critere);
    }

    // Ajouter l'indicateur de gouvernance s'il n'est pas déjà présent
    //if (!critere.indicateurs_de_gouvernance.includes(submission.indicateur)) {

    let indicateur = critere.indicateurs_de_gouvernance.find((i) => i.id === submission.indicateur.id);
    if (!indicateur) {
      critere.indicateurs_de_gouvernance.push({ id: submission.indicateur.id, position: submission.indicateur.position });

      //critere.indicateurs_de_gouvernance.push(submission.indicateur);
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

  currentPreviewFactuelFormData.principe = { id: "", nom: "", key: "", position: 0 };
  currentPreviewFactuelFormData.critere = { id: "", nom: "", key: "", position: 0 };
  currentPreviewFactuelFormData.indicateur = { id: "", nom: "", key: "", position: 0 };
  currentPreviewFactuelFormData.type = { id: "", nom: "", key: "", position: 0 };

  

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
  
  globalFormFactuelData.value = [];
  previewFormFactuelData.value = [];
};

const updateAllTypesGouvernance = () => {
  //globalTypesGouvernance.value = organiseGlobalFormFactuelData(globalFormFactuelData.value);
  globalTypesGouvernance.value = organiseGlobalFormFactuelData(previewFormFactuelData.value);
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

const getIndicateur = (indicateur) => {
  changeIndexAccordion(4);
  currentGlobalFactuelFormData.indicateur = indicateur.id;
  currentPreviewFactuelFormData.indicateur = { id: indicateur.id, nom: indicateur.nom };
};

const getIndicateurs = (indicateur) => {
  // Vérifier si l'indicateur existe déjà dans currentPreviewFactuelFormDataArray
  const indicateurExiste = currentPreviewFactuelFormDataArray.value.some(item => item.indicateur.id === indicateur.id);

  if (indicateurExiste) {
    toast.error("Cet indicateur a déjà été sélectionné");
    return;
  }

  // changeIndexAccordion(4);
  currentGlobalFactuelFormData.indicateur = indicateur.id;

  /*
    let donnee = (globalFormFactuelData.value || [])
    .filter(item => item.critere === currentGlobalFactuelFormData.critere)
    .map(item => item.indicateur)
    .filter(val => val !== null && val !== undefined && val !== "");
  */

  // Compter les indicateurs déjà persistés pour ce critère (même type, principe, critère)
  let indicateursPersistes = (globalFormFactuelData.value || []).filter((item) => 
    item.type === currentGlobalFactuelFormData.type && 
    item.principe === currentGlobalFactuelFormData.principe && 
    item.critere === currentGlobalFactuelFormData.critere
  );

  // Compter les indicateurs en cours d'ajout pour ce critère
  let indicateursEnCours = (currentGlobalFactuelFormDataArray.value || []).filter((item) => 
    item.type === currentGlobalFactuelFormData.type && 
    item.principe === currentGlobalFactuelFormData.principe && 
    item.critere === currentGlobalFactuelFormData.critere
  );

  let position = indicateursPersistes.length + indicateursEnCours.length + 1;

 

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

  
};

// ===========================================
// SYSTÈME DE COMPTEURS HIÉRARCHIQUES SIMPLIFIÉ
// ===========================================

// Compteurs hiérarchiques
let counters = {
  type: 0,
  principe: 0,
  critere: 0,
  indicateur: 0,
};

// Dernier chemin traité
let lastPath = {
  type: null,
  principe: null,
  critere: null,
};

// Fonction pour reset complet du système
const resetPathSystem = () => {
  counters = {
    type: 0,
    principe: 0,
    critere: 0,
    indicateur: 0,
  };
  
  lastPath = {
    type: null,
    principe: null,
    critere: null,
  };
};

// FONCTION PRINCIPALE addNewIndicator - Version avec incrémentation continue des indicateurs
const addNewIndicator = () => {
  const sessionKeys = new Set();

  currentGlobalFactuelFormDataArray.value.forEach((item, index) => {
    // Calculer les positions basées sur les données existantes
    
    // Position du type : compter les types uniques déjà existants + en cours
    const typesExistants = new Set(globalFormFactuelData.value.map(i => i.type).filter(Boolean));
    const typesEnCours = new Set(currentGlobalFactuelFormDataArray.value.slice(0, index).map(i => i.type).filter(Boolean));
    const allTypes = new Set([...typesExistants, ...typesEnCours]);
    
    const typePosition = item.type && !allTypes.has(item.type) ? 
      allTypes.size + 1 : 
      [...allTypes].indexOf(item.type) + 1;

    // Position du principe : compter les principes uniques pour ce type
    const principesExistants = new Set(
      globalFormFactuelData.value
        .filter(i => i.type === item.type)
        .map(i => i.principe)
        .filter(Boolean)
    );
    const principesEnCours = new Set(
      currentGlobalFactuelFormDataArray.value
        .slice(0, index)
        .filter(i => i.type === item.type)
        .map(i => i.principe)
        .filter(Boolean)
    );
    const allPrincipes = new Set([...principesExistants, ...principesEnCours]);
    
    const principePosition = item.principe && !allPrincipes.has(item.principe) ? 
      allPrincipes.size + 1 : 
      [...allPrincipes].indexOf(item.principe) + 1;

    // Position du critère : compter les critères uniques pour ce principe
    const criteresExistants = new Set(
      globalFormFactuelData.value
        .filter(i => i.type === item.type && i.principe === item.principe)
        .map(i => i.critere)
        .filter(Boolean)
    );
    const criteresEnCours = new Set(
      currentGlobalFactuelFormDataArray.value
        .slice(0, index)
        .filter(i => i.type === item.type && i.principe === item.principe)
        .map(i => i.critere)
        .filter(Boolean)
    );
    const allCriteres = new Set([...criteresExistants, ...criteresEnCours]);
    
    const criterePosition = item.critere && !allCriteres.has(item.critere) ? 
      allCriteres.size + 1 : 
      [...allCriteres].indexOf(item.critere) + 1;

    // Utiliser la position déjà calculée dans getIndicateurs
    const indicateurPosition = item.indicateurPosition || 1;
    
    

    // Génération des clés hiérarchiques avec les positions calculées
    const typeKey = `type_${typePosition}`;
    const principeKey = `${typeKey}_principe_${principePosition}`;
    const critereKey = `${principeKey}_critere_${criterePosition}`;
    const indicateurKey = `${critereKey}_indicateur_${indicateurPosition}`;

    
    sessionKeys.add(indicateurKey);

    // Vérifier unicité
    if (!uniqueKeys.has(indicateurKey)) {
      const updatedItem = {
        ...item,
        typeKey,
        principeKey,
        critereKey,
        indicateurKey,
        typePosition,
        principePosition,
        criterePosition,
        indicateurPosition,
      };

      const preview = {
        ...currentPreviewFactuelFormDataArray.value[index],
        type: { ...currentPreviewFactuelFormDataArray.value[index].type, key: typeKey, position: typePosition },
        principe: { ...currentPreviewFactuelFormDataArray.value[index].principe, key: principeKey, position: principePosition },
        critere: { ...currentPreviewFactuelFormDataArray.value[index].critere, key: critereKey, position: criterePosition },
        indicateur: { ...currentPreviewFactuelFormDataArray.value[index].indicateur, key: indicateurKey, position: indicateurPosition },
      };

     
      // Ajouter aux données
      globalFormFactuelData.value.unshift({ ...updatedItem });
      previewFormFactuelData.value.unshift(JSON.parse(JSON.stringify(preview)));

      // Tri par positions
      globalFormFactuelData.value.sort((a, b) => {
        return a.typePosition - b.typePosition ||
               a.principePosition - b.principePosition ||
               a.criterePosition - b.criterePosition ||
               a.indicateurPosition - b.indicateurPosition;
      });

      previewFormFactuelData.value.sort((a, b) => {
        return a.type.position - b.type.position ||
               a.principe.position - b.principe.position ||
               a.critere.position - b.critere.position ||
               a.indicateur.position - b.indicateur.position;
      });

      // Sauvegarde localStorage
      localStorage.setItem("globalFormFactuelData", JSON.stringify(globalFormFactuelData.value));
      localStorage.setItem("previewFormFactuelData", JSON.stringify(previewFormFactuelData.value));

      updateAllTypesGouvernance();

      // Reset du formulaire après le dernier ajout
      if (index === currentGlobalFactuelFormDataArray.value.length - 1) {
        resetCurrentPreviewFactuelFormData();
        resetCurrentGlobalFactuelFormData();
        resetCurrentForm.value = !resetCurrentForm.value;
      }

      toast.success("Indicateur ajouté.");
    } else {
      toast.info("Indicateur déjà ajouté.");
    }

    // Marquer la clé comme utilisée
    uniqueKeys.set(indicateurKey, true);
  });

};

// ===========================================
// FIN DU NOUVEAU SYSTÈME
// ===========================================

const removeIndicator = (key) => {
  // Trouver l'index de la soumission à supprimer
  const index = globalFormFactuelData.value.findIndex((s) => s.indicateurKey === key);
  // Supprimer la soumission et sa clé si elle est trouvée
  if (index !== -1) {
    globalFormFactuelData.value.splice(index, 1);
    previewFormFactuelData.value.splice(index, 1);
    uniqueKeys.delete(key);
    
    // Recalculer toutes les positions après suppression
    recalculatePositions();
    
    // ✅ Sort after position recalculation
    globalFormFactuelData.value.sort((a, b) => {
      return a.typePosition - b.typePosition || a.principePosition - b.principePosition || a.criterePosition - b.criterePosition || a.indicateurPosition - b.indicateurPosition;
    });

    previewFormFactuelData.value.sort((a, b) => {
      return a.type.position - b.type.position || a.principe.position - b.principe.position || a.critere.position - b.critere.position || a.indicateur.position - b.indicateur.position;
    });
    
    updateAllTypesGouvernance();
    localStorage.setItem("globalFormFactuelData", JSON.stringify(globalFormFactuelData.value));
    localStorage.setItem("previewFormFactuelData", JSON.stringify(previewFormFactuelData.value));

    toast.success("Indicateur supprimé.");
  } else {
    const indice = currentPreviewFactuelFormDataArray.value.findIndex((s) => s.indicateur.key === key);

    if (indice !== -1) {
      currentGlobalFactuelFormDataArray.value.splice(indice, 1);
      currentPreviewFactuelFormDataArray.value.splice(indice, 1);
      uniqueKeys.delete(key);

      // ✅ Sort after unshift
      currentGlobalFactuelFormDataArray.value.sort((a, b) => {
        return a.typePosition - b.typePosition || a.principePosition - b.principePosition || a.criterePosition - b.criterePosition || a.indicateurPosition - b.indicateurPosition;
      });

      currentPreviewFactuelFormDataArray.value.sort((a, b) => {
        return a.type.position - b.type.position || a.principe.position - b.principe.position || a.critere.position - b.critere.position || a.indicateur.position - b.indicateur.position;
      });

      toast.success("Supprimé.");
    }
  }
};

function editTemporyIndicateur(key, position) {
  updateTemporyIndicateurs(key, position, false);
  canEditIndicateur.value[key] = false;
}

// Handle edit action
const handleEdit = (key) => {
  canEditIndicateur.value[key] = true;
};

// Fonction pour valider et réorganiser les positions
const validateAndReorganizePositions = (key, newPosition, type = "critere", isCurrent = false) => {
  const position = parseInt(newPosition);
  
  // Validation de base
  if (position < 1) {
    toast.error("La position doit être supérieure à 0");
    return false;
  }

  if (!isCurrent) {
    let elementsToCheck = [];
    let currentElementId = null;

    // Déterminer les éléments à vérifier selon le type
    if (type === "type") {
      elementsToCheck = [...new Set(globalFormFactuelData.value.map(item => item.type))];
      currentElementId = globalFormFactuelData.value.find(item => item.typeKey === key)?.type;
    } else if (type === "principe") {
      const currentElement = globalFormFactuelData.value.find(item => item.principeKey === key);
      if (currentElement) {
        elementsToCheck = [...new Set(
          globalFormFactuelData.value
            .filter(item => item.type === currentElement.type)
            .map(item => item.principe)
        )];
        currentElementId = currentElement.principe;
      }
    } else if (type === "critere") {
      const currentElement = globalFormFactuelData.value.find(item => item.critereKey === key);
      if (currentElement) {
        elementsToCheck = [...new Set(
          globalFormFactuelData.value
            .filter(item => item.type === currentElement.type && item.principe === currentElement.principe)
            .map(item => item.critere)
        )];
        currentElementId = currentElement.critere;
      }
    }

    // Validation : la position ne peut pas dépasser le nombre d'éléments
    if (position > elementsToCheck.length) {
      toast.error(`La position ne peut pas dépasser ${elementsToCheck.length}`);
      return false;
    }

    // Réorganisation des positions
    reorganizePositions(currentElementId, position, type, isCurrent);
    
  } else {
    // Pour les éléments en cours d'ajout
    let maxPosition = 1;
    
    if (type === "type") {
      maxPosition = new Set([...globalFormFactuelData.value.map(i => i.type), ...currentGlobalFactuelFormDataArray.value.map(i => i.type)].filter(Boolean)).size + 1;
    } else if (type === "principe") {
      const typeId = currentGlobalFactuelFormData.type;
      maxPosition = new Set([
        ...globalFormFactuelData.value.filter(i => i.type === typeId).map(i => i.principe),
        ...currentGlobalFactuelFormDataArray.value.filter(i => i.type === typeId).map(i => i.principe)
      ].filter(Boolean)).size + 1;
    } else if (type === "critere") {
      const typeId = currentGlobalFactuelFormData.type;
      const principeId = currentGlobalFactuelFormData.principe;
      maxPosition = new Set([
        ...globalFormFactuelData.value.filter(i => i.type === typeId && i.principe === principeId).map(i => i.critere),
        ...currentGlobalFactuelFormDataArray.value.filter(i => i.type === typeId && i.principe === principeId).map(i => i.critere)
      ].filter(Boolean)).size + 1;
    }

    if (position > maxPosition) {
      toast.error(`La position ne peut pas dépasser ${maxPosition}`);
      return false;
    }

    // Mise à jour pour les éléments en cours
    updateCurrentElementPosition(key, position, type);
  }

  return true;
};

// Fonction pour réorganiser les positions
const reorganizePositions = (elementId, newPosition, type, isCurrent = false) => {
  if (type === "type") {
    // Obtenir tous les types uniques avec leurs positions actuelles
    const typePositions = new Map();
    globalFormFactuelData.value.forEach(item => {
      if (!typePositions.has(item.type)) {
        typePositions.set(item.type, item.typePosition);
      }
    });

    // Créer un tableau ordonné des types
    const sortedTypes = Array.from(typePositions.entries()).sort((a, b) => a[1] - b[1]);
    const oldPosition = typePositions.get(elementId);

    // Réorganiser les positions
    const newSortedTypes = [...sortedTypes];
    const elementIndex = newSortedTypes.findIndex(([id]) => id === elementId);
    const [element] = newSortedTypes.splice(elementIndex, 1);
    newSortedTypes.splice(newPosition - 1, 0, element);

    // Appliquer les nouvelles positions
    newSortedTypes.forEach(([typeId], index) => {
      const newPos = index + 1;
      globalFormFactuelData.value.forEach(item => {
        if (item.type === typeId) {
          item.typePosition = newPos;
        }
      });
      previewFormFactuelData.value.forEach(item => {
        if (item.type.id === typeId) {
          item.type.position = newPos;
        }
      });
    });

  } else if (type === "principe") {
    // Similaire pour les principes
    const currentElement = globalFormFactuelData.value.find(item => item.principeKey && item.principeKey.includes(elementId.toString()));
    if (currentElement) {
      const typeId = currentElement.type;
      
      const principePositions = new Map();
      globalFormFactuelData.value
        .filter(item => item.type === typeId)
        .forEach(item => {
          if (!principePositions.has(item.principe)) {
            principePositions.set(item.principe, item.principePosition);
          }
        });

      const sortedPrincipes = Array.from(principePositions.entries()).sort((a, b) => a[1] - b[1]);
      const newSortedPrincipes = [...sortedPrincipes];
      const elementIndex = newSortedPrincipes.findIndex(([id]) => id === elementId);
      const [element] = newSortedPrincipes.splice(elementIndex, 1);
      newSortedPrincipes.splice(newPosition - 1, 0, element);

      newSortedPrincipes.forEach(([principeId], index) => {
        const newPos = index + 1;
        globalFormFactuelData.value.forEach(item => {
          if (item.type === typeId && item.principe === principeId) {
            item.principePosition = newPos;
          }
        });
        previewFormFactuelData.value.forEach(item => {
          if (item.type.id === typeId && item.principe.id === principeId) {
            item.principe.position = newPos;
          }
        });
      });
    }

  } else if (type === "critere") {
    // Similaire pour les critères
    const currentElement = globalFormFactuelData.value.find(item => item.critereKey && item.critereKey.includes(elementId.toString()));
    if (currentElement) {
      const typeId = currentElement.type;
      const principeId = currentElement.principe;
      
      const criterePositions = new Map();
      globalFormFactuelData.value
        .filter(item => item.type === typeId && item.principe === principeId)
        .forEach(item => {
          if (!criterePositions.has(item.critere)) {
            criterePositions.set(item.critere, item.criterePosition);
          }
        });

      const sortedCriteres = Array.from(criterePositions.entries()).sort((a, b) => a[1] - b[1]);
      const newSortedCriteres = [...sortedCriteres];
      const elementIndex = newSortedCriteres.findIndex(([id]) => id === elementId);
      const [element] = newSortedCriteres.splice(elementIndex, 1);
      newSortedCriteres.splice(newPosition - 1, 0, element);

      newSortedCriteres.forEach(([critereId], index) => {
        const newPos = index + 1;
        globalFormFactuelData.value.forEach(item => {
          if (item.type === typeId && item.principe === principeId && item.critere === critereId) {
            item.criterePosition = newPos;
          }
        });
        previewFormFactuelData.value.forEach(item => {
          if (item.type.id === typeId && item.principe.id === principeId && item.critere.id === critereId) {
            item.critere.position = newPos;
          }
        });
      });
    }
  }

  // Tri et sauvegarde
  globalFormFactuelData.value.sort((a, b) => {
    return a.typePosition - b.typePosition || a.principePosition - b.principePosition || a.criterePosition - b.criterePosition || a.indicateurPosition - b.indicateurPosition;
  });

  previewFormFactuelData.value.sort((a, b) => {
    return a.type.position - b.type.position || a.principe.position - b.principe.position || a.critere.position - b.critere.position || a.indicateur.position - b.indicateur.position;
  });

  updateAllTypesGouvernance();
  localStorage.setItem("globalFormFactuelData", JSON.stringify(globalFormFactuelData.value));
  localStorage.setItem("previewFormFactuelData", JSON.stringify(previewFormFactuelData.value));

  toast.success("Position mise à jour avec réorganisation");
};

// Fonction pour mettre à jour les éléments en cours
const updateCurrentElementPosition = (key, position, type) => {
  if (type === "type") {
    currentPreviewFactuelFormData.type.position = position;
    currentGlobalFactuelFormData.typePosition = position;
  } else if (type === "principe") {
    currentPreviewFactuelFormData.principe.position = position;
    currentGlobalFactuelFormData.principePosition = position;
  } else if (type === "critere") {
    currentPreviewFactuelFormData.critere.position = position;
    currentGlobalFactuelFormData.criterePosition = position;
  }

  // Mise à jour des arrays temporaires
  currentGlobalFactuelFormDataArray.value.forEach((item) => {
    if (type === "type" && item.typeKey === key) {
      item.typePosition = position;
    } else if (type === "principe" && item.principeKey === key) {
      item.principePosition = position;
    } else if (type === "critere" && item.critereKey === key) {
      item.criterePosition = position;
    }
  });

  currentPreviewFactuelFormDataArray.value.forEach((item) => {
    if (type === "type" && item.type.key === key) {
      item.type.position = position;
    } else if (type === "principe" && item.principe.key === key) {
      item.principe.position = position;
    } else if (type === "critere" && item.critere.key === key) {
      item.critere.position = position;
    }
  });
};

const updateTemporyElement = (key, position, isCurrent = false, type = "critere") => {
  if (validateAndReorganizePositions(key, position, type, isCurrent)) {
    // Fermer l'édition
    if (type === "type") {
      canEditType.value[key] = false;
    } else if (type === "principe") {
      canEditPrincipe.value[key] = false;
    } else if (type === "critere") {
      canEditCritere.value[key] = false;
    }
  }
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

// Fonction spécifique pour valider et réorganiser les indicateurs
const validateAndReorganizeIndicatorPositions = (key, newPosition, isCurrent = false) => {
  const position = parseInt(newPosition);
  
  // Validation de base
  if (position < 1) {
    toast.error("La position doit être supérieure à 0");
    return false;
  }

  if (!isCurrent) {
    // Trouver l'indicateur concerné
    const currentIndicator = globalFormFactuelData.value.find(item => item.indicateurKey === key);
    if (!currentIndicator) return false;

    // Obtenir tous les indicateurs du même critère
    const indicateursForCritere = globalFormFactuelData.value.filter(item => 
      item.type === currentIndicator.type && 
      item.principe === currentIndicator.principe && 
      item.critere === currentIndicator.critere
    );

    // Validation : la position ne peut pas dépasser le nombre d'indicateurs
    if (position > indicateursForCritere.length) {
      toast.error(`La position ne peut pas dépasser ${indicateursForCritere.length}`);
      return false;
    }

    // Réorganiser les positions des indicateurs
    reorganizeIndicatorPositions(currentIndicator, position);
    
  } else {
    // Pour les indicateurs en cours d'ajout
    const typeId = currentGlobalFactuelFormData.type;
    const principeId = currentGlobalFactuelFormData.principe;
    const critereId = currentGlobalFactuelFormData.critere;
    
    const maxPosition = [
      ...globalFormFactuelData.value.filter(i => i.type === typeId && i.principe === principeId && i.critere === critereId),
      ...currentGlobalFactuelFormDataArray.value.filter(i => i.type === typeId && i.principe === principeId && i.critere === critereId)
    ].length + 1;

    if (position > maxPosition) {
      toast.error(`La position ne peut pas dépasser ${maxPosition}`);
      return false;
    }

    // Mise à jour pour les indicateurs en cours
    updateCurrentIndicatorPosition(key, position);
  }

  return true;
};

// Fonction pour réorganiser les positions des indicateurs
const reorganizeIndicatorPositions = (currentIndicator, newPosition) => {
  const typeId = currentIndicator.type;
  const principeId = currentIndicator.principe;
  const critereId = currentIndicator.critere;
  const indicateurId = currentIndicator.indicateur;

  // Obtenir tous les indicateurs du même critère triés par position
  const indicateursForCritere = globalFormFactuelData.value
    .filter(item => item.type === typeId && item.principe === principeId && item.critere === critereId)
    .sort((a, b) => a.indicateurPosition - b.indicateurPosition);

  // Créer un tableau des IDs d'indicateurs dans l'ordre actuel
  const indicateurIds = indicateursForCritere.map(item => item.indicateur);
  
  // Trouver l'index actuel de l'indicateur à déplacer
  const currentIndex = indicateurIds.indexOf(indicateurId);
  
  // Retirer l'indicateur de sa position actuelle et l'insérer à la nouvelle position
  const [movedIndicateur] = indicateurIds.splice(currentIndex, 1);
  indicateurIds.splice(newPosition - 1, 0, movedIndicateur);

  // Appliquer les nouvelles positions
  indicateurIds.forEach((indicateurIdToUpdate, index) => {
    const newPos = index + 1;
    
    // Mettre à jour dans globalFormFactuelData
    globalFormFactuelData.value.forEach(item => {
      if (item.type === typeId && item.principe === principeId && item.critere === critereId && item.indicateur === indicateurIdToUpdate) {
        item.indicateurPosition = newPos;
      }
    });
    
    // Mettre à jour dans previewFormFactuelData
    previewFormFactuelData.value.forEach(item => {
      if (item.type.id === typeId && item.principe.id === principeId && item.critere.id === critereId && item.indicateur.id === indicateurIdToUpdate) {
        item.indicateur.position = newPos;
      }
    });
  });

  // Tri et sauvegarde
  globalFormFactuelData.value.sort((a, b) => {
    return a.typePosition - b.typePosition || a.principePosition - b.principePosition || a.criterePosition - b.criterePosition || a.indicateurPosition - b.indicateurPosition;
  });

  previewFormFactuelData.value.sort((a, b) => {
    return a.type.position - b.type.position || a.principe.position - b.principe.position || a.critere.position - b.critere.position || a.indicateur.position - b.indicateur.position;
  });

  localStorage.setItem("globalFormFactuelData", JSON.stringify(globalFormFactuelData.value));
  localStorage.setItem("previewFormFactuelData", JSON.stringify(previewFormFactuelData.value));

  toast.success("Position de l'indicateur mise à jour avec réorganisation");
};

// Fonction pour mettre à jour les indicateurs en cours
const updateCurrentIndicatorPosition = (key, position) => {
  currentPreviewFactuelFormDataArray.value.forEach((item) => {
    if (item.indicateur.key === key) {
      item.indicateur.position = position;
    }
  });

  currentGlobalFactuelFormDataArray.value.forEach((item) => {
    if (item.indicateurKey === key) {
      item.indicateurPosition = position;
    }
  });
};

const updateTemporyIndicateurs = (key, position, isCurrent = false) => {
  if (validateAndReorganizeIndicatorPositions(key, position, isCurrent)) {
    // Fermer l'édition si c'est un indicateur persisté
    if (!isCurrent) {
      canEditIndicateur.value[key] = false;
    }
  }
};

const clearUniqueKeys = () => {
  uniqueKeys.clear(); // Supprime toutes les clés de uniqueKeys
};

// FONCTION MODIFIÉE resetAllFormWithDataLocalStorage
const resetAllFormWithDataLocalStorage = () => {
  resetAllForm();
  clearUniqueKeys();
  resetPathSystem(); // Ajout du reset du système de chemins
  localStorage.removeItem("globalFormFactuelData");
  localStorage.removeItem("previewFormFactuelData");
  localStorage.removeItem("previewOptionResponsesModel");
  localStorage.removeItem("globalOptionResponses");

  updateAllTypesGouvernance();
  showDeleteForm.value = false;
  // toast.success("Formulaire supprimé.");
};

const updateElement = (key, type = "critere", isCurrent = false) => {
  if (!isCurrent) {
    const typeKey = type + "Key";
  } else {
  }
};

// Fonction pour recalculer les positions après suppression
const recalculatePositions = () => {
  // 1. Recalculer les positions des types
  const uniqueTypes = [...new Set(globalFormFactuelData.value.map(item => item.type))];
  uniqueTypes.forEach((typeId, index) => {
    const newPosition = index + 1;
    globalFormFactuelData.value.forEach(item => {
      if (item.type === typeId) {
        item.typePosition = newPosition;
      }
    });
    previewFormFactuelData.value.forEach(item => {
      if (item.type.id === typeId) {
        item.type.position = newPosition;
      }
    });
  });

  // 2. Recalculer les positions des principes pour chaque type
  uniqueTypes.forEach(typeId => {
    const principesForType = [...new Set(
      globalFormFactuelData.value
        .filter(item => item.type === typeId)
        .map(item => item.principe)
    )];
    
    principesForType.forEach((principeId, index) => {
      const newPosition = index + 1;
      globalFormFactuelData.value.forEach(item => {
        if (item.type === typeId && item.principe === principeId) {
          item.principePosition = newPosition;
        }
      });
      previewFormFactuelData.value.forEach(item => {
        if (item.type.id === typeId && item.principe.id === principeId) {
          item.principe.position = newPosition;
        }
      });
    });
  });

  // 3. Recalculer les positions des critères pour chaque principe
  uniqueTypes.forEach(typeId => {
    const principesForType = [...new Set(
      globalFormFactuelData.value
        .filter(item => item.type === typeId)
        .map(item => item.principe)
    )];
    
    principesForType.forEach(principeId => {
      const criteresForPrincipe = [...new Set(
        globalFormFactuelData.value
          .filter(item => item.type === typeId && item.principe === principeId)
          .map(item => item.critere)
      )];
      
      criteresForPrincipe.forEach((critereId, index) => {
        const newPosition = index + 1;
        globalFormFactuelData.value.forEach(item => {
          if (item.type === typeId && item.principe === principeId && item.critere === critereId) {
            item.criterePosition = newPosition;
          }
        });
        previewFormFactuelData.value.forEach(item => {
          if (item.type.id === typeId && item.principe.id === principeId && item.critere.id === critereId) {
            item.critere.position = newPosition;
          }
        });
      });
    });
  });

  // 4. Recalculer les positions des indicateurs pour chaque critère
  uniqueTypes.forEach(typeId => {
    const principesForType = [...new Set(
      globalFormFactuelData.value
        .filter(item => item.type === typeId)
        .map(item => item.principe)
    )];
    
    principesForType.forEach(principeId => {
      const criteresForPrincipe = [...new Set(
        globalFormFactuelData.value
          .filter(item => item.type === typeId && item.principe === principeId)
          .map(item => item.critere)
      )];
      
      criteresForPrincipe.forEach(critereId => {
        const indicateursForCritere = globalFormFactuelData.value
          .filter(item => item.type === typeId && item.principe === principeId && item.critere === critereId)
          .sort((a, b) => a.indicateurPosition - b.indicateurPosition);
        
        indicateursForCritere.forEach((item, index) => {
          const newPosition = index + 1;
          item.indicateurPosition = newPosition;
          
          // Mettre à jour aussi dans previewFormFactuelData
          const previewItem = previewFormFactuelData.value.find(preview => 
            preview.type.id === typeId && 
            preview.principe.id === principeId && 
            preview.critere.id === critereId && 
            preview.indicateur.id === item.indicateur
          );
          if (previewItem) {
            previewItem.indicateur.position = newPosition;
          }
        });
      });
    });
  });
};

const removeElement = (key, type = "critere", isCurrent = false) => {
  if (!isCurrent) {
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
      if (previewFormFactuelData.value[i][type]["key"] === key) {
        previewFormFactuelData.value.splice(i, 1);
      }
    }

    // Recalculer toutes les positions après suppression
    recalculatePositions();

    // ✅ Sort after position recalculation
    globalFormFactuelData.value.sort((a, b) => {
      return a.typePosition - b.typePosition || a.principePosition - b.principePosition || a.criterePosition - b.criterePosition || a.indicateurPosition - b.indicateurPosition;
    });

    previewFormFactuelData.value.sort((a, b) => {
      return a.type.position - b.type.position || a.principe.position - b.principe.position || a.critere.position - b.critere.position || a.indicateur.position - b.indicateur.position;
    });

    // Recalculate and update
    updateAllTypesGouvernance();

    // Persist to localStorage
    localStorage.setItem("globalFormFactuelData", JSON.stringify(globalFormFactuelData.value));
    localStorage.setItem("previewFormFactuelData", JSON.stringify(previewFormFactuelData.value));

    toast.success("Élément(s) supprimé(s).");
  } else {
    Object.keys(currentGlobalFactuelFormData).forEach((key) => {
      currentGlobalFactuelFormData[key] = "";
    });

    currentPreviewFactuelFormData[type] = { id: "", nom: "", key: "", position: 0 };
  }
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
// [
//     {
//         "id": "YMLrvmB25Kwaro7dGPyW1zN0DExB8gOzqnl2Amvj9ZYXMJqR6Vk4e3pLo9GWe0k1",
//         "point": "1",
//         "preuveIsRequired": true,
//         "sourceIsRequired": true,
//         "descriptionIsRequired": false
//     },
//     {
//         "id": "oKyBZAvxmYkeVjDz21N8wKXvJP7WL4ndKb09aglRd35pxZyEAMrqB6oGd52k6MYV",
//         "point": "0.5",
//         "preuveIsRequired": false,
//         "sourceIsRequired": false,
//         "descriptionIsRequired": true
//     },
//     {
//         "id": "VkZjXED00v2XwZzN84a7VErB1qGRJMQezb6Ay3YjoKLgxkWpmldDe95PdRrJ3yxo",
//         "point": "0",
//         "preuveIsRequired": false,
//         "sourceIsRequired": false,
//         "descriptionIsRequired": false
//     }
// ]
const createForm = async () => {
  isLoadingForm.value = true;

  // Enrichir les options de réponse avec les données complètes (incluant les champs booléens)
  try {
    const { data } = await OptionReponse.factuel();
    const allOptions = data.data;

    // Enrichir chaque option avec les données complètes
    payload.factuel.options_de_reponse = globalOptionResponses.value.options_de_reponse.map(option => {
      const fullOption = allOptions.find(opt => opt.id === option.id);

      if (!fullOption) {
        return {
          id: option.id,
          point: option.point,
          preuveIsRequired: false,
          sourceIsRequired: false,
          descriptionIsRequired: false
        };
      }

      const libelleLower = fullOption.libelle?.toLowerCase() || '';
      const slugLower = fullOption.slug?.toLowerCase() || '';

      // Vérifier les slugs et attribuer les valeurs en conséquence
      let preuveIsRequired = fullOption.preuveIsRequired || false;
      let sourceIsRequired = fullOption.sourceIsRequired || false;
      let descriptionIsRequired = fullOption.descriptionIsRequired || false;

      // Forcer les valeurs selon le slug/libellé (logique hardcodée)
      if (libelleLower === 'oui' || slugLower === 'oui') {
        preuveIsRequired = true;
        sourceIsRequired = true;
        descriptionIsRequired = false;
      } else if (libelleLower === 'partiellement' || slugLower === 'partiellement') {
        preuveIsRequired = false;
        sourceIsRequired = false;
        descriptionIsRequired = true;
      } else if (libelleLower === 'non' || slugLower === 'non') {
        preuveIsRequired = false;
        sourceIsRequired = false;
        descriptionIsRequired = false;
      }

      return {
        id: option.id,
        point: option.point,
        preuveIsRequired,
        sourceIsRequired,
        descriptionIsRequired
      };
    });
  } catch (e) {
    // En cas d'erreur, on utilise les données sans enrichissement
    payload.factuel.options_de_reponse = globalOptionResponses.value.options_de_reponse;
  }

  payload.factuel.types_de_gouvernance = previewTypesGouvernance.value.types_de_gouvernance;


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
  currentTab.value = tab;
  if (tab) {
    router.push({ name: "Ajouter_un_formulaire_Factuel", query: { tab: tab } });
  } else {
    router.push({ name: "Ajouter_un_formulaire_Factuel" });
  }
};

onBeforeUnmount(() => {
  clearUniqueKeys();
  resetAllFormWithDataLocalStorage();
});

watch(() => {

  if (route.query.tab) {
    currentTab.value = Number(route.query.tab);
  } else {
    currentTab.value = 0;
  }
});

// Fonction pour ouvrir le modal de modification
const openModifyModal = (key, type, currentData) => {
  modifyElement.key = key;
  modifyElement.type = type;
  modifyElement.currentData = { ...currentData };
  modifyElement.newParentId = '';
  
  // Charger les parents disponibles selon le type
  loadAvailableParents(type, currentData);
  
  showModifyModal.value = true;
};

// Fonction pour charger les parents disponibles
const loadAvailableParents = async (type, currentData) => {
  modifyElement.availableParents = [];
  
  try {
    if (type === 'principe') {
      // Charger tous les types de gouvernance disponibles
      const TypeGouvernanceService = await import('@/services/modules/enquetes_de_gouvernance/typeGouvernance.service');
      const response = await TypeGouvernanceService.default.get();
      modifyElement.availableParents = response.data.data || [];
    } else if (type === 'critere') {
      // Charger tous les principes de gouvernance disponibles
      const PrincipeGouvernanceService = await import('@/services/modules/enquetes_de_gouvernance/principeGouvernanceFactuel.service');
      const response = await PrincipeGouvernanceService.default.get();
      modifyElement.availableParents = response.data.data || [];
    } else if (type === 'indicateur') {
      // Charger tous les critères de gouvernance disponibles
      const CritereGouvernanceService = await import('@/services/modules/enquetes_de_gouvernance/critereGouvernance.service');
      const response = await CritereGouvernanceService.default.get();
      modifyElement.availableParents = response.data.data || [];
    }
  } catch (error) {
    toast.error('Erreur lors du chargement des données');
  }
};


//generer pdf
// Version alternative si vous voulez plus de contrôle sur les couleurs
const generatePDFAdvanced = () => {
  
  const doc = new jsPDF({ 
    orientation: "landscape", 
    format: "a2",
    unit: 'mm'
  });

  const pageWidth = doc.internal.pageSize.width;
  

  // Get current date and time
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();

  // Add date and time to the top right corner
  doc.setFontSize(12);
  const dateTimeStr = `Générer le: ${dateStr} à ${timeStr}`;
  const textXOffset = pageWidth - doc.getTextWidth(dateTimeStr) - 10;
  doc.text(dateTimeStr, textXOffset, 10);


  // Récupérer les données du tableau depuis le DOM
  const table = document.getElementById('my-table-factuel');
  const rows = [];
  const headers = [];

  // Extraire les en-têtes
  const headerRows = table.querySelectorAll('thead tr');
  headerRows.forEach(row => {
    const headerRow = [];
    row.querySelectorAll('th').forEach(th => {
      headerRow.push({
        content: th.textContent.trim(),
        colSpan: th.colSpan || 1,
        rowSpan: th.rowSpan || 1
      });
    });
    headers.push(headerRow);
  });

  // Extraire les données du corps
  const bodyRows = table.querySelectorAll('tbody tr');
  bodyRows.forEach(row => {
    const rowData = [];
    const backgroundColor = row.style.backgroundColor;
    const textColor = window.getComputedStyle(row).color;
    
    row.querySelectorAll('td').forEach(td => {
      rowData.push({
        content: td.textContent.trim(),
        styles: {
          fillColor: backgroundColor ? hexToRgb(backgroundColor) : [255, 255, 255],
          textColor: textColor ? hexToRgb(textColor) : [0, 0, 0]
        }
      });
    });
    
    if (rowData.length > 0) {
      rows.push(rowData);
    }
  });

  // Fonction pour convertir hex/rgb en tableau RGB
  function hexToRgb(color) {
    if (color.startsWith('rgb')) {
      const matches = color.match(/\d+/g);
      return matches ? matches.map(Number) : [255, 255, 255];
    } else if (color.startsWith('#')) {
      const hex = color.substring(1);
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return [r, g, b];
    }
    return [255, 255, 255];
  }

  // Ajouter le titre
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text("Formulaires Factuel", 14, 15);

  // Configuration du tableau
  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20,
    theme: 'plain',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [15, 52, 96],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    didParseCell: function(data) {
      // Appliquer les styles personnalisés pour chaque cellule
      if (data.row.raw && data.row.raw[data.column.index] && data.row.raw[data.column.index].styles) {
        Object.assign(data.cell.styles, data.row.raw[data.column.index].styles);
      }
    }
  });

  doc.save("Formulaire factuel de gouvernance.pdf");
};

// Fonction pour appliquer la modification
const applyModification = () => {
  if (!modifyElement.newParentId) {
    toast.error('Veuillez sélectionner un nouveau parent');
    return;
  }
  
  const { key, type, newParentId } = modifyElement;
  
  // Trouver tous les éléments affectés
  const affectedElements = findAffectedElements(key, type);
  
  // Supprimer les éléments de leur position actuelle
  removeElementsFromCurrentPosition(affectedElements, type);
  
  // Réassigner les éléments au nouveau parent
  reassignElementsToNewParent(affectedElements, type, newParentId);
  
  // Recalculer toutes les positions
  recalculatePositions();
  
  // Trier les données
  sortAllData();
  
  // Mettre à jour l'affichage
  updateAllTypesGouvernance();

  
  // Sauvegarder
  localStorage.setItem('globalFormFactuelData', JSON.stringify(globalFormFactuelData.value));
  localStorage.setItem('previewFormFactuelData', JSON.stringify(previewFormFactuelData.value));
  
  // Fermer le modal
  showModifyModal.value = false;
  
  toast.success('Modification effectuée avec succès');
};

// Fonction pour trouver tous les éléments affectés
const findAffectedElements = (key, type) => {
  const globalAffected = [];
  const previewAffected = [];
  
  if (type === 'type') {
    globalAffected.push(...globalFormFactuelData.value.filter(item => item.typeKey === key));
    previewAffected.push(...previewFormFactuelData.value.filter(item => item.type.key === key));
  } else if (type === 'principe') {
    globalAffected.push(...globalFormFactuelData.value.filter(item => item.principeKey === key));
    previewAffected.push(...previewFormFactuelData.value.filter(item => item.principe.key === key));
  } else if (type === 'critere') {
    globalAffected.push(...globalFormFactuelData.value.filter(item => item.critereKey === key));
    previewAffected.push(...previewFormFactuelData.value.filter(item => item.critere.key === key));
  } else if (type === 'indicateur') {
    globalAffected.push(...globalFormFactuelData.value.filter(item => item.indicateurKey === key));
    previewAffected.push(...previewFormFactuelData.value.filter(item => item.indicateur.key === key));
  }
  
  return { globalAffected, previewAffected };
};

// Fonction pour supprimer les éléments de leur position actuelle
const removeElementsFromCurrentPosition = (affectedElements, type) => {
  const { globalAffected, previewAffected } = affectedElements;
  
  // Supprimer de globalFormFactuelData
  globalAffected.forEach(element => {
    const index = globalFormFactuelData.value.indexOf(element);
    if (index !== -1) {
      globalFormFactuelData.value.splice(index, 1);
    }
  });
  
  // Supprimer de previewFormFactuelData
  previewAffected.forEach(element => {
    const index = previewFormFactuelData.value.indexOf(element);
    if (index !== -1) {
      previewFormFactuelData.value.splice(index, 1);
    }
  });
};

// Fonction pour réassigner les éléments au nouveau parent
const reassignElementsToNewParent = (affectedElements, type, newParentId) => {
  const { globalAffected, previewAffected } = affectedElements;
  const newParent = modifyElement.availableParents.find(parent => parent.id === newParentId);
  if (!newParent) return;
  
  // Réassigner les éléments globaux
  globalAffected.forEach(element => {
    if (type === 'principe') {
      element.type = newParentId;
    } else if (type === 'critere') {
      element.principe = newParentId;
    } else if (type === 'indicateur') {
      element.critere = newParentId;
    }
    
    // Rajouter à globalFormFactuelData
    globalFormFactuelData.value.push(element);
  });
  
  // Réassigner les éléments de prévisualisation
  previewAffected.forEach(element => {
    if (type === 'principe') {
      element.type = { id: newParentId, nom: newParent.nom, key: '', position: 0 };
    } else if (type === 'critere') {
      element.principe = { id: newParentId, nom: newParent.nom, key: '', position: 0 };
    } else if (type === 'indicateur') {
      element.critere = { id: newParentId, nom: newParent.nom, key: '', position: 0 };
    }
    
    // Rajouter à previewFormFactuelData
    previewFormFactuelData.value.push(element);
  });
};

// Fonction pour trier toutes les données
const sortAllData = () => {
  globalFormFactuelData.value.sort((a, b) => {
    return a.typePosition - b.typePosition || 
           a.principePosition - b.principePosition || 
           a.criterePosition - b.criterePosition || 
           a.indicateurPosition - b.indicateurPosition;
  });
  
  previewFormFactuelData.value.sort((a, b) => {
    return a.type.position - b.type.position || 
           a.principe.position - b.principe.position || 
           a.critere.position - b.critere.position || 
           a.indicateur.position - b.indicateur.position;
  });
};

// Fournir les données aux composants enfants
provide('globalFormFactuelData', globalFormFactuelData);
provide('currentGlobalFactuelFormDataArray', currentGlobalFactuelFormDataArray);

onMounted(() => {
  if (route.query.tab) currentTab.value = Number(route.query.tab);

  if (globalData && previewData) {
    globalFormFactuelData.value = JSON.parse(globalData);
    previewFormFactuelData.value = JSON.parse(previewData);

  }
  updateAllTypesGouvernance();
  getcurrentUser();
});
</script>

<template>
  <div class="flex w-full gap-2">
    <section v-if="!currentTab" class="max-h-[50%] pr-1 overflow-y-auto border-r-2 pt-5" :class="currentTab ? 'w-0' : 'w-[30%]'">
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
            <OptionsResponseFactuel :is-reset="resetOptions" v-model:previewOptionResponses="previewOptionResponses" v-model:globalOptionResponses="globalOptionResponses" />
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
            <div v-if="currentPreviewFactuelFormData.indicateur.nom !== ''" class="flex items-end justify-end"><button @click="showDeleteForm = true" class="btn btn-outline-danger">Supprimer le formulaire</button></div>
            <div class="flex flex-col gap-8">
              <div class="space-y-2">
                <p class="text-lg font-medium">Liste des options de réponses</p>
                <ListOptionsResponse :options="previewOptionResponses.options_de_reponse" />
              </div>
              <div class="space-y-2">
                <p class="text-lg font-medium">Ajouter des indicateurs</p>
                <!-- <pre>{{ currentPreviewFactuelFormDataArray }}</pre> -->
                <MultipleFactuelStructure :type="currentPreviewFactuelFormData.type" :principe="currentPreviewFactuelFormData.principe" :critere="currentPreviewFactuelFormData.critere" @deleteIndicateur="removeIndicator" @deletePrincipe="removeElement" @deleteType="removeElement" @updatePositionIndicateur="updateTemporyIndicateurs" @deleteCritere="removeElement" @updateTemporyElement="updateTemporyElement" :indicateurArray="currentPreviewFactuelFormDataArray.length > 0 ? currentPreviewFactuelFormDataArray : []" />
                <button :disabled="!isCurrentFormValid" @click="addNewIndicator" class="my-4 text-sm btn btn-primary"><PlusIcon class="mr-1 size-4" />Ajouter</button>
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
        <button :disabled="!showForm" @click="previewForm" class="mr-5 px-5 text-base btn btn-primary"><CheckIcon class="mr-1 size-5" />Enregistrer</button>
        <button :disabled="!showForm" @click="previewFormulaire = true" class="px-5 text-base btn btn-primary"><EyeIcon class="mr-1 size-5" />Voir le formumlaire</button>
      </div>
    </div>
    <div class="max-h-[80vh] py-2 border-t overflow-y-auto mb-10 my-2">
      <table id="my-table" class="w-full border-collapse table-auto border-slate-500" cellpadding="10" cellspacing="0">
        <thead class="text-white bg-blue-900">
          <tr>
            <th class="py-3 border border-slate-900">Principes</th>
            <th class="py-3 border border-slate-900">Critères</th>
            <th class="py-3 border border-slate-900">Indicateurs</th>
            <th class="py-3 border border-slate-900 max-w-[200px]">Actions</th>
          </tr>
        </thead>

        <!-- <pre>{{ previewTypesGouvernance?.types_de_gouvernance }}</pre> -->

        <tbody v-if="previewTypesGouvernance?.types_de_gouvernance?.length">
          <template v-for="type_de_gouvernance in previewTypesGouvernance.types_de_gouvernance" :key="type_de_gouvernance.id">
            <tr class="bg-green-100 list-data">
              <td colspan="3" class="font-semibold">{{ type_de_gouvernance.position }} - {{ type_de_gouvernance.nom }}</td>

              <td class="items-center transition-all opacity-0 container-buttons">
                <div v-if="canEditType[type_de_gouvernance.key]">
                  <input type="number" min="1" step="1" name="position" :value="type_de_gouvernance.position" @keyup.enter="updateTemporyElement(type_de_gouvernance.key, $event.target.value, false, 'type')" class="w-2/5 form-control" />
                </div>
                <div v-else class="flex gap-1">
                  <button class="p-1.5 text-primary" @click="handleEditElement(type_de_gouvernance.key, 'type')" title="Modifier la position">
                    <Edit3Icon class="size-5" />
                  </button>
                  <button class="p-1.5 text-danger" @click="removeElement(type_de_gouvernance.key, 'type')">
                    <TrashIcon class="size-5" />
                  </button>
                </div>
              </td>
            </tr>
            <template v-for="principe_de_gouvernance in type_de_gouvernance.principes_de_gouvernance" :key="principe_de_gouvernance.id">
              <template v-for="(critere_de_gouvernance, scIndex) in principe_de_gouvernance.criteres_de_gouvernance" :key="critere_de_gouvernance.id">
                <template v-for="(indicateur_de_gouvernance, qIndex) in critere_de_gouvernance.indicateurs_de_gouvernance" :key="indicateur_de_gouvernance.id">
                  <tr>
                    <!-- Première cellule de catégorie principale avec rowspan -->
                    <td class="font-semibold list-data" v-if="scIndex === 0 && qIndex === 0" :rowspan="principe_de_gouvernance.criteres_de_gouvernance.reduce((sum, sc) => sum + sc.indicateurs_de_gouvernance.length, 0)">
                      <div class="flex items-center gap-1">{{ type_de_gouvernance.position }}.{{ principe_de_gouvernance.position }} - {{ principe_de_gouvernance.nom }}</div>

                      <div class="items-center transition-all opacity-0 container-buttons">
                        <div v-if="canEditCritere[principe_de_gouvernance.key]">
                          <input type="number" min="1" step="1" name="position" :value="principe_de_gouvernance.position" @keyup.enter="updateTemporyElement(principe_de_gouvernance.key, $event.target.value, false, 'principe')" class="w-2/5 form-control" />
                        </div>
                        <div v-else class="flex gap-1">
                          <button class="p-1.5 text-primary" @click="handleEditElement(principe_de_gouvernance.key, 'principe')" title="Modifier la position">
                            <Edit3Icon class="size-5" />
                          </button>
                          <button class="p-1.5 text-info" @click="openModifyModal(principe_de_gouvernance.key, 'principe', principe_de_gouvernance)" title="Changer de type">
                            <ArrowRightIcon class="size-5" />
                          </button>
                          <button class="p-1.5 text-danger" @click="removeElement(principe_de_gouvernance.key, 'principe')">
                            <TrashIcon class="size-5" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <!-- Première cellule de sous-catégorie avec rowspan -->
                    <td class="list-data" v-if="qIndex === 0" :rowspan="critere_de_gouvernance.indicateurs_de_gouvernance.length">
                      <div class="flex items-center gap-1">{{ type_de_gouvernance.position }}.{{ principe_de_gouvernance.position }}.{{ critere_de_gouvernance.position }} - {{ critere_de_gouvernance.nom }}</div>

                      <div class="flex items-center transition-all opacity-0 container-buttons">
                        <div v-if="canEditCritere[critere_de_gouvernance.key]">
                          <input type="number" min="1" step="1" name="position" :value="critere_de_gouvernance.position" @keyup.enter="updateTemporyElement(critere_de_gouvernance.key, $event.target.value, false, 'critere')" class="w-2/5 form-control" />
                        </div>
                        <div v-else class="flex gap-1">
                          <button class="p-1.5 text-primary" @click="handleEditElement(critere_de_gouvernance.key, 'critere')" title="Modifier la position">
                            <Edit3Icon class="size-5" />
                          </button>
                          <button class="p-1.5 text-info" @click="openModifyModal(critere_de_gouvernance.key, 'critere', critere_de_gouvernance)" title="Changer de principe">
                            <ArrowRightIcon class="size-5" />
                          </button>
                          <button class="p-1.5 text-danger" @click="removeElement(critere_de_gouvernance.key, 'critere')">
                            <TrashIcon class="size-5" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td>{{ type_de_gouvernance.position }}.{{ principe_de_gouvernance.position }}.{{ critere_de_gouvernance.position }}.{{ indicateur_de_gouvernance.position }} - {{ indicateur_de_gouvernance.nom }}</td>

                    <td>
                      <div class="flex items-center">
                        <div v-if="canEditIndicateur[indicateur_de_gouvernance.key]">
                          <input type="number" min="1" step="1" name="position" :value="indicateur_de_gouvernance.position" @keyup.enter="editTemporyIndicateur(indicateur_de_gouvernance.key, $event.target.value)" class="w-2/5 form-control" />
                        </div>
                        <div v-else class="flex gap-1">
                          <button class="p-1.5 text-primary" @click="handleEdit(indicateur_de_gouvernance.key)" title="Modifier la position">
                            <Edit3Icon class="size-5" />
                          </button>
                          <button class="p-1.5 text-info" @click="openModifyModal(indicateur_de_gouvernance.key, 'indicateur', indicateur_de_gouvernance)" title="Changer de critère">
                            <ArrowRightIcon class="size-5" />
                          </button>
                          <button class="p-1.5 text-danger" @click="removeIndicator(indicateur_de_gouvernance.key)">
                            <TrashIcon class="size-5" />
                          </button>
                        </div>
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

  <Modal backdrop="static" :show="previewFormulaire" size="modal-xl" @hidden="previewFormulaire = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Formulaire factuel de gouvernance</h2>
    </ModalHeader>
    <ModalBody class="space-y-5">
      <div class="text-right">
        <button @click="generatePDFAdvanced" class="btn btn-primary text-left">Télécharger PDF</button>
      </div>
      <table id="my-table-factuel" class="w-full border-collapse table-auto border-slate-500" cellpadding="10" cellspacing="0">
        <thead class="text-white bg-blue-900">
          <tr>
            <th class="py-3 border border-slate-900">Principes</th>
            <th class="py-3 border border-slate-900">Critères</th>
            <th class="py-3 border border-slate-900">Indicateurs</th>
            <th class="py-3 border border-slate-900">
             Option de Réponse <br />( <template v-for="(options_de_reponse, idx) in previewOptionResponses.options_de_reponse" :key="options_de_reponse.id"> {{ options_de_reponse.libelle }} {{ idx < previewOptionResponses.options_de_reponse.length - 1 ? " / " : "" }} </template>)
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
              <td colspan="7" class="font-semibold">{{ type_de_gouvernance.position }}.{{ type_de_gouvernance.nom }}</td>
            </tr>
            <template v-for="principe_de_gouvernance in type_de_gouvernance.principes_de_gouvernance" :key="principe_de_gouvernance.id">
              <template v-for="(critere_de_gouvernance, scIndex) in principe_de_gouvernance.criteres_de_gouvernance" :key="critere_de_gouvernance.id">
                <template v-for="(indicateur_de_gouvernance, qIndex) in critere_de_gouvernance.indicateurs_de_gouvernance" :key="indicateur_de_gouvernance.id">
                  <tr>
                    <!-- Première cellule de catégorie principale avec rowspan -->
                    <td class="font-semibold text-center" v-if="scIndex === 0 && qIndex === 0" :rowspan="principe_de_gouvernance.criteres_de_gouvernance.reduce((sum, sc) => sum + sc.indicateurs_de_gouvernance.length, 0)">{{ type_de_gouvernance.position }}.{{ principe_de_gouvernance.position }}.{{ principe_de_gouvernance.nom }}</td>

                    <!-- Première cellule de sous-catégorie avec rowspan -->
                    <td class="text-center" v-if="qIndex === 0" :rowspan="critere_de_gouvernance.indicateurs_de_gouvernance.length">
                     {{ type_de_gouvernance.position }}.{{ principe_de_gouvernance.position }}.{{ critere_de_gouvernance.position }}.{{ critere_de_gouvernance.nom }}
                    </td>
                    <td>{{ type_de_gouvernance.position }}.{{ principe_de_gouvernance.position }}.{{ critere_de_gouvernance.position }}.{{ indicateur_de_gouvernance.position }} - {{ indicateur_de_gouvernance.nom }}</td>
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
         

          <div>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12 my-2" v-if="errors['factuel.options_de_reponse.0.point']">
              {{ extractMessage(errors["factuel.options_de_reponse.0.point"]) }}
            </p>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12 my-2" v-if="errors['factuel.options_de_reponse.0.point']">
              {{ extractMessage(errors["factuel.options_de_reponse.0.point"]) }}
            </p>
          </div>
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

  <!-- Modal pour modifier le parent d'un élément -->
  <Modal backdrop="static" :show="showModifyModal" @hidden="showModifyModal = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">
        Modifier le parent {{ modifyElement.type === 'principe' ? 'du principe' : 
                           modifyElement.type === 'critere' ? 'du critère' : 
                           'de l\'indicateur' }}
      </h2>
    </ModalHeader>
    <ModalBody class="space-y-4">
      <div class="p-4 bg-gray-50 rounded">
        <h3 class="font-medium mb-2">Élément à modifier :</h3>
        <p class="text-sm text-gray-600">{{ modifyElement.currentData.nom }}</p>
      </div>
      
      <div>
        <label class="form-label">
          {{ modifyElement.type === 'principe' ? 'Nouveau type de gouvernance' : 
             modifyElement.type === 'critere' ? 'Nouveau principe de gouvernance' : 
             'Nouveau critère de gouvernance' }}
        </label>
        <TomSelect 
          v-model="modifyElement.newParentId" 
          :options="{ placeholder: 'Sélectionnez un nouveau parent' }"
          class="w-full"
        >
          <option value="">Sélectionnez un nouveau parent</option>
          <option 
            v-for="parent in modifyElement.availableParents" 
            :key="parent.id" 
            :value="parent.id"
          >
            {{ parent.nom }}
          </option>
        </TomSelect>
      </div>
      
      <div class="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-yellow-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <h4 class="font-medium text-yellow-800">Attention</h4>
            <p class="text-sm text-yellow-700 mt-1">
              Cette action déplacera l'élément et tous ses sous-éléments vers le nouveau parent. 
              Les positions seront automatiquement recalculées.
            </p>
          </div>
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <div class="flex gap-2">
        <button 
          type="button" 
          @click="showModifyModal = false" 
          class="w-full px-2 py-2 my-3 btn btn-outline-secondary"
        >
          Annuler
        </button>
        <button 
          type="button" 
          @click="applyModification" 
          :disabled="!modifyElement.newParentId"
          class="w-full px-2 py-2 my-3 btn btn-primary"
        >
          Appliquer
        </button>
      </div>
    </ModalFooter>
  </Modal>
</template>

<style>
.accordion .accordion-item .accordion-header .accordion-button:not(.collapsed) {
  background: rgb(var(--color-primary)) !important;
}

.accordion .accordion-item:first-child {
  margin-top: 0 !important;
}

td {
  vertical-align: top;
  padding-top: 8px;
}
</style>
