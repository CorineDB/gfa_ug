<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import Tabulator from "tabulator-tables";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import EvaluationService from "@/services/modules/enquetes_de_gouvernance/evaluation.gouvernance.service";
import ResultatSyntheseService from "@/services/modules/enquetes_de_gouvernance/synthese.service";

/*import EnqueteDeColleteService from "@/services/modules/enqueteDeCollecte.service";
import FormulaireFactuel from "@/services/modules/formFactuel.service";*/
import FormulaireFactuel from "@/services/modules/enquetes_de_gouvernance/formFactuel.service";
import FormulaireDePerception from "@/services/modules/enquetes_de_gouvernance/formPerception.service";

import { useRouter } from "vue-router";
import OngService from "@/services/modules/ong.service";
import { getAllErrorMessages } from "@/utils/gestion-error";
import ChartProgressionByTime from "../../../components/news/ChartProgressionByTime.vue";
import ProgressBar from "../../../components/news/ProgressBar.vue";
import ChartScroreByPrincipe from "../../../components/news/ChartScroreByPrincipe.vue";
import { getFieldErrors } from "../../../utils/helpers";
//import SyntheseService from "../../../services/modules/synthese.service";
import AddObjectifEvaluation from "../../../components/news/AddObjectifEvaluation.vue";
import verifyPermission from "../../../utils/verifyPermission";
import { useYearsStore } from "@/stores/years";
import AuthService from "@/services/modules/auth.service";

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
const yearsStore = useYearsStore();

const router = useRouter();

const idFormFactuel = ref("");
const idFormPerception = ref("");
const payload = reactive({
  intitule: "",
  description: "",
  // objectif_attendu: 0,
  annee_exercice: new Date().getFullYear(),
  debut: "",
  fin: "",
  //formulaires_de_gouvernance: [],
  formulaires_de_gouvernance: {},
  organisations: [],
});

const tabulator = ref();
const idSelect = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isLoadingDataScore = ref(false);
const isCreate = ref(true);
const datas = ref([]);
const datasScore = ref([]);
const organisations = ref([]);
const ongsProgramme = ref([]);
const formulairesFactuel = ref([]);
const formulairesPerception = ref([]);
const currentScore = ref({});
const currentOrganisationScore = ref("");
const ongSelectedScore = ref("");
const yearSelectedOng = ref("");
const search = ref("");
const errors = ref({});
const evaluationSelected = ref({});
const showModalObjectif = ref(false);

const createData = async () => {

  let forms = [];

  if( idFormFactuel.value !== null && idFormFactuel.value !== undefined && idFormFactuel.value !== ""){
    //forms = [...forms, idFormFactuel.value]
    forms["factuel"] =  idFormFactuel.value;
    payload.formulaires_de_gouvernance["factuel"] = forms["factuel"];
  }

  if( idFormPerception.value !== null && idFormPerception.value !== undefined && idFormPerception.value !== ""){
    forms["perception"] =  idFormPerception.value;
    payload.formulaires_de_gouvernance["perception"] = forms["perception"];
  }

  //payload.formulaires_de_gouvernance = forms;

  
  isLoading.value = true;
  
  await EvaluationService.create(payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Évaluation créer.");
    })
    .catch((e) => {
      isLoading.value = false;
      if (e.response && e.response.status === 422) {
        errors.value = e.response.data.errors;
      } else {
        toast.error(getAllErrorMessages(e));
      }
    });
};

const lien = ref("https://exemple.com");
const copié = ref(false);

const copierLien = async (lien) => {
  try {
    await navigator.clipboard.writeText(lien);
    copié.value = true;
    setTimeout(() => {
      copié.value = false;
    }, 2000);
  } catch (err) {
  }
};

const getDatas = async () => {
  isLoadingData.value = true;
  await EvaluationService.get()
    .then((result) => {
      datas.value = result.data.data;
      isLoadingData.value = false;
    })
    .catch((e) => {
      isLoadingData.value = false;
      toast.error(getAllErrorMessages(e));
    });
  // initTabulator();
};

