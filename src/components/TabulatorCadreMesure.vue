<template>
  <div v-if="verifyPermission('voir-un-indicateur')" class="flex justify-end my-3">
    <ExportationIndicateur :data="data" :years="years" />
  </div>

 

  <TabGroup>
    <TabList class="space-x-4 font-bold uppercase nav-boxed-tabs">
      <Tab class="w-full py-2 bg-white" tag="button">Cadre logique</Tab>
      <Tab class="w-full py-2 bg-white" tag="button">ANALYSES DES DONNÉES</Tab>
    </TabList>
    <TabPanels class="mt-5">
      <TabPanel>
        <div class="text-right">
          <button @click="generatePDFAdvanced" class="btn btn-primary text-left">Télécharger PDF</button>
        </div>

        <div class="p-5 mt-2 intro-y">
          <div v-if="verifyPermission('voir-un-indicateur')" class="table-container">
            <div ref="tableWrapper" class="table-wrapper">
              <table id="my-table" class="w-full max-w-full my-2 border-collapse editor_listing_table border-slate-500" cellpadding="6" cellspacing="0">
                <thead class="text-white bg-primary">
                  <tr>
                    <th rowspan="2" class="py-3 sticky-header border !border-slate-800 min-w-[500px] sticky-column">Résultats escomptés</th>
                    <th rowspan="2" class="py-3 sticky-header border !border-slate-800 min-w-[80px] sticky-column-second">Indice</th>
                    <th rowspan="2" class="py-3 !z-[1] sticky-header border !border-slate-800 min-w-[500px]">Indicateurs</th>
                    <th rowspan="2" class="py-3 !z-[1] sticky-header border !border-slate-800 min-w-[300px]">Description de l'indicateur</th>
                    <th rowspan="2" class="py-3 !z-[1] sticky-header border !border-slate-800 min-w-[100px]">Situation de référence</th>
                    <th :colspan="years.length + 1" class="py-3 !z-[1] sticky-header border !border-slate-800 min-w-[70px]">Cibles</th>
                    <th :colspan="years.length + 1" class="py-3 !z-[1] sticky-header border !border-slate-800 min-w-[70px]">Réalisation</th>
                    <th rowspan="2" class="py-3 sticky-header !z-[1] border !border-slate-800 min-w-[150px]">Taux de réalisation</th>
                    <th rowspan="2" class="py-3 sticky-header !z-[1] border !border-slate-800 min-w-[150px]">Sources de données</th>
                    <th rowspan="2" class="py-3 sticky-header !z-[1] border !border-slate-800 min-w-[150px]">Hypothèses et risques</th>
                    <th rowspan="2" class="py-3 sticky-header !z-[1] border !border-slate-800 min-w-[150px]">Méthode de collecte des données</th>
                    <th rowspan="2" class="py-3 sticky-header !z-[1] border !border-slate-800 min-w-[150px]">Fréquence de la collecte de données</th>
                    <th rowspan="2" class="py-3 sticky-header !z-[1] border !border-slate-800 min-w-[150px]">Responsable</th>
                    <th rowspan="2" class="py-3 sticky-header !z-[1] border !border-slate-800 min-w-[450px]">Actions</th>
                  </tr>
                  <tr>
                    <th v-for="(year, index) in years" :key="index" class="py-3 !z-[1] sticky top-0 sticky-header border !border-slate-800 min-w-[70px]">{{ year }}</th>
                    <th class="py-3 border !border-slate-800 min-w-[100px] sticky-header !z-[1] sticky top-0">Total</th>
                    <th v-for="(year, index) in years" :key="index" class="py-3 !z-[1] sticky-header border !border-slate-800 min-w-[70px] sticky top-0">{{ year }}</th>
                    <th class="py-3 border !border-slate-800 min-w-[100px] sticky-header !z-[1] sticky top-0">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(result, i) in data" :key="result.id">
                    <tr class="uppercase" v-if="result.indicateurs && result.indicateurs.length > 0" :class="[result.type == 'produit' ? 'text-black' : 'text-white']" :style="{ 'background-color': findColorCadreMesure(result.type) }">
                      <td :colspan="14 + years.length * 2" class="font-semibold">{{ result.type }} {{ result.indice }}</td>
                    </tr>
                    <template v-for="(indicateur, j) in result.indicateurs" :key="indicateur.id">
                      <tr>
                        <!-- Première colonne fixe -->
                        <td class="font-semibold sticky-column" v-if="j === 0" :rowspan="result.indicateurs.length" style="left: 0">
                          {{ result.nom }}
                        </td>

                        <!-- Deuxième colonne fixe -->
                        <td class="font-semibold sticky-column-second" style="left: 500px">Ind {{ indicateur.code }}</td>

                        <!-- Troisième colonne fixe -->
                        <td class="">
                          {{ indicateur.nom }} 
                        </td>

                        <!-- Colonnes restantes -->
                        <td>{{ indicateur.description ?? "" }}</td>
                        <td class="p-2">
                          <div class="text-center">
                          
                            <div class="font-medium text-gray-700" v-html="formatObject(indicateur.valeurDeBase)"></div>
                            <div class="text-xs text-gray-500 mt-1">Base</div>
                          </div>
                        </td>
                        <td v-for="(year, index) in years" :key="index" class="p-2">
                          <div class="text-center">
                            <div class="font-semibold text-green-600" v-html="formatObject(indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeurCible)"></div>
                            <div class="text-xs text-gray-500 mt-1">Cible</div>
                          </div>
                        </td>
                        <td class="p-2">
                          <div class="text-center">
                            <div class="font-bold text-green-700" v-html="formatObject(indicateur.valeurCibleTotal)"></div>
                            <div class="text-xs text-gray-500 mt-1">Total Cible</div>
                          </div>
                        </td>
                        <td v-for="(year, index) in years" :key="index" class="p-2">
                          <div class="text-center">
                            <div class="font-semibold text-blue-600" v-html="formatObject(indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeur_realiser)"></div>
                            <div class="text-xs text-gray-500 mt-1">Réalisé</div>
                          </div>
                        </td>
                        <td class="p-2">
                          <div class="text-center">
                            <div class="font-bold text-blue-700" v-html="formatObject(indicateur.valeurRealiserTotal)"></div>
                            <div class="text-xs text-gray-500 mt-1">Total Réalisé</div>
                          </div>
                        </td>
                        <td class="p-3">
                          <div class="flex items-center space-x-2">
                            <div class="flex-1">
                              <div class="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  class="h-2 rounded-full transition-all duration-300"
                                  :class="getProgressBarClass(indicateur.taux_realisation?.moy || 0)"
                                  :style="{ width: Math.min(100, Math.max(0, parseFloat(indicateur.taux_realisation?.moy || 0))) + '%' }"
                                ></div>
                              </div>
                            </div>
                            <div class="text-sm font-semibold min-w-[50px]" :class="getPerformanceTextClass(indicateur.taux_realisation?.moy || 0)">
                              {{ Math.round(parseFloat(indicateur.taux_realisation?.moy || 0)) }}%
                            </div>
                          </div>
                        </td>
                        <td>{{ indicateur.sources_de_donnee }}</td>
                          <td>{{ indicateur.hypothese }}</td>
                        <td>{{ indicateur.methode_de_la_collecte }}</td>
                        <td>{{ indicateur.frequence_de_la_collecte }}</td>
                        <td>
                          <span v-html="formatResponsable(indicateur.organisations_responsable)"></span><br />
                          {{ indicateur.ug_responsable?.nom ?? "" }}
                          {{}}
                        </td>
                         <td class="space-x-1">
                          <div class="flex items-center space-x-1">
                            <!-- Suivre -->
                            <button 
                              v-if="verifyPermission('creer-un-suivi-indicateur')" 
                              title="Suivre" 
                              @click="handleSuivi(indicateur)" 
                              class="btn text-primary hidden sm:inline-flex"
                            >
                              Suivre
                            </button>
                            <button 
                              v-if="verifyPermission('creer-un-suivi-indicateur')" 
                              title="Suivre" 
                              @click="handleSuivi(indicateur)" 
                              class="btn text-primary sm:hidden"
                            >
                              <!-- <CornerUpLeftIcon class="size-4" /> -->
                              Suivre
                            </button>

                            <!-- Voir -->
                            <button 
                              v-if="verifyPermission('voir-un-suivi-indicateur')" 
                              title="Voir" 
                              @click="goToDetailSuivi(indicateur.id)" 
                              class="btn text-primary hidden sm:inline-flex"
                            >
                              Voir
                            </button>
                            <button 
                              v-if="verifyPermission('voir-un-suivi-indicateur')" 
                              title="Voir" 
                              @click="goToDetailSuivi(indicateur.id)" 
                              class="btn text-primary sm:hidden"
                            >
                              <!-- <EyeIcon class="size-4" /> -->
                              Voi
                            </button>

                            <!-- Ajouter Structure -->
                            <button 
                              v-if="verifyPermission('voir-un-suivi-indicateur')" 
                              title="Ajouter Structure" 
                              @click="handleStructure(indicateur.id)" 
                              class="btn text-primary"
                            >
                              <span class="hidden sm:inline">Ajouter une structure</span>
                              <span class="sm:hidden">Structure</span>
                            </button>

                            <!-- Ajouter Année Cible -->
                            <button 
                              v-if="verifyPermission('voir-un-suivi-indicateur')" 
                              title="Ajouter Structure" 
                              @click="handleYearCible(indicateur)" 
                              class="btn text-primary"
                            >
                              <span class="hidden sm:inline">Ajouter une année cible</span>
                              <span class="sm:hidden">Année cible</span>
                            </button>

                            <!-- Modifier -->
                            <button 
                              v-if="verifyPermission('supprimer-un-suivi-indicateur')" 
                              title="Modifier" 
                              @click="handleEdit(indicateur)" 
                              class="btn text-pending"
                            >
                              <Edit3Icon class="size-4 sm:size-5" />
                            </button>

                            <!-- Supprimer -->
                            <button 
                              v-if="verifyPermission('supprimer-un-suivi-indicateur')" 
                              title="Supprimer" 
                              @click="handleDelete(indicateur)" 
                              class="btn text-danger"
                            >
                              <TrashIcon class="size-4 sm:size-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </template>
                    <template v-for="(result, i) in result.categories" :key="result.id">
                      <tr class="uppercase" v-if="result.indicateurs && result.indicateurs.length > 0" :class="[result.type == 'produit' ? 'text-black' : 'text-white']" :style="{ 'background-color': findColorCadreMesure(result.type) }">
                        <td :colspan="14 + years.length * 2" class="font-semibold">{{ result.type }} {{ result.indice }}</td>
                      </tr>
                      <template v-for="(indicateur, j) in result.indicateurs" :key="indicateur.id">
                        <tr>
                          <!-- Première colonne fixe -->
                          <td class="font-semibold sticky-column" v-if="j === 0" :rowspan="result.indicateurs.length" style="left: 0">
                            {{ result.nom }}
                          </td>

                          <!-- Deuxième colonne fixe -->
                          <td class="font-semibold sticky-column-second" style="left: 500px">Ind {{ indicateur.code }}</td>

                          <!-- Troisième colonne fixe -->
                          <td class="">
                            {{ indicateur.nom }}
                          </td>

                          <!-- Colonnes restantes -->
                          <td>{{ indicateur.description ?? "" }}</td>
                          <td class="p-2">
                          <div class="text-center">
                            <div class="font-medium text-gray-700" v-html="formatObject(indicateur.valeurDeBase)"></div>
                            <div class="text-xs text-gray-500 mt-1">Base</div>
                          </div>
                        </td>
                          <td v-for="(year, index) in years" :key="index">
                            <span v-html="formatObject(indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeurCible)"></span>
                          </td>
                          <td class="p-2">
                          <div class="text-center">
                            <div class="font-bold text-green-700" v-html="formatObject(indicateur.valeurCibleTotal)"></div>
                            <div class="text-xs text-gray-500 mt-1">Total Cible</div>
                          </div>
                        </td>
                          <td v-for="(year, index) in years" :key="index">
                            <span v-html="formatObject(indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeur_realiser)"></span>
                          </td>
                          <td class="p-2">
                          <div class="text-center">
                            <div class="font-bold text-blue-700" v-html="formatObject(indicateur.valeurRealiserTotal)"></div>
                            <div class="text-xs text-gray-500 mt-1">Total Réalisé</div>
                          </div>
                        </td>
                          <td class="p-3">
                          <div class="flex items-center space-x-2">
                            <div class="flex-1">
                              <div class="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  class="h-2 rounded-full transition-all duration-300"
                                  :class="getProgressBarClass(indicateur.taux_realisation?.moy || 0)"
                                  :style="{ width: Math.min(100, Math.max(0, parseFloat(indicateur.taux_realisation?.moy || 0))) + '%' }"
                                ></div>
                              </div>
                            </div>
                            <div class="text-sm font-semibold min-w-[50px]" :class="getPerformanceTextClass(indicateur.taux_realisation?.moy || 0)">
                              {{ Math.round(parseFloat(indicateur.taux_realisation?.moy || 0)) }}%
                            </div>
                          </div>
                        </td>
                          <td>{{ indicateur.sources_de_donnee }}</td>
                          <td>{{ indicateur.hypothese }}</td>
                          <td>{{ indicateur.methode_de_la_collecte }}</td>
                          <td>{{ indicateur.frequence_de_la_collecte }}</td>
                          <td>
                            <span v-html="formatResponsable(indicateur.organisations_responsable)"></span><br />
                            {{ indicateur.ug_responsable?.nom ?? "" }}
                            {{}}
                          </td>
                          <td class="space-x-1">
                            <div class="flex items-center space-x-1">
                              <!-- Suivre -->
                              <button 
                                v-if="verifyPermission('creer-un-suivi-indicateur')" 
                                title="Suivre" 
                                @click="handleSuivi(indicateur)" 
                                class="btn text-primary hidden sm:inline-flex"
                              >
                                Suivre
                              </button>
                              <button 
                                v-if="verifyPermission('creer-un-suivi-indicateur')" 
                                title="Suivre" 
                                @click="handleSuivi(indicateur)" 
                                class="btn text-primary sm:hidden"
                              >
                                <!-- Remplacez par l'icône de votre choix -->
                                <EyeIcon class="size-4" />
                              </button>

                              <!-- Voir -->
                              <button 
                                v-if="verifyPermission('voir-un-suivi-indicateur')" 
                                title="Voir" 
                                @click="goToDetailSuivi(indicateur.id)" 
                                class="btn text-primary hidden sm:inline-flex"
                              >
                                Voir
                              </button>
                              <button 
                                v-if="verifyPermission('voir-un-suivi-indicateur')" 
                                title="Voir" 
                                @click="goToDetailSuivi(indicateur.id)" 
                                class="btn text-primary sm:hidden"
                              >
                                <!-- Remplacez par l'icône de votre choix -->
                                <SearchIcon class="size-4" />
                              </button>

                              <!-- Ajouter Structure -->
                              <button 
                                v-if="verifyPermission('voir-un-suivi-indicateur')" 
                                title="Ajouter Structure" 
                                @click="handleStructure(indicateur.id)" 
                                class="btn text-primary"
                              >
                                <span class="hidden sm:inline">Ajouter une structure</span>
                                <span class="sm:hidden">Structure</span>
                              </button>

                              <!-- Ajouter Année Cible -->
                              <button 
                                v-if="verifyPermission('voir-un-suivi-indicateur')" 
                                title="Ajouter Structure" 
                                @click="handleYearCible(indicateur)" 
                                class="btn text-primary"
                              >
                                <span class="hidden sm:inline">Ajouter une année cible</span>
                                <span class="sm:hidden">Année</span>
                              </button>

                              <!-- Modifier -->
                              <button 
                                v-if="verifyPermission('supprimer-un-suivi-indicateur')" 
                                title="Modifier" 
                                @click="handleEdit(indicateur)" 
                                class="btn text-pending"
                              >
                                <Edit3Icon class="size-4 sm:size-5" />
                              </button>

                              <!-- Supprimer -->
                              <button 
                                v-if="verifyPermission('supprimer-un-suivi-indicateur')" 
                                title="Supprimer" 
                                @click="handleDelete(indicateur)" 
                                class="btn text-danger"
                              >
                                <TrashIcon class="size-4 sm:size-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </template>
                      <template v-for="(result, i) in result.categories" :key="result.id">
                        <tr class="uppercase" v-if="result.indicateurs && result.indicateurs.length > 0" :class="[result.type == 'produit' ? 'text-black' : 'text-white']" :style="{ 'background-color': findColorCadreMesure(result.type) }">
                          <td :colspan="14 + years.length * 2" class="font-semibold">{{ result.type }} {{ result.indice }}</td>
                        </tr>
                        <template v-for="(indicateur, j) in result.indicateurs" :key="indicateur.id">
                          <tr>
                            <!-- Première colonne fixe -->
                            <td class="font-semibold sticky-column" v-if="j === 0" :rowspan="result.indicateurs.length" style="left: 0">
                              {{ result.nom }}
                            </td>

                            <!-- Deuxième colonne fixe -->
                            <td class="font-semibold sticky-column-second" style="left: 500px">Ind {{ indicateur.code }}</td>

                            <!-- Troisième colonne fixe -->
                            <td class="">
                              {{ indicateur.nom }}
                            </td>

                            <!-- Colonnes restantes -->
                            <td>{{ indicateur.description ?? "" }}</td>
                            <td class="p-2">
                          <div class="text-center">
                            <div class="font-medium text-gray-700" v-html="formatObject(indicateur.valeurDeBase)"></div>
                            <div class="text-xs text-gray-500 mt-1">Base</div>
                          </div>
                        </td>
                            <td v-for="(year, index) in years" :key="index">
                              <span v-html="formatObject(indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeurCible)"></span>
                            </td>
                            <td class="p-2">
                          <div class="text-center">
                            <div class="font-bold text-green-700" v-html="formatObject(indicateur.valeurCibleTotal)"></div>
                            <div class="text-xs text-gray-500 mt-1">Total Cible</div>
                          </div>
                        </td>
                            <td v-for="(year, index) in years" :key="index">
                              <span v-html="formatObject(indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeur_realiser)"></span>
                            </td>
                            <td class="p-2">
                          <div class="text-center">
                            <div class="font-bold text-blue-700" v-html="formatObject(indicateur.valeurRealiserTotal)"></div>
                            <div class="text-xs text-gray-500 mt-1">Total Réalisé</div>
                          </div>
                        </td>
                            <td class="p-3">
                          <div class="flex items-center space-x-2">
                            <div class="flex-1">
                              <div class="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  class="h-2 rounded-full transition-all duration-300"
                                  :class="getProgressBarClass(indicateur.taux_realisation?.moy || 0)"
                                  :style="{ width: Math.min(100, Math.max(0, parseFloat(indicateur.taux_realisation?.moy || 0))) + '%' }"
                                ></div>
                              </div>
                            </div>
                            <div class="text-sm font-semibold min-w-[50px]" :class="getPerformanceTextClass(indicateur.taux_realisation?.moy || 0)">
                              {{ Math.round(parseFloat(indicateur.taux_realisation?.moy || 0)) }}%
                            </div>
                          </div>
                        </td>
                            <td>{{ indicateur.sources_de_donnee }}</td>
                            <td>{{ indicateur.hypothese }}</td>
                            <td>{{ indicateur.methode_de_la_collecte }}</td>
                            <td>{{ indicateur.frequence_de_la_collecte }}</td>
                            <td>
                              <span v-html="formatResponsable(indicateur.organisations_responsable)"></span><br />
                              {{ indicateur.ug_responsable?.nom ?? "" }}
                              {{}}
                            </td>
                           <td class="space-x-1">
                              <div class="flex items-center space-x-1">
                                <!-- Version desktop - texte complet -->
                                <button v-if="verifyPermission('creer-un-suivi-indicateur')" title="Suivre" @click="handleSuivi(indicateur)" class="btn text-primary hidden sm:inline-flex">
                                  Suivre
                                </button>
                                <button v-if="verifyPermission('voir-un-suivi-indicateur')" title="Voir" @click="goToDetailSuivi(indicateur.id)" class="btn text-primary hidden sm:inline-flex">
                                  Voir
                                </button>
                                
                                <!-- Version mobile - icônes seulement -->
                                <button v-if="verifyPermission('creer-un-suivi-indicateur')" title="Suivre" @click="handleSuivi(indicateur)" class="btn text-primary sm:hidden">
                                  <EyeIcon class="size-4" />
                                </button>
                                <button v-if="verifyPermission('voir-un-suivi-indicateur')" title="Voir" @click="goToDetailSuivi(indicateur.id)" class="btn text-primary sm:hidden">
                                  <SearchIcon class="size-4" />
                                </button>

                                <!-- Boutons avec texte réduit sur mobile -->
                                <button v-if="verifyPermission('voir-un-suivi-indicateur')" title="Ajouter Structure" @click="handleStructure(indicateur.id)" class="btn text-primary">
                                  <span class="hidden sm:inline">Structure</span>
                                  <span class="sm:hidden">Str</span>
                                </button>

                                <button v-if="verifyPermission('voir-un-suivi-indicateur')" title="Ajouter Structure" @click="handleYearCible(indicateur)" class="btn text-primary">
                                  <span class="hidden sm:inline">Année cible</span>
                                  <span class="sm:hidden">Année</span>
                                </button>

                                <button v-if="verifyPermission('supprimer-un-suivi-indicateur')" title="Modifier" @click="handleEdit(indicateur)" class="btn text-pending">
                                  <Edit3Icon class="size-4 sm:size-5" />
                                </button>

                                <button v-if="verifyPermission('supprimer-un-suivi-indicateur')" title="Supprimer" @click="handleDelete(indicateur)" class="btn text-danger">
                                  <TrashIcon class="size-4 sm:size-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        </template>
                      </template>
                    </template>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </TabPanel>

      <TabPanel>
        <div class="w-full max-w-6xl mx-auto p-6">
          <!-- Select d'indicateur -->
          <div class="mb-8">
            <label class="block text-base font-semibold mb-3 text-gray-700">
              📊 Sélectionner un indicateur pour visualiser son évolution
            </label>
            <select 
              v-model="selectedIndicateurId" 
              class="w-full p-4 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="">-- Choisir un indicateur --</option>
              <optgroup 
                v-for="(group, key) in indicateursGroupes" 
                :key="key" 
                :label="key"
                class="font-semibold"
              >
                <option 
                  v-for="ind in group" 
                  :key="ind.id" 
                  :value="ind.id"
                  class="py-2"
                >
                  {{ ind.code }} - {{ ind.nom }}
                </option>
              </optgroup>
            </select>
          </div>

          <!-- Contenu affiché seulement si un indicateur est sélectionné -->
          <div v-if="indicateurSelectionne" class="space-y-6 animate-fade-in">
            <!-- Carte d'information de l'indicateur -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md border border-blue-100">
              <h3 class="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <span class="text-blue-600">📈</span>
                {{ indicateurSelectionne.nom }}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div class="bg-white p-3 rounded-lg shadow-sm">
                  <span class="font-semibold text-gray-600">Catégorie:</span>
                  <p class="text-gray-800 mt-1">{{ indicateurSelectionne.categoriePath }}</p>
                </div>
                <div class="bg-white p-3 rounded-lg shadow-sm">
                  <span class="font-semibold text-gray-600">Code:</span>
                  <p class="text-gray-800 mt-1">{{ indicateurSelectionne.code }}</p>
                </div>
                <div class="bg-white p-3 rounded-lg shadow-sm">
                  <span class="font-semibold text-gray-600">Unité de mesure:</span>
                  <p class="text-gray-800 mt-1">{{ indicateurSelectionne.unitee_mesure.nom }}</p>
                </div>
                <div class="bg-white p-3 rounded-lg shadow-sm">
                  <span class="font-semibold text-gray-600">Type de variable:</span>
                  <p class="text-gray-800 mt-1 capitalize">{{ indicateurSelectionne.type_de_variable }}</p>
                </div>
                <div class="bg-white p-3 rounded-lg shadow-sm">
                  <span class="font-semibold text-gray-600">Agrégé:</span>
                  <p class="text-gray-800 mt-1">
                    <span v-if="indicateurSelectionne.agreger" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Oui
                    </span>
                    <span v-else class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      ✗ Non
                    </span>
                  </p>
                </div>
                <div class="bg-white p-3 rounded-lg shadow-sm">
                  <span class="font-semibold text-gray-600">Année de base:</span>
                  <p class="text-gray-800 mt-1">{{ indicateurSelectionne.anneeDeBase || 'N/A' }}</p>
                </div>
                <div class="bg-white p-3 rounded-lg shadow-sm col-span-full">
                  <span class="font-semibold text-gray-600">Hypothèse:</span>
                  <p class="text-gray-800 mt-1">{{ indicateurSelectionne.hypothese }}</p>
                </div>
                <div class="bg-white p-3 rounded-lg shadow-sm col-span-full">
                  <span class="font-semibold text-gray-600">Source de données:</span>
                  <p class="text-gray-800 mt-1">{{ indicateurSelectionne.sources_de_donnee }}</p>
                </div>
              </div>
            </div>

            <!-- Graphique d'évolution -->
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h4 class="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span class="text-green-600">📊</span>
                Évolution des valeurs cibles et réalisées au fil du temps
              </h4>
              <ChartDetailIndicateur :data="indicateurSelectionne.valeursCible" />
            </div>
          </div>

          <!-- Message si aucun indicateur sélectionné -->
          <div v-else class="text-center py-20">
            <div class="inline-block p-8 bg-gray-50 rounded-2xl">
              <svg class="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <p class="text-gray-600 text-lg font-medium">
                Sélectionnez un indicateur pour visualiser son évolution
              </p>
              <p class="text-gray-500 text-sm mt-2">
                Utilisez le menu déroulant ci-dessus pour choisir parmi {{ indicateursPlats.length }} indicateur(s) disponible(s)
              </p>
            </div>
          </div>
        </div>
      </TabPanel>
    </TabPanels>
  </TabGroup>

  <!-- Modal for creating/updating -->
  <Modal size="modal-lg" backdrop="static" :show="showModalEdit" @hidden="showModalEdit = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Modifier un indicateur</h2>
    </ModalHeader>
    <form @submit.prevent="submitUpdate">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <InputForm class="flex-1" :control="getFieldErrors(errors.nom)" label="Nom" v-model="payloadUpdate.nom" />
            <div class="flex-1">
              <label class="form-label" for="description">Description</label>
              <div class="">
                <textarea name="description" class="form-control" id="description" v-model="payloadUpdate.description" cols="30" rows="1"></textarea>
              </div>
              <div v-if="errors.description" class="mt-2 text-danger">{{ getFieldErrors(errors.description) }}</div>
            </div>
          </div>

          <div class="flex-1">
            <label class="form-label">Type de données</label>
            <TomSelect v-model="payloadUpdate.type_de_variable" name="type_variable" :options="{ placeholder: 'Selectionez un type de données' }" class="w-full">
              <option value=""></option>
              <option v-for="(variable, index) in isAgregerCurrentIndicateur ? type_variablees : type_variablees_agreger" :key="index" :value="variable.id">{{ variable.label }}</option>
            </TomSelect>
            <div v-if="errors.type_de_variable" class="mt-2 text-danger">{{ getFieldErrors(errors.type_de_variable) }}</div>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <InputForm class="flex-1" label="Indice" v-model="payloadUpdate.indice" :required="false" :control="getFieldErrors(errors.indice)" type="number" />
            <div class="flex-1">
              <label class="form-label">Année de base</label>
              <TomSelect v-model="payloadUpdate.anneeDeBase" name="annee_suivi" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
                <option value=""></option>
                <option v-for="annee in years" :key="annee" :value="annee">{{ annee }}</option>
              </TomSelect>
              <div v-if="errors.anneeDeBase" class="mt-2 text-danger">{{ getFieldErrors(errors.anneeDeBase) }}</div>
            </div>

            <!-- <InputForm v-if="!isAgregerCurrentIndicateur" class="flex-1" label="Valeur de base" :required="false" :control="getFieldErrors(errors.valeurDeBase)" v-model="payloadNotAgreger.valeurDeBase" type="number" /> -->
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex-1">
              <label class="form-label">Unité de mesure</label>
              <TomSelect v-model="payloadUpdate.uniteeMesureId" name="unite" :options="{ placeholder: 'Selectionez une unité de mesure' }" class="w-full">
                <option value=""></option>
                <option v-for="(unite, index) in unites" :key="index" :value="unite.id">{{ unite.nom }}</option>
              </TomSelect>
              <div v-if="errors.uniteeMesureId" class="mt-2 text-danger">{{ getFieldErrors(errors.uniteeMesureId) }}</div>
            </div>
            <div class="flex-1">
              <label class="form-label">Catégorie d'Impact</label>
              <TomSelect v-model="payloadUpdate.categorieId" name="category" :options="{ placeholder: 'Selectionez une catégorie' }" class="w-full">
                <option value=""></option>
                <option v-for="(categorie, index) in categories" :key="categorie.id" :value="categorie.id">{{ truncateText(categorie.type + " " + categorie.indice + " " + categorie.nom) }}</option>
              </TomSelect>
              <div v-if="errors.categorieId" class="mt-2 text-danger">{{ getFieldErrors(errors.categorieId) }}</div>
            </div>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex-1">
              <label class="form-label">Méthode de la collecte des données</label>
              <TomSelect v-model="payloadUpdate.methode_de_la_collecte" name="method" :options="{ placeholder: 'Selectionez une methode' }" class="w-full">
                <option value=""></option>
                <option v-for="(methode, index) in methodeCollecte" :key="index" :value="methode">{{ methode }}</option>
              </TomSelect>
              <div v-if="errors.methode_de_la_collecte" class="mt-2 text-danger">{{ getFieldErrors(errors.methode_de_la_collecte) }}</div>
            </div>
            <div class="flex-1">
              <label class="form-label">Fréquence de la collecte de données</label>
              <TomSelect v-model="payloadUpdate.frequence_de_la_collecte" :options="{ placeholder: 'Selectionez une fréquence' }" class="w-full">
                <option value=""></option>
                <option v-for="(frequence, index) in frequenceCollecte" :key="index" :value="frequence">{{ frequence }}</option>
              </TomSelect>
              <div v-if="errors.frequence_de_la_collecte" class="mt-2 text-danger">{{ getFieldErrors(errors.frequence_de_la_collecte) }}</div>
            </div>
          </div>
          <div class="flex flex-wrap items-center justify-between w-full gap-3">
            <div class="flex-1">
              <label class="form-label">Source de données</label>
              <TomSelect v-model="payloadUpdate.sources_de_donnee" name="source" :options="{ placeholder: 'Selectionez une source' }" class="w-full">
                <option value=""></option>
                <option v-for="(source, index) in sourcesDonnees" :key="index" :value="source">{{ source }}</option>
              </TomSelect>
              <div v-if="errors.sources_de_donnee" class="mt-2 text-danger">{{ getFieldErrors(errors.sources_de_donnee) }}</div>
            </div>
          </div>
          <div class="flex flex-wrap items-center justify-between w-full gap-3">
            <div class="flex-1">
              <label class="form-label" for="hypothese_update">Hypothèses et risques</label>
              <div class="">
                <textarea name="hypothese" class="form-control" id="hypothese_update" v-model="payloadUpdate.hypothese" cols="30" rows="3" placeholder="Décrivez les hypothèses et risques liés à cet indicateur"></textarea>
              </div>
              <div v-if="errors.hypothese" class="mt-2 text-danger">{{ getFieldErrors(errors.hypothese) }}</div>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="closeUpdateModal()" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" label="Modifier" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <!-- Modal for Structure -->
  <Modal size="modal-lg" backdrop="static" :show="showModalStructure" @hidden="showModalStructure = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Ajouter une structure</h2>
    </ModalHeader>
    <form @submit.prevent="submitStructure">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <div v-if="errors[0]" class="mt-2 text-danger">{{ getFieldErrors(errors[0]) }}</div>
          <div v-if="errors[1]" class="mt-2 text-danger">{{ getFieldErrors(errors[1]) }}</div>
          <div v-if="errors[2]" class="mt-2 text-danger">{{ getFieldErrors(errors[2]) }}</div>

          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex-1">
              <label class="form-label">UG</label>
              <TomSelect v-model="responsablesForm.ug" name="ug" :options="{ placeholder: 'Selectionez un UG' }" class="w-full">
                <option value=""></option>
                <option v-for="(ug, index) in ugs" :key="index" :value="ug.id">{{ ug.nom }}</option>
              </TomSelect>
              <div v-if="errors.responsables" class="mt-2 text-danger">{{ getFieldErrors(errors.responsables) }}</div>
            </div>
            <div class="flex-1">
              <label class="form-label">Organisation</label>
              <TomSelect v-model="responsablesForm.organisations" name="responsable" multiple :options="{ placeholder: 'Selectionez un responsable' }" class="w-full">
                <option value=""></option>
                <option v-for="(responsable, index) in ongs" :key="index" :value="responsable.id">{{ responsable.nom }}</option>
              </TomSelect>
              <div v-if="errors.responsables" class="mt-2 text-danger">{{ getFieldErrors(errors.responsables) }}</div>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetFormAddStructure" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" label="Modifier" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <!-- Modal for YearCible -->
  <Modal size="modal-lg" backdrop="static" :show="showModalYearCible" @hidden="showModalYearCible = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Ajouter années cibles</h2>
    </ModalHeader>
    <form @submit.prevent="submitYearCible">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetFormAddYearCible" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" label="Modifier" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <!-- SUIVIE  -->
  <Modal size="modal-lg" backdrop="static" :show="showModalSuivi" @hidden="showModalSuivi = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Enregistrer un suivi</h2>
    </ModalHeader>
    <form @submit.prevent="submitSuivi">
      <ModalBody>
        <div class="grid grid-cols-1 gap-5">
          <div class="flex-1">
            <label class="form-label">Année de suivi<span class="text-danger">*</span> </label>
            <TomSelect v-model="payloadSuivi.annee" name="annee_suivi" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option value=""></option>
              <option v-for="annee in years" :key="annee" :value="annee">{{ annee }}</option>
            </TomSelect>
            <div v-if="errors.annee" class="mt-2 text-danger">{{ getFieldErrors(errors.annee) }}</div>
          </div>
          <!-- <InputForm label="Année de suivi" class="flex-1" v-model="payloadSuivi.annee" :control="getFieldErrors(errors.annee)" type="number" /> -->
          <div v-if="!isAgregerCurrentIndicateur" class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex-1">
              <InputForm 
                label="Valeur cible" 
                v-model="payloadSuivi.valeurCible" 
                :control="getFieldErrors(errors.valeurCible)" 
                type="number" 
                :disabled="shouldDisableValeurCible || shouldDisableAgregerFields"
                :class="{ 'opacity-60': shouldDisableValeurCible }"
              />
             
            </div>
            
            <InputForm label="Valeur réalisée" class="flex-1" v-model="payloadSuivi.valeurRealise" :control="getFieldErrors(errors.valeurRealise)" type="number" />
          </div>
           <p v-if="shouldDisableValeurCible" class="mt-1 text-xs text-blue-600">
                ℹ️ Valeur cible existante pour cette année (non modifiable)
              </p>
              <p v-else class="mt-1 text-xs text-gray-500">
                ✏️ Aucune valeur cible pour cette année, vous pouvez en saisir une
              </p>

          <div v-if="valueKeysIndicateurSuivi.length > 0 && isAgregerCurrentIndicateur" class="">
            <label class="form-label">Valeur Cible <span class="text-danger">*</span> </label>
            <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
              <div v-for="(base, index) in valueKeysIndicateurSuivi" :key="index" class="input-group">
                <div class="flex items-center justify-center text-sm truncate input-group-text">{{ base.libelle }}</div>
                <input 
                  type="number" 
                  class="form-control" 
                  :disabled="shouldDisableValeurCible || shouldDisableNonAgregerFields" 
                  :class="{ 'opacity-60': shouldDisableValeurCible }"
                  v-model.number="valeurCible.find((item) => item.keyId === base.id).value" 
                  @input="updateValueCible(base.id, $event.target.value)" 
                  placeholder="valeur cible" 
                  aria-label="valeur" 
                  aria-describedby="input-group-valeur" 
                />
              </div>
            </div>
            <p v-if="shouldDisableValeurCible" class="mt-1 text-xs text-blue-600">
              ℹ️ Valeurs cibles existantes pour cette année (non modifiables)
            </p>
            <p v-else class="mt-1 text-xs text-gray-500">
              ✏️ Aucune valeur cible pour cette année, vous pouvez en saisir
            </p>
            <div v-if="errors.valeurCible" class="mt-2 text-danger">{{ getFieldErrors(errors.valeurCible) }}</div>
          </div>
          <div v-if="valueKeysIndicateurSuivi.length > 0 && isAgregerCurrentIndicateur" class="">
            <label class="form-label">Valeur Réalisée <span class="text-danger">*</span> </label>
            <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
              <div v-for="(base, index) in valueKeysIndicateurSuivi" :key="index" class="input-group">
                <div class="flex items-center justify-center text-sm truncate input-group-text">{{ base.libelle }}</div>
                <input type="number" class="form-control" v-model.number="valeurRealise.find((item) => item.keyId === base.id).value" @input="updateValueRealiser(base.id, $event.target.value)" placeholder="valeur réalisée" aria-label="valeur" aria-describedby="input-group-valeur" />
              </div>
            </div>
            <div v-if="errors.valeurRealise" class="mt-2 text-danger">{{ getFieldErrors(errors.valeurRealise) }}</div>
          </div>

          <div class="flex-1">
            <label>Suivi par date ou trimestre?</label>
            <div class="flex flex-col gap-3 mt-2 sm:flex-row">
              <div v-for="(item, index) in optionsSuivi" :key="index" class="mr-2 form-check">
                <input :id="item.id" class="form-check-input" type="radio" name="option_suivi" v-model="suiviOption" :value="item.id" />
                <label class="form-check-label" :for="item.id">{{ item.label }}</label>
              </div>
            </div>
          </div>
          <div v-if="suiviOption == 'trimestre'" class="flex-1">
            <label class="form-label">Trimestre<span class="text-danger">*</span> </label>
            <TomSelect v-model="payloadSuivi.trimestre" name="trimestre_suivi" :options="{ placeholder: 'Selectionez un trimestre' }" class="w-full">
              <option value=""></option>
              <option v-for="trimestre in trimestres" :key="trimestre" :value="trimestre">Trimestre {{ trimestre }}</option>
            </TomSelect>
            <div v-if="errors.trimestre" class="mt-2 text-danger">{{ getFieldErrors(errors.trimestre) }}</div>
          </div>

          <InputForm v-else label="Date de suivi" class="flex-1" v-model="payloadSuivi.dateSuivie" :control="getFieldErrors(errors.dateSuivie)" type="date" />
          <div class="flex-1">
            <label class="form-label">Source de données <span class="text-danger">*</span> </label>
            <TomSelect v-model="payloadSuivi.sources_de_donnee" name="source" :options="{ placeholder: 'Selectionez une source' }" class="w-full">
              <option value=""></option>
              <option v-for="(source, index) in sourcesDonnees" :key="index" :value="source">{{ source }}</option>
            </TomSelect>
            <div v-if="errors.sources_de_donnee" class="mt-2 text-danger">{{ getFieldErrors(errors.sources_de_donnee) }}</div>
          </div>
          <div class="flex-1">
            <label class="form-label" for="description">Commentaire</label>
            <div class="">
              <textarea name="description" class="form-control" id="description" v-model="payloadSuivi.commmentaire" cols="30" rows="2"></textarea>
            </div>
            <div v-if="errors.commmentaire" class="mt-2 text-danger">{{ getFieldErrors(errors.commmentaire) }}</div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetFormSuivi" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" label="Enrégistrer" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <!-- Modal for deleting -->
  <Modal :show="deleteModalPreview" @hidden="closeDeleteModal">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-lg">{{ nameSelect }}</div>
        <div class="mt-2 text-slate-500">Supprimer l'indicateur?</div>
      </div>
      <div class="flex justify-center gap-3 py-4">
        <button type="button" @click="cancelDelete" class="btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>

  <AddYearCibleIndicateur v-show="showModalAddYear" v-model:showModalCreate="showModalAddYear" :currentIndicateur="currentIndicateur" />
