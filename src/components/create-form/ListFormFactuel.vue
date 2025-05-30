<script setup>
import { ref, watch, computed, onMounted } from "vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import Tabulator from "tabulator-tables";
import { toast } from "vue3-toastify";
//import FormulaireFactuel from "@/services/modules/formFactuel.service";
import FormulaireFactuel from "@/services/modules/enquetes_de_gouvernance/formFactuel.service";
import PreviewDetailFactuelForm from "@/components/create-form/PreviewDetailFactuelForm.vue";
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
const getListForm = async () => {
  isLoading.value = true;
  try {
    const { data } = await FormulaireFactuel.get();

    console.log("!localStorage.getItem archive", !localStorage.getItem("archive"));

    if (!localStorage.getItem("achive")) {
      listForms.value = data.data;
    } else {
      console.log("localStorage.getItem archive", JSON.parse(localStorage.getItem("achive")));
      listForms.value = data.data.filter((objA) => !JSON.parse(localStorage.getItem("achive")).some((objB) => objA.id === objB.id));
    }

    console.log("listForm", listForms.value);
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
    const { data } = await FormulaireFactuel.getOne(idSelectedForm.value);
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
    await FormulaireFactuel.destroy(idSelectedForm.value);
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
  tabulator.value = new Tabulator("#list-factuel", {
    data: listForms.value,
    placeholder: "Aucune donnée disponible.",
    headerHozAlign: "center",
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 10,
    columns: [
      {
        title: "Libellé",
        field: "libelle",
        vertAlign: "middle",
        hozAlign: "center",
      },
      {
        title: "Année",
        field: "annee_exercice",
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

          const previewButton = createButton("Voir", "btn btn-primary", () => {
            handlepreview(cell.getData());
          });

          const modifyButton = createButton("Modifier", "btn btn-pending", () => {
            handleModify(cell.getData());
          });

          const deleteButton = createButton("Supprimer", "btn btn-danger", () => {
            handleDelete(cell.getData());
          });

          const archiverButton = createButton("Archiver", "btn btn-outline-danger", () => {
            handleArchiver(cell.getData());
          });

          container.append(previewButton, modifyButton, deleteButton, archiverButton);

          return container;
        },
      },
    ],
  });
};

const tabulator2 = ref(null);

