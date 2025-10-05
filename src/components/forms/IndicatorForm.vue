<template>
  <!-- Main Create/Edit Modal -->
  <Modal size="modal-xl" backdrop="static" :show="show" @hidden="onModalHidden">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ modeText }} un indicateur</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <!-- Stepper -->
        <ol class="items-center justify-center w-full mb-3 space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
          <li v-for="step in steps" @click="goToStep(step.id)" :key="step.id"
            :class="[
              currentStep == step.id ? 'text-blue-800' : stepHasErrors(step.id) ? 'text-red-600' : 'text-gray-500'
            ]"
            class="flex cursor-pointer items-center space-x-2.5 rtl:space-x-reverse">
            <span
              :class="[
                currentStep == step.id ? 'border-blue-800 bg-blue-100' : stepHasErrors(step.id) ? 'border-red-600 bg-red-100' : 'border-gray-500'
              ]"
              class="flex items-center justify-center w-8 h-8 border rounded-full shrink-0">
              <span v-if="stepHasErrors(step.id) && currentStep != step.id">⚠️</span>
              <span v-else>{{ step.id }}</span>
            </span>
            <span>
              <h3 class="font-medium leading-tight">Étape {{ step.id }}</h3>
              <p class="text-sm">{{ step.label }}</p>
              <p v-if="stepHasErrors(step.id)" class="text-xs text-red-600 font-semibold">Erreurs détectées</p>
            </span>
          </li>
        </ol>
        <AlertErrorIndicateur :errors="errors" :countAnneeCible="countAnneeCible" />

        <!-- Step 1 Content -->
        <div v-show="currentStep == 1">
          <p class="mb-3 text-lg text-semibold">Informations 1</p>
          <div class="grid grid-cols-1 gap-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <InputForm class="flex-1" :required="false" :optionel="false" :control="getFieldErrors(errors.nom)" label="Nom" v-model="payload.nom" />
              <div class="flex-1">
                <label class="form-label" for="description">Description</label>
                <div>
                  <textarea name="description" class="form-control" id="description" v-model="payload.description" cols="30" rows="1"></textarea>
                </div>
                <div v-if="errors.description" class="mt-2 text-danger">{{ getFieldErrors(errors.description) }}</div>
              </div>
            </div>
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex-1 form-check">
                <input id="agreer" class="form-check-input" type="checkbox" v-model="payload.agreger" />
                <label class="form-check-label" for="agreer">Indicateur Agréger</label>
              </div>
              <InputForm class="flex-1" label="Indice" :optionel="false" v-model="payload.indice" :required="false" :control="getFieldErrors(errors.indice)" type="number" />
            </div>
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex-1">
                <label class="form-label">Année de base</label>
                <div class="relative w-full">
                  <v-select class="w-full" v-model="payload.anneeDeBase" :options="annees" placeholder="Selectionez une année...">
                    <template #search="{ attributes, events }">
                      <input class="vs__search form-input" v-bind="attributes" v-on="events"/>
                    </template>
                  </v-select>
                </div>
                <div v-if="errors.anneeDeBase" class="mt-2 text-danger">{{ getFieldErrors(errors.anneeDeBase) }}</div>
              </div>
              <!-- ANCIENNE VERSION : v-if="!payload.agreger" -->
              <!-- NOUVELLE VERSION : Inverser la condition -->
              <InputForm v-if="payload.agreger" class="flex-1" label="Valeur de base" :required="false" :control="getFieldErrors(errors.valeurDeBase)" v-model="payloadNotAgreger.valeurDeBase" />
            </div>
            <div class="flex flex-wrap items-center justify-between gap-3">
              <!-- ANCIENNE VERSION : v-if="!payload.agreger" -->
              <!-- NOUVELLE VERSION : Inverser la condition -->
              <div class="w-full" v-if="payload.agreger">
                <div class="flex gap-1 place-items-end">
                  <div class="flex-1">
                    <label class="form-label">Année cible <span class="text-danger">*</span></label>
                    <div class="relative w-full">
                      <v-select class="w-full" v-model="currentAnneeCibleNotAgreger.annee" :options="anneesCibleDisponiblesNotAgreger" placeholder="Selectionez une année...">
                         <template #search="{ attributes, events }">
                           <input class="vs__search form-input" v-bind="attributes" v-on="events" placeholder="Rechercher une année..." />
                         </template>
                      </v-select>
                    </div>
                  </div>
                  <div class="flex flex-1 gap-1">
                    <input type="number" class="form-control" id="valeur_cible" placeholder="Valeur cible" v-model="currentAnneeCibleNotAgreger.valeurCible" />
                    <button type="button" @click.prevent="addAnneeCibleNotAgreger" class="btn btn-primary h-9"><Plus class="mr-1 size-3" /></button>
                  </div>
                </div>
                <div v-if="errors.valeurDeBase" class="mt-2 text-danger">{{ getFieldErrors(errors.valeurDeBase) }}</div>
                <div v-if="errors.anneesCible" class="mt-2 text-danger">{{ getFieldErrors(errors.anneesCible) }}</div>
              </div>
            </div>
            <!-- ANCIENNE VERSION : v-if="!payload.agreger && payloadNotAgreger.anneesCible.length > 0" -->
            <!-- NOUVELLE VERSION : Inverser la condition -->
            <div v-if="payload.agreger && payloadNotAgreger.anneesCible.length > 0" class="w-full space-y-3" data-annees-cibles>
               <p class="font-medium text-slate-700">Années cibles configurées :</p>
                <div class="grid gap-2 grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
                  <div v-for="(annee, index) in payloadNotAgreger.anneesCible" :key="index" class="flex flex-col">
                    <!-- ANCIENNE VERSION : sans position relative -->
                    <!-- NOUVELLE VERSION : Ajouter relative pour que le bouton absolute fonctionne -->
                    <div class="relative group flex flex-col gap-2 p-2 bg-white rounded border transition-all duration-200" :class="isAnneeCibleInvalide(annee.annee) ? 'bg-red-50 border-red-300' : 'border-gray-200'">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-medium text-slate-500">Année :</span>
                        <div class="relative flex items-center">
                          <div v-if="isFieldEditing(`notAgreger-${index}`, 'annee')">
                            <select v-model="annee.annee" @change="toggleFieldEdit(`notAgreger-${index}`, 'annee')" class="text-sm font-semibold text-slate-900 border border-blue-500 text-right focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 w-24 transition-all mr-6">
                              <option v-for="year in anneesCibleDisponiblesNotAgreger" :key="year" :value="year">{{ year }}</option>
                              <option :value="annee.annee">{{ annee.annee }}</option>
                            </select>
                          </div>
                          <span v-else class="text-sm font-semibold w-24 text-right" :class="isAnneeCibleInvalide(annee.annee) ? 'text-red-700' : 'text-slate-900'">
                            {{ isAnneeCibleInvalide(annee.annee) ? '⚠️ ' : '' }}{{ annee.annee }}
                          </span>
                          <button type="button" @click.prevent="toggleFieldEdit(`notAgreger-${index}`, 'annee')" class="absolute right-0 p-1 transition-all rounded hover:bg-blue-100 group-hover:opacity-100" :class="isFieldEditing(`notAgreger-${index}`, 'annee') ? 'bg-blue-100 opacity-100' : 'opacity-0'" title="Modifier l'année">
                            <Edit3 class="size-3 text-blue-600" />
                          </button>
                        </div>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-medium text-slate-500">Valeur cible :</span>
                        <div class="relative flex items-center">
                          <div v-if="isFieldEditing(`notAgreger-${index}`, 'valeurCible')">
                            <input type="number" v-model="annee.valeurCible" @keyup.enter.prevent.stop="toggleFieldEdit(`notAgreger-${index}`, 'valeurCible')" @focus="$event.target.select()" class="text-sm font-semibold text-slate-900 border border-blue-500 text-right focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 w-24 transition-all mr-6" placeholder="0" step="any" />
                          </div>
                          <span v-else class="text-sm font-semibold text-slate-900 w-24 text-right">
                            {{ annee.valeurCible || '0' }}
                          </span>
                          <button type="button" @click.prevent="toggleFieldEdit(`notAgreger-${index}`, 'valeurCible')" class="absolute right-0 p-1 transition-all rounded hover:bg-blue-100 group-hover:opacity-100" :class="isFieldEditing(`notAgreger-${index}`, 'valeurCible') ? 'bg-blue-100 opacity-100' : 'opacity-0'" :title="isFieldEditing(`notAgreger-${index}`, 'valeurCible') ? 'Valider' : 'Modifier la valeur'">
                            <Check v-if="isFieldEditing(`notAgreger-${index}`, 'valeurCible')" class="size-3 text-blue-600" />
                            <Edit3 v-else class="size-3 text-blue-600" />
                          </button>
                        </div>
                      </div>
                      <!-- ANCIENNE VERSION : Toujours visible -->
                      <!-- NOUVELLE VERSION : Visible seulement au hover avec opacity et transition -->
                      <button type="button" @click.prevent="deleteAnneeCibleNotAgreger(index)" class="absolute top-2 right-2 z-10 p-1 bg-red-50 transition-all duration-200 rounded hover:bg-red-100 border border-red-200 opacity-0 group-hover:opacity-100" title="Supprimer">
                        <X class="size-4 text-danger" />
                      </button>
                    </div>
                  </div>
                </div>
            </div>
            <div class="flex flex-wrap items-center justify-between gap-3">
              <!-- ANCIENNE VERSION : v-if="payload.agreger" -->
              <!-- NOUVELLE VERSION : Inverser la condition -->
              <div v-if="!payload.agreger" class="flex-1">
                <label class="form-label">Clé valeur</label>
                <div class="flex gap-1">
                  <div class="relative w-full">
                    <v-select class="w-full" :reduce="(key) => key.id" v-model="array_value_keys" label="libelle" :options="keys" placeholder="Selectionez les clés valeur..." multiple>
                       <template #search="{ attributes, events }">
                         <input class="vs__search form-input" v-bind="attributes" v-on="events" placeholder="Rechercher une clé..." />
                       </template>
                    </v-select>
                  </div>
                  <button type="button" class="flex-1 text-sm btn btn-primary" @click.prevent="showModalKey = true"><Plus class="mr-1 size-3" /></button>
                </div>
                <div v-if="errors.value_keys" class="mt-2 text-danger">{{ getFieldErrors(errors.value_keys) }}</div>
              </div>
            </div>
            <!-- ANCIENNE VERSION : v-if="array_value_keys.length > 0 && payload.agreger" -->
            <!-- NOUVELLE VERSION : Inverser la condition -->
            <div v-if="array_value_keys.length > 0 && !payload.agreger" class="">
              <label class="form-label">Valeur de base</label>
                <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))]">
                  <div v-for="(base, index) in filterValueKeys" :key="index" class="flex flex-col">
                    <div class="input-group" :class="{ 'ring-2 ring-red-400': hasEmptyBaseValue(base.id) }">
                      <div class="flex items-center justify-center text-sm input-group-text" :class="{ 'bg-red-50 text-red-700': hasEmptyBaseValue(base.id) }">
                        {{ base.libelle }}
                        <span v-if="hasEmptyBaseValue(base.id)" class="ml-1">⚠️</span>
                      </div>
                      <input type="text" v-model="valeur[base.id]" class="form-control" :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500': hasEmptyBaseValue(base.id) }" placeholder="valeur" aria-label="valeur" aria-describedby="input-group-valeur" />
                    </div>
                    <div v-if="hasEmptyBaseValue(base.id)" class="mt-2 text-danger">Ce champ doit être rempli</div>
                  </div>
                </div>
            </div>
            <!-- ANCIENNE VERSION : v-if="payload.agreger" -->
            <!-- NOUVELLE VERSION : Inverser la condition -->
            <div v-if="!payload.agreger" class="space-y-3">
              <button type="button" v-show="array_value_keys.length > 0" class="text-sm btn btn-primary" @click.prevent="openAddAnneeCibleModal"><Plus class="mr-1 size-3" /> Ajouter une année cible</button>
            </div>
            <!-- ANCIENNE VERSION : v-if="payload.agreger && anneesCible.length > 0" -->
            <!-- NOUVELLE VERSION : Inverser la condition -->
            <div v-if="!payload.agreger && anneesCible.length > 0" class="w-full space-y-3" data-annees-cibles>
              <p class="font-medium text-slate-700">Années cibles configurées :</p>
                <div class="space-y-3">
                  <div v-for="(annee, index) in anneesCible" :key="index" class="p-4 rounded-lg border" :class="isAnneeCibleInvalide(annee.annee) ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'">
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2">
                        <h4 class="font-semibold text-lg" :class="isAnneeCibleInvalide(annee.annee) ? 'text-red-600' : 'text-primary'">Année {{ annee.annee }}</h4>
                        <span v-if="isAnneeCibleInvalide(annee.annee)" class="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                          ⚠️ Invalide (< année de base)
                        </span>
                      </div>
                      <div class="flex items-center gap-2">
                        <button type="button" @click.prevent="editAnneeCible(index)" class="p-2 transition-colors rounded-lg hover:bg-purple-100 bg-purple-50" title="Modifier dans le modal">
                          <Edit class="size-4 text-purple-600" />
                        </button>
                        <button type="button" @click.prevent="deleteAnneeCible(index)" class="p-2 transition-colors rounded-lg hover:bg-red-100 bg-red-50" title="Supprimer">
                          <X class="size-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <div class="grid gap-2 grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
                      <div v-for="valeur in annee.valeurCible" :key="valeur.keyId" class="flex flex-col">
                        <div class="group flex items-center justify-between gap-2 p-2 bg-white rounded border transition-all duration-200" :class="{ 'border-red-300 bg-red-50': hasEmptyTargetValue(valeur.keyId, index) }">
                          <span class="text-sm font-medium text-slate-600 truncate max-w-[150px]" :class="{ 'text-red-700': hasEmptyTargetValue(valeur.keyId, index) }" :title="getKeyLabel(valeur.keyId)">
                            {{ getKeyLabel(valeur.keyId) }}
                          </span>
                          <div class="relative flex items-center">
                            <div v-if="isFieldEditing(index, valeur.keyId)">
                              <input type="number" v-model="valeur.value" @keyup.enter.prevent.stop="toggleFieldEdit(index, valeur.keyId)" @focus="$event.target.select()" class="text-sm font-semibold text-slate-900 border border-blue-500 text-right focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 w-24 transition-all mr-6" :class="{ 'focus:bg-green-50 focus:ring-green-500': hasEmptyTargetValue(valeur.keyId, index) }" placeholder="0" step="any" />
                            </div>
                            <span v-else class="text-sm font-semibold text-slate-900 w-24 text-right">
                              {{ valeur.value || '0' }}
                            </span>
                            <button type="button" @click.prevent="toggleFieldEdit(index, valeur.keyId)" class="absolute right-0 p-1 transition-all rounded hover:bg-blue-100 group-hover:opacity-100" :class="isFieldEditing(index, valeur.keyId) ? 'bg-blue-100 opacity-100' : 'opacity-0'" :title="isFieldEditing(index, valeur.keyId) ? 'Valider' : 'Modifier'">
                              <Check v-if="isFieldEditing(index, valeur.keyId)" class="size-3 text-blue-600" />
                              <Edit3 v-else class="size-3 text-blue-600" />
                            </button>
                          </div>
                        </div>
                        <div v-if="hasEmptyTargetValue(valeur.keyId, index)" class="mt-2 text-danger">Ce champ doit être rempli</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="errors.anneesCible" class="mt-2 text-danger">{{ getFieldErrors(errors.anneesCible) }}</div>
            </div>
          </div>
        </div>

        <!-- Step 2 Content -->
        <div v-show="currentStep == 2">
          <p class="mb-3 text-lg text-semibold">Informations 2</p>
          <div class="grid grid-cols-1 gap-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex-1">
                <label class="form-label">Catégorie<span class="text-danger">*</span></label>
                <div class="flex gap-1">
                  <div class="relative w-full">
                    <v-select class="w-full" :reduce="(categorie) => categorie.id" v-model="payload.categorieId" label="nom" :options="categories" placeholder="Selectionez une catégorie...">
                      <template #search="{ attributes, events }">
                        <input class="vs__search form-input" v-bind="attributes" v-on="events" placeholder="Rechercher une catégorie..." />
                      </template>
                    </v-select>
                  </div>
                  <button type="button" class="flex-1 text-sm btn btn-primary" @click.prevent="showModalCategorie = true"><Plus class="mr-1 size-3" /></button>
                </div>
                <div v-if="errors.categorieId" class="mt-2 text-danger">{{ getFieldErrors(errors.categorieId) }}</div>
              </div>
              <div class="flex-1">
                <label class="form-label">Type de variables <span class="text-danger">*</span></label>
                <div class="relative w-full">
                  <!-- ANCIENNE VERSION : :options="payload.agreger ? type_variablees : type_variablees_agreger" -->
                  <!-- NOUVELLE VERSION : Inverser la condition -->
                  <v-select class="w-full" :reduce="(variable) => variable.id" v-model="payload.type_de_variable" :options="!payload.agreger ? type_variablees : type_variablees_agreger" label="label" placeholder="Selectionez un type de variable...">
                    <template #search="{ attributes, events }">
                      <input class="vs__search form-input" v-bind="attributes" v-on="events" placeholder="Rechercher un type..." />
                    </template>
                  </v-select>
                </div>
                <div v-if="errors.type_de_variable" class="mt-2 text-danger">{{ getFieldErrors(errors.type_de_variable) }}</div>
              </div>
            </div>
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex-1">
                    <label class="form-label">Méthode de la collecte des données</label>
                    <div class="relative w-full">
                        <v-select class="w-full" v-model="payload.methode_de_la_collecte" :options="methodeCollecte" placeholder="Selectionez une methode..."></v-select>
                    </div>
                    <div v-if="errors.methode_de_la_collecte" class="mt-2 text-danger">{{ getFieldErrors(errors.methode_de_la_collecte) }}</div>
                </div>
                <div class="flex-1">
                    <label class="form-label">Fréquence de la collecte de données</label>
                    <div class="relative w-full">
                        <v-select class="w-full" v-model="payload.frequence_de_la_collecte" :options="frequenceCollecte" placeholder="Selectionez une fréquence..."></v-select>
                    </div>
                    <div v-if="errors.frequence_de_la_collecte" class="mt-2 text-danger">{{ getFieldErrors(errors.frequence_de_la_collecte) }}</div>
                </div>
            </div>
            <div class="flex-1">
              <label class="form-label">UG <span class="text-danger">*</span></label>
              <div class="relative w-full">
                <v-select class="w-full" :reduce="(ug) => ug.id" v-model="responsablesForm.ug" label="nom" :options="ugs" placeholder="Selectionez un UG..."></v-select>
              </div>
              <div v-if="errors['responsables.ug']" class="mt-2 text-danger">{{ getFieldErrors(errors["responsables.ug"]) }}</div>
            </div>
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex-1">
                <label class="form-label">Responsables <span class="text-danger">*</span></label>
                <div class="relative w-full">
                  <v-select class="w-full" :reduce="(responsable) => responsable.id" v-model="responsablesForm.organisations" label="nom" :options="responsables" placeholder="Selectionez un responsable..." multiple></v-select>
                </div>
                <div v-if="errors['responsables.organisations']" class="mt-2 text-danger">{{ getFieldErrors(errors["responsables.organisations"]) }}</div>
              </div>
              <div class="flex-1">
                <label class="form-label">Unité de mesure <span class="text-danger">*</span></label>
                <div class="flex gap-1">
                  <div class="relative w-full">
                    <v-select class="w-full" :reduce="(unite) => unite.id" v-model="payload.uniteeMesureId" label="nom" :options="unites" placeholder="Selectionez une unité de mesure..."></v-select>
                  </div>
                  <button type="button" class="flex-1 text-sm btn btn-primary" @click.prevent="showModalUniteMesure = true"><Plus class="mr-1 size-3" /></button>
                </div>
                <div v-if="errors.uniteeMesureId" class="mt-2 text-danger">{{ getFieldErrors(errors.uniteeMesureId) }}</div>
              </div>
            </div>
            <div class="flex flex-wrap items-center justify-between w-full gap-3">
              <div class="flex-1">
                <label class="form-label">Zone d'intervention <span class="text-danger">*</span></label>
                <div class="flex gap-1">
                  <div class="relative w-full">
                    <v-select class="w-full" :reduce="(site) => site.id" v-model="payload.sites" label="nom" :options="sites" placeholder="Selectionez les sites..." multiple></v-select>
                  </div>
                  <button type="button" class="flex-1 text-sm btn btn-primary" @click.prevent="showModalZone = true"><Plus class="mr-1 size-3" /></button>
                </div>
                <div v-if="errors.sites" class="mt-2 text-danger">{{ getFieldErrors(errors.sites) }}</div>
              </div>
              <div class="flex-1">
                <label class="form-label">Source de données</label>
                <div class="relative w-full">
                  <v-select class="w-full" v-model="payload.sources_de_donnee" :options="sourcesDonnees" placeholder="Selectionez une source..."></v-select>
                </div>
                <div v-if="errors.sources_de_donnee" class="mt-2 text-danger">{{ getFieldErrors(errors.sources_de_donnee) }}</div>
              </div>
            </div>
            <div class="flex flex-wrap items-center justify-between w-full gap-3">
              <div class="flex-1">
                <label class="form-label" for="hypothese">Hypothèses et risques</label>
                <div>
                  <textarea name="hypothese" class="form-control" id="hypothese" v-model="payload.hypothese" cols="30" rows="3" placeholder="Décrivez les hypothèses et risques liés à cet indicateur"></textarea>
                </div>
                <div v-if="errors.hypothese" class="mt-2 text-danger">{{ getFieldErrors(errors.hypothese) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stepper Navigation -->
        <div class="flex justify-center gap-3 py-4 mt-5">
            <button type="button" @click.prevent="prevStep" :class="[currentStep == 1 ? ' opacity-50 cursor-not-allowed pointer-events-none' : '']" class="flex items-center justify-center mr-1 btn btn-outline-primary"><ChevronsLeft class="size-4" /></button>
            <button type="button" v-for="step in steps" :key="step.id" :class="[step.id == currentStep ? 'btn-primary' : 'btn-outline-primary']" @click.prevent="goToStep(step.id)" class="flex items-center justify-center rounded-full btn size-8">{{ step.id }}</button>
            <button type="button" @click.prevent="nextStep" :class="[currentStep == steps.length ? ' opacity-50 cursor-not-allowed pointer-events-none' : '']" class="flex items-center justify-center ml-1 text-black btn btn-outline-primary"><ChevronsRight class="text-black size-4" /></button>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="closeModal" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
          <VButton v-if="currentStep == steps.length" :loading="isLoading" :label="modeText" />
          <VButton v-else :loading="isLoading" @click.prevent="nextStep" label="Suivant" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <!-- Modal for Annee Cible -->
  <Modal :show="showModalAnnee" @hidden="showModalAnnee = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ isEditingAnneeCible ? 'Modifier' : 'Ajouter' }} une année cible</h2>
    </ModalHeader>
    <form @submit.prevent="addAnneeCible">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <div class="flex-1">
            <label class="form-label">Année</label>
            <div class="relative w-full">
              <v-select class="w-full" v-model="currentAnneeCible.annee" :options="anneesModalDisponibles" placeholder="Selectionez une année..."></v-select>
            </div>
          </div>
          <div v-if="array_value_keys.length > 0" class="">
            <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))]">
              <div v-for="(key, index) in filterValueKeys" :key="key.id" class="flex flex-col">
                <div class="input-group" :class="{ 'ring-2 ring-red-400': hasEmptyModalValue(index) }">
                  <div class="flex items-center justify-center text-sm input-group-text" :class="{ 'bg-red-50 text-red-700': hasEmptyModalValue(index) }">
                    {{ key.libelle }}
                    <span v-if="hasEmptyModalValue(index)" class="ml-1">⚠️</span>
                  </div>
                  <input type="text" v-model="currentAnneeCible.valeurCible[index].value" class="form-control" :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500': hasEmptyModalValue(index) }" placeholder="valeur" aria-label="valeur" />
                </div>
                <div v-if="hasEmptyModalValue(index)" class="mt-2 text-danger">Ce champ doit être rempli</div>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetFormAnnee" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
          <VButton :label="isEditingAnneeCible ? 'Modifier' : 'Ajouter'" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