</template>

<script setup>
import { computed, onMounted, reactive, ref , watch } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import IndicateursService from "@/services/modules/indicateur.service";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { findColorCadreMesure } from "../utils/findColorIndicator";
import { sourcesDonnees, frequenceCollecte, methodeCollecte, type_variablees, type_variablees_agreger } from "../utils/constants";
import { useRouter } from "vue-router";
import { getFieldErrors } from "../utils/helpers";
import ExportationIndicateur from "./news/ExportationIndicateur.vue";
import verifyPermission from "@/utils/verifyPermission";
import AddYearCibleIndicateur from "./AddYearCibleIndicateur.vue";
import ChartDetailIndicateur from "./news/ChartDetailIndicateur.vue";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// ANCIENNE VERSION
// const emit = defineEmits(["refreshData", "update-datas"]);

// NOUVELLE VERSION - Ajout de edit-indicator
const emit = defineEmits(["refreshData", "update-datas", "edit-indicator"]);


const getCurrentQuarter = function () {
  const month = new Date().getMonth() + 1; // Les mois sont indexés à partir de 0
  return Math.ceil(month / 3); // Calcul du trimestre actuel
}

const props = defineProps({
  data: Array,
  years: Array,
  ongs: {
    type: Array,
    required: false,
    default: [],
  },
  ugs: {
    type: Array,
    required: false,
    default: [],
  },
  unites: {
    type: Array,
    required: false,
    default: [],
  },
  categories: {
    type: Array,
    required: false,
    default: [],
  },
  propSites: {
    type: Array,
    required: false,
    default: [],
  },
});