const getEvolutionByScore = async (id) => {
  isLoadingDataScore.value = true;
  await ResultatSyntheseService.getEvolutionByScore(id)
    .then((result) => {
      datasScore.value = result.data.data;
      currentScore.value = datasScore.value[0]?.scores;
      isLoadingDataScore.value = false;
    })
    .catch((e) => {
      isLoadingDataScore.value = false;
      e.response?.data?.message ? toast.error(e.response?.data?.message) : toast.error("Une erreur est survenue: Score.");
    });
};

const getFormsFactuel = async () => {
  await FormulaireFactuel.get()
    .then((result) => {
      formulairesFactuel.value = result.data.data;
    })
    .catch((e) => {
      toast.error("Une erreur est survenue: Liste des formulaires factuel.");
    });
};
const getFormsPerception = async () => {
  await FormulaireDePerception.get()
    .then((result) => {
      formulairesPerception.value = result.data.data;
    })
    .catch((e) => {
      toast.error("Une erreur est survenue: Liste des formulaires de perception.");
    });
};
const getOrganisations = async () => {
  await OngService.get()
    .then((result) => {
      organisations.value = result.data.data;
    })
    .catch((e) => {
      toast.error("Une erreur est survenue: Liste des organisations.");
    });
};
const getOrganisationsProgramme = async () => {
  await OngService.programmeEvaluationsOrganisations()
  //await OngService.programmeOng()
    .then((result) => {
      ongsProgramme.value = result.data.data;
      ongsProgramme.value = ongsProgramme.value.filter(ong => ong.type !== "osc_fosir" && ong.tyype !== "acteurs")
    })
    .catch((e) => {
      toast.error(getAllErrorMessages(e));
    });
};

const updateData = async () => {
  

  if( idFormFactuel.value !== null && idFormFactuel.value !== undefined && idFormFactuel.value !== ""){
    payload.formulaires_de_gouvernance["factuel"] = idFormFactuel.value;
  }

  if( idFormPerception.value !== null && idFormPerception.value !== undefined && idFormPerception.value !== ""){
    payload.formulaires_de_gouvernance["perception"] = idFormPerception.value;
  }

  isLoading.value = true;
  //payload.formulaires_de_gouvernance = [idFormFactuel.value, idFormPerception.value];
  await EvaluationService.update(idSelect.value, payload)
    .then(() => {
      getDatas();
      resetForm();
      toast.success("Évaluation modifiée.");
    })
    .catch((e) => {
      if (e.response && e.response.status === 422) {
        errors.value = e.response.data.errors;
      } else {
        toast.error(getAllErrorMessages(e));
      }
    })
    .finally(() => {
      isLoading.value = false;
    });
};
const submitData = () => (isCreate.value ? createData() : updateData());
const deleteData = async () => {
  isLoading.value = true;
  await EvaluationService.destroy(idSelect.value)
    .then(() => {
      deleteModalPreview.value = false;
      isLoading.value = false;
      toast.success("Évaluation  supprimée");
      getDatas();
    })
    .catch((e) => {
      isLoading.value = false;
      toast.error(e.response.data.message);
    });
};
const getStatusText = (param) => {
  switch (param) {
    case 1:
      return { label: "Terminé", class: "bg-success" };
    case 0:
      return { label: "En cours", class: "bg-pending" };
    case -1:
      return { label: "Non demarré", class: "bg-primary" };
    default:
      return { label: "A déterminer", class: "bg-primary" };
  }
};

function gotoSoumissions(enquete) {
  if (verifyPermission("voir-une-evaluation-de-gouvernance")) {
    router.push({ name: "SoumissionsEnqueteDeCollecte", params: { id: enquete.id } });
  }
  // router.push({ name: "SoumissionsEnqueteDeCollecte", params: { id: enquete.id } });
}

function gotoAppreciations(enquete) {
  router.push({ name: "EnqueteAppreciations", query: { enqueteId: enquete.id } });
}