</template>

<script setup>
import { computed, reactive, ref, watch, watchEffect } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import { toast } from "vue3-toastify";
import { getFieldErrors } from "@/utils/helpers";
import { frequenceCollecte, methodeCollecte, sourcesDonnees, type_variablees, type_variablees_agreger } from "@/utils/constants";
import AlertErrorIndicateur from "@/components/news/AlertErrorIndicateur.vue";
import { ChevronsLeft, ChevronsRight, Plus, Edit3, Check, X, Edit } from "lucide-vue-next";

const props = defineProps({
  show: { type: Boolean, required: true },
  isCreate: { type: Boolean, default: true },
  initialData: { type: Object, default: null },
  categories: { type: Array, required: true },
  unites: { type: Array, required: true },
  keys: { type: Array, required: true },
  ugs: { type: Array, required: true },
  responsables: { type: Array, required: true },
  sites: { type: Array, required: true },
  annees: { type: Array, required: true },
});

const emit = defineEmits(["update:show", "submit"]);

const isLoading = ref(false);
const errors = ref({});
const steps = ref([ { label: "Informations 1", id: 1 }, { label: "Informations 2", id: 2 } ]);
const currentStep = ref(1);
const showModalAnnee = ref(false);
const showModalKey = ref(false);
const showModalCategorie = ref(false);
const showModalUniteMesure = ref(false);
const showModalZone = ref(false);
const isEditingAnneeCible = ref(false);
const editingAnneeCibleIndex = ref(-1);
const editingFields = ref(new Set());
const valeur = ref({});
const anneesCible = ref([]);
const array_value_keys = ref([]);
const responsablesForm = ref({ organisations: [], ug: "" });