const data2 = ref([]);

 

// Version alternative si vous voulez plus de contrôle sur les couleurs
const generatePDFAdvanced = () => {
  
  const doc = new jsPDF({ 
    orientation: "landscape", 
    format: "a0",
    unit: 'mm'
  });

  const pageWidth = doc.internal.pageSize.width;
  

  // Get current date and time
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();

  // Add date and time to the top right corner
  doc.setFontSize(12);
  const dateTimeStr = `Générer le: ${dateStr} à ${timeStr}`;
  const textXOffset = pageWidth - doc.getTextWidth(dateTimeStr) - 10;
  doc.text(dateTimeStr, textXOffset, 10);


  // Récupérer les données du tableau depuis le DOM
  const table = document.getElementById('my-table');
  const rows = [];
  const headers = [];

  // Extraire les en-têtes
  const headerRows = table.querySelectorAll('thead tr');
  headerRows.forEach(row => {
    const headerRow = [];
    row.querySelectorAll('th').forEach(th => {
      headerRow.push({
        content: th.textContent.trim(),
        colSpan: th.colSpan || 1,
        rowSpan: th.rowSpan || 1
      });
    });
    headers.push(headerRow);
  });

  // Extraire les données du corps
  const bodyRows = table.querySelectorAll('tbody tr');
  bodyRows.forEach(row => {
    const rowData = [];
    const backgroundColor = row.style.backgroundColor;
    const textColor = window.getComputedStyle(row).color;
    
    row.querySelectorAll('td').forEach(td => {
      rowData.push({
        content: td.textContent.trim(),
        styles: {
          fillColor: backgroundColor ? hexToRgb(backgroundColor) : [255, 255, 255],
          textColor: textColor ? hexToRgb(textColor) : [0, 0, 0]
        }
      });
    });
    
    if (rowData.length > 0) {
      rows.push(rowData);
    }
  });

  // Fonction pour convertir hex/rgb en tableau RGB
  function hexToRgb(color) {
    if (color.startsWith('rgb')) {
      const matches = color.match(/\d+/g);
      return matches ? matches.map(Number) : [255, 255, 255];
    } else if (color.startsWith('#')) {
      const hex = color.substring(1);
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return [r, g, b];
    }
    return [255, 255, 255];
  }

  // Ajouter le titre
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text("Cadre logique", 14, 15);

  // Configuration du tableau
  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20,
    theme: 'plain',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [15, 52, 96],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    didParseCell: function(data) {
      // Appliquer les styles personnalisés pour chaque cellule
      if (data.row.raw && data.row.raw[data.column.index] && data.row.raw[data.column.index].styles) {
        Object.assign(data.cell.styles, data.row.raw[data.column.index].styles);
      }
    }
  });

  doc.save("cadre_logique_avance.pdf");
};



