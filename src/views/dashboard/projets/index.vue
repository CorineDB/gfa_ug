<template>
  <div class="flex flex-col items-center mt-8 mb-4 intro-y sm:flex-row">
    <h2 class="mr-auto text-lg font-medium">Liste des projets</h2>
  </div>

  <div class="flex flex-col items-center justify-between mt-8 mb-4 intro-y sm:flex-row">
    <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
      <div class="relative w-56 text-slate-500">
        <input id="recherche-projets" name="recherche-projets" type="text" v-model="search" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
        <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
      </div>
    </div>
    <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
      <button v-if="verifyPermission('creer-un-projet')" class="mr-2 shadow-md btn btn-primary" @click="addProjet()">Ajouter un projet</button>
    </div>
  </div>
  <!-- Modal Register & Update -->
  <Modal size="modal-xl" backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Ajouter des Sites</h2>
    </ModalHeader>

    <form @submit.prevent="createMultipleSites">
      <ModalBody>
        <div v-for="(site, index) in payloadsSitesMultiple" :key="site.id" class="p-4 mb-4 bg-gray-50 rounded-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-semibold text-gray-800">Site {{ index + 1 }}</h3>
            <button
              type="button"
              @click="removeSitePayload(index)"
              class="text-red-600 text-sm font-medium hover:text-red-800 flex items-center"
              v-if="payloadsSitesMultiple.length > 1"
            >
              <TrashIcon class="w-4 h-4 mr-1" /> Supprimer
            </button>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <div class="col-span-12">
              <InputForm :id="'sites.' + index + '.nom'" :name="'sites[' + index + '].nom'" label="Nom" v-model="site.nom" />
              <div v-if="errors[`sites.${index}.nom`]" class="mt-2 text-danger">{{ getFieldErrors(errors[`sites.${index}.nom`]) }}</div>
            </div>

            <!-- Coordonnées avec bouton pour ouvrir la carte -->
            <div class="grid grid-cols-2 gap-4 col-span-12">
              <div>
                <InputForm :id="'sites.' + index + '.longitude'" :name="'sites[' + index + '].longitude'" label="Longitude" type="number" step="any" v-model="site.longitude" />
                <div v-if="errors[`sites.${index}.longitude`]" class="mt-2 text-danger">{{ getFieldErrors(errors[`sites.${index}.longitude`]) }}</div>
              </div>
              <div>
                <InputForm :id="'sites.' + index + '.latitude'" :name="'sites[' + index + '].latitude'" label="Latitude" type="number" step="any" v-model.number="site.latitude" />
                <div v-if="errors[`sites.${index}.latitude`]" class="mt-2 text-danger">{{ getFieldErrors(errors[`sites.${index}.latitude`]) }}</div>
              </div>
            </div>

            <!-- Boutons pour la carte -->
            <div class="flex gap-2 col-span-12">
              <button type="button" @click="openMapModal(index)" class="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Sélectionner sur la carte
              </button>
            </div>

            <div class="col-span-12">
              <label class="form-label">Pays<span class="text-danger">*</span> </label>
              <select :id="'sites.' + index + '.pays'" :name="'sites[' + index + '].pays'" v-model="site.pays" @change="changeCountryForSite(index)" class="form-select w-full">
                <option value="">Sélectionnez un pays</option>
                <option v-for="(country, countryIndex) in pays" :key="countryIndex" :value="country">{{ country }}</option>
              </select>
              <div v-if="errors[`sites.${index}.pays`]" class="mt-2 text-danger">{{ getFieldErrors(errors[`sites.${index}.pays`]) }}</div>
            </div>

            <!-- Sélection en cascade pour le Bénin -->
            <div v-if="site.pays === 'Bénin'" class="col-span-12">
              <div class="w-full mb-4">
                <label class="form-label">Départements<span class="text-danger">*</span> </label>
                <select :id="'sites.' + index + '.departement'" :name="'sites[' + index + '].departement'" v-model="site.departement" @change="updateCommunesForSite(index)" class="form-select w-full">
                  <option value="">Sélectionnez un département</option>
                  <option v-for="(dep, depIndex) in departements" :key="depIndex" :value="dep.lib_dep">{{ dep.lib_dep }}</option>
                </select>
                <div v-if="errors[`sites.${index}.departement`]" class="mt-2 text-danger">{{ getFieldErrors(errors[`sites.${index}.departement`]) }}</div>
              </div>

              <div class="mb-4" :class="[!site.departement ? 'opacity-50 cursor-not-allowed pointer-events-none' : '']">
                <label class="form-label">Communes<span class="text-danger">*</span> </label>
                <select :id="'sites.' + index + '.commune'" :name="'sites[' + index + '].commune'" v-model="site.commune" @change="updateArrondissementsForSite(index)" class="form-select w-full">
                  <option value="">Sélectionner la commune</option>
                  <option v-for="commune in filteredCommunesForSite(index)" :key="commune.lib_com" :value="commune.lib_com">
                    {{ commune.lib_com }}
                  </option>
                </select>
                <div v-if="errors[`sites.${index}.commune`]" class="mt-2 text-danger">{{ getFieldErrors(errors[`sites.${index}.commune`]) }}</div>
              </div>

              <div class="w-full mb-4" :class="[!site.commune ? 'opacity-50 cursor-not-allowed pointer-events-none' : '']">
                <label class="form-label">Arrondissement<span class="text-danger">*</span> </label>
                <select :id="'sites.' + index + '.arrondissement'" :name="'sites[' + index + '].arrondissement'" v-model="site.arrondissement" @change="updateQuartiersForSite(index)" class="form-select w-full">
                  <option value="">Sélectionnez arrondissement</option>
                  <option v-for="(arrond, arrondIndex) in filteredArrondissementsForSite(index)" :key="arrondIndex" :value="arrond.lib_arrond">{{ arrond.lib_arrond }}</option>
                </select>
                <div v-if="errors[`sites.${index}.arrondissement`]" class="mt-2 text-danger">{{ getFieldErrors(errors[`sites.${index}.arrondissement`]) }}</div>
              </div>

              <div class="w-full mb-4" :class="[!site.arrondissement ? 'opacity-50 cursor-not-allowed pointer-events-none' : '']">
                <label class="form-label">Quartier<span class="text-danger">*</span> </label>
                <select :id="'sites.' + index + '.quartier'" :name="'sites[' + index + '].quartier'" v-model="site.quartier" class="form-select w-full">
                  <option value="">Sélectionner le quartier</option>
                  <option v-for="quart in filteredQuartiersForSite(index)" :key="quart.lib_quart" :value="quart.lib_quart">
                    {{ quart.lib_quart }}
                  </option>
                </select>
                <div v-if="errors[`sites.${index}.quartier`]" class="mt-2 text-danger">{{ getFieldErrors(errors[`sites.${index}.quartier`]) }}</div>
              </div>
            </div>

            <!-- Champs libres pour les autres pays -->
            <div v-if="site.pays !== 'Bénin' && site.pays !== ''" class="col-span-12">
              <InputForm :id="'sites.' + index + '.departement'" :name="'sites[' + index + '].departement'" :required="false" :optionel="false" label="Département" v-model="site.departement" class="mb-4" />
              <div v-if="errors[`sites.${index}.departement`]" class="mt-2 text-danger">{{ getFieldErrors(errors[`sites.${index}.departement`]) }}</div>

              <InputForm :id="'sites.' + index + '.commune'" :name="'sites[' + index + '].commune'" :required="false" :optionel="false" label="Commune" v-model="site.commune" class="mb-4" />
              <div v-if="errors[`sites.${index}.commune`]" class="mt-2 text-danger">{{ getFieldErrors(errors[`sites.${index}.commune`]) }}</div>

              <InputForm :id="'sites.' + index + '.arrondissement'" :name="'sites[' + index + '].arrondissement'" :required="false" :optionel="false" label="Arrondissement" v-model="site.arrondissement" class="mb-4" />
              <div v-if="errors[`sites.${index}.arrondissement`]" class="mt-2 text-danger">{{ getFieldErrors(errors[`sites.${index}.arrondissement`]) }}</div>

              <InputForm :id="'sites.' + index + '.quartier'" :name="'sites[' + index + '].quartier'" :required="false" :optionel="false" label="Quartier" v-model="site.quartier" class="mb-4" />
              <div v-if="errors[`sites.${index}.quartier`]" class="mt-2 text-danger">{{ getFieldErrors(errors[`sites.${index}.quartier`]) }}</div>
            </div>
          </div>
        </div>

        <!-- Bouton pour ajouter un nouveau site -->
        <div class="mt-4">
          <button type="button" @click="addSitePayload" class="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            <PlusIcon class="w-4 h-4 mr-2" />
            Ajouter un site
          </button>
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
        <div class="col-span-12 md:col-span-6">
          <InputForm :id="'formData.nom'" :name="'formData.nom'" v-model="formData.nom" class="w-full" type="text" :required="true" placeHolder="Entrer le nom du projet" label="Nom du projet" />
          <div v-if="errors.nom" class="mt-2 text-danger">{{ getFieldErrors(errors.nom) }}</div>
        </div>

        <div class="col-span-12 md:col-span-6">
          <InputForm :id="'formData.codePta'" :name="'formData.codePta'" v-model="formData.codePta" class="w-full" type="text" :required="true" placeHolder="Ex: PTA-001" label="Code PTA" />
          <div v-if="errors.codePta" class="mt-2 text-danger">{{ getFieldErrors(errors.codePta) }}</div>
        </div>

        <div class="col-span-12 md:col-span-6">
          <InputForm :id="'formData.debut'" :name="'formData.debut'" v-model="formData.debut" class="w-full" type="date" :required="true" placeHolder="Entrer la date de début" label="Début du projet" />
          <div v-if="errors.debut" class="mt-2 text-danger">{{ getFieldErrors(errors.debut) }}</div>
        </div>

        <div class="col-span-12 md:col-span-6">
          <InputForm :id="'formData.fin'" :name="'formData.fin'" v-model="formData.fin" class="w-full" type="date" :required="true" placeHolder="Entrer la date de fin" label="Fin du projet" />
          <div v-if="errors.fin" class="mt-2 text-danger">{{ getFieldErrors(errors.fin) }}</div>
        </div>

        <div class="col-span-12 md:col-span-6">
          <label class="form-label">Pays*</label>
          <!-- Site Select Dropdown -->
          <div class="relative w-full">
            <v-select :id="'formData.pays'" :name="'formData.pays'" class="w-full" :reduce="(country) => country" v-model="formData.pays" :options="pays" placeholder="Selectionner un pays...">
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
          <div v-if="errors.pays" class="mt-2 text-danger">{{ getFieldErrors(errors.pays) }}</div>
        </div>

        <div class="col-span-12 md:col-span-6">
          <InputForm :id="'formData.budgetNational'" :name="'formData.budgetNational'" v-model="formData.budgetNational" class="w-full" type="number" :required="true" placeHolder="Ex : 100000" label="Fond Propre" />
          <div v-if="errors.budgetNational" class="mt-2 text-danger">{{ getFieldErrors(errors.budgetNational) }}</div>
        </div>

        <div class="col-span-12 md:col-span-6">
          <InputForm :id="'formData.pret'" :name="'formData.pret'" v-model="formData.pret" class="w-full" type="number" :required="true" placeHolder="Ex : 100000" label="Subvention" />
          <div v-if="errors.pret" class="mt-2 text-danger">{{ getFieldErrors(errors.pret) }}</div>
        </div>

        <div class="col-span-12 md:col-span-6">
           
            <label class="form-label">Organisation* frere</label>
          <!-- Organisation Select Dropdown -->
          <div class="relative w-full">
            <div class="flex items-center justify-between mb-2">
              <!-- je veux afficher la liste des organisations du projet ici-->
          
              <v-select  v-if="!isUpdate"
                  :id="'formData.organisationId'" :name="'formData.organisationId'"
                  class="w-full mr-3" 
                  :reduce="(ong) => ong.id" 
                  v-model="formData.organisationId" 
                  label="nom" 
                  :options="ongs" 
                  placeholder="Selectionner une organisation..."
                  multiple
                >
                  <template v-if="!formData.organisationId || formData.organisationId.length === 0" #search="{ attributes, events }">
                    <input class="vs__search form-input" v-bind="attributes" v-on="events" placeholder="Rechercher une organisation..." />
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
              <v-select  v-else
                  :id="'formData.organisationId'" :name="'formData.organisationId'"
                  class="w-full mr-3" 
                  :reduce="(ong) => ong.id" 
                  v-model="formData.organisationId" 
                  label="nom" 
                  :options="allOrganisation" 
                  placeholder="Selectionner une organisation..."
                  multiple
                >
                  <template v-if="!formData.organisationId || formData.organisationId.length === 0" #search="{ attributes, events }">
                    <input class="vs__search form-input" v-bind="attributes" v-on="events" placeholder="Rechercher une organisation..." />
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
               
                <button 
                  type="button" 
                  @click="ouvrirModalAjoutOrganisation"
                  class="inline-flex items-center justify-center w-8 h-8 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                  title="Ajouter une nouvelle organisation"
                >
                  <span class="sr-only">Ajouter une organisation</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
            </div>
            <div v-if="errors.organisationId" class="mt-2 text-danger">{{ getFieldErrors(errors.organisationId) }}</div>
          </div>
        </div>

        <div class="col-span-12 md:col-span-6">
          <label class="form-label">Site*</label>

          <div class="flex w-full gap-2">
            <!-- Site Select Dropdown -->
            <div class="relative w-10/12">
              <v-select :id="'formData.sitesId'" :name="'formData.sitesId'" class="w-full" :reduce="(site) => site.id" v-model="sitesId" label="nom" :options="sites" placeholder="Selectionner un site..." multiple>
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
              <div v-if="errors.sitesId" class="mt-2 text-danger">{{ getFieldErrors(errors.sitesId) }}</div>
            </div>

            <!-- Add Button -->
            <button class="shadow-md btn btn-primary w-2/12 flex items-center justify-center" type="button" @click="openModalCreateSite" title="Add new organization">
              <PlusIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Fichiers et images en plein largeur -->
        <div class="col-span-12 md:col-span-6" v-if="!isUpdate">
          <label class="block my-3 font-bold text-gray-700">Images de couverture</label>
          <input id="image" name="image" type="file" ref="fileInput" @change="handleFileChange" accept="image/*" class="block w-full ..." />
          <div v-if="imagePreview" class="flex items-center mt-3">
            <img :src="imagePreview" alt="Prévisualisation" width="200" />
            <button type="button" class="ml-4 text-red-500" @click="clearFiles(index)">Supprimer</button>
          </div>
          <div v-if="errors.image" class="mt-2 text-danger">{{ getFieldErrors(errors.image) }}</div>
        </div>

        <div class="col-span-12 md:col-span-6" v-if="!isUpdate">
          <label class="block my-3 font-bold text-gray-700">Pièces jointes</label>
          <input id="fichier" name="fichier" ref="fileInput2" type="file" multiple class="block w-full ..." @change="handleFileChange2" />
          <ul v-if="files.length > 0" class="mt-3 space-y-2">
            <li v-for="(file, index) in files" :key="index" class="flex justify-between bg-white p-2 shadow">
              <span>{{ file.name }}</span>
              <button type="button" class="text-red-500" @click="removeFile(index)">Supprimer</button>
            </li>
          </ul>
          <div v-if="errors.fichier" class="mt-2 text-danger">{{ getFieldErrors(errors.fichier) }}</div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="closeProjetModal" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" :label="title" :loading="isLoading" type="submit" />
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
  <InputForm :id="'dateFin'" :name="'dateFin'" v-model="dateFin" :min="dateFinOld" class="col-span-12" type="date" :required="true" placeHolder="Entrer la nouvelle date de fin" label="Nouvelle Fin du projet*" />
        <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurProlongation !== null">{{ erreurProlongation }}</p>
      </ModalBody>
      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="closeProlongerDateModal" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" label="Prolonger" :loading="loadingProlonger" type="submit" />
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
        <button type="button" @click="closeDeleteProjetModal" class="w-full my-3 mr-1 btn btn-outline-secondary">Annuler</button>
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
          <span><strong>Latitude:</strong> {{ currentSiteIndex !== null && payloadsSitesMultiple[currentSiteIndex] ? (payloadsSitesMultiple[currentSiteIndex].latitude || "Non définie") : (payloadSites.latitude || "Non définie") }}</span>
          <span><strong>Longitude:</strong> {{ currentSiteIndex !== null && payloadsSitesMultiple[currentSiteIndex] ? (payloadsSitesMultiple[currentSiteIndex].longitude || "Non définie") : (payloadSites.longitude || "Non définie") }}</span>
        </div>
      </div>

      <!-- Carte Leaflet -->
      <div class="w-full h-96 rounded-lg border border-gray-300" style="min-height: 400px">
        <LMap ref="map" :zoom="6" :center="markerLatLng" @click="onMapClick" style="height: 100%; width: 100%">
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

 
   <div v-if="verifyPermission('voir-un-projet') && !isLoadingProjets" class="grid grid-cols-1 gap-4 mt-6 sm:gap-5 _md:grid-cols-2 lg:grid-cols-2 3xl:grid-cols-3 2xl:gap-6">
    <div href="#" class="relative transition-all duration-500 border-l-4 shadow-lg md:shadow-xl lg:shadow-2xl box group _bg-white zoom-in border-primary hover:border-secondary" v-for="(item, index) in paginatedAndFilteredData" :key="index">
      
      <!-- Header avec titre et bouton -->
      <div class="relative p-4 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="text-[#171a1d] group-hover:text-[#007580] font-medium text-sm sm:text-base lg:text-lg leading-tight sm:leading-normal line-clamp-2 flex-1 min-w-0">
          {{ item.codePta }} - {{ item.nom }}
        </div>
        <button class="btn btn-primary w-full sm:w-auto text-xs sm:text-sm px-3 py-2" @click="voirOutCome(item.id)">
          Voir Outcomes
        </button>
      </div>

      <!-- Image et description -->
      <div class="relative mx-4 mt-3 h-32 sm:h-40 md:h-48 lg:h-56 xl:h-48 2xl:h-56 image-fit rounded-md overflow-hidden before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
        <div class="absolute top-0 left-0 w-1/2 h-0 group-hover:h-full bg-[#02008052] transition-all duration-[.5s]"></div>
        <div class="absolute bottom-0 right-0 w-1/2 h-0 group-hover:h-full bg-[#02008052] transition-all duration-[.5s]"></div>

        <div class="relative h-full overflow-hidden group/hw hway hway-active">
          <img class="object-cover w-full h-full group-hover:opacity-30 transition-all duration-[.5s]" :src="item.image == null ? projetsImg[0] : item.image.url" alt="" />
          <!-- Description cachée avec effet de survol -->
          <div class="absolute inset-0 flex items-start justify-center p-3 sm:p-4 text-white transition-opacity duration-500 bg-black opacity-0 bg-opacity-80 group-hover:opacity-100 overflow-y-auto">
            <div class="w-full">
              <p class="text-sm font-bold sm:text-base lg:text-lg mb-2">Description du projet</p>
              <p class="text-xs sm:text-sm lg:text-base line-clamp-5 sm:line-clamp-6 leading-relaxed">{{ item.description }} {{ item.key }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations du projet -->
      <div class="p-4 text-slate-600 dark:text-slate-500 space-y-3">
        <!-- Budgets -->
        <div class="space-y-2">
          <div class="flex items-center text-xs sm:text-sm">
            <LinkIcon class="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
            <span class="truncate">Fond propre: {{ item.budgetNational == null || item.budgetNational == 0 ? 0 : $h.formatCurrency(item.budgetNational) }}</span>
            <span class="ml-1 italic font-bold flex-shrink-0">Fcfa</span>
          </div>
          <div class="flex items-center text-xs sm:text-sm">
            <LinkIcon class="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
            <span class="truncate">Subvention: {{ item.pret == null || item.pret == 0 ? 0 : $h.formatCurrency(item.pret) }}</span>
            <span class="ml-1 italic font-bold flex-shrink-0">Fcfa</span>
          </div>
        </div>

        <!-- Organisation -->
        <div v-if="item.owner !== null" class="flex items-center text-xs sm:text-sm">
          <GlobeIcon class="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
          <span class="truncate mr-2">Organisation:</span>
          <span class="px-2 py-1 text-white bg-green-400 rounded-md shadow-md text-xs truncate flex-shrink-0">{{ item.owner.user.nom }}</span>
        </div>

        <!-- Dates -->
        <div class="flex items-start text-xs sm:text-sm">
          <ClockIcon class="w-3 h-3 sm:w-4 sm:h-4 mr-2 mt-0.5 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <span class="block sm:inline">Du </span>
            <span class="font-bold whitespace-nowrap">{{ $h.reformatDate(item.debut) }}</span>
            <span class="block sm:inline"> au </span>
            <span class="font-bold whitespace-nowrap">{{ $h.reformatDate(item.fin) }}</span>
          </div>
        </div>

        <!-- Statut -->
        <div class="flex items-center text-xs sm:text-sm">
          <CheckSquareIcon class="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
          <span class="mr-2">Statut :</span>
          <span class="px-2 py-1 text-white rounded-md shadow-md text-xs whitespace-nowrap flex-shrink-0"
                :class="{
                  'bg-black': item.statut == -2,
                  'bg-green-500': item.statut == -1,
                  'bg-yellow-500': item.statut == 0,
                  'bg-red-500': item.statut == 1,
                  'bg-blue-500': item.statut == 2
                }">
            <span v-if="item.statut == -2">Non validé</span>
            <span v-else-if="item.statut == -1">Pas démarré</span>
            <span v-else-if="item.statut == 0">En cours</span>
            <span v-else-if="item.statut == 1">En retard</span>
            <span v-else-if="item.statut == 2">Terminé</span>
          </span>
        </div>

        <!-- Budget restant -->
        <div class="p-3 bg-gray-50 rounded-lg mt-3">
          <h4 class="text-xs font-semibold text-gray-700 mb-2">Budget disponible</h4>
          <div class="grid grid-cols-2 gap-2 sm:gap-3">
            <div class="text-center">
              <p class="text-xs text-gray-500 mb-1">Fond propre</p>
              <p class="text-xs sm:text-sm font-bold" :class="getFondRestant(item) >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ getFondRestant(item) === 0 ? '0' : $h.formatCurrency(getFondRestant(item)) }}
                <span class="text-xs">FCFA</span>
              </p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500 mb-1">Subvention</p>
              <p class="text-xs sm:text-sm font-bold" :class="getSubventionRestant(item) >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ getSubventionRestant(item) === 0 ? '0' : $h.formatCurrency(getSubventionRestant(item)) }}
                <span class="text-xs">FCFA</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap items-center justify-between p-4 border-t gap-2 border-slate-200/60 dark:border-darkmode-400">
        <a v-if="verifyPermission('voir-details-projet')" class="flex items-center text-primary text-xs sm:text-sm px-2 py-1 rounded hover:bg-gray-100 transition-colors" href="javascript:;" @click="goToDetail(item)">
          <EyeIcon class="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" title="voir détail" />
          <span class="xs:hidden md:inline">Détail</span>
        </a>
        <a v-if="verifyPermission('prolonger-un-projet')" class="flex items-center text-primary text-xs sm:text-sm px-2 py-1 rounded hover:bg-gray-100 transition-colors" href="javascript:;" @click="ouvrirModalProlongerProjet(item)" title="Prolonger la date du projet">
          <CalendarIcon class="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
          <span class="xs:hidden md:inline">Étendre</span>
        </a>
        <a v-if="verifyPermission('modifier-un-projet')" class="flex items-center text-primary text-xs sm:text-sm px-2 py-1 rounded hover:bg-gray-100 transition-colors" href="javascript:;" @click="modifierProjet(item)">
          <CheckSquareIcon class="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" title="modifier le projet" />
          <span class="xs:hidden md:inline">Modifier</span>
        </a>
        <a v-if="verifyPermission('supprimer-un-projet')" class="flex items-center text-danger text-xs sm:text-sm px-2 py-1 rounded hover:bg-gray-100 transition-colors" href="javascript:;" @click="supprimerProjet(item)">
          <Trash2Icon class="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" title="supprimer le projet" />
          <span class="xs:hidden md:inline">Supprimer</span>
        </a>
      </div>

      <!-- Barre colorée en bas -->
      <div class="absolute bottom-0 flex w-full">
        <div class="w-1/3 p-1 bg-green-500"></div>
        <div class="flex flex-col w-2/3">
          <div class="p-0.5 bg-yellow-500"></div>
          <div class="p-0.5 bg-red-500"></div>
        </div>
      </div>
    </div>
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

  <!-- Modal d'ajout d'organisation -->
  <Modal size="modal-xl" backdrop="static" :show="showModalOrganisation" @hidden="closeModalOrganisation">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Ajouter une organisation</h2>
    </ModalHeader>
    <form @submit.prevent="submitOrganisationData">
      <ModalBody class="space-y-3">
        <!-- Indicateur d'étapes -->
        <ol class="items-center justify-center w-full mb-3 space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
          <li v-for="step in visibleStepsOrganisation" @click="goToStepOrganisation(step.id)" :key="step.id"
              :class="[currentStepOrganisation == step.id ? 'text-blue-800' : 'text-gray-500']"
              class="flex cursor-pointer items-center space-x-2.5 rtl:space-x-reverse">
            <span :class="[currentStepOrganisation == step.id ? 'border-blue-800' : 'border-gray-500']"
                  class="flex items-center justify-center w-8 h-8 border rounded-full shrink-0">
              {{ step.id }}
            </span>
            <span>
              <h3 class="font-medium leading-tight">Étape {{ step.id }}</h3>
              <p class="text-sm">{{ step.label }}</p>
            </span>
          </li>
        </ol>

        <!-- Étape 1: Informations Générales -->
        <div v-show="currentStepOrganisation == 1" class="">
          <p class="mb-3 text-lg text-semibold">Informations générales</p>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-4">
              <InputForm :id="'payloadOrganisation.nom'" :name="'payloadOrganisation.nom'" :required="true" label="Nom" v-model="payloadOrganisation.nom"
                         :control="getFieldErrorsOrganisation(errorsOrganisation.nom)" />
              <InputForm :required="true" label="Email" v-model="payloadOrganisation.email" type="email"
                         :id="'payloadOrganisation.email'" :name="'payloadOrganisation.email'" :control="getFieldErrorsOrganisation(errorsOrganisation.email)" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <InputForm :id="'payloadOrganisation.sigle'" :name="'payloadOrganisation.sigle'" :required="true" label="Sigle" v-model="payloadOrganisation.sigle"
                         :control="getFieldErrorsOrganisation(errorsOrganisation.sigle)" />
              <InputForm :id="'payloadOrganisation.contact'" :name="'payloadOrganisation.contact'" :control="getFieldErrorsOrganisation(errorsOrganisation.contact)"
                         label="Contact" v-model="payloadOrganisation.contact"
                         maxlength="13" placeholder="+229xxxxxxxxxx" type="text" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <InputForm :id="'payloadOrganisation.code'" :name="'payloadOrganisation.code'" label="Code" :control="getFieldErrorsOrganisation(errorsOrganisation.code)"
                         v-model.number="payloadOrganisation.code" type="number" />
              <div v-if="payloadOrganisation.type !== 'autre_osc'">
                <label class="form-label">Domaine D'intervention <span class="text-danger">*</span></label>
                <TomSelect :id="'payloadOrganisation.secteurActivite'" :name="'payloadOrganisation.secteurActivite'" v-model="payloadOrganisation.secteurActivite"
                           :options="{ placeholder: 'Sélectionnez un secteur' }" class="w-full">
                  <option value=""></option>
                  <option v-for="(secteur, index) in secteursActivitesOrganisation" :key="index" :value="secteur">
                    {{ secteur }}
                  </option>
                </TomSelect>
                <div v-if="errorsOrganisation.secteurActivite" class="mt-2 text-danger">
                  {{ getFieldErrorsOrganisation(errorsOrganisation.secteurActivite) }}
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Types<span class="text-danger">*</span></label>
                <TomSelect :id="'payloadOrganisation.type'" :name="'payloadOrganisation.type'" v-model="payloadOrganisation.type"
                           :options="{ placeholder: 'Sélectionnez un type' }" class="w-full">
                  <option value=""></option>
                  <option v-for="(type, index) in typesOrganisation" :key="index" :value="type.id">
                    {{ type.label }}
                  </option>
                </TomSelect>
                <div v-if="errorsOrganisation.type" class="mt-2 text-danger">
                  {{ getFieldErrorsOrganisation(errorsOrganisation.type) }}
                </div>
              </div>
              <div v-if="payloadOrganisation.type == 'osc_fosir' && payloadOrganisation.type !== ''">
                <label class="form-label">Fonds <span class="text-danger">*</span></label>
                <TomSelect :id="'payloadOrganisation.fondId'" :name="'payloadOrganisation.fondId'" v-model="payloadOrganisation.fondId"
                           :options="{ placeholder: 'Sélectionnez un fond' }" class="w-full">
                  <option value=""></option>
                  <option v-for="(fond, index) in fondsOrganisation" :key="index" :value="fond.id">
                    {{ fond.nom_du_fond }} ({{ fond.fondDisponible }})
                  </option>
                </TomSelect>
                <div v-if="errorsOrganisation.fondId" class="mt-2 text-danger">
                  {{ getFieldErrorsOrganisation(errorsOrganisation.fondId) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Étape 2: Informations Localisation -->
        <div v-show="currentStepOrganisation == 2" class="">
          <div v-if="payloadOrganisation.type !== 'autre_osc'">
            <p class="mb-3 text-lg text-semibold">Informations Localisation</p>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="form-label">Pays</label>
                  <div class="relative w-full">
                    <v-select :id="'payloadOrganisation.pays'" :name="'payloadOrganisation.pays'" class="w-full" :reduce="(country) => country"
                              v-model="payloadOrganisation.pays" :options="paysOrganisation"
                              placeholder="Sélectionnez un pays..."
                              @option:selected="changeCountryOrganisation">
                      <template #search="{ attributes, events }">
                        <input class="vs__search form-input" v-bind="attributes" v-on="events"
                               placeholder="Rechercher un pays..." />
                      </template>
                    </v-select>
                  </div>
                  <div v-if="errorsOrganisation.pays" class="mt-2 text-danger">
                    {{ getFieldErrorsOrganisation(errorsOrganisation.pays) }}
                  </div>
                </div>
                <InputForm :id="'payloadOrganisation.addresse'" :name="'payloadOrganisation.addresse'" :required="false" label="Adresse"
                           :control="getFieldErrorsOrganisation(errorsOrganisation.addresse)"
                           v-model="payloadOrganisation.addresse" />
              </div>

              <!-- Si Bénin est sélectionné -->
              <div v-if="isBeninOrganisation" class="grid grid-cols-2 gap-4">
                <div>
                  <label class="form-label">Départements<span class="text-danger">*</span></label>
                  <div class="relative w-full">
                    <v-select :id="'payloadOrganisation.departement'" :name="'payloadOrganisation.departement'" class="w-full" :reduce="(dep) => dep.lib_dep"
                              v-model="payloadOrganisation.departement" :options="departementsOrganisation"
                              label="lib_dep" placeholder="Sélectionnez un département..."
                              @option:selected="updateCommunesOrganisation">
                      <template #search="{ attributes, events }">
                        <input class="vs__search form-input" v-bind="attributes" v-on="events"
                               placeholder="Rechercher un département..." />
                      </template>
                    </v-select>
                  </div>
                  <div v-if="errorsOrganisation.departement" class="mt-2 text-danger">
                    {{ getFieldErrorsOrganisation(errorsOrganisation.departement) }}
                  </div>
                </div>
                <div :class="[!showCommuneOrganisation ? '' : 'opacity-50 cursor-not-allowed pointer-events-none']">
                  <label class="form-label">Communes<span class="text-danger">*</span></label>
                  <div class="relative w-full">
                    <v-select :id="'payloadOrganisation.commune'" :name="'payloadOrganisation.commune'" class="w-full" :reduce="(commune) => commune.lib_com"
                              v-model="payloadOrganisation.commune" :options="filteredCommunesOrganisation"
                              label="lib_com" placeholder="Sélectionner la commune..."
                              @option:selected="updateArrondissementsOrganisation">
                      <template #search="{ attributes, events }">
                        <input class="vs__search form-input" v-bind="attributes" v-on="events"
                               placeholder="Rechercher une commune..." />
                      </template>
                    </v-select>
                  </div>
                  <div v-if="errorsOrganisation.commune" class="mt-2 text-danger">
                    {{ getFieldErrorsOrganisation(errorsOrganisation.commune) }}
                  </div>
                </div>
              </div>

              <div v-if="isBeninOrganisation" class="grid grid-cols-2 gap-4">
                <div :class="[!showArrondissementOrganisation ? '' : 'opacity-50 cursor-not-allowed pointer-events-none']">
                  <label class="form-label">Arrondissement<span class="text-danger">*</span></label>
                  <div class="relative w-full">
                    <v-select :id="'payloadOrganisation.arrondissement'" :name="'payloadOrganisation.arrondissement'" class="w-full" :reduce="(arrond) => arrond.lib_arrond"
                              v-model="payloadOrganisation.arrondissement" :options="filteredArrondissementsOrganisation"
                              label="lib_arrond" placeholder="Sélectionnez un arrondissement..."
                              @option:selected="updateQuartiersOrganisation">
                      <template #search="{ attributes, events }">
                        <input class="vs__search form-input" v-bind="attributes" v-on="events"
                               placeholder="Rechercher un arrondissement..." />
                      </template>
                    </v-select>
                  </div>
                  <div v-if="errorsOrganisation.arrondissement" class="mt-2 text-danger">
                    {{ getFieldErrorsOrganisation(errorsOrganisation.arrondissement) }}
                  </div>
                </div>
                <div :class="[!showQuatierOrganisation ? '' : 'opacity-50 cursor-not-allowed pointer-events-none']">
                  <label class="form-label">Quartier<span class="text-danger">*</span></label>
                  <div class="relative w-full">
                    <v-select :id="'payloadOrganisation.quartier'" :name="'payloadOrganisation.quartier'" class="w-full" :reduce="(quart) => quart.lib_quart"
                              v-model="payloadOrganisation.quartier" :options="filteredQuartiersOrganisation"
                              label="lib_quart" placeholder="Sélectionner le quartier...">
                      <template #search="{ attributes, events }">
                        <input class="vs__search form-input" v-bind="attributes" v-on="events"
                               placeholder="Rechercher un quartier..." />
                      </template>
                    </v-select>
                  </div>
                  <div v-if="errorsOrganisation.quartier" class="mt-2 text-danger">
                    {{ getFieldErrorsOrganisation(errorsOrganisation.quartier) }}
                  </div>
                </div>
              </div>

              <!-- Si autre pays -->
              <div v-if="!isBeninOrganisation" class="grid grid-cols-2 gap-4">
                <InputForm :id="'payloadOrganisation.departement'" :name="'payloadOrganisation.departement'" :required="false" :optionel="false" label="Département"
                           v-model="payloadOrganisation.departement"
                           :control="getFieldErrorsOrganisation(errorsOrganisation.departement)" />
                <InputForm :id="'payloadOrganisation.commune'" :name="'payloadOrganisation.commune'" :required="false" :optionel="false" label="Commune"
                           v-model="payloadOrganisation.commune"
                           :control="getFieldErrorsOrganisation(errorsOrganisation.commune)" />
              </div>

              <div v-if="!isBeninOrganisation" class="grid grid-cols-2 gap-4">
                <InputForm :id="'payloadOrganisation.arrondissement'" :name="'payloadOrganisation.arrondissement'" :required="false" :optionel="false" label="Arrondissement"
                           v-model="payloadOrganisation.arrondissement"
                           :control="getFieldErrorsOrganisation(errorsOrganisation.arrondissement)" />
                <InputForm :id="'payloadOrganisation.quartier'" :name="'payloadOrganisation.quartier'" :required="false" :optionel="false" label="Quartier"
                           v-model="payloadOrganisation.quartier"
                           :control="getFieldErrorsOrganisation(errorsOrganisation.quartier)" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <InputForm :id="'payloadOrganisation.longitude'" :name="'payloadOrganisation.longitude'" :required="false" :optionel="false" label="Longitude" step="0.1"
                           :control="getFieldErrorsOrganisation(errorsOrganisation.longitude)"
                           v-model.text="payloadOrganisation.longitude" type="number" />
                <InputForm :id="'payloadOrganisation.latitude'" :name="'payloadOrganisation.latitude'" :required="false" :optionel="false" label="Latitude" step="0.1"
                           :control="getFieldErrorsOrganisation(errorsOrganisation.latitude)"
                           v-model.text="payloadOrganisation.latitude" type="number" />
              </div>
            </div>
          </div>
          <!-- Si type = autre_osc, afficher infos point focal -->
          <div v-else>
            <p class="mb-3 text-lg text-semibold">Informations Point focal</p>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-4">
                <InputForm :id="'payloadOrganisation.nom_point_focal'" :name="'payloadOrganisation.nom_point_focal'" :required="false" label="Nom point focal"
                           :control="getFieldErrorsOrganisation(errorsOrganisation.nom_point_focal)"
                           v-model="payloadOrganisation.nom_point_focal" />
                <InputForm :id="'payloadOrganisation.prenom_point_focal'" :name="'payloadOrganisation.prenom_point_focal'" :required="false" label="Prénom point focal"
                           :control="getFieldErrorsOrganisation(errorsOrganisation.prenom_point_focal)"
                           v-model="payloadOrganisation.prenom_point_focal" />
              </div>
            </div>
          </div>
        </div>

        <!-- Étape 3: Informations Point Focal -->
        <div v-show="currentStepOrganisation == 3" class="">
          <p class="mb-3 text-lg text-semibold">Informations Point focal</p>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-4">
              <InputForm :required="false" label="Nom point focal" name="Nom point focal"
                         :control="getFieldErrorsOrganisation(errorsOrganisation.nom_point_focal)"
                         v-model="payloadOrganisation.nom_point_focal" />
              <InputForm :required="false" label="Prénom point focal" name="Prénom point focal"
                         :control="getFieldErrorsOrganisation(errorsOrganisation.prenom_point_focal)"
                         v-model="payloadOrganisation.prenom_point_focal" />
            </div>
          </div>
        </div>

        <!-- Navigation entre les étapes -->
        <div class="flex justify-end gap-3 py-4">
          <button @click.prevent="prevStepOrganisation"
                  :class="[currentStepOrganisation == 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : '']"
                  class="flex items-center justify-center mr-1 btn btn-outline-primary">
            <ChevronsLeftIcon class="size-4" />
          </button>
          <button v-for="step in visibleStepsOrganisation" :key="step.id"
                  :class="[step.id == currentStepOrganisation ? 'btn-primary' : 'btn-outline-primary']"
                  @click.prevent="goToStepOrganisation(step.id)"
                  class="flex items-center justify-center rounded-full btn size-8">
            {{ step.id }}
          </button>
          <button @click.prevent="nextStepOrganisation"
                  :class="[currentStepOrganisation == visibleStepsOrganisation.length ? 'opacity-50 cursor-not-allowed pointer-events-none' : '']"
                  class="flex items-center justify-center ml-1 text-black btn btn-outline-primary">
            <ChevronsRightIcon class="text-black size-4" />
          </button>
        </div>
      </ModalBody>

      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="closeModalOrganisation"
                  class="w-full px-2 py-2 my-3 btn btn-outline-secondary">
            Annuler
          </button>
          <VButton v-if="currentStepOrganisation == visibleStepsOrganisation.length"
                   :loading="isLoadingOrganisation" label="Ajouter" />
          <VButton v-else :loading="isLoadingOrganisation" @click.prevent="nextStepOrganisation"
                   :class="[currentStepOrganisation == visibleStepsOrganisation.length ? 'opacity-50 cursor-not-allowed pointer-events-none' : '']"
                   label="Suivant" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
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
import FondsService from "@/services/modules/fond.service";
import { helper as $h } from "@/utils/helper";
import { toast } from "vue3-toastify";
import { getFieldErrors } from "@/utils/helpers";
import { secteursActivites } from "@/utils/constants";
import { getAllErrorMessages } from "@/utils/gestion-error";
import verifyPermission from "@/utils/verifyPermission";
import decoupage from "@/decoupage_territorial_benin.json";
import contries from "@/pays.json";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { LMap, LTileLayer, LMarker, LPolygon, LPopup } from "@vue-leaflet/vue-leaflet";

import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { addressPoints } from "./markerDemo";
import icon from "./icon.png";
import markerShadow from "./marker-shadow.png"; // ../../utils/helpers"
// import { getFieldErrors } from "../../../utils/helpers"; // Fonction définie localement

export default {
  components: { LoaderSnipper, NoRecordsMessage, InputForm, VButton, LMap, LTileLayer, LMarker, LPolygon, LPopup, pagination },

  data() {
    return {
      markerLatLng: [9.30769,2.315834],
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
      payloadsSitesMultiple: [], // État pour stocker plusieurs payloads de sites
      currentSiteIndex: null, // Index du site en cours d'édition sur la carte

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
       beninBounds: [
        [6.225, 0.774], // Sud-Ouest
        [12.418, 3.851]  // Nord-Est
      ],
      //markerLatLng: [47.31322, -1.319482],
      markerLatLng: [9.3077, 2.3158],
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
        organisationId: [],
        nombreEmploie: 0,
        budgetNational: 0,
        codePta : ''
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
      showModalOrganisation : false ,
      payloadOrganisation: {
        nom: "",
        email: "",
        contact: "",
        fondId: "",
        nom_point_focal: "",
        prenom_point_focal: "",
        contact_point_focal: "",
        sigle: "",
        code: "",
        longitude: "",
        latitude: "",
        addresse: "",
        quartier: "",
        type: "",
        arrondissement: "",
        commune: "",
        departement: "",
        pays: "",
        secteurActivite: "",
      },
      isLoadingOrganisation: false,
      currentStepOrganisation: 1,
      fondsOrganisation: [],
      typesOrganisation: [
        { label: "OSC FOSIR", id: "osc_fosir" },
        { label: "OSC Partenaire", id: "osc_partenaire" },
        { label: "Autre OSC", id: "autre_osc" },
        { label: "Acteurs", id: "acteurs" },
        { label: "Structures étatiques", id: "structure_etatique" },
      ],
      secteursActivitesOrganisation: [],
      departementsOrganisation: [],
      paysOrganisation: [],
      selectedDepartementDataOrganisation: null,
      isBeninOrganisation: false,
      errorsOrganisation: {},
      allOrganisation : [],
    };
  },

  computed: {
    //importation des variables du module auths
    ...mapState({
      identifiant: (state) => state.auths.identifiant,
      projet: (state) => state.projets.projet,
      loading: (state) => state.loading,
      // errors: (state) => state.errors,
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

    // Computed properties pour la cascade des sites multiples
    filteredCommunesForSite() {
      return (index) => {
        const site = this.payloadsSitesMultiple[index];
        if (!site || !site.departement) return [];
        const departementData = this.departements.find((dep) => dep.lib_dep === site.departement);
        return departementData ? departementData.communes : [];
      };
    },
    filteredArrondissementsForSite() {
      return (index) => {
        const site = this.payloadsSitesMultiple[index];
        if (!site || !site.departement || !site.commune) return [];
        const departementData = this.departements.find((dep) => dep.lib_dep === site.departement);
        if (!departementData) return [];
        const communeData = departementData.communes.find((com) => com.lib_com === site.commune);
        return communeData ? communeData.arrondissements : [];
      };
    },
    filteredQuartiersForSite() {
      return (index) => {
        const site = this.payloadsSitesMultiple[index];
        if (!site || !site.arrondissement) return [];
        const arrondissements = this.filteredArrondissementsForSite(index);
        const arrondissementData = arrondissements.find((arrond) => arrond.lib_arrond === site.arrondissement);
        return arrondissementData ? arrondissementData.quartiers : [];
      };
    },

    // Computed properties pour l'organisation
    filteredCommunesOrganisation() {
      if (!this.payloadOrganisation.departement) return [];
      this.selectedDepartementDataOrganisation = this.departementsOrganisation.find(
        (dep) => dep.lib_dep === this.payloadOrganisation.departement
      );
      return this.selectedDepartementDataOrganisation ? this.selectedDepartementDataOrganisation.communes : [];
    },
    filteredArrondissementsOrganisation() {
      if (!this.payloadOrganisation.commune || !this.selectedDepartementDataOrganisation) return [];
      const communeData = this.selectedDepartementDataOrganisation.communes.find(
        (com) => com.lib_com === this.payloadOrganisation.commune
      );
      return communeData ? communeData.arrondissements : [];
    },
    filteredQuartiersOrganisation() {
      if (!this.payloadOrganisation.arrondissement) return [];
      const arrondissementData = this.filteredArrondissementsOrganisation.find(
        (arrond) => arrond.lib_arrond === this.payloadOrganisation.arrondissement
      );
      return arrondissementData ? arrondissementData.quartiers : [];
    },
    showCommuneOrganisation() {
      return !this.payloadOrganisation.departement;
    },
    showArrondissementOrganisation() {
      return !this.payloadOrganisation.commune;
    },
    showQuatierOrganisation() {
      return !this.payloadOrganisation.arrondissement;
    },
    visibleStepsOrganisation() {
      const steps = [
        { label: "Informations Générale", id: 1 },
        { label: "Informations Localisation", id: 2 },
        { label: "Informations Point Focal", id: 3 },
      ];
      return steps.filter((step) => {
        // si type = autre_osc on supprime l'étape 3
        if (step.id === 3 && this.payloadOrganisation.type === "autre_osc") {
          return false;
        }
        return true;
      }).map((step) => {
        // si type = autre_osc et étape 2 => changer label
        if (step.id === 2 && this.payloadOrganisation.type === "autre_osc") {
          return { ...step, label: "Informations Point Focal" };
        }
        return step;
      });
    },
  },

  methods: {
    closeDeleteProjetModal(){
      document.activeElement.blur();
      this.deleteModal = false
    },
    closeProlongerDateModal(){
      document.activeElement.blur();
      this.prolongerModal = false
    },
    closeProjetModal(){
      document.activeElement.blur();
      this.showModal = false
    },
     initializeMapBounds() {
      const map = this.$refs.map?.leafletObject;
      if (map) {
        // Définir les limites de la carte
        map.setMaxBounds(this.beninBounds);
        
        // Empêcher le zoom trop éloigné
        map.setMinZoom(7);
        map.setMaxZoom(18);
      }
    },
    isInBenin(lat, lng) {
      const [sw, ne] = this.beninBounds;
      return (
        lat >= sw[0] && 
        lat <= ne[0] && 
        lng >= sw[1] && 
        lng <= ne[1]
      );
    },
    ouvrirModalAjoutOrganisation(){
       this.showModalOrganisation = true
    },

    // Fonctions de navigation pour les étapes du formulaire organisation
    goToStepOrganisation(index) {
      this.currentStepOrganisation = index;
    },

    prevStepOrganisation() {
      if (this.currentStepOrganisation > 1) {
        this.currentStepOrganisation--;
      } else {
        this.currentStepOrganisation = 1;
      }
    },

    nextStepOrganisation() {
      // Vous pouvez ajouter une logique pour déterminer le nombre maximum d'étapes
      const maxSteps = 3; // À ajuster selon vos besoins
      if (this.currentStepOrganisation < maxSteps) {
        this.currentStepOrganisation++;
      } else {
        this.currentStepOrganisation = maxSteps;
      }
    },

    resetFormOrganisation() {
      this.payloadOrganisation = {
        nom: "",
        email: "",
        contact: "",
        fondId: "",
        nom_point_focal: "",
        prenom_point_focal: "",
        contact_point_focal: "",
        sigle: "",
        code: "",
        longitude: "",
        latitude: "",
        addresse: "",
        quartier: "",
        type: "",
        arrondissement: "",
        commune: "",
        departement: "",
        pays: "",
        secteurActivite: "",
      };
      this.currentStepOrganisation = 1;
      this.isLoadingOrganisation = false;
    },

    // Fonctions de mise à jour pour la localisation organisation
    changeCountryOrganisation() {
      if (this.payloadOrganisation.pays === "Bénin") {
        this.isBeninOrganisation = true;
        this.updateCommunesOrganisation();
      } else {
        this.payloadOrganisation.quartier = "";
        this.payloadOrganisation.arrondissement = "";
        this.payloadOrganisation.commune = "";
        this.payloadOrganisation.departement = "";
        this.isBeninOrganisation = false;
      }
    },

    updateCommunesOrganisation() {
      this.payloadOrganisation.commune = "";
      this.payloadOrganisation.arrondissement = "";
      this.payloadOrganisation.quartier = "";
    },

    updateArrondissementsOrganisation() {
      this.payloadOrganisation.arrondissement = "";
      this.payloadOrganisation.quartier = "";
    },

    updateQuartiersOrganisation() {
      this.payloadOrganisation.quartier = "";
    },

    getFieldErrorsOrganisation(error) {
      if (Array.isArray(error)) {
        return error.join(", ");
      }
      return error || "";
    },

    // Fonction pour charger les fonds
    async getFondsOrganisation() {
      try {
        const result = await FondsService.get();
        this.fondsOrganisation = result.data.data;
      } catch (e) {
        toast.error("Une erreur est survenue lors du chargement des fonds.");
      }
    },

    // Fonction pour initialiser les données de localisation
    initLocalisationDataOrganisation() {
      this.departementsOrganisation = decoupage;
      this.paysOrganisation = Object.values(contries);
      this.secteursActivitesOrganisation = secteursActivites;
    },

    // Fonction de soumission du formulaire organisation
    async submitOrganisationData() {
      this.isLoadingOrganisation = true;

      // Traitement de la longitude et latitude
      this.payloadOrganisation.longitude = this.payloadOrganisation.longitude + "";
      this.payloadOrganisation.latitude = this.payloadOrganisation.latitude + "";

      if (this.payloadOrganisation.longitude.includes(",")) {
        this.payloadOrganisation.longitude = this.payloadOrganisation.longitude.replace(",", ".");
      }

      if (this.payloadOrganisation.latitude.includes(",")) {
        this.payloadOrganisation.latitude = this.payloadOrganisation.latitude.replace(",", ".");
      }

      // Retirer le + du contact s'il existe
      if (this.payloadOrganisation.contact && this.payloadOrganisation.contact.startsWith("+")) {
        this.payloadOrganisation.contact = this.payloadOrganisation.contact.substring(1);
      }

      // Copier le contact principal vers contact point focal
      this.payloadOrganisation.contact_point_focal = this.payloadOrganisation.contact;

      try {
        // Créer l'organisation

        await OngService.create(this.payloadOrganisation);

        // Toast de succès
        toast.success("Organisation créée avec succès.");

        // Recharger la liste des organisations
        await this.fetchOngs();

        // Réinitialiser le formulaire et fermer le modal
        this.resetFormOrganisation();
        this.showModalOrganisation = false;

        

      } catch (e) {
        // Gestion des erreurs
        if (e.response && e.response.status === 422) {
          this.errorsOrganisation = e.response.data.errors;
          toast.error("Veuillez corriger les erreurs dans le formulaire.");
        } else {
          toast.error(getAllErrorMessages(e));
        }
      } finally {
        this.isLoadingOrganisation = false;
      }
    },

    // Fonction pour fermer le modal organisation
    closeModalOrganisation() {
      this.showModalOrganisation = false;
      this.resetFormOrganisation();
    },

    voirOutCome(id){
      this.$router.push({ name: "ProjectDetail", params: { projectId: id } });
    },
    getFondRestant(projet) {
      let totalFondUtilise = 0;
      if (projet.composantes && projet.composantes.length > 0) {
        projet.composantes.forEach((item) => {
          totalFondUtilise += item.budgetNational ? item.budgetNational : 0;
        });
      }
      return (projet.budgetNational || 0) - totalFondUtilise;
    },
    getSubventionRestant(projet) {
      let totalSubventionUtilise = 0;
      if (projet.composantes && projet.composantes.length > 0) {
        projet.composantes.forEach((item) => {
          totalSubventionUtilise += item.pret ? item.pret : 0;
        });
      }
      return (projet.pret || 0) - totalSubventionUtilise;
    }, 
    getinitForm() {
      return {
        nom: "",
        longitude: "",
        latitude: "",
        arrondissement: "",
        commune: "",
        departement: "",
        pays: "Bénin",
        quartier: "",
      };
    },

    onMapClick(event) {
      const { lat, lng } = event.latlng;
      // Vérifier si le clic est dans les limites du Bénin
      if (this.isInBenin(lat, lng)) {
        this.updateCoordinates(lat, lng);
      } else {
        toast.error("Veuillez sélectionner une position à l'intérieur du Bénin");
        // this.showError("Veuillez sélectionner une position à l'intérieur du Bénin");
      }
          
    },
    resetForm() {
      this.payloadSites = this.getinitForm();
      this.errors = {};

      // Réinitialiser les états des sélecteurs
      this.isBenin = false;
      this.indexBenin = 1;

      // Réinitialiser la position du marqueur
      this.markerLatLng = [6.3703, 2.3912];

      this.showModalCreate = false;
    },

    onMarkerDragEnd(event) {
      const { lat, lng } = event.target.getLatLng();

      if (this.isInBenin(position.lat, position.lng)) {
         this.updateCoordinates(lat, lng);
      } else {
        // Revenir à la position précédente
       
        toast.error("Le marqueur doit rester à l'intérieur du Bénin");
      }

      this.updateCoordinates(lat, lng);
    },

    openMapModal(index = null) {
      this.currentSiteIndex = index;
      this.showMapModal = true;

      // Initialiser la position du marker si des coordonnées existent
      if (index !== null && this.payloadsSitesMultiple[index]) {
        const site = this.payloadsSitesMultiple[index];
        if (site.latitude && site.longitude) {
           if(this.isInBenin(site.latitude, site.longitude)){
             this.markerLatLng = [parseFloat(site.latitude), parseFloat(site.longitude)];
           }else {
            this.markerLatLng = [9.30769, 2.315834]
           }
        }
      } else if (this.payloadSites.latitude && this.payloadSites.longitude) {
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
      // Assignation directe pour Vue 3
      if (this.currentSiteIndex !== null && this.payloadsSitesMultiple[this.currentSiteIndex]) {
        // Mettre à jour le site en cours d'édition dans le tableau
        this.payloadsSitesMultiple[this.currentSiteIndex].latitude = 0
        this.payloadsSitesMultiple[this.currentSiteIndex].longitude = 0
        this.payloadsSitesMultiple[this.currentSiteIndex].latitude = lat.toFixed(6);
        this.payloadsSitesMultiple[this.currentSiteIndex].longitude = lng.toFixed(6);
      } else {
        // Fallback pour l'ancien comportement
        this.payloadSites.latitude = lat.toFixed(6);
        this.payloadSites.longitude = lng.toFixed(6);
      }

      this.markerLatLng = [lat, lng];
    },
    resetPayload() {
      this.payloadSites = this.getinitForm();
    },
    addSitePayload() {
      this.payloadsSitesMultiple.push({
        ...this.getinitForm(),
        id: Date.now() + "-" + Math.random().toString(36).substr(2, 9),
      });
    },
    removeSitePayload(index) {
      this.payloadsSitesMultiple.splice(index, 1);
    },
    openModalCreateSite() {
      // Initialiser avec un premier site vide
      this.payloadsSitesMultiple = [
        {
          ...this.getinitForm(),
          id: Date.now() + "-" + Math.random().toString(36).substr(2, 9),
        },
      ];
      this.errors = {};
      this.showModalCreate = true;
    },
    verifyPermission,
    resetFormSite() {
      this.resetPayload();
      this.payloadsSitesMultiple = [];
      this.errors = {};

      // Réinitialiser les états des sélecteurs
      this.isBenin = false;
      this.indexBenin = 1;

      // Réinitialiser la position du marqueur
      this.markerLatLng = [6.3703, 2.3912];

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

    // Méthodes pour la sélection en cascade des sites multiples
    changeCountryForSite(index) {
      const site = this.payloadsSitesMultiple[index];
      if (site.pays !== "Bénin") {
        // Si ce n'est pas le Bénin, réinitialiser les champs administratifs
        site.departement = "";
        site.commune = "";
        site.arrondissement = "";
        site.quartier = "";
      } else {
        // Si c'est le Bénin, réinitialiser aussi pour forcer une nouvelle sélection
        this.updateCommunesForSite(index);
      }
    },
    updateCommunesForSite(index) {
      const site = this.payloadsSitesMultiple[index];
      site.commune = "";
      site.arrondissement = "";
      site.quartier = "";
    },
    updateArrondissementsForSite(index) {
      const site = this.payloadsSitesMultiple[index];
      site.arrondissement = "";
      site.quartier = "";
    },
    updateQuartiersForSite(index) {
      const site = this.payloadsSitesMultiple[index];
      site.quartier = "";
    },

    async createMultipleSites() {
      this.isLoadingSite = true;
      this.errors = {}; // Reset errors

      let successCount = 0;
      let errorCount = 0;

      for (let index = 0; index < this.payloadsSitesMultiple.length; index++) {
        const site = this.payloadsSitesMultiple[index];

        // Normaliser les coordonnées
        site.longitude = site.longitude + "";
        site.latitude = site.latitude + "";

        if (site.longitude.includes(",")) {
          site.longitude = site.longitude.replace(",", ".");
        }

        if (site.latitude.includes(",")) {
          site.latitude = site.latitude.replace(",", ".");
        }

        try {
          await SiteService.create(site);
          successCount++;
          toast.success(`Site ${index + 1} créé avec succès.`);
        } catch (e) {
          errorCount++;

          // Gestion des erreurs de validation (422)
          if (e.response && e.response.status === 422) {
            const errorData = e.response.data;

            // Structure: { data: { errors: { field: ["message"] } } } ou { errors: { field: ["message"] } }
            let siteErrors = {};
            if (errorData.data && errorData.data.errors) {
              siteErrors = errorData.data.errors;
            } else if (errorData.errors) {
              siteErrors = errorData.errors;
            }

            // Ajouter les erreurs avec l'index du site
            Object.keys(siteErrors).forEach((key) => {
              this.errors[`sites.${index}.${key}`] = siteErrors[key];
            });

            toast.error(`Site ${index + 1}: ${errorData.data?.message || errorData.message || "Erreur de validation"}`);
          } else {
            toast.error(`Site ${index + 1}: Vérifier les informations et réessayer.`);
          }
        }
      }

      this.isLoadingSite = false;

      if (successCount > 0 && errorCount === 0) {
        this.fetchSites();
        this.resetFormSite();
        toast.success(`${successCount} site(s) créé(s) avec succès.`);
      } else if (successCount > 0 && errorCount > 0) {
        this.fetchSites();
        toast.warning(`${successCount} site(s) créé(s), ${errorCount} erreur(s).`);
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
      this.errors = {}; // Reset errors

      await SiteService.create(this.payloadSites)
        .then(() => {
          this.isLoadingSite = false;
          this.fetchSites();
          this.resetFormSite();
          toast.success("Site créé avec succès.");
        })
        .catch((e) => {
          this.isLoadingSite = false;

          // Gestion des erreurs de validation (422)
          if (e.response && e.response.status === 422) {
            const errorData = e.response.data;

            // Structure: { data: { errors: { field: ["message"] } } } ou { errors: { field: ["message"] } }
            if (errorData.data && errorData.data.errors) {
              this.errors = errorData.data.errors;
            } else if (errorData.errors) {
              this.errors = errorData.errors;
            }

            toast.error(errorData.data?.message || errorData.message || "Erreur de validation du formulaire");
          } else {
            toast.error("Vérifier les informations et ressayer.");
          }
        });
    },
    removeFile(index) {
      // Supprime le fichier à l'index donné
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
      this.$router.push({ name: "Détails Projets", params: { id: projet.id } });
    },
    verifyPermission,
    resetFileInput() {
      // Réinitialiser le champ de fichier
      this.selectedFile = null; // Réinitialiser la variable selectedFile
      this.imagePreview = null; // Réinitialiser la prévisualisation
    },

    resetAllProjetFields() {
      // Réinitialiser formData
      this.formData = {
        nom: "",
        couleur: "",
        debut: "",
        fin: "",
        pays: "",
        pret: 0,
        organisationId: "",
        nombreEmploie: 0,
        budgetNational: 0,
      };

      // Réinitialiser les sites sélectionnés
      this.sitesId = [];

      // Réinitialiser les fichiers
      this.selectedFile = null;
      this.selectedFile2 = null;
      this.imagePreview = null;
      this.files = [];

      // Réinitialiser FormData
      this.FormProjet = new FormData();

      // Réinitialiser les erreurs
      this.messageErreur = {};
      this.errors = {};

      // Réinitialiser les inputs file dans le DOM
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
      if (this.$refs.fileInput2) {
        this.$refs.fileInput2.value = "";
      }
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
        
          this.allOrganisation = datas  
          
          this.ongs = datas.filter((ong) => ong.type !== "autre_osc" && (ong.projet == null || ong.projet == "null") );

        })
        .catch((error) => {
          // this.disabled();
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            // this.$toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
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
        // });
      });
      this.dropzoneMultipleRef = dropzoneRef;
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
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
          }
        });
    },
    onPageChanged(newPage) {
      this.currentPage = newPage;
      // Charger les données pour la page actuelle
      // this.loadDataForPage(newPage);
    },
    onItemsPerPageChanged(itemsPerPage) {
      this.itemsPerPage = itemsPerPage;
    },

    loadDataForPage(page) {
      // Logique pour charger les données correspondantes à la page
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

      this.dateFinOld = item.fin;
      this.projetId = item.id;
      this.prolongerModal = true;

    },
    prolongerProjet() {
      this.loadingProlonger = true;


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
    },

    modifierProjet(projet) {
      this.messageErreur = {};
      this.formData = {};
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
      
      // Logique conditionnelle : vérifier le type de l'utilisateur du propriétaire
      // Si le type est 'unitee-de-gestion', ne pas préremplir le champ organisation
      if (projet.owner && projet.owner.user && projet.owner.user.type === 'unitee-de-gestion') {
        // Ne pas préremplir le champ organisation pour les unités de gestion
        this.formData.organisationId = null;
      } else {
        // Préremplir normalement pour les autres types d'organisations
        this.formData.organisationId = projet.owner ? projet.owner.id : null;
      }
      
      this.formData.nombreEmploie = 0;
      this.formData.budgetNational = projet.budgetNational;
      this.formData.codePta = projet.codePta

      // if (projet.sites.length > 0)
      //   projet.sites.forEach((item) => {
      //     this.formData.push(item);
      //   });
      


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

      ProjetService.destroy(this.deleteData.data.id)
        .then((data) => {
          this.isLoading = false;
          this.deleteModal = false;
          toast.success("Operation effectué avec success !");
          this.fetchProjets();
          this.fetchOngs()
        })
        .catch((error) => {
          this.isLoading = false;
          toast.error("Echecde l'opération");
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            this.$toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
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

      if (this.formData.organisationId == "") {
        delete this.formData.organisationId;
      }

      if (this.isUpdate) {
        this.isLoading = true;
        this.formData.sites = this.sitesId;
        // projet.statut = projet.statut;
        this.updateProjet({ projet: this.formData, id: this.projetId })
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.isLoading = false;

              // Réinitialiser tous les champs après modification
              this.resetAllProjetFields();

              this.fetchProjets();
              this.fetchOngs()
              toast.success("Modification éffectuée avec succès");
              this.showModal = false;
            }
          })
          .catch((errors) => {
            this.isLoading = false;

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

              // Réinitialiser tous les champs après ajout
              this.resetAllProjetFields();

              toast.success("Ajout éffectuée avec succès");

              this.fetchProjets(this.programmeId);
              this.fetchOngs()
            }
          })
          .catch((e) => {
            this.isLoading = false;

            toast.error(e.response.data.message);

            // Gestion des erreurs de validation (422)
            if (e.response && e.response.status === 422) {
              const errorData = e.response.data;

              // Structure: { data: { errors: { field: ["message"] } } } ou { errors: { field: ["message"] } }
              if (errorData.data && errorData.data.errors) {
                this.errors = errorData.data.errors;
              } else if (errorData.errors) {
                this.errors = errorData.errors;
              }

              toast.error(errorData.data?.message || errorData.message || "Erreur de validation du formulaire");
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
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
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
    this.departements = decoupage;
  },
  mounted() {
    this.initializeMap();
    this.fetchSites(); // Wait for sites to load

    // Initialiser Dropzone après le montage du composant
    //  this.initializeDropzone();
    this.fetchOngs();

    // Initialiser les données pour l'organisation
    this.initLocalisationDataOrganisation();
    this.getFondsOrganisation();
  },

  watch: {
    sites: function () {
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