const payload = reactive({
  responsables: responsablesForm.value,
  nom: "",
  description: "",
  indice: "",
  sources_de_donnee: "",
  methode_de_la_collecte: "",
  frequence_de_la_collecte: "",
  anneeDeBase: "",
  type_de_variable: "",
  agreger: true,
  value_keys: [],
  valeurDeBase: [],
  anneesCible: [],
  categorieId: "",
  uniteeMesureId: "",
  sites: [],
  hypothese: "",
});

const payloadNotAgreger = reactive({ valeurDeBase: "", anneesCible: [] });
const currentAnneeCible = ref({ annee: "", valeurCible: [] });
const currentAnneeCibleNotAgreger = ref({ annee: "", valeurCible: "" });

const modeText = computed(() => (props.isCreate ? "Ajouter" : "Modifier"));

const resetForm = () => {
  currentStep.value = 1;

  // Réinitialiser les années cibles pour indicateurs non agrégés
  payloadNotAgreger.anneesCible = [];
  payloadNotAgreger.valeurDeBase = "";
  currentAnneeCibleNotAgreger.value = { annee: "", valeurCible: "" };

  // Réinitialiser les clés valeurs
  array_value_keys.value = [];
  valeur.value = {};

  // Réinitialiser les années cibles pour indicateurs agrégés (avec clés)
  anneesCible.value = [];
  currentAnneeCible.value = { annee: "", valeurCible: [] };

  // Réinitialiser l'état d'édition
  editingFields.value = new Set();
  isEditingAnneeCible.value = false;
  editingAnneeCibleIndex.value = -1;

  // Réinitialiser les responsables
  responsablesForm.value.organisations = [];
  responsablesForm.value.ug = "";

  // Réinitialiser le payload principal
  payload.agreger = true;
  payload.nom = "";
  payload.description = "";
  payload.indice = "";
  payload.sources_de_donnee = "";
  payload.methode_de_la_collecte = "";
  payload.frequence_de_la_collecte = "";
  payload.type_de_variable = "";
  payload.anneeDeBase = "";
  payload.categorieId = "";
  payload.uniteeMesureId = "";
  payload.sites = [];
  payload.value_keys = [];
  payload.valeurDeBase = [];
  payload.anneesCible = [];
  payload.hypothese = "";

  // Réinitialiser les erreurs
  errors.value = {};
};

