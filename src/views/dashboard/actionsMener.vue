<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import ActionMenerService from "@/services/modules/action.amener.service";
import TypeGouvernance from "@/services/modules/typeGouvernance.service";
import Tabulator from "tabulator-tables";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";

const payload = reactive({
  est_valider: false,
  commentaire: "",
});
const tabulator = ref();
const idSelect = ref("");
const showModalValidate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const datas = ref([]);

const validateData = async () => {
  isLoading.value = true;
  await ActionMenerService.validateAction(idSelect.value, payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Action à mener validée.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Vérifier les informations et ressayer.");
    });
};
const getDatas = async () => {
  isLoadingData.value = true;
  await ActionMenerService.get()
    .then((result) => {
      datas.value = result.data.data;
      isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste des actions.");
    });
  initTabulator();
};

const initTabulator = () => {
  tabulator.value = new Tabulator("#tabulator", {
    data: datas.value,
    placeholder: "Aucune donnée disponible.",
    layout: "fitColumns",
    columns: [
      {
        title: "Action à mener",
        field: "action",
      },
      {
        title: "Évaluation",
        field: "evaluation",
        formatter(cell) {
          return `${cell.getData().actionable.intitule}`;
        },
      },
      {
        title: "Organisations",
        field: "organisations",
        hozAlign: "center",
        vertAlign: "middle",

        formatter(cell) {
          return `${cell
            .getData()
            .actionable.organisations.map((org) => org.sigle)
            .join(", ")}`;
        },
      },
      {
        title: "Preuves",
        field: "preuves",
        formatter(cell) {
          return `${cell
            .getData()
            .preuves.map((preuve) => preuve.nom)
            .join(", ")}`;
        },
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

          const validateButton = createButton("Valider", "btn btn-primary", () => {
            handleValidate(cell.getData());
          });

          const rejetButton = createButton("Rejeter", "btn btn-danger", () => {
            handleReject(cell.getData());
          });

          if (!cell.getData().est_valider) {
            container.append(validateButton, rejetButton);
          }

          return container;
        },
      },
    ],
  });
};
const handleValidate = (params) => {
  idSelect.value = params.id;
  payload.est_valider = true;
  showModalValidate.value = true;
};
const handleReject = (params) => {
  idSelect.value = params.id;
  payload.est_valider = false;
  showModalValidate.value = true;
};
const handleDelete = (params) => {
  idSelect.value = params.id;
  deleteModalPreview.value = true;
};

const resetForm = () => {
  payload.commentaire = "";
  showModalValidate.value = false;
};

onMounted(() => {
  getDatas();
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Actions à mener</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
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
  <Modal backdrop="static" :show="showModalValidate" @hidden="showModalValidate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Validation</h2>
    </ModalHeader>
    <form @submit.prevent="validateData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <div class="flex-1">
            <label class="form-label" for="description">Commentaire</label>
            <div class="">
              <textarea name="commentaire" class="form-control" id="description" v-model="payload.commentaire" cols="30" rows="2"></textarea>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetForm" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" label="Valider" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- End Modal -->
</template>
