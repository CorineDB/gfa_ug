<template>
  <div class="flex flex-col items-center mt-8 mb-4 intro-y sm:flex-row">
    <h2 class="mr-auto text-lg font-medium">Liste des projets</h2>
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
  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Ajouter un Site</h2>
    </ModalHeader>
    <form @submit.prevent="createData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Nom" v-model="payloadSites.nom" class="col-span-12" />
          <!-- <InputForm label="Longitude" type="number" step="any" v-model="payloadSites.longitude" class="col-span-12" />
          <div v-if="errors.longitude" class="mt-2 text-danger">{{ getFieldErrors(errors.longitude) }}</div>

          <InputForm label="Latitude" type="number" step="any" v-model.number="payloadSites.latitude" class="col-span-12" />
          <div v-if="errors.latitude" class="mt-2 text-danger">{{ getFieldErrors(errors.latitude) }}</div> -->

          <!-- Coordonnées avec bouton pour ouvrir la carte -->
          <div class="grid grid-cols-2 gap-4 col-span-12">
            <div>
              <InputForm label="Longitude" type="number" step="any" v-model="payloadSites.longitude" />
              <div v-if="errors.longitude" class="mt-2 text-danger">{{ getFieldErrors(errors.longitude) }}</div>
            </div>
            <div>
              <InputForm label="Latitude" type="number" step="any" v-model.number="payloadSites.latitude" />
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
            <button type="button" @click="centerMapOnCoordinates" class="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300" :disabled="!payloadSites.latitude || !payloadSites.longitude">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Centrer sur coordonnées
            </button>
          </div>

          <div class="col-span-12">
            <label class="form-label">Pays<span class="text-danger">*</span> </label>
            <select v-model="payloadSites.pays" @change="changeCountry" class="form-select w-full">
              <option value="">Selectionez un pays</option>
              <option v-for="(country, index) in pays" :key="index" :value="country">{{ country }}</option>
            </select>
            <div v-if="errors.pays" class="mt-2 text-danger">{{ getFieldErrors(errors.pays) }}</div>
          </div>

          <div v-if="isBenin" class="col-span-12">
            <div class="w-full mb-4">
              <label class="form-label">Départements<span class="text-danger">*</span> </label>
              <select v-model="payloadSites.departement" @change="updateCommunes" class="form-select w-full">
                <option value="">Selectionez un département</option>
                <option v-for="(dep, index) in departements" :key="index" :value="dep.lib_dep">{{ dep.lib_dep }}</option>
              </select>
              <div v-if="errors.departement" class="mt-2 text-danger">{{ getFieldErrors(errors.departement) }}</div>
            </div>

            <div class="mb-4" :class="[!showCommune ? '' : 'opacity-50 cursor-not-allowed pointer-events-none']">
              <label class="form-label">Communes<span class="text-danger">*</span> </label>
              <select v-model="payloadSites.commune" @change="updateArrondissements" class="form-select w-full">
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
              <select v-model="payloadSites.arrondissement" @change="updateQuartiers" class="form-select w-full">
                <option value="">Selectionez arrondissement</option>
                <option v-for="(arrond, index) in filteredArrondissements" :key="index" :value="arrond.lib_arrond">{{ arrond.lib_arrond }}</option>
              </select>
              <div v-if="errors.arrondissement" class="mt-2 text-danger">{{ getFieldErrors(errors.arrondissement) }}</div>
            </div>

            <div class="w-full mb-4" :class="[!showQuatier ? '' : 'opacity-50 cursor-not-allowed pointer-events-none']">
              <label class="form-label">Quartier<span class="text-danger">*</span> </label>
              <select v-model="payloadSites.quartier" class="form-select w-full">
                <option value="">Sélectionner le quartier</option>
                <option v-for="quart in filteredQuartiers" :key="quart.lib_quart" :value="quart.lib_quart">
                  {{ quart.lib_quart }}
                </option>
              </select>
              <div v-if="errors.quartier" class="mt-2 text-danger">{{ getFieldErrors(errors.quartier) }}</div>
            </div>
          </div>

          <!-- <div class="col-span-12">
            <label class="form-label">Pays<span class="text-danger">*</span> </label>
            <TomSelect v-model="payloadSites.pays" @change="changeCountry" :options="{ placeholder: 'Selectionez  un pays' }" class="w-full">
              <option value=""></option>
              <option v-for="(country, index) in pays" :key="index" :value="country">{{ country }}</option>
            </TomSelect>
            <div v-if="errors.pays" class="mt-2 text-danger">{{ getFieldErrors(errors.pays) }}</div>
          </div>
          <div v-if="isBenin" class="col-span-12">
            <div class="w-full mb-4">
              <label class="form-label">Départements<span class="text-danger">*</span> </label>
              <TomSelect v-model="payloadSites.departement" @change="updateCommunes" :options="{ placeholder: 'Selectionez un département' }" class="w-full">
                <option value=""></option>
                <option v-for="(dep, index) in departements" :key="index" :value="dep.lib_dep">{{ dep.lib_dep }}</option>
              </TomSelect>
              <div v-if="errors.departement" class="mt-2 text-danger">{{ getFieldErrors(errors.departement) }}</div>
            </div>
            <div class="mb-4" :class="[!showCommune ? '' : 'opacity-50 cursor-not-allowed pointer-events-none']">
              <label class="form-label">Communes<span class="text-danger">*</span> </label>
              <TomSelect v-model="payloadSites.commune" :options="{ placeholder: 'Sélectionner la commune' }" class="w-full" @change="updateArrondissements">
                <option v-for="commune in filteredCommunes" :key="commune.lib_com" :value="commune.lib_com">
                  {{ commune.lib_com }}
                </option>
              </TomSelect>
              <div v-if="errors.commune" class="mt-2 text-danger">{{ getFieldErrors(errors.commune) }}</div>
            </div>
          </div>

          <div v-if="isBenin" class="col-span-12">
            <div class="w-full mb-4" :class="[!showArrondissement ? '' : 'opacity-50 cursor-not-allowed pointer-events-none']">
              <label class="form-label">Arrondissemnt<span class="text-danger">*</span> </label>
              <TomSelect v-model="payloadSites.arrondissement" @change="updateQuartiers" :options="{ placeholder: 'Selectionez  arrondissement' }" class="w-full">
                <option v-for="(arrond, index) in filteredArrondissements" :key="index" :value="arrond.lib_arrond">{{ arrond.lib_arrond }}</option>
              </TomSelect>
              <div v-if="errors.arrondissement" class="mt-2 text-danger">{{ getFieldErrors(errors.arrondissement) }}</div>
            </div>
            <div class="w-full mb-4" :class="[!showQuatier ? '' : 'opacity-50 cursor-not-allowed pointer-events-none']">
              <label class="form-label">Quartier<span class="text-danger">*</span> </label>
              <TomSelect v-model="payloadSites.quartier" :options="{ placeholder: 'Sélectionner le quatier' }" class="w-full">
                <option v-for="quart in filteredQuartiers" :key="quart.lib_quart" :value="quart.lib_quart">
                  {{ quart.lib_quart }}
                </option>
              </TomSelect>
              <div v-if="errors.quartier" class="mt-2 text-danger">{{ getFieldErrors(errors.quartier) }}</div>
            </div>
          </div> -->

          <div v-if="!isBenin" class="col-span-12">
            <InputForm :required="false" :optionel="false" label="Département" v-model="payloadSites.departement" :control="getFieldErrors(errors.departement)" class="mb-4" />
            <InputForm :required="false" :optionel="false" label="Commune" v-model="payloadSites.commune" :control="getFieldErrors(errors.commune)" class="mb-4" />
            <InputForm :required="false" :optionel="false" label="Arrondissement" v-model="payloadSites.arrondissement" :control="getFieldErrors(errors.arrondissement)" class="mb-4" />
            <InputForm :required="false" :optionel="false" label="Quartier" v-model="payloadSites.quartier" :control="getFieldErrors(errors.quartier)" class="mb-4" />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetFormSite" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoadingSite" label="Ajouter" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- End Modal -->
  <Modal size="modal-xl" backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!isUpdate" class="mr-auto text-base font-medium">Ajouter un projet</h2>
      <h2 v-else class="mr-auto text-base font-medium">Modifier un projet</h2>
    </ModalHeader>

    <form @submit.prevent="sendForm">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <InputForm v-model="formData.nom" class="col-span-12 md:col-span-6 mt-4" type="text" :required="true" placeHolder="Nom du projet" label="Nom" />
        <InputForm v-model="formData.couleur" class="col-span-12 md:col-span-6 mt-4" type="color" :required="true" placeHolder="Couleur" label="Couleur" />

        <InputForm v-model="formData.debut" class="col-span-12 md:col-span-6 mt-4" type="date" :required="true" placeHolder="Entrer la date de début" label="Début du projet" />
        <InputForm v-model="formData.fin" class="col-span-12 md:col-span-6 mt-4" type="date" :required="true" placeHolder="Entrer la date de fin" label="Fin du projet" />

        <div class="col-span-12 md:col-span-6 mt-4">
          <!-- <pre>{{ formData.pays }}</pre> -->
          <label class="form-label">Pays*</label>
          <!-- Site Select Dropdown -->
          <div class="relative w-full">
            <v-select class="w-full" :reduce="(country) => country" v-model="formData.pays" :options="pays" placeholder="Selectionner un pays...">
              <template #search="{ attributes, events }">
                <input class="vs__search form-input" :required="!formData.pays" v-bind="attributes" v-on="events" placeholder="Rechercher un pays..." />
              </template>

              <!-- Selected value display -->
              <template #selected="option">
                {{ option.label }}
              </template>

              <!-- Custom option template -->
              <template #option="option">
                {{ option.label }}
              </template>
            </v-select>
          </div>
        </div>

        <!-- <div class="col-span-12 md:col-span-6 mt-4">
          <label class="form-label">Pays<span class="text-danger">*</span></label>
          <TomSelect v-model="formData.pays" :options="{ placeholder: 'Sélectionnez un pays' }" class="w-full">
            <option value=""></option>
            <option v-for="(country, index) in pays" :key="index" :value="country">{{ country }}</option>
          </TomSelect>
        </div> -->

        <InputForm v-model="formData.budgetNational" class="col-span-12 md:col-span-6 mt-4" type="number" :required="true" placeHolder="Ex : 100000" label="Fond Propre" />
        <InputForm v-model="formData.pret" class="col-span-12 md:col-span-6 mt-4" type="number" :required="true" placeHolder="Ex : 100000" label="Subvention" />

        <div class="col-span-12 md:col-span-6 mt-4">
          <label class="form-label">Organisation*</label>

          <!-- organisation Select Dropdown -->
          <div class="relative w-full">
            <v-select class="w-full" :reduce="(ong) => ong.id" v-model="formData.organisationId" label="nom" :options="ongs" placeholder="Selectionner une organisation..." multiple>
              <template v-if="!formData.organisationId || formData.organisationId.length === 0" #search="{ attributes, events }">
                <input class="vs__search form-input" :required="!formData.organisationId || formData.organisationId.length === 0" v-bind="attributes" v-on="events" placeholder="Rechercher une organisation..." />
              </template>

              <!-- Selected value display -->
              <template v-else #selected="{ nom }">
                {{ nom }}
              </template>
              <!-- Custom option template to show organization name -->
              <template #option="{ nom }">
                {{ nom }}
              </template>
            </v-select>
          </div>
        </div>

        <!-- <div class="col-span-12 md:col-span-6 mt-4">
          <label>Organisation*</label>
          <TomSelect
            v-model="formData.organisationId"
            :options="{ placeholder: 'Veuillez associer une organisation' }"
            class="w-full"
          >
            <option value="">Choisir une organisation</option>
            <option v-for="(org, index) in ongs" :key="index" :value="org.id">{{ org.nom }}</option>
          </TomSelect>
        </div> -->

        <div class="col-span-12 md:col-span-6 mt-4">
          <label class="form-label">Site*</label>

          <div class="flex w-full gap-2">
            <!-- Site Select Dropdown -->
            <div class="relative w-10/12">
              <v-select class="w-full" :reduce="(site) => site.id" v-model="sitesId" label="nom" :options="sites" placeholder="Selectionner un site..." multiple>
                <template #search="{ attributes, events }">
                  <input class="vs__search form-input" :required="!sitesId || sitesId.length === 0" v-bind="attributes" v-on="events" placeholder="Rechercher un site..." />
                </template>

                <!-- Selected value display -->
                <template #selected="{ nom }">
                  {{ nom }}
                </template>

                <!-- Custom option template to show organization name -->
                <template #option="{ nom }">
                  {{ nom }}
                </template>
              </v-select>
            </div>

            <!-- Add Button -->
            <button class="shadow-md btn btn-primary w-2/12 flex items-center justify-center" type="button" @click="showModalCreate = true" title="Add new organization">
              <PlusIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
        <!-- <div class="col-span-12 md:col-span-6 mt-4">
          <label>Sites*</label>
          <div class="mt-2 flex">
            <TomSelect
              v-model="sitesId"
              multiple
              :options="{ placeholder: 'Veuillez associer des sites' }"
              class="w-11/12 mr-2"
            >
              <option value="">Choisir un site</option>
              <option v-for="(site, index) in sites" :key="index" :value="site.id">{{ site.nom }}</option>
            </TomSelect>
            <button class="shadow-md btn btn-primary" type="button" @click="showModalCreate = true">
              <PlusIcon class="w-4 h-4 mr-3" />
            </button>
          </div>
        </div> -->

        <!-- Fichiers et images en plein largeur -->
        <div class="col-span-12 md:col-span-6 mt-4" v-if="!isUpdate">
          <label class="block my-3 font-bold text-gray-700">Images de couverture</label>
          <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" class="block w-full ..." />
          <div v-if="imagePreview" class="flex items-center mt-3">
            <img :src="imagePreview" alt="Prévisualisation" width="200" />
            <button type="button" class="ml-4 text-red-500" @click="clearFiles(index)">Supprimer</button>
          </div>
        </div>

        <div class="col-span-12 md:col-span-6 mt-4" v-if="!isUpdate">
          <label class="block my-3 font-bold text-gray-700">Pièces jointes</label>
          <input name="fichier" ref="fileInput2" type="file" multiple class="block w-full ..." @change="handleFileChange2" />
          <ul v-if="files.length > 0" class="mt-3 space-y-2">
            <li v-for="(file, index) in files" :key="index" class="flex justify-between bg-white p-2 shadow">
              <span>{{ file.name }}</span>
              <button type="button" class="text-red-500" @click="removeFile(index)">Supprimer</button>
            </li>
          </ul>
        </div>
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

  <!-- Modal Leaflet Maps  -->
  <Modal :show="showMapModal" @hidden="closeMapModal" size="xl">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Sélectionner la position sur la carte</h2>
    </ModalHeader>
    <ModalBody>
      <div class="mb-4">
        <p class="text-sm text-gray-600 mb-2">Cliquez sur la carte ou faites glisser le marqueur pour sélectionner la position.</p>
        <div class="flex gap-4 text-sm">
          <span><strong>Latitude:</strong> {{ payloadSites.latitude || "Non définie" }}</span>
          <span><strong>Longitude:</strong> {{ payloadSites.longitude || "Non définie" }}</span>
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

  <LoaderSnipper v-if="isLoadingProjets" />
  <NoRecordsMessage class="col-span-12" v-if="!paginatedAndFilteredData.length" title="Aucun projet trouvé" description="Il semble qu'il n'y ait pas de projet à afficher. Veuillez en créer un." />

  <div v-if="verifyPermission('voir-un-projet') && !isLoadingProjets" class="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
    <div href="#" class="relative transition-all duration-500 border-l-4 shadow-2xl box group _bg-white zoom-in border-primary hover:border-secondary" v-for="(item, index) in paginatedAndFilteredData" :key="index">
      <div class="relative m-5 bg-white">
        <div class="text-[#171a1d] group-hover:text-[#007580] font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[30px] pt-[10px]">{{ item.codePta }} - {{ item.nom }}</div>
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
          <LinkIcon class="w-4 h-4 mr-2" /> Fond propre: {{ item.budgetNational == null || item.budgetNational == 0 ? 0 : $h.formatCurrency(item.budgetNational) }}
          <div class="ml-2 italic font-bold">Fcfa</div>
        </div>
        <div class="flex items-center">
          <LinkIcon class="w-4 h-4 mr-2" /> Subvention: {{ item.pret == null || item.pret == 0 ? 0 : $h.formatCurrency(item.pret) }}
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
          <span class="p-1 pl-2 text-white bg-green-500 rounded-md shadow-md" v-else-if="item.statut == -1"> Pas démarré </span>
          <span class="p-1 pl-1 text-white bg-yellow-500 rounded-md shadow-md" v-else-if="item.statut == 0"> En cours </span>
          <span class="p-1 pl-1 text-white bg-red-500 rounded-md shadow-md" v-else-if="item.statut == 1"> En retard </span>
          <span class="pl-2" v-else-if="item.statut == 2">Terminé</span>
        </div>
      </div>

      <div class="flex items-center justify-between p-5 border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
        <a v-if="verifyPermission('voir-details-projet')" class="flex items-center mr-auto text-primary" href="javascript:;" @click="goToDetail(item)"> <EyeIcon class="w-4 h-4 mr-1" title="voir détail" /> <span class="hidden sm:block"> Détail </span> </a>
        <a v-if="verifyPermission('prolonger-un-projet')" class="flex items-center mr-auto text-primary" href="javascript:;" @click="ouvrirModalProlongerProjet(item)" title="Prolonger la date du projet"> <CalendarIcon class="w-4 h-4 mr-1" /><span class="hidden sm:block"> Étendre </span> </a>
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

  <pagination v-if="paginatedAndFilteredData.length > 0" class="col-span-12" :total-items="totalItems" :items-per-page="itemsPerPage" :is-loading="isLoadingProjets" @page-changed="onPageChanged" @items-per-page-changed="onItemsPerPageChanged">
    <!-- Slots personnalisés (facultatif) -->
    <template #prev-icon>
      <span>&laquo; Précédent</span>
    </template>
    <template #next-icon>
      <span>Suivant &raquo;</span>
    </template>
  </pagination>

  <div class="mt-5">
    <!-- <h3>An interactive leaflet map</h3> -->
    <div id="map" style="height: 70vh"></div>
  </div>
