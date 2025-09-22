<template>
  <div class="form-builder-container">
    <!-- Loader moderne pour chargement initial -->
    <div v-if="isLoading && initialLoading" class="modern-loader-overlay">
      <div class="modern-loader-container">
        <!-- Loader principal avec animation complexe -->
        <div class="loader-main">
          <div class="loader-rings">
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
            <div class="ring ring-3"></div>
          </div>
          <div class="loader-center">
            <div class="center-icon">⚙️</div>
          </div>
        </div>
        
        <!-- Texte de chargement avec animation -->
        <div class="loader-text">
          <h3>Configuration en cours</h3>
          <p>Initialisation du constructeur de formulaire...</p>
          <div class="loading-dots">
            <span class="dot dot-1"></span>
            <span class="dot dot-2"></span>
            <span class="dot dot-3"></span>
          </div>
        </div>
        
        <!-- Barre de progression stylée -->
        <div class="progress-bar-modern">
          <div class="progress-fill-modern"></div>
        </div>
      </div>
    </div>
    <!-- Header Tabs -->
    <div class="tabs-header flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4 bg-white border-b border-slate-200">
      <div class="tab-buttons flex flex-wrap gap-2 w-full lg:w-auto">
        <button 
          class="tab-button flex-1 lg:flex-none min-w-0 px-3 sm:px-4 py-2 text-sm sm:text-base"
          :class="{ active: activeTab === 'design' }"
          @click="activeTab = 'design'"
        >
          <span class="hidden sm:inline">🎨 Design</span>
          <span class="sm:hidden">🎨</span>
        </button>
        <button 
          class="tab-button flex-1 lg:flex-none min-w-0 px-3 sm:px-4 py-2 text-sm sm:text-base"
          :class="{ active: activeTab === 'preview' }"
          @click="activeTab = 'preview'"
        >
          <span class="hidden sm:inline">👁️ Preview</span>
          <span class="sm:hidden">👁️</span>
        </button>
        <button 
          class="tab-button flex-1 lg:flex-none min-w-0 px-3 sm:px-4 py-2 text-sm sm:text-base"
          :class="{ active: activeTab === 'json' }"
          @click="activeTab = 'json'"
        >
          <span class="hidden sm:inline">📄 JSON</span>
          <span class="sm:hidden">📄</span>
        </button>
      </div>
      <div v-if="activeTab === 'json' || activeTab === 'design'" class="json-actions flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
        <button 
          class="btn btn-danger px-3 sm:px-4 py-2 text-sm sm:text-base"
          @click="saveForm"
          :disabled="isLoading"
        >
          <span class="hidden sm:inline">{{ isLoading ? 'Sauvegarde...' : 'Sauvegarder le brouillon' }}</span>
          <span class="sm:hidden">💾 Sauvegarder</span>
        </button>
        <button 
          
          class="submit-button px-3 sm:px-4 py-2 text-sm sm:text-base"
          @click="submitForm"
          :disabled="isLoading"
        >
          <span class="hidden sm:inline">{{ isLoading ? 'Soumission...' : 'Soumettre' }}</span>
          <span class="sm:hidden">✅ Soumettre</span>
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="tab-content min-h-screen">
      <!-- Design Tab -->
      <div v-if="activeTab === 'design'" class="design-layout flex flex-col lg:flex-row gap-4 p-4">
        <!-- Left Sidebar - Input Tools -->
        <div class="left-sidebar w-full lg:w-80 xl:w-96 bg-white rounded-lg border border-slate-200 p-4">
          <h3 class="text-lg font-semibold mb-4">Outils de création</h3>
          
          <!-- Add Section Button -->
          <div class="section-controls mb-6">
            <button 
              class="add-section-btn w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary-600 transition-colors text-sm sm:text-base" 
              @click="addSection"
              type="button"
            >
              ➕ Ajouter une section
            </button>
          </div>
          
          <!-- Input Types by Category -->
          <div class="input-categories space-y-4">
            <div class="input-category">
              <h4 class="text-sm font-medium text-gray-700 mb-3">Champs de base</h4>
              <div class="input-types grid grid-cols-1 gap-2">
                <div 
                  v-for="inputType in inputTypes.filter(t => t.category === 'basic')"
                  :key="inputType.type"
                  class="input-type-item flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-grab hover:border-primary transition-colors bg-white"
                  draggable="true"
                  @dragstart="dragStart($event, inputType)"
                >
                  <span class="input-icon text-lg">{{ inputType.icon }}</span>
                  <span class="text-sm">{{ inputType.label }}</span>
                </div>
              </div>
            </div>
            
            <div class="input-category">
              <h4 class="text-sm font-medium text-gray-700 mb-3">Champs de choix</h4>
              <div class="input-types grid grid-cols-1 gap-2">
                <div 
                  v-for="inputType in inputTypes.filter(t => t.category === 'choice')"
                  :key="inputType.type"
                  class="input-type-item flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-grab hover:border-primary transition-colors bg-white"
                  draggable="true"
                  @dragstart="dragStart($event, inputType)"
                >
                  <span class="input-icon text-lg">{{ inputType.icon }}</span>
                  <span class="text-sm">{{ inputType.label }}</span>
                </div>
              </div>
            </div>
            
            <div class="input-category">
              <h4>Champs avancés</h4>
              <div class="input-types">
                <div 
                  v-for="inputType in inputTypes.filter(t => t.category === 'advanced')"
                  :key="inputType.type"
                  class="input-type-item"
                  draggable="true"
                  @dragstart="dragStart($event, inputType)"
                >
                  <span class="input-icon">{{ inputType.icon }}</span>
                  <span>{{ inputType.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Central Design Zone -->
        <div 
          class="design-zone flex-1 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4 min-h-96"
          @drop="drop"
          @dragover="allowDrop"
          @dragenter="allowDrop"
        >
          <div v-if="form.sections.length === 0" class="empty-state text-center py-12">
            <div class="text-gray-400 text-lg mb-2">📋</div>
            <p class="text-gray-500 text-sm sm:text-base">Glissez-déposez des éléments ici pour construire votre formulaire</p>
          </div>
          
          <!-- Form Sections -->
          <div v-for="(section, sectionIndex) in form.sections" :key="`${formKey}-${section.key}`" class="form-section bg-white rounded-lg border border-gray-200 mb-4">
            <div class="section-header flex items-center justify-between p-4 border-b border-gray-200">
              <input 
                v-model="section.intitule" 
                type="text" 
                class="section-title-input flex-1 text-lg font-medium border border-gray-300 rounded px-3 py-2 focus:border-primary focus:outline-none"
                placeholder="Titre de la section"
              />
              <button @click="removeSection(sectionIndex)" class="remove-btn ml-3 text-red-500 hover:text-red-700 text-xl font-bold">×</button>
            </div>
            
            <!-- Fields in Section -->
            <div 
              class="section-fields p-4 min-h-24"
              @drop="dropField($event, sectionIndex)"
              @dragover="allowDrop"
              @dragenter="allowDrop"
            >
              <!-- Empty state for section -->
              <div v-if="section.champs.length === 0" class="section-empty-state text-center py-8 border-2 border-dashed border-gray-200 rounded bg-gray-50">
                <p class="text-gray-400 text-sm">Glissez des champs ici ou depuis d'autres sections</p>
              </div>
              
              <!-- Simple field list -->
              <div 
                v-for="(field, fieldIndex) in section.champs.slice().sort((a, b) => a.ordre_affichage - b.ordre_affichage)" 
                :key="`${formKey}-${field.key}`"
                class="field-item"
                :class="{ selected: selectedField === field }"
                draggable="true"
                @dragstart="dragStartField($event, field, sectionIndex)"
                @dragend="dragEnd"
                @click="selectField(field)"
              >
                <div class="field-preview">
                  <label class="form-label">
                    {{ field.label }}
                    <span v-if="field.is_required" class="text-red-500 ml-1">*</span>
                  </label>
                  
                  <!-- Text-based inputs -->
                  <input 
                    v-if="['text', 'email', 'password', 'number', 'date', 'time', 'datetime-local', 'tel', 'url', 'color', 'range', 'hidden'].includes(field.type)"
                    :type="field.type_champ" 
                    :placeholder="field.placeholder"
                    :required="field.is_required"
                    :min="field.meta_options?.configs?.min"
                    :max="field.meta_options?.configs?.max"
                    class="form-control"
                    disabled
                  />
                  
                  <!-- Textarea -->
                  <textarea 
                    v-else-if="field.type === 'textarea'"
                    :placeholder="field.placeholder"
                    :required="field.is_required"
                    :rows="field.meta_options?.configs?.rows || 3"
                    class="form-control"
                    disabled
                  ></textarea>
                  
                  <!-- Select -->
                  <select 
                    v-else-if="field.type === 'select'"
                    :required="field.is_required"
                    class="form-select"
                    disabled
                  >
                    <option value="">{{ field.placeholder || 'Sélectionnez une option' }}</option>
                    <option 
                      v-for="option in field.meta_options?.configs?.options || []"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                  
                  <!-- Checkbox -->
                  <div v-else-if="field.type === 'checkbox'" class="form-check">
                    <div 
                      v-for="option in field.meta_options?.configs?.options || []"
                      :key="option.value"
                      class="form-check mb-2"
                    >
                      <input 
                        :id="`${field.key}_${option.value}`"
                        type="checkbox" 
                        :value="option.value"
                        class="form-check-input"
                        disabled
                      />
                      <label :for="`${field.key}_${option.value}`" class="form-check-label">
                        {{ option.label }}
                      </label>
                    </div>
                  </div>
                  
                  <!-- Radio -->
                  <div v-else-if="field.type === 'radio'" class="form-check">
                    <div 
                      v-for="option in field.meta_options?.configs?.options || []"
                      :key="option.value"
                      class="form-check mb-2"
                    >
                      <input 
                        :id="`${field.key}_${option.value}`"
                        type="radio" 
                        :name="field.key"
                        :value="option.value"
                        class="form-check-input"
                        disabled
                      />
                      <label :for="`${field.key}_${option.value}`" class="form-check-label">
                        {{ option.label }}
                      </label>
                    </div>
                  </div>
                  
                  <!-- Switch -->
                  <div v-else-if="field.type === 'switch'" class="form-check form-switch">
                    <input 
                      :id="field.key"
                      type="checkbox" 
                      class="form-check-input"
                      disabled
                    />
                    <label :for="field.key" class="form-check-label">
                      {{ field.placeholder || field.label }}
                    </label>
                  </div>
                  
                  <!-- File -->
                  <input 
                    v-else-if="field.type === 'file'"
                    type="file"
                    :accept="field.meta_options?.configs?.accept"
                    :multiple="field.meta_options?.configs?.multiple"
                    class="form-control"
                    disabled
                  />
                  
                  <div v-if="field.info" class="form-help mt-1 text-sm text-gray-500">
                    {{ field.info }}
                  </div>
                </div>
                <button @click="removeField(sectionIndex, fieldIndex)" class="remove-field-btn">×</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar - Field Properties -->
        <div class="right-sidebar">
          <h3>Paramètres de l'input</h3>
          <div v-if="selectedField" class="field-properties">
            <!-- Basic Properties -->
            <div class="property-group">
              <label class="property-label">Label *</label>
              <input v-model="selectedField.label" type="text" class="property-input" />
            </div>
            
            <div class="property-group">
              <label class="property-label">Attribut (ID unique) *</label>
              <input v-model="selectedField.attribut" type="text" class="property-input" placeholder="ex: nom_utilisateur" />
              <small class="text-xs text-gray-500 mt-1">Cet attribut sert d'identifiant unique pour le champ</small>
            </div>
            
            <div class="property-group">
              <label class="property-label">Placeholder</label>
              <input v-model="selectedField.placeholder" type="text" class="property-input" />
            </div>
            
            <div class="property-group">
              <label class="property-label">Texte d'aide</label>
              <input v-model="selectedField.info" type="text" class="property-input" />
            </div>
            
            <div class="property-group">
              <div class="form-check">
                <input 
                  v-model="selectedField.is_required" 
                  type="checkbox"
                  class="form-check-input"
                  id="field-required"
                />
                <label for="field-required" class="form-check-label">Champ requis</label>
              </div>
            </div>
            
            <div class="property-group">
              <label class="property-label">Ordre d'affichage</label>
              <input 
                v-model.number="selectedField.ordre_affichage" 
                type="number" 
                class="property-input" 
                @change="updateFieldOrder"
                min="1"
              />
            </div>
            
            <div class="property-group">
              <div class="form-check">
                <input 
                  v-model="selectedField.champStandard" 
                  type="checkbox"
                  class="form-check-input"
                  id="field-standard"
                />
                <label for="field-standard" class="form-check-label">Champ standard</label>
              </div>
              <small class="text-xs text-gray-500 mt-1">Cochez si c'est un champ standard du système</small>
            </div>
            
            <div class="property-group">
              <div class="form-check">
                <input 
                  v-model="selectedField.startWithNewLine" 
                  type="checkbox"
                  class="form-check-input"
                  id="field-new-line"
                />
                <label for="field-new-line" class="form-check-label">Le champ occupe toute la ligne</label>
              </div>
              <small class="text-xs text-gray-500 mt-1 text-wrap">Décochez pour un affichage en deux colonnes.</small>
            </div>
            
            <!-- Type-specific configurations -->
            <div v-if="['text', 'textarea'].includes(selectedField.type)" class="config-section">
              <h4>Configuration texte</h4>
              <div class="property-group">
                <label class="property-label">Longueur minimale</label>
                <input v-model.number="selectedField.meta_options.configs.min_length" type="number" class="property-input" />
              </div>
              <div class="property-group">
                <label class="property-label">Longueur maximale</label>
                <input v-model.number="selectedField.meta_options.configs.max_length" type="number" class="property-input" />
              </div>
              <div v-if="selectedField.type === 'textarea'" class="property-group">
                <label class="property-label">Nombre de lignes</label>
                <input v-model.number="selectedField.meta_options.configs.rows" type="number" class="property-input" min="1" />
              </div>
            </div>
            
            <div v-if="selectedField.type === 'number'" class="config-section">
              <h4>Configuration nombre</h4>
              <div class="property-group">
                <label class="property-label">Valeur minimale</label>
                <input v-model.number="selectedField.meta_options.configs.min" type="number" class="property-input" />
              </div>
              <div class="property-group">
                <label class="property-label">Valeur maximale</label>
                <input v-model.number="selectedField.meta_options.configs.max" type="number" class="property-input" />
              </div>
              <div class="property-group">
                <label class="property-label">Pas d'incrémentation</label>
                <input v-model.number="selectedField.meta_options.configs.step" type="number" class="property-input" step="0.01" />
              </div>
            </div>
            
            <div v-if="selectedField.type === 'range'" class="config-section">
              <h4>Configuration curseur</h4>
              <div class="property-group">
                <label class="property-label">Valeur minimale</label>
                <input v-model.number="selectedField.meta_options.configs.min" type="number" class="property-input" />
              </div>
              <div class="property-group">
                <label class="property-label">Valeur maximale</label>
                <input v-model.number="selectedField.meta_options.configs.max" type="number" class="property-input" />
              </div>
              <div class="property-group">
                <label class="property-label">Pas</label>
                <input v-model.number="selectedField.meta_options.configs.step" type="number" class="property-input" />
              </div>
            </div>
            
            <div v-if="selectedField.type === 'file'" class="config-section">
              <h4>Configuration fichier</h4>
              <div class="property-group">
                <label class="property-label">Types acceptés</label>
                <input v-model="selectedField.meta_options.configs.accept" type="text" class="property-input" placeholder=".jpg,.png,.pdf" />
              </div>
              <div class="property-group">
                <div class="form-check">
                  <input 
                    v-model="selectedField.meta_options.configs.multiple" 
                    type="checkbox"
                    class="form-check-input"
                    id="file-multiple"
                  />
                  <label for="file-multiple" class="form-check-label">Fichiers multiples</label>
                </div>
              </div>
            </div>
            
            <div v-if="['select', 'checkbox', 'radio'].includes(selectedField.type)" class="config-section">
              <h4>Options de choix</h4>
              <div class="options-manager">
                <div 
                  v-for="(option, index) in selectedField.meta_options.configs.options" 
                  :key="index"
                  class="option-item"
                >
                  <input 
                    v-model="option.label" 
                    type="text" 
                    placeholder="Libellé"
                    class="option-input"
                  />
                  <input 
                    v-model="option.value" 
                    type="text" 
                    placeholder="Valeur"
                    class="option-input"
                  />
                  <button 
                    @click="removeOption(selectedField, index)" 
                    type="button"
                    class="remove-option-btn"
                  >×</button>
                </div>
                <button 
                  @click="addOption(selectedField)" 
                  type="button"
                  class="add-option-btn"
                >+ Ajouter une option</button>
              </div>
            </div>
            
            <!-- Validation Rules -->
            <div class="config-section">
              <h4>Règles de validation</h4>
              <div v-if="selectedField.meta_options.validations_rules.required" class="property-group">
                <div class="form-check">
                  <input 
                    v-model="selectedField.meta_options.validations_rules.required" 
                    type="checkbox"
                    class="form-check-input"
                    id="validation-required"
                  />
                  <label for="validation-required" class="form-check-label">Validation requise</label>
                </div>
              </div>
            </div>
            
            <!-- Conditions -->
            <div class="config-section">
              <h4>Conditions d'affichage</h4>
              <div class="property-group">
                <div class="form-check">
                  <input 
                    v-model="selectedField.meta_options.conditions.visible" 
                    type="checkbox"
                    class="form-check-input"
                    id="field-visible"
                  />
                  <label for="field-visible" class="form-check-label">Visible</label>
                </div>
              </div>
              <div class="property-group">
                <div class="form-check">
                  <input 
                    v-model="selectedField.meta_options.conditions.disable" 
                    type="checkbox"
                    class="form-check-input"
                    id="field-disabled"
                  />
                  <label for="field-disabled" class="form-check-label">Désactivé</label>
                </div>
              </div>
            </div>
            
          </div>
          <div v-else class="no-selection">
            Sélectionnez un champ pour modifier ses propriétés
          </div>
        </div>
      </div>

      <!-- Preview Tab -->
      <div v-if="activeTab === 'preview'" class="preview-layout">
        <div class="intro-y flex items-center mt-8">
          <h2 class="text-lg font-medium mr-auto">{{ form.nom }}</h2>
        </div>
        
        <div class="grid grid-cols-12 gap-6 mt-5">
          <div class="intro-y col-span-12">
            <div class="intro-y box">
              <div class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                <h2 class="font-medium text-base mr-auto">{{ form.description }}</h2>
              </div>
              
              <div class="p-5">
                <form class="form-preview">
                  <div 
                    v-for="(section, sectionIndex) in form.sections" 
                    :key="`preview-${formKey}-${section.key}`" 
                    class="preview-section"
                    :class="{ 'mt-8': sectionIndex > 0 }"
                  >
                    <div class="intro-y flex items-center mt-8" v-if="section.intitule">
                      <h3 class="text-base font-medium mr-auto">{{ section.intitule }}</h3>
                    </div>
                    <p v-if="section.description" class="text-slate-500 mt-2">{{ section.description }}</p>
                    
                    <div class="preview-fields mt-5">
                      <div 
                        v-for="(fieldRow, rowIndex) in groupFieldsForDisplay(section.champs)" 
                        :key="`row-${rowIndex}`"
                        class="preview-field-row"
                        :class="{ 'mt-3': rowIndex > 0 }"
                      >
                        <div 
                          v-for="field in fieldRow" 
                          :key="`preview-field-${formKey}-${field.key}`" 
                          class="preview-field inline-field"
                        >
                        <!-- Text-based inputs -->
                        <div v-if="['text', 'email', 'password', 'number', 'date', 'time', 'datetime-local', 'tel', 'url', 'color', 'range'].includes(field.type)">
                          <label :for="`preview-${field.key}`" class="form-label">
                            {{ field.label }}
                            <span v-if="field.is_required" class="text-red-500 ml-1">*</span>
                          </label>
                          <input 
                            :id="`preview-${field.key}`"
                            :type="field.type_champ"
                            :placeholder="field.placeholder"
                            :required="field.is_required"
                            :min="field.meta_options?.configs?.min"
                            :max="field.meta_options?.configs?.max"
                            :step="field.meta_options?.configs?.step"
                            :minlength="field.meta_options?.configs?.min_length"
                            :maxlength="field.meta_options?.configs?.max_length"
                            :disabled="field.meta_options?.conditions?.disable"
                            :class="[
                              field.type === 'range' ? 'form-range' : 'form-control',
                              { 'form-control-sm': field.meta_options?.configs?.size === 'sm' },
                              { 'form-control-lg': field.meta_options?.configs?.size === 'lg' }
                            ]"
                          />
                          <div v-if="field.info" class="form-help mt-2">
                            {{ field.info }}
                          </div>
                        </div>
                        
                        <!-- Textarea -->
                        <div v-else-if="field.type === 'textarea'">
                          <label :for="`preview-${field.key}`" class="form-label">
                            {{ field.label }}
                            <span v-if="field.is_required" class="text-red-500 ml-1">*</span>
                          </label>
                          <textarea 
                            :id="`preview-${field.key}`"
                            :placeholder="field.placeholder"
                            :required="field.is_required"
                            :rows="field.meta_options?.configs?.rows || 3"
                            :minlength="field.meta_options?.configs?.min_length"
                            :maxlength="field.meta_options?.configs?.max_length"
                            :disabled="field.meta_options?.conditions?.disable"
                            class="form-control"
                          ></textarea>
                          <div v-if="field.info" class="form-help mt-2">
                            {{ field.info }}
                          </div>
                        </div>
                        
                        <!-- Select -->
                        <div v-else-if="field.type === 'select'">
                          <label :for="`preview-${field.key}`" class="form-label">
                            {{ field.label }}
                            <span v-if="field.is_required" class="text-red-500 ml-1">*</span>
                          </label>
                          <select 
                            :id="`preview-${field.key}`"
                            :required="field.is_required"
                            :disabled="field.meta_options?.conditions?.disable"
                            class="form-select"
                          >
                            <option value="">{{ field.placeholder || 'Sélectionnez une option' }}</option>
                            <option 
                              v-for="option in field.meta_options?.configs?.options || []"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </option>
                          </select>
                          <div v-if="field.info" class="form-help mt-2">
                            {{ field.info }}
                          </div>
                        </div>
                        
                        <!-- Checkbox -->
                        <div v-else-if="field.type === 'checkbox'">
                          <label class="form-label">
                            {{ field.label }}
                            <span v-if="field.is_required" class="text-red-500 ml-1">*</span>
                          </label>
                          <div class="flex flex-col mt-2">
                            <div 
                              v-for="option in field.meta_options?.configs?.options || []"
                              :key="option.value"
                              class="form-check mt-2"
                            >
                              <input 
                                :id="`preview-${field.key}-${option.value}`"
                                type="checkbox" 
                                :value="option.value"
                                :disabled="field.meta_options?.conditions?.disable"
                                class="form-check-input"
                              />
                              <label :for="`preview-${field.key}-${option.value}`" class="form-check-label">
                                {{ option.label }}
                              </label>
                            </div>
                          </div>
                          <div v-if="field.info" class="form-help mt-2">
                            {{ field.info }}
                          </div>
                        </div>
                        
                        <!-- Radio -->
                        <div v-else-if="field.type === 'radio'">
                          <label class="form-label">
                            {{ field.label }}
                            <span v-if="field.is_required" class="text-red-500 ml-1">*</span>
                          </label>
                          <div class="flex flex-col mt-2">
                            <div 
                              v-for="option in field.meta_options?.configs?.options || []"
                              :key="option.value"
                              class="form-check mt-2"
                            >
                              <input 
                                :id="`preview-${field.key}-${option.value}`"
                                type="radio" 
                                :name="`preview-${field.key}`"
                                :value="option.value"
                                :disabled="field.meta_options?.conditions?.disable"
                                class="form-check-input"
                              />
                              <label :for="`preview-${field.key}-${option.value}`" class="form-check-label">
                                {{ option.label }}
                              </label>
                            </div>
                          </div>
                          <div v-if="field.info" class="form-help mt-2">
                            {{ field.info }}
                          </div>
                        </div>
                        
                        <!-- Switch -->
                        <div v-else-if="field.type === 'switch'">
                          <label class="form-label">
                            {{ field.label }}
                            <span v-if="field.is_required" class="text-red-500 ml-1">*</span>
                          </label>
                          <div class="form-check form-switch mt-2">
                            <input 
                              :id="`preview-${field.key}`"
                              type="checkbox" 
                              :disabled="field.meta_options?.conditions?.disable"
                              class="form-check-input"
                            />
                            <label :for="`preview-${field.key}`" class="form-check-label">
                              {{ field.placeholder || field.info || 'Activer cette option' }}
                            </label>
                          </div>
                          <div v-if="field.info && field.placeholder" class="form-help mt-2">
                            {{ field.info }}
                          </div>
                        </div>
                        
                        <!-- File -->
                        <div v-else-if="field.type === 'file'">
                          <label :for="`preview-${field.key}`" class="form-label">
                            {{ field.label }}
                            <span v-if="field.is_required" class="text-red-500 ml-1">*</span>
                          </label>
                          <input 
                            :id="`preview-${field.key}`"
                            type="file"
                            :accept="field.meta_options?.configs?.accept"
                            :multiple="field.meta_options?.configs?.multiple"
                            :disabled="field.meta_options?.conditions?.disable"
                            class="form-control"
                          />
                          <div v-if="field.info" class="form-help mt-2">
                            {{ field.info }}
                          </div>
                        </div>
                        
                        <!-- Hidden (for completeness, though not visible) -->
                        <input 
                          v-else-if="field.type === 'hidden'"
                          type="hidden"
                          :value="field.default_value"
                        />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Submit button for demo -->
                  <div class="mt-5" v-if="form.sections.length > 0">
                    <button type="submit" class="btn btn-primary">Soumettre</button>
                    <button type="button" class="btn btn-outline-secondary ml-2">Annuler</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- JSON Tab -->
      <div v-if="activeTab === 'json'" class="json-layout">
        <div class="json-controls mb-4">
          <button 
            v-if="!isEditingJson"
            class="edit-json-btn"
            @click="startEditingJson"
            type="button"
          >
            <EditIcon class="w-4 h-4 mr-2" />
            Modifier le JSON
          </button>
          <div v-else class="json-edit-controls">
            <button 
              class="save-json-btn"
              @click="saveJsonChanges"
              type="button"
              :disabled="isLoading"
            >
              <CheckIcon class="w-4 h-4 mr-2" />
              {{ isLoading ? 'Sauvegarde...' : 'Enregistrer les modifications' }}
            </button>
            <button 
              class="cancel-json-btn"
              @click="cancelJsonEdit"
              type="button"
            >
              <XIcon class="w-4 h-4 mr-2" />
              Annuler
            </button>
          </div>
        </div>
        
        <div v-if="!isEditingJson" class="json-preview-container">
          <pre class="json-preview">{{ JSON.stringify(form, null, 2) }}</pre>
        </div>
        
        <div v-else class="json-edit-container">
          <textarea
            v-model="jsonEditValue"
            class="json-editor"
            placeholder="Collez ou modifiez le JSON ici..."
            :class="{ 'json-error': jsonError }"
          ></textarea>
          <div v-if="jsonError" class="json-error-message">
            <AlertTriangleIcon class="w-4 h-4 mr-2" />
            {{ jsonError }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import { PlusIcon } from 'lucide-vue-next';

import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import { getCurrentUser, can } from '@/utils/permissions'
import { formulaireIdeeProjetService } from '@/services/formulaireIdeeProjet.js'

export default {
  name: 'FormulaireIdeeProjet',
  components: {
    // PlusIcon,
  },
  setup() {
    // Permissions
    const currentUser = getCurrentUser()
    const canEdit = computed(() => can(currentUser, 'voir-canevas-fiche-idee'))
    
    const activeTab = ref('design')
    const selectedField = ref(null)
    const isLoading = ref(false)
    const initialLoading = ref(true)
    const isEditingJson = ref(false)
    const jsonEditValue = ref('')
    const jsonError = ref('')
    const formKey = ref(0) // Clé pour forcer le re-rendu
    // Removed complex drag state - keeping simple drag & drop
    
    const inputTypes = [
      { type: 'text', label: 'Texte', icon: '📝', type_champ: 'text', category: 'basic' },
      { type: 'email', label: 'Email', icon: '📧', type_champ: 'email', category: 'basic' },
      { type: 'password', label: 'Mot de passe', icon: '🔒', type_champ: 'password', category: 'basic' },
      { type: 'number', label: 'Nombre', icon: '🔢', type_champ: 'number', category: 'basic' },
      { type: 'date', label: 'Date', icon: '📅', type_champ: 'date', category: 'basic' },
      { type: 'time', label: 'Heure', icon: '⏰', type_champ: 'time', category: 'basic' },
      { type: 'datetime-local', label: 'Date et Heure', icon: '📅⏰', type_champ: 'datetime-local', category: 'basic' },
      { type: 'tel', label: 'Téléphone', icon: '📞', type_champ: 'tel', category: 'basic' },
      { type: 'url', label: 'URL', icon: '🌐', type_champ: 'url', category: 'basic' },
      { type: 'textarea', label: 'Zone de texte', icon: '📄', type_champ: 'textarea', category: 'basic' },
      { type: 'select', label: 'Liste déroulante', icon: '📋', type_champ: 'select', category: 'choice' },
      { type: 'checkbox', label: 'Cases à cocher', icon: '☑️', type_champ: 'checkbox', category: 'choice' },
      { type: 'radio', label: 'Boutons radio', icon: '🔘', type_champ: 'radio', category: 'choice' },
      { type: 'switch', label: 'Interrupteur', icon: '🎛️', type_champ: 'switch', category: 'choice' },
      { type: 'file', label: 'Fichier', icon: '📎', type_champ: 'file', category: 'advanced' },
      { type: 'range', label: 'Curseur', icon: '🎚️', type_champ: 'range', category: 'advanced' },
      { type: 'color', label: 'Couleur', icon: '🎨', type_champ: 'color', category: 'advanced' },
      // { type: 'hidden', label: 'Champ caché', icon: '👻', type_champ: 'hidden', category: 'advanced' }
    ]

    const form = reactive({
      nom: "Fiche idée de projet",
      description: "Formulaire pour évaluer les projets soumis dans le cadre",
      categorieId: 2,
      sections: []
    })

    let fieldCounter = 1
    let sectionCounter = 1
    
    const addSection = () => {
      const sectionNumber = form.sections.length + 1
      const newSection = {
        id: `section_${sectionCounter++}`,
        intitule: `Section ${sectionNumber}`,
        ordre_affichage: sectionNumber,
        type: "formulaire",
        description: `Description de la section ${sectionNumber}`,
        champs: []
      }
      form.sections.push(newSection)
    }
    
    const addOption = (field) => {
      if (!field.meta_options.configs.options) {
        field.meta_options.configs.options = []
      }
      field.meta_options.configs.options.push({
        label: `Option ${field.meta_options.configs.options.length + 1}`,
        value: `option_${field.meta_options.configs.options.length + 1}`
      })
    }
    
    const removeOption = (field, index) => {
      field.meta_options.configs.options.splice(index, 1)
    }

    const dragStart = (event, inputType) => {
      event.dataTransfer.setData('application/json', JSON.stringify(inputType))
    }

    const allowDrop = (event) => {
      event.preventDefault()
    }

    const createNewField = (inputType, targetSectionIndex = 0) => {
      // Create new field with type-specific configurations
      const baseField = {
        id: `field_${fieldCounter++}`,
        type: inputType.type,
        attribut: `field_${fieldCounter}`,
        label: `Nouveau ${inputType.label}`,
        info: "",
        placeholder: `Ex: ${inputType.label}`,
        is_required: false,
        type_champ: inputType.type_champ,
        ordre_affichage: 1,
        default_value: null,
        champStandard: false,
        startWithNewLine: true,
        meta_options: {
          validations_rules: {
            min: null,
            max: null,
            required: false
          },
          conditions: {
            visible: true,
            disable: false,
            conditons: {}
          },
          configs: {}
        }
      }
      
      // Add type-specific configurations
      switch (inputType.type) {
        case 'text':
        case 'textarea':
          baseField.meta_options.configs = {
            max_length: 255,
            min_length: 1,
            ...(inputType.type === 'textarea' && { rows: 3 })
          }
          break
          
        case 'number':
        case 'range':
          baseField.meta_options.configs = {
            min: 0,
            max: 100,
            step: 1
          }
          break
          
        case 'file':
          baseField.meta_options.configs = {
            accept: '',
            multiple: false
          }
          break
          
        case 'select':
        case 'checkbox':
        case 'radio':
          baseField.meta_options.configs = {
            options: [
              { label: 'Option 1', value: 'option1' },
              { label: 'Option 2', value: 'option2' }
            ]
          }
          break
          
        default:
          baseField.meta_options.configs = {
            max_length: 255,
            min_length: 1
          }
      }
      
      return baseField
    }
    
    const drop = (event) => {
      event.preventDefault()
      const inputType = JSON.parse(event.dataTransfer.getData('application/json'))
      
      const newField = createNewField(inputType)

      // Create Section 1 automatically if no sections exist
      if (form.sections.length === 0) {
        const newSection = {
          id: `section_${sectionCounter++}`,
          intitule: "Section 1",
          ordre_affichage: 1,
          type: "formulaire",
          description: "Première section du formulaire",
          champs: []
        }
        form.sections.push(newSection)
      }
      
      // Add to first section and update order
      const targetSection = form.sections[0]
      newField.ordre_affichage = targetSection.champs.length + 1
      
      // All new fields start with startWithNewLine = true by default
      // (already set in createNewField)
      
      targetSection.champs.push(newField)
      
      // Auto-select the new field
      selectedField.value = newField
    }
    
    const dragStartField = (event, field, sectionIndex) => {
      event.dataTransfer.setData('application/json', JSON.stringify({
        type: 'field',
        field: field,
        sourceSectionIndex: sectionIndex
      }))
      event.dataTransfer.effectAllowed = 'move'
    }
    
    const dragEnd = () => {
      // Simple cleanup if needed
    }
    
    const determineDropPosition = (event, fields, draggedFieldId) => {
      const sectionElement = event.currentTarget
      const fieldElements = sectionElement.querySelectorAll('.field-item')
      const mouseY = event.clientY
      
      // If no fields or only the dragged field, insert at position 0
      if (fields.length <= 1) {
        return 0
      }
      
      let insertPosition = fields.length // Default to end
      
      // Find the best position based on mouse Y position
      for (let i = 0; i < fieldElements.length; i++) {
        const fieldElement = fieldElements[i]
        const rect = fieldElement.getBoundingClientRect()
        const fieldCenterY = rect.top + rect.height / 2
        
        // Skip if this is the dragged field itself
        const fieldId = fields.find(f => f.ordre_affichage === (i + 1))?.id
        if (fieldId === draggedFieldId) {
          continue
        }
        
        // If mouse is above the center of this field, insert before it
        if (mouseY < fieldCenterY) {
          insertPosition = i
          break
        }
      }
      
      return insertPosition
    }
    
    const dropField = (event, targetSectionIndex) => {
      event.preventDefault()
      event.stopPropagation()
      
      const data = JSON.parse(event.dataTransfer.getData('application/json'))
      
      // Check if it's an existing field being moved
      if (data.type === 'field' && data.field && data.hasOwnProperty('sourceSectionIndex')) {
        // It's an existing field being moved
        const { field, sourceSectionIndex } = data
        
        // Handle intra-section movement differently
        if (sourceSectionIndex === targetSectionIndex) {
          // It's a reorder within the same section
          const section = form.sections[sourceSectionIndex]
          const currentIndex = section.champs.findIndex(f => f.id === field.id)
          
          // Determine drop position based on mouse position
          const dropPosition = determineDropPosition(event, section.champs, field.id)
          
          // Remove from current position
          section.champs.splice(currentIndex, 1)
          
          // Insert at the determined position
          let insertIndex = dropPosition
          
          // Adjust insert index if we removed an item before it
          if (currentIndex < dropPosition) {
            insertIndex = dropPosition - 1
          }
          
          // Ensure insert index is within bounds
          insertIndex = Math.max(0, Math.min(insertIndex, section.champs.length))
          
          // Insert at the calculated position
          section.champs.splice(insertIndex, 0, field)
          
          // Reorder all fields
          section.champs.forEach((f, index) => {
            f.ordre_affichage = index + 1
          })
          
          selectedField.value = field
          return
        }
        
        // Remove from source section
        const sourceSection = form.sections[sourceSectionIndex]
        const fieldIndex = sourceSection.champs.findIndex(f => f.id === field.id)
        if (fieldIndex > -1) {
          sourceSection.champs.splice(fieldIndex, 1)
          
          // Update order in source section
          sourceSection.champs.forEach((f, index) => {
            f.ordre_affichage = index + 1
          })
        }
        
        // Add to target section
        const targetSection = form.sections[targetSectionIndex]
        field.ordre_affichage = targetSection.champs.length + 1
        
        // Reset to default behavior - field takes full line by default
        field.startWithNewLine = true
        
        targetSection.champs.push(field)
        selectedField.value = field
      } else {
        // It's a new input type from sidebar
        const newField = createNewField(data)
        const targetSection = form.sections[targetSectionIndex]
        newField.ordre_affichage = targetSection.champs.length + 1
        
        // All new fields start with startWithNewLine = true by default
        // (already set in createNewField)
        
        targetSection.champs.push(newField)
        selectedField.value = newField
      }
    }
    
    const updateFieldOrder = () => {
      form.sections.forEach(section => {
        section.champs
          .sort((a, b) => a.ordre_affichage - b.ordre_affichage)
          .forEach((field, index) => {
            field.ordre_affichage = index + 1
          })
      })
    }
    
    const getInlineFields = (sortedFields, startIndex) => {
      const inlineFields = []
      for (let i = startIndex + 1; i < sortedFields.length; i++) {
        const field = sortedFields[i]
        if (field.startWithNewLine) {
          break
        }
        inlineFields.push(field)
      }
      return inlineFields
    }
    
    const groupFieldsForDisplay = (fields) => {
      const sortedFields = fields.slice().sort((a, b) => a.ordre_affichage - b.ordre_affichage)
      const rows = []
      let currentRow = []
      
      sortedFields.forEach((field, index) => {
        if (field.startWithNewLine && index > 0) {
          if (currentRow.length > 0) {
            rows.push(currentRow)
            currentRow = []
          }
        }
        currentRow.push(field)
      })
      
      if (currentRow.length > 0) {
        rows.push(currentRow)
      }
      
      return rows
    }

    const selectField = (field) => {
      selectedField.value = field
    }

    const removeField = (sectionIndex, fieldIndex) => {
      const section = form.sections[sectionIndex]
      const fieldToRemove = section.champs[fieldIndex]
      
      section.champs.splice(fieldIndex, 1)
      
      // Update order for remaining fields
      section.champs.forEach((field, index) => {
        field.ordre_affichage = index + 1
      })
      
      // Clear selection if removed field was selected
      if (selectedField.value && selectedField.value.id === fieldToRemove?.id) {
        selectedField.value = null
      }
    }
    
    // Removed removeFieldFromRow - using standard removeField instead

    const removeSection = (sectionIndex) => {
      form.sections.splice(sectionIndex, 1)
      selectedField.value = null
    }

    const saveForm = () => {
      if (isLoading.value) return
      
      try {
        isLoading.value = true
        
        if (form.sections.length === 0) {
          alert('⚠️ Le formulaire doit contenir au moins une section avant d\'être sauvegardé.')
          return
        }
        
        localStorage.setItem('formulaire_idee_projet', JSON.stringify(form))
        alert('✅ Formulaire sauvegardé avec succès!')
      } catch (error) {
        console.error('Erreur de sauvegarde:', error)
        alert('❌ Erreur lors de la sauvegarde: ' + (error.message || 'Erreur inconnue'))
      } finally {
        isLoading.value = false
      }
    }
    
    const submitForm = async () => {
      if (isLoading.value) return
      
      try {
        isLoading.value = true
        
        // Validation avant soumission
        if (form.sections.length === 0) {
          alert('⚠️ Le formulaire doit contenir au moins une section avant d\'être soumis.')
          return
        }
        
        // Vérifier qu'au moins une section a des champs
        const hasFields = form.sections.some(section => section.champs.length > 0)
        if (!hasFields) {
          alert('⚠️ Au moins une section doit contenir des champs avant la soumission.')
          return
        }
        
        // Utiliser le service au lieu de fetch direct
        const result = await formulaireIdeeProjetService.saveFormulaireIdeeProjet(form)
        
        alert('✅ Formulaire soumis avec succès!')
        console.log('Réponse du serveur:', result)
        
        // Optionnel: réinitialiser le formulaire après succès
        // form.sections = []
        
      } catch (error) {
        console.error('Erreur de soumission:', error)
        
        // Gestion des erreurs selon le type
        if (error.message) {
          alert('❌ ' + error.message)
        } else if (error.errors) {
          // Si l'API renvoie des erreurs de validation structurées
          const errorMessages = Object.values(error.errors).flat().join('\n')
          alert('❌ Erreurs de validation:\n' + errorMessages)
        } else {
          alert('❌ Erreur lors de la soumission du formulaire')
        }
      } finally {
        isLoading.value = false
      }
    }

    const loadForm = async () => {
      try {
        const response = await formulaireIdeeProjetService.getAll()
        
        if (response.data) {
          // Mapper les données de la réponse API vers le formulaire
          const formData = {
            nom: response.data.nom,
            description: response.data.description,
            categorieId: response.data.categorie.id,
            sections: response.data.sections.map(section => {
              // Traitement des champs de la section principale
              const mainSectionFields = (section.champs || []).map(field => ({
                ...field,
                type: field.type_champ,
                champStandard: field.champ_standard,
                meta_options: {
                  ...field.meta_options,
                  validations_rules: field.meta_options?.validations_rules || {
                    min: null,
                    max: null,
                    required: field.is_required || false
                  },
                  conditions: field.meta_options?.conditions || {
                    visible: true,
                    disable: false,
                    conditons: {}
                  },
                  configs: field.meta_options?.configs || {}
                },
                sectionGroup: null
              }))

              // Traitement des sous-sections
              let allFields = [...mainSectionFields]
              
              if (section.sous_sections && Array.isArray(section.sous_sections)) {
                const subSections = section.sous_sections.sort((a, b) => (a.ordre_affichage || 0) - (b.ordre_affichage || 0))
                subSections.forEach(subSection => {
                  const subSectionFields = (subSection.champs || []).map(field => ({
                    ...field,
                    type: field.type_champ,
                    champStandard: field.champ_standard,
                    meta_options: {
                      ...field.meta_options,
                      validations_rules: field.meta_options?.validations_rules || {
                        min: null,
                        max: null,
                        required: field.is_required || false
                      },
                      conditions: field.meta_options?.conditions || {
                        visible: true,
                        disable: false,
                        conditons: {}
                      },
                      configs: field.meta_options?.configs || {}
                    },
                    sectionGroup: {
                      title: subSection.intitule,
                      description: subSection.description,
                      id: subSection.id
                    }
                  }))
                  allFields = [...allFields, ...subSectionFields]
                })
              }

              return {
                ...section,
                champs: allFields
              }
            })
          }
          
          // Vider complètement l'objet form pour forcer la réactivité
          form.sections.splice(0, form.sections.length)
          
          // Assigner les nouvelles données
          Object.assign(form, formData)
          
          // Mettre à jour les compteurs pour éviter les conflits d'ID
          if (form.sections.length > 0) {
            const existingFieldIds = form.sections.flatMap(section => 
              section.champs.map(field => {
                const match = field.key?.toString().match(/(\d+)$/)
                return match ? parseInt(match[1]) : 0
              })
            )
            fieldCounter = existingFieldIds.length > 0 ? Math.max(...existingFieldIds) + 1 : 1
            
            const existingSectionIds = form.sections.map(section => {
              const match = section.key?.toString().match(/(\d+)$/)
              return match ? parseInt(match[1]) : 0
            })
            sectionCounter = existingSectionIds.length > 0 ? Math.max(...existingSectionIds) + 1 : 1
          }
          
          // Forcer le re-rendu
          formKey.value += 1
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
      }
    }

    const startEditingJson = () => {
      jsonEditValue.value = JSON.stringify(form, null, 2)
      jsonError.value = ''
      isEditingJson.value = true
    }

    const cancelJsonEdit = () => {
      isEditingJson.value = false
      jsonEditValue.value = ''
      jsonError.value = ''
    }

    const validateJson = (jsonString) => {
      try {
        const parsed = JSON.parse(jsonString)
        
        // Validation basique de la structure
        if (!parsed || typeof parsed !== 'object') {
          return 'Le JSON doit être un objet valide'
        }
        
        // Vérifier les propriétés obligatoires
        if (!parsed.nom || typeof parsed.nom !== 'string') {
          return 'La propriété "nom" est obligatoire et doit être une chaîne'
        }
        
        if (!parsed.sections || !Array.isArray(parsed.sections)) {
          return 'La propriété "sections" est obligatoire et doit être un tableau'
        }
        
        // Valider chaque section
        for (let i = 0; i < parsed.sections.length; i++) {
          const section = parsed.sections[i]
          if (!section.id || !section.intitule) {
            return `Section ${i + 1}: Les propriétés "id" et "intitule" sont obligatoires`
          }
          
          if (!section.champs || !Array.isArray(section.champs)) {
            return `Section ${i + 1}: La propriété "champs" doit être un tableau`
          }
          
          // Valider chaque champ
          for (let j = 0; j < section.champs.length; j++) {
            const field = section.champs[j]
            if (!field.id || !field.label || !field.type) {
              return `Section ${i + 1}, Champ ${j + 1}: Les propriétés "id", "label" et "type" sont obligatoires`
            }
          }
        }
        
        return null // Pas d'erreur
      } catch (error) {
        return `JSON invalide: ${error.message}`
      }
    }

    const saveJsonChanges = async () => {
      jsonError.value = ''
      
      // Validation du JSON
      const validationError = validateJson(jsonEditValue.value)
      if (validationError) {
        jsonError.value = validationError
        return
      }
      
      try {
        isLoading.value = true
        
        // Parse le JSON et met à jour le formulaire
        const newFormData = JSON.parse(jsonEditValue.value)
        
        // Vider complètement l'objet form pour forcer la réactivité
        form.sections.splice(0, form.sections.length)
        
        // Mettre à jour toutes les propriétés une par une pour maintenir la réactivité
        form.nom = newFormData.nom || form.nom
        form.description = newFormData.description || form.description
        form.categorieId = newFormData.categorieId || form.categorieId
        
        // Ajouter les nouvelles sections de manière réactive
        if (newFormData.sections && Array.isArray(newFormData.sections)) {
          newFormData.sections.forEach(section => {
            // S'assurer que chaque section a la structure complète
            const completeSection = {
              id: section.id,
              intitule: section.intitule,
              ordre_affichage: section.ordre_affichage || 1,
              type: section.type || "formulaire",
              description: section.description || "",
              champs: []
            }
            
            // Ajouter les champs de manière réactive
            if (section.champs && Array.isArray(section.champs)) {
              section.champs.forEach(field => {
                // S'assurer que chaque champ a la structure complète avec meta_options
                const completeField = {
                  ...field,
                  meta_options: field.meta_options || {
                    validations_rules: {
                      min: null,
                      max: null,
                      required: field.is_required || false
                    },
                    conditions: {
                      visible: true,
                      disable: false,
                      conditons: {}
                    },
                    configs: field.meta_options?.configs || {}
                  }
                }
                completeSection.champs.push(completeField)
              })
            }
            
            form.sections.push(completeSection)
          })
        }
        
        // Réinitialiser les compteurs pour éviter les conflits d'ID
        if (form.sections.length > 0) {
          const existingFieldIds = form.sections.flatMap(section => 
            section.champs.map(field => {
              const match = field.id?.toString().match(/field_(\d+)/)
              return match ? parseInt(match[1]) : 0
            })
          )
          fieldCounter = existingFieldIds.length > 0 ? Math.max(...existingFieldIds) + 1 : 1
          
          const existingSectionIds = form.sections.map(section => {
            const match = section.id?.toString().match(/section_(\d+)/)
            return match ? parseInt(match[1]) : 0
          })
          sectionCounter = existingSectionIds.length > 0 ? Math.max(...existingSectionIds) + 1 : 1
        }
        
        // Sauvegarder automatiquement
        localStorage.setItem('formulaire_idee_projet', JSON.stringify(form))
        
        // Sortir du mode édition
        isEditingJson.value = false
        jsonEditValue.value = ''
        selectedField.value = null
        
        // Forcer le re-rendu complet des composants
        formKey.value += 1
        
        // Forcer une mise à jour des onglets Design et Preview
        // en basculant temporairement vers l'onglet design pour déclencher la réactivité
        const currentTab = activeTab.value
        if (currentTab === 'json') {
          activeTab.value = 'design'
          // Utiliser nextTick pour s'assurer que la mise à jour est appliquée
          await nextTick()
          setTimeout(() => {
            activeTab.value = currentTab
          }, 50)
        }
        
        alert('✅ JSON mis à jour avec succès! Les modifications sont maintenant visibles dans les onglets Design et Preview.')
        
      } catch (error) {
        jsonError.value = `Erreur lors de la sauvegarde: ${error.message}`
        console.error('Erreur détaillée:', error)
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      // Simulation de chargement initial
      setTimeout(() => {
        initialLoading.value = false
      }, 1500)
      loadForm()
    })

    return {
      activeTab,
      selectedField,
      isLoading,
      initialLoading,
      isEditingJson,
      jsonEditValue,
      jsonError,
      formKey,
      inputTypes,
      form,
      
      // Permissions
      canEdit,
      dragStart,
      allowDrop,
      drop,
      dropField,
      dragStartField,
      selectField,
      removeField,
      removeSection,
      saveForm,
      submitForm,
      addSection,
      addOption,
      removeOption,
      updateFieldOrder,
      getInlineFields,
      groupFieldsForDisplay,
      dragEnd,
      determineDropPosition,
      startEditingJson,
      cancelJsonEdit,
      saveJsonChanges
    }
  }
}
</script>

<style scoped>
.form-builder-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.tabs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.tab-buttons {
  display: flex;
  gap: 0.5rem;
}

.tab-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.tab-button.active {
  background: #0E6258;
  color: white;
  border-color: #0E6258;
}

.json-actions {
  display: flex;
  gap: 0.5rem;
}

.save-button {
  padding: 0.5rem 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.save-button:hover:not(:disabled) {
  background: #218838;
}

.save-button:disabled,
.submit-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.submit-button {
  padding: 0.5rem 1rem;
  background: #0E6258;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background: #0E6258;
}

.tab-content {
  flex: 1;
  overflow: hidden;
}

.design-layout {
  display: flex;
  height: 100%;
}

@media (max-width: 768px) {
  .design-layout {
    flex-direction: column;
  }
}

.left-sidebar, .right-sidebar {
  width: 250px;
  background: white;
  padding: 1rem;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .left-sidebar, .right-sidebar {
    width: 100%;
    max-height: 300px;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
}

.right-sidebar {
  border-right: none;
  border-left: 1px solid #e0e0e0;
}

.design-zone {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  min-height: 400px;
}

.empty-state {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 4rem;
  border: 2px dashed #ccc;
  border-radius: 8px;
}

.section-controls {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.add-section-btn {
  width: 100%;
  padding: 0.75rem;
  background: #0E6258;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.add-section-btn:hover {
  background: #0E6258;
}

.input-categories {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-category h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-types {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-type-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
  cursor: grab;
  border: 1px solid #e0e0e0;
  font-size: 0.875rem;
}

.input-type-item:hover {
  background: #e9ecef;
}

.input-icon {
  font-size: 1rem;
}

.form-section {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  min-height: 120px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.section-title-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid transparent;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  background: transparent;
}

.section-title-input:hover,
.section-title-input:focus {
  border-color: #0E6258;
  outline: none;
  background: #f8f9fa;
}

.section-empty-state {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 2rem;
  border: 2px dashed #ccc;
  border-radius: 8px;
  margin: 0.5rem 0;
  background: #fafafa;
}

.section-fields {
  min-height: 60px;
}

/* Simplified - no complex drop zones in design mode */

.remove-btn, .remove-field-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.field-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  cursor: move;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 0;
}

.field-item:hover {
  background: #e9ecef;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.field-item.selected {
  border-color: #0E6258;
  background: #e7f3ff;
}

.field-item:active {
  cursor: grabbing;
}

.field-item[draggable="true"] {
  cursor: grab;
}

.field-item[draggable="true"]:active {
  cursor: grabbing;
  opacity: 0.8;
}

.field-preview {
  flex: 1;
}

.field-preview label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.field-preview input {
  width: 100%;
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.property-group {
  margin-bottom: 1rem;
}

.property-label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: #374151;
}

.property-input {
  width: 100%;
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.875rem;
}

.property-input:focus {
  outline: none;
  border-color: #0E6258;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.config-section {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.config-section h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
}

.options-manager {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.option-input {
  flex: 1;
  padding: 0.375rem 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.75rem;
}

.remove-option-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-option-btn {
  padding: 0.5rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.add-option-btn:hover {
  background: #218838;
}

.remove-option-btn:hover {
  background: #c82333;
}

.no-selection {
  color: #6c757d;
  font-style: italic;
  text-align: center;
  padding: 2rem;
}

.preview-layout, .json-layout {
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}

@media (max-width: 768px) {
  .preview-layout, .json-layout {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .preview-layout, .json-layout {
    padding: 0.75rem;
  }
}

.form-preview {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.preview-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.preview-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-field label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-wrap: wrap;
  max-width: 100%;
}

.preview-field input {
  width: 100%;
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.required {
  color: #dc3545;
}

.preview-field .form-help {
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-wrap: wrap;
  hyphens: auto;
  white-space: normal;
  max-width: 100%;
}

@media (max-width: 768px) {
  .preview-field .form-help {
    font-size: 0.8125rem;
    margin-top: 0.375rem;
  }
}

@media (max-width: 480px) {
  .preview-field .form-help {
    font-size: 0.75rem;
    line-height: 1.3;
  }
}

.preview-section {
  background: white;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.preview-section:hover {
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.preview-fields {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.preview-field {
  margin-bottom: 0;
  overflow: hidden;
  word-wrap: break-word;
  text-wrap: wrap;
  max-width: 100%;
  box-sizing: border-box;
}

.preview-field .form-check {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.preview-field .form-check:last-child {
  margin-bottom: 0;
}

.preview-field-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
}

.inline-field {
  flex: 1;
  min-width: 200px;
  overflow: hidden;
  word-wrap: break-word;
  text-wrap: wrap;
}

.inline-field:only-child {
  flex: none;
  width: 100%;
}

@media (max-width: 768px) {
  .preview-field-row {
    gap: 0.75rem;
  }
  
  .inline-field {
    min-width: 150px;
  }
}

@media (max-width: 480px) {
  .preview-field-row {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .inline-field {
    width: 100%;
    min-width: unset;
  }
}

.preview-field {
  margin-bottom: 0;
  overflow: hidden;
  word-wrap: break-word;
  text-wrap: wrap;
  max-width: 100%;
  box-sizing: border-box;
}

/* Full width for standalone fields (startWithNewLine: true and alone) */
.preview-field-row:has(.inline-field:only-child) .inline-field {
  width: 100%;
  max-width: 100%;
}

/* Ensure single fields in a row take full width */
.preview-field-row .inline-field:only-child {
  flex: none;
  width: 100% !important;
}

.json-controls {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
}

.json-edit-controls {
  display: flex;
  gap: 0.5rem;
}

.edit-json-btn {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #0E6258;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.edit-json-btn:hover {
  background: #0E6258;
}

.save-json-btn {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.save-json-btn:hover:not(:disabled) {
  background: #218838;
}

.save-json-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.cancel-json-btn {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.cancel-json-btn:hover {
  background: #5a6268;
}

.json-preview-container {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.json-preview {
  padding: 1rem;
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  white-space: pre-wrap;
  overflow-x: auto;
  max-height: 600px;
  overflow-y: auto;
  background: transparent;
}

.json-edit-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.json-editor {
  width: 100%;
  min-height: 400px;
  max-height: 600px;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s ease;
}

.json-editor:focus {
  border-color: #0E6258;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.json-editor.json-error {
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
}

.json-error-message {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  font-size: 0.875rem;
}

/* Loading overlay moderne avec couleurs primaires */
.modern-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modern-loader-container {
  text-align: center;
  color: white;
  max-width: 400px;
  padding: 2rem;
}

/* Loader principal avec anneaux rotatifs */
.loader-main {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.loader-rings {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 3px solid transparent;
}

.ring-1 {
  width: 120px;
  height: 120px;
  border-top: 3px solid #10b981;
  border-right: 3px solid #10b981;
  animation: rotate-ring-1 2s linear infinite;
}

.ring-2 {
  width: 90px;
  height: 90px;
  top: 15px;
  left: 15px;
  border-top: 3px solid #f59e0b;
  border-left: 3px solid #f59e0b;
  animation: rotate-ring-2 1.5s linear infinite reverse;
}

.ring-3 {
  width: 60px;
  height: 60px;
  top: 30px;
  left: 30px;
  border-top: 3px solid #ef4444;
  border-bottom: 3px solid #ef4444;
  animation: rotate-ring-3 1s linear infinite;
}

@keyframes rotate-ring-1 {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes rotate-ring-2 {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes rotate-ring-3 {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Icône centrale rotative */
.loader-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-icon {
  font-size: 24px;
  color: #10b981;
  animation: rotate-gear 3s linear infinite;
}

@keyframes rotate-gear {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Texte de chargement animé */
.loader-text {
  margin-bottom: 2rem;
}

.loader-text h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #10b981, #f59e0b, #ef4444);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-text 2s ease-in-out infinite;
}

.loader-text p {
  color: #0E6258;
  margin-bottom: 1rem;
  font-size: 1rem;
}

@keyframes gradient-text {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Points de chargement animés */
.loading-dots {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: dot-bounce 1.4s ease-in-out infinite both;
}

.dot-1 {
  background: #10b981;
  animation-delay: -0.32s;
}

.dot-2 {
  background: #f59e0b;
  animation-delay: -0.16s;
}

.dot-3 {
  background: #ef4444;
  animation-delay: 0s;
}

@keyframes dot-bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* Barre de progression moderne */
.progress-bar-modern {
  width: 250px;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
}

.progress-fill-modern {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #f59e0b, #ef4444);
  background-size: 200% 100%;
  border-radius: 3px;
  animation: progress-fill 2s ease-in-out infinite, gradient-move 3s ease-in-out infinite;
}

@keyframes progress-fill {
  0% { width: 0%; transform: translateX(-100%); }
  50% { width: 100%; transform: translateX(0%); }
  100% { width: 0%; transform: translateX(100%); }
}

@keyframes gradient-move {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Responsive pour le loader */
@media (max-width: 768px) {
  .modern-loader-container {
    padding: 1rem;
  }
  
  .loader-rings {
    width: 80px;
    height: 80px;
  }
  
  .ring-1 {
    width: 80px;
    height: 80px;
  }
  
  .ring-2 {
    width: 60px;
    height: 60px;
    top: 10px;
    left: 10px;
  }
  
  .ring-3 {
    width: 40px;
    height: 40px;
    top: 20px;
    left: 20px;
  }
  
  .center-icon {
    font-size: 18px;
  }
  
  .loader-text h3 {
    font-size: 1.25rem;
  }
  
  .progress-bar-modern {
    width: 200px;
  }
}
</style>