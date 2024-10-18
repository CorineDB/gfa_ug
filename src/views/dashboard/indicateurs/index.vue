<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import IndicateursService from "@/services/modules/indicateur.service";
import IndicateurValueKeys from "@/services/modules/key.value.service";
import TypeGouvernance from "@/services/modules/typeGouvernance.service";
import Tabulator from "tabulator-tables";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import UniteeDeMesureService from "@/services/modules/unitee.mesure.service";
import SiteService from "@/services/modules/site.service";

const payload = reactive({
  nom: "",
  description: "",
  indice: Number,
  sources_de_donnee: "",
  methode_de_la_collecte: "",
  frequence_de_la_collecte: "",
  responsable: "",
  anneeDeBase: "",
  type_de_variable: "", // selecte
  agreger: Boolean,
  value_keys: [],
  uniteeMesureId: "",
  sites: [],
  valeurDeBase: null,
  anneesCible: [],
  uniteeMesureId: "",
  sites: "",
});
const tabulator = ref();
const idSelect = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const programmes = ref([]);
const datas = ref([]);
const keyIndicateursDatas = ref([]);
const uniteDeMesureDatas = ref([]);
const siteDatas = ref([]);

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const startYear = 1900;

  for (let i = currentYear; i >= startYear; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i;
    yearSelect.add(option);
  }
});

const cleChoisie = computed(() => {
  if (payload.value_keys.length > 0) {
    payload.value_keys.forEach((item) => {
      console.log(keyIndicateursDatas.values.filter((key) => key.id === item)[0]);
    });
  }
});

const createData = async () => {
  isLoading.value = true;
  await IndicateursService.create(payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Indicateurs créer.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Vérifier les informations et ressayer.");
    });
};
const getDatas = async () => {
  isLoadingData.value = true;
  await IndicateursService.get()
    .then((result) => {
      datas.value = result.data.data;
      isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste des type des options.");
    });
  initTabulator();
};

const getCleIndicateursDatas = async () => {
  await IndicateurValueKeys.get()
    .then((result) => {
      keyIndicateursDatas.value = result.data.data;
    })
    .catch((e) => {
      console.error(e);

      toast.error("Une erreur est survenue: Liste des type des options.");
    });
};

const getUniteMesureDatas = async () => {
  await UniteeDeMesureService.get()
    .then((result) => {
      uniteDeMesureDatas.value = result.data.data;
    })
    .catch((e) => {
      console.error(e);

      toast.error("Une erreur est survenue: Liste des type des options.");
    });
};

const getSiteDatas = async () => {
  await SiteService.get()
    .then((result) => {
      siteDatas.value = result.data.data;
    })
    .catch((e) => {
      console.error(e);

      toast.error("Une erreur est survenue: Liste des type des options.");
    });
};

const updateData = async () => {
  isLoading.value = true;
  await IndicateursService.update(idSelect.value, payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Indicateurs modifiée.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Vérifier les informations et ressayer.");
    });
};
const submitData = () => (isCreate.value ? createData() : updateData());
const deleteData = async () => {
  isLoading.value = true;
  await IndicateursService.destroy(idSelect.value)
    .then(() => {
      deleteModalPreview.value = false;
      isLoading.value = false;
      toast.success("Indicateurs supprimée");
      getDatas();
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Une erreur est survenue, ressayer");
    });
};
const getProgrammes = () => {
  TypeGouvernance.getAllProgrammes()
    .then((result) => {
      programmes.value = result.data.data;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Liste des Programmes.");
    });
};
const initTabulator = () => {
  tabulator.value = new Tabulator("#tabulator", {
    data: datas.value,
    placeholder: "Aucune donnée disponible.",
    layout: "fitColumns",
    columns: [
      {
        title: "Nom",
        field: "nom",
      },
      {
        title: "Description",
        field: "description",
      },
      {
        title: "Année de base",
        field: "anneeDeBase",
      },
      {
        title: "Unité de mesure",
        field: "unitee_mesure",
        hozAlign: "center",
        width: 200,
        formatter(cell) {
          return `${cell.getData().unitee_mesure.nom}`;
        },
      },
      {
        title: "Catégories",
        field: "categorie",
        hozAlign: "center",
        width: 200,
        formatter(cell) {
          return `${cell.getData().categorie.nom}`;
        },
      },
      {
        title: "Date de création",
        field: "created_at",
      },
      {
        title: "Actions",
        field: "actions",
        formatter: (cell) => {
          const container = document.createElement("div");
          container.className = "flex items-center justify-center gap-3";

          const createButton = (label, className, onClick) => {
            const button = document.createElement("button");
            button.className = className;
            button.innerText = label;
            button.addEventListener("click", onClick);
            return button;
          };

          const modifyButton = createButton("Modifier", "btn btn-primary", () => {
            handleEdit(cell.getData());
          });

          const deleteButton = createButton("Supprimer", "btn btn-danger", () => {
            handleDelete(cell.getData());
          });

          container.append(modifyButton, deleteButton);

          return container;
        },
      },
    ],
  });
};
const handleEdit = (params) => {
  isCreate.value = false;
  idSelect.value = params.id;
  payload.libelle = params.libelle;
  payload.description = params.description;
  payload.note = params.note;
  // payload.programmeId = params.programmeId;
  showModalCreate.value = true;
};
const handleDelete = (params) => {
  idSelect.value = params.id;
  deleteModalPreview.value = true;
};
const cancelSelect = () => {
  deleteModalPreview.value = false;
  idSelect.value = "";
};
const resetForm = () => {
  payload.libelle = "";
  payload.description = "";
  payload.note = "";
  // payload.programmeId = "";
  showModalCreate.value = false;
};
const openCreateModal = () => {
  // payload.programmeId = "";
  showModalCreate.value = isCreate.value = true;
};

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