const router = useRouter();
const trimestres = [1, 2, 3, 4];
const optionsSuivi = [
  { label: "Par date", id: "date" },
  { label: "Par trimestre", id: "trimestre" },
];
const tableWrapper = ref(null);
const scrollWrapper = ref(null);
const scrollBar = ref(null);
const idSelect = ref("");
const nameSelect = ref("");
const valueKeysIndicateurSuivi = ref([]);
const currentIndicateur = ref({});
const isAgregerCurrentIndicateur = ref(false);
const showModalAddYear = ref(false);
const showModalSuivi = ref(false);
const showModalEdit = ref(false);
const showModalStructure = ref(false);
const showModalYearCible = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const errors = ref({});
const responsablesForm = ref({ organisations: [], ug: "" });
const payloadStructure = reactive({ responsables: responsablesForm.value });
const payloadYearCible = reactive({});
const updateIsAgreer = ref(false);
const payloadNotAgreger = reactive({
  valeurDeBase: "",
  anneesCible: [],
});

const indexAccordion = ref(0);
const indexAccordion2 = ref(0);

const payloadUpdate = reactive({
  nom: "",
  description: "",
  sources_de_donnee: "",
  methode_de_la_collecte: "",
  frequence_de_la_collecte: "",
  anneeDeBase: "",
  type_de_variable: "",
  categorieId: "",
  uniteeMesureId: "",
  indice: "",
  hypothese: "",
  // valeurDeBase: [],
});