async function changeOrganisationScore() {
  await getEvolutionByScore(ongSelectedScore.value);
  yearSelectedOng.value = yearsCurrentScore.value[0];
}

function fetchOrganisationsAndFormulaires() {
  getFormsFactuel();
  getFormsPerception();
  getOrganisations();
}

const handleEdit = (params) => {

  fetchOrganisationsAndFormulaires();

  isCreate.value = false;
  idSelect.value = params.id;
  payload.intitule = params.intitule;
  payload.description = params.description ?? "";
  payload.annee_exercice = params.annee_exercice;
  payload.debut = params.debut;
  payload.fin = params.fin;
  
  if (params.formulaire_factuel_de_gouvernance) {
    idFormFactuel.value = params.formulaire_factuel_de_gouvernance;
  }
  if (params.formulaire_de_perception_de_gouvernance) {
    idFormPerception.value = params.formulaire_de_perception_de_gouvernance;
  }
  payload.organisations = params.organisations.map((ong) => ong.id);
  showModalCreate.value = true;
};

const handleDelete = (params) => {
  idSelect.value = params.id;
  deleteModalPreview.value = true;
};
const handleObjectif = (params) => {
  evaluationSelected.value = params;
  showModalObjectif.value = true;
};
const cancelSelect = () => {
  deleteModalPreview.value = false;
  idSelect.value = "";
};
const resetForm = () => {
  payload.intitule = "";
  payload.annee_exercice = new Date().getFullYear();
  // payload.objectif_attendu = 0;
  payload.debut = "";
  payload.description = "";
  payload.fin = "";
  if (formulairesFactuel.value.length) {
    idFormFactuel.value = formulairesFactuel.value[0].id;
  }

  if (formulairesPerception.value.length) {
    idFormPerception.value = formulairesPerception.value[0].id;
  }
  // idFormFactuel.value = formulairesFactuel.value[0].id;
  // idFormPerception.value = formulairesPerception.value[0].id;
  payload.organisations = [];
  showModalCreate.value = false;
  errors.value = {};
};
const openCreateModal = () => {
  fetchOrganisationsAndFormulaires();
  showModalCreate.value = isCreate.value = true;
};

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

const yearsCurrentScore = computed(() => Object.keys(currentScore.value));

const datasSearch = computed(() => {
  return datas.value.filter((evaluation) => {
    const searchTerm = search.value.toLowerCase();
    return evaluation.intitule.toLowerCase().includes(searchTerm);
  });
});

const getFirstPerceptionForm = (item) => {
  return item.formulaires_de_gouvernance.find(
    f => f && f.type === "perception" && f.lien
  );
};


onMounted(async () => {
  await getDatas();
  await getOrganisationsProgramme();
  getcurrentUser();
  // ongSelectedScore.value = organisations.value[0].id;
  // changeOrganisationScore();
  // getFormsFactuel();
  // getFormsPerception();
});
</script>