// ANCIENNE VERSION
// const closeModal = () => {
//   resetForm();
//   emit("update:show", false);
// };

// NOUVELLE VERSION - Séparer la fermeture et le reset
const closeModal = () => {
  // Fermer d'abord le modal
  emit("update:show", false);
  // Le reset sera fait dans onModalHidden
};

const onModalHidden = () => {
  // Réinitialiser le formulaire après la fermeture du modal
  resetForm();
};

const submitData = () => {
  // Garde contre double soumission
  if (isLoading.value) return;

  isLoading.value = true;
  errors.value = {}; // Réinitialiser les erreurs avant soumission

  if (payload.agreger) {
    // Frontend: agreger=true → valeurs simples (sans clés)
    payload.anneesCible = payloadNotAgreger.anneesCible;
    payload.valeurDeBase = payloadNotAgreger.valeurDeBase;
    delete payload.value_keys;
  } else {
    // Frontend: agreger=false → valeurs avec clés
    payload.anneesCible = anneesCible.value;
    payload.valeurDeBase = valeurDeBase.value;
    payload.value_keys = array_value_keys.value.map((item) => ({ id: item }));
  }

  // ANCIENNE VERSION - sans inversion
  // emit("submit", { payload: payload, id: props.initialData?.id });

  // NOUVELLE VERSION - Inverser agreger pour le backend
  // Backend: agreger=false → simple (sans clés), agreger=true → avec clés
  const backendPayload = { ...payload, agreger: !payload.agreger };

  // Callbacks pour gérer le retour du parent
  const onSuccess = () => {
    isLoading.value = false;
    errors.value = {};
  };

  const onError = (validationErrors) => {
    isLoading.value = false;
    errors.value = validationErrors || {};

    // Aller au step minimum qui contient des erreurs
    if (errors.value && Object.keys(errors.value).length > 0) {
      // Vérifier step 1
      if (stepHasErrors(1)) {
        currentStep.value = 1;
      }
      // Sinon vérifier step 2
      else if (stepHasErrors(2)) {
        currentStep.value = 2;
      }
    }
  };

  emit("submit", {
    payload: backendPayload,
    id: props.initialData?.id,
    onSuccess,
    onError
  });

  // ANCIENNE VERSION - Reset immédiat (trop tôt, la requête n'est pas finie)
  // setTimeout(() => {
  //   resetForm();
  // }, 100);

  // NOUVELLE VERSION - Le reset sera fait dans onModalHidden()
  // quand le parent fermera le modal après le succès de la requête

  // Ne plus mettre isLoading à false ici, on attend les callbacks
  // isLoading.value = false;
};

