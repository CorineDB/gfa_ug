<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import SuiviFinancierService from "@/services/modules/suiviFinancier.service";
import ProgrammeService from "@/services/modules/programme.service";
import TypeGouvernance from "@/services/modules/typeGouvernance.service";
import Tabulator from "tabulator-tables";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";

const payload = reactive({
  consommer: "",
  type: "",
  annee: "",
  activiteId:"",
  trimestre:"",
});

const years = ref([])
const tabulator = ref();
const idSelect = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const activites = ref([]);
const datas = ref([]);

const createData = async () => {
  isLoading.value = true;
  await SuiviFinancierService.create(payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Suivi Financier créer.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Vérifier les informations et ressayer.");
    });
};
const getDatas = async () => {
  isLoadingData.value = true;
  await SuiviFinancierService.get()
    .then((result) => {
      datas.value = result.data.data;
      isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste des type des options.");
    });
 // initTabulator();
};
const updateData = async () => {
  isLoading.value = true;
  await SuiviFinancierService.update(idSelect.value, payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Suivi Financier modifiée.");
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
  await SuiviFinancierService.destroy(idSelect.value)
    .then(() => {
      deleteModalPreview.value = false;
      isLoading.value = false;
      toast.success("Suivi Financier supprimée");
      getDatas();
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Une erreur est survenue, ressayer");
    });
};

const handleInput = function (event) {
      console.log('Nouvelle valeur :', event.target.value);
      getactivites(event.target.value)
  }

const getactivites = (year) => {
  ProgrammeService.filtreActivites({annee : year})
    .then((result) => {
      activites.value = result.data.data;
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
        title: "Libelle",
        field: "libelle",
      },
      {
        title: "Description",
        field: "description",
      },
      {
        title: "Clé",
        field: "key",
        hozAlign: "center",
        width: 200,
      },
      {
        title: "Type",
        field: "type",
        hozAlign: "center",
        width: 200,
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
  payload.key = params.key;
  payload.uniteeMesureId = params.uniteeMesureId;
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
  payload.consommer = "";
  payload.type = "";
  payload.annee = "";
  payload.activiteId = "";
  payload.trimestre = "";
  showModalCreate.value = false;
};
const openCreateModal = () => {
  // payload.programmeId = "";
  showModalCreate.value = isCreate.value = true;
};

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

onMounted(() => {
  var anneeActuelle = new Date().getFullYear() + 5;
      let i = 0;
      for (var annee = 2016; annee <= anneeActuelle; annee++) {
        i++;
        years.value.push({ nom: `${annee}` });
      }

  getDatas();
  getactivites(new Date().getFullYear());
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Suivi Financier</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="openCreateModal"><PlusIcon class="w-4 h-4 mr-3" />Ajouter un Suivi Financier</button>
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
    <!-- <div class="overflow-x-auto scrollbar-hidden" v-if="!isLoadingData">
      <div id="tabulator" class="mt-5 table-report table-report--tabulator"></div>
    </div> -->
    <div>
    <div class="border my-4 rounded-lg border-gray-300 shadow-md"  v-if="!isLoadingData">
      <!-- suivi budgetaire  current -->
      <div  class="current">
        <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">

            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">

              <tr class="">
                <th scope="col" rowspan="2"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700  whitespace-nowrap">
                  Bailleurs
                </th>
                <th scope="col" rowspan="2"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700  whitespace-nowrap">
                  Activités
                </th>

                <th scope="col" rowspan="2"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700  whitespace-nowrap">
                  Année
                </th>

                <th scope="col" rowspan="2"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700  whitespace-nowrap">
                  Trimestre
                </th>
               
                <th scope="col" colspan="4"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                  Periode
                </th>
                <th scope="col" colspan="4"
                  class="py-3 px-6 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">
                  Exercice
                </th>
                <th scope="col" colspan="4"
                  class="py-3 px-6 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">
                 Cumul
                </th>
               


              </tr>

              <tr class="">

                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 Budget
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 Consommé
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                Disponible
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 TEF
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 Budget
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 Consommé
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                Disponible
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 TEF
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 Budget
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 Consommé
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                Disponible
                </th>
                <th scope="col"
                  class="py-3 px-6 border dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">
                 TEF
                </th>
              </tr>

            </thead>
            <tbody>
              <tr v-for="(suivi,index) in datas" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {{ suivi.bailleur }}
                </th>
                
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold">{{suivi?.activite?.codePta}}-{{suivi?.activite?.nom}} </span>
                  <!--  <span v-else class="font-bold" >0 FCFA</span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.annee}} </span>
                  <!--  <span v-else class="font-bold" >0 FCFA</span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.trimestre}} </span>
                  <!--  <span v-else class="font-bold" >0 FCFA</span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.periode.budjet | formatNumber}} </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.periode.consommer | formatNumber}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.periode.disponible | formatNumber}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.periode.pourcentage}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>

                <!-- periode-->



                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.exercice.budjet | formatNumber}} </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.exercice.consommer | formatNumber}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.exercice.disponible | formatNumber}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.exercice.pourcentage}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <!-- exercice-->

                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.cumul.budjet | formatNumber}} </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.cumul.consommer | formatNumber}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.cumul.disponible | formatNumber}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
                <td class="p-2 whitespace-nowrap border dark:bg-gray-800 dark:border-gray-700">
                  <span  class="font-bold"> {{suivi.cumul.pourcentage}}
                  </span>
                  <!--  <span v-else class="font-bold" >0 FCFA </span> -->
                </td>
               
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
    <LoaderSnipper v-if="isLoadingData" />
  </div>

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} un Suivi Financier</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Consommé" v-model="payload.consommer" />
          <div class="">
            <label class="form-label">Sources</label>
            <TomSelect v-model="payload.type" :options="{ placeholder: 'Selectionez une source' }" class="w-full">
              <option  value="0">Pret</option>
              <option  value="1">Budget National</option>
            </TomSelect>
          </div>
          <!-- <pre>{{years}}</pre> -->
          <div class="">
            <label class="form-label">Année</label>
            <TomSelect v-model="payload.annee" @change="handleInput()" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option v-for="(year, index) in years" :key="index" :value="year.nom">{{ year.nom }}</option>
            </TomSelect>
          </div>
          
          <div class="">
            <label class="form-label">Activités</label>
            <TomSelect v-model="payload.activiteId" :options="{ placeholder: 'Selectionez une unité de mesure' }" class="w-full">
              <option v-for="(unite, index) in activites" :key="index" :value="unite.id">{{ unite.nom }}</option>
            </TomSelect>
          </div>
          <div class="">
            <label class="form-label">Trimestre</label>
            <TomSelect v-model="payload.trimestre" :options="{ placeholder: 'Selectionez une source' }" class="w-full">
              <option  value="0">Trimestre 1</option>
              <option  value="1">Trimestre 2</option>
              <option  value="1">Trimestre 3</option>
              <option  value="1">Trimestre 4</option>
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
        <div class="mt-2 text-slate-500">Supprimer cette Suivi Financier?</div>
      </div>
      <div class="flex justify-center w-full gap-3 py-4 text-center">
        <button type="button" @click="cancelSelect" class="mr-1 btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>
  <!-- End Modal -->
</template>
