<script setup>
import { computed, onMounted, onBeforeMount, reactive, ref, nextTick } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import SiteService from "@/services/modules/site.service";
import TypeGouvernance from "@/services/modules/typeGouvernance.service";
import SimpleTable from "@/components/SimpleTable.vue";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import contries from "@/pays.json";
import decoupage from "@/decoupage_territorial_benin.json";
// 1. Remplacer les imports au début du fichier
import { LMap, LTileLayer, LMarker, LPolygon, LPopup } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

// 2. Remplacer les variables Google Maps par celles de Leaflet
const map = ref(null);
const showMapModal = ref(false);
const markerLatLng = ref([6.3703, 2.3912]); // [lat, lng] format pour Leaflet

// 3. Remplacer les fonctions Google Maps
const updateCoordinates = (lat, lng) => {
  payload.latitude = lat.toFixed(6);
  payload.longitude = lng.toFixed(6);
  markerLatLng.value = [lat, lng];
};

const onMapClick = (event) => {
  const { lat, lng } = event.latlng;
  updateCoordinates(lat, lng);
};

const onMarkerDragEnd = (event) => {
  const { lat, lng } = event.target.getLatLng();
  updateCoordinates(lat, lng);
};

const openMapModal = () => {
  showMapModal.value = true;
  // Initialiser la position du marker si des coordonnées existent
  if (payload.latitude && payload.longitude) {
    markerLatLng.value = [parseFloat(payload.latitude), parseFloat(payload.longitude)];
  }
};

const closeMapModal = () => {
  showMapModal.value = false;
};

const centerMapOnCoordinates = () => {
  if (!payload.latitude || !payload.longitude) return;

  const lat = parseFloat(payload.latitude);
  const lng = parseFloat(payload.longitude);

  if (isNaN(lat) || isNaN(lng)) return;

  markerLatLng.value = [lat, lng];
  // Le centrage se fera automatiquement via la réactivité de Vue
};

onBeforeMount(() => {
  pays.value = Object.values(contries);
  departements.value = decoupage;
});

const getinitForm = () => {
  return {
    nom: "",
    longitude: "",
    latitude: "",
    arrondissement: "",
    commune: "",
    departement: "",
    pays: "",
    quartier: "",
  };
};

const selectedDepartementData = ref("");
const departements = ref([]);
const errors = ref({});
const pays = ref([]);
const indexBenin = ref(1);
const isBenin = ref(false);

// Google Maps variables

const mapContainer = ref(null);
const marker = ref(null);

const payload = reactive({
  nom: "",
  longitude: "",
  latitude: "",
  arrondissement: "",
  commune: "",
  departement: "",
  pays: "",
  quartier: "",
});

const getFieldErrors = function (errors) {
  if (!errors || !Array.isArray(errors)) return "";
  return errors.join(", ");
};

const updateQuartiers = function () {
  payload.quartier = "";
};
const updateArrondissements = function () {
  payload.arrondissement = "";
  payload.quartier = "";
};

const updateCommunes = function () {
  payload.commune = "";
  payload.arrondissement = "";
  payload.quartier = "";
};
const changeCountry = function () {
  if (payload.pays === "Bénin") {
    indexBenin.value = -1;
    isBenin.value = true;
    updateCommunes();
  } else {
    indexBenin.value++;
    if (indexBenin.value == 0) {
      payload.quartier = "";
      payload.arrondissement = "";
      payload.commune = "";
      payload.departement = "";
    }
    isBenin.value = false;
  }
};

const filteredCommunes = computed(() => {
  if (!payload.departement) return [];

  selectedDepartementData.value = departements.value.find((dep) => dep.lib_dep === payload.departement);
  return selectedDepartementData.value ? selectedDepartementData.value.communes : [];
});

const filteredArrondissements = computed(() => {
  if (!payload.commune || !selectedDepartementData.value) return [];
  const communeData = selectedDepartementData.value.communes.find((com) => com.lib_com === payload.commune);
  return communeData ? communeData.arrondissements : [];
});