// ANCIENNE VERSION : watchEffect - se déclenche trop souvent
// NOUVELLE VERSION : watch avec dépendances explicites
watch(() => [props.show, props.initialData, props.isCreate], ([show, initialData, isCreate]) => {
  if (show) {
    if (initialData && !isCreate) {
      const data = initialData;
      payload.nom = data.nom;
      payload.description = data.description ?? "";
      payload.indice = data.indice?.toString() ?? "";
      // ANCIENNE VERSION : payload.agreger = data.agreger;
      // NOUVELLE VERSION : Inverser la valeur du backend pour l'affichage
      // Backend: false=simple, true=avec clés → Frontend: true=simple, false=avec clés
      payload.agreger = !data.agreger;
      payload.anneeDeBase = data.anneeDeBase?.toString() ?? "";
      payload.categorieId = data.categorieId ?? "";
      payload.uniteeMesureId = data.unitee_mesure?.id ?? "";
      payload.type_de_variable = data.type_de_variable ?? "";
      payload.methode_de_la_collecte = data.methode_de_la_collecte ?? "";
      payload.frequence_de_la_collecte = data.frequence_de_la_collecte ?? "";
      payload.sources_de_donnee = data.sources_de_donnee ?? "";
      payload.hypothese = data.hypothese ?? "";
      payload.sites = data.sites?.map(s => s.id) ?? [];
      responsablesForm.value.ug = data.ug_responsable?.id ?? "";
      responsablesForm.value.organisations = data.organisations_responsable?.map(o => o.id) ?? [];

      // Backend: agreger=true → avec clés, agreger=false → simple

      console.log("Loading indicator data:", data);
      console.log("Backend agreger value:", data.agreger);
      console.log("valeurDeBase:", data.valeurDeBase);
      console.log("valeursCible:", data.valeursCible);

      // CORRECTION: Backend agreger=true → avec clés, agreger=false → simple
      if(data.agreger) {
        // Backend agreger=true → avec clés-valeurs
        console.log("Charger les clés-valeurs (backend agreger=true)");
        array_value_keys.value = data.value_keys?.map(vk => vk.id) ?? [];
        const baseValues = {};
        if (data.valeurDeBase) {
            Object.keys(data.valeurDeBase).forEach(key => {
                const valueKey = data.value_keys.find(vk => vk.libelle === key);
                if (valueKey) { baseValues[valueKey.id] = data.valeurDeBase[key]; }
            });
        }
        valeur.value = baseValues;
        console.log("valeur.value chargé:", valeur.value);

        anneesCible.value = data.valeursCible?.map(vc => ({
            annee: vc.annee,
            valeurCible: data.value_keys.map(vk => ({
                keyId: vk.id,
                value: vc.valeurCible ? vc.valeurCible[vk.libelle] : ""
            }))
        })) ?? [];
        console.log("anneesCible.value chargé:", anneesCible.value);
      } else {
        // Backend agreger=false → valeurs simples
        console.log("Charger les valeurs simples (backend agreger=false)");
        payloadNotAgreger.valeurDeBase = data.valeurDeBase ? Object.values(data.valeurDeBase)[0] : "";
        console.log("payloadNotAgreger.valeurDeBase chargé:", payloadNotAgreger.valeurDeBase);

        payloadNotAgreger.anneesCible = data.valeursCible?.map(vc => ({
            annee: vc.annee,
            valeurCible: vc.valeurCible ? Object.values(vc.valeurCible)[0] : ""
        })) ?? [];
        console.log("payloadNotAgreger.anneesCible chargé:", payloadNotAgreger.anneesCible);
      }
    } else {
      resetForm();
    }
  }
}, { deep: false });

