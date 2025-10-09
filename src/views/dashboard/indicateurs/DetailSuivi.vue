<script setup>
import { computed, onMounted, ref, reactive , watch } from "vue";
import IndicateursService from "@/services/modules/indicateur.service";
import IndicateurSuivisService from "@/services/modules/indicateur.suivi.service";
import AuthService from "@/services/modules/auth.service";
import Tabulator from "tabulator-tables";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { useRoute, useRouter } from "vue-router";
import InputForm from "@/components/news/InputForm.vue";
import VButton from "@/components/news/VButton.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import ChartDetailSuivi from "../../../components/news/ChartDetailSuivi.vue";
import { sourcesDonnees } from "@/utils/constants";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { Chart, registerables } from "chart.js";

// Enregistrer tous les composants Chart.js
Chart.register(...registerables);




const route = useRoute();
const router = useRouter();
const isCreate = ref(true);
const tabulator = ref();
const idSelect = ref("");
const nameSelect = ref("");
const showModalValidate = ref(false);
const isLoadingData = ref(true);
const isLoading = ref(false);
const datas = ref([]);
const formErrors = ref({});

const debutProgramme = ref("");
const finProgramme = ref("");

const getDatas = async () => {
  isLoadingData.value = true;
  await IndicateursService.detailSuivi(idIndicateur.value)
    .then((result) => {
      datas.value = result.data.data;
      isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste de sources.");
    });
  initTabulator();
};

const handleValidate = (params) => {
  idSelect.value = params.id;
  showModalValidate.value = true;
};

const initTabulator = () => {
  tabulator.value = new Tabulator("#tabulator", {
    data: datas.value,
    placeholder: "Aucune donnée disponible.",
    layout: "fitColumns",
    columns: [
      {
        title: "Valeur réalisée",
        field: "valeurRealise",
        hozAlign: "left",
        vertAlign: "middle",
        formatter(cell) {
          return `${formatObject(cell.getData().valeurRealise)}`;
        },
      },
      {
        title: "Date de suivie",
        field: "dateSuivie",
        hozAlign: "center",
        vertAlign: "middle",
        formatter(cell) {
          return `${formatDateOnly(cell.getData().dateSuivie)}`;
        },
      },
      {
        title: "Trimestre",
        field: "trimestre",
        hozAlign: "center",
        vertAlign: "middle",
      },

      {
        title: "Valeur cible",
        field: "valeurCible",
        hozAlign: "center",
        vertAlign: "middle",

        formatter(cell) {
          return `${formatObject(cell.getData().valeurCible.valeurCible)} - ${cell.getData().valeurCible.annee}`;
        },
      },
      {
        title: "Auteur",
        field: "auteur",
        hozAlign: "center",
        vertAlign: "middle",
        formatter(cell) {
          return `<div>${cell.getData().auteur?.nom ?? ""}</div>`;
        },
      },
      {
        title: "Actions",
        field: "actions",
        width: 350,
        formatter: (cell) => {
          const container = document.createElement("div");
          container.className = "flex items-center justify-start gap-3";

          const createButton = (label, className, onClick) => {
            const button = document.createElement("button");
            button.className = className;
            button.innerText = label;
            button.addEventListener("click", onClick);
            return button;
          };

          const validateButton = createButton("Valider", "btn btn-primary", () => {
            handleValidate(cell.getData());
          });

          if (!cell.getData().estValider) {
            container.append(validateButton);
          }

          const suiviButton = createButton("Suivi", "btn btn-primary", () => {
            handleSuivi(cell.getData());
          });

          const modifyButton = createButton("Modifier", "btn btn-primary", () => {
            handleEditSuivi(cell.getData());
          });

          const deleteButton = createButton("Supprimer", "btn btn-danger", () => {
            handleDelete(cell.getData());
          });

          container.append(suiviButton, modifyButton, deleteButton);
          return container;
        },
      },
    ],
  });
};

const idIndicateur = computed(() => route.params.id);

function formatObject(obj) {
  if (!obj) return "";
  return Object.entries(obj)
    .map(([key, value]) => (key === "moy" ? value : `${key}: ${value}`))
    .join("<br>");
}

function formatArrayToNewLines(arr) {
  if (!Array.isArray(arr)) return "";
  return arr.join("<br>");
}

function formatDateOnly(dateTimeString) {
  // Vérifie si la chaîne est valide
  if (!dateTimeString) return null;

  // Utilise split pour extraire uniquement la date
  const [date] = dateTimeString.split(" ");
  return date;
}

const validateData = async () => {
  isLoading.value = true;
  await IndicateursService.validateSuivi(idSelect.value)
    .then(() => {
      isLoading.value = false;
      getDatas();
      showModalValidate.value = false;
      toast.success("Suivi validée.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Pas la permission pour valider");
    });
};

// filter

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

const getCurrentQuarter = function () {
  const month = new Date().getMonth() + 1; // Les mois sont indexés à partir de 0
  return Math.ceil(month / 3); // Calcul du trimestre actuel
};

const openFilterModal = () => {
  console.log(filterPayload.annee);
  filterPayload.trimestre = `${getCurrentQuarter()}`;
  showModalFiltre.value = true;
};

const showModalFiltre = ref(false);

const filterPayload = reactive({
  trimestre: `${getCurrentQuarter()}`,
  annee: `${new Date().getFullYear()}`,
});

const isLoadingFilter = ref(false);

const annees = computed(() => {
  let anneeDebut = parseInt(debutProgramme.value.split("-")[0], 10);
  let anneeFin = parseInt(finProgramme.value.split("-")[0], 10);
  const annees = [];
  for (let annee = anneeDebut; annee <= anneeFin; annee++) {
    annees.push(annee);
  }
  return annees;
});