</template>

<script>
import NoRecordsMessage from "@/components/NoRecordsMessage.vue";
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
import contries from "@/pays.json";
import markerShadow from "./marker-shadow.png"; // ../../utils/helpers"
// import { getFieldErrors } from "../../../utils/helpers";
import decoupage from "@/decoupage_territorial_benin.json";

export default {
  components: { LoaderSnipper, NoRecordsMessage, InputForm, VButton, LMap, LTileLayer, LMarker, LPolygon, LPopup, pagination },
  data() {
    return {
      markerLatLng: [6.3703, 2.3912],
      showMapModal: false,
      map: null,
      selectedDepartementData: "",
      departements: [],
      errors: {},
      pays: [],
      indexBenin: 1,
      isBenin: false,
      showModalCreate: false,
      payloadSites: this.getinitForm(),

      isLoadingSite: false,
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
        pret: 0,
        organisationId: "",
        nombreEmploie: 0,
        budgetNational: 0,
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
    filteredCommunes() {
      if (!this.payloadSites.departement) return [];
      this.selectedDepartementData = this.departements.find((dep) => dep.lib_dep === this.payloadSites.departement);
      return this.selectedDepartementData ? this.selectedDepartementData.communes : [];
    },
    filteredArrondissements() {
      if (!this.payloadSites.commune || !this.selectedDepartementData) return [];
      const communeData = this.selectedDepartementData.communes.find((com) => com.lib_com === this.payloadSites.commune);
      return communeData ? communeData.arrondissements : [];
    },
    filteredQuartiers() {
      if (!this.payloadSites.arrondissement) return [];
      const arrondissementData = this.filteredArrondissements.find((arrond) => arrond.lib_arrond === this.payloadSites.arrondissement);
      return arrondissementData ? arrondissementData.quartiers : [];
    },
    showCommune() {
      return !this.payloadSites.departement;
    },
    showArrondissement() {
      return !this.payloadSites.commune;
    },
    showQuatier() {
      return !this.payloadSites.arrondissement;
    },
  },

  methods: {
    getinitForm() {
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
    },

    onMapClick(event) {
      const { lat, lng } = event.latlng;
      this.updateCoordinates(lat, lng);
    },
    resetForm() {
      Object.assign(this.payloadSites, this.getinitForm());
      this.showModalCreate = false;
    },

    onMarkerDragEnd(event) {
      const { lat, lng } = event.target.getLatLng();
      this.updateCoordinates(lat, lng);
    },

    openMapModal() {
      this.showMapModal = true;
      // Initialiser la position du marker si des coordonnées existent
      if (this.payloadSites.latitude && this.payloadSites.longitude) {
        this.markerLatLng = [parseFloat(this.payloadSites.latitude), parseFloat(this.payloadSites.longitude)];
      }
    },

    closeMapModal() {
      this.showMapModal = false;
    },

    centerMapOnCoordinates() {
      if (!this.payloadSites.latitude || !this.payloadSites.longitude) return;

      const lat = parseFloat(this.payloadSites.latitude);
      const lng = parseFloat(this.payloadSites.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      this.markerLatLng = [lat, lng];
      // Le centrage se fera automatiquement via la réactivité de Vue
    },
    updateCoordinates(lat, lng) {
      this.payloadSites.latitude = lat.toFixed(6);
      this.payloadSites.longitude = lng.toFixed(6);
      this.markerLatLng = [lat, lng];
    },
    getinitForm() {
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
    },
    resetPayload() {
      this.payloadSites = this.getinitForm;
    },
    verifyPermission,
    resetFormSite() {
      this.resetPayload();
      this.errors = {};
      this.showModalCreate = false;
    },
    getFieldErrors(errors) {
      if (!errors || !Array.isArray(errors)) return "";
      return errors.join(", ");
    },
    updateQuartiers() {
      this.payloadSites.quartier = "";
    },
    updateArrondissements() {
      this.payloadSites.arrondissement = "";
      this.payloadSites.quartier = "";
    },
    updateCommunes() {
      this.payloadSites.commune = "";
      this.payloadSites.arrondissement = "";
      this.payloadSites.quartier = "";
    },
    changeCountry() {
      if (this.payloadSites.pays === "Bénin") {
        this.indexBenin = -1;
        this.isBenin = true;
        this.updateCommunes();
      } else {
        this.indexBenin++;
        if (this.indexBenin == 0) {
          this.payloadSites.quartier = "";
          this.payloadSites.arrondissement = "";
          this.payloadSites.commune = "";
          this.payloadSites.departement = "";
        }
        this.isBenin = false;
      }
    },

    async createData() {
      this.payloadSites.longitude = this.payloadSites.longitude + "";
      this.payloadSites.latitude = this.payloadSites.latitude + "";

      if (this.payloadSites.longitude.includes(",")) {
        this.payloadSites.longitude = this.payloadSites.longitude.replace(",", ".");
      }

      if (this.payloadSites.latitude.includes(",")) {
        this.payloadSites.latitude = this.payloadSites.latitude.replace(",", ".");
      }

      this.isLoadingSite = true;
      await SiteService.create(this.payloadSites)
        .then(() => {
          this.isLoadingSite = false;
          this.fetchSites();
          this.resetFormSite();
          toast.success("Sites créer.");
        })
        .catch((e) => {
          this.isLoadingSite = false;
          console.error(e);
          toast.error("Vérifier les informations et ressayer.");
        });
    },
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
      this.$router.push({ name: "Détails Projets", params: { id: projet.id, projet: projet } });
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

          this.ongs = datas.filter((ong) => ong.type !== "autre_osc");

          console.log("this.ongs", this.ongs);
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
      this.$router.push({ name: "OutComes" });
    },

    active() {
      this.$store.dispatch("active");
    },
    disabled() {
      this.$store.dispatch("disabled");
    },
    fetchProjets() {
      console.log("ok");
      this.active();

      this.isLoadingProjets = true;

      ProjetService.get()
        .then((data) => {
          this.isLoadingProjets = false;
          const datas = data.data.data;

          console.log(datas);
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
        this.$router.push({ name: "Détails Projets", params: { id: projet.id, projet: projet } });
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
      console.log(this.sites);
      console.log(this.ongs);
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
      this.formData.nombreEmploie = 0;
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

            if (errors.response && errors.response.data && Object.keys(errors.response.data.errors).length > 0) {
              this.messageErreur = errors.response.data.errors;
              toast.error("Une erreur s'est produite dans votre formulaire");
            } else {
              toast.error(errors.response.data.message);
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
            if (error.response && error.response.data && Object.keys(error.response.data.errors).length > 0) {
              this.messageErreur = error.response.data.errors;
              toast.error("Une erreur s'est produite dans votre formulaire");
            } else {
              toast.error(error.response.data.message);
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
    initializeMap() {
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
        zoomAnimation: false,
        fadeAnimation: true,
        markerZoomAnimation: true,
      }).setView([6.3561, 2.39182], 10);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 100,
        attribution: "",
      }).addTo(this.initialMap);

      // Ajouter des marqueurs individuels
      // L.marker([6.3561, 2.39182], { icon: this.myIcon }).bindPopup(`GFA Redevabilite`).addTo(this.initialMap);
    },
  },
  beforeMount() {
    this.pays = Object.values(contries);
    console.log(this.pays);
    this.departements = decoupage;
  },
  mounted() {
    this.initializeMap();
    this.fetchSites(); // Wait for sites to load

    // Initialiser Dropzone après le montage du composant
    //  this.initializeDropzone();
    this.fetchOngs();
  },

  watch: {
    sites: function (sites) {
      this.sites.forEach((site, index) => {
        const latitude = parseFloat(site.latitude);
        const longitude = parseFloat(site.longitude);

        // On filtre les projets qui ont un nom non vide
        const projetsAvecNom = site.projets.filter((project) => project.nom && project.nom.trim() !== "");

        // Si aucun projet avec nom, ne pas ajouter ce marqueur
        if (projetsAvecNom.length === 0) return;

        L.marker([latitude, longitude], { icon: this.myIcon })
          .bindPopup(
            `
        <b>${site.nom}</b><br>
        Commune: ${site.commune}<br>
        Département: ${site.departement}<br>
        <b>Projects:</b><br>
        <ul>
          ${projetsAvecNom.map((project) => `<li>${project.nom}</li>`).join("")}
        </ul>
      `
          )
          .addTo(this.initialMap);
      });
      /*
      // Créer un groupe de marqueurs

      // Initialize marker cluster group with clustering disabled
      const markers = L.markerClusterGroup();

      // Ajouter des marqueurs à partir de `addressPoints`
      this.sites.forEach((site, index) => {
        const each_marker = L.marker([parseFloat(site.latitude), parseFloat(site.longitude)], { icon: this.myIcon }).bindPopup(`
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

        // Add marker directly to the map
        //each_marker.addTo(this.initialMap);

        markers.addLayer(each_marker);

      });

      this.initialMap.addLayer(markers);*/
    },
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
      // this.$router.push("/401-non-autorise");
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