<template>
  <h2 class="my-10 text-lg font-medium intro-y">Évaluation de gouvernance</h2>
  <div class="grid grid-cols-12 gap-6 mb-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" id="search_evaluation" name="search_evaluation" v-model="search" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div class="flex">
        <button v-if="verifyPermission('creer-une-evaluation-de-gouvernance')" class="mr-2 shadow-md btn btn-primary" @click="openCreateModal"><PlusIcon class="w-4 h-4 mr-3" />Ajouter une évaluation de gouvernance</button>
      </div>
    </div>
  </div>
  <TabGroup>
    <TabList class="space-x-4 font-bold uppercase nav-boxed-tabs">
      <Tab class="w-full py-2 bg-white" tag="button">LISTE DES ÉVALUATIONS</Tab>
      <Tab class="w-full py-2 bg-white" tag="button">ANALYSES DES DONNÉES</Tab>
    </TabList>
    <TabPanels class="mt-5">
      <TabPanel>
        <div class="p-5 mt-5 intro-y">
          <LoaderSnipper v-if="isLoadingData" />
          <div v-else-if="datasSearch.length === 0" class="flex flex-col items-center justify-center p-10 mt-10">
            <div class="text-center">
              <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="text-xl font-semibold text-gray-700 mb-2">Aucune évaluation trouvée</h3>
              <p class="text-gray-500">Il n'y a pas d'évaluation correspondant à votre recherche.</p>
            </div>
          </div>
          <div v-else class="grid grid-cols-12 gap-6 mt-5">
            <div v-for="(item, index) in datasSearch" :key="index" class="col-span-12 p-4 md:col-span-12 lg:col-span-4">
              <div class="p-5 transition-transform transform bg-white border-l-4 rounded-lg shadow-lg box border-primary hover:scale-105 hover:bg-gray-50">
                <!-- En-tête avec sigle et titre -->
                <div class="relative flex items-start pt-2">
                  <!-- Dropdown for actions -->
                  <Dropdown class="absolute top-0 right-0 mt-2 mr-2">
                    <DropdownToggle tag="a" class="block w-5 h-5 cursor-pointer">
                      <MoreVerticalIcon class="w-5 h-5 text-gray-400 transition-colors hover:text-gray-600" />
                    </DropdownToggle>
                    <DropdownMenu class="w-40 bg-white rounded-md shadow-lg">
                      <DropdownContent>
                        <!-- <DropdownItem @click="handleObjectif(item)"> <PlusIcon class="w-4 h-4 mr-2 text-gray-600" /> Ajouter Objectifs </DropdownItem> -->
                        <DropdownItem v-if="verifyPermission('modifier-une-evaluation-de-gouvernance')" @click="handleEdit(item)"> <Edit2Icon class="w-4 h-4 mr-2 text-gray-600" /> Modifier </DropdownItem>
                        <DropdownItem v-if="verifyPermission('supprimer-une-evaluation-de-gouvernance')" @click="handleDelete(item)"> <TrashIcon class="w-4 h-4 mr-2 text-red-500" /> Supprimer </DropdownItem>
                      </DropdownContent>
                    </DropdownMenu>
                  </Dropdown>
                </div>

                <div @click="gotoSoumissions(item)" class="flex flex-col items-start w-full gap-2 mt-2 cursor-pointer">
                  <!-- Item details -->
                  <div class="text-center lg:text-left lg:mt-0">
                    <span class="text-lg font-semibold text-gray-800 transition-colors hover:text-primary">
                      {{ item.intitule }}
                    </span>
                  </div>
                </div>

                <!-- Description section with distinct styling -->
                <div @click="gotoSoumissions(item)" class="w-full mt-5 text-center cursor-pointer lg:text-left">
                  <!-- Other details with iconized section headers -->
                  <div class="mt-5 space-y-4 text-gray-600">
                    <div class="flex items-center text-sm font-medium text-gray-700">
                      <CheckSquareIcon class="w-4 h-4 mr-2 text-primary" /> Statut: <span :class="getStatusText(item.statut).class" class="px-3 py-2 ml-3 text-xs text-white rounded-full">{{ getStatusText(item.statut).label }}</span>
                    </div>
                    <div class="flex items-center text-sm font-medium text-gray-700">
                      <CalendarIcon class="w-4 h-4 mr-2 text-primary" /> Période:
                      <span class="ml-2 font-semibold text-gray-900">{{ item.debut }} <span class="font-normal">au</span> {{ item.fin }}</span>
                    </div>

                    <div class="flex items-center text-sm font-medium text-gray-700">
                      <BarChart2Icon class="w-4 h-4 mr-2 text-primary" /> Total soumissions:
                      <span class="ml-2 font-semibold text-gray-900">{{ item.total_soumissions_de_perception + item.total_soumissions_factuel }}</span>
                    </div>
                    <div class="flex items-center text-sm font-medium text-gray-700">
                      <ProgressBar :percent="item.pourcentage_evolution_organisations" />
                    </div>
                  </div>
                </div>
                <div v-if="getFirstPerceptionForm(item)" class="p-4 bg-gray-100 rounded-lg flex items-center space-x-4 mt-3">
                  <pre>{{ getFirstPerceptionForm(item).lien }}</pre>
                  <a href="google.com" target="_blank" class="text-blue-600 underline"> google.com </a>
                  <button @click="copierLien('google.com')" class="px-4 py-2 btn btn-primary text-white rounded-lg hover:bg-pending hover:text-primary transition" title="Cliquer pour copier le lien du formulaire de perception">Copier lien Perception</button>
                  <span v-if="copié" class="text-green-600">Copié !</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel>
        <div class="">
          <div class="flex flex-col items-center w-full gap-8">
            <div class="flex justify-center w-full p-3">
              <div class="w-full max-w-full box">
                <p class="p-3 text-lg font-medium">Résultats synthetique par année</p>
                <div class="!w-[250px] p-3">
                  <label for="organisation_score" class="form-label">Organisation</label>
                  <TomSelect id="organisation_score" name="organisation_score" v-model="ongSelectedScore" @change="changeOrganisationScore" :options="{ placeholder: 'Selectionez une organisation' }">
                    <option value=""></option>
                    <option v-for="organisation in ongsProgramme" :key="organisation.id" :value="organisation.id">{{ organisation.nom }}</option>
                  </TomSelect>
                </div>
                <!-- <pre>{{ currentScore }}</pre> -->
                <ChartProgressionByTime :chartData="currentScore" v-if="ongSelectedScore && !isLoadingDataScore" />
                <div class="h-[600px] flex justify-center items-center" v-if="!ongSelectedScore && !isLoadingDataScore">
                  <p class="text-xl font-medium text-slate-600">Veuillez choisir une organisation pour afficher le graphique</p>
                </div>
                <div class="h-[600px] flex justify-center items-center" v-if="isLoadingDataScore">
                  <LoaderSnipper />
                </div>
              </div>
            </div>
            <div class="flex justify-center w-full p-3">
              <div class="w-full max-w-full box">
                <p class="p-3 text-lg font-medium">Score des indices par principe</p>
                <div class="!w-[250px] p-3">
                  <label for="annee_score" class="form-label">Année</label>
                  <TomSelect id="annee_score" name="annee_score" v-model="yearSelectedOng" :options="{ placeholder: 'Selectionez une organisation' }">
                    <option value=""></option>
                    <option v-for="year in annees" :key="year" :value="year">{{ year }}</option>
                  </TomSelect>
                </div>
                <ChartScroreByPrincipe v-if="currentScore[yearSelectedOng]?.length > 0" :datas="currentScore[yearSelectedOng]" />
                <div v-else class="h-[600px] flex justify-center items-center">
                  <p class="text-xl font-medium text-slate-600">Aucune données disponible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabPanel>
    </TabPanels>
  </TabGroup>

  <!-- Modal Register & Update -->
  <Modal size="modal-xl" backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} une évaluation</h2>
    </ModalHeader>
     <form @submit.prevent="submitData">
        <ModalBody>
          <div class="grid grid-cols-12 gap-4">
            <!-- Nom -->
            <div class="col-span-12 md:col-span-6">
              <InputForm 
                id="nom_evaluation"
                name="intitule"
                label="Nom" 
                v-model="payload.intitule" 
                :control="getFieldErrors(errors.intitule)" 
              />
            </div>

            <!-- Description -->
            <div class="col-span-12 md:col-span-6">
              <label class="form-label" for="description_evaluation">Description</label>
              <textarea 
                id="description_evaluation"
                name="description"
                class="form-control w-full" 
                v-model="payload.description" 
                rows="3"
              ></textarea>
              <div v-if="errors.description" class="mt-2 text-danger">{{ getFieldErrors(errors.description) }}</div>
            </div>

            <!-- Année -->
            <div class="col-span-12 md:col-span-6">
              <label for="annee_exercice_evaluation" class="form-label">Année</label>
              <TomSelect 
                id="annee_exercice_evaluation"
                name="annee_exercice"
                v-model="payload.annee_exercice" 
                :options="{ placeholder: 'Sélectionnez une année' }" 
                class="w-full"
              >
                <option v-for="(year, index) in annees" :key="index" :value="year">{{ year }}</option>
              </TomSelect>
              <div v-if="errors.annee_exercice" class="mt-2 text-danger">{{ getFieldErrors(errors.annee_exercice) }}</div>
            </div>

            <!-- Dates début/fin -->
            <div class="col-span-12 md:col-span-6">
              <InputForm 
                id="debut_enquete"
                name="debut"
                label="Début de l'enquête" 
                v-model="payload.debut" 
                type="date" 
                :control="getFieldErrors(errors.debut)" 
              />
            </div>
            <div class="col-span-12 md:col-span-6">
              <InputForm 
                id="fin_enquete"
                name="fin"
                label="Fin de l'enquête" 
                v-model="payload.fin" 
                type="date" 
                :control="getFieldErrors(errors.fin)" 
              />
            </div>

            <!-- Formulaire Factuel -->
            <div class="col-span-12 md:col-span-6">
              <label for="formulaire_factuel" class="form-label">Formulaire Factuel <span class="text-danger">*</span></label>
              <TomSelect 
                id="formulaire_factuel"
                name="idFormFactuel"
                v-model="idFormFactuel" 
                :options="{ placeholder: 'Sélectionnez un formulaire' }" 
                class="w-full"
              >
                <option v-for="(form, index) in formulairesFactuel" :key="index" :value="form.id">{{ form.libelle }}</option>
              </TomSelect>
              <div v-if="errors.formulaires_de_gouvernance" class="mt-2 text-danger">{{ getFieldErrors(errors.formulaires_de_gouvernance) }}</div>
            </div>

            <!-- Formulaire de perception -->
            <div class="col-span-12 md:col-span-6">
              <label for="formulaire_perception" class="form-label">Formulaire de perception <span class="text-danger">*</span></label>
              <TomSelect 
                id="formulaire_perception"
                name="idFormPerception"
                v-model="idFormPerception" 
                :options="{ placeholder: 'Sélectionnez un formulaire' }" 
                class="w-full"
              >
                <option v-for="(form, index) in formulairesPerception" :key="index" :value="form.id">{{ form.libelle }}</option>
              </TomSelect>
              <div v-if="errors.formulaires_de_gouvernance" class="mt-2 text-danger">{{ getFieldErrors(errors.formulaires_de_gouvernance) }}</div>
            </div>

            <!-- Organisations -->
            <div class="col-span-12 md:col-span-6">
              <label for="organisations_evaluation" class="form-label">Organisations <span class="text-danger">*</span></label>
              <TomSelect 
                id="organisations_evaluation"
                name="organisations"
                v-model="payload.organisations" 
                multiple 
                :options="{ placeholder: 'Sélectionnez les organisations' }" 
                class="w-full"
              >
                <option v-for="(organisation, index) in organisations" :key="index" :value="organisation.id">{{ organisation.nom }}</option>
              </TomSelect>
              <div v-if="errors.organisations" class="mt-2 text-danger">{{ getFieldErrors(errors.organisations) }}</div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div class="flex gap-2">
            <button 
              type="button" 
              @click="resetForm" 
              class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary"
              id="annuler_evaluation"
            >
              Annuler
            </button>
            <VButton 
              :loading="isLoading" 
              :label="mode" 
              type="submit"
              id="soumettre_evaluation"
            />
          </div>
        </ModalFooter>
      </form>
  </Modal>
  <!-- End Modal -->

  <!-- Modal Delete -->
  <Modal :show="deleteModalPreview" @hidden="deleteModalPreview = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Suppression</div>
        <div class="mt-2 text-slate-500">Supprimer une évaluation?</div>
      </div>
      <div class="flex justify-center w-full gap-3 py-4 text-center">
        <button type="button" @click="cancelSelect" class="mr-1 btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>
  <!-- End Modal -->
  <AddObjectifEvaluation v-show="showModalObjectif" :evaluation="evaluationSelected" v-model:show="showModalObjectif" @update-datas="getDatas" />
</template>
