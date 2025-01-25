<template>
  <div class="flex flex-col items-center mt-8 mb-4 intro-y sm:flex-row">
    <h2 class="mr-auto text-lg font-medium">Liste des projets</h2>
  </div>

  <div>
    <h3>An interactive leaflet map</h3>
    <div id="map" style="height: 50vh"></div>
  </div>
  <div class="flex flex-col items-center justify-between mt-8 mb-4 intro-y sm:flex-row">
    <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
      <div class="relative w-56 text-slate-500">
        <input type="text" v-model="search" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
        <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
      </div>
    </div>
    <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
      <button v-if="verifyPermission('creer-un-projet')" class="mr-2 shadow-md btn btn-primary" @click="addProjet()">Ajouter un projet</button>
    </div>
  </div>
  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!isUpdate" class="mr-auto text-base font-medium">Ajouter un projet</h2>
      <h2 v-else class="mr-auto text-base font-medium">Modifier un projet</h2>
    </ModalHeader>

    <form @submit.prevent="sendForm">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <InputForm v-model="formData.nom" class="col-span-12" type="text" :required="true" placeHolder="Nom du projet" label="Nom" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.nom">{{ $h.extractContentFromArray(messageErreur.nom) }}</p>

        <InputForm v-model="formData.couleur" class="col-span-12" type="color" :required="true" placeHolder="Couleur" label="Couleur" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.couleur">{{ $h.extractContentFromArray(messageErreur.couleur) }}</p>

        <InputForm v-model="formData.debut" class="col-span-12" type="date" :required="true" placeHolder="Entrer la date de début" label="Début du projet" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.debut">{{ $h.extractContentFromArray(messageErreur.debut) }}</p>

        <InputForm v-model="formData.fin" class="col-span-12" type="date" :required="true" placeHolder="Entrer la date de fin" label="Fin du projet" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.fin">{{ $h.extractContentFromArray(messageErreur.fin) }}</p>

        <InputForm v-model="formData.nombreEmploie" class="col-span-12" type="number" placeHolder="Ex : 10" label="Nombre d'employé" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.nombreEmploie">{{ $h.extractContentFromArray(messageErreur.nombreEmploie) }}</p>

        <InputForm v-model="formData.pays" class="col-span-12" type="text" placeHolder="Ex : Bénin" label="Pays" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.pays">{{ $h.extractContentFromArray(messageErreur.pays) }}</p>

        <InputForm v-model="formData.budgetNational" class="col-span-12" type="text" :required="true" placeHolder="Ex : 100000" label="Fond Propre" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.budgetNational">{{ $h.extractContentFromArray(messageErreur.budgetNational) }}</p>

        <InputForm v-model="formData.pret" class="col-span-12" type="text" :required="true" placeHolder="Ex : 100000" label="Montant financé" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.pret">{{ $h.extractContentFromArray(messageErreur.pret) }}</p>

        <div class="col-span-12" v-if="!isUpdate">
          <label class="block my-3 font-bold text-gray-700">Images de couverture</label>
          <input type="file" ref="fileInput" @change="handleFileChange" placeHolder="choisir une image" accept="image/*" class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <div class="col-span-12 flex items-center justify-start" v-if="imagePreview">
            <div class="mr-3">
              <h3 class="block my-3 font-bold">Prévisualisation de l'image :</h3>
              <img :src="imagePreview" alt="Prévisualisation" width="200" />
            </div>
            <button type="button" class="text-red-500 hover:text-red-700 font-semibold text-sm" @click="clearFiles(index)">Supprimer</button>
          </div>
        </div>
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.image">{{ $h.extractContentFromArray(messageErreur.image) }}</p>

        <!-- <div class="col-span-12" v-if="!isUpdate">
          <label class="block my-3 font-bold">Pièces jointes</label>
          <input name="fichier" class="col-span-12" placeHolder="choisir un fichier ou plusieurs" type="file" multiple @change="handleFileChange2" />
          <InputForm class="col-span-12" type="file" @change="handleFileChange2" placeHolder="choisir un fichier ou plusieurs" label="Pièces jointes" multiple />
          <div class="col-span-12">
            <ul v-if="files.length > 1">
              <li v-for="(file, index) in files" :key="index">
                {{ file.name }}
              </li>
            </ul>
          </div>
        </div> -->
        <div class="col-span-12" v-if="!isUpdate">
          <label class="block my-3 font-bold text-gray-700">Pièces jointes</label>
          <input name="fichier" ref="fileInput2" class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Choisir un fichier ou plusieurs" type="file" multiple @change="handleFileChange2" />
          <div class="col-span-12 mt-4">
            <ul v-if="files.length > 0" class="bg-gray-100 rounded-lg shadow-md p-4 space-y-2">
              <li v-for="(file, index) in files" :key="index" class="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                <span class="text-gray-700 font-medium">{{ file.name }}</span>
                <button type="button" class="text-red-500 hover:text-red-700 font-semibold text-sm" @click="removeFile(index)">Supprimer</button>
              </li>
            </ul>
          </div>
        </div>
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.fichier">{{ $h.extractContentFromArray(messageErreur.fichier) }}</p>

        <div class="col-span-12">
          <label>Organisation*</label>
          <div class="mt-2">
            <TomSelect
              v-model="formData.organisationId"
              :options="{
                placeholder: 'Veuillez associé une organisation au programme',
              }"
              class="w-full"
            >
              <option value="">Choisir une organisation</option>
              <option v-for="(org, index) in ongs" :key="index" :value="org.id">{{ org.nom }}</option>
            </TomSelect>
          </div>
        </div>
        <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.organisationId">{{ $h.extractContentFromArray(messageErreur.organisationId) }}</p>

        <div class="col-span-12">
          <label>Sites*</label>
          <div class="mt-2">
            <TomSelect
              v-model="sitesId"
              multiple
              :options="{
                placeholder: 'Veuillez associé des sites',
              }"
              class="w-full"
            >
              <option value="">Choisir un site</option>

              <option v-for="(site, index) in sites" :key="index" :value="site.id">{{ site.nom }}</option>
            </TomSelect>
          </div>
        </div>
        <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.sites">{{ $h.extractContentFromArray(messageErreur.sites) }}</p>

        <!-- Choix de fichier -->
        <!-- <div class="relative col-span-12">
        <label for="modal-form-1" class="font-medium form-label">Fichier(s)</label>
        <div ref="dropzoneElement" class="dropzone z-50 min-h-[200px] w-full"></div>
      </div> -->
      </ModalBody>
      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="showModal = false" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" :label="title" :loading="isLoading" :type="submit" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <Modal backdrop="static" :show="prolongerModal" @hidden="prolongerModal = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Prolonger la date du projet</h2>
    </ModalHeader>

    <form @submit.prevent="prolongerProjet">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <InputForm v-model="dateFin" :min="dateFinOld" class="col-span-12" type="date" :required="true" placeHolder="Entrer la nouvelle date de fin" label="Nouvelle Fin du projet*" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurProlongation !== null">{{ erreurProlongation }}</p>
      </ModalBody>
      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="prolongerModal = false" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" label="Prolonger" :loading="loadingProlonger" :type="submit" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <Modal :show="deleteModal" @hidden="deleteModal = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Etes vous sûr?</div>
        <div class="mt-2 text-slate-500">Voulez vous supprimer le projet ? <br />Cette action ne peut être annulé</div>
      </div>
      <div class="flex gap-2 px-5 pb-8 text-center">
        <button type="button" @click="deleteModal = false" class="w-full my-3 mr-1 btn btn-outline-secondary">Annuler</button>
        <VButton :loading="isLoading" label="Supprimer" @click="deleteProjets" />
      </div>
    </ModalBody>
  </Modal>
  <LoaderSnipper v-if="isLoadingProjets" />
  <div v-if="verifyPermission('voir-un-projet') && !isLoadingProjets" class="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
    <div href="#" class="relative transition-all duration-500 border-l-4 shadow-2xl box group _bg-white zoom-in border-primary hover:border-secondary" v-for="(item, index) in paginatedAndFilteredData" :key="index">
      <div class="relative m-5 bg-white">
        <div class="text-[#171a1d] group-hover:text-[#007580] font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[30px] pt-[10px]">{{ item.nom }}</div>
      </div>

      <div class="relative mt-[12px] m-5 h-40 2xl:h-56 image-fit rounded-md overflow-hidden before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
        <div class="absolute top-0 left-0 w-1/2 h-0 group-hover:h-full bg-[#02008052] transition-all duration-[.5s]"></div>
        <div class="absolute bottom-0 right-0 w-1/2 h-0 group-hover:h-full bg-[#02008052] transition-all duration-[.5s]"></div>

        <div class="relative h-64 overflow-hidden group/hw hway hway-active">
          <img class="object-contain group-hover:opacity-30 transition-all duration-[.5s] h-auto" :src="item.image == null ? projetsImg[0] : item.image.url" alt="" />
          <!-- Description cachée avec effet de survol -->
          <div class="absolute inset-0 flex items-start justify-center p-5 text-white transition-opacity duration-500 bg-black opacity-0 bg-opacity-80 group-hover:opacity-100">
            <div>
              <p class="text-base font-bold lg:text-lg">Description du projet</p>
              <p class="px-2 text-sm lg:text-base line-clamp-7">{{ item.description }} {{ item.key }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="m-5 text-slate-600 dark:text-slate-500">
        <div class="flex items-center">
          <LinkIcon class="w-4 h-4 mr-2" /> Fond propre: {{ $h.formatCurrency(item.budgetNational) }}
          <div class="ml-2 italic font-bold">Fcfa</div>
        </div>
        <div class="flex items-center">
          <LinkIcon class="w-4 h-4 mr-2" /> Montant financé: {{ $h.formatCurrency(item.pret == null ? 0 : item.pret) }}
          <div class="ml-2 italic font-bold">Fcfa</div>
        </div>
        <div v-if="item.owner !== null" class="flex items-center">
          <GlobeIcon class="w-4 h-4 mr-2" /> Organisation:
          <span class="p-1 pl-2 text-white bg-green-400 rounded-md shadow-md">{{ item.owner.user.nom }}</span>
        </div>
        <div class="flex items-center mt-2">
          <ClockIcon class="w-4 h-4 mr-2" />
          <div>
            Date : Du <span class="pr-1 font-bold"> {{ $h.reformatDate(item.debut) }}</span> au <span class="font-bold"> {{ $h.reformatDate(item.fin) }}</span>
          </div>
        </div>
        <div class="flex items-center mt-2">
          <CheckSquareIcon class="w-4 h-4 mr-2" /> Statut :
          <span class="p-1 pl-2 text-white bg-black rounded-md shadow-md" v-if="item.statut == -2"> Non validé </span>
          <span class="p-1 pl-2 text-white bg-green-500 rounded-md shadow-md" v-else-if="item.statut == -1"> Validé </span>
          <span class="p-1 pl-1 text-white bg-yellow-500 rounded-md shadow-md" v-else-if="item.statut == 0"> En cours </span>
          <span class="p-1 pl-1 text-white bg-red-500 rounded-md shadow-md" v-else-if="item.statut == 1"> En retard </span>
          <span class="pl-2" v-else-if="item.statut == 2">Terminé</span>
        </div>
      </div>

      <div class="flex items-center justify-between p-5 border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
        <a v-if="verifyPermission('voir-details-projet')" class="flex items-center mr-auto text-primary" href="javascript:;" @click="goToDetail(item)"> <EyeIcon class="w-4 h-4 mr-1" title="voir détail" /> <span class="hidden sm:block"> Détail </span></a>
        <a v-if="verifyPermission('prolonger-un-projet')" class="flex items-center mr-auto text-primary" href="javascript:;" @click="ouvrirModalProlongerProjet(item)" title="Prolonger la date du projet"> <CalendarIcon class="w-4 h-4 mr-1" /><span class="hidden sm:block"> Étendre </span></a>
        <a v-if="verifyPermission('modifier-un-projet')" class="flex items-center mr-auto" href="javascript:;" @click="modifierProjet(item)"> <CheckSquareIcon class="w-4 h-4 mr-1" title="modifier le projet" /><span class="hidden sm:block"> Modifier </span> </a>
        <a v-if="verifyPermission('supprimer-un-projet')" class="flex items-center text-danger mr-auto" href="javascript:;" @click="supprimerProjet(item)"> <Trash2Icon class="w-4 h-4 mr-1" title="supprimer le projet" /><span class="hidden sm:block"> Supprimer </span> </a>
      </div>

      <div class="absolute bottom-0 flex w-full">
        <div class="w-1/3 p-1 bg-green-500"></div>
        <div class="flex flex-col w-2/3">
          <div class="p-0.5 bg-yellow-500"></div>
          <div class="p-0.5 bg-red-500"></div>
        </div>
      </div>
    </div>

    <!-- <pagination totalItems="30" itemsPerPage="10" :isLoading="false" /> -->
  </div>

  <pagination class="col-span-12" :total-items="totalItems" :items-per-page="itemsPerPage" :is-loading="isLoadingProjets" @page-changed="onPageChanged" @items-per-page-changed="onItemsPerPageChanged">
    <!-- Slots personnalisés (facultatif) -->
    <template #prev-icon>
      <span>&laquo; Précédent</span>
    </template>
    <template #next-icon>
      <span>Suivant &raquo;</span>
    </template>
  </pagination>
</template>

<script>
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import ProgrammeService from "@/services/modules/programme.service.js";
import ProjetService from "@/services/modules/projet.service.js";
import BailleurService from "@/services/modules/bailleur.service";
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import { API_BASE_URL } from "@/services/configs/environment.js";
import { extractFormData } from "@/utils/index";
import InputForm from "@/components/news/InputForm.vue";
import VButton from "@/components/news/VButton.vue";
import pagination from "@/components/news/pagination.vue";
import OngService from "@/services/modules/ong.service.js";
import SiteService from "@/services/modules/site.service.js";
import { helper as $h } from "@/utils/helper";
import { toast } from "vue3-toastify";
import verifyPermission from "@/utils/verifyPermission";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { LMap, LTileLayer, LMarker, LPolygon, LPopup } from "@vue-leaflet/vue-leaflet";

import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { addressPoints } from "./markerDemo";
import icon from "./icon.png";
import markerShadow from "./marker-shadow.png";

export default {
  components: { LoaderSnipper, InputForm, VButton, LMap, LTileLayer, LMarker, LPolygon, LPopup, pagination },
  data() {
    return {
      search: "",
      isLoadingProjets: false,
      itemsPerPage: 3, // Nombre d'éléments par page
      totalItems: null,
      currentPage: 1, // Page courante
      messageErreur: {},
      messageNom: "",
      messageCouleur: "",
      messageDebut: "",
      messageFin: "",
      messageNbreEmploye: "",
      messagePays: "",
      messageFondPropre: "",
      messageMontantFinance: "",
      messageImage: "",
      messageOrganisation: "",
      messageSite: "",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 8,
      center: [47.31322, -1.319482],
      polygon: {
        latlngs: [
          [47.2263299, -1.6222],
          [47.21024000000001, -1.6270065],
          [47.1969447, -1.6136169],
          [47.18527929999999, -1.6143036],
          [47.1794457, -1.6098404],
          [47.1775788, -1.5985107],
          [47.1676598, -1.5753365],
          [47.1593731, -1.5521622],
          [47.1593731, -1.5319061],
          [47.1722111, -1.5143967],
          [47.1960115, -1.4841843],
          [47.2095404, -1.4848709],
          [47.2291277, -1.4683914],
          [47.2533687, -1.5116501],
          [47.2577961, -1.5531921],
          [47.26828069, -1.5621185],
          [47.2657179, -1.589241],
          [47.2589612, -1.6204834],
          [47.237287, -1.6266632],
          [47.2263299, -1.6222],
        ],
        color: "green",
      },
      zoom: 2,
      initialMap: null,
      myIcon: null,
      //markerLatLng: [47.31322, -1.319482],
      markerLatLng: [0, 0],

      savedInput: [],
      base_url: API_BASE_URL,
      showModal: false,
      showSearch: false,
      line: false,
      dates: { fin: "" },
      isUpdate: false,
      submitText: "Enregistrer",
      cols: 1,
      mosaique: true,
      programmeId: this.currentUser?.programme?.id,
      showProlonger: false,
      chargement: false,
      projetId: "",
      title: "",
      search: "",
      projetAttributs: ["nom", "description", "debut", "fin", "objectifGlobaux", "budgetNational", "pret", "couleur", "ville", "bailleurId", "tauxEngagement"],
      projetAttributsUpdate: ["nom", "description", "debut", "fin", "objectifGlobaux", "budgetNational", "pret", "couleur", "ville", "tauxEngagement"],
      champs: [],
      champsUpdate: [],
      option: [
        { name: "supprimer" },
        { name: "modifier" },
        { name: "prolonger" },
        /*  { name: "continuer" }, */
      ],
      optionUpdate: [
        { name: "modifier" },
        /*  { name: "continuer" }, */
      ],
      optionD: [
        { name: "supprimer" },
        /*  { name: "continuer" }, */
      ],
      projetId: "",
      projetVisible: false,
      projetAdd: false,
      projetDelete: false,
      projetUpdate: false,
      dashboardProjetVisible: false,
      bailleurVisible: false,
      validation: false,
      sendRequest: false,
      fichiers: [],
      image: {},
      projets: [],
      bailleurs: [],
      deleteData: {},
      deleteModal: false,

      projetsImg: ["https://images.unsplash.com/photo-1473649085228-583485e6e4d7?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1516047001178-6dcd2a01c694?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://media.istockphoto.com/id/474234518/photo/clean-fresh-water-scarcity-symbol-black-girl-drinking-from-tap.jpg?s=1024x1024&w=is&k=20&c=Ae42yqkuqfOxBV1bedpkGtC1w2ifQqBB77Sl46nNDNQ=", "https://images.unsplash.com/flagged/photo-1555251255-e9a095d6eb9d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1728158609567-42dc418139f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TkdPJTIwYmxhY2t8ZW58MHx8MHx8fDA%3D"],
      formData: {
        nom: "",
        couleur: "",
        debut: "",
        fin: "",
        pays: "",
        pret: "",

        organisationId: "",
        nombreEmploie: Number,
        budgetNational: Number,
      },
      sitesId: [],
      dropzoneMultipleRef: null,
      FormProjet: new FormData(),
      isLoading: false,
      ongs: [],
      sites: [],
      selectedFile: null, // Pour stocker le fichier sélectionné
      selectedFile2: null,
      imagePreview: null,
      update: false, // Pour afficher la prévisualisation de l'imag
      files: [],
      dateFin: "",
      dateFinOld: "",
      prolongerModal: false,
      loadingProlonger: false,
      erreurProlongation: null,
    };
  },

  computed: {
    //importation des variables du module auths
    ...mapState({
      identifiant: (state) => state.auths.identifiant,
      projet: (state) => state.projets.projet,
      loading: (state) => state.loading,
      errors: (state) => state.errors,
    }),

    ...mapGetters({
      projet: "getProjet",
      //bailleurs: "bailleurs/getBailleurs",
      currentUser: "auths/GET_AUTHENTICATE_USER",
    }),
    paginatedAndFilteredData() {
      const { paginatedData, totalFilteredItems } = $h.filterData({
        itemsPerPage: this.itemsPerPage,
        search: this.search,
        data: this.projets,
        currentPage: this.currentPage,
        keys: ["nom"],
      });

      // Mettre à jour le total pour recalculer la pagination
      this.totalItems = totalFilteredItems;

      return paginatedData;
    },
  },

  methods: {
    removeFile(index) {
      // Supprime le fichier à l'index donné
      console.log("this.selectedFile2", this.selectedFile2);
      //  delete this.selectedFile2[index];
      this.selectedFile2.splice(index, 1);
      this.files.splice(index, 1);
      // Réinitialise l'input file pour éviter les conflits
      const dataTransfer = new DataTransfer();

      this.selectedFile2.forEach((file) => dataTransfer.items.add(file));
      this.$refs.fileInput2.files = dataTransfer.files;
    },
    clearFiles() {
      this.$refs.fileInput.value = ""; // Réinitialise l'input file
      this.selectedFiles = null; // Réinitialise les fichiers dans le data
      this.imagePreview = null;
    },
    goToDetail(projet) {
      console.log(projet);
      this.$router.push({ name: "projets_id_details", params: { id: projet.id, projet: projet } });
    },
    verifyPermission,
    resetFileInput() {
      // Réinitialiser le champ de fichier
      this.selectedFile = null; // Réinitialiser la variable selectedFile
      this.imagePreview = null; // Réinitialiser la prévisualisation
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;

        // Créer une prévisualisation de l'image
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file); // Lire le fichier en tant qu'URL de données
      }
    },
    handleFileChange2(event) {
      // Réinitialiser les fichiers précédents
      this.files = [];
      this.FormProjet = new FormData();

      // Récupérer les fichiers sélectionnés
      // this.selectedFile2 = event.target.files;
      this.selectedFile2 = Array.from(event.target.files);

      console.log("this.selectedFile2", this.selectedFile2);

      for (const file of this.selectedFile2) {
        this.files.push(file);
      }
    },
    ajouterFormNormalDansFormData() {
      for (let key in this.formNormal) {
        if (this.formNormal.hasOwnProperty(key)) {
          this.formData.append(key, this.formNormal[key]);
        }
      }
    },
    fetchOngs() {
      // this.active();

      OngService.get()
        .then((data) => {
          const datas = data.data.data;
          this.ongs = datas;

          // this.disabled();
        })
        .catch((error) => {
          // this.disabled();
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            // this.$toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
          }
        });
    },
    fetchSites() {
      // this.active();

      SiteService.get()
        .then((data) => {
          const datas = data.data.data;
          this.sites = datas;

          // this.disabled();
        })
        .catch((error) => {
          // this.disabled();
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            // this.$toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
          }
        });
    },
    initializeDropzone() {
      const dropzoneElement = this.$refs.dropzoneElement;

      // Initialisation explicite de Dropzone
      this.dropzoneInstance = new Dropzone(dropzoneElement, {
        url: "https://httpbin.org/post",
        thumbnailWidth: 150,
        maxFilesize: 1000,
        addRemoveLinks: true,
        dictDefaultMessage: "Déposez les fichiers ici pour les télécharger",
        dictFallbackMessage: "Votre navigateur ne prend pas en charge les téléchargements de fichiers par glisser-déposer.",
        dictCancelUpload: "Annuler chargement",
        dictUploadCanceled: "Chargement Annulé.",
        dictCancelUploadConfirmation: "Êtes-vous sûr de vouloir annuler ce téléchargement ?",
        dictRemoveFile: "Supprimer le fichier",
        dictMaxFilesExceeded: "Vous ne pouvez plus charger de fichiers.",
        headers: { "My-Awesome-Header": "header value" },
      });
      var dropzoneRef = null;
      // Gestion des événements de Dropzone après initialisation
      this.dropzoneInstance.on("addedfile", (file) => {
        var myDropzone = this;
        dropzoneRef = myDropzone;

        const reader = new FileReader();
        reader.onload = (event) => {
          const binaryData = event.target.result;
          return binaryData;
        };
        reader.readAsBinaryString(file);
        // this.FormProjet.append("fichier[]", file);

        // this.FormProjet.forEach((value, key) => {
        //   console.log(`${key}: ${value}`);
        // });
      });
      this.dropzoneMultipleRef = dropzoneRef;
      console.log(this.dropzoneMultipleRef);
    },
    getFile(data) {
      this.champs[7].data = data;
      for (const property in data) {
        this.fichiers.push(data[property]);
      }
      this.fichiers.pop();
      this.fichiers.pop();
    },
    getImage(data) {
      this.champs[6].data = data;
      this.image = data;
    },
    getPermission() {
      this.currentUser.role[0].permissions.forEach((element) => {
        if (element.slug === "voir-un-projet") {
          this.projetVisible = true;
        }
        if (element.slug === "creer-un-projet") {
          this.projetAdd = true;
        }
        if (element.slug === "modifier-un-projet") {
          this.projetUpdate = true;
        }
        if (element.slug === "supprimer-un-projet") {
          this.projetDelete = true;
        }
        if (element.slug === "voir-details-projet") {
          this.dashboardProjetVisible = true;
        }
        if (element.slug === "voir-un-bailleur") {
          this.bailleurVisible = true;
        }
        if (element.slug === "validation") {
          this.validation = true;
        }
      });
    },
    prolonger(projet) {
      this.projetId = projet.id;
      this.showProlonger = true;
    },
    gotoNext(projet, index) {
      const profondeurProjet = {
        isClick: true,
        position: index,
        id: projet.id,
      };

      localStorage.setItem("profondeurProjet", JSON.stringify(profondeurProjet));
      this.$router.push({ name: "dashboard_projets_composantes_globale" });
    },

    active() {
      this.$store.dispatch("active");
    },
    disabled() {
      this.$store.dispatch("disabled");
    },
    fetchProjets() {
      this.active();

      this.isLoadingProjets = true;

      ProjetService.get()
        .then((data) => {
          this.isLoadingProjets = false;
          const datas = data.data.data;
          this.projets = datas;
          //   this.disabled();
        })
        .catch((error) => {
          this.isLoadingProjets = false;
          this.disabled();
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            this.$toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
          }
        });
    },
    onPageChanged(newPage) {
      this.currentPage = newPage;
      console.log("Page actuelle :", this.currentPage);
      // Charger les données pour la page actuelle
      // this.loadDataForPage(newPage);
    },
    onItemsPerPageChanged(itemsPerPage) {
      this.itemsPerPage = itemsPerPage;
    },

    loadDataForPage(page) {
      // Logique pour charger les données correspondantes à la page
      console.log(`Charger les données pour la page ${page}`);
    },

    //Charger les fonctions de communication avec le serveur
    ...mapMutations({
      setErrors: "SET_ERRORS_MESSAGE", // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setProjet: "projets/FILL", // map `this.CREATE_INSTANCE_PROJET()` to `this.$store.commit('CREATE_INSTANCE_PROJET')`
    }),

    ...mapActions("projets", {
      saveProjet: "STORE_PROJET",
      prolongerDateProjet: "PROLONGER_DATE_PROJET",
      updateProjet: "UPDATE_PROJET",
      deleteProjet: "DESTROY_PROJET",
    }),

    // ...mapActions('bailleurs', { fetchBailleurs: 'FETCH_LIST_BAILLEUR_OF_PROGRAMME' }),

    ouvrirModalProlongerProjet(item) {
      console.log("item", item);

      this.dateFinOld = item.fin;
      this.projetId = item.id;
      this.prolongerModal = true;

      console.log("this.dateFinOld", this.dateFinOld);
    },
    prolongerProjet() {
      this.loadingProlonger = true;

      console.log("this.dateFin", this.dateFin);

      let payLoad = {
        fin: this.dateFin,
      };
      this.prolongerDateProjet({ projet: payLoad, id: this.projetId })
        .then((response) => {
          if (response.status == 200 || response.status == 201) {
            this.prolongerModal = false;

            this.dateFin = "";
            this.dateFinOld = "";

            toast.success("Prolongation éffectuée avec succès");

            this.fetchProjets(this.programmeId);
          }
        })
        .catch((error) => {
          this.loadingProlonger = false;

          toast.error("Une erreur s'est produite");

          // Mettre à jour les messages d'erreurs dynamiquement
          if (error.response && error.response.data && error.response.data.errors) {
            this.erreurProlongation = error.response.data.errors;
          } else {
            toast.error(error.response.data.errors.message);
          }
        });
    },

    gotoDetails(projet) {
      if (this.dashboardProjetVisible) {
        this.$router.push({ name: "projets_id_details", params: { id: projet.id, projet: projet } });
      }
    },

    addDate() {
      this.dates.push({});
    },

    close() {
      this.showCloseModal();
      this.resetForm();
      this.sendRequest = false;
    },
    close2() {
      this.showCloseModal();
      this.sendRequest = false;
      this.savedInput = [];
      for (let i = 0; i < this.champs.length; i++) {
        this.savedInput.push(this.champs[i].data);
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem("formData", parsed);
    },

    showCloseModal(value = false) {
      this.showModal = value;
    },

    addProjet() {
      this.messageErreur = {};
      $h.clearObjectValues(this.formData);
      this.formData.organisationId = "";
      this.title = "Ajouter";
      // this.submitText = "Enregistrer";:
      this.isUpdate = false;
      this.showCloseModal(true);
      //alert("ok");
    },

    modifierProjet(projet) {
      console.log("projet", projet);
      this.messageErreur = {};
      this.formData = {};
      console.log(projet);
      this.isUpdate = true;
      this.title = "Modifier";
      this.showModal = true;
      // this.submitText = "Modifier";

      this.projetId = projet.id;

      this.formData.nom = projet.nom;
      this.formData.couleur = projet.couleur;
      this.formData.debut = projet.debut;
      this.formData.fin = projet.fin;
      this.formData.pays = projet.pays;
      this.formData.pret = projet.pret;
      this.sitesId = projet.sites.map((site) => site.id);
      this.formData.sites = this.sitesId;
      this.formData.organisationId = projet.owner.id;
      this.formData.nombreEmploie = projet.nombreEmploie;
      this.formData.budgetNational = projet.budgetNational;

      // if (projet.sites.length > 0)
      //   projet.sites.forEach((item) => {
      //     this.formData.push(item);
      //   });

      console.log("this.formData", this.formData);

      this.showCloseModal(true);
    },

    supprimerProjet(projet, index) {
      this.deleteModal = true;
      this.deleteData.data = projet;
      this.deleteData.index = index;
    },

    deleteProjets(data) {
      // this.filteredProjet.splice(data.index, 1);
      // this.deleteModal = false;
      this.isLoading = true;
      console.log(this.deleteData.data.id);
      ProjetService.destroy(this.deleteData.data.id)
        .then((data) => {
          this.isLoading = false;
          this.deleteModal = false;
          toast.success("Operation effectué avec success !");
          this.fetchProjets();
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
          toast.error("Echecde l'opération");
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            this.$toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
          }
        });
    },

    saveProlongerDate() {
      this.chargement = true;

      this.prolongerDateProjet({ projet: this.dates, id: this.projetId })
        .then((response) => {
          if (response.status == 200 || response.status == 201) {
            this.showProlonger = false;

            this.fetchProjets();
          }
        })
        .catch((error) => {
          alert(error.response?.data?.errors["fin"]);
        });

      this.chargement = false;
    },

    dupliquer() {
      this.title = "Dupliquer projet existant";
      this.showModal = true;
    },

    resetForm() {
      this.champs = this.champs.map((item) => {
        item.data = "";
        return item;
      });

      window.document.getElementById("vform").reset();

      this.setProjet({});
    },

    sendForm() {
      if (this.isUpdate) {
        this.isLoading = true;
        this.formData.sites = this.sitesId;
        // projet.statut = projet.statut;
        this.updateProjet({ projet: this.formData, id: this.projetId })
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.isLoading = false;

              this.fetchProjets();
              toast.success("Modification éffectuée avec succès");
              this.showModal = false;
            }
          })
          .catch((errors) => {
            this.isLoading = false;
            console.log(errors);

            if (errors.response && errors.response.data && errors.response.data.errors) {
              this.messageErreur = errors.response.data.errors;
              toast.error("Une erreur s'est produite dans votre formulaire");
            } else {
              toast.error(errors.message);
            }
          });
      } else {
        if (this.formData.couleur == "") {
          this.formData.couleur = "#000000";
        }
        for (const key of Array.from(this.FormProjet.keys())) {
          this.FormProjet.delete(key);
        }

        this.FormProjet = new FormData();

        $h.ajouterObjetDansFormData(this.formData, this.FormProjet);

        if (this.selectedFile) {
          this.FormProjet.append("image", this.selectedFile);
        }
        if (this.selectedFile2) {
          Object.keys(this.selectedFile2).forEach((key) => {
            const file = this.selectedFile2[key];
            this.FormProjet.append(`fichier[${key}]`, file);
          });
        }

        // Ajouter manuellement le tableau `sites` à FormData
        if (this.sitesId && Array.isArray(this.sitesId)) {
          this.sitesId.forEach((site, index) => {
            this.FormProjet.append(`sites[${index}]`, site);
          });
        }

        this.isLoading = true;
        this.saveProjet(this.FormProjet)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.isLoading = false;
              this.showModal = false;

              this.resetFileInput();
              $h.clearFormData(this.FormProjet);
              $h.clearObjectValues(this.formData);
              this.messageErreur = {};

              toast.success("Ajout éffectuée avec succès");

              console.log(this.programmeId);
              this.fetchProjets(this.programmeId);
            }
          })
          .catch((error) => {
            console.log(error);
            this.isLoading = false;
            this.FormProjet = new FormData();

            // Mettre à jour les messages d'erreurs dynamiquement
            if (error.response && error.response.data && error.response.data.errors) {
              this.messageErreur = error.response.data.errors;
              toast.error("Une erreur s'est produite dans votre formulaire");
            } else {
              toast.error(error.message);
            }
          });
      }
    },

    validerProjet(id) {
      let projet = {};
      projet.statut = -1;
      this.updateProjet({ projet: projet, id: id })
        .then((response) => {
          if (response.status == 200 || response.status == 201) {
            this.$toast.success("projet valider");
            this.fetchProjets();
          }
        })
        .catch((error) => {
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            this.$toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
            //console.log('dernier message', error.message);
          }
        });
    },
    fetchBailleurs(programme) {
      BailleurService.bailleursOfProgramme(programme)
        .then((data) => {
          const datas = data.data.data;
          this.bailleurs = datas;
          this.champs = [
            { name: "Nom du projet", key: "nom", type: "text", placeholdere: "Nom du projet", isSelect: false, isTextArea: false, data: "", required: true, title: "renseigner le nom du projet", errors: [] },
            { name: "Prêt", type: "number", key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Budget Nationnal", key: "budgetNational", type: "number", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Date début", key: "debut", type: "date", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true },
            { name: "Date fin", type: "date", key: "fin", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Couleur", type: "color", key: "couleur", placeholdere: "Choississez une couleur", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "couverture du projet", type: "file", placeholdere: "Choississez une couverture", isImage: true, isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Pièce jointe", type: "file", placeholdere: "televerser des fichiers", isSelect: false, isImage: false, isTextArea: false, data: "", required: false, errors: [] },
            { name: "Ville", key: "ville", type: "", placeholdere: "Selectionnez une ville", isSelect: true, isTextArea: false, data: "", required: true, options: ["cotonou", "calavi", "bohicon"], isSimpleTable: true, errors: [] },
            { name: "Bailleur", key: "bailleurId", type: "", placeholdere: "Selectionnez un bailleur", isSelect: true, isTextArea: false, data: "", required: true, options: datas, cle: "id", value: "sigle", errors: [] },
            { name: "Objectifs globaux", key: "objectifGlobaux", type: "", placeholdere: "", isSelect: false, isTextArea: true, data: "", required: false, errors: [] },
            { name: "Objectifs specifiques", key: "objectifSpecifique", type: "text", placeholdere: "Definir les objectifs", isSelect: false, isTextArea: false, data: "", required: false, errors: [] },
            { name: "Taux engagement", key: "tauxEngagement", type: "text", placeholdere: "Taux engagement", isSelect: false, isTextArea: false, data: "", required: false, errors: [] },
            { name: "Description", type: "", key: "description", placeholdere: "Description du projet", isSelect: false, isTextArea: true, data: "", required: false, errors: [] },
          ];
          this.champsUpdate = [
            { name: "Nom du projet", key: "nom", type: "text", placeholdere: "Nom du projet", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Prêt", type: "text", key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Budget Nationnal", key: "budgetNational", type: "text", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Date début", key: "debut", type: "date", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true },
            { name: "Date fin", type: "date", key: "fin", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Couleur", type: "color", key: "couleur", placeholdere: "Choississez une couleur", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
            { name: "Ville", key: "ville", type: "", placeholdere: "Selectionnez une ville", isSelect: true, isTextArea: false, data: "", required: true, options: ["cotonou", "calavi", "bohicon"], isSimpleTable: true, errors: [] },
            { name: "Objectifs globaux", key: "objectifGlobaux", type: "", placeholdere: "", isSelect: false, isTextArea: true, data: "", required: false, errors: [] },
            { name: "Objectif specifique", key: "objectifSpecifique", type: "text", placeholdere: "Definir les objectifs", isSelect: false, isTextArea: false, data: "", required: false, errors: [] },
            { name: "Taux engagement", key: "tauxEngagement", type: "text", placeholdere: "Taux engagement", isSelect: false, isTextArea: false, data: "", required: false, errors: [] },
            { name: "Description", type: "", key: "description", placeholdere: "Description du projet", isSelect: false, isTextArea: true, data: "", required: false, errors: [] },
          ];
        })
        .catch((error) => {});
    },
  },
  mounted() {
    this.fetchSites();
    // Initialiser la carte lorsque le composant est monté
    // Configurer l'icône
    this.myIcon = L.icon({
      iconUrl: icon,
      iconSize: [30, 30],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
      shadowUrl: markerShadow,
      shadowSize: [60, 30],
      shadowAnchor: [22, 94],
    });

    // Initialiser la carte
    this.initialMap = L.map("map", {
      zoomControl: true,
      zoom: 1,
      zoomAnimation: false,
      fadeAnimation: true,
      markerZoomAnimation: true,
    }).setView([6.8041, 2.4152], 6);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.initialMap);

    // Ajouter des marqueurs individuels
    L.marker([6.3752, 2.8349], { icon: this.myIcon }).addTo(this.initialMap);

    // Créer un groupe de marqueurs
    const markers = L.markerClusterGroup();

    console.log(this.sites);
    // Ajouter des marqueurs à partir de `addressPoints`
    this.sites.forEach((site, index) => {
      const each_marker = new L.marker([parseInt(site.latitude), parseInt(site.longitude)], { icon: this.myIcon }).bindPopup(`
        <b>${site.nom}</b><br>
        Arrondissement: ${site.arrondissement}<br>
        Commune: ${site.commune}<br>
        Département: ${site.departement}<br>
        <b>Projects:</b><br>
        <ul>
          ${site.projets
            .map((project) => `<li>${project.nom}</li>`)
            .join("")}
        </ul>
      `);
      markers.addLayer(each_marker);
    });

    this.initialMap.addLayer(markers);

    // Initialiser Dropzone après le montage du composant
    //  this.initializeDropzone();
    this.fetchOngs();
  },

  watch: {
    loading: function (value) {
      //this.loading = value
    },

    errors: function (errors) {
      this.champs.forEach((value) => {
        value.errors = errors[value.key];
      });
    },
  },

  created() {
    this.getPermission();
    if (!this.projetVisible) {
      this.$router.push("/401-non-autorise");
    }
    this.programmeId = this.currentUser.programme.id;
    if (this.programmeId) {
      if (this.bailleurVisible) {
        this.fetchBailleurs();
        this.fetchProjets();
      } else {
        this.fetchProjets();
      }
    }
  },
};
</script>

<style scoped>
.icon-bold {
  font-weight: 800;
}
.dropdown-content {
  transform: translate(200px, 200px);
}
.custom_height {
  height: 288px;
}

.block_img {
  height: 208px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