const initTabulator2 = () => {
  tabulator.value = new Tabulator("#list-factuelArchive", {
    data: listForms.value,
    placeholder: "Aucune donnée disponible.",
    headerHozAlign: "center",
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 10,
    columns: [
      {
        title: "Libellé",
        field: "libelle",
        vertAlign: "middle",
        hozAlign: "center",
      },
      {
        title: "Année",
        field: "annee_exercice",
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

          const desarchiverButton = createButton("Désarchiver", "btn btn-outline-danger", () => {
            handleDesarchiver(cell.getData());
          });

          container.append(desarchiverButton);

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

const handleArchiver = (params) => {
  let achive = [];
  console.log(localStorage.getItem("achive"));
  if (!localStorage.getItem("achive")) {
    achive.push(params);
    localStorage.setItem("achive", JSON.stringify(achive));
  } else {
    achive = JSON.parse(localStorage.getItem("achive"));
    achive.push(params);
    localStorage.setItem("achive", JSON.stringify(achive));
  }

  getListForm();

  // idSelectedForm.value = params.id;
  // nameSelect.value = params.libelle;
  // showModal.value = true;

  // let myindex = null;

  // listForms.value.forEach((item, index) => {
  //   if (JSON.stringify(item) === JSON.stringify(params)) {
  //     myindex = index;
  //   }
  // });

  // listForms.value.splice(myindex, 1);
};

const showModalArchive = ref(false);

const openArchive = () => {
  showModalArchive.value = true;
  initTabulator2();
};

const handleDesarchiver = (params) => {
  let achive = [];
  let myindex = null;

  achive = JSON.parse(localStorage.getItem("achive"));

  achive.forEach((item, index) => {
    if (JSON.stringify(item) === JSON.stringify(params)) {
      myindex = index;
    }
  });

  achive.splice(myindex, 1);

  localStorage.setItem("achive", JSON.stringify(achive));

  initTabulator2();

  getListForm();


};

const handleModify = (params) => {
  router.push({ name: "update_form_factuel", params: { id: params.id } });
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

const archives = computed(() => {
  return localStorage.getItem("achive") == null;
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
    <h2 class="mt-10 text-lg font-medium intro-y">Formulaires Factuels</h2>
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" @input="applyFilter" v-model="searchValue" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>

      <!-- <button class="btn btn-primary" v-if="!archives" @click="openArchive">Voir les archives</button> -->
    </div>
    <LoaderSnipper v-if="isLoading" />
    <div v-show="!isLoading" class="overflow-x-auto scrollbar-hidden">
      <div id="list-factuel" ref="list-factuel" class="mt-5 table-report table-report--tabulator"></div>
    </div>
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
  <Modal size="modal-xl" :show="showModal" @hidden="showModal = false">
    <LoaderSnipper v-if="isLoadingOneForm" />
    <div v-else class="mb-5">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">{{ previewForm.libelle }}</h2>
      </ModalHeader>

      <ModalBody class="space-y-5">
        <!-- <div>
          <p class="mb-3">Options de réponses</p>
          <ListOptionsResponse :options="optionPreviewForm" />
        </div>
        <div class="max-h-[50vh] h-[50vh] overflow-y-auto">
          <p class="mb-3">Formulaire</p>
          <PreviewDetailFactuelForm :datas="previewForm.categories_de_gouvernance" />
        </div> -->
        
      <table class="w-full border-collapse table-auto border-slate-500" cellpadding="10" cellspacing="0">
        <thead class="text-white bg-blue-900">
          <tr>
            <th class="py-3 border border-slate-900">Principes</th>
            <th class="py-3 border border-slate-900">Critères</th>
            <th class="py-3 border border-slate-900">Indicateurs</th>
            <th class="py-3 border border-slate-900">
              Réponses <br />(
              <template class="py-3 border border-slate-900"
                v-for="(options_de_reponse, idx) in previewForm.options_de_reponse"
                :key="options_de_reponse.id">
                {{ options_de_reponse.libelle }} {{ idx < (previewForm.options_de_reponse.length - 1) ? ' / '
                  : '' }} </template>)
            </th>
            <th class="py-3 border border-slate-900">Source de validation</th>
          </tr>
        </thead>
        <tbody>

          <template v-for="type_de_gouvernance in previewForm.categories_de_gouvernance"
            :key="type_de_gouvernance.id">
            <tr class="bg-green-100">
              <td colspan="7" class="font-semibold">{{ type_de_gouvernance.nom }}</td>
            </tr>
            <template v-for="principe_de_gouvernance in type_de_gouvernance.categories_de_gouvernance"
              :key="principe_de_gouvernance.id">
              <template v-for="(critere_de_gouvernance, scIndex) in principe_de_gouvernance.categories_de_gouvernance"
                :key="critere_de_gouvernance.id">
                <template
                  v-for="(indicateur_de_gouvernance, qIndex) in critere_de_gouvernance.questions_de_gouvernance"
                  :key="indicateur_de_gouvernance.id">

                  <tr>
                    <!-- Première cellule de catégorie principale avec rowspan -->
                    <td class="font-semibold" v-if="scIndex === 0 && qIndex === 0"
                      :rowspan="principe_de_gouvernance.categories_de_gouvernance.reduce((sum, sc) => sum + sc.questions_de_gouvernance.length, 0)">
                      {{ principe_de_gouvernance.nom }}
                    </td>

                    <!-- Première cellule de sous-catégorie avec rowspan -->
                    <td v-if="qIndex === 0" :rowspan="critere_de_gouvernance.questions_de_gouvernance.length">
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
    </div>
    <ModalFooter>
      <div class="flex gap-2">
        <button type="button" @click="showModal = false" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Retour</button>
      </div>
    </ModalFooter>
  </Modal>
  <!-- END: Modal Content -->

  <!-- BEGIN: Modal Content -->
  <Modal size="modal-xl" :show="showModalArchive" @hidden="showModalArchive = false">
    <LoaderSnipper v-if="isLoading" />
    <div v-else class="mb-5">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">Formulaires Archivées</h2>
      </ModalHeader>

      <ModalBody class="space-y-5">
        <div class="overflow-x-auto scrollbar-hidden">
          <div id="list-factuelArchive" ref="list-factuelArchive" class="mt-5 table-report table-report--tabulator"></div>
        </div>
      </ModalBody>
    </div>
    <ModalFooter>
      <div class="flex gap-2">
        <button type="button" @click="showModalArchive = false" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Retour</button>
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