const filteredQuartiers = computed(() => {
  if (!payload.arrondissement) return [];
  const arrondissementData = filteredArrondissements.value.find((arrond) => arrond.lib_arrond === payload.arrondissement);
  return arrondissementData ? arrondissementData.quartiers : [];
});

const showCommune = computed(() => {
  return !payload.departement;
});

const showArrondissement = computed(() => {
  return !payload.commune;
});

const showQuatier = computed(() => {
  return !payload.arrondissement;
});

// const tabulator = ref(); // Remplacé par SimpleTable
const idSelect = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const programmes = ref([]);
const datas = ref([]);

const createData = async () => {
  isLoading.value = true;
  errors.value = {}; // Reset errors

  await SiteService.create(payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Site créé avec succès.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);

      // Gestion des erreurs de validation (422)
      if (e.response && e.response.status === 422) {
        const errorData = e.response.data;

        // Structure: { data: { errors: { field: ["message"] } } } ou { errors: { field: ["message"] } }
        if (errorData.data && errorData.data.errors) {
          errors.value = errorData.data.errors;
        } else if (errorData.errors) {
          errors.value = errorData.errors;
        }

        toast.error(errorData.data?.message || errorData.message || "Erreur de validation du formulaire");
      } else {
        toast.error("Vérifier les informations et ressayer.");
      }
    });
};

const allPosition = ref([]);

const nomPositions = ref([]);

async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "TonNomOuApp/1.0", // recommandé par Nominatim
    },
  });
  const data = await response.json();
  return data.display_name;
}

async function fetchAllAdresses(sites) {
  const results = await Promise.allSettled(
    sites.map(async (site) => {
      try {
        const address = await reverseGeocode(site.lat, site.lon);
        isLoadingData.value = false;
        return { ...site, address };
      } catch (e) {
        return { ...site, address: "Erreur ou non trouvé" };
        isLoadingData.value = false;
      }
    })
  );

  nomPositions.value = results.map((result) => result.value || result.reason);

  datas.value.forEach((item) => {
    item.adresse = nomPositions.value.find((pos) => pos.lat === parseFloat(item.latitude) && pos.lon === parseFloat(item.longitude))?.address || "Adresse non trouvée";
  });

  // initTabulator(); // Remplacé par SimpleTable

  console.log(datas.value);

  return datas.value;
}

const getDatas = async () => {
  isLoadingData.value = true;
  await SiteService.get()
    .then((result) => {
      datas.value = result.data.data;
      isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste des type des options.");
    });
};

const updateData = async () => {
  isLoading.value = true;
  errors.value = {}; // Reset errors

  await SiteService.update(idSelect.value, payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Site modifié avec succès.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);

      // Gestion des erreurs de validation (422)
      if (e.response && e.response.status === 422) {
        const errorData = e.response.data;

        // Structure: { data: { errors: { field: ["message"] } } } ou { errors: { field: ["message"] } }
        if (errorData.data && errorData.data.errors) {
          errors.value = errorData.data.errors;
        } else if (errorData.errors) {
          errors.value = errorData.errors;
        }

        toast.error(errorData.data?.message || errorData.message || "Erreur de validation du formulaire");
      } else {
        toast.error("Vérifier les informations et ressayer.");
      }
    });
};

const submitData = () => (isCreate.value ? createData() : updateData());


