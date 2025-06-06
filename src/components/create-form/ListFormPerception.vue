<script setup>
import { ref, watch, computed, onMounted } from "vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import Tabulator from "tabulator-tables";
import { toast } from "vue3-toastify";
//import FormulaireDePerception from "@/services/modules/formFactuel.service";
import FormulaireDePerception from "@/services/modules/enquetes_de_gouvernance/formPerception.service";
import PreviewDetailPerceptionForm from "@/components/create-form/PreviewDetailPerceptionForm.vue";
import DeleteButton from "@/components/news/DeleteButton.vue";
import ListOptionsResponse from "@/components/create-form/ListOptionsResponse.vue";
import { useRouter } from "vue-router";

const prop = defineProps({
  fetchData: Boolean,
});

const router = useRouter();
const tabulator = ref();
const searchValue = ref("");
const isLoading = ref(false);
const isLoadingOneForm = ref(false);
const showModal = ref(false);
const showModalDelete = ref(false);
const listForms = ref([]);
const previewForm = ref({});
const idSelectedForm = ref("");
const nameSelect = ref("");
const search = ref("");
const getListForm = async () => {
  isLoading.value = true;
  try {
    const { data } = await FormulaireDePerception.get();
    listForms.value = data.data;
  } catch (e) {
    toast.error("Erreur récupération liste des formulaires.");
    console.log(e);
  } finally {
    isLoading.value = false;
  }
  initTabulator();
};
const getOneForm = async () => {
  isLoadingOneForm.value = true;
  try {
    const { data } = await FormulaireDePerception.getOne(idSelectedForm.value);
    previewForm.value = data.data;
  } catch (e) {
    toast.error("Erreur récupération du  formulaire.");
    console.log(e);
  } finally {
    isLoadingOneForm.value = false;
  }
};
const deleteOneForm = async () => {
  isLoadingOneForm.value = true;
  try {
    await FormulaireDePerception.destroy(idSelectedForm.value);
    showModalDelete.value = false;
    toast.success("Formulaire supprimé.");
    getListForm();
  } catch (e) {
    toast.error("Erreur lors de la suppression.");
    console.log(e);
  } finally {
    isLoadingOneForm.value = false;
  }
};
const initTabulator = () => {
  tabulator.value = new Tabulator("#list-perception", {
    data: listForms.value,
    placeholder: "Aucune donnée disponible.",
    headerHozAlign: "left",
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 10,
    columns: [
      {
        title: "Libellé",
        field: "libelle",
        vertAlign: "middle",
        hozAlign: "left",
      },/* 
      {
        title: "Année",
        field: "annee_exercice",
        vertAlign: "middle",
        hozAlign: "center",
      }, */
      {
        title: "Actions",
        field: "actions",
        vertAlign: "middle",
        hozAlign: "left",

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

          const previewButton = createButton("Voir", "btn btn-primary", () => {
            handlepreview(cell.getData());
          });

          const modifyButton = createButton("Modifier", "btn btn-pending", () => {
            handleModify(cell.getData());
          });
          const deleteButton = createButton("Supprimer", "btn btn-danger", () => {
            handleDelete(cell.getData());
          });

          container.append(previewButton, modifyButton, deleteButton);

          return container;
        },
      },
    ],
  });
};
const applyFilter = () => {
  if (tabulator.value) {
    const query = searchValue.value.toLowerCase();
    tabulator.value.setFilter((data) => {
      return data.libelle.toLowerCase().includes(query);
    });
  }
};
const handlepreview = (params) => {
  idSelectedForm.value = params.id;
  getOneForm();
  showModal.value = true;
};

const handleDelete = (params) => {
  idSelectedForm.value = params.id;
  nameSelect.value = params.libelle;
  showModalDelete.value = true;
};
const handleModify = (params) => {
  router.push({ name: "update_form_perception", params: { id: params.id } });
};

const cancelDelete = () => {
  idSelectedForm.value = "";
  showModalDelete.value = false;
};

const optionPreviewForm = computed(() => {
  if (previewForm.value.options_de_reponse)
    return previewForm.value.options_de_reponse.map((option) => ({
      id: option.id,
      point: option.point,
      libelle: option.libelle,
    }));
});

watch(
  () => prop.fetchData,
  () => {
    getListForm();
  }
);

onMounted(() => {
  getListForm();
  initTabulator();
});
</script>

<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Formulaires de perception</h2>
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" @input="applyFilter" v-model="searchValue" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
    </div>
    <LoaderSnipper v-if="isLoading" />
    <div v-show="!isLoading" class="overflow-x-auto scrollbar-hidden">
      <div id="list-perception" class="mt-5 table-report table-report--tabulator"></div>
    </div>
  </div>

  <!-- BEGIN: Modal Content -->
  <Modal size="modal-xl" :show="showModal" @hidden="showModal = false">
    <LoaderSnipper v-if="isLoadingOneForm" />
    <div v-else class="mb-5">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">{{ previewForm.libelle }}</h2>
      </ModalHeader>

      <ModalBody class="space-y-5">
        
        <table class="w-full mt-5 border-collapse table-auto border-slate-500" cellpadding="10" cellspacing="0">
          <thead class="text-white bg-blue-900">
            <!-- First header row -->
            <tr>
              <th :rowspan="2" class="py-3 border border-slate-900">Principes</th>
              <th :rowspan="2" class="py-3 border border-slate-900">Questions opérationnelle</th>
              <th :colspan="previewForm?.options_de_reponse?.length ?? 6"
                class="py-3 border border-slate-900 text-center">
                Réponses
              </th>
            </tr>
            <!-- Second header row -->
            <tr>
              <template v-for="(option_de_reponse, idx) in previewForm.options_de_reponse"
                :key="option_de_reponse.id">
                <th class="py-3 border border-slate-900 text-center">{{ option_de_reponse.libelle }}</th>
              </template>
            </tr>
          </thead>

          <tbody>
            <template v-for="principe_de_gouvernance in previewForm.categories_de_gouvernance"
              :key="principe_de_gouvernance.id">
              <template v-for="(question, qIndex) in principe_de_gouvernance.questions_de_gouvernance"
                :key="question.id">
                <tr>
                  <td class="font-semibold" v-if="qIndex === 0"
                    :rowspan="principe_de_gouvernance.questions_de_gouvernance.length">
                    {{ principe_de_gouvernance.position }} - {{ principe_de_gouvernance.nom }}
                  </td>

                  <td>
                    {{ question.position }} - {{ question.question_operationnelle.nom }}
                  </td>

                  <template v-for="(option_de_reponse, optionIdx) in previewForm.options_de_reponse"
                    :key="option_de_reponse.id">
                    <td class="border border-slate-900 text-center">
                      {{ }}
                    </td>
                  </template>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </ModalBody>
    </div>
    <ModalFooter>
      <div class="flex gap-2">
        <button type="button" @click="showModal = false" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Retour</button>
      </div>
    </ModalFooter>
  </Modal>
  <!-- END: Modal Content -->

  <!-- Modal for deleting -->
  <Modal :show="showModalDelete" @hidden="showModalDelete = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-lg">{{ nameSelect }}</div>
        <div class="mt-2 text-slate-500">Ce formulaire sera supprimé</div>
      </div>
      <div class="flex justify-center gap-3 py-4">
        <button type="button" @click="cancelDelete" class="btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoadingOneForm" @click="deleteOneForm" />
      </div>
    </ModalBody>
  </Modal>
</template>

<style scoped></style>