const closeUpdateModal = () => {
  document.activeElement.blur();
  showModalEdit.value = false;
  
};
const payloadSuivi = reactive({
  annee: `${new Date().getFullYear()}`,
  trimestre: `${getCurrentQuarter()}`,
  valeurCible: "",
  valeurRealise: "",
  commmentaire: "",
  dateSuivie: "",
  indicateurId: "",
  sources_de_donnee: "",
});
const suiviOption = ref(optionsSuivi[0].id);
// État réactif pour stocker les valeurs des inputs
const valeurCible = ref([]);
const valeurRealise = ref([]);

// Computed pour déterminer si les champs doivent être désactivés (pour les champs non agrégés)
// Computed pour déterminer si les champs doivent être désactivés (pour les champs non agrégés)
const shouldDisableAgregerFields = computed(() => {
  // Cette logique est maintenant gérée par shouldDisableValeurCible pour le pré-remplissage
  // On retourne false pour ne pas interférer avec la saisie manuelle
  return false;
});

// Computed pour désactiver les champs de valeurs cibles agrégées
// Computed pour désactiver les champs de valeurs cibles agrégées
const shouldDisableNonAgregerFields = computed(() => {
  // Cette logique est maintenant gérée par shouldDisableValeurCible
  return false;
});

const goToDetailSuivi = (id) => {
  router.push({
    name: "Détail du suivi",
    params: { id },
  });
};
const updateValueCible = (keyId, newValue) => {
  const entry = valeurCible.value.find((item) => item.keyId === keyId);
  if (entry) {
    entry.value = newValue;
  }
};
const updateValueRealiser = (keyId, newValue) => {
  const entry = valeurRealise.value.find((item) => item.keyId === keyId);
  if (entry) {
    entry.value = newValue;
  }
};