const resetFilter = function () {
  filterPayload.trimestre = `${getCurrentQuarter()}`;
  filterPayload.annee = `${new Date().getFullYear()}`;

  filterSuiviIndicateur();
};

const filterSuiviIndicateur = async () => {
  isLoadingFilter.value = true;

  filterPayload.annee = parseInt(filterPayload.annee);
  filterPayload.trimestre = parseInt(filterPayload.trimestre);

  console.log(filterPayload);

  await IndicateurSuivisService.filtre(filterPayload)
    .then((result) => {
      datas.value = result.data.data;
      console.log(datas.value);
      resetFilterModal();
    })
    .catch((e) => {
      console.log(e);
      isLoadingFilter.value = false;
      toast.error("Vérifier les informations et ressayer.");
    });
  initTabulator();
};

const resetFilterModal = () => {
  isLoadingFilter.value = false;
  showModalFiltre.value = false;
  filterPayload.trimestre = `${getCurrentQuarter()}`;
  filterPayload.annee = `${new Date().getFullYear()}`;
};

const getcurrentUser = async () => {
  await AuthService.getCurrentUser()
    .then((result) => {
      debutProgramme.value = result.data.data.programme.debut;
      finProgramme.value = result.data.data.programme.fin;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Utilisateur connecté .");
    });
};

const years = computed(() => {
  let anneeDebut = parseInt(`${debutProgramme.value.split("-")[0]}`);
  let anneeFin = parseInt(`${finProgramme.value.split("-")[0]}`);
  let annees = [];
  for (let annee = anneeDebut; annee <= anneeFin; annee++) {
    if (annee <= new Date().getFullYear()) {
      annees.push(annee);
    }
  }
  return annees;
});


//Pour le graphique : 
// Ref pour le graphique
const barChart = ref(null);
let chartInstance = null;

 // Méthode pour formater les données du graphique
/*const formatChartData = () => {
  if (!datas.value || datas.value.length === 0) return null;

  const isAgregated = datas.value[0]?.valeurCible?.indicateur?.agreger;

  if (isAgregated) {
    // Pour les indicateurs agrégés : afficher chaque clé séparément
    return formatAgregatedChartData();
  } else {
    // Pour les indicateurs non agrégés : comportement actuel
    return formatSimpleChartData();
  }
};

// Format des données pour indicateurs non agrégés (comportement actuel)
const formatSimpleChartData = () => {
  const labels = datas.value.map((item) => {
    const trimestre = item.trimestre || 'N/A';
    const annee = item.valeurCible?.annee || new Date(item.dateSuivie).getFullYear();
    return `T${trimestre} - ${annee}`;
  });

  const realisedValues = datas.value.map((item) => {
    const valeurRealise = item.valeurRealise;
    if (valeurRealise == null) return 0;
    if (typeof valeurRealise === 'number') return valeurRealise;
    if (typeof valeurRealise === 'object') {
      if (valeurRealise.moy !== undefined) return valeurRealise.moy;
      const values = Object.values(valeurRealise);
      return values.find(v => typeof v === 'number') || 0;
    }
    return 0;
  });

  const targetValues = datas.value.map((item) => {
    const valeurCible = item.valeurCible?.valeurCible;
    if (valeurCible == null) return 0;
    if (typeof valeurCible === 'number') return valeurCible;
    if (typeof valeurCible === 'object') {
      if (valeurCible.moy !== undefined) return valeurCible.moy;
      const values = Object.values(valeurCible);
      return values.find(v => typeof v === 'number') || 0;
    }
    return 0;
  });

  return {
    labels,
    datasets: [
      {
        label: "Valeur Réalisée",
        data: realisedValues,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        barThickness: 30,
        borderRadius: 4,
      },
      {
        label: "Valeur Cible",
        data: targetValues,
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
        barThickness: 30,
        borderRadius: 4,
      },
    ],
  };
};


// Format des données pour indicateurs agrégés
const formatAgregatedChartData = () => {
  const labels = datas.value.map((item) => {
    const trimestre = item.trimestre || 'N/A';
    const annee = item.valeurCible?.annee || new Date(item.dateSuivie).getFullYear();
    return `T${trimestre} - ${annee}`;
  });

  // Récupérer toutes les clés uniques depuis les données
  const allKeys = new Set();
  datas.value.forEach(item => {
    if (item.valeurCible?.valeurCible && typeof item.valeurCible.valeurCible === 'object') {
      Object.keys(item.valeurCible.valeurCible).forEach(key => allKeys.add(key));
    }
    if (item.valeurRealise && typeof item.valeurRealise === 'object') {
      Object.keys(item.valeurRealise).forEach(key => allKeys.add(key));
    }
  });

  const keys = Array.from(allKeys);
  
  // Couleurs pour les différentes clés
  const colorPalette = [
    { bg: 'rgba(75, 192, 192, 0.6)', border: 'rgba(75, 192, 192, 1)' },
    { bg: 'rgba(239, 68, 68, 0.6)', border: 'rgba(239, 68, 68, 1)' },
    { bg: 'rgba(153, 102, 255, 0.6)', border: 'rgba(153, 102, 255, 1)' },
    { bg: 'rgba(255, 159, 64, 0.6)', border: 'rgba(255, 159, 64, 1)' },
    { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgba(54, 162, 235, 1)' },
    { bg: 'rgba(255, 99, 132, 0.6)', border: 'rgba(255, 99, 132, 1)' },
  ];

  const datasets = [];

  // Ajouter les datasets pour les valeurs réalisées par clé
  keys.forEach((key, index) => {
    const color = colorPalette[index % colorPalette.length];
    const data = datas.value.map(item => {
      const valeurRealise = item.valeurRealise;
      if (valeurRealise && typeof valeurRealise === 'object' && valeurRealise[key] !== undefined) {
        return valeurRealise[key];
      }
      return 0;
    });

    datasets.push({
      label: `Réalisé - ${key}`,
      data: data,
      backgroundColor: color.bg,
      borderColor: color.border,
      borderWidth: 2,
      barThickness: 20,
      borderRadius: 4,
    });
  });

  // Ajouter les datasets pour les valeurs cibles par clé (en ligne)
  keys.forEach((key, index) => {
    const color = colorPalette[index % colorPalette.length];
    const data = datas.value.map(item => {
      const valeurCible = item.valeurCible?.valeurCible;
      if (valeurCible && typeof valeurCible === 'object' && valeurCible[key] !== undefined) {
        return valeurCible[key];
      }
      return 0;
    });

    datasets.push({
      label: `Cible - ${key}`,
      data: data,
      borderColor: color.border,
      borderWidth: 3,
      borderDash: [5, 5],
      fill: false,
      type: 'line',
      pointRadius: 4,
      pointHoverRadius: 6,
    });
  });

  return {
    labels,
    datasets,
  };
};
*/