onMounted(() => {
  getDatas();
  getProgrammes();
  getCleIndicateursDatas();
  getUniteMesureDatas();
  getSiteDatas();
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Indicateurs</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="openCreateModal"><PlusIcon class="w-4 h-4 mr-3" />Ajouter un indicateur</button>
      </div>
    </div>
  </div>

  <div class="p-5 mt-5 intro-y box">
    <div class="flex flex-col sm:flex-row sm:items-end xl:items-start">
      <div></div>
      <div class="flex mt-5 sm:mt-0">
        <button id="tabulator-print" class="w-1/2 mr-2 btn btn-outline-secondary sm:w-auto"><PrinterIcon class="w-4 h-4 mr-2" /> Print</button>
        <Dropdown class="w-1/2 sm:w-auto">
          <DropdownToggle class="w-full btn btn-outline-secondary sm:w-auto">
            <FileTextIcon class="w-4 h-4 mr-2" /> Export
            <ChevronDownIcon class="w-4 h-4 ml-auto sm:ml-2" />
          </DropdownToggle>
          <DropdownMenu class="w-40">
            <DropdownContent>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export CSV </DropdownItem>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export JSON </DropdownItem>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export XLSX </DropdownItem>
              <DropdownItem> <FileTextIcon class="w-4 h-4 mr-2" /> Export HTML </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="overflow-x-auto scrollbar-hidden" v-if="!isLoadingData">
      <div id="tabulator" class="mt-5 table-report table-report--tabulator"></div>
    </div>
    <LoaderSnipper v-if="isLoadingData" />
  </div>

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} un indicateur</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Nom" v-model="payload.nom" />
          <InputForm label="Description" v-model="payload.description" />
          <InputForm label="Source de donnée" v-model="payload.sources_de_donnee" />
          <InputForm label="Méthode de collecte" v-model.number="payload.methode_de_la_collecte" />
          <InputForm label="Fréquence de la collecte" v-model.number="payload.frequence_de_la_collecte" />
          <InputForm label="Responsable" v-model.number="payload.responsable" />
          <InputForm label="Année de base" v-model.number="payload.anneeDeBase" />
          <div class="">
            <label class="form-label">Type de variable </label>
            <TomSelect v-model="payload.programmeId" :options="{ placeholder: 'Selectionez un programme' }" class="w-full">
              <option value="quantitatif">Quantitatif</option>
              <option value="qualitatif">Dichotomique</option>
              <option value="qualitatif">Dichotomique</option>
            </TomSelect>
          </div>
          <div class="mt-3">
            <label class="mb-3">Valeurs multiples</label>
            <div class="flex flex-col sm:flex-row mt-2">
              <div class="form-check mr-2">
                <input id="agregerTrue" class="form-check-input" type="radio" name="agreger" :value="true" v-model="payload.agreger" />
                <label class="form-check-label" for="agregerTrue">OUI</label>
              </div>
              <div class="form-check mr-2 mt-2 sm:mt-0">
                <input id="agregerFalse" class="form-check-input" type="radio" name="agreger" :value="false" v-model="payload.agreger" />
                <label class="form-check-label" for="agregerFalse">NON</label>
              </div>
            </div>
          </div>

          <div class="">
            <label class="form-label">Entité à évaluer</label>
            <TomSelect multiple v-model="payload.value_keys" :options="{ placeholder: 'Selectionez une entité' }" class="w-full">
              <option v-for="(item, index) in keyIndicateursDatas" :key="index" :value="item.id">{{ item.libelle }}</option>
            </TomSelect>
          </div>

          <div class="">
            <label class="form-label">Unité de mesure</label>
            <TomSelect v-model="payload.uniteeMesureId" :options="{ placeholder: 'Selectionez une unité de mesure' }" class="w-full">
              <option v-for="(item, index) in uniteDeMesureDatas" :key="index" :value="item.id">{{ item.nom }}</option>
            </TomSelect>
          </div>
          <div class="">
            <label class="form-label">Sites</label>
            <TomSelect multiple v-model="payload.sites" :options="{ placeholder: 'Selectionez un site' }" class="w-full">
              <option v-for="(item, index) in siteDatas" :key="index" :value="item.id">{{ item.nom }}</option>
            </TomSelect>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetForm" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" :label="mode" />
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
        <div class="mt-2 text-slate-500">Supprimer cette option de réponse?</div>
      </div>
      <div class="flex justify-center w-full gap-3 py-4 text-center">
        <button type="button" @click="cancelSelect" class="mr-1 btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>
  <!-- End Modal -->
</template>