const resetValues = () => {
  // Sauvegarder les valeurs actuelles avant de les réinitialiser
  const currentValeurCible = valeurCible.value;
  const currentValeurRealise = valeurRealise.value;

  valeurCible.value = valueKeysIndicateurSuivi.value.map((item) => ({
    keyId: item.id,
    value: (currentValeurCible && currentValeurCible.length > 0 && currentValeurCible[0] && currentValeurCible[0][item.key]) ? currentValeurCible[0][item.key] : "",
  }));
  valeurRealise.value = valueKeysIndicateurSuivi.value.map((item) => ({
    keyId: item.id,
    value: (currentValeurRealise && currentValeurRealise[item.key]) ? currentValeurRealise[item.key] : "",
  }));
};

const resetFormAddStructure = () => {
  document.activeElement.blur();
  responsablesForm.value.organisations = [];
  responsablesForm.value.ug = "";
  showModalStructure.value = false;
  errors.value = {};
};
const resetFormUpdate = () => {
  Object.keys(payloadUpdate).forEach((key) => {
    payloadUpdate[key] = "";
  });
  showModalEdit.value = false;
  // (payloadUpdate.responsables = { organisations: [], ug: "" }), (showModalEdit.value = false);
  errors.value = {};
};
const resetFormAddYearCible = () => {
  document.activeElement.blur();
  showModalYearCible.value = false;
  errors.value = {};
};
const resetFormSuivi = async () => {
  document.activeElement.blur();
  if (isAgregerCurrentIndicateur.value) {
    resetValues();
  }
  Object.keys(payloadSuivi).forEach((key) => {
    payloadSuivi[key] = "";
  });

  payloadSuivi['annee'] = `${new Date().getFullYear()}`;
  payloadSuivi['trimestre'] = `${getCurrentQuarter()}`;
  payloadSuivi['valeurCible'] = "";
  payloadSuivi['valeurRealise'] = "";
  payloadSuivi['commentaire'] = "";
  payloadSuivi['dateSuivie'] = "";
  payloadSuivi['indicateurId'] = "";
  payloadSuivi['sources_de_donnee'] = "";

  showModalSuivi.value = false;
  errors.value = {};
};
// Submit data (create or update)
const submitData = async () => {
  isLoading.value = true;
  const action = IndicateursService.createSuivi(payloadSuivi);
  try {
    await action;
    toast.success(`Suivi Ajouté avec succès.`);
    // getDatas();
    await resetFormSuivi();
    emit("refreshData");
  } catch (e) {
    toast.error(getAllErrorMessages(e));
  } finally {
    isLoading.value = false;
  }
};
const submitUpdate = async () => {
  isLoading.value = true;
  const action = IndicateursService.update(idSelect.value, payloadUpdate);
  try {
    await action;
    // getDatas();
    resetFormUpdate();
    toast.success(`Indicateur modifié avec succès.`);
    setTimeout(() => {
      emit("update-datas");
    }, 500);
  } catch (e) {
    if (e.response && e.response.status === 422) {
      errors.value = e.response.data.errors;
    } else {
      toast.error(getAllErrorMessages(e));
    }
  } finally {
    isLoading.value = false;
  }
};
const submitStructure = async () => {
 
  if (!payloadStructure.responsables.organisations.length && !payloadStructure.responsables.ug.length) return toast.error("Veuillez choisir au moins une structure");
  isLoading.value = true;
  const action = IndicateursService.addStructure(idSelect.value, payloadStructure);
  try {
    await action;
    toast.success(`Structure ajouté avec succès.`);
    // getDatas();
    resetFormAddStructure();
    setTimeout(() => {
      emit("update-datas");
    }, 500);
    showModalStructure.value = false;
  } catch (e) {
    if (e.response && e.response.status === 422) {
      errors.value = e.response.data.errors;
    } else {
      toast.error(getAllErrorMessages(e));
    }
  } finally {
    isLoading.value = false;
  }
};
const submitYearCible = async () => {
  isLoading.value = true;
  const action = IndicateursService.addYearsCible(idSelect.value, payloadYearCible);
  try {
    await action;
    toast.success(`Années cibles  ajouté avec succès.`);
    // getDatas();
    resetFormAddYearCible();
    showModalYearCible.value = false;
    setTimeout(() => {
      emit("update-datas");
    }, 500);
  } catch (e) {
    if (e.response && e.response.status === 422) {
      errors.value = e.response.data.errors;
    } else {
      toast.error(getAllErrorMessages(e));
    }
  } finally {
    isLoading.value = false;
  }
};
const submitSuivi = async () => {
  isLoading.value = true;
  payloadSuivi.trimestre = Number(payloadSuivi.trimestre);
  payloadSuivi.annee = Number(payloadSuivi.annee);
  if (optionsSuivi[0].id == suiviOption.value) {
    delete payloadSuivi.trimestre;
  } else {
    delete payloadSuivi.dateSuivie;
  }

  if (isAgregerCurrentIndicateur.value) {
    payloadSuivi.valeurCible = valeurCible.value;
    payloadSuivi.valeurRealise = valeurRealise.value;
  }

  const action = IndicateursService.createSuivi(payloadSuivi);
  try {
    await action;
    toast.success(`Suivi Ajouté avec succès.`);
    // getDatas();
    await resetFormSuivi();
    
    emit("refreshData");
  } catch (e) {
    if (e.response && e.response.status === 422) {
      errors.value = e.response.data.errors;
    } else {
      toast.error(getAllErrorMessages(e));
    }
  } finally {
    isLoading.value = false;
  }
};