// Méthode pour formater les données du graphique
/* const formatChartData = () => {
  if (!datas.value || datas.value.length === 0) return null;

  const labels = datas.value.map((item) => {
    const trimestre = item.trimestre || 'N/A';
    const annee = item.valeurCible?.annee || new Date(item.dateSuivie).getFullYear();
    return `T${trimestre} - ${annee}`;
  });

  console.log(datas.value);

  // Extraction des valeurs réalisées avec gestion des différents formats
  const realisedValues = datas.value.map((item) => {
    const valeurRealise = item.valeurRealise;

    // Si null ou undefined
    if (valeurRealise == null) return 0;

    // Si c'est déjà un nombre simple (valeur non agrégée)
    if (typeof valeurRealise === 'number') {
      return valeurRealise;
    }

    // Si c'est un objet
    if (typeof valeurRealise === 'object') {
      // Si c'est un objet avec une moyenne (valeur agrégée)
      if (valeurRealise.moy !== undefined) {
        return valeurRealise.moy;
      }
      // Si c'est un objet avec des clés dynamiques, prendre la première valeur numérique
      const values = Object.values(valeurRealise);
      return values.find(v => typeof v === 'number') || 0;
    }

    return 0;
  });

  // Extraction des valeurs cibles avec gestion des différents formats
  const targetValues = datas.value.map((item) => {
    const valeurCible = item.valeurCible?.valeurCible;

    // Si null ou undefined
    if (valeurCible == null) return 0;

    // Si c'est déjà un nombre simple (valeur non agrégée)
    if (typeof valeurCible === 'number') {
      return valeurCible;
    }

    // Si c'est un objet
    if (typeof valeurCible === 'object') {
      // Si c'est un objet avec une moyenne (valeur agrégée)
      if (valeurCible.moy !== undefined) {
        return valeurCible.moy;
      }
      // Si c'est un objet avec des clés dynamiques, prendre la première valeur numérique
      const values = Object.values(valeurCible);
      return values.find(v => typeof v === 'number') || 0;
    }

    return 0;
  });

  return {
    labels,
    datasets: [
      {
        label: "Valeur Réalisée",
        data: realisedValues,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        barThickness: 30,
        borderRadius: 4,
      },
      {
        label: "Valeur Cible",
        data: targetValues,
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
        barThickness: 30,
        borderRadius: 4,
      },
    ],
  };
};
*/

// Méthode pour formater les données du graphique
const formatChartData = () => {
  if (!datas.value || datas.value.length === 0) return null;

  // Déterminer si l'indicateur est agrégé en regardant le premier élément
  const isAgregated = datas.value[0]?.indicateur?.agreger;
  const valueKeys = datas.value[0]?.indicateur?.value_keys || [];

  if (isAgregated && valueKeys.length > 0) {
    // Pour les indicateurs agrégés : afficher chaque clé séparément
    return formatAgregatedChartData();
  } else {
    // Pour les indicateurs non agrégés : comportement actuel
    return formatSimpleChartData();
  }
};

