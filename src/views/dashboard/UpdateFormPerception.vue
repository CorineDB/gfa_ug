<script setup>
import { onBeforeUnmount, reactive, ref, computed, onMounted } from "vue";
import { toast } from "vue3-toastify";
/*import OptionsResponse from "@/components/create-form/OptionsResponse.vue";
import PrincipeGouvernance from "@/components/create-form/PrincipeGouvernance.vue";
import QuestionsOperationnel from "@/components/create-form/QuestionsOperationnel.vue";*/

import OptionsResponsePerception from "@/components/create-form/OptionsResponsePerception.vue";
import PrincipeDeGouvernancPerception from "@/components/create-form/PrincipeDeGouvernancPerception.vue";

import QuestionsOperationnel from "@/components/create-form/QuestionsOperationnel.vue";

import PerceptionStructureMultiple from "@/components/create-form/PerceptionStructureMultiple.vue";
import PerceptionStructure from "@/components/create-form/PerceptionStructure.vue";
import ListAccordionQuestion from "@/components/create-form/ListAccordionQuestion.vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import FormulaireDePerception from "@/services/modules/enquetes_de_gouvernance/formPerception.service";
import PreviewPerceptionForm from "@/components/create-form/PreviewPerceptionForm.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import ListFormPerception from "@/components/create-form/ListFormPerception.vue";
import ListOptionsResponse from "@/components/create-form/ListOptionsResponse.vue";
import DeleteButton from "@/components/news/DeleteButton.vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { useRoute, useRouter } from "vue-router";
import { useYearsStore } from "@/stores/years";
import AuthService from "@/services/modules/auth.service";
import autoTable from "jspdf-autotable";
import html2canvas from 'html2canvas';


const tableRefUpdate = ref(null);
const isGeneratingPDF = ref(false)

