<template>
    <div class="min-h-screen my-bg">
      <!-- Loader moderne -->
      <div v-if="isLoading" class="modern-loader-overlay">
        <div class="modern-loader-container">
          <div class="loader-main">
            <div class="loader-rings">
              <div class="ring ring-1"></div>
              <div class="ring ring-2"></div>
              <div class="ring ring-3"></div>
            </div>
            <div class="loader-center">
              <div class="center-icon"><i class="fas fa-file-alt"></i></div>
            </div>
          </div>
          
          <div class="loader-text">
            <h3>Chargement en cours</h3>
            <p>Préparation du canevas de note conceptuelle...</p>
            <div class="loading-dots">
              <span class="dot dot-1"></span>
              <span class="dot dot-2"></span>
              <span class="dot dot-3"></span>
            </div>
          </div>
          
          <div class="progress-bar-modern">
            <div class="progress-fill-modern"></div>
          </div>
        </div>
      </div>
  
      <!-- Contenu principal -->
      <div v-else class="canevas-container">
        <!-- En-tête du formulaire -->
        <div class="form-header">
          <div class="header-content">
            <div class="header-icon"><i class="fas fa-file-contract"></i></div>
            <div class="header-text">
              <h1>{{ canevasData.nom || 'Canevas de Note Conceptuelle' }}</h1>
              <p class="header-description">{{ canevasData.description }}</p>
              <div class="header-badges">
                <span class="badge status" :class="{ 'modified': hasChanges }">
                  <span class="badge-icon"><i class="fas" :class="hasChanges ? 'fa-bolt' : 'fa-check'"></i></span>
                  <span class="badge-text">{{ hasChanges ? 'Modifié' : 'Sauvegardé' }}</span>
                </span>
                <span class="badge type">
                  <span class="badge-icon"><i class="fas fa-clipboard-list"></i></span>
                  <span class="badge-text">{{ canevasData.type || 'Formulaire' }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Informations générales -->
        <div class="general-info-card">
          <div class="card-header">
            <h3><i class="fas fa-info-circle"></i> Informations Générales</h3>
            <button @click="toggleGeneralEdit" class="edit-toggle-btn" :class="{ 'active': editingGeneral }">
              <span class="btn-icon"><i class="fas" :class="editingGeneral ? 'fa-save' : 'fa-edit'"></i></span>
              {{ editingGeneral ? 'Sauvegarder' : 'Modifier' }}
            </button>
          </div>
          
          <div class="general-info-content">
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">Nom du canevas</label>
                <input v-if="editingGeneral" 
                       v-model="canevasData.nom" 
                       class="info-input"
                       @input="markAsChanged" />
                <span v-else class="info-value">{{ canevasData.nom }}</span>
              </div>
              
              <div class="info-item">
                <label class="info-label">Type</label>
                <input v-if="editingGeneral" 
                       v-model="canevasData.type" 
                       class="info-input"
                       @input="markAsChanged" />
                <span v-else class="info-value">{{ canevasData.type }}</span>
              </div>
              
              <div class="info-item">
                <label class="info-label">Catégorie ID</label>
                <input v-if="editingGeneral" 
                       v-model.number="canevasData.categorieId" 
                       type="number"
                       class="info-input"
                       @input="markAsChanged" />
                <span v-else class="info-value">{{ canevasData.categorieId }}</span>
              </div>
              
              <div class="info-item full-width">
                <label class="info-label">Description</label>
                <textarea v-if="editingGeneral" 
                         v-model="canevasData.description" 
                         class="info-textarea"
                         rows="3"
                         @input="markAsChanged"></textarea>
                <span v-else class="info-value">{{ canevasData.description }}</span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Formulaire dynamique -->
        <div class="forms-section">
          <div class="section-header">
            <h3><i class="fas fa-list-alt"></i> Éléments du Formulaire</h3>
            <div class="section-actions">
              <button @click="validateAndPreview" class="btn btn-info">
                <span class="btn-icon"><i class="fas fa-eye"></i></span>
                Prévisualiser
              </button>
              <button @click="addNewField" class="btn btn-success">
                <span class="btn-icon"><i class="fas fa-plus"></i></span>
                Ajouter un champ
              </button>
              <button @click="addNewSection" class="btn btn-info">
                <span class="btn-icon"><i class="fas fa-folder-plus"></i></span>
                Ajouter une section
              </button>
              <button @click="toggleAllElements" class="btn btn-secondary">
                <span class="btn-icon"><i class="fas" :class="allExpanded ? 'fa-compress-alt' : 'fa-expand-alt'"></i></span>
                {{ allExpanded ? 'Réduire tout' : 'Développer tout' }}
              </button>
            </div>
          </div>
  
          <div class="forms-list" v-if="canevasData.forms && canevasData.forms.length > 0">
            <div v-for="(element, index) in sortedForms" 
                 :key="getElementKey(element, index)" 
                 :data-element-key="getElementKey(element, index)"
                 class="element-card"
                 :class="{ 
                   'expanded': expandedElements[getElementKey(element, index)], 
                   'new': isNewElement(element),
                   'modified': modifiedElements[getElementKey(element, index)],
                   'section': element.element_type === 'section',
                   'field': element.element_type === 'field'
                 }">
              
              <!-- En-tête de l'élément -->
              <div class="element-header" @click="toggleElement(getElementKey(element, index))">
                <div class="element-left">
                  <div class="element-number">{{ element.ordre_affichage }}</div>
                  <div class="element-type-badge" :class="element.element_type">
                    <i class="fas" :class="element.element_type === 'section' ? 'fa-folder' : getFieldTypeIcon(element.type_champ)"></i>
                  </div>
                  <div class="element-basic-info">
                    <h4 class="element-title">
                      {{ element.label || element.intitule || 'Nouvel élément' }}
                      <span class="required-indicator" v-if="element.is_required">*</span>
                    </h4>
                    <span class="element-meta">
                      {{ element.element_type === 'section' ? 'Section' : element.type_champ }}
                      <span v-if="element.element_type === 'section' && element.elements">
                        - {{ element.elements.length }} élément(s)
                      </span>
                    </span>
                  </div>
                </div>
                
                <div class="element-actions">
                  <button @click.stop="moveElement(index, 'up')" 
                          class="move-btn" 
                          :disabled="index === 0"
                          title="Monter">
                    <i class="fas fa-arrow-up"></i>
                  </button>
                  <button @click.stop="moveElement(index, 'down')" 
                          class="move-btn" 
                          :disabled="index === sortedForms.length - 1"
                          title="Descendre">
                    <i class="fas fa-arrow-down"></i>
                  </button>
                  <button @click.stop="deleteElement(getElementKey(element, index), index)" class="delete-btn">
                    <i class="fas fa-trash"></i>
                  </button>
                  <button class="expand-btn" :class="{ 'expanded': expandedElements[getElementKey(element, index)] }">
                    <i class="fas" :class="expandedElements[getElementKey(element, index)] ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                  </button>
                </div>
              </div>
  
              <!-- Contenu détaillé de l'élément -->
              <div v-if="expandedElements[getElementKey(element, index)]" class="element-content">
                
                <!-- Section -->
                <div v-if="element.element_type === 'section'" class="section-content">
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Intitulé de la section</label>
                      <input v-model="element.intitule" 
                             class="form-input" 
                             placeholder="Nom de la section"
                             @input="markElementAsChanged(getElementKey(element, index))" />
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label">Clé de la section</label>
                      <input v-model="element.key" 
                             class="form-input" 
                             placeholder="cle-de-la-section"
                             @input="markElementAsChanged(getElementKey(element, index))" />
                    </div>
                  </div>
                  
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Type de section</label>
                      <input v-model="element.type" 
                             class="form-input" 
                             placeholder="formulaire"
                             @input="markElementAsChanged(getElementKey(element, index))" />
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label">Section parente</label>
                      <select v-model="element.parentSectionId" 
                              class="form-select"
                              @change="markElementAsChanged(getElementKey(element, index))">
                        <option value="">Aucune (section racine)</option>
                        <option v-for="section in getAvailableSections(element)" 
                                :key="section.id || section.key" 
                                :value="section.id">
                          {{ section.intitule || section.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea v-model="element.description" 
                              class="form-textarea" 
                              rows="2"
                              placeholder="Description de la section"
                              @input="markElementAsChanged(getElementKey(element, index))"></textarea>
                  </div>
  
                  <!-- Éléments de la section -->
                  <div class="section-elements">
                    <div class="section-elements-header">
                      <h5><i class="fas fa-list"></i> Éléments de la section ({{ element.elements ? element.elements.length : 0 }})</h5>
                      <button @click="addElementToSection(element, getElementKey(element, index))" 
                              class="btn btn-success btn-sm" type="button">
                        <i class="fas fa-plus"></i> Ajouter un élément
                      </button>
                    </div>
                    
                    <!-- Liste des éléments existants -->
                    <div v-if="element.elements && element.elements.length > 0" class="sub-elements-list" :key="`section-elements-${getElementKey(element, index)}-${element.elements.length}`">
                      < <div v-for="(subElement, subIndex) in element.elements" 
         :key="`sub-${getElementKey(element, index)}-${subIndex}-${subElement.id || subIndex}-${element.elements.length}`"
         class="sub-element-card"
         :class="{ 'expanded': expandedSubElements[getSubElementKey(element, subIndex)] }">
                        
                        <!-- En-tête de l'élément de section -->
                        <div class="sub-element-header" @click="toggleSubElement(element, subIndex)">
                          <div class="sub-element-info">
                            <span class="sub-element-order">{{ subElement.ordre_affichage }}</span>
                            <span class="sub-element-label">{{ subElement.label || 'Nouvel élément' }}</span>
                            <span class="sub-element-type">{{ subElement.type_champ }}</span>
                            <span class="required-indicator" v-if="subElement.is_required">*</span>
                          </div>
                          <div class="sub-element-actions">
                            <button @click.stop="moveSubElement(element, subIndex, 'up')" 
                                    class="move-btn" 
                                    :disabled="subIndex === 0"
                                    title="Monter">
                              <i class="fas fa-arrow-up"></i>
                            </button>
                            <button @click.stop="moveSubElement(element, subIndex, 'down')" 
                                    class="move-btn" 
                                    :disabled="subIndex === element.elements.length - 1"
                                    title="Descendre">
                              <i class="fas fa-arrow-down"></i>
                            </button>
                            <button @click.stop="removeElementFromSection(element, subIndex, getElementKey(element, index))" 
                                    class="delete-btn"
                                    title="Supprimer">
                              <i class="fas fa-trash"></i>
                            </button>
                            <button class="expand-btn" 
                                    :class="{ 'expanded': expandedSubElements[getSubElementKey(element, subIndex)] }">
                              <i class="fas" :class="expandedSubElements[getSubElementKey(element, subIndex)] ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                            </button>
                          </div>
                        </div>
                        
                        <!-- Contenu détaillé de l'élément de section -->
                        <div v-if="expandedSubElements[getSubElementKey(element, subIndex)]" class="sub-element-content">
                          
                          <!-- CHAMPS DE BASE POUR LES SOUS-ELEMENTS - CORRIGÉ -->
                          <div class="form-row">
                            <div class="form-group">
                              <label class="form-label">Label du champ</label>
                              <input v-model="subElement.label" 
                                     class="form-input" 
                                     placeholder="Nom du champ"
                                     @input="markElementAsChanged(getElementKey(element, index))" />
                            </div>
                            
                            <div class="form-group">
                              <label class="form-label">Attribut</label>
                              <input v-model="subElement.attribut" 
                                     class="form-input" 
                                     placeholder="nom_attribut"
                                     @input="markElementAsChanged(getElementKey(element, index))" />
                            </div>
                          </div>
  
                          <div class="form-row">
                            <div class="form-group">
                              <label class="form-label">Clé du champ</label>
                              <input v-model="subElement.key" 
                                     class="form-input" 
                                     placeholder="cle-du-champ"
                                     @input="markElementAsChanged(getElementKey(element, index))" />
                            </div>
                            
                            <div class="form-group">
                              <label class="form-label">Document ID</label>
                              <input v-model.number="subElement.documentId" 
                                     class="form-input" 
                                     type="number"
                                     @input="markElementAsChanged(getElementKey(element, index))" />
                            </div>
                          </div>
  
                          <div class="form-group">
                            <label class="form-label">Description</label>
                            <textarea v-model="subElement.description" 
                                      class="form-textarea" 
                                      rows="2"
                                      placeholder="Description du champ"
                                      @input="markElementAsChanged(getElementKey(element, index))"></textarea>
                          </div>
  
                          <div class="form-row">
                            <div class="form-group">
                              <label class="form-label">Type de champ</label>
                              <select v-model="subElement.type_champ" 
                                      class="form-select"
                                      @change="onSubElementTypeChange(subElement, getElementKey(element, index))">
                                <option value="text">Texte</option>
                                <option value="textarea">Zone de texte</option>
                                <option value="number">Nombre</option>
                                <option value="email">Email</option>
                                <option value="date">Date</option>
                                <option value="select">Liste déroulante</option>
                                <option value="checkbox">Case à cocher</option>
                                <option value="radio">Bouton radio</option>
                                <option value="file">Fichier</option>
                                <option value="url">URL</option>
                                <option value="tel">Téléphone</option>
                              </select>
                            </div>
                            
                            <div class="form-group">
                              <label class="form-label">Champ obligatoire</label>
                              <div class="checkbox-wrapper">
                                <input type="checkbox" 
                                       v-model="subElement.is_required" 
                                       class="form-checkbox"
                                       @change="markElementAsChanged(getElementKey(element, index))" />
                                <span class="checkbox-label">Obligatoire</span>
                              </div>
                            </div>
                          </div>
  
                          <div class="form-row">
                            <div class="form-group">
                              <label class="form-label">Placeholder</label>
                              <input v-model="subElement.placeholder" 
                                     class="form-input" 
                                     placeholder="Texte d'aide pour l'utilisateur"
                                     @input="markElementAsChanged(getElementKey(element, index))" />
                            </div>
                            
                            <div class="form-group">
                              <label class="form-label">Valeur par défaut</label>
                              <input v-model="subElement.default_value" 
                                     class="form-input" 
                                     placeholder="Valeur par défaut"
                                     @input="markElementAsChanged(getElementKey(element, index))" />
                            </div>
                          </div>
  
                          <div class="form-group">
                            <label class="form-label">Information d'aide</label>
                            <textarea v-model="subElement.info" 
                                      class="form-textarea" 
                                      rows="2"
                                      placeholder="Information d'aide pour ce champ"
                                      @input="markElementAsChanged(getElementKey(element, index))"></textarea>
                          </div>
  
                          <!-- Champs techniques -->
                          <div class="form-row">
                            <div class="form-group">
                              <label class="form-label checkbox-wrapper">
                                <input type="checkbox" 
                                       v-model="subElement.champ_standard" 
                                       class="form-checkbox"
                                       @change="markElementAsChanged(getElementKey(element, index))" />
                                <span class="checkbox-label">Champ standard</span>
                              </label>
                            </div>
                            
                            <div class="form-group">
                              <label class="form-label checkbox-wrapper">
                                <input type="checkbox" 
                                       v-model="subElement.isEvaluated" 
                                       class="form-checkbox"
                                       @change="markElementAsChanged(getElementKey(element, index))" />
                                <span class="checkbox-label">Est évalué</span>
                              </label>
                            </div>
                          </div>
  
                          <div class="form-group">
                            <label class="form-label checkbox-wrapper">
                              <input type="checkbox" 
                                     v-model="subElement.startWithNewLine" 
                                     class="form-checkbox"
                                     @change="markElementAsChanged(getElementKey(element, index))" />
                              <span class="checkbox-label">Commencer sur nouvelle ligne</span>
                            </label>
                          </div>
  
                          <!-- Configuration spécifique au type de champ pour les sous-éléments -->
                          <div v-if="subElement.type_champ === 'textarea'" class="field-specific-config">
                            <h6><i class="fas fa-cog"></i> Configuration zone de texte</h6>
                            <div class="form-row">
                              <div class="form-group">
                                <label class="form-label">Nombre de lignes</label>
                                <input type="number" 
                                       v-model="subElement.meta_options.configs.rows" 
                                       class="form-input" 
                                       min="1" max="20"
                                       @input="markElementAsChanged(getElementKey(element, index))" />
                              </div>
                              <div class="form-group">
                                <label class="form-label">Longueur maximale</label>
                                <input type="number" 
                                       v-model="subElement.meta_options.configs.max_length" 
                                       class="form-input" 
                                       min="1"
                                       @input="markElementAsChanged(getElementKey(element, index))" />
                              </div>
                            </div>
                            <div class="form-group">
                              <label class="form-label">Longueur minimale</label>
                              <input type="number" 
                                     v-model="subElement.meta_options.configs.min_length" 
                                     class="form-input" 
                                     min="0"
                                     @input="markElementAsChanged(getElementKey(element, index))" />
                            </div>
                          </div>
  
                          <!-- Configuration pour SELECT dans les sous-éléments -->
                          <div v-if="subElement.type_champ === 'select'" class="field-specific-config">
                            <h6><i class="fas fa-list"></i> Configuration Liste Déroulante</h6>
                            
                            <div class="form-group">
                              <label class="form-label checkbox-wrapper">
                                <input type="checkbox" 
                                       v-model="subElement.meta_options.configs.multiple" 
                                       class="form-checkbox"
                                       @change="markElementAsChanged(getElementKey(element, index))" />
                                <span class="checkbox-label">Sélection multiple</span>
                              </label>
                            </div>
                            
                            <div class="form-group">
                              <label class="form-label">Options de la liste</label>
                              <div class="options-list">
                                <div v-for="(option, optIndex) in (subElement.meta_options.configs.options || [])" 
                                     :key="optIndex" 
                                     class="option-row">
                                  <input v-model="option.value" 
                                         class="form-input" 
                                         placeholder="Valeur"
                                         @input="markElementAsChanged(getElementKey(element, index))" />
                                  <input v-model="option.label" 
                                         class="form-input" 
                                         placeholder="Libellé affiché"
                                         @input="markElementAsChanged(getElementKey(element, index))" />
                                  <button @click="removeSubElementOption(subElement, optIndex, getElementKey(element, index))" 
                                          class="btn-remove-option" type="button">
                                    <i class="fas fa-times"></i>
                                  </button>
                                </div>
                                <button @click="addSubElementOption(subElement, getElementKey(element, index))" 
                                        class="btn btn-secondary btn-sm" type="button">
                                  <i class="fas fa-plus"></i> Ajouter option
                                </button>
                              </div>
                            </div>
                          </div>
  
                          <!-- Validation pour les sous-éléments - AMÉLIORÉE -->
                          <div class="validation-section">
                            <h6><i class="fas fa-shield-alt"></i> Validation Avancée</h6>
                            
                            <!-- Validations par type - INTERFACE COMPLÈTE pour sous-éléments -->
                            <div class="validations-grid">
                              <div class="form-group">
                                <label class="form-label checkbox-wrapper">
                                  <input type="checkbox" 
                                         v-model="subElement.meta_options.validations_rules.required" 
                                         class="form-checkbox"
                                         @change="markElementAsChanged(getElementKey(element, index))" />
                                  <span class="checkbox-label">Obligatoire</span>
                                </label>
                              </div>
                              
                              <div class="form-group">
                                <label class="form-label checkbox-wrapper">
                                  <input type="checkbox" 
                                         v-model="subElement.meta_options.validations_rules.string" 
                                         class="form-checkbox"
                                         @change="markElementAsChanged(getElementKey(element, index))" />
                                  <span class="checkbox-label">Validation chaîne</span>
                                </label>
                              </div>
                              
                              <div class="form-group">
                                <label class="form-label checkbox-wrapper">
                                  <input type="checkbox" 
                                         v-model="subElement.meta_options.validations_rules.number" 
                                         class="form-checkbox"
                                         @change="markElementAsChanged(getElementKey(element, index))" />
                                  <span class="checkbox-label">Validation nombre</span>
                                </label>
                              </div>
                              
                              <div class="form-group">
                                <label class="form-label checkbox-wrapper">
                                  <input type="checkbox" 
                                         v-model="subElement.meta_options.validations_rules.email" 
                                         class="form-checkbox"
                                         @change="markElementAsChanged(getElementKey(element, index))" />
                                  <span class="checkbox-label">Validation email</span>
                                </label>
                              </div>
                              
                              <div class="form-group">
                                <label class="form-label checkbox-wrapper">
                                  <input type="checkbox" 
                                         v-model="subElement.meta_options.validations_rules.array" 
                                         class="form-checkbox"
                                         @change="markElementAsChanged(getElementKey(element, index))" />
                                  <span class="checkbox-label">Validation tableau</span>
                                </label>
                              </div>
                            </div>
  
                            <div class="form-row" v-if="isTextType(subElement.type_champ)">
                              <div class="form-group">
                                <label class="form-label">Expression régulière</label>
                                <input v-model="subElement.meta_options.validations_rules.pattern" 
                                       class="form-input" 
                                       placeholder="^[A-Za-z]+$"
                                       @input="markElementAsChanged(getElementKey(element, index))" />
                              </div>
                            </div>
                            
                            <div class="form-group">
                              <label class="form-label">Message d'erreur personnalisé</label>
                              <textarea v-model="subElement.meta_options.validations_rules.custom_message" 
                                        class="form-textarea" 
                                        rows="2"
                                        placeholder="Message affiché en cas d'erreur de validation"
                                        @input="markElementAsChanged(getElementKey(element, index))"></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Message si aucun élément -->
                    <div v-else class="no-sub-elements">
                      <i class="fas fa-inbox"></i>
                      <p>Aucun élément dans cette section</p>
                      <small>Cliquez sur "Ajouter un élément" pour commencer</small>
                    </div>
                  </div>
                </div>
  
                <!-- Champ -->
                <div v-else class="field-content">
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Label du champ</label>
                      <input v-model="element.label" 
                             class="form-input" 
                             placeholder="Nom du champ"
                             @input="markElementAsChanged(getElementKey(element, index))" />
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label">Attribut</label>
                      <input v-model="element.attribut" 
                             class="form-input" 
                             placeholder="nom_attribut"
                             @input="markElementAsChanged(getElementKey(element, index))" />
                    </div>
                  </div>
  
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Clé du champ</label>
                      <input v-model="element.key" 
                             class="form-input" 
                             placeholder="cle-du-champ"
                             @input="markElementAsChanged(getElementKey(element, index))" />
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label">Document ID</label>
                      <input v-model.number="element.documentId" 
                             class="form-input" 
                             type="number"
                             @input="markElementAsChanged(getElementKey(element, index))" />
                    </div>
                  </div>
  
                  <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea v-model="element.description" 
                              class="form-textarea" 
                              rows="2"
                              placeholder="Description du champ"
                              @input="markElementAsChanged(getElementKey(element, index))"></textarea>
                  </div>
  
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Type de champ</label>
                      <select v-model="element.type_champ" 
                              class="form-select"
                              @change="onFieldTypeChange(element, getElementKey(element, index))">
                        <option value="text">Texte</option>
                        <option value="textarea">Zone de texte</option>
                        <option value="number">Nombre</option>
                        <option value="email">Email</option>
                        <option value="date">Date</option>
                        <option value="select">Liste déroulante</option>
                        <option value="checkbox">Case à cocher</option>
                        <option value="radio">Bouton radio</option>
                        <option value="group">Groupe de champs</option>
                        <option value="file">Fichier</option>
                        <option value="url">URL</option>
                        <option value="tel">Téléphone</option>
                      </select>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label">Champ obligatoire</label>
                      <div class="checkbox-wrapper">
                        <input type="checkbox" 
                               v-model="element.is_required" 
                               class="form-checkbox"
                               @change="markElementAsChanged(getElementKey(element, index))" />
                        <span class="checkbox-label">Obligatoire</span>
                      </div>
                    </div>
                  </div>
  
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Placeholder</label>
                      <input v-model="element.placeholder" 
                             class="form-input" 
                             placeholder="Texte d'aide pour l'utilisateur"
                             @input="markElementAsChanged(getElementKey(element, index))" />
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label">Valeur par défaut</label>
                      <input v-if="element.type_champ !== 'group'" 
                             v-model="element.default_value" 
                             class="form-input" 
                             placeholder="Valeur par défaut"
                             @input="markElementAsChanged(getElementKey(element, index))" />
                      <textarea v-else
                                v-model="element.defaultValueText" 
                                class="form-textarea" 
                                rows="2"
                                placeholder='{"montant": 1, "devise": "xof"}'
                                @input="updateDefaultValue(element, getElementKey(element, index))"></textarea>
                    </div>
                  </div>
  
                  <div class="form-group">
                    <label class="form-label">Information d'aide</label>
                    <textarea v-model="element.info" 
                              class="form-textarea" 
                              rows="2"
                              placeholder="Information d'aide pour ce champ"
                              @input="markElementAsChanged(getElementKey(element, index))"></textarea>
                  </div>
  
                  <!-- Champs techniques -->
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label checkbox-wrapper">
                        <input type="checkbox" 
                               v-model="element.champ_standard" 
                               class="form-checkbox"
                               @change="markElementAsChanged(getElementKey(element, index))" />
                        <span class="checkbox-label">Champ standard</span>
                      </label>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label checkbox-wrapper">
                        <input type="checkbox" 
                               v-model="element.isEvaluated" 
                               class="form-checkbox"
                               @change="markElementAsChanged(getElementKey(element, index))" />
                        <span class="checkbox-label">Est évalué</span>
                      </label>
                    </div>
                  </div>
  
                  <div class="form-group">
                    <label class="form-label checkbox-wrapper">
                      <input type="checkbox" 
                             v-model="element.startWithNewLine" 
                             class="form-checkbox"
                             @change="markElementAsChanged(getElementKey(element, index))" />
                      <span class="checkbox-label">Commencer sur nouvelle ligne</span>
                    </label>
                  </div>
  
                  <!-- Configuration spécifique au type de champ -->
                  <div v-if="element.type_champ === 'textarea'" class="field-specific-config">
                    <h6><i class="fas fa-cog"></i> Configuration zone de texte</h6>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Nombre de lignes</label>
                        <input type="number" 
                               v-model="element.meta_options.configs.rows" 
                               class="form-input" 
                               min="1" 
                               max="20"
                               @input="markElementAsChanged(getElementKey(element, index))" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Longueur minimale</label>
                        <input type="number" 
                               v-model="element.meta_options.configs.min_length" 
                               class="form-input" 
                               min="0"
                               @input="markElementAsChanged(getElementKey(element, index))" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Longueur maximale</label>
                      <input type="number" 
                             v-model="element.meta_options.configs.max_length" 
                             class="form-input" 
                             min="1"
                             @input="markElementAsChanged(getElementKey(element, index))" />
                    </div>
                  </div>
  
                  <!-- Configuration pour SELECT -->
                  <div v-if="element.type_champ === 'select'" class="field-specific-config">
                    <h6><i class="fas fa-list"></i> Configuration Liste Déroulante</h6>
                    
                    <div class="form-group">
                      <label class="form-label checkbox-wrapper">
                        <input type="checkbox" 
                               v-model="element.meta_options.configs.multiple" 
                               class="form-checkbox"
                               @change="markElementAsChanged(getElementKey(element, index))" />
                        <span class="checkbox-label">Sélection multiple</span>
                      </label>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label">Options de la liste</label>
                      <div class="options-list">
                        <div v-for="(option, optIndex) in (element.meta_options.configs.options || [])" 
                             :key="optIndex" 
                             class="option-row">
                          <input v-model="option.value" 
                                 class="form-input" 
                                 placeholder="Valeur"
                                 @input="markElementAsChanged(getElementKey(element, index))" />
                          <input v-model="option.label" 
                                 class="form-input" 
                                 placeholder="Libellé affiché"
                                 @input="markElementAsChanged(getElementKey(element, index))" />
                          <button @click="removeOption(element, optIndex, getElementKey(element, index))" 
                                  class="btn-remove-option" type="button">
                            <i class="fas fa-times"></i>
                          </button>
                        </div>
                        <button @click="addOption(element, getElementKey(element, index))" 
                                class="btn btn-secondary btn-sm" type="button">
                          <i class="fas fa-plus"></i> Ajouter option
                        </button>
                      </div>
                    </div>
                  </div>
  
                  <!-- Configuration pour NUMBER -->
                  <div v-if="element.type_champ === 'number'" class="field-specific-config">
                    <h6><i class="fas fa-hashtag"></i> Configuration Nombre</h6>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Valeur minimale</label>
                        <input type="number" 
                               v-model.number="element.meta_options.validations_rules.min" 
                               class="form-input"
                               @input="markElementAsChanged(getElementKey(element, index))" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Valeur maximale</label>
                        <input type="number" 
                               v-model.number="element.meta_options.validations_rules.max" 
                               class="form-input"
                               @input="markElementAsChanged(getElementKey(element, index))" />
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Pas (step)</label>
                        <input type="number" 
                               v-model.number="element.meta_options.configs.step" 
                               class="form-input" 
                               min="0.01" step="0.01"
                               @input="markElementAsChanged(getElementKey(element, index))" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Nombre de décimales</label>
                        <input type="number" 
                               v-model.number="element.meta_options.configs.decimal_places" 
                               class="form-input" 
                               min="0" max="10"
                               @input="markElementAsChanged(getElementKey(element, index))" />
                      </div>
                    </div>
                  </div>
  
                  <!-- Configuration pour GROUP - CORRIGÉE -->
                  <div v-if="element.type_champ === 'group'" class="field-specific-config">
                    <h6><i class="fas fa-layer-group"></i> Configuration Groupe</h6>
                    
                    <!-- Gestion des attributs enfants AMÉLIORÉE -->
                    <div class="form-group">
                      <label class="form-label">Attributs enfants</label>
                      <div class="children-attributes-manager">
                        <div v-for="(attr, attrIndex) in (element.meta_options.configs.children_attributes || [])" 
                             :key="attrIndex" 
                             class="attribute-row">
                          <input v-model="element.meta_options.configs.children_attributes[attrIndex]" 
                                 class="form-input" 
                                 placeholder="nom_attribut"
                                 @input="syncChildrenCounts(element, getElementKey(element, index))" />
                          <button @click="removeChildrenAttribute(element, attrIndex, getElementKey(element, index))" 
                                  class="btn-remove-option" type="button">
                            <i class="fas fa-times"></i>
                          </button>
                        </div>
                        <button @click="addChildrenAttribute(element, getElementKey(element, index))" 
                                class="btn btn-secondary btn-sm" type="button">
                          <i class="fas fa-plus"></i> Ajouter attribut
                        </button>
                      </div>
                      
                      <!-- Affichage automatique des counts -->
                      <div class="counts-info">
                        <small class="text-info">
                          <i class="fas fa-info-circle"></i>
                          Nombre d'attributs : {{ (element.meta_options.configs.children_attributes || []).length }}
                          (min/max seront automatiquement ajustés)
                        </small>
                      </div>
                    </div>
                    
                    <!-- Configuration avancée -->
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label checkbox-wrapper">
                          <input type="checkbox" 
                                 v-model="element.meta_options.configs.type_group" 
                                 class="form-checkbox"
                                 @change="markElementAsChanged(getElementKey(element, index))" />
                          <span class="checkbox-label">Type groupe</span>
                        </label>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label checkbox-wrapper">
                          <input type="checkbox" 
                                 v-model="element.meta_options.configs.required_children" 
                                 class="form-checkbox"
                                 @change="markElementAsChanged(getElementKey(element, index))" />
                          <span class="checkbox-label">Enfants obligatoires</span>
                        </label>
                      </div>
                    </div>
                    
                    <!-- Affichage readonly des counts calculés -->
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Min enfants (calculé automatiquement)</label>
                        <input type="number" 
                               :value="(element.meta_options.configs.children_attributes || []).length"
                               class="form-input" 
                               readonly />
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label">Max enfants (calculé automatiquement)</label>
                        <input type="number" 
                               :value="(element.meta_options.configs.children_attributes || []).length"
                               class="form-input" 
                               readonly />
                      </div>
                    </div>
                    
                    <!-- Autres configs -->
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Nombre de lignes</label>
                        <input type="number" 
                               v-model.number="element.meta_options.configs.rows" 
                               class="form-input" 
                               min="1" max="10"
                               @input="markElementAsChanged(getElementKey(element, index))" />
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label">Type de configuration</label>
                        <input v-model="element.meta_options.configs.type" 
                               class="form-input" 
                               placeholder="group"
                               @input="markElementAsChanged(getElementKey(element, index))" />
                      </div>
                    </div>
  
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Longueur minimale</label>
                        <input type="number" 
                               v-model.number="element.meta_options.configs.min_length" 
                               class="form-input" 
                               min="0"
                               @input="markElementAsChanged(getElementKey(element, index))" />
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label">Longueur maximale</label>
                        <input type="number" 
                               v-model.number="element.meta_options.configs.max_length" 
                               class="form-input" 
                               min="1"
                               @input="markElementAsChanged(getElementKey(element, index))" />
                      </div>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label">Valeur par défaut (JSON)</label>
                      <textarea v-model="element.defaultValueText" 
                                class="form-textarea" 
                                rows="2"
                                placeholder='{"montant": 1, "devise": "xof"}'
                                @input="updateDefaultValue(element, getElementKey(element, index))"></textarea>
                    </div>
                  </div>
  
                  <!-- Configuration pour FILE -->
                  <div v-if="element.type_champ === 'file'" class="field-specific-config">
                    <h6><i class="fas fa-file"></i> Configuration Fichier</h6>
                    
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label checkbox-wrapper">
                          <input type="checkbox" 
                                 v-model="element.meta_options.configs.multiple" 
                                 class="form-checkbox"
                                 @change="markElementAsChanged(getElementKey(element, index))" />
                          <span class="checkbox-label">Fichiers multiples</span>
                        </label>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label">Taille max (MB)</label>
                        <input type="number" 
                               v-model.number="element.meta_options.configs.max_size" 
                               class="form-input" 
                               min="1"
                               @input="markElementAsChanged(getElementKey(element, index))" />
                      </div>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label">Types acceptés (séparés par des virgules)</label>
                      <input v-model="element.acceptedTypesText" 
                             class="form-input" 
                             placeholder=".pdf,.doc,.docx,.jpg,.png"
                             @input="updateAcceptedTypes(element, getElementKey(element, index))" />
                    </div>
                  </div>
  
                  <!-- Validation avancée - CORRIGÉE -->
                  <div class="validation-section">
                    <h6><i class="fas fa-shield-alt"></i> Validation Avancée</h6>
                    
                    <!-- Validations par type - INTERFACE COMPLÈTE -->
                    <div class="validations-grid">
                      <div class="form-group">
                        <label class="form-label checkbox-wrapper">
                          <input type="checkbox" 
                                 v-model="element.meta_options.validations_rules.required" 
                                 class="form-checkbox"
                                 @change="markElementAsChanged(getElementKey(element, index))" />
                          <span class="checkbox-label">Obligatoire</span>
                        </label>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label checkbox-wrapper">
                          <input type="checkbox" 
                                 v-model="element.meta_options.validations_rules.string" 
                                 class="form-checkbox"
                                 @change="markElementAsChanged(getElementKey(element, index))" />
                          <span class="checkbox-label">Validation chaîne</span>
                        </label>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label checkbox-wrapper">
                          <input type="checkbox" 
                                 v-model="element.meta_options.validations_rules.number" 
                                 class="form-checkbox"
                                 @change="markElementAsChanged(getElementKey(element, index))" />
                          <span class="checkbox-label">Validation nombre</span>
                        </label>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label checkbox-wrapper">
                          <input type="checkbox" 
                                 v-model="element.meta_options.validations_rules.email" 
                                 class="form-checkbox"
                                 @change="markElementAsChanged(getElementKey(element, index))" />
                          <span class="checkbox-label">Validation email</span>
                        </label>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label checkbox-wrapper">
                          <input type="checkbox" 
                                 v-model="element.meta_options.validations_rules.array" 
                                 class="form-checkbox"
                                 @change="markElementAsChanged(getElementKey(element, index))" />
                          <span class="checkbox-label">Validation tableau</span>
                        </label>
                      </div>
                    </div>
  
                    <div class="form-row" v-if="isTextType(element.type_champ)">
                      <div class="form-group">
                        <label class="form-label">Expression régulière</label>
                        <input v-model="element.meta_options.validations_rules.pattern" 
                               class="form-input" 
                               placeholder="^[A-Za-z]+$"
                               @input="markElementAsChanged(getElementKey(element, index))" />
                      </div>
                    </div>
                    
                    <!-- NOUVEAU code -->
  <div class="form-group">
    <label class="form-label">Message d'erreur personnalisé</label>
    <textarea v-model="element.custom_error_message" 
              class="form-textarea" 
              rows="2"
              placeholder="Message affiché en cas d'erreur de validation"
              @input="markElementAsChanged(getElementKey(element, index))"></textarea>
  </div>
                    <!-- FIN NOUVEAU code -->
                  </div>
  
                  <!-- Conditions d'affichage -->
                  <div class="conditions-section">
                    <h6><i class="fas fa-code-branch"></i> Conditions d'Affichage</h6>
                    
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label checkbox-wrapper">
                          <input type="checkbox" 
                                 v-model="element.meta_options.conditions.visible" 
                                 class="form-checkbox"
                                 @change="markElementAsChanged(getElementKey(element, index))" />
                          <span class="checkbox-label">Visible par défaut</span>
                        </label>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label checkbox-wrapper">
                          <input type="checkbox" 
                                 v-model="element.meta_options.conditions.disable" 
                                 class="form-checkbox"
                                 @change="markElementAsChanged(getElementKey(element, index))" />
                          <span class="checkbox-label">Désactivé par défaut</span>
                        </label>
                      </div>
                    </div>
                    
                    <div class="conditions-list">
                      <label class="form-label">Conditions personnalisées</label>
                      <div v-for="(condition, condIndex) in (element.meta_options.conditions.conditions || [])" 
                           :key="condIndex" 
                           class="condition-row">
                        
                        <select v-model="condition.field" 
                                class="form-select"
                                @change="markElementAsChanged(getElementKey(element, index))">
                          <option value="">Choisir un champ</option>
                          <option v-for="field in getAvailableFields()" 
                                  :key="field.attribut" 
                                  :value="field.attribut">
                            {{ field.label || field.attribut }}
                          </option>
                        </select>
                        
                        <select v-model="condition.operator" 
                                class="form-select"
                                @change="markElementAsChanged(getElementKey(element, index))">
                          <option value="equals">Égal à</option>
                          <option value="not_equals">Différent de</option>
                          <option value="greater_than">Supérieur à</option>
                          <option value="less_than">Inférieur à</option>
                          <option value="contains">Contient</option>
                          <option value="not_empty">Non vide</option>
                        </select>
                        
                        <input v-model="condition.value" 
                               class="form-input" 
                               placeholder="Valeur"
                               @input="markElementAsChanged(getElementKey(element, index))" />
                        
                        <select v-model="condition.action" 
                                class="form-select"
                                @change="markElementAsChanged(getElementKey(element, index))">
                          <option value="show">Afficher</option>
                          <option value="hide">Masquer</option>
                          <option value="enable">Activer</option>
                          <option value="disable">Désactiver</option>
                        </select>
                        
                        <button @click="removeCondition(element, condIndex, getElementKey(element, index))" 
                                class="btn-remove-condition" type="button">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                      
                      <button @click="addCondition(element, getElementKey(element, index))" 
                              class="btn btn-secondary btn-sm" type="button">
                        <i class="fas fa-plus"></i> Ajouter condition
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div v-else class="empty-state">
            <div class="empty-icon"><i class="fas fa-file-alt"></i></div>
            <h3>Aucun élément défini</h3>
            <p>Commencez par ajouter des champs ou des sections à votre canevas</p>
            <button @click="addNewField" class="btn btn-primary">
              <span class="btn-icon"><i class="fas fa-plus"></i></span>
              Ajouter le premier champ
            </button>
          </div>
        </div>
  
        <!-- Actions du formulaire -->
        <div class="form-actions">
          <div class="actions-left">
            <button @click="resetChanges" class="btn btn-secondary" :disabled="!hasChanges">
              <span class="btn-icon"><i class="fas fa-undo"></i></span>
              Annuler les modifications
            </button>
            
            <button @click="validateStructure" class="btn btn-outline-secondary">
              <span class="btn-icon"><i class="fas fa-check-circle"></i></span>
              Valider la structure
            </button>
          </div>
          
          <div class="actions-right">
            <button @click="exportJson" class="btn btn-outline-secondary">
              <span class="btn-icon"><i class="fas fa-download"></i></span>
              Exporter JSON
            </button>
            
            <button @click="saveCanevas" class="btn btn-primary" :disabled="!hasChanges || isLoading">
              <span class="btn-icon"><i class="fas" :class="isLoading ? 'fa-spinner fa-spin' : 'fa-save'"></i></span>
              {{ isLoading ? 'Sauvegarde...' : 'Sauvegarder' }}
            </button>
          </div>
        </div>
  
        <!-- Modal de confirmation -->
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
          <div class="modal-container" @click.stop>
            <div class="modal-header">
              <h2 class="modal-title">{{ modalTitle }}</h2>
              <button @click="closeModal" class="close-button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
  
            <div class="modal-body">
              <p>{{ modalMessage }}</p>
              
              <div v-if="modalAction && modalAction.type === 'preview'" class="preview-content">
                <h4>Résumé des modifications :</h4>
                <ul class="changes-list">
                  <li v-for="change in getChangesSummary()" :key="change" class="change-item">
                    {{ change }}
                  </li>
                </ul>
              </div>
              
              <div v-if="modalAction && modalAction.type === 'validation'" class="validation-content">
                <h4>Résultats de la validation :</h4>
                <div v-if="validationErrors.length === 0" class="validation-success">
                  <i class="fas fa-check-circle"></i>
                  <p>Aucune erreur détectée. La structure est valide.</p>
                </div>
                <div v-else class="validation-errors">
                  <ul class="errors-list">
                    <li v-for="error in validationErrors" :key="error" class="error-item">
                      <i class="fas fa-exclamation-triangle"></i>
                      {{ error }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="modal-actions">
              <button @click="closeModal" class="btn btn-outline-secondary">
                {{ modalAction && modalAction.type === 'validation' ? 'Fermer' : 'Annuler' }}
              </button>
              <button v-if="modalAction && modalAction.type !== 'validation'" @click="confirmAction" class="btn btn-primary">
                {{ getConfirmButtonText() }}
              </button>
            </div>
          </div>
        </div>
  
        <!-- Notification -->
        <Transition name="notification">
          <div v-if="notification.show" class="notification" :class="notification.type">
            <span class="notification-icon">
              <i class="fas" :class="getNotificationIcon()"></i>
            </span>
            <span class="notification-message">{{ notification.message }}</span>
            <button @click="hideNotification" class="notification-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { onBeforeRouteLeave } from 'vue-router'
  import { getCanevasNoteConceptuelleService, constitueCanevasNoteConceptuelleService } from '../../../services/api/ficheIdee.api'
  
  export default {
    name: 'CanevasNoteConceptuelleForm',
    
    setup() {
      // État réactif
      const isLoading = ref(true)
      const hasChanges = ref(false)
      const editingGeneral = ref(false)
      const allExpanded = ref(false)
      const expandedElements = ref({})
      const expandedSubElements = ref({})
      const modifiedElements = ref({})
      const originalCanevasData = ref(null)
      const showModal = ref(false)
      const modalTitle = ref('')
      const modalMessage = ref('')
      const modalAction = ref(null)
      const nextElementId = ref(1000)
      const validationErrors = ref([])
  
      const canevasData = reactive({
        nom: "Canevas de rédaction de la note conceptuelle",
        description: "Formulaire de rédaction d'une note conceptuelle de projet",
        type: "formulaire",
        categorieId: 2,
        forms: [] 
      })
  
      const notification = reactive({
        show: false,
        type: 'success',
        message: ''
      })
  
      // Computed
      const sortedForms = computed(() => {
        return [...canevasData.forms].sort((a, b) => a.ordre_affichage - b.ordre_affichage)
      })
  
      // Méthodes utilitaires
      const getElementKey = (element, index) => {
        return element.id || `new-${index}`
      }
  
      const isNewElement = (element) => {
        return !element.id || element.id >= 1000
      }
  
      const getFieldTypeIcon = (type) => {
        const icons = {
          text: 'fa-font',
          textarea: 'fa-align-left',
          number: 'fa-hashtag',
          email: 'fa-envelope',
          date: 'fa-calendar-alt',
          select: 'fa-list',
          checkbox: 'fa-check-square',
          radio: 'fa-dot-circle',
          group: 'fa-layer-group',
          file: 'fa-file',
          url: 'fa-link',
          tel: 'fa-phone'
        }
        return icons[type] || 'fa-font'
      }
  
      // Gestion des sous-éléments dans les sections
      const getSubElementKey = (parentElement, subIndex) => {
        const parentKey = getElementKey(parentElement)
        return `${parentKey}-sub-${subIndex}`
      }
  
      const toggleSubElement = (parentElement, subIndex) => {
        const key = getSubElementKey(parentElement, subIndex)
        expandedSubElements.value[key] = !expandedSubElements.value[key]
      }
  
      // Sections disponibles (exclut l'élément actuel pour éviter les références circulaires)
      const getAvailableSections = (currentElement = null) => {
        return canevasData.forms.filter(f => 
          f.element_type === 'section' && 
          (!currentElement || f.id !== currentElement.id)
        )
      }
  
      // Initialisation des champs texte pour l'interface
      const initializeTextFields = (element) => {
        if (element.meta_options?.configs?.children_attributes) {
          element.childrenAttributesText = element.meta_options.configs.children_attributes.join('\n')
        }
        
        if (element.default_value && typeof element.default_value === 'object') {
          element.defaultValueText = JSON.stringify(element.default_value, null, 2)
        }
  
        if (element.meta_options?.configs?.accepted_types) {
          element.acceptedTypesText = element.meta_options.configs.accepted_types.join(', ')
        }
      }
  
      // Mise à jour des attributs enfants pour les groupes
      const updateChildrenAttributes = (element, elementKey) => {
        if (element.childrenAttributesText) {
          element.meta_options.configs.children_attributes = 
            element.childrenAttributesText.split('\n').filter(attr => attr.trim())
        }
        markElementAsChanged(elementKey)
      }
  
      const updateDefaultValue = (element, elementKey) => {
        try {
          if (element.defaultValueText) {
            element.default_value = JSON.parse(element.defaultValueText)
          }
        } catch (e) {
          console.warn('JSON invalide pour la valeur par défaut')
        }
        markElementAsChanged(elementKey)
      }
  
      const updateAcceptedTypes = (element, elementKey) => {
        if (element.acceptedTypesText) {
          element.meta_options.configs.accepted_types = 
            element.acceptedTypesText.split(',').map(type => type.trim()).filter(type => type)
        }
        markElementAsChanged(elementKey)
      }
  
      // Configuration par défaut selon le type de champ - VERSION CORRIGÉE
  
  const getDefaultConfigForType = (type) => {
    const configs = {
      text: { 
        max_length: 255,
        min_length: 1
      },
      textarea: { 
        rows: 4,
        max_length: 2000,
        min_length: 10
      },
      number: { 
        step: 1,
        decimal_places: 0
      },
      email: { 
        max_length: 255,
        min_length: 5
      },
      date: { 
        format: 'YYYY-MM-DD'
      },
      select: { 
        options: [],
        multiple: false
      },
      checkbox: {
        // Aucune config par défaut
      },
      radio: {
        options: []
      },
      file: {
        multiple: false,
        accepted_types: [],
        max_size: 10
      },
      url: {
        max_length: 255,
        min_length: 8
      },
      tel: {
        max_length: 20,
        min_length: 8
      },
      group: { 
        rows: 2,
        type: 'group',
        max_length: 1500,
        min_length: 20,
        type_group: true,
        required_children: true,
        children_count_min: 0, 
        children_count_max: 0, 
        children_attributes: []
      }
    }
    
    return configs[type] || {}
  }
  
   // REMPLACER COMPLÈTEMENT cette fonction
  const getDefaultValidationForType = (type) => {
    const validations = {
      text: { 
        string: true
      },
      textarea: { 
        string: true
      },
      number: { 
        numeric: true  // IMPORTANT: 'numeric' pas 'number' pour Laravel
      },
      email: { 
        email: true,
        string: true
      },
      date: {
        date: true
      },
      select: { 
        // Pas de validation spécifique par défaut
      },
      checkbox: {
        boolean: true
      },
      radio: {
        // Pas de validation spécifique par défaut
      },
      file: {
        file: true
      },
      url: {
        url: true
      },
      tel: {
        string: true
      },
      group: { 
        array: true
      }
    }
    
    return validations[type] || {}
  }
  
      // Utilitaires de type
      const isTextType = (type) => {
        return ['text', 'textarea', 'email', 'url', 'tel'].includes(type)
      }
  
      const isNumberType = (type) => {
        return ['number'].includes(type)
      }
  
      // Validation de la structure complète
    // Améliorer validateFormStructure - REMPLACER
  const validateFormStructure = () => {
    const errors = []
    
    canevasData.forms.forEach((element, index) => {
      // Vérifications de base
      if (!element.element_type) {
        errors.push(`Élément ${index + 1}: type d'élément manquant`)
      }
      
      if (element.element_type === 'field') {
        if (!element.label || !element.attribut) {
          errors.push(`Champ ${index + 1}: label ou attribut manquant`)
        }
        
        if (!element.type_champ) {
          errors.push(`Champ ${index + 1}: type de champ manquant`)
        }
        
        // Validation spécifique pour les groupes - AMÉLIORÉE
        if (element.type_champ === 'group') {
          const childrenAttrs = element.meta_options?.configs?.children_attributes || []
          const minCount = element.meta_options?.configs?.children_count_min
          const maxCount = element.meta_options?.configs?.children_count_max
          
          if (childrenAttrs.length === 0) {
            errors.push(`Champ groupe ${index + 1}: attributs enfants manquants`)
          }
          
          if (minCount !== childrenAttrs.length || maxCount !== childrenAttrs.length) {
            errors.push(`Champ groupe ${index + 1}: nombre d'attributs (${childrenAttrs.length}) doit correspondre aux min/max (${minCount}/${maxCount})`)
          }
          
          // Vérifier que les attributs ne sont pas vides
          const emptyAttrs = childrenAttrs.filter(attr => !attr || !attr.trim())
          if (emptyAttrs.length > 0) {
            errors.push(`Champ groupe ${index + 1}: ${emptyAttrs.length} attribut(s) enfant(s) vide(s)`)
          }
        }
        
        // Validation pour les selects
        if (['select', 'radio'].includes(element.type_champ)) {
          if (!element.meta_options?.configs?.options?.length) {
            errors.push(`Champ ${element.type_champ} ${index + 1}: options manquantes`)
          }
        }
      }
      
      if (element.element_type === 'section') {
        if (!element.intitule && !element.label) {
          errors.push(`Section ${index + 1}: intitulé manquant`)
        }
        
        if (!element.key) {
          errors.push(`Section ${index + 1}: clé manquante`)
        }
        
        // Validation des éléments de section
        if (element.elements) {
          element.elements.forEach((subElement, subIndex) => {
            if (!subElement.label || !subElement.attribut) {
              errors.push(`Section ${index + 1}, élément ${subIndex + 1}: label ou attribut manquant`)
            }
          })
        }
      }
    })
    
    return errors
  }
  
      // Fonction de nettoyage des données avant sauvegarde - VERSION AMÉLIORÉE
  // REMPLACER ENTIÈREMENT cette fonction
  const cleanDataForSave = (data) => {
    const cleanElement = (element) => {
      const cleaned = { ...element }
      
      if (cleaned.element_type === 'field') {
        // 1. CONFIGS - selon le type
        const baseConfigs = getDefaultConfigForType(cleaned.type_champ)
        cleaned.meta_options = cleaned.meta_options || {}
        cleaned.meta_options.configs = { ...baseConfigs }
        
        const currentConfigs = element.meta_options?.configs || {}
        const configsToKeep = cleaned.meta_options.configs
        
        // Logique par type pour les configs
        switch (cleaned.type_champ) {
          case 'text':
          case 'email':
          case 'url':  
          case 'tel':
            if (currentConfigs.max_length) configsToKeep.max_length = currentConfigs.max_length
            if (currentConfigs.min_length) configsToKeep.min_length = currentConfigs.min_length
            break
            
          case 'textarea':
            if (currentConfigs.rows) configsToKeep.rows = currentConfigs.rows
            if (currentConfigs.max_length) configsToKeep.max_length = currentConfigs.max_length
            if (currentConfigs.min_length) configsToKeep.min_length = currentConfigs.min_length
            break
            
          case 'number':
            if (currentConfigs.step) configsToKeep.step = currentConfigs.step
            if (currentConfigs.decimal_places !== undefined) configsToKeep.decimal_places = currentConfigs.decimal_places
            break
            
          case 'select':
          case 'radio':
            configsToKeep.options = currentConfigs.options || []
            if (currentConfigs.multiple !== undefined) configsToKeep.multiple = currentConfigs.multiple
            break
            
          case 'file':
            configsToKeep.accepted_types = currentConfigs.accepted_types || []
            if (currentConfigs.multiple !== undefined) configsToKeep.multiple = currentConfigs.multiple
            if (currentConfigs.max_size) configsToKeep.max_size = currentConfigs.max_size
            break
            
          case 'group':
            // Gestion spéciale pour les groupes
            if (element.childrenAttributesText || currentConfigs.children_attributes) {
              const attributes = element.childrenAttributesText 
                ? element.childrenAttributesText.split('\n').map(attr => attr.trim()).filter(attr => attr !== '')
                : currentConfigs.children_attributes || []
              
              configsToKeep.children_attributes = attributes
              configsToKeep.children_count_min = attributes.length
              configsToKeep.children_count_max = attributes.length
              configsToKeep.type = 'group'
              configsToKeep.type_group = true
              configsToKeep.required_children = currentConfigs.required_children !== false
              
              if (currentConfigs.rows) configsToKeep.rows = currentConfigs.rows
              if (currentConfigs.max_length) configsToKeep.max_length = currentConfigs.max_length  
              if (currentConfigs.min_length) configsToKeep.min_length = currentConfigs.min_length
            }
            break
            
          default:
            cleaned.meta_options.configs = {}
        }
        
        // 2. VALIDATIONS - SEULEMENT règles Laravel valides
        const baseValidations = getDefaultValidationForType(cleaned.type_champ)
        cleaned.meta_options.validations_rules = { ...baseValidations }
        
        const currentValidations = element.meta_options?.validations_rules || {}
        const validationsToKeep = cleaned.meta_options.validations_rules
        
        // Ajouter required SEULEMENT si true
        if (currentValidations.required === true || cleaned.is_required === true) {
          validationsToKeep.required = true
        }
        
        // Pour les nombres : ajouter min/max si définis
        if (cleaned.type_champ === 'number') {
          if (currentValidations.min !== undefined && currentValidations.min !== null) {
            validationsToKeep.min = currentValidations.min
          }
          if (currentValidations.max !== undefined && currentValidations.max !== null) {
            validationsToKeep.max = currentValidations.max
          }
        }
        
        // Pour les textes : ajouter regex si défini
        if (['text', 'textarea', 'email', 'url', 'tel'].includes(cleaned.type_champ) && currentValidations.pattern) {
          validationsToKeep.regex = currentValidations.pattern
        }
        
        // Pour les groupes : synchroniser min/max avec les attributs
        if (cleaned.type_champ === 'group') {
          const childrenCount = configsToKeep.children_attributes?.length || 0
          if (childrenCount > 0) {
            validationsToKeep.min = childrenCount
            validationsToKeep.max = childrenCount
          }
        }
        
        // 3. MESSAGES PERSONNALISÉS - dans une propriété séparée
        if (currentValidations.custom_message) {
          cleaned.meta_options.custom_messages = {}
          cleaned.meta_options.custom_messages[cleaned.attribut] = currentValidations.custom_message
        }
        
        // 4. CONDITIONS - par défaut
        cleaned.meta_options.conditions = cleaned.meta_options.conditions || {
          disable: false,
          visible: true,
          conditions: []
        }
        
        // 5. Gérer default_value pour les groupes
        if (cleaned.type_champ === 'group' && element.defaultValueText) {
          try {
            cleaned.default_value = JSON.parse(element.defaultValueText)
          } catch (e) {
            console.warn('JSON invalide pour la valeur par défaut:', e)
          }
        }
      }
      
      // Nettoyer les sections récursivement
       if (cleaned.element_type === 'section') {
        console.log(`📁 Nettoyage section "${element.intitule}"`)
        console.log(`📁 Éléments avant nettoyage:`, element.elements?.length || 0)
        
        if (element.elements && Array.isArray(element.elements) && element.elements.length > 0) {
          // FILTRAGE MOINS STRICT - accepter les éléments avec au moins un identifiant valide
          const validElements = element.elements.filter(subElement => {
            if (!subElement) return false
            
            // Accepter si c'est un champ ET a au moins label OU attribut (pas forcément les deux)
            const hasValidIdentifier = subElement.element_type === 'field' && 
                                     (subElement.label?.trim() || subElement.attribut?.trim())
            
            if (!hasValidIdentifier && subElement) {
              console.log(`❌ Élément filtré:`, {
                label: subElement.label,
                attribut: subElement.attribut,
                type: subElement.element_type
              })
            }
            
            return hasValidIdentifier
          })
          
          console.log(`📁 Éléments valides après filtrage:`, validElements.length)
          
          // Nettoyer et réorganiser
          cleaned.elements = validElements.map((subElement, index) => {
            const cleanedSub = cleanElement(subElement)
            cleanedSub.ordre_affichage = index + 1
            return cleanedSub
          })
          
          console.log(`📁 Éléments finaux dans la section:`, cleaned.elements.length)
        } else {
          console.log(`📁 Aucun élément dans la section "${element.intitule}"`)
          cleaned.elements = []
        }
      }
      
      // Supprimer les champs temporaires
      delete cleaned.childrenAttributesText
      delete cleaned.defaultValueText
      delete cleaned.acceptedTypesText
      
      return cleaned
    }
    
    const result = {
      ...data,
      forms: data.forms.map(cleanElement)
    }
    
    console.log('🧹 Résultat final cleanDataForSave:')
    result.forms.forEach(form => {
      if (form.element_type === 'section') {
        console.log(`  Section "${form.intitule}": ${form.elements?.length || 0} éléments`)
      }
    })
    
    return result
  }
  
  const debugSectionElements = () => {
    console.log('🔍 DEBUG - État des sections avant sauvegarde:')
    canevasData.forms.forEach((form, index) => {
      if (form.element_type === 'section') {
        console.log(`  ${index}: Section "${form.intitule}"`)
        console.log(`    - Référence canevasData.forms: ${form.elements?.length || 0} éléments`)
        
        form.elements?.forEach((elem, elemIndex) => {
          console.log(`      ${elemIndex}: ${elem.label || 'sans label'} (${elem.attribut || 'sans attribut'})`)
        })
      }
    })
  }
  
  
      // Gestion avancée des groupes - AJOUTER CES MÉTHODES
  const addChildrenAttribute = (element, elementKey) => {
    if (!element.meta_options.configs.children_attributes) {
      element.meta_options.configs.children_attributes = []
    }
    element.meta_options.configs.children_attributes.push('')
    syncChildrenCounts(element, elementKey)
  }
  
  const removeChildrenAttribute = (element, index, elementKey) => {
    if (element.meta_options.configs.children_attributes) {
      element.meta_options.configs.children_attributes.splice(index, 1)
      syncChildrenCounts(element, elementKey)
    }
  }
  
  const syncChildrenCounts = (element, elementKey) => {
    if (!element.meta_options?.configs?.children_attributes) return
    
    const count = element.meta_options.configs.children_attributes.filter(attr => attr && attr.trim()).length
    
    element.meta_options.configs.children_count_min = count
    element.meta_options.configs.children_count_max = count
    
    // Synchroniser aussi les validations
    element.meta_options.validations_rules.min = count
    element.meta_options.validations_rules.max = count
    
    markElementAsChanged(elementKey)
  }
  
      // Méthodes principales
      const loadCanevasData = async () => {
        try {
          isLoading.value = true
          const response = await getCanevasNoteConceptuelleService.getCanevas()
          
          // Extraire les données selon la structure du JSON
          const data = response.data || response
          
          // Mise à jour de l'objet réactif
          Object.assign(canevasData, {
            id: data.id,
            nom: data.nom,
            description: data.description,
            type: data.type,
            categorieId: data.categorieId,
            forms: data.forms || []
          })
          
          originalCanevasData.value = JSON.parse(JSON.stringify(canevasData))
          
          // Initialiser les états d'expansion et les champs texte
          canevasData.forms.forEach(element => {
            initializeTextFields(element)
            
            if (element.element_type === 'section' && element.elements) {
              element.elements.forEach(subElement => {
                initializeTextFields(subElement)
              })
            }
          })
          
          showNotification('Canevas chargé avec succès', 'success')
        } catch (error) {
          showNotification('Erreur lors du chargement du canevas', 'error')
          console.error('Erreur:', error)
        } finally {
          isLoading.value = false
        }
      }
  
      const markAsChanged = () => {
        hasChanges.value = true
      }
  
      const markElementAsChanged = (elementKey) => {
        hasChanges.value = true
        modifiedElements.value[elementKey] = true
      }
  
      const toggleGeneralEdit = () => {
        if (editingGeneral.value) {
          markAsChanged()
        }
        editingGeneral.value = !editingGeneral.value
      }
  
      const toggleElement = (elementKey) => {
        expandedElements.value[elementKey] = !expandedElements.value[elementKey]
      }
  
      const toggleAllElements = () => {
        allExpanded.value = !allExpanded.value
        canevasData.forms.forEach((element, index) => {
          const key = getElementKey(element, index)
          expandedElements.value[key] = allExpanded.value
        })
      }
  
      // Fonction pour créer un nouvel élément avec structure complète
     const createNewFieldElement = () => {
    return {
      id: nextElementId.value++,
      element_type: "field",
      ordre_affichage: canevasData.forms.length + 1,
      label: "",
      info: "",
      key: "", 
      description: "", 
      attribut: "",
      placeholder: "",
      is_required: false,
      default_value: null,
      isEvaluated: false,
      type_champ: "text",
      documentId: canevasData.id || 2,
      meta_options: {
        configs: getDefaultConfigForType("text"),
        conditions: {
          disable: false,
          visible: true,
          conditions: []
        },
        validations_rules: getDefaultValidationForType("text")
      },
      champ_standard: false,
      startWithNewLine: null
    }
  }
      const addNewField = () => {
        const newField = createNewFieldElement()
        
        canevasData.forms.push(newField)
        const key = getElementKey(newField, canevasData.forms.length - 1)
        expandedElements.value[key] = true
        modifiedElements.value[key] = true
        markAsChanged()
        
        scrollToElement(key)
        showNotification('Nouveau champ ajouté avec succès', 'success')
      }
  
      const addNewSection = () => {
        const newSection = {
          id: nextElementId.value++,
          element_type: 'section',
          ordre_affichage: canevasData.forms.length + 1,
          key: '',
          intitule: '',
          description: '',
          type: 'formulaire',
          parentSectionId: null,
          elements: []
        }
        
        canevasData.forms.push(newSection)
        const key = getElementKey(newSection, canevasData.forms.length - 1)
        expandedElements.value[key] = true
        modifiedElements.value[key] = true
        markAsChanged()
        
        scrollToElement(key)
        showNotification('Nouvelle section ajoutée avec succès', 'success')
      }
  
      const addElementToSection = (section, sectionKey) => {
        if (!section.elements) {
          section.elements = []
        }
        
       const newElement = {
    id: nextElementId.value++,
    element_type: 'field',
    ordre_affichage: section.elements.length + 1,
    label: '',
    info: '',
    key: '', // AJOUTER
    description: '', // AJOUTER
    attribut: '',
    placeholder: '',
    is_required: false,
    default_value: null,
    isEvaluated: false,
    type_champ: 'text',
    documentId: canevasData.id || 2,
    meta_options: {
      configs: getDefaultConfigForType('text'),
      conditions: {
        disable: false,
        visible: true,
        conditions: []
      },
      validations_rules: getDefaultValidationForType('text')
    },
    champ_standard: false,
    startWithNewLine: null
  }
        
        section.elements.push(newElement)
        
        // Étendre automatiquement le nouvel élément
        const subKey = getSubElementKey(section, section.elements.length - 1)
        expandedSubElements.value[subKey] = true
        
        markElementAsChanged(sectionKey)
        showNotification('Élément ajouté à la section', 'success')
      }
  
  // ===== 1. REMPLACER la méthode removeElementFromSection =====
  // Remplacer complètement la méthode existante par celle-ci :
  
  const removeElementFromSection = (section, subIndex, sectionKey) => {
    console.log('🗑️ DEBUT removeElementFromSection')
    console.log('🗑️ Section:', section.intitule || section.key)
    console.log('🗑️ Index à supprimer:', subIndex)
    console.log('🗑️ Éléments avant:', section.elements?.length || 0)
    
    if (!section.elements || !section.elements[subIndex]) {
      console.error('❌ Élément non trouvé')
      return
    }
    
    const elementToRemove = section.elements[subIndex]
    console.log('🗑️ Élément à supprimer:', elementToRemove.label || elementToRemove.attribut)
    
    // Nettoyer l'état d'expansion
    const subKey = getSubElementKey(section, subIndex)
    delete expandedSubElements.value[subKey]
    
    // Trouver la section dans canevasData.forms
    let sectionIndex = -1
    
    // Méthode 1: Par référence directe (le plus fiable)
    sectionIndex = canevasData.forms.findIndex(form => form === section)
    
    // Méthode 2: Par ID si pas trouvé par référence
    if (sectionIndex === -1 && section.id) {
      sectionIndex = canevasData.forms.findIndex(form => 
        form.element_type === 'section' && form.id === section.id
      )
    }
    
    // Méthode 3: Par clé si pas trouvé
    if (sectionIndex === -1 && section.key) {
      sectionIndex = canevasData.forms.findIndex(form => 
        form.element_type === 'section' && form.key === section.key
      )
    }
    
    console.log('🗑️ Index de la section trouvée:', sectionIndex)
    
    if (sectionIndex !== -1) {
      // Supprimer directement dans canevasData.forms
      canevasData.forms[sectionIndex].elements.splice(subIndex, 1)
      
      // Réorganiser les ordres d'affichage
      canevasData.forms[sectionIndex].elements.forEach((element, index) => {
        element.ordre_affichage = index + 1
      })
      
      // Synchroniser la référence locale (important pour l'affichage immédiat)
      section.elements = [...canevasData.forms[sectionIndex].elements]
      
      console.log('🗑️ Éléments après suppression:', section.elements.length)
      
    } else {
      console.error('❌ Section non trouvée dans canevasData.forms')
    }
    
    // Marquer comme modifié
    markElementAsChanged(sectionKey)
    hasChanges.value = true
    
    showNotification('Élément supprimé de la section', 'success')
  }
  
  
      const moveElement = (index, direction) => {
        const currentElement = sortedForms.value[index]
        const targetIndex = direction === 'up' ? index - 1 : index + 1
        
        if (targetIndex < 0 || targetIndex >= sortedForms.value.length) return
        
        const targetElement = sortedForms.value[targetIndex]
        
        // Échanger les ordres d'affichage
        const tempOrder = currentElement.ordre_affichage
        currentElement.ordre_affichage = targetElement.ordre_affichage
        targetElement.ordre_affichage = tempOrder
        
        markAsChanged()
        showNotification(`Élément ${direction === 'up' ? 'monté' : 'descendu'}`, 'success')
      }
  
      const moveSubElement = (section, subIndex, direction) => {
        if (!section.elements) return
        
        const targetIndex = direction === 'up' ? subIndex - 1 : subIndex + 1
        
        if (targetIndex < 0 || targetIndex >= section.elements.length) return
        
        const currentElement = section.elements[subIndex]
        const targetElement = section.elements[targetIndex]
        
        // Échanger les ordres d'affichage
        const tempOrder = currentElement.ordre_affichage
        currentElement.ordre_affichage = targetElement.ordre_affichage
        targetElement.ordre_affichage = tempOrder
        
        // Échanger les positions dans le tableau
        section.elements[subIndex] = targetElement
        section.elements[targetIndex] = currentElement
        
        markAsChanged()
        showNotification(`Élément ${direction === 'up' ? 'monté' : 'descendu'}`, 'success')
      }
  
      const deleteElement = (elementKey, index) => {
        showModal.value = true
        modalTitle.value = 'Supprimer l\'élément'
        modalMessage.value = `Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.`
        modalAction.value = { type: 'delete_element', elementKey, index }
        
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 100)
      }
  
      // Gestion des types de champs
      const onFieldTypeChange = (element, elementKey) => {
        // Mise à jour des configs selon le type
        const typeConfigs = getDefaultConfigForType(element.type_champ)
        const typeValidations = getDefaultValidationForType(element.type_champ)
        
        Object.assign(element.meta_options.configs, typeConfigs)
        Object.assign(element.meta_options.validations_rules, typeValidations)
        
        // Initialiser les champs texte spéciaux
        if (element.type_champ === 'group') {
          element.childrenAttributesText = typeConfigs.children_attributes?.join('\n') || ''
          element.defaultValueText = JSON.stringify(element.default_value || {}, null, 2)
        }
        
        if (element.type_champ === 'file') {
          element.acceptedTypesText = typeConfigs.accepted_types?.join(', ') || ''
        }
        
        markElementAsChanged(elementKey)
      }
  
      const onSubElementTypeChange = (subElement, sectionKey) => {
        // Mise à jour des configs selon le type
        const typeConfigs = getDefaultConfigForType(subElement.type_champ)
        const typeValidations = getDefaultValidationForType(subElement.type_champ)
        
        Object.assign(subElement.meta_options.configs, typeConfigs)
        Object.assign(subElement.meta_options.validations_rules, typeValidations)
        
        markElementAsChanged(sectionKey)
      }
  
      // Gestion des options pour les selects
      const addOption = (element, elementKey) => {
        if (!element.meta_options.configs.options) {
          element.meta_options.configs.options = []
        }
        element.meta_options.configs.options.push({ value: '', label: '' })
        markElementAsChanged(elementKey)
      }
  
      const removeOption = (element, index, elementKey) => {
        if (element.meta_options.configs.options) {
          element.meta_options.configs.options.splice(index, 1)
          markElementAsChanged(elementKey)
        }
      }
  
      const addSubElementOption = (subElement, sectionKey) => {
        if (!subElement.meta_options.configs.options) {
          subElement.meta_options.configs.options = []
        }
        subElement.meta_options.configs.options.push({ value: '', label: '' })
        markElementAsChanged(sectionKey)
      }
  
      const removeSubElementOption = (subElement, optIndex, sectionKey) => {
        if (subElement.meta_options.configs.options) {
          subElement.meta_options.configs.options.splice(optIndex, 1)
          markElementAsChanged(sectionKey)
        }
      }
  
      // Gestion des conditions
      const addCondition = (element, elementKey) => {
        if (!element.meta_options.conditions.conditions) {
          element.meta_options.conditions.conditions = []
        }
        element.meta_options.conditions.conditions.push({
          field: '',
          operator: 'equals',
          value: '',
          action: 'show'
        })
        markElementAsChanged(elementKey)
      }
  
      const removeCondition = (element, index, elementKey) => {
        if (element.meta_options.conditions.conditions) {
          element.meta_options.conditions.conditions.splice(index, 1)
          markElementAsChanged(elementKey)
        }
      }
  
      const getAvailableFields = () => {
        return canevasData.forms.filter(f => f.element_type === 'field' && f.attribut)
      }
  
      // Validation et prévisualisation
      const validateStructure = () => {
        validationErrors.value = validateFormStructure()
        
        showModal.value = true
        modalTitle.value = 'Validation de la structure'
        modalMessage.value = 'Résultats de la validation du canevas :'
        modalAction.value = { type: 'validation' }
        
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 100)
      }
  
      const validateAndPreview = () => {
        const errors = validateFormStructure()
        
        if (errors.length > 0) {
          validationErrors.value = errors
          showModal.value = true
          modalTitle.value = 'Erreurs détectées'
          modalMessage.value = 'Veuillez corriger les erreurs suivantes avant de continuer :'
          modalAction.value = { type: 'validation' }
        } else {
          showModal.value = true
          modalTitle.value = 'Prévisualisation'
          modalMessage.value = 'Aperçu des modifications à sauvegarder :'
          modalAction.value = { type: 'preview' }
        }
        
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 100)
      }
  
      // Export JSON
      const exportJson = () => {
        try {
          const cleanedData = cleanDataForSave(canevasData)
          const jsonString = JSON.stringify(cleanedData, null, 2)
          
          const blob = new Blob([jsonString], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          
          const link = document.createElement('a')
          link.href = url
          link.download = `canevas-${Date.now()}.json`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          URL.revokeObjectURL(url)
          
          showNotification('JSON exporté avec succès', 'success')
        } catch (error) {
          showNotification('Erreur lors de l\'export', 'error')
          console.error('Erreur export:', error)
        }
      }
  
      const scrollToElement = (elementKey) => {
        setTimeout(() => {
          const element = document.querySelector(`[data-element-key="${elementKey}"]`)
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            })
            element.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.5)'
            setTimeout(() => {
              element.style.boxShadow = ''
            }, 2000)
          }
        }, 100)
      }
  
      const saveCanevas = async () => {
        const errors = validateFormStructure()
        
        if (errors.length > 0) {
          validationErrors.value = errors
          showModal.value = true
          modalTitle.value = 'Erreurs détectées'
          modalMessage.value = 'Veuillez corriger les erreurs suivantes avant de sauvegarder :'
          modalAction.value = { type: 'validation' }
          return
        }
  
        showModal.value = true
        modalTitle.value = 'Confirmer la sauvegarde'
        modalMessage.value = 'Êtes-vous sûr de vouloir sauvegarder ce canevas ?'
        modalAction.value = { type: 'save' }
        
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 100)
      }
  
      const resetChanges = () => {
        showModal.value = true
        modalTitle.value = 'Annuler les modifications'
        modalMessage.value = 'Êtes-vous sûr de vouloir annuler toutes les modifications ? Toutes les données non sauvegardées seront perdues.'
        modalAction.value = { type: 'reset' }
        
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 100)
      }
  
      const getChangesSummary = () => {
        const changes = []
        
        if (originalCanevasData.value) {
          if (canevasData.nom !== originalCanevasData.value.nom) {
            changes.push(`Nom modifié: "${originalCanevasData.value.nom}" → "${canevasData.nom}"`)
          }
          
          if (canevasData.description !== originalCanevasData.value.description) {
            changes.push(`Description modifiée`)
          }
          
          if (canevasData.type !== originalCanevasData.value.type) {
            changes.push(`Type modifié: "${originalCanevasData.value.type}" → "${canevasData.type}"`)
          }
          
          if (canevasData.categorieId !== originalCanevasData.value.categorieId) {
            changes.push(`Catégorie ID modifiée: ${originalCanevasData.value.categorieId} → ${canevasData.categorieId}`)
          }
        }
        
        const modifiedElementsCount = Object.values(modifiedElements.value).filter(Boolean).length
        if (modifiedElementsCount > 0) {
          changes.push(`${modifiedElementsCount} élément(s) modifié(s) ou ajouté(s)`)
        }
        
        const newElementsCount = canevasData.forms.filter(e => isNewElement(e)).length
        if (newElementsCount > 0) {
          changes.push(`${newElementsCount} nouvel(s) élément(s) ajouté(s)`)
        }
        
        return changes.length > 0 ? changes : ['Aucune modification détectée']
      }
  
      const getConfirmButtonText = () => {
        if (!modalAction.value) return 'Confirmer'
        
        switch (modalAction.value.type) {
          case 'save': return 'Sauvegarder'
          case 'delete_element': return 'Supprimer l\'élément'
          case 'reset': return 'Annuler les modifications'
          case 'preview': return 'Fermer'
          case 'validation': return 'Fermer'
          default: return 'Confirmer'
        }
      }
  
   const performSave = async () => {
    try {
      isLoading.value = true
      
      console.log('💾 DEBUT SAUVEGARDE')
      console.log('💾 État initial des sections:')
  
      debugSectionElements()
       const errors = validateFormStructure()
      if (errors.length > 0) {
        console.error('❌ Erreurs de validation:', errors)
        throw new Error('Erreurs de validation détectées')
      }
      canevasData.forms.forEach((form, index) => {
        if (form.element_type === 'section') {
          console.log(`  ${index}: Section "${form.intitule}" - ${form.elements?.length || 0} éléments`)
          form.elements?.forEach((elem, elemIndex) => {
            console.log(`    - ${elemIndex + 1}: ${elem.label || 'sans label'} (${elem.attribut || 'sans attribut'})`)
          })
        }
      })
      
      // Nettoyer les données
      const cleanedData = cleanDataForSave(canevasData)
      
      console.log('💾 Données après nettoyage:')
      cleanedData.forms.forEach((form, index) => {
        if (form.element_type === 'section') {
          console.log(`  ${index}: Section "${form.intitule}" - ${form.elements?.length || 0} éléments`)
        }
      })
      
      // Préparer pour l'API
      const saveData = {
        ...cleanedData,
        forms: cleanedData.forms.map(element => {
          const cleanedElement = { ...element }
          
          // Supprimer l'id pour les nouveaux éléments
          if (element.id && element.id >= 1000) {
            delete cleanedElement.id
          }
          
          // Traiter les sections
          if (cleanedElement.element_type === 'section' && cleanedElement.elements) {
            console.log(`💾 Traitement final section "${cleanedElement.intitule}": ${cleanedElement.elements.length} éléments`)
            
            cleanedElement.elements = cleanedElement.elements.map(subElement => {
              const cleanedSub = { ...subElement }
              
              // Supprimer l'id pour les nouveaux sous-éléments
              if (subElement.id && subElement.id >= 1000) {
                delete cleanedSub.id
              }
              
              // S'assurer que les meta_options existent
              if (!cleanedSub.meta_options) {
                cleanedSub.meta_options = {
                  configs: getDefaultConfigForType(cleanedSub.type_champ || 'text'),
                  conditions: { disable: false, visible: true, conditions: [] },
                  validations_rules: getDefaultValidationForType(cleanedSub.type_champ || 'text')
                }
              }
              
              return cleanedSub
            })
          }
          
          // S'assurer que les meta_options existent pour l'élément principal
          if (!cleanedElement.meta_options && cleanedElement.element_type === 'field') {
            cleanedElement.meta_options = {
              configs: getDefaultConfigForType(cleanedElement.type_champ || 'text'),
              conditions: { disable: false, visible: true, conditions: [] },
              validations_rules: getDefaultValidationForType(cleanedElement.type_champ || 'text')
            }
          }
          
          return cleanedElement
        })
      }
      
      console.log('💾 DONNÉES FINALES envoyées à l\'API:')
      saveData.forms.forEach((form, index) => {
        if (form.element_type === 'section') {
          console.log(`  ${index}: Section "${form.intitule}" - ${form.elements?.length || 0} éléments`)
        }
      })
      
      // Appel API
      await constitueCanevasNoteConceptuelleService.createCanevas(saveData)
      
      // Reset des états
      hasChanges.value = false
      modifiedElements.value = {}
      
      showNotification('Canevas sauvegardé avec succès', 'success')
      
      // Recharger depuis le serveur
      await loadCanevasData()
      
    } catch (error) {
      showNotification('Erreur lors de la sauvegarde', 'error')
      console.error('💾 Erreur sauvegarde:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }
  
  
      const confirmAction = async () => {
        console.log('CONFIRM ACTION APPELÉ avec:', modalAction.value)
        if (!modalAction.value) return
        
        try {
          console.log('TYPE D\'ACTION:', modalAction.value.type)
          switch (modalAction.value.type) {
            case 'save':
              await performSave()
              break
              
            case 'delete_element':
              console.log('AVANT SUPPRESSION - Nombre d\'éléments:', canevasData.forms.length)
              console.log('AVANT SUPPRESSION - Index à supprimer:', modalAction.value.index)
              console.log('AVANT SUPPRESSION - Element à supprimer:', canevasData.forms[modalAction.value.index])
              
              canevasData.forms.splice(modalAction.value.index, 1)
              
              console.log('APRÈS SUPPRESSION - Nombre d\'éléments:', canevasData.forms.length)
              console.log('APRÈS SUPPRESSION - IDs restants:', canevasData.forms.map(f => f.id))
              
              delete expandedElements.value[modalAction.value.elementKey]
              delete modifiedElements.value[modalAction.value.elementKey]
              // Réorganiser les ordres d'affichage
              canevasData.forms.forEach((element, index) => {
                element.ordre_affichage = index + 1
              })
              markAsChanged()
              showNotification('Élément supprimé', 'success')
              break
              
            case 'reset':
              if (originalCanevasData.value) {
                Object.assign(canevasData, JSON.parse(JSON.stringify(originalCanevasData.value)))
                hasChanges.value = false
                modifiedElements.value = {}
                // Réinitialiser les états d'expansion
                canevasData.forms.forEach((element, index) => {
                  const key = getElementKey(element, index)
                  expandedElements.value[key] = false
                })
                showNotification('Modifications annulées', 'info')
              }
              break
              
            case 'preview':
            case 'validation':
              break
          }
        } catch (error) {
          showNotification('Erreur lors de l\'action', 'error')
          console.error('Erreur:', error)
        }
        
        closeModal()
      }
  
      const closeModal = () => {
        showModal.value = false
        modalTitle.value = ''
        modalMessage.value = ''
        modalAction.value = null
        validationErrors.value = []
      }
  
      const showNotification = (message, type = 'info') => {
        notification.show = true
        notification.message = message
        notification.type = type
        
        setTimeout(() => {
          hideNotification()
        }, 5000)
      }
  
      const hideNotification = () => {
        notification.show = false
      }
  
      const getNotificationIcon = () => {
        switch (notification.type) {
          case 'success': return 'fa-check-circle'
          case 'error': return 'fa-exclamation-circle'
          case 'warning': return 'fa-exclamation-triangle'
          case 'info': return 'fa-info-circle'
          default: return 'fa-info-circle'
        }
      }
  
      // Guard de navigation
      onBeforeRouteLeave((to, from, next) => {
        if (hasChanges.value) {
          const answer = window.confirm('Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?')
          if (answer) {
            next()
          } else {
            next(false)
          }
        } else {
          next()
        }
      })
  
      // Lifecycle hooks
      onMounted(async () => {
        await loadCanevasData()
      })
  
      // Exposition des données et méthodes pour le template
      return {
        // État
        isLoading,
        hasChanges,
        editingGeneral,
        allExpanded,
        expandedElements,
        expandedSubElements,
        modifiedElements,
        canevasData,
        showModal,
        modalTitle,
        modalMessage,
        modalAction,
        notification,
        validationErrors,
        
        // Computed
        sortedForms,
        debugSectionElements,
        
        // Méthodes utilitaires
        getElementKey,
        getSubElementKey,
        isNewElement,
        getFieldTypeIcon,
        isTextType,
        isNumberType,
        cleanDataForSave,
        getAvailableSections,
        
        // Méthodes de gestion des champs texte
        initializeTextFields,
        updateChildrenAttributes,
        updateDefaultValue,
        updateAcceptedTypes,
        
        // Méthodes principales
        markAsChanged,
        markElementAsChanged,
        toggleGeneralEdit,
        toggleElement,
        toggleSubElement,
        toggleAllElements,
        addNewField,
        addNewSection,
        addElementToSection,
        removeElementFromSection,
        moveElement,
        moveSubElement,
        deleteElement,
        
        // Méthodes de gestion des types
        onFieldTypeChange,
        onSubElementTypeChange,
        getDefaultConfigForType,
        getDefaultValidationForType,
         addChildrenAttribute,
    removeChildrenAttribute,
    syncChildrenCounts,
        
        // Méthodes de gestion des options
        addOption,
        removeOption,
        addSubElementOption,
        removeSubElementOption,
        
        // Méthodes de gestion des conditions
        addCondition,
        removeCondition,
        getAvailableFields,
        
        // Validation et outils
        validateStructure,
        validateAndPreview,
        validateFormStructure,
        exportJson,
        
        // Méthodes de sauvegarde et actions
        saveCanevas,
        resetChanges,
        getChangesSummary,
        getConfirmButtonText,
        confirmAction,
        closeModal,
        
        // Méthodes de notification
        showNotification,
        hideNotification,
        getNotificationIcon,
        
        // Utilitaires
        scrollToElement
      }
    }
  }
  </script>
  
  <style scoped>
  * {
    box-sizing: border-box;
  }
  
  .canevas-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    background: linear-gradient(135deg, #f8fffe 0%, #f0f9f7 100%);
    min-height: 100vh;
  }
  
  /* En-tête */
  .form-header {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    color: white;
    padding: 20px;
    border-radius: 20px;
    margin-bottom: 30px;
    box-shadow: 0 20px 40px rgba(5, 150, 105, 0.2);
    position: relative;
    overflow: hidden;
  }
  
  .form-header::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(50%, -50%);
  }
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 15px;
    position: relative;
    z-index: 2;
  }
  
  .header-icon {
    font-size: 1rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 10px;
    backdrop-filter: blur(10px);
  }
  
  .header-text h1 {
    margin: 0 0 15px 0;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 0.6;
  }
  
  .header-description {
    margin: 0 0 20px 0;
    opacity: 0.9;
    font-size: 0.6rem;
    line-height: 0.7;
  }
  
  .header-badges {
    display: flex;
    gap: 7px;
    flex-wrap: wrap;
  }
  
  .badge {
    background: rgba(255, 255, 255, 0.2);
    padding: 10px 20px;
    border-radius: 25px;
    font-size: 0.95rem;
    font-weight: 600;
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .badge.modified {
    background: rgba(249, 115, 22, 0.3);
  }
  
  .badge-icon {
    font-size: 1.1rem;
  }
  
  /* Informations générales */
  .general-info-card {
    background: white;
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(5, 150, 105, 0.1);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f1f5f9;
  }
  
  .card-header h3 {
    margin: 0;
    color: #047857;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .edit-toggle-btn {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .edit-toggle-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(5, 150, 105, 0.3);
  }
  
  .edit-toggle-btn.active {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #92400e;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .info-item.full-width {
    grid-column: 1 / -1;
  }
  
  .info-label {
    font-weight: 600;
    color: #374151;
    font-size: 0.95rem;
  }
  
  .info-input, .info-textarea {
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    font-family: inherit;
  }
  
  .info-input:focus, .info-textarea:focus {
    outline: none;
    border-color: #059669;
    box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
  }
  
  .info-value {
    color: #6b7280;
    font-size: 1rem;
    padding: 12px 0;
  }
  
  /* Section des formulaires */
  .forms-section {
    background: white;
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(5, 150, 105, 0.1);
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #f1f5f9;
  }
  
  .section-header h3 {
    margin: 0;
    color: #047857;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .section-actions {
    display: flex;
    gap: 15px;
  }
  
  .btn {
    padding: 12px 20px;
    border: none;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }
  
  .btn:hover {
    transform: translateY(-2px);
  }
  
  .btn-success {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    color: white;
    box-shadow: 0 5px 15px rgba(5, 150, 105, 0.3);
  }
  
  .btn-secondary {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    color: white;
    box-shadow: 0 5px 15px rgba(107, 114, 128, 0.3);
  }
  
  .btn-info {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    color: white;
    box-shadow: 0 5px 15px rgba(5, 150, 105, 0.3);
  }
  
  .btn-primary:hover:not(:disabled) {
    box-shadow: 0 8px 25px rgba(5, 150, 105, 0.4);
  }
  
  .btn-primary:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .btn-outline-secondary {
    background: white;
    color: #475569;
    border: 2px solid #e2e8f0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .btn-outline-secondary:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }
  
  .btn-icon {
    font-size: 1.1rem;
  }
  
  /* Cartes d'éléments */
  .element-card {
    background: #f8fffe;
    border: 2px solid #e5e7eb;
    border-radius: 16px;
    margin-bottom: 20px;
    transition: all 0.3s ease;
    overflow: hidden;
  }
  
  .element-card.expanded {
    border-color: #059669;
    box-shadow: 0 8px 25px rgba(5, 150, 105, 0.15);
  }
  
  .element-card.new {
    border-color: #fbbf24;
    background: #fffbeb;
  }
  
  .element-card.modified {
    border-left: 6px solid #f59e0b;
  }
  
  .element-card.section {
    border-left: 6px solid #10b981;
  }
  
  .element-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 25px;
    cursor: pointer;
    background: white;
    transition: background 0.3s ease;
  }
  
  .element-header:hover {
    background: #f9fafb;
  }
  
  .element-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .element-number {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
  }
  
  .element-type-badge {
    padding: 8px 12px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 1.2rem;
    color: white;
    min-width: 50px;
    text-align: center;
  }
  
  .element-type-badge.section {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
  
  .element-type-badge.field {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
  }
  
  .element-title {
    margin: 0 0 5px 0;
    color: #1f2937;
    font-size: 1.3rem;
    font-weight: 600;
  }
  
  .required-indicator {
    color: #dc2626;
    margin-left: 5px;
  }
  
  .element-meta {
    color: #6b7280;
    font-size: 0.9rem;
  }
  
  .element-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .move-btn, .delete-btn, .expand-btn {
    background: none;
    border: none;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1.2rem;
  }
  
  .move-btn:hover {
    background: #e5e7eb;
  }
  
  .move-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .delete-btn:hover {
    background: #fee2e2;
    color: #dc2626;
  }
  
  .expand-btn:hover {
    background: #e5e7eb;
  }
  
  .expand-btn.expanded {
    transform: rotate(180deg);
  }
  
  /* Contenu des éléments */
  .element-content {
    padding: 0 25px 25px;
    background: white;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #374151;
    font-size: 0.95rem;
  }
  
  .form-input, .form-textarea, .form-select {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    font-family: inherit;
  }
  
  .form-input:focus, .form-textarea:focus, .form-select:focus {
    outline: none;
    border-color: #059669;
    box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
  }
  
  .form-textarea {
    resize: vertical;
    min-height: 80px;
  }
  
  .checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 0;
  }
  
  .form-checkbox {
    width: 20px;
    height: 20px;
    accent-color: #059669;
  }
  
  .checkbox-label {
    font-size: 1rem;
    color: #374151;
  }
  
  /* Configuration spécifique aux champs */
  .field-specific-config {
    background: #f0fdf4;
    border: 2px solid #bbf7d0;
    border-radius: 12px;
    padding: 20px;
    margin-top: 20px;
  }
  
  .field-specific-config h6 {
    margin: 0 0 15px 0;
    color: #047857;
    font-size: 1rem;
    font-weight: 600;
  }
  
  /* Éléments de section */
  .section-elements {
    background: #f0fdf4;
    border: 2px solid #bbf7d0;
    border-radius: 12px;
    padding: 20px;
    margin-top: 20px;
  }
  
  .section-elements h5 {
    margin: 0 0 15px 0;
    color: #047857;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .sub-elements-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .sub-element-item {
    background: white;
    border: 1px solid #d1fae5;
    border-radius: 8px;
    padding: 12px 15px;
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .sub-element-order {
    background: #10b981;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 600;
  }
  
  .sub-element-label {
    flex: 1;
    font-weight: 500;
    color: #1f2937;
  }
  
  .sub-element-type {
    background: #d1fae5;
    color: #047857;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  /* État vide */
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #6b7280;
  }
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: 20px;
  }
  
  .empty-state h3 {
    margin: 0 0 10px 0;
    color: #374151;
    font-size: 1.5rem;
  }
  
  .empty-state p {
    margin: 0 0 30px 0;
    font-size: 1.1rem;
  }
  
  /* Actions du formulaire */
  .form-actions {
    background: white;
    padding: 30px;
    border-radius: 20px;
    margin-top: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    border: 1px solid rgba(5, 150, 105, 0.1);
  }
  
  .actions-left, .actions-right {
    display: flex;
    gap: 15px;
    align-items: center;
  }
  
  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
    padding: 20px;
    overflow-y: auto;
  }
  
  .modal-container {
    background: white;
    border-radius: 24px;
    max-width: 800px;
    width: 90%;
    max-height: calc(100vh - 40px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 60px rgba(14, 98, 88, 0.15);
    border: 1px solid #e2e8f0;
    margin-top: 20px;
  }
  
  .modal-header {
    padding: 32px 32px 24px;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }
  
  .modal-title {
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.025em;
  }
  
  .close-button {
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748b;
    transition: all 0.2s;
  }
  
  .close-button:hover {
    background: #059669;
    border-color: #059669;
    color: white;
    transform: rotate(90deg);
  }
  
  .modal-body {
    overflow: auto;
    overflow-x: hidden;
    background: #fefefe;
    padding: 24px 32px;
  }
  
  .modal-body p {
    margin: 0 0 20px 0;
    color: #4b5563;
    line-height: 1.6;
    font-size: 1.1rem;
  }
  
  .preview-content h4 {
    color: #047857;
    margin: 20px 0 15px 0;
    font-size: 1.2rem;
  }
  
  .changes-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .change-item {
    background: #f0fdf4;
    border-left: 4px solid #059669;
    padding: 12px 16px;
    margin-bottom: 10px;
    border-radius: 0 8px 8px 0;
    color: #047857;
    font-weight: 500;
  }
  
  .modal-actions {
    padding: 20px 32px 32px;
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    border-top: 1px solid #e2e8f0;
    background: #fafafa;
  }
  
  /* Notification */
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 2000;
    max-width: 400px;
    border-left: 4px solid #6b7280;
  }
  
  .notification.success {
    border-left-color: #059669;
    background: #f0fdf4;
  }
  
  .notification.error {
    border-left-color: #dc2626;
    background: #fef2f2;
  }
  
  .notification.warning {
    border-left-color: #f59e0b;
    background: #fffbeb;
  }
  
  .notification.info {
    border-left-color: #10b981;
    background: #f0fdf4;
  }
  
  .notification-icon {
    font-size: 1.2rem;
  }
  
  .notification-message {
    flex: 1;
    font-weight: 500;
    color: #374151;
  }
  
  .notification-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    font-size: 1.1rem;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
  
  .notification-close:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  
  /* Animations */
  .notification-enter-active, .notification-leave-active {
    transition: all 0.3s ease;
  }
  
  .notification-enter-from, .notification-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
  
  /* Loading overlay moderne avec couleurs primaires */
  .my-bg {
    background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    border: 1px solid rgba(4, 120, 87, 0.1);
  }
  
  .modern-loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(4, 120, 87, 0.95), rgba(15, 23, 42, 0.95));
    backdrop-filter: blur(12px);
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
    color: #cbd5e1;
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
  
  /* Responsive Design */
  @media (max-width: 1200px) {
    .form-row {
      grid-template-columns: 1fr;
      gap: 15px;
    }
  }
  
  @media (max-width: 768px) {
    .canevas-container {
      padding: 15px;
    }
  
    .form-header {
      padding: 15px;
      margin-bottom: 20px;
    }
  
    .header-content {
      flex-direction: column;
      text-align: center;
      gap: 15px;
    }
  
    .header-icon {
      font-size: 2rem;
    }
  
    .header-text h1 {
      font-size: 1.5rem;
      margin-bottom: 10px;
      line-height: 1.2;
    }
  
    .header-description {
      font-size: 0.875rem;
      margin-bottom: 15px;
    }
  
    .header-badges {
      flex-direction: column;
      gap: 10px;
      align-items: center;
    }
  
    .badge {
      width: 100%;
      max-width: 250px;
      justify-content: center;
      padding: 8px 12px;
    }
  
    .info-grid {
      grid-template-columns: 1fr;
    }
  
    .general-info-card {
      padding: 20px;
      margin-bottom: 20px;
    }
  
    .card-header {
      flex-direction: column;
      gap: 15px;
      text-align: center;
    }
  
    .card-header h3 {
      font-size: 1.25rem;
    }
  
    .edit-toggle-btn {
      width: 100%;
      max-width: 200px;
      justify-content: center;
    }
  
    .section-header {
      flex-direction: column;
      gap: 15px;
      text-align: center;
    }
  
    .section-header h3 {
      font-size: 1.25rem;
    }
  
    .section-actions {
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;
    }
  
    .section-actions .btn {
      flex: 1;
      min-width: 140px;
      max-width: 200px;
    }
  
    .element-header {
      flex-direction: column;
      gap: 15px;
      align-items: flex-start;
      padding: 15px;
    }
  
    .element-left {
      width: 100%;
    }
  
    .element-actions {
      width: 100%;
      justify-content: space-between;
      margin-top: 10px;
    }
  
    .form-group {
      margin-bottom: 15px;
    }
  
    .form-label {
      font-size: 0.875rem;
    }
  
    .form-input, .form-textarea, .form-select {
      font-size: 1rem;
      padding: 10px 12px;
    }
  
    .form-actions {
      flex-direction: column;
      align-items: stretch;
      padding: 20px;
      margin-top: 20px;
      gap: 15px;
    }
  
    .actions-left, .actions-right {
      flex-direction: column;
      width: 100%;
      justify-content: center;
    }
  
    .btn {
      width: 100%;
      padding: 12px 16px;
      font-size: 0.875rem;
    }
  
    .modal-container {
      width: 95%;
      margin: 10px;
    }
  
    .modal-header {
      padding: 24px 24px 20px;
    }
  
    .modal-title {
      font-size: 24px;
    }
  
    .modal-body {
      padding: 20px 24px;
    }
  
    .modal-actions {
      padding: 16px 24px 24px;
      flex-direction: column;
    }
  }
  
  @media (max-width: 480px) {
    .form-header {
      padding: 12px;
      border-radius: 15px;
    }
  
    .header-text h1 {
      font-size: 1.25rem;
      line-height: 1.3;
    }
  
    .header-description {
      font-size: 0.8rem;
    }
  
    .header-badges {
      gap: 8px;
    }
  
    .badge {
      font-size: 0.75rem;
      padding: 6px 10px;
    }
  
    .badge-icon {
      font-size: 0.875rem;
    }
  
    .form-actions {
      padding: 15px;
      margin-top: 15px;
    }
  
    .btn {
      padding: 10px 14px;
      font-size: 0.8rem;
    }
  
    .btn-icon {
      font-size: 0.875rem;
    }
  
    .element-card {
      margin-bottom: 15px;
    }
  
    .element-number {
      font-size: 0.875rem;
      width: 32px;
      height: 32px;
    }
  
    .modal-title {
      font-size: 20px;
    }
  
    .modal-header {
      padding: 20px;
    }
  
    .modal-body {
      padding: 16px 20px;
    }
  
    .modal-actions {
      padding: 12px 20px 20px;
    }
  
    .notification {
      top: 10px;
      right: 10px;
      left: 10px;
      max-width: none;
    }
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
  /* Configuration des attributs enfants */
  .children-attributes {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .attribute-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  .btn-remove-attr, .btn-remove-option, .btn-remove-condition {
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .btn-remove-attr:hover, .btn-remove-option:hover, .btn-remove-condition:hover {
    background: #dc2626;
    transform: scale(1.05);
  }
  
  /* Configuration des options */
  .options-list, .conditions-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }
  
  .option-row {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 10px;
    align-items: center;
  }
  
  .condition-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr auto;
    gap: 8px;
    align-items: center;
  }
  
  /* Sections de configuration */
  .validation-section, .conditions-section {
    background: #eff6ff;
    border: 2px solid #bfdbfe;
    border-radius: 12px;
    padding: 20px;
    margin-top: 20px;
  }
  
  .validation-section h6, .conditions-section h6 {
    margin: 0 0 15px 0;
    color: #1e40af;
    font-size: 1rem;
    font-weight: 600;
  }
  
  /* Boutons petits */
  .btn-sm {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  
  /* Amélioration des checkboxes */
  .checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
  }
  
  .checkbox-wrapper .form-checkbox {
    margin: 0;
  }
  
  /* Responsive pour les nouvelles sections */
  @media (max-width: 768px) {
    .option-row {
      grid-template-columns: 1fr;
      gap: 8px;
    }
    
    .condition-row {
      grid-template-columns: 1fr;
      gap: 8px;
    }
    
    .validation-section, .conditions-section {
      padding: 15px;
    }
  }
  /* Gestion des sous-éléments de section */
  .section-elements-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .section-elements-header h5 {
    margin: 0;
    color: #047857;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .sub-element-card {
    background: white;
    border: 1px solid #d1fae5;
    border-radius: 8px;
    margin-bottom: 10px;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .sub-element-card.expanded {
    border-color: #10b981;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
  }
  
  .sub-element-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    cursor: pointer;
    background: #f9fafb;
    transition: background 0.3s ease;
  }
  
  .sub-element-header:hover {
    background: #f3f4f6;
  }
  
  .sub-element-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }
  
  .sub-element-order {
    background: #10b981;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 600;
  }
  
  .sub-element-label {
    font-weight: 500;
    color: #1f2937;
    flex: 1;
  }
  
  .sub-element-type {
    background: #d1fae5;
    color: #047857;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .sub-element-actions {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .sub-element-actions .move-btn,
  .sub-element-actions .delete-btn,
  .sub-element-actions .expand-btn {
    padding: 4px;
    font-size: 0.9rem;
  }
  
  .sub-element-content {
    padding: 15px;
    background: white;
    border-top: 1px solid #e5e7eb;
  }
  
  .no-sub-elements {
    text-align: center;
    padding: 30px 20px;
    color: #6b7280;
    background: #f9fafb;
    border-radius: 8px;
    margin-top: 15px;
  }
  
  .no-sub-elements i {
    font-size: 2rem;
    margin-bottom: 10px;
    color: #d1d5db;
  }
  
  .no-sub-elements p {
    margin: 0 0 5px 0;
    font-weight: 500;
  }
  
  .no-sub-elements small {
    color: #9ca3af;
  }
  
  /* Responsive pour les sous-éléments */
  @media (max-width: 768px) {
    .section-elements-header {
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;
    }
    
    .sub-element-header {
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;
    }
    
    .sub-element-actions {
      width: 100%;
      justify-content: space-between;
    }
    
    .sub-element-content {
      padding: 12px;
    }
  }
  </style>