// Format des données pour indicateurs non agrégés
const formatSimpleChartData = () => {
  // Récupérer les informations de l'indicateur depuis le premier élément
  const indicateurInfo = datas.value[0]?.indicateur;
  const nomIndicateur = indicateurInfo?.nom || "Indicateur";
  const uniteMesure = indicateurInfo?.unitee_mesure?.nom || "";

  const labels = datas.value.map((item) => {
    const trimestre = item.trimestre || 'N/A';
    const annee = item.valeurCible?.annee || new Date(item.dateSuivie).getFullYear();
    return `T${trimestre} - ${annee}`;
  });

  // Extraction des valeurs réalisées pour indicateurs non agrégés
  const realisedValues = datas.value.map((item) => {
    const valeurRealise = item.valeurRealise;
    
    // Si null ou undefined
    if (valeurRealise == null) return 0;
    
    // Si c'est déjà un nombre simple
    if (typeof valeurRealise === 'number') return valeurRealise;
    
    // Si c'est un objet (comme { "H": 74 })
    if (typeof valeurRealise === 'object') {
      // Prendre la première valeur numérique de l'objet
      const values = Object.values(valeurRealise);
      const numericValue = values.find(v => {
        const num = parseFloat(v);
        return !isNaN(num);
      });
      return numericValue ? parseFloat(numericValue) : 0;
    }
    
    // Si c'est une chaîne, essayer de la convertir en nombre
    const num = parseFloat(valeurRealise);
    return isNaN(num) ? 0 : num;
  });

  // Extraction des valeurs cibles pour indicateurs non agrégés
  const targetValues = datas.value.map((item) => {
    const valeurCible = item.valeurCible?.valeurCible;
    
    // Si null ou undefined
    if (valeurCible == null) return 0;
    
    // Si c'est déjà un nombre simple
    if (typeof valeurCible === 'number') return valeurCible;
    
    // Si c'est un objet (comme { "H": 70 })
    if (typeof valeurCible === 'object') {
      // Prendre la première valeur numérique de l'objet
      const values = Object.values(valeurCible);
      const numericValue = values.find(v => {
        const num = parseFloat(v);
        return !isNaN(num);
      });
      return numericValue ? parseFloat(numericValue) : 0;
    }
    
    // Si c'est une chaîne, essayer de la convertir en nombre
    const num = parseFloat(valeurCible);
    return isNaN(num) ? 0 : num;
  });

  return {
    labels,
    datasets: [
      {
        label: "Valeur Réalisée",
        data: realisedValues,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        barThickness: 30,
        borderRadius: 4,
      },
      {
        label: "Valeur Cible",
        data: targetValues,
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
        barThickness: 30,
        borderRadius: 4,
      },
    ],
    // Informations supplémentaires pour le titre ou la légende
    indicateurInfo: {
      nom: nomIndicateur,
      uniteMesure: uniteMesure,
      estAgrege: false
    }
  };
};

// Format des données pour indicateurs agrégés
const formatAgregatedChartData = () => {
  // Récupérer les informations de l'indicateur depuis le premier élément
  const indicateurInfo = datas.value[0]?.indicateur;
  const nomIndicateur = indicateurInfo?.nom || "Indicateur";
  const uniteMesure = indicateurInfo?.unitee_mesure?.nom || "";
  const valueKeys = indicateurInfo?.value_keys || [];

  const labels = datas.value.map((item) => {
    const trimestre = item.trimestre || 'N/A';
    const annee = item.valeurCible?.annee || new Date(item.dateSuivie).getFullYear();
    return `${item.indicateur.nom} : `+ `T${trimestre} - ${annee}`;
  });

  // Récupérer les clés depuis les value_keys de l'indicateur
  //const valueKeys = datas.value[0]?.indicateur?.value_keys || [];
  
  // Si pas de value_keys, essayer de les déduire des données
  const allKeys = new Set();
  if (valueKeys.length === 0) {
    datas.value.forEach(item => {
      if (item.valeurRealise && typeof item.valeurRealise === 'object') {
        Object.keys(item.valeurRealise).forEach(key => allKeys.add(key));
      }
      if (item.valeurCible?.valeurCible && typeof item.valeurCible.valeurCible === 'object') {
        Object.keys(item.valeurCible.valeurCible).forEach(key => allKeys.add(key));
      }
    });
  } else {
    valueKeys.forEach(keyObj => allKeys.add(keyObj.key));
  }

  const keys = Array.from(allKeys);
  
  // Palette de couleurs étendue
  const colorPalette = [
    { bg: 'rgba(75, 192, 192, 0.6)', border: 'rgba(75, 192, 192, 1)' },
    { bg: 'rgba(239, 68, 68, 0.6)', border: 'rgba(239, 68, 68, 1)' },
    { bg: 'rgba(153, 102, 255, 0.6)', border: 'rgba(153, 102, 255, 1)' },
    { bg: 'rgba(255, 159, 64, 0.6)', border: 'rgba(255, 159, 64, 1)' },
    { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgba(54, 162, 235, 1)' },
    { bg: 'rgba(255, 99, 132, 0.6)', border: 'rgba(255, 99, 132, 1)' },
    { bg: 'rgba(201, 203, 207, 0.6)', border: 'rgba(201, 203, 207, 1)' },
    { bg: 'rgba(255, 205, 86, 0.6)', border: 'rgba(255, 205, 86, 1)' },
  ];

  const datasets = [];

  // Ajouter les datasets pour les valeurs réalisées par clé (barres)
  keys.forEach((key, index) => {
    const color = colorPalette[index % colorPalette.length];
    
    // Trouver le libellé correspondant dans value_keys
    const keyInfo = valueKeys.find(k => k.key === key);
    const displayName = keyInfo?.libelle || key;
    
    const data = datas.value.map(item => {
      const valeurRealise = item.valeurRealise;
      if (valeurRealise && typeof valeurRealise === 'object' && valeurRealise[key] !== undefined) {
        const value = valeurRealise[key];
        // Convertir en nombre si c'est une chaîne
        return typeof value === 'string' ? parseFloat(value) || 0 : value;
      }
      return 0;
    });

    datasets.push({
      label: `Réalisé - ${displayName}`,
      data: data,
      backgroundColor: color.bg,
      borderColor: color.border,
      borderWidth: 2,
      barThickness: 20,
      borderRadius: 4,
    });
  });

  // Ajouter les datasets pour les valeurs cibles par clé (lignes pointillées)
  keys.forEach((key, index) => {
    const color = colorPalette[index % colorPalette.length];
    
    // Trouver le libellé correspondant dans value_keys
    const keyInfo = valueKeys.find(k => k.key === key);
    const displayName = keyInfo?.libelle || key;
    
    const data = datas.value.map(item => {
      const valeurCible = item.valeurCible?.valeurCible;
      if (valeurCible && typeof valeurCible === 'object' && valeurCible[key] !== undefined) {
        const value = valeurCible[key];
        // Convertir en nombre si c'est une chaîne
        return typeof value === 'string' ? parseFloat(value) || 0 : value;
      }
      return 0;
    });

    datasets.push({
      label: `Cible - ${displayName}`,
      data: data,
      borderColor: color.border,
      borderWidth: 3,
      borderDash: [5, 5],
      fill: false,
      type: 'line',
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: color.border,
    });
  });

  return {
    labels,
    datasets,
    // Informations supplémentaires pour le titre ou la légende
    indicateurInfo: {
      nom: nomIndicateur,
      uniteMesure: uniteMesure,
      estAgrege: true,
      nombreCles: keys.length
    }
  };
};

// Méthode pour rendre le graphique
const renderChart = () => {
  if (!barChart.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  const chartData = formatChartData();
  if (!chartData) return;

  // Utiliser les informations de l'indicateur pour le titre
  const indicateurInfo = chartData.indicateurInfo;
  const titreGraphique = indicateurInfo?.nom || "Suivi des valeurs";
  const uniteMesure = indicateurInfo?.uniteMesure ? `(${indicateurInfo.uniteMesure})` : "";

  chartInstance = new Chart(barChart.value, {
    type: "bar",
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: titreGraphique,
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: 20
        },
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 15,
            boxWidth: 12,
            font: {
              size: 11
            }
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat().format(context.parsed.y);
                if (uniteMesure && !label.includes('(%)')) {
                  label += ` ${uniteMesure}`;
                }
              }
              return label;
            }
          }
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Période (Trimestre - Année)",
            font: {
              size: 12,
              weight: 'bold',
            },
          },
          grid: {
            display: false,
          },
          ticks: {
            maxRotation: 45,
            minRotation: 0,
          },
        },
        y: {
          title: {
            display: true,
            text: `Valeurs ${uniteMesure}`,
            font: {
              size: 12,
              weight: 'bold',
            },
          },
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
    },
  });
};