const exportTableToPDF = async () => {
  if (!tableRefUpdate.value) {
    return
  }

  isGeneratingPDF.value = true

  try {
    // Configuration html2canvas
    const canvas = await html2canvas(tableRefUpdate.value, {
      scale: 2, // Meilleure qualité
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        // Appliquer des styles spécifiques pour le rendu PDF
        const clonedTable = clonedDoc.getElementById('my-table-perception-form-update')
        if (clonedTable) {
          clonedTable.style.width = '100%'
          clonedTable.style.fontSize = '12px'
        }
      }
    })

    // Configuration PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // Ajouter le titre et la date/heure
    const now = new Date()
    const dateString = now.toLocaleDateString('fr-FR')
    const timeString = now.toLocaleTimeString('fr-FR')
    
    // Styles pour le titre
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text('TABLEAU DE PERCEPTION', 105, 20, { align: 'center' })
    
    // Sous-titre avec date et heure
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Généré le ${dateString} à ${timeString}`, 105, 28, { align: 'center' })
    
    // Ligne séparatrice
    pdf.setDrawColor(200, 200, 200)
    pdf.line(10, 32, 200, 32)

    const imgWidth = 190 // Largeur utile sur A4 (marges incluses)
    const pageHeight = 277 // Hauteur utile sur A4
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    let position = 35 // Position de départ après le titre
    let heightLeft = imgHeight
    let pageCount = 1

    // Première page
    pdf.addImage(canvas, 'PNG', 10, position, imgWidth, imgHeight, '', 'FAST')
    heightLeft -= (pageHeight - position)

    // Pages supplémentaires si nécessaire
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pageCount++
      
      // Ajouter l'en-tête sur les pages suivantes
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'italic')
      pdf.text(`Tableau de Perception - Page ${pageCount}`, 105, 15, { align: 'center' })
      
      pdf.addImage(canvas, 'PNG', 10, 20, imgWidth, imgHeight, '', 'FAST')
      heightLeft -= pageHeight
    }

    // Ajouter le pied de page sur toutes les pages
    const totalPages = pdf.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Page ${i}/${totalPages}`, 105, 285, { align: 'center' })
    }

    // Téléchargement
    const fileName = `tableau-perception-${now.toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)

  } catch (error) {
    alert('Une erreur est survenue lors de la génération du PDF')
  } finally {
    isGeneratingPDF.value = false
  }
}

const yearsStore = useYearsStore();

const route = useRoute();
const router = useRouter();

const idForm = route.params.id;
const currentTab = ref(0);
const indexAccordion = ref(0);
const resetCurrentForm = ref(false);
const modalForm = ref(false);
const isLoadingForm = ref(false);
const fetchListForms = ref(false);
const resetOptions = ref(false);
const showDeleteForm = ref(false);
const isLoadingOneForm = ref(false);
const previewFormPerceptionData = ref([]);
const globalFormPerceptionData = ref([]);
const previewPrincipesGouvernance = ref({});
const globalPrincipesGouvernance = ref({});
const currentForm = ref({});
const globalOptionResponses = ref({ options_de_reponse: [] });
const previewOptionResponses = ref({ options_de_reponse: [] });
const principesGouvernance = ref({ principes_de_gouvernance: [] });
const uniqueKeys = new Map();
const globalData = localStorage.getItem("globalFormPerceptionData");
const previewData = localStorage.getItem("previewFormPerceptionData");

const STORAGE_KEYS = {
  lastPrincipeIndex: "lastPrincipeIndexGlobal",
  lastQuestionIndex: "lastQuestionIndexByPrincipe",
};

// Fonction pour charger une Map depuis localStorage
const loadMapFromStorage = (storageKey) => {
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return new Map(Object.entries(parsed));
    } catch (e) {
      return new Map();
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
  }
};

// Initialiser les Maps avec les données persistées
const lastPrincipeIndexGlobal = loadMapFromStorage(STORAGE_KEYS.lastPrincipeIndex);
const lastQuestionIndexByPrincipe = loadMapFromStorage(STORAGE_KEYS.lastQuestionIndex);

const makeUniqueKey = (baseKey, parentKey, map, allKeys) => {
  // Récupérer le dernier index utilisé pour ce parent
  let index = map.get(parentKey) ?? 0;

  // Incrémenter pour avoir le prochain index
  index++;
  let key = `${baseKey}_${index}`;

  // Continuer à incrémenter tant que la clé existe
  while (allKeys.has(key)) {
    index++;
    key = `${baseKey}_${index}`;
  }

  // Sauvegarder le nouvel index
  map.set(parentKey, index);

  return key;
};

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
      debutProgramme.value = result.data.data.programme.debut;
      finProgramme.value = result.data.data.programme.fin;
    })
    .catch((e) => {
      toast.error("Une erreur est survenue: Utilisateur connecté .");
    });
};

const currentGlobalPerceptionFormDataArray = ref([]);
const currentPreviewPerceptionFormDataArray = ref([]);

const previewFormulaire = ref(false);
const showModifyModal = ref(false);
const modifyElement = reactive({
  key: '',
  type: '', // 'principe', 'question'
  currentData: {},
  newParentId: '',
  availableParents: []
});

const isAvailable = reactive({
  option: true,
  principe: true,
  indicateur: true,
});

const goBackToCreate = function () {
  resetAllFormWithDataLocalStorage(); /* 
  router.push({ name: "create_form_perception" }); */
  router.push({ name: "Ajouter_un_formulaire_Perception", query: { tab: 1 } });
};

const comeBackToUpdate = function () {
  /* 
  router.push({ name: "create_form_perception" }); */
  router.push({ name: "Ajouter_un_formulaire_Perception", query: { tab: 1 } });
};

const payload = reactive({
  libelle: "",
  annee_exercice: new Date().getFullYear(),
  type: "perception",
  perception: { options_de_reponse: globalOptionResponses.value.options_de_reponse, principes_de_gouvernance: principesGouvernance.value.principes_de_gouvernance },
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

// Fonction pour générer une clé unique pour chaque soumission
const generateKey = (id) => {
  return `${id}`;
};

const organiseGlobalFormPerceptionData = (submissions) => {
  const organisedData = { principes_de_gouvernance: [] };

  submissions.forEach((submission) => {
    // Trouver ou créer le principe de gouvernance
    //let principe = organisedData.principes_de_gouvernance.find((p) => p.id === submission.principe);
    let principe = organisedData.principes_de_gouvernance.find((p) => p.id === submission.principe.id);

    if (!principe) {
      //principe = { id: submission.principe, questions_operationnelle: [] };
      principe = { id: submission.principe.id, position: submission.principe.position, questions_operationnelle: [] };
      organisedData.principes_de_gouvernance.push(principe);
    }

    // Ajouter l'indicateur de gouvernance s'il n'est pas déjà présent
    //if (!principe.questions_operationnelle.includes(submission.indicateur)) {

    let indicateur = principe.questions_operationnelle.find((i) => i.id === submission.indicateur.id);
    if (!indicateur) {
      principe.questions_operationnelle.push({ id: submission.indicateur.id, position: submission.indicateur.position });

      //principe.questions_operationnelle.push(submission.indicateur);
    }
  });

  return organisedData;
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
      // Vérifier les positions existantes pour éviter les conflits
      const existingPositions = principe.questions_operationnelle.map(ind => Number(ind.position));
      let newPosition = 1;

      // Trouver la première position disponible à partir de 1
      while (existingPositions.includes(newPosition)) {
        newPosition++;
      }

      indicateur = { id: submission.indicateur.id, nom: submission.indicateur.nom, position: newPosition, key: submission.key };
      principe.questions_operationnelle.push(indicateur);
    }
  });

  return organisedData;
};

function organiseUpdateFormGlobal(principeCurrent) {
  return principeCurrent.flatMap((principe) =>
    principe.questions_de_gouvernance.map((question) => ({
      principe: principe.categorieableId,
      indicateur: question.question_operationnelle.id,
      position: question.position,
      key: question.question_operationnelle.id + principe.categorieableId,
    }))
  );
}

function setKeyForUpdate(principeCurrent) {
  return principeCurrent.flatMap((principe) =>
    principe.questions_de_gouvernance.forEach((question) => {
      const key = generateKey(question.question_operationnelle.id + principe.categorieableId);
      uniqueKeys.set(key, true);
    })
  );
}
function organiseUpdateFormPreview(principeCurrent) {
  return principeCurrent.flatMap((principe) =>
    principe.questions_de_gouvernance.map((question) => ({
      principe: {
        id: principe.categorieableId,
        nom: principe.nom,
        position: principe.position,
      },
      indicateur: {
        id: question.question_operationnelle.id,
        nom: question.question_operationnelle.nom,
        position: question.position,
      },
      key: question.question_operationnelle.id + principe.categorieableId,
    }))
  );
}

function matchDataUpdateWithCurrentDatas(principeCurrent) {
  globalFormPerceptionData.value = organiseUpdateFormGlobal(principeCurrent);
  previewFormPerceptionData.value = organiseUpdateFormPreview(principeCurrent);

  localStorage.setItem("globalFormPerceptionData", JSON.stringify(globalFormPerceptionData.value));
  localStorage.setItem("previewFormPerceptionData", JSON.stringify(previewFormPerceptionData.value));

  setKeyForUpdate(principeCurrent);

  updateAllTypesGouvernance();
  resetCurrentPreviewPerceptionFormData();
  resetCurrentGlobalPerceptionFormData();
  resetCurrentForm.value = !resetCurrentForm.value;
}

const resetCurrentPreviewPerceptionFormData = () => {
  currentPreviewPerceptionFormData.principe = { id: "", nom: "", position: 0 };
  currentPreviewPerceptionFormData.indicateur = { id: "", nom: "", position: 0 };
  currentPreviewPerceptionFormData.key = "";

  currentPreviewPerceptionFormDataArray.value = [];
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

const getQuestion = (questions) => {
  // Gérer le cas où on reçoit un tableau (sélection multiple) ou un seul élément
  const questionsArray = Array.isArray(questions) ? questions : [questions];
  
  if (!currentGlobalPerceptionFormData.principe) {
    toast.error("Veuillez d'abord sélectionner un principe");
    return;
  }
  
  let addedCount = 0;
  let skippedCount = 0;
  
  questionsArray.forEach((question) => {
    // Vérifier si la question n'est pas déjà ajoutée pour ce principe
    const isAlreadyAdded = excludedQuestions.value.some(exclusion => 
      exclusion.principeId === currentGlobalPerceptionFormData.principe && 
      exclusion.questionId === question.id
    );
    
    if (isAlreadyAdded) {
      skippedCount++;
      return; // Passer à la question suivante
    }
    
    // Traiter cette question
    const key = currentGlobalPerceptionFormData?.principe != "" ? question.id + currentGlobalPerceptionFormData?.principe : question.id;
    
    let form = {
      key: key,
      principe: currentGlobalPerceptionFormData?.principe,
      indicateur: question.id,
      position: currentGlobalPerceptionFormDataArray.value.length + 1,
    };

    currentGlobalPerceptionFormDataArray.value.push(form);

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

    // Vérifier si form2.indicateur.id existe déjà dans currentPreviewPerceptionFormDataArray
    const existsInCurrentPreview = currentPreviewPerceptionFormDataArray.value.some((item) => item.indicateur.id === form2.indicateur.id);

    if (!existsInCurrentPreview) {
      currentPreviewPerceptionFormDataArray.value.push(form2);
      addedCount++;
    }
  });
  
  // Mettre à jour currentPreviewPerceptionFormData.indicateur avec la dernière question ajoutée
  if (addedCount > 0 && questionsArray.length > 0) {
    const lastQuestion = questionsArray[questionsArray.length - 1];
    currentPreviewPerceptionFormData.indicateur = { 
      id: lastQuestion.id, 
      nom: lastQuestion.nom, 
      position: 1 
    };
  }
  
  // Trier les données
  currentPreviewPerceptionFormDataArray.value.sort((a, b) => {
    return a.principe.position - b.principe.position || a.indicateur.position - b.indicateur.position;
  });
  
  // Afficher les résultats
  if (addedCount > 0) {
    if (addedCount === 1) {
      toast.success("Question ajoutée avec succès");
    } else {
      toast.success(`${addedCount} questions ajoutées avec succès`);
    }
  }
  
  if (skippedCount > 0) {
    if (skippedCount === 1) {
      toast.warning("1 question était déjà associée à ce principe");
    } else {
      toast.warning(`${skippedCount} questions étaient déjà associées à ce principe`);
    }
  }
};

const addNewIndicator = () => {
  const sessionKeys = new Set();

  currentGlobalPerceptionFormDataArray.value.forEach((item, index) => {
    const allKeys = new Set([...uniqueKeys.keys(), ...sessionKeys]);

    // 1. Générer principeKey normalement
    const principeKeyBase = generateKey(item.principe);
    const principeKey = makeUniqueKey(principeKeyBase, principeKeyBase, lastPrincipeIndexGlobal, allKeys);
    sessionKeys.add(principeKey);

    // 2. Générer questionKey unique par principeKey
    const questionKeyBase = generateKey(item.indicateur + principeKey);
    const questionKey = makeUniqueKey(questionKeyBase, principeKey, lastQuestionIndexByPrincipe, allKeys);
    sessionKeys.add(questionKey);

    const key = questionKey;

    if (!uniqueKeys.has(key)) {
      // Mettre à jour l'objet
      const updatedItem = {
        ...item,
        key: questionKey,
      };

      const preview = {
        ...currentPreviewPerceptionFormDataArray.value[index],
        key: questionKey,
      };

      globalFormPerceptionData.value.unshift({ ...updatedItem });
      previewFormPerceptionData.value.unshift(JSON.parse(JSON.stringify(preview)));

      // Tri par position
      globalFormPerceptionData.value.sort((a, b) => a.position ?? 0 - b.position ?? 0);

      previewFormPerceptionData.value.sort((a, b) => {
        return a.principe.position - b.principe.position || a.indicateur.position - b.indicateur.position;
      });

      // Sauvegarde
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
      toast.info("Question operationnelle déjà ajouté.");
    }
  });

  // Sauvegarder les Maps mises à jour dans localStorage
  saveMapToStorage(lastPrincipeIndexGlobal, STORAGE_KEYS.lastPrincipeIndex);
  saveMapToStorage(lastQuestionIndexByPrincipe, STORAGE_KEYS.lastQuestionIndex);

  // Ajoute toutes les clés générées dans la session à uniqueKeys
  for (const key of sessionKeys) {
    uniqueKeys.set(key, true);
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
      .map((item, index) => {
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
      .sort((a, b) => a.position - b.position);

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
      .sort((a, b) => a.position - b.position);
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

// Fonction pour valider et réorganiser les positions
const validateAndReorganizePositionsPerception = (key, newPosition, type = "question", isCurrent = false) => {
  const position = parseInt(newPosition);
  
  // Validation de base
  if (position < 1) {
    toast.error("La position doit être supérieure à 0");
    return false;
  }

  if (!isCurrent) {
    let elementsToCheck = [];
    let currentElementId = null;

    if (type === "principe") {
      elementsToCheck = [...new Set(globalFormPerceptionData.value.map(item => item.principe))];
      currentElementId = globalFormPerceptionData.value.find(item => item.key === key)?.principe;
    } else if (type === "question") {
      const currentElement = globalFormPerceptionData.value.find(item => item.key === key);
      if (currentElement) {
        elementsToCheck = [...new Set(
          globalFormPerceptionData.value
            .filter(item => item.principe === currentElement.principe)
            .map(item => item.indicateur)
        )];
        currentElementId = currentElement.indicateur;
      }
    }

    // Validation : la position ne peut pas dépasser le nombre d'éléments
    if (position > elementsToCheck.length) {
      toast.error(`La position ne peut pas dépasser ${elementsToCheck.length}`);
      return false;
    }

    // Réorganiser les positions
    if (type === "principe") {
      updateTemporyPrincipe(currentElementId, position, isCurrent);
    } else if (type === "question") {
      updateTemporyQuestions(key, position, isCurrent);
    }

    recalculatePositionsPerception();
  }

  return true;
};

// Fonction pour recalculer toutes les positions
const recalculatePositionsPerception = () => {
  // 1. Recalculer les positions des principes
  const uniquePrincipes = [...new Set(globalFormPerceptionData.value.map(item => item.principe))];
  uniquePrincipes.forEach((principeId, index) => {
    const newPosition = index + 1;
    globalFormPerceptionData.value.forEach(item => {
      if (item.principe === principeId) {
        item.position = newPosition;
      }
    });
    previewFormPerceptionData.value.forEach(item => {
      if (item.principe.id === principeId) {
        item.principe.position = newPosition;
      }
    });
  });

  // 2. Recalculer les positions des questions pour chaque principe
  uniquePrincipes.forEach(principeId => {
    const questionsForPrincipe = globalFormPerceptionData.value
      .filter(item => item.principe === principeId)
      .sort((a, b) => a.position - b.position);
    
    questionsForPrincipe.forEach((item, index) => {
      const newPosition = index + 1;
      item.position = newPosition;
      
      // Mettre à jour aussi dans previewFormPerceptionData
      const previewItem = previewFormPerceptionData.value.find(preview => 
        preview.principe.id === principeId && 
        preview.indicateur.id === item.indicateur
      );
      if (previewItem) {
        previewItem.indicateur.position = newPosition;
      }
    });
  });

  // Sauvegarder les changements
  localStorage.setItem("globalFormPerceptionData", JSON.stringify(globalFormPerceptionData.value));
  localStorage.setItem("previewFormPerceptionData", JSON.stringify(previewFormPerceptionData.value));
  
  updateAllTypesGouvernance();
};

// Fonction pour ouvrir le modal de modification
const openModifyModal = (key, type, currentData) => {
  modifyElement.key = key;
  modifyElement.type = type;
  modifyElement.currentData = { ...currentData };
  modifyElement.newParentId = '';
  
  loadAvailableParents(type, currentData);
  showModifyModal.value = true;
};

// Fonction pour charger les parents disponibles
const loadAvailableParents = async (type, currentData) => {
  modifyElement.availableParents = [];
  
  try {
    if (type === 'question') {
      // Charger tous les principes de gouvernance disponibles
      const PrincipeGouvernanceService = await import('@/services/modules/enquetes_de_gouvernance/principeGouvernanceDePerception.service');
      const response = await PrincipeGouvernanceService.default.get();
      modifyElement.availableParents = response.data.data || [];
    }
  } catch (error) {
    toast.error('Erreur lors du chargement des données');
  }
};

// Fonction pour appliquer la modification
const applyModification = () => {
  if (!modifyElement.newParentId) {
    toast.error('Veuillez sélectionner un nouveau parent');
    return;
  }

  const { key, type, newParentId } = modifyElement;

  if (type === 'question') {
    // Trouver l'élément à modifier
    const globalIndex = globalFormPerceptionData.value.findIndex(item => item.key === key);
    const previewIndex = previewFormPerceptionData.value.findIndex(item => item.key === key);

    if (globalIndex !== -1 && previewIndex !== -1) {
      // Modifier le principe parent
      globalFormPerceptionData.value[globalIndex].principe = newParentId;
      
      const newParent = modifyElement.availableParents.find(parent => parent.id === newParentId);
      if (newParent) {
        previewFormPerceptionData.value[previewIndex].principe = {
          id: newParent.id,
          nom: newParent.nom,
          position: 1 // Position sera recalculée
        };
      }

      // Recalculer les positions
      recalculatePositionsPerception();
      
      // Sauvegarder
      localStorage.setItem("globalFormPerceptionData", JSON.stringify(globalFormPerceptionData.value));
      localStorage.setItem("previewFormPerceptionData", JSON.stringify(previewFormPerceptionData.value));
      
      toast.success('Modification appliquée avec succès');
    } else {
      toast.error('Élément non trouvé');
    }
  }

  showModifyModal.value = false;
};

// Fonction pour trier toutes les données
const sortAllDataPerception = () => {
  globalFormPerceptionData.value.sort((a, b) => a.position - b.position);
  previewFormPerceptionData.value.sort((a, b) => {
    return a.principe.position - b.principe.position || a.indicateur.position - b.indicateur.position;
  });
};

// Computed pour les questions exclues (déjà utilisées par principe)
const excludedQuestions = computed(() => {
  const exclusions = [];
  
  // Parcourir les données persistées
  globalFormPerceptionData.value.forEach(item => {
    exclusions.push({
      principeId: item.principe,
      questionId: item.indicateur
    });
  });
  
  // Parcourir les données en cours d'ajout
  currentGlobalPerceptionFormDataArray.value.forEach(item => {
    exclusions.push({
      principeId: item.principe,
      questionId: item.indicateur
    });
  });
  
  return exclusions;
});

// Fonction pour supprimer un indicateur
const removeIndicator = (key) => {
  

  // 1. Chercher dans les données persistées (globalFormPerceptionData)
  let index = globalFormPerceptionData.value.findIndex((s) => s.key === key);

  if (index !== -1) {
    globalFormPerceptionData.value.splice(index, 1);
    // Chercher l'index correspondant dans previewFormPerceptionData
    const previewIndex = previewFormPerceptionData.value.findIndex((s) => s.key === key);
    if (previewIndex !== -1) {
      previewFormPerceptionData.value.splice(previewIndex, 1);
    }
    uniqueKeys.delete(key);

    // Trier après suppression
    globalFormPerceptionData.value.sort((a, b) => a.position ?? 0 - b.position ?? 0);
    previewFormPerceptionData.value.sort((a, b) => {
      return a.principe.position - b.principe.position || a.indicateur.position - b.indicateur.position;
    });

    updateAllTypesGouvernance();
    localStorage.setItem("globalFormPerceptionData", JSON.stringify(globalFormPerceptionData.value));
    localStorage.setItem("previewFormPerceptionData", JSON.stringify(previewFormPerceptionData.value));

    toast.success("Question opérationnelle supprimée.");
    return;
  }

  // 2. Chercher dans previewFormPerceptionData (pour les éléments avec clés longues)
  index = previewFormPerceptionData.value.findIndex((s) => s.key === key);
  if (index !== -1) {
    previewFormPerceptionData.value.splice(index, 1);
    // Chercher et supprimer dans globalFormPerceptionData aussi
    const globalIndex = globalFormPerceptionData.value.findIndex((s) => s.key === key);
    if (globalIndex !== -1) {
      globalFormPerceptionData.value.splice(globalIndex, 1);
    }
    uniqueKeys.delete(key);

    updateAllTypesGouvernance();
    localStorage.setItem("globalFormPerceptionData", JSON.stringify(globalFormPerceptionData.value));
    localStorage.setItem("previewFormPerceptionData", JSON.stringify(previewFormPerceptionData.value));

    toast.success("Question opérationnelle supprimée.");
    return;
  }

  // 3. Chercher dans les données temporaires
  let indice = currentPreviewPerceptionFormDataArray.value.findIndex((s) => s.key === key);
  
  if (indice === -1) {
    // Essayer avec d'autres variantes de clé
    const questionId = key.split(/[_+]/)[0];
    indice = currentPreviewPerceptionFormDataArray.value.findIndex((s) => s.indicateur?.id == questionId);
  }

  if (indice !== -1) {
    currentPreviewPerceptionFormDataArray.value.splice(indice, 1);
    
    // Chercher et supprimer dans currentGlobalPerceptionFormDataArray
    const globalIndex = currentGlobalPerceptionFormDataArray.value.findIndex((s) => s.key === key);
    if (globalIndex !== -1) {
      currentGlobalPerceptionFormDataArray.value.splice(globalIndex, 1);
    }

    toast.success("Question opérationnelle supprimée.");
    return;
  }

  toast.error("Impossible de supprimer cet élément.");
};

// Fonction pour supprimer un élément (principe avec toutes ses questions)
const removeElement = (key) => {
  // Trouver l'élément à supprimer
  const elementToRemove = previewFormPerceptionData.value.find(item => item.key === key) ||
                         globalFormPerceptionData.value.find(item => item.key === key);

  if (!elementToRemove) {
    toast.error("Élément non trouvé");
    return;
  }

  const principeId = elementToRemove.principe;
  if (!principeId) {
    toast.error("Impossible de déterminer le principe à supprimer");
    return;
  }

  // Supprimer toutes les questions de ce principe
  const keysToDelete = [];
  
  // Collecter les clés à supprimer
  globalFormPerceptionData.value.forEach(item => {
    if (item.principe === principeId) {
      keysToDelete.push(item.key);
    }
  });

  // Supprimer de globalFormPerceptionData
  for (let i = globalFormPerceptionData.value.length - 1; i >= 0; i--) {
    if (globalFormPerceptionData.value[i].principe === principeId) {
      const keyToDelete = globalFormPerceptionData.value[i].key;
      globalFormPerceptionData.value.splice(i, 1);
      uniqueKeys.delete(keyToDelete);
    }
  }

  // Supprimer de previewFormPerceptionData
  for (let i = previewFormPerceptionData.value.length - 1; i >= 0; i--) {
    if (previewFormPerceptionData.value[i].principe?.id === principeId) {
      previewFormPerceptionData.value.splice(i, 1);
    }
  }

  // Recalculer les positions après suppression
  recalculatePositionsPerception();
  
  // Trier les données
  sortAllDataPerception();

  // Mettre à jour l'affichage
  updateAllTypesGouvernance();

  // Sauvegarder
  localStorage.setItem("globalFormPerceptionData", JSON.stringify(globalFormPerceptionData.value));
  localStorage.setItem("previewFormPerceptionData", JSON.stringify(previewFormPerceptionData.value));

  toast.success(`Principe supprimé avec ${keysToDelete.length} question(s).`);
};

// Fonctions d'édition des positions
const editTemporyPrincipe = (id, position, isCurrent = false) => {
  const key = globalFormPerceptionData.value.find(item => item.principe === id)?.key;
  if (validateAndReorganizePositionsPerception(key, position, 'principe', isCurrent)) {
    canEditPrincipe.value[id] = false;
  }
};

const editTemporyQuestion = (key, position, isCurrent = false) => {
  if (validateAndReorganizePositionsPerception(key, position, 'question', isCurrent)) {
    canEditQuestion.value[key] = false;
  }
};

// Fonctions pour gérer l'édition des positions dans l'interface
const handleEditPrincipe = (id) => {
  canEditPrincipe.value[id] = true;
};

const handleEditQuestion = (key) => {
  canEditQuestion.value[key] = true;
};

const getOneForm = async () => {
  isLoadingOneForm.value = true;
  try {
    const { data } = await FormulaireDePerception.getOne(idForm);
    currentForm.value = data.data;
    matchDataUpdateWithCurrentDatas(currentForm.value.categories_de_gouvernance);
    payload.libelle = currentForm.value.libelle;
    payload.annee_exercice = currentForm.value.annee_exercice;
  } catch (e) {
    toast.error("Erreur récupération du  formulaire.");
  } finally {
    isLoadingOneForm.value = false;
  }
};

const updateForm = async () => {
  isLoadingForm.value = true;

  payload.perception.options_de_reponse = previewOptionResponses.value.options_de_reponse;

  payload.perception.principes_de_gouvernance = globalPrincipesGouvernance.value.principes_de_gouvernance;
 
  try {
    await FormulaireDePerception.update(idForm, payload);
    toast.success(`Formulaire Modifiée avec succès.`);

    fetchListForms.value = !fetchListForms.value;
    clearUniqueKeys();
    resetAllForm();
    modalForm.value = false;
    router.push({ name: "Ajouter_un_formulaire_Perception", query: { tab: 1 } });
  } catch (e) {
    toast.error(getAllErrorMessages(e));
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
  // Vérifier qu'un principe est sélectionné
  const hasPrincipe = currentPreviewPerceptionFormData.principe && 
                     currentPreviewPerceptionFormData.principe.id && 
                     currentPreviewPerceptionFormData.principe.id.trim() !== "";
  
  // Vérifier qu'au moins une question est ajoutée (soit en cours d'ajout, soit déjà ajoutée)
  const hasQuestions = currentPreviewPerceptionFormDataArray.value.length > 0 ||
                      (currentPreviewPerceptionFormData.indicateur && 
                       currentPreviewPerceptionFormData.indicateur.id && 
                       currentPreviewPerceptionFormData.indicateur.id.trim() !== "");
  
  return hasPrincipe && hasQuestions;
});

const showForm = computed(() => {
  return globalFormPerceptionData.value.length > 0;
});

onBeforeUnmount(() => {
  clearUniqueKeys();
  localStorage.removeItem("globalFormPerceptionData");
  localStorage.removeItem("previewFormPerceptionData");
});

onMounted(async () => {
  await getOneForm();
  updateAllTypesGouvernance();
  getcurrentUser();
});
</script>

<template>
  <div class="flex w-full gap-2">
    <section class="w-[30%] _h-screen pr-1 overflow-y-auto border-r-2 pt-5">
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
            <QuestionsOperationnel 
              :to-reset="resetCurrentForm" 
              :is-available="isAvailable.indicateur" 
              :excluded-questions="excludedQuestions"
              :current-principe="currentPreviewPerceptionFormData.principe"
              @selected="getQuestion" 
            />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem class="">
          <Accordion class="text-lg !p-3 font-semibold bg-gray-700 !text-white flex items-center justify-between">
            <p>Options de réponses</p>
            <ChevronDownIcon />
          </Accordion>
          <AccordionPanel class="p-2">
            <OptionsResponsePerception :reset-to="resetOptions" :is-update="true" :id-form="idForm" v-model:previewOptionResponses="previewOptionResponses" v-model:globalOptionResponses="globalOptionResponses" />
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
              <!-- <pre>{{ currentForm }}</pre> -->
              <div class="space-y-2">
                <p class="text-lg font-medium">Ajouter des questions opérationnelles</p>

                <PerceptionStructureMultiple @deleteQuestion="removeIndicator" @deletePrincipe="removeElement" @editPositionPrincipe="updateTemporyPrincipe" @editPositionQuestion="updateTemporyQuestions" :principe="currentPreviewPerceptionFormData.principe" :indicateurArray="currentPreviewPerceptionFormDataArray.length > 0 ? currentPreviewPerceptionFormDataArray : undefined" />

                <button :disabled="!isCurrentFormValid" @click="addNewIndicator" class="my-4 text-sm btn btn-primary"><PlusIcon class="mr-1 size-4" />Ajouter</button>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </section>
  </div>

  <div class="space-y-2 mt-6" v-if="!isLoadingOneForm">
    <div class="flex justify-between items-center py-2">
      <p class="text-lg font-medium">Modification du Formulaire</p>

      <div class="flex justify-spacely py-2" v-if="previewPrincipesGouvernance?.principes_de_gouvernance?.length">
        <button :disabled="!showForm" @click="previewForm" class="mr-5 px-5 text-base btn btn-primary"><CheckIcon class="mr-1 size-5" />Modifier</button>
        <button :disabled="!showForm" @click="previewFormulaire = true" class="px-5 text-base btn btn-primary"><EyeIcon class="mr-1 size-5" />Voir le formumlaire</button>
      </div>
    </div>
    <div class="max-h-[75vh] py-2 border-t overflow-y-auto mb-10 mt-2">
      <table class="w-full border-collapse table-auto border-slate-500" cellpadding="10" cellspacing="0">
        <thead class="text-white bg-blue-900">
          <!-- First header row -->
          <tr>
            <th class="py-3 border border-slate-900">Principes</th>
            <th class="py-3 border border-slate-900">Indicateurs</th>
            <th class="py-3 border border-slate-900 max-w-[200px]">Actions</th>
          </tr>
        </thead>

        <tbody v-if="previewPrincipesGouvernance?.principes_de_gouvernance?.length">
          <template v-for="principe_de_gouvernance in previewPrincipesGouvernance.principes_de_gouvernance" :key="principe_de_gouvernance.id">
            <template v-for="(question_operationnelle, qIndex) in principe_de_gouvernance.questions_operationnelle" :key="question_operationnelle.id">
              <tr>
                <td class="font-semibold list-data" v-if="qIndex === 0" :rowspan="principe_de_gouvernance.questions_operationnelle.length">
                  <div class="flex items-start gap-1">{{ principe_de_gouvernance.position }} - {{ principe_de_gouvernance.nom }}</div>

                  <div class="items-center transition-all opacity-0 container-buttons">
                    <div v-if="canEditPrincipe[principe_de_gouvernance.id]">
                      <input type="number" min="1" step="1" name="position" :value="principe_de_gouvernance.position" @keyup.enter="editTemporyPrincipe(principe_de_gouvernance.id, $event.target.value)" class="w-2/5 form-control" />
                    </div>
                    <div v-else>
                      <button class="p-1.5 text-primary" title="Modifier la position">
                        <Edit3Icon class="size-5" @click="handleEditPrincipe(principe_de_gouvernance.id)" />
                      </button>
                      <button class="p-1.5 text-danger" @click="removeElement(question_operationnelle.key, 'principe')">
                        <TrashIcon class="size-5" />
                      </button>
                    </div>
                  </div>
                </td>
                <td>{{ principe_de_gouvernance.position }}.{{ question_operationnelle.position }} - {{ question_operationnelle.nom }}</td>

                <td>
                  <div class="flex items-center">
                    <div v-if="canEditQuestion[question_operationnelle.key]">
                      <input type="number" min="1" step="1" name="position" :value="question_operationnelle.position" @keyup.enter="editTemporyQuestion(question_operationnelle.key, $event.target.value)" class="w-2/5 form-control" />
                    </div>
                    <div v-else class="flex gap-1">
                      <button class="p-1.5 text-primary" @click="handleEditQuestion(question_operationnelle.key)" title="Modifier la position">
                        <Edit3Icon class="size-5" />
                      </button>
                      <button class="p-1.5 text-info" @click="openModifyModal(question_operationnelle.key, 'question', question_operationnelle)" title="Changer de principe">
                        <ArrowRightIcon class="size-5" />
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
      <div class="flex justify-between py-2 my-2 items-center">
        <button @click="goBackToCreate" class="px-5 mr-4 text-base btn btn-danger"><ArrowLeftIcon class="mr-1 size-5" />Annuler la modification</button>
        <button @click="resetAllFormWithDataLocalStorage" class="px-5 text-base btn btn-outline-danger"><TrashIcon class="mr-1 size-5" />Vider</button>
      </div>

      <button @click="comeBackToUpdate" class="px-5 text-base btn btn-primary"><RotateCcwIcon class="mr-1 size-5" />Revenir pour continuer la modification</button>
    </div>
  </div>
  <LoaderSnipper v-else />

  <Modal backdrop="static" :show="previewFormulaire" size="modal-xl" @hidden="previewFormulaire = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Formulaire de perception de gouvernance</h2>
    </ModalHeader>
    <ModalBody class="space-y-5">
       <button 
          @click="exportTableToPDF" 
          :disabled="isGeneratingPDF"
          class="btn btn-primary"
        >
          <span v-if="isGeneratingPDF">⏳</span>
          <span v-else>📊</span>
          {{ isGeneratingPDF ? 'Génération...' : 'Exporter en PDF' }}
        </button>
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

      <table id="my-table-perception-form-update" ref="tableRefUpdate" class="w-full mt-5 border-collapse table-auto border-slate-500" cellpadding="10" cellspacing="0">
        <thead class="text-white bg-blue-900">
          <!-- First header row -->
          <tr>
            <th :rowspan="2" class="py-3 border border-slate-900">Principes</th>
            <th :rowspan="2" class="py-3 border border-slate-900">Indicateurs</th>
            <th :colspan="previewOptionResponses.options_de_reponse.length" class="py-3 border border-slate-900 text-center">Réponses</th>
          </tr>
          <!-- Second header row -->
          <tr>
            <template v-for="(option_de_reponse, idx) in previewOptionResponses.options_de_reponse" :key="option_de_reponse.id">
              <th class="py-3 border border-slate-900 text-center">{{ option_de_reponse.libelle }}</th>
            </template>
          </tr>
        </thead>

        <tbody v-if="previewPrincipesGouvernance?.principes_de_gouvernance?.length">
          <template v-for="principe_de_gouvernance in previewPrincipesGouvernance.principes_de_gouvernance" :key="principe_de_gouvernance.id">
            <template v-for="(question_operationnelle, qIndex) in principe_de_gouvernance.questions_operationnelle" :key="question_operationnelle.id">
              <tr>
                <td class="font-semibold" v-if="qIndex === 0" :rowspan="principe_de_gouvernance.questions_operationnelle.length">{{ principe_de_gouvernance.position }} - {{ principe_de_gouvernance.nom }}</td>

                <td>{{ principe_de_gouvernance.position }}.{{ question_operationnelle.position }} - {{ question_operationnelle.nom }}</td>

                <template v-for="(option_de_reponse, optionIdx) in previewOptionResponses.options_de_reponse" :key="option_de_reponse.id">
                  <td class="border border-slate-900 text-center">{{}}</td>
                </template>
              </tr>
            </template>
          </template>
        </tbody>

        <tbody v-else>
          <tr class="bg-transparent text-center">
            <td :colspan="2 + previewOptionResponses.options_de_reponse.length" class="font-semibold">Constituer le formulaire de perception</td>
          </tr>
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

  <!-- BEGIN: Modal de modification -->
  <Modal backdrop="static" :show="showModifyModal" @hidden="showModifyModal = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Modifier l'élément</h2>
    </ModalHeader>
    <ModalBody class="space-y-4">
      <div>
        <p class="text-sm text-gray-600 mb-2">Élément à modifier:</p>
        <p class="text-sm text-gray-600">{{ modifyElement.currentData.nom }}</p>
      </div>
      
      <div v-if="modifyElement.type === 'question'">
        <label class="form-label">Nouveau principe parent</label>
        <select 
          v-model="modifyElement.newParentId" 
          class="form-select w-full"
        >
          <option value="">Sélectionner un principe</option>
          <option 
            v-for="parent in modifyElement.availableParents" 
            :key="parent.id" 
            :value="parent.id"
          >
            {{ parent.nom }}
          </option>
        </select>
      </div>
    </ModalBody>
    <ModalFooter>
      <div class="flex gap-2">
        <button 
          type="button" 
          @click="showModifyModal = false" 
          class="px-4 py-2 btn btn-outline-secondary"
        >
          Annuler
        </button>
        <button 
          type="button" 
          @click="applyModification"
          :disabled="!modifyElement.newParentId"
          class="px-4 py-2 btn btn-primary"
        >
          Appliquer
        </button>
      </div>
    </ModalFooter>
  </Modal>
  <!-- END: Modal de modification -->

  <!-- BEGIN: Modal Content -->
  <!-- size="modal-xl"  -->
  <Modal backdrop="static" :show="modalForm" @hidden="modalForm = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Modifier le formulaire</h2>
    </ModalHeader>
    <form @submit.prevent="updateForm">
      <ModalBody class="space-y-5">
        <div class="gap-4">
          <InputForm 
            id="libelle_perception_update"
            name="libelle"
            label="Libellé" 
            class="w-full mb-4" 
            v-model="payload.libelle" 
          />
        </div>
        <div>
          <p class="mb-3">Options de réponses</p>
          <ListOptionsResponse :options="previewOptionResponses.options_de_reponse" />
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button 
            type="button" 
            @click="modalForm = false" 
            class="w-full px-2 py-2 my-3 btn btn-outline-secondary"
            id="annuler_perception_update"
          >
            Annuler
          </button>
          <VButton 
            :loading="isLoadingForm" 
            label="Modifier" 
            type="submit"
            id="modifier_perception"
          />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- END: Modal Content -->
</template>

<style >
.accordion .accordion-item .accordion-header .accordion-button:not(.collapsed) {
  background: rgb(var(--color-primary)) !important;
}

.accordion .accordion-item:first-child {
  margin-top: 0 !important;
}

.Toastify__toast-container {
  z-index: 200000 !important;
}

table td {
  border: 1px solid rgb(46, 46, 46);
  padding-block: 8px;
  padding-inline: 4px;
}
</style>