const deleteData = async () => {
  isLoading.value = true;
  await SiteService.destroy(idSelect.value)
    .then(() => {
      deleteModalPreview.value = false;
      isLoading.value = false;
      toast.success("Sites supprimée");
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

// Fonction initTabulator supprimée - remplacée par SimpleTable

const handleEdit = (params) => {
  isCreate.value = false;
  idSelect.value = params.id;
  payload.nom = params.nom;
  payload.longitude = params.longitude;
  payload.latitude = params.latitude;
  payload.arrondissement = params.arrondissement || "";
  payload.commune = params.commune || "";
  payload.departement = params.departement || "";
  payload.pays = params.pays || "";
  payload.quartier = params.quartier || "";
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
  Object.assign(payload, getinitForm());
  errors.value = {}; // Réinitialiser les erreurs
  showModalCreate.value = false;
};

const openCreateModal = () => {
  Object.assign(payload, getinitForm());
  showModalCreate.value = isCreate.value = true;
};

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

onMounted(() => {
  getDatas();
  getProgrammes();
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Sites</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="openCreateModal"><PlusIcon class="w-4 h-4 mr-3" />Ajouter un Site</button>
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
    <!-- SimpleTable remplace Tabulator -->
    <div v-if="!isLoadingData" class="mt-5">
      <SimpleTable
        :data="datas"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
    <LoaderSnipper v-if="isLoadingData" />
  </div>

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} un Site</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <div class="col-span-12">
            <InputForm label="Nom" v-model="payload.nom" />
            <div v-if="errors.nom" class="mt-2 text-danger">{{ getFieldErrors(errors.nom) }}</div>
          </div>

          <!-- Coordonnées avec bouton pour ouvrir la carte -->
          <div class="grid grid-cols-2 gap-4 col-span-12">
            <div>
              <InputForm label="Longitude" type="number" step="any" v-model="payload.longitude" />
              <div v-if="errors.longitude" class="mt-2 text-danger">{{ getFieldErrors(errors.longitude) }}</div>
            </div>
            <div>
              <InputForm label="Latitude" type="number" step="any" v-model.number="payload.latitude" />
              <div v-if="errors.latitude" class="mt-2 text-danger">{{ getFieldErrors(errors.latitude) }}</div>
            </div>
          </div>

          <!-- Boutons pour la carte -->
          <div class="flex gap-2 col-span-12">
            <button type="button" @click="openMapModal" class="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Sélectionner sur la carte
            </button>
            <button type="button" @click="centerMapOnCoordinates" class="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300" :disabled="!payload.latitude || !payload.longitude">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Centrer sur coordonnées
            </button>
          </div>

          <div class="col-span-12">
            <label class="form-label">Pays<span class="text-danger">*</span> </label>
            <select v-model="payload.pays" @change="changeCountry" class="form-select w-full">
              <option value="">Selectionez un pays</option>
              <option v-for="(country, index) in pays" :key="index" :value="country">{{ country }}</option>
            </select>
            <div v-if="errors.pays" class="mt-2 text-danger">{{ getFieldErrors(errors.pays) }}</div>
          </div>

          <div v-if="isBenin" class="col-span-12">
            <div class="w-full mb-4">
              <label class="form-label">Départements<span class="text-danger">*</span> </label>
              <select v-model="payload.departement" @change="updateCommunes" class="form-select w-full">
                <option value="">Selectionez un département</option>
                <option v-for="(dep, index) in departements" :key="index" :value="dep.lib_dep">{{ dep.lib_dep }}</option>
              </select>
              <div v-if="errors.departement" class="mt-2 text-danger">{{ getFieldErrors(errors.departement) }}</div>
            </div>

            <div class="mb-4" :class="[!showCommune ? '' : 'opacity-50 cursor-not-allowed pointer-events-none']">
              <label class="form-label">Communes<span class="text-danger">*</span> </label>
              <select v-model="payload.commune" @change="updateArrondissements" class="form-select w-full">
                <option value="">Sélectionner la commune</option>
                <option v-for="commune in filteredCommunes" :key="commune.lib_com" :value="commune.lib_com">
                  {{ commune.lib_com }}
                </option>
              </select>
              <div v-if="errors.commune" class="mt-2 text-danger">{{ getFieldErrors(errors.commune) }}</div>
            </div>
          </div>

          <div v-if="isBenin" class="col-span-12">
            <div class="w-full mb-4" :class="[!showArrondissement ? '' : 'opacity-50 cursor-not-allowed pointer-events-none']">
              <label class="form-label">Arrondissement<span class="text-danger">*</span> </label>
              <select v-model="payload.arrondissement" @change="updateQuartiers" class="form-select w-full">
                <option value="">Selectionez arrondissement</option>
                <option v-for="(arrond, index) in filteredArrondissements" :key="index" :value="arrond.lib_arrond">{{ arrond.lib_arrond }}</option>
              </select>
              <div v-if="errors.arrondissement" class="mt-2 text-danger">{{ getFieldErrors(errors.arrondissement) }}</div>
            </div>

            <div class="w-full mb-4" :class="[!showQuatier ? '' : 'opacity-50 cursor-not-allowed pointer-events-none']">
              <label class="form-label">Quartier<span class="text-danger">*</span> </label>
              <select v-model="payload.quartier" class="form-select w-full">
                <option value="">Sélectionner le quartier</option>
                <option v-for="quart in filteredQuartiers" :key="quart.lib_quart" :value="quart.lib_quart">
                  {{ quart.lib_quart }}
                </option>
              </select>
              <div v-if="errors.quartier" class="mt-2 text-danger">{{ getFieldErrors(errors.quartier) }}</div>
            </div>
          </div>

          <div v-if="!isBenin" class="col-span-12">
            <InputForm :required="false" :optionel="false" label="Département" v-model="payload.departement" :control="getFieldErrors(errors.departement)" class="mb-4" />
            <InputForm :required="false" :optionel="false" label="Commune" v-model="payload.commune" :control="getFieldErrors(errors.commune)" class="mb-4" />
            <InputForm :required="false" :optionel="false" label="Arrondissement" v-model="payload.arrondissement" :control="getFieldErrors(errors.arrondissement)" class="mb-4" />
            <InputForm :required="false" :optionel="false" label="Quartier" v-model="payload.quartier" :control="getFieldErrors(errors.quartier)" class="mb-4" />
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

  <!-- Modal Leaflet Maps  -->
  <Modal :show="showMapModal" @hidden="closeMapModal" size="xl">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Sélectionner la position sur la carte</h2>
    </ModalHeader>
    <ModalBody>
      <div class="mb-4">
        <p class="text-sm text-gray-600 mb-2">Cliquez sur la carte ou faites glisser le marqueur pour sélectionner la position.</p>
        <div class="flex gap-4 text-sm">
          <span><strong>Latitude:</strong> {{ payload.latitude || "Non définie" }}</span>
          <span><strong>Longitude:</strong> {{ payload.longitude || "Non définie" }}</span>
        </div>
      </div>

      <!-- Carte Leaflet -->
      <div class="w-full h-96 rounded-lg border border-gray-300" style="min-height: 400px">
        <LMap ref="map" :zoom="13" :center="markerLatLng" @click="onMapClick" style="height: 100%; width: 100%">
          <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors' />
          <LMarker :lat-lng="markerLatLng" :draggable="true" @dragend="onMarkerDragEnd">
            <LPopup>
              <div>
                <p><strong>Position sélectionnée</strong></p>
                <p>Lat: {{ markerLatLng[0].toFixed(6) }}</p>
                <p>Lng: {{ markerLatLng[1].toFixed(6) }}</p>
              </div>
            </LPopup>
          </LMarker>
        </LMap>
      </div>
    </ModalBody>
    <ModalFooter>
      <div class="flex gap-2">
        <button type="button" @click="closeMapModal" class="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">Annuler</button>
        <button type="button" @click="closeMapModal" class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Confirmer la sélection</button>
      </div>
    </ModalFooter>
  </Modal>

  <!-- Modal Delete -->
  <Modal :show="deleteModalPreview" @hidden="deleteModalPreview = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Suppression</div>
        <div class="mt-2 text-slate-500">Supprimer cette Sites?</div>
      </div>
      <div class="flex justify-center w-full gap-3 py-4 text-center">
        <button type="button" @click="cancelSelect" class="mr-1 btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>
</template>