// Delete data
const deleteData = async () => {
  try {
    isLoading.value = true;
    await IndicateursService.destroy(idSelect.value);
    toast.success("Indicateur supprimé avec succès.");
    // getDatas();

    setTimeout(() => {
      emit("update-datas");
    }, 500);
  } catch (e) {
    toast.error(getAllErrorMessages(e));
  } finally {
    isLoading.value = false;
    deleteModalPreview.value = false;
  }
};

 

// NOUVELLE VERSION - Émettre l'événement vers le parent pour utiliser IndicatorForm
const handleEdit = (data) => {
  
  emit("edit-indicator", data);
};

// Ref pour gérer l'état disabled du champ valeur cible
const shouldDisableValeurCible = ref(false);

// Stocker les données de l'indicateur pour le watcher
const currentIndicateurData = ref(null);

// Fonction pour pré-remplir la valeur cible basée sur l'année
const preremplirValeurCible = (data, annee) => {
  if (!data) return;

  // Filtrer les valeurs cibles pour l'année sélectionnée
  const valeursCibleFiltered = data.valeursCible.filter(
    (vc) => vc.annee === Number(annee)
  );

  const valeurCibleTrouvee = valeursCibleFiltered.length > 0 ? valeursCibleFiltered[0].valeurCible : null;
  const existeValeur = valeurCibleTrouvee && Object.keys(valeurCibleTrouvee).length > 0;

  if (data.agreger) {
    // Cas AGRÉGÉ
    if (existeValeur) {
      // Pré-remplir les champs agrégés
      valeurCible.value = data.value_keys.map((keyItem) => ({
        keyId: keyItem.id,
        value: valeurCibleTrouvee[keyItem.key] !== undefined ? valeurCibleTrouvee[keyItem.key] : ""
      }));
      shouldDisableValeurCible.value = true;
    } else {
      // Réinitialiser les champs agrégés (vide)
      valeurCible.value = data.value_keys.map((keyItem) => ({
        keyId: keyItem.id,
        value: ""
      }));
      shouldDisableValeurCible.value = false;
    }
  } else {
    // Cas NON AGRÉGÉ
    if (existeValeur) {
      // Extraire la première valeur
      const firstKey = Object.keys(valeurCibleTrouvee)[0];
      payloadSuivi.valeurCible = valeurCibleTrouvee[firstKey];
      shouldDisableValeurCible.value = true;
    } else {
      // Objet vide ou null
      payloadSuivi.valeurCible = null;
      shouldDisableValeurCible.value = false;
    }
  }
};