const anneesCibleDisponibles = computed(() => {
  if (!payload.anneeDeBase) return props.annees;
  return props.annees.filter(annee => annee >= payload.anneeDeBase);
});

const anneesModalDisponibles = computed(() => {
  const anneesBase = anneesCibleDisponibles.value;
  if (!isEditingAnneeCible.value) {
    const anneesDejaConfigurees = anneesCible.value.map(a => a.annee);
    return anneesBase.filter(annee => !anneesDejaConfigurees.includes(annee));
  }
  const anneesDejaConfigurees = anneesCible.value
    .filter((_, index) => index !== editingAnneeCibleIndex.value)
    .map(a => a.annee);
  return anneesBase.filter(annee => !anneesDejaConfigurees.includes(annee));
});

const anneesCibleDisponiblesNotAgreger = computed(() => {
  const anneesBase = anneesCibleDisponibles.value;
  const anneesDejaConfigurees = payloadNotAgreger.anneesCible.map(a => a.annee);
  return anneesBase.filter(annee => !anneesDejaConfigurees.includes(annee));
});

const addAnneeCibleNotAgreger = () => {
  if (!currentAnneeCibleNotAgreger.value.annee || !currentAnneeCibleNotAgreger.value.valeurCible) {
    toast.info("Veuillez entrer une année et sa valeur !");
    return;
  }
  if (currentAnneeCibleNotAgreger.value.annee < payload.anneeDeBase) {
    toast.error("L'année cible ne peut pas être inférieure à l'année de base !");
    return;
  }
  if (payloadNotAgreger.anneesCible.some(ac => ac.annee === currentAnneeCibleNotAgreger.value.annee)) {
    toast.info("Cette année cible est dejà ajoutée");
  } else {
    payloadNotAgreger.anneesCible.push({ ...currentAnneeCibleNotAgreger.value });
    currentAnneeCibleNotAgreger.value = { annee: "", valeurCible: "" };
  }
};