/*
// Méthode pour rendre le graphique
const renderChart = () => {
  if (!barChart.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  const chartData = formatChartData();
  if (!chartData) return;

  chartInstance = new Chart(barChart.value, {
    type: "bar",
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Période (Trimestre - Année)",
            font: {
              size: 12,
              weight: 'bold',
            },
          },
          grid: {
            display: false,
          },
          ticks: {
            maxRotation: 45,
            minRotation: 0,
          },
        },
        y: {
          title: {
            display: true,
            text: "Valeurs",
            font: {
              size: 12,
              weight: 'bold',
            },
          },
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
    },
  });
};*/

// Watcher pour re-rendre le graphique quand les données changent
watch(
  () => datas.value,
  () => {
    if (datas.value.length > 0) {
      setTimeout(() => {
        renderChart();
      }, 100);
    }
  },
  { deep: true }
);

/** Manage suivi */

const showModalSuivi = ref(false);
const deleteSuiviModalPreview = ref(false);

const valueKeysIndicateurSuivi = ref([]);
const isAgregerCurrentIndicateur = ref(false);

const valeurCible = ref([]);
const valeurRealise = ref([]);

// Computed pour déterminer si les champs doivent être désactivés
const shouldDisableNonAgregerFields = computed(() => {
  if (isAgregerCurrentIndicateur.value) return false;

  const valeur = payloadSuivi.valeurCible;
  // Vérifier que la valeur existe et n'est pas vide (0 est accepté comme valeur valide)
  return valeur !== "" && valeur !== null && valeur !== undefined && String(valeur).trim() !== "";
});

// Computed pour désactiver les champs de valeurs cibles agrégées
const shouldDisableAgregerFields = computed(() => {
  return isAgregerCurrentIndicateur.value &&
         valeurCible.value.length > 0 &&
         valeurCible.value.some(item => item.value !== "" && item.value !== null && item.value !== undefined);
});

const optionsSuivi = [
  { label: "Par date", id: "date" },
  { label: "Par trimestre", id: "trimestre" },
];
const suiviOption = ref(optionsSuivi[0].id);

const payloadSuivi = reactive({
  annee: `${new Date().getFullYear()}`,
  trimestre: `${getCurrentQuarter()}`,
  valeurCible: "",
  valeurRealise: "",
  commentaire: "",
  dateSuivie: "",
  indicateurId: "",
  sources_de_donnee: "",
});

const handleEditSuivi = (data) => {
  console.log(data);
  isCreate.value = false;
  idSelect.value = data.id;

  // Clear previous errors
  formErrors.value = {};

  const date = new Date(data.dateSuivie);
  payloadSuivi.dateSuivie = date.toISOString().slice(0, 10);

  payloadSuivi.sources_de_donnee = data.sources_de_donnee;
  payloadSuivi.commentaire = data.commentaire;
  payloadSuivi.annee = `${new Date(data.dateSuivie).getFullYear()}`;
  payloadSuivi.trimestre = `${data.trimestre}`;

  // Determine if indicator is aggregated
  isAgregerCurrentIndicateur.value = data.valeurCible.indicateur.agreger;

  if (isAgregerCurrentIndicateur.value) {
    // For aggregated indicators, use the structure from value_keys
    valeurCible.value = data.valeurCible.valeurCible;
    valeurRealise.value = data.valeurRealise;
  } else {
    // For non-aggregated indicators, get single values
    if (typeof data.valeurCible.valeurCible === 'object') {
      payloadSuivi.valeurCible = Object.values(data.valeurCible.valeurCible)[0];
    } else {
      payloadSuivi.valeurCible = data.valeurCible.valeurCible;
    }

    if (typeof data.valeurRealise === 'object') {
      payloadSuivi.valeurRealise = Object.values(data.valeurRealise)[0];
    } else {
      payloadSuivi.valeurRealise = data.valeurRealise;
    }
  }

  payloadSuivi.indicateurId = data.valeurCible.indicateur.id;
  valueKeysIndicateurSuivi.value = data.valeurCible.indicateur.value_keys;

  if (isAgregerCurrentIndicateur.value) {
    resetValues();
  }

  showModalSuivi.value = true;
  console.log(payloadSuivi);
};

