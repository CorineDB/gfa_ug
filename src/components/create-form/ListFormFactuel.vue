<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import Tabulator from "tabulator-tables";
import { toast } from "vue3-toastify";
import FormulaireFactuel from "@/services/modules/formFactuel.service";

const tabulator = ref();
const isLoading = ref(false);
const showModal = ref(false);
const listForms = ref([]);
const getListForm = async () => {
  isLoading.value = true;
  try {
    const { data } = await FormulaireFactuel.get();
    listForms.value = data.data;
  } catch (e) {
    toast.error("Erreur récupération liste des formulaires.");
    console.log(e);
  } finally {
    isLoading.value = false;
  }
  initTabulator();
};

const initTabulator = () => {
  tabulator.value = new Tabulator("#tabulator", {
    data: listForms.value,
    placeholder: "Aucune donnée disponible.",
    layout: "fitColumns",

    columns: [
      {
        title: "Libellé",
        field: "libelle",
        vertAlign: "middle",
        hozAlign: "center",
      },
      {
        title: "Actions",
        field: "actions",
        vertAlign: "middle",
        hozAlign: "center",

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

          const modifyButton = createButton("Voir", "btn btn-primary", () => {
            handlepreview(cell.getData());
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

const handlepreview = (params) => {};
const handleDelete = (params) => {};

onMounted(() => {
  getListForm();
});
</script>

<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Formulaires Factuels</h2>
    <div class="overflow-x-auto scrollbar-hidden">
      <div id="tabulator" class="mt-5 table-report table-report--tabulator"></div>
    </div>
    <LoaderSnipper v-if="isLoading" />
    <!-- <div v-if="!isLoading" class="grid gap-3 mx-auto grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))] mt-5" v-for="form in listForms" :key="form.id">
      <div class="p-3 space-y-3 bg-white rounded shadow-md">
        <p class="text-lg font-semibold">{{ form.libelle }}</p>
        <div class="flex justify-between border-t border-gray-300">
          <div class="flex items-center gap-1 space-x-3 transition-all">
            <button class="p-1.5 text-white btn btn-primary">
              <Edit3Icon class="size-5" />
            </button>
            <button class="p-1.5 text-white btn btn-danger">
              <TrashIcon class="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div> -->
  </div>

  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" size="modal-xl" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium"></h2>
    </ModalHeader>
    >
    <ModalBody class="space-y-5">
      <!-- <div class="max-h-[50vh] h-[50vh] overflow-y-auto">
          <PreviewFactuelForm :types-gouvernance="previewTypesGouvernance.types_de_gouvernance" />
        </div> -->
    </ModalBody>
    <ModalFooter>
      <div class="flex gap-2">
        <button type="button" @click="showModal = false" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Retour</button>
      </div>
    </ModalFooter>
  </Modal>
  <!-- END: Modal Content -->
</template>

<style scoped></style>