const deleteAnneeCibleNotAgreger = (index) => { payloadNotAgreger.anneesCible.splice(index, 1); };
const deleteAnneeCible = (index) => { anneesCible.value.splice(index, 1); };

const editAnneeCible = (index) => {
  isEditingAnneeCible.value = true;
  editingAnneeCibleIndex.value = index;
  const anneeCibleToEdit = anneesCible.value[index];
  currentAnneeCible.value = JSON.parse(JSON.stringify(anneeCibleToEdit));
  showModalAnnee.value = true;
};

const openAddAnneeCibleModal = () => {
  isEditingAnneeCible.value = false;
  editingAnneeCibleIndex.value = -1;
  currentAnneeCible.value = {
    annee: "",
    valeurCible: array_value_keys.value.map((keyId) => ({ keyId, value: "" })),
  };
  showModalAnnee.value = true;
};

const goToStep = (index) => { currentStep.value = index; };
const prevStep = () => { if (currentStep.value > 1) currentStep.value--; };
const nextStep = () => { if (currentStep.value < steps.value.length) currentStep.value++; };

const addAnneeCible = () => {
  if (!currentAnneeCible.value.annee) {
    toast.info("Veuillez entrer une année !");
    return;
  }
  if (currentAnneeCible.value.annee < payload.anneeDeBase) {
    toast.error("L'année cible ne peut pas être inférieure à l'année de base !");
    return;
  }
  if (isEditingAnneeCible.value) {
    anneesCible.value[editingAnneeCibleIndex.value] = { ...currentAnneeCible.value };
    toast.success("Année cible modifiée avec succès !");
  } else {
    anneesCible.value.push({ ...currentAnneeCible.value });
    toast.success("Année cible ajoutée avec succès !");
  }
  resetFormAnnee();
};