const handleSuivi = (data) => {
  console.log(data);

  // Récupérer les valeurs cibles
  valeurCible.value = data.valeurCible.valeurCible;

  isAgregerCurrentIndicateur.value = data.valeurCible.indicateur.agreger;

  // Si l'indicateur n'est pas agrégé, pré-remplir la valeur cible simple
  if (isAgregerCurrentIndicateur.value == false) {
    // Vérifier que valeurCible.value existe et n'est pas null/undefined
    if (valeurCible.value) {
      Object.keys(valeurCible.value).forEach((key) => {
        payloadSuivi.valeurCible = valeurCible.value[key];
      });
    }
  }

  payloadSuivi.indicateurId = data.valeurCible.indicateur.id;
  valueKeysIndicateurSuivi.value = data.valeurCible.indicateur.value_keys;
  resetValues();
  showModalSuivi.value = true;
};

const updateValueCible = (keyId, newValue) => {
  const entry = valeurCible.value.find((item) => item.keyId === keyId);
  if (entry) {
    entry.value = newValue;
  }
};

const updateValueRealiser = (keyId, newValue) => {
  const entry = valeurRealise.value.find((item) => item.keyId === keyId);
  if (entry) {
    entry.value = newValue;
  }
};

const resetValues = () => {
  valeurCible.value = valueKeysIndicateurSuivi.value.map((item) => ({
    keyId: item.id,
    value: valeurCible.value[item.key] ?? "",
  }));
  valeurRealise.value = valueKeysIndicateurSuivi.value.map((item) => ({
    keyId: item.id,
    value: valeurRealise.value[item.key] ?? "",
  }));
};

const resetFormSuivi = () => {
  if (isAgregerCurrentIndicateur.value) {
    resetValues();
  }
  Object.keys(payloadSuivi).forEach((key) => {
    payloadSuivi[key] = "";
  });

  payloadSuivi["annee"] = `${new Date().getFullYear()}`;
  payloadSuivi["trimestre"] = `${getCurrentQuarter()}`;
  payloadSuivi["valeurCible"] = "";
  payloadSuivi["valeurRealise"] = "";
  payloadSuivi["commentaire"] = "";
  payloadSuivi["dateSuivie"] = "";
  payloadSuivi["indicateurId"] = "";
  payloadSuivi["sources_de_donnee"] = "";

  // Clear form errors
  formErrors.value = {};

  showModalSuivi.value = false;
  isCreate.value = true;
};
// Submit data (create or update)
const submitData = async () => {
  console.log(isCreate.value);
  isCreate.value ? submitSuivi() : submitUpdateSuivi();
};

const submitSuivi = async () => {
  payloadSuivi.annee = Number(payloadSuivi.annee);
  payloadSuivi.trimestre = Number(payloadSuivi.trimestre);
  if (optionsSuivi[0].id == suiviOption.value) {
    delete payloadSuivi.trimestre;
  } else {
    delete payloadSuivi.dateSuivie;
  }
  if (isAgregerCurrentIndicateur.value) {
    payloadSuivi.valeurCible = valeurCible.value;
    payloadSuivi.valeurRealise = valeurRealise.value;
  }

  console.log(payloadSuivi);

  isLoading.value = true;
  const action = IndicateursService.createSuivi(payloadSuivi);
  try {
    await action;
    toast.success(`Suivi Ajouté avec succès.`);
    resetFormSuivi();
    getDatas();
    showModalSuivi.value = false;
    isLoading.value = false;
    //emit("refreshData", data);
  } catch (e) {
    isLoading.value = false;
    console.log(e);

    // Capture validation errors if available
    if (e.response && e.response.data && e.response.data.errors) {
      formErrors.value = e.response.data.errors;
    } else {
      formErrors.value = {};
    }

    toast.error(getAllErrorMessages(e));
  }
};

const submitUpdateSuivi = async () => {
  payloadSuivi.annee = Number(payloadSuivi.annee);
  payloadSuivi.trimestre = Number(payloadSuivi.trimestre);
  if (optionsSuivi[0].id == suiviOption.value) {
    delete payloadSuivi.trimestre;
  } else {
    delete payloadSuivi.dateSuivie;
  }

  if (isAgregerCurrentIndicateur.value) {
    payloadSuivi.valeurCible = valeurCible.value;
    payloadSuivi.valeurRealise = valeurRealise.value;
  }

  console.log(payloadSuivi);

  isLoading.value = true;
  const action = IndicateurSuivisService.update(idSelect.value, payloadSuivi);
  try {
    await action;
    toast.success(`Suivi Modifie avec succès.`);
    resetFormSuivi();
    getDatas();
    showModalSuivi.value = false;
    isLoading.value = false;
  } catch (e) {
    console.log(e);
    isLoading.value = false;

    // Capture validation errors if available
    if (e.response && e.response.data && e.response.data.errors) {
      formErrors.value = e.response.data.errors;
    } else {
      formErrors.value = {};
    }

    toast.error(getAllErrorMessages(e));
  }
};

// Handle delete action
const handleDelete = (data) => {
  idSelect.value = data.id;
  nameSelect.value = data.valeurCible.indicateur.nom + "\nValeur realise : " + formatObject(data.valeurRealise);
  deleteSuiviModalPreview.value = true;
};

const cancelDeleteSuivi = () => {
  idSelect.value = "";
  deleteSuiviModalPreview.value = false;
};

