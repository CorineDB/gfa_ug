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
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from 'html2canvas';


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

const generatePDFAdvanced = () => {
  
  const doc = new jsPDF({ 
    orientation: "landscape", 
    format: "a3",
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
  const table = document.getElementById('my-table-perception-form');
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
  doc.text("Formulaire de perception de gouvernance", 14, 15);

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

  doc.save("formulaire-de-perception.pdf");
};

const tableRef = ref(null);
const isGeneratingPDF = ref(false)

const exportTableToPDF = async () => {
  if (!tableRef.value) {
    return
  }

  isGeneratingPDF.value = true

  try {
    // Configuration html2canvas
    const canvas = await html2canvas(tableRef.value, {
      scale: 2, // Meilleure qualité
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        // Appliquer des styles spécifiques pour le rendu PDF
        const clonedTable = clonedDoc.getElementById('my-table-perception-form')
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
  // Ouvrir automatiquement l'accordéon des questions opérationnelles
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

    currentPreviewPerceptionFormDataArray.value.push(form2);
    addedCount++;
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


  currentGlobalPerceptionFormDataArray.value.forEach((item, index) => {
    const key = generateKey(item.indicateur + item.principe);

    if (!uniqueKeys.has(key)) {
      globalFormPerceptionData.value.unshift({ ...item });

      previewFormPerceptionData.value.unshift(JSON.parse(JSON.stringify(currentPreviewPerceptionFormDataArray.value[index])));

      uniqueKeys.set(key, true);

      // ✅ Sort after unshift - Fixed null position handling
      globalFormPerceptionData.value.sort((a, b) => (a.position || 0) - (b.position || 0));

      previewFormPerceptionData.value.sort((a, b) => {
        return (a.principe.position || 0) - (b.principe.position || 0) || 
               (a.indicateur.position || 0) - (b.indicateur.position || 0);
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

const removeElement = (key, type = 'principe') => {
  if (!key) {
    toast.error("Clé de suppression invalide");
    return;
  }

  // Trouver l'élément à supprimer
  const elementToRemove = globalFormPerceptionData.value.find((s) => s.key === key);
  if (!elementToRemove) {
    // Si pas trouvé dans les données persistées, chercher dans les données temporaires
    resetCurrentPreviewPerceptionFormData();
    resetCurrentGlobalPerceptionFormData();
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

    // ✅ Sort after removal
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

  // 3. Chercher dans les données temporaires avec différentes variantes de clé
  let indice = currentPreviewPerceptionFormDataArray.value.findIndex((s) => s.key === key);
  
  if (indice === -1) {
    // Essayer avec la clé générée différemment
    indice = currentPreviewPerceptionFormDataArray.value.findIndex((s) => {
      const keyVariant1 = s.indicateur?.id + s.principe?.id;
      const keyVariant2 = s.indicateur?.id + "" + s.principe?.id;
      const keyVariant3 = generateKey(s.indicateur?.id + s.principe?.id);
      return keyVariant1 === key || keyVariant2 === key || keyVariant3 === key;
    });
    
    if (indice !== -1) {
    }
  } else {
  }

  if (indice !== -1) {
    currentGlobalPerceptionFormDataArray.value.splice(indice, 1);
    currentPreviewPerceptionFormDataArray.value.splice(indice, 1);
    uniqueKeys.delete(key);

    // ✅ Sort after removal
    currentGlobalPerceptionFormDataArray.value.sort((a, b) => a.position ?? 0 - b.position ?? 0);
    currentPreviewPerceptionFormDataArray.value.sort((a, b) => {
      return a.principe.position - b.principe.position || a.indicateur.position - b.indicateur.position;
    });

    toast.success("Question supprimée.");
    return;
  }

  toast.error("Impossible de supprimer cet élément.");
};

function editPrincipe(id) {
  canEditPrincipe.value[id] = true;
}

// Handle edit action
const handleEdit = (key) => {
  canEditQuestion.value[key] = true;
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
  if (route.query.tab) {
    currentTab.value = Number(route.query.tab);
  } else {
    currentTab.value = 0;
  }
});

// ===== FONCTIONNALITÉS AVANCÉES MIGRÉES DU FACTUEL =====

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
  
  // Trouver tous les éléments affectés
  const affectedElements = findAffectedElementsPerception(key, type);
  
  // Supprimer les éléments de leur position actuelle
  removeElementsFromCurrentPositionPerception(affectedElements, type);
  
  // Réassigner les éléments au nouveau parent
  reassignElementsToNewParentPerception(affectedElements, type, newParentId);
  
  // Recalculer toutes les positions
  recalculatePositionsPerception();
  
  // Trier les données
  sortAllDataPerception();
  
  // Mettre à jour l'affichage
  updateAllTypesGouvernance();
  
  // Sauvegarder
  localStorage.setItem('globalFormPerceptionData', JSON.stringify(globalFormPerceptionData.value));
  localStorage.setItem('previewFormPerceptionData', JSON.stringify(previewFormPerceptionData.value));
  
  // Fermer le modal
  showModifyModal.value = false;
  
  toast.success('Modification effectuée avec succès');
};

// Fonction pour trouver tous les éléments affectés
const findAffectedElementsPerception = (key, type) => {
  const globalAffected = [];
  const previewAffected = [];
  
  if (type === 'question') {
    globalAffected.push(...globalFormPerceptionData.value.filter(item => item.key === key));
    previewAffected.push(...previewFormPerceptionData.value.filter(item => item.key === key));
  }
  
  return { globalAffected, previewAffected };
};

// Fonction pour supprimer les éléments de leur position actuelle
const removeElementsFromCurrentPositionPerception = (affectedElements, type) => {
  const { globalAffected, previewAffected } = affectedElements;
  
  // Supprimer de globalFormPerceptionData
  globalAffected.forEach(element => {
    const index = globalFormPerceptionData.value.indexOf(element);
    if (index !== -1) {
      globalFormPerceptionData.value.splice(index, 1);
    }
  });
  
  // Supprimer de previewFormPerceptionData
  previewAffected.forEach(element => {
    const index = previewFormPerceptionData.value.indexOf(element);
    if (index !== -1) {
      previewFormPerceptionData.value.splice(index, 1);
    }
  });
};

// Fonction pour réassigner les éléments au nouveau parent
const reassignElementsToNewParentPerception = (affectedElements, type, newParentId) => {
  const { globalAffected, previewAffected } = affectedElements;
  const newParent = modifyElement.availableParents.find(parent => parent.id === newParentId);
  if (!newParent) return;
  
  // Réassigner les éléments globaux
  globalAffected.forEach(element => {
    if (type === 'question') {
      element.principe = newParentId;
      element.key = element.indicateur + newParentId; // Recalculer la clé
    }
    
    // Rajouter à globalFormPerceptionData
    globalFormPerceptionData.value.push(element);
  });
  
  // Réassigner les éléments de prévisualisation
  previewAffected.forEach(element => {
    if (type === 'question') {
      element.principe = { id: newParentId, nom: newParent.nom, position: 0 };
      element.key = element.indicateur.id + newParentId;
    }
    
    // Rajouter à previewFormPerceptionData
    previewFormPerceptionData.value.push(element);
  });
};

// Fonction pour recalculer les positions après modification
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
};

// Fonction pour trier toutes les données
const sortAllDataPerception = () => {
  globalFormPerceptionData.value.sort((a, b) => {
    return a.position - b.position;
  });
  
  previewFormPerceptionData.value.sort((a, b) => {
    return a.principe.position - b.principe.position || 
           a.indicateur.position - b.indicateur.position;
  });
};

// Fonction pour validation et réorganisation des positions
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

    // Réorganisation des positions
    reorganizePositionsPerception(currentElementId, position, type, isCurrent);
  }

  return true;
};

// Fonction pour réorganiser les positions
const reorganizePositionsPerception = (elementId, newPosition, type, isCurrent = false) => {
  if (type === "principe") {
    // Obtenir tous les principes uniques avec leurs positions actuelles
    const principePositions = new Map();
    globalFormPerceptionData.value.forEach(item => {
      if (!principePositions.has(item.principe)) {
        principePositions.set(item.principe, item.position || 1);
      }
    });

    // Créer un tableau ordonné des principes
    const sortedPrincipes = Array.from(principePositions.entries()).sort((a, b) => a[1] - b[1]);
    const elementIndex = sortedPrincipes.findIndex(([id]) => id === elementId);
    const [element] = sortedPrincipes.splice(elementIndex, 1);
    sortedPrincipes.splice(newPosition - 1, 0, element);

    // Appliquer les nouvelles positions
    sortedPrincipes.forEach(([principeId], index) => {
      const newPos = index + 1;
      globalFormPerceptionData.value.forEach(item => {
        if (item.principe === principeId) {
          item.position = newPos;
        }
      });
      previewFormPerceptionData.value.forEach(item => {
        if (item.principe.id === principeId) {
          item.principe.position = newPos;
        }
      });
    });
  }

  // Tri et sauvegarde
  sortAllDataPerception();
  updateAllTypesGouvernance();
  localStorage.setItem('globalFormPerceptionData', JSON.stringify(globalFormPerceptionData.value));
  localStorage.setItem('previewFormPerceptionData', JSON.stringify(previewFormPerceptionData.value));

  toast.success("Position mise à jour avec réorganisation");
};

// Fonctions d'édition améliorées avec validation
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

const handleEditPrincipe = (id) => {
  canEditPrincipe.value[id] = true;
};

const handleEditQuestion = (key) => {
  canEditQuestion.value[key] = true;
};

// ===== FIN DES FONCTIONNALITÉS AVANCÉES =====

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
                      <input :id="'position_principe_' + principe_de_gouvernance.id" :name="'position_principe_' + principe_de_gouvernance.id" type="number" min="1" step="1" :value="principe_de_gouvernance.position" @keyup.enter="editTemporyPrincipe(principe_de_gouvernance.id, $event.target.value)" class="w-2/5 form-control" />
                    </div>
                    <div v-else class="flex gap-1">
                      <button class="p-1.5 text-primary" @click="handleEditPrincipe(principe_de_gouvernance.id)" title="Modifier la position">
                        <Edit3Icon class="size-5" />
                      </button>
                      <button class="p-1.5 text-danger" @click="removeElement(question_operationnelle.key, 'principe')">
                        <TrashIcon class="size-5" />
                      </button>
                    </div>
                  </div>
                </td>

                <td>{{ qIndex + 1 }} - {{ question_operationnelle.nom }}</td>

                <td>
                  <div class="flex items-center">
                    <div v-if="canEditQuestion[question_operationnelle.key]">
                      <input :id="'position_question_' + question_operationnelle.key" :name="'position_question_' + question_operationnelle.key" type="number" min="1" step="1" :value="question_operationnelle.position" @keyup.enter="editTemporyQuestion(question_operationnelle.key, $event.target.value)" class="w-2/5 form-control" />
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
      <!-- <div class="text-right">
          <button @click="generatePDFAdvanced" class="btn btn-primary text-left">Télécharger PDF</button>
      </div> -->
       <!-- <button @click="printTable" class="mb-4 bg-blue-500 text-white px-3 py-1 rounded">
      🖨️ Imprimer
       </button> -->

         <button 
          @click="exportTableToPDF" 
          :disabled="isGeneratingPDF"
          class="btn btn-primary"
        >
          <span v-if="isGeneratingPDF">⏳</span>
          <span v-else>📊</span>
          {{ isGeneratingPDF ? 'Génération...' : 'Exporter en PDF' }}
        </button>

      <table  class="w-full border-collapse table-auto border-slate-500" border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; font-family: Arial, sans-serif">
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

      <table  id="my-table-perception-form"   cellpadding="10"   cellspacing="0"
       ref="tableRef"  class="w-full mt-5 border-collapse table-auto border-slate-500">
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
                <td class="font-semibold" v-if="qIndex === 0" :rowspan="principe_de_gouvernance.questions_operationnelle.length">{{ principe_de_gouvernance.position }}-{{ principe_de_gouvernance.nom }}</td>

                <td>{{ principe_de_gouvernance.position }}.{{ qIndex + 1 }}-{{ question_operationnelle.nom }}</td>

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
          <InputForm id="libelle_perception" name="libelle_perception" label="Libellé" class="w-full mb-4" :control="getFieldErrors(errors.libelle)" v-model="payload.libelle" />
          <!-- <div class="w-full">
            <label for="annee_perception" class="form-label">Année<span class="text-danger">*</span> </label>
            <TomSelect id="annee_perception" name="annee_perception" v-model="payload.annee_exercice" :options="{ placeholder: 'Selectionez une année' }"
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

  <!-- Modal pour modifier le parent d'une question -->
  <Modal backdrop="static" :show="showModifyModal" @hidden="showModifyModal = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">
        Changer le principe de la question
      </h2>
    </ModalHeader>
    <ModalBody class="space-y-4">
      <div class="p-4 bg-gray-50 rounded">
        <h3 class="font-medium mb-2">Question à modifier :</h3>
        <p class="text-sm text-gray-600">{{ modifyElement.currentData.nom }}</p>
      </div>
      
      <div>
        <label for="nouveau_principe_perception" class="form-label">
          Nouveau principe de gouvernance
        </label>
        <TomSelect
          id="nouveau_principe_perception"
          name="nouveau_principe_perception"
          v-model="modifyElement.newParentId"
          :options="{ placeholder: 'Sélectionnez un nouveau principe' }"
          class="w-full"
        >
          <option value="">Sélectionnez un nouveau principe</option>
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
              Cette action déplacera la question vers le nouveau principe sélectionné. 
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

.Toastify__toast-container {
  z-index: 200000 !important;
}
</style>