const resetFormAnnee = () => {
  currentAnneeCible.value = { annee: "", valeurCible: array_value_keys.value.map((keyId) => ({ keyId, value: "" })) };
  isEditingAnneeCible.value = false;
  editingAnneeCibleIndex.value = -1;
  showModalAnnee.value = false;
};

const filterValueKeys = computed(() => {
  if (!props.keys) return [];
  return props.keys
    .filter((key) => array_value_keys.value.includes(key.id))
    .map(({ id, libelle }) => ({ id, libelle }));
});

// Clés disponibles (non encore sélectionnées)
const availableKeys = computed(() => {
  if (!props.keys) return [];
  return props.keys.filter((key) => !array_value_keys.value.includes(key.id));
});

const valeurDeBase = computed(() => {
  return Object.entries(valeur.value)
    .filter(([keyId]) => array_value_keys.value.includes(keyId))
    .map(([keyId, value]) => ({ keyId, value }));
});

const getKeyLabel = (keyId) => {
  const key = props.keys.find(k => k.id === keyId);
  return key ? key.libelle : `Clé ${keyId}`;
};

const hasEmptyBaseValue = (keyId) => {
  if (!array_value_keys.value.includes(keyId)) return false;
  const value = valeur.value[keyId];
  return !value || value.toString().trim() === '';
};

const hasEmptyTargetValue = (keyId, anneeIndex) => {
  if (!array_value_keys.value.includes(keyId)) return false;
  if (!anneesCible.value[anneeIndex]) return false;
  const valeurCible = anneesCible.value[anneeIndex].valeurCible.find(v => v.keyId === keyId);
  if (!valeurCible) return true;
  return !valeurCible.value || valeurCible.value.toString().trim() === '';
};

const hasEmptyModalValue = (valueIndex) => {
  if (!currentAnneeCible.value.valeurCible[valueIndex]) return true;
  const value = currentAnneeCible.value.valeurCible[valueIndex].value;
  return !value || value.toString().trim() === '';
};

const isAnneeCibleInvalide = (annee) => {
  return payload.anneeDeBase && annee < payload.anneeDeBase;
};

const toggleFieldEdit = (anneeIndex, keyId) => {
  const fieldId = `${anneeIndex}-${keyId}`;
  if (editingFields.value.has(fieldId)) {
    editingFields.value.delete(fieldId);
  } else {
    editingFields.value.add(fieldId);
  }
};

const isFieldEditing = (anneeIndex, keyId) => {
  return editingFields.value.has(`${anneeIndex}-${keyId}`);
};

// ANCIENNE VERSION : return payload.agreger ? anneesCible.value.length : payloadNotAgreger.anneesCible.length;
// NOUVELLE VERSION : Inverser la condition
const countAnneeCible = computed(() => {
  return !payload.agreger ? anneesCible.value.length : payloadNotAgreger.anneesCible.length;
});

// Vérifier si un step contient des erreurs
const stepHasErrors = (stepId) => {
  if (!errors.value || Object.keys(errors.value).length === 0) return false;

  // Définir les champs par step
  const step1Fields = [
    'nom', 'description', 'indice', 'agreger',
    'anneeDeBase', 'valeurDeBase', 'anneesCible',
    'value_keys', 'valeur'
  ];

  const step2Fields = [
    'categorieId', 'type_de_variable', 'methode_de_la_collecte',
    'frequence_de_la_collecte', 'responsables.ug', 'responsables.organisations',
    'uniteeMesureId', 'sites', 'sources_de_donnee', 'hypothese'
  ];

  const fieldsToCheck = stepId === 1 ? step1Fields : step2Fields;

  // Vérifier si au moins un champ de ce step a une erreur
  return fieldsToCheck.some(field => errors.value[field]);
};

watch(array_value_keys, (newKeys, oldKeys) => {
    if (Array.isArray(newKeys)) {
      currentAnneeCible.value.valeurCible = newKeys.map((keyId) => ({ keyId, value: "" }));
      if (oldKeys && Array.isArray(oldKeys)) {
        const removedKeys = oldKeys.filter(keyId => !newKeys.includes(keyId));
        const addedKeys = newKeys.filter(keyId => !oldKeys.includes(keyId));
        if (removedKeys.length > 0 || addedKeys.length > 0) {
          anneesCible.value.forEach(annee => {
            annee.valeurCible = annee.valeurCible.filter(valeur => newKeys.includes(valeur.keyId));
            addedKeys.forEach(keyId => {
              if (!annee.valeurCible.find(valeur => valeur.keyId === keyId)) {
                annee.valeurCible.push({ keyId: keyId, value: "" });
              }
            });
          });
        }
      }
    } else {
      currentAnneeCible.value.valeurCible = [];
    }
  }, { immediate: true }
);

watch(() => payload.anneeDeBase, (newAnneeBase) => {
    if (!newAnneeBase) return;
    const checkAnnees = (cibles) => {
        if (cibles.length > 0) {
            const anneesInvalides = cibles.filter(annee => annee.annee < newAnneeBase);
            if (anneesInvalides.length > 0) {
                toast.warning(`${anneesInvalides.length} année(s) cible(s) sont maintenant invalides. Veuillez les corriger.`);
            }
        }
    };
    // ANCIENNE VERSION : if (payload.agreger) { checkAnnees(anneesCible.value); }
    // NOUVELLE VERSION : Inverser la condition
    if (!payload.agreger) {
        checkAnnees(anneesCible.value);
    } else {
        checkAnnees(payloadNotAgreger.anneesCible);
    }
});
</script>