// Delete data
const deleteSuivi = async () => {
  try {
    isLoading.value = true;
    await IndicateurSuivisService.destroy(idSelect.value);
    toast.success("Suivi Indicateur supprimé avec succès.");
    getDatas();
    deleteSuiviModalPreview.value = false;
  } catch (e) {
    console.error(e);
    toast.error(getAllErrorMessages(e));
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => {
  formErrors.value = {};
  showModalSuivi.value = false;
};
const closeDeleteSuiviModal = () => (deleteSuiviModalPreview.value = false);

onMounted(() => {
  getcurrentUser();
  getDatas();
});
</script>

<template>
  <div class="flex justify-between items-center mt-10">
    <h2 class="_mt-10 text-lg font-medium intro-y">Détail du suivi</h2>
    <button class="btn btn-primary" @click="router.go(-1)">Retour <CornerDownLeftIcon class="w-4 h-4 ml-2" /></button>
  </div>

  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap"></div>
  </div>
  <div v-if="datas.length > 0" class="grid grid-cols-12 gap-5 mt-5">
    <div class="col-span-12 p-5 cursor-pointer sm:col-span-4 2xl:col-span-4 box bg-primary zoom-in">
      <div class="text-base font-medium text-white">Indicateur</div>
      <div class="text-white text-opacity-80">{{ datas[0]?.valeurCible.indicateur?.nom }}</div>
    </div>
    <div class="col-span-12 p-5 cursor-pointer sm:col-span-4 2xl:col-span-4 bg-primary box zoom-in">
      <div class="text-base font-medium text-white">Catégorie</div>
      <div class="text-white dark:text-slate-500 text-opacity-80">{{ datas[0]?.valeurCible.indicateur?.categorie.type ?? datas[0]?.valeurCible.indicateur?.type ?? datas[0]?.valeurCible.indicateur?.categorie?.nom }}</div>
    </div>
    <div class="col-span-12 p-5 cursor-pointer bg-primary sm:col-span-4 2xl:col-span-4 box zoom-in">
      <div class="text-base font-medium text-white">Unité de mesure</div>
      <div class="text-white text-opacity-80">{{ datas[0]?.valeurCible.indicateur?.unitee_mesure?.nom }}</div>
    </div>
   
  </div>

  <div class="p-5 mt-5 intro-y box">
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
        <div class="flex w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
          <div class="relative w-56 text-slate-500">
            <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
            <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
          </div>
        </div>
        <div class="flex">
          <button class="mr-2 shadow-md btn btn-primary" @click="openFilterModal"><FilterIcon class="w-4 h-4 mr-3" />Filtre</button>

          <button class="btn btn-primary" title="Réinitialiser le filtre" @click="resetFilter()">
            <RefreshCwIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto scrollbar-hidden" v-if="!isLoadingData">
      <div id="tabulator" class="mt-5 table-report table-report--tabulator"></div>
    </div>
    <LoaderSnipper v-if="isLoadingData" />
  </div>

  <div v-if="!isLoadingData && datas.length > 0" class="w-full mt-5 box">
    <div class="p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-800">Suivi des valeurs cibles et réalisées</h3>
        <div class="flex items-center gap-4 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-red-400 rounded"></div>
            <span>Valeur Cible</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-teal-400 rounded"></div>
            <span>Valeur Réalisée</span>
          </div>
        </div>
      </div>
      
      <!-- Conteneur du graphique avec hauteur fixe -->
      <div class="relative" style="height: 500px;">
        <canvas 
          ref="barChart" 
          class="w-full h-full"
          style="max-height: 500px !important;"
        ></canvas>
      </div>
    </div>
  </div>

  <!-- <div v-if="!isLoadingData" class="w-full mt-5 box">
    <p class="p-2 text-lg font-medium">Suivi des valeurs cibles et des valeurs réalisées</p>
    <ChartDetailSuivi :data="datas" />
  </div> -->

  <Modal :show="showModalValidate" @hidden="showModalValidate = false">
    <ModalBody class="p-2">
      <div class="p-5 text-center">
        <AlertCircleIcon class="w-16 h-16 mx-auto mt-3 text-primary" />
        <div class="mt-2 text-lg text-slate-500">Valider le suivi?</div>
      </div>

      <div class="flex gap-2">
        <button type="button" @click="showModalValidate = false" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
        <VButton :loading="isLoading" @click="validateData" label="Valider" />
      </div>
    </ModalBody>
  </Modal>

  <!-- Modal Filtre des suivis -->
  <Modal backdrop="static" :show="showModalFiltre" @hidden="showModalFiltre = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Filtrer les suivis</h2>
    </ModalHeader>
    <form @submit.prevent="filterSuiviIndicateur">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <div class="">
            <label class="form-label">Année</label>
            <TomSelect v-model="filterPayload.annee" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option v-for="(annee, index) in annees" :key="index" :value="annee">{{ annee }}</option>
            </TomSelect>
          </div>
          <div class="">
            <label class="form-label">Trimestre</label>
            <TomSelect v-model="filterPayload.trimestre" :options="{ placeholder: 'Selectionez le trimestre' }" class="w-full">
              <option v-for="(i, index2) in 4" :key="index2" :value="i">Trimestre {{ i }}</option>
            </TomSelect>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetFilterModal" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoadingFilter" label="Filtrer" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- End Modal -->

  <!-- SUIVIE  -->
  <Modal size="modal-lg" backdrop="static" :show="showModalSuivi" @hidden="closeModal">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} un suivi</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-5">
          <div class="flex-1">
            <label class="form-label">Année de suivi</label>

            <TomSelect v-model="payloadSuivi.annee" name="annee_suivi" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option v-for="annee in years" :key="annee" :value="annee">{{ annee }}</option>
            </TomSelect>
            <div v-if="formErrors.annee" class="mt-1 text-sm text-red-600">
              <p v-for="error in formErrors.annee" :key="error">{{ error }}</p>
            </div>
          </div>
          <!-- <InputForm label="Année de suivi" class="flex-1" v-model="payloadSuivi.annee" type="number" /> -->
          <div v-if="!isAgregerCurrentIndicateur" class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex-1">
              <InputForm label="Valeur cible" v-model="payloadSuivi.valeurCible" type="number" :disabled="shouldDisableNonAgregerFields" />
              <div v-if="formErrors.valeurCible" class="mt-1 text-sm text-red-600">
                <p v-for="error in formErrors.valeurCible" :key="error">{{ error }}</p>
              </div>
            </div>
            <div class="flex-1">
              <InputForm label="Valeur réalisée" v-model="payloadSuivi.valeurRealise" type="number" />
              <div v-if="formErrors.valeurRealise" class="mt-1 text-sm text-red-600">
                <p v-for="error in formErrors.valeurRealise" :key="error">{{ error }}</p>
              </div>
            </div>
          </div>

          <div v-if="valueKeysIndicateurSuivi.length > 0 && isAgregerCurrentIndicateur" class="">
            <label class="form-label">Valeur Cible</label>
            <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
              <div v-for="(base, index) in valueKeysIndicateurSuivi" :key="index" class="input-group">
                <div class="flex items-center justify-center text-sm truncate input-group-text">{{ base.libelle }}</div>
                <input type="number" class="form-control" v-model="valeurCible.find((item) => item.keyId === base.id).value" @input="updateValueCible(base.id, $event.target.value)" placeholder="valeur cible" aria-label="valeur" aria-describedby="input-group-valeur" :disabled="shouldDisableAgregerFields" />
              </div>
            </div>
          </div>
          <div v-if="valueKeysIndicateurSuivi.length > 0 && isAgregerCurrentIndicateur" class="">
            <label class="form-label">Valeur Réalisée</label>
            <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
              <div v-for="(base, index) in valueKeysIndicateurSuivi" :key="index" class="input-group">
                <div class="flex items-center justify-center text-sm truncate input-group-text">{{ base.libelle }}</div>
                <input type="number" class="form-control" v-model="valeurRealise.find((item) => item.keyId === base.id).value" @input="updateValueRealiser(base.id, $event.target.value)" placeholder="valeur réalisée" aria-label="valeur" aria-describedby="input-group-valeur" />
              </div>
            </div>
          </div>

          <div class="flex-1">
            <label>Suivi par date ou trimestre?</label>
            <div class="flex flex-col gap-3 mt-2 sm:flex-row">
              <div v-for="(item, index) in optionsSuivi" :key="index" class="mr-2 form-check">
                <input :id="item.id" class="form-check-input" type="radio" name="option_suivi" v-model="suiviOption" :value="item.id" />
                <label class="form-check-label" :for="item.id">{{ item.label }}</label>
              </div>
            </div>
          </div>
          <div v-if="suiviOption == 'trimestre'" class="flex-1">
            <label class="form-label">Trimestre</label>
            <TomSelect v-model="payloadSuivi.trimestre" name="trimestre_suivi" :options="{ placeholder: 'Selectionez un trimestre' }" class="w-full">
              <option value=""></option>
              <option v-for="trimestre in 4" :key="trimestre" :value="trimestre">Trimestre {{ trimestre }}</option>
            </TomSelect>
            <div v-if="formErrors.trimestre" class="mt-1 text-sm text-red-600">
              <p v-for="error in formErrors.trimestre" :key="error">{{ error }}</p>
            </div>
          </div>

          <div v-else class="flex-1">
            <InputForm label="Date de suivi" v-model="payloadSuivi.dateSuivie" type="date" />
            <div v-if="formErrors.dateSuivie" class="mt-1 text-sm text-red-600">
              <p v-for="error in formErrors.dateSuivie" :key="error">{{ error }}</p>
            </div>
          </div>
          <div class="flex-1">
            <label class="form-label">Source de données</label>
            <TomSelect v-model="payloadSuivi.sources_de_donnee" name="source" :options="{ placeholder: 'Selectionez une source' }" class="w-full">
              <option value=""></option>
              <option v-for="(source, index) in sourcesDonnees" :key="index" :value="source">{{ source }}</option>
            </TomSelect>
            <div v-if="formErrors.sources_de_donnee" class="mt-1 text-sm text-red-600">
              <p v-for="error in formErrors.sources_de_donnee" :key="error">{{ error }}</p>
            </div>
          </div>
          <div class="flex-1">
            <label class="form-label" for="description">Commentaire</label>
            <div class="">
              <textarea name="description" class="form-control" id="description" v-model="payloadSuivi.commentaire" cols="30" rows="2"></textarea>
            </div>
            <div v-if="formErrors.commentaire" class="mt-1 text-sm text-red-600">
              <p v-for="error in formErrors.commentaire" :key="error">{{ error }}</p>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetFormSuivi" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" :label="isCreate ? 'Enrégistrer' : 'Modifier'" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <!-- Modal for deleting -->
  <Modal :show="deleteSuiviModalPreview" @hidden="closeDeleteSuiviModal">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-lg">{{ nameSelect }}</div>
        <div class="mt-2 text-slate-500">Supprimer le suivi?</div>
      </div>
      <div class="flex justify-center gap-3 py-4">
        <button type="button" @click="cancelDeleteSuivi" class="btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteSuivi" />
      </div>
    </ModalBody>
  </Modal>
</template>