// Watcher pour détecter le changement d'année
watch(() => payloadSuivi.annee, (newAnnee) => {
  if (currentIndicateurData.value && newAnnee) {
    preremplirValeurCible(currentIndicateurData.value, newAnnee);
  }
});

const handleSuivi = (data) => {
  // Stocker les données de l'indicateur pour le watcher
  currentIndicateurData.value = data;
  
  // Initialiser l'année par défaut si elle n'est pas définie
  if (!payloadSuivi.annee) {
    payloadSuivi.annee = new Date().getFullYear();
  }
  
  // Initialiser les métadonnées de l'indicateur
  payloadSuivi.indicateurId = data.id;
  valueKeysIndicateurSuivi.value = data.value_keys;
  isAgregerCurrentIndicateur.value = data.agreger;

  // Réinitialiser les valeurs (crée la structure vide pour les tableaux valeurCible et valeurRealise)
  resetValues();

  // Pré-remplir la valeur cible pour l'année actuelle
  // Cela écrasera les valeurs vides de resetValues si des données existent
  preremplirValeurCible(data, payloadSuivi.annee);
  
  showModalSuivi.value = true;
};

// Fonction pour aplatir la structure hiérarchique des indicateurs
const flattenIndicateurs = (data) => {
  const result = [];
  
  const traverse = (items, parentPath = []) => {
    items.forEach(item => {
      // Chemin hiérarchique pour le groupement visuel
      const currentPath = [...parentPath, item.nom];
      
      // Ajouter les indicateurs directs
      if (item.indicateurs && item.indicateurs.length > 0) {
        item.indicateurs.forEach(ind => {
          result.push({
            ...ind,
            categoriePath: currentPath.join(' > '), // Ex: "yiuyyiyi > poiîojkhjkh"
            categorieNom: item.nom,
            categorieType: item.type,
            categorieCode: item.code
          });
        });
      }
      
      // Parcourir les sous-catégories récursivement
      if (item.categories && item.categories.length > 0) {
        traverse(item.categories, currentPath);
      }
    });
  };
  
  traverse(data);
  return result;
};

// Computed pour obtenir tous les indicateurs aplatis
const indicateursPlats = computed(() => {
  return flattenIndicateurs(props.data);
});

// Computed pour grouper les indicateurs par catégorie (pour le select)
const indicateursGroupes = computed(() => {
  return indicateursPlats.value.reduce((acc, ind) => {
    const key = ind.categoriePath;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ind);
    return acc;
  }, {});
});

// Ref pour l'indicateur sélectionné dans le select
const selectedIndicateurId = ref('');

// Computed pour obtenir l'indicateur sélectionné complet
const indicateurSelectionne = computed(() => {
  return indicateursPlats.value.find(ind => ind.id === selectedIndicateurId.value);
});

// Handle delete action
const handleDelete = (data) => {
  idSelect.value = data.id;
  nameSelect.value = data.nom;
  deleteModalPreview.value = true;
};
const handleYearCible = (data) => {
  currentIndicateur.value = data;
  idSelect.value = data.id;
  showModalAddYear.value = true;
};
const handleStructure = (id) => {
  idSelect.value = id;
  showModalStructure.value = true;
};

const cancelDelete = () => {
  document.activeElement.blur();
  idSelect.value = "";
  deleteModalPreview.value = false;
};
const truncateText = (text, maxLength = 100) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};
const closeModal = () => {
  document.activeElement.blur();
  showModalEdit.value = false
} 
const closeDeleteModal = () => (deleteModalPreview.value = false);

function formatResponsable(responsable) {
  return responsable.map((item) => item.nom).join("<br>");
}

function formatObject(obj) {
  if (!obj) return "";
  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${value}`)
    .join("<br>");
}

// Fonctions pour les couleurs et styles des barres de progression
const getProgressBarClass = (rate) => {
  const percentage = parseFloat(rate || 0);
  if (percentage >= 100) return 'bg-green-500';
  if (percentage >= 80) return 'bg-blue-500';
  if (percentage >= 60) return 'bg-yellow-500';
  if (percentage >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

const getPerformanceTextClass = (rate) => {
  const percentage = parseFloat(rate || 0);
  if (percentage >= 100) return 'text-green-600';
  if (percentage >= 80) return 'text-blue-600';
  if (percentage >= 60) return 'text-yellow-600';
  if (percentage >= 40) return 'text-orange-600';
  return 'text-red-600';
};

const getPerformanceBadge = (rate) => {
  const percentage = parseFloat(rate || 0);
  if (percentage >= 100) return { text: 'Excellent', class: 'bg-green-100 text-green-800' };
  if (percentage >= 80) return { text: 'Bon', class: 'bg-blue-100 text-blue-800' };
  if (percentage >= 60) return { text: 'Moyen', class: 'bg-yellow-100 text-yellow-800' };
  if (percentage >= 40) return { text: 'Faible', class: 'bg-orange-100 text-orange-800' };
  return { text: 'Critique', class: 'bg-red-100 text-red-800' };
};
</script>

<style scoped>
table td {
  border: 1px solid white;
  padding-block: 8px;
}

/* Amélioration des cellules avec des transitions */
table td {
  transition: background-color 0.2s ease;
}

table td:hover {
  background-color: #f8fafc;
}

/* Style pour les badges de performance */
.performance-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

/* Animation pour les barres de progression */
.progress-bar {
  transition: width 0.3s ease-in-out;
}

/* Optionnel : Ajout d'une bordure pour les colonnes fixes */
.sticky-column,
.sticky-column-second,
.stick-column-third {
  border-right: 1px solid #f3f3f3;
}

.table-container {
  position: relative;
  max-height: 75vh;
  overflow: hidden;
}

.table-wrapper {
  overflow-y: auto;
  overflow-x: auto;
  max-height: calc(75vh - 20px);
}

.sticky-header {
  background-color: rgb(15 52 96) !important;
}

.sticky-heade {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  z-index: 1;
  border-bottom: 2px solid #ddd;
  padding: 10px;
  text-align: left;
}

/* Fixe l'en-tête du tableau */
.editor_listing_table thead th {
  position: sticky;
  top: 0;
  background-color: #ffffff;
  z-index: 10;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0);
}

/* Style des colonnes collantes */
.sticky-column {
  position: sticky;
  left: 0;
  background-color: #ffffff;
  z-index: 5;
  border-right: 1px solid #ccc;
}

.sticky-column-second {
  position: sticky;
  left: 500px;
  background-color: #ffffff;
  z-index: 5;
  border-right: 1px solid #ccc;
}

.sticky-column-third {
  position: sticky;
  left: 580px;
  background-color: #ffffff;
  z-index: 5;
  border-right: 1px solid #ccc;
}

/* Amélioration des bordures */
.editor_listing_table td,
.editor_listing_table th {
  border: 1px solid #e5e7eb;
}

/* Style pour les lignes d'en-tête de type */
tr[data-result-type] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  font-weight: bold;
}

/* Style pour améliorer la lisibilité */
.editor_listing_table tbody tr:nth-child(even) {
  background-color: #f9fafb;
}

.editor_listing_table tbody tr:hover {
  background-color: #f3f4f6;
  transition: background-color 0.2s ease;
}

/* Style pour les cellules numériques */
.numeric-cell {
  font-family: 'Courier New', monospace;
  text-align: right;
}

/* Amélioration des boutons d'action */
.action-buttons {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.action-buttons:hover {
  opacity: 1;
}
</style>
