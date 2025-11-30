/**
 * Test unitaire : Vérification du statut "Formulaire déjà soumis"
 * 
 * Fonctionnalité testée : Empêcher la re-soumission d'un formulaire déjà complété
 * Fichier source : src/views/dashboard/SurveyFormView.vue
 * Logique testée : Lignes 330-333 (getDataForm)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import SurveyFormView from '@/views/dashboard/SurveyFormView.vue';
import EnqueteIndividuelService from '@/services/modules/enquete.individuel.service';

// Mock du service API
vi.mock('@/services/modules/enquete.individuel.service');

// Mock du router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: 'test-token-123' }
  })
}));

// Mock des utilitaires
vi.mock('@/utils/helpers', () => ({
  generateUniqueIdSurvey: () => 'participant-uuid-456'
}));

vi.mock('vue3-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('SurveyFormView - Vérification statut "Déjà soumis"', () => {
  
  beforeEach(() => {
    // Réinitialiser tous les mocks avant chaque test
    vi.clearAllMocks();
  });

  /**
   * Test 1 : Formulaire NON soumis (statut = false)
   * Comportement attendu : Le formulaire s'affiche normalement
   */
  it('devrait afficher le formulaire si statut = false', async () => {
    // ARRANGE - Préparer les données de test
    const mockResponse = {
      data: {
        data: {
          id: 'survey-123',
          statut: false, // ❌ PAS ENCORE SOUMIS
          survey_form: {
            libelle: 'Enquête de satisfaction',
            description: 'Veuillez répondre aux questions',
            form_data: {
              forms: [
                {
                  id: 'section-1',
                  intitule: 'Informations personnelles',
                  elements: [
                    {
                      id: 'field-1',
                      attribut: 'nom',
                      label: 'Nom',
                      type_champ: 'text',
                      is_required: true,
                      default_value: '',
                      ordre_affichage: 1
                    }
                  ]
                }
              ]
            }
          }
        }
      }
    };

    // Mock de la réponse API
    EnqueteIndividuelService.getFormEvaluation = vi.fn().mockResolvedValue(mockResponse);

    // ACT - Monter le composant
    const wrapper = mount(SurveyFormView, {
      global: {
        stubs: {
          LoaderSnipper: true
        }
      }
    });

    // Attendre que les données soient chargées
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    // ASSERT - Vérifier les résultats
    expect(wrapper.vm.form.statut).toBe(false);
    expect(wrapper.vm.isFinished).toBe(false);
    
    // Le formulaire devrait être visible (pas le message "déjà soumis")
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.text()).toContain('Enquête de satisfaction');
    expect(wrapper.text()).not.toContain('Formulaire déjà soumis');
  });

  /**
   * Test 2 : Formulaire DÉJÀ soumis (statut = true)
   * Comportement attendu : Message "Déjà soumis" affiché, formulaire masqué
   */
  it('devrait afficher le message "Déjà soumis" si statut = true', async () => {
    // ARRANGE
    const mockResponse = {
      data: {
        data: {
          id: 'survey-123',
          statut: true, // ✅ DÉJÀ SOUMIS
          survey_form: null // Le formulaire n'est pas retourné si déjà soumis
        }
      }
    };

    EnqueteIndividuelService.getFormEvaluation = vi.fn().mockResolvedValue(mockResponse);

    // ACT
    const wrapper = mount(SurveyFormView, {
      global: {
        stubs: {
          LoaderSnipper: true
        }
      }
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    // ASSERT
    expect(wrapper.vm.form.statut).toBe(true);
    expect(wrapper.vm.isFinished).toBe(true);
    
    // Le message "déjà soumis" devrait être visible
    expect(wrapper.text()).toContain('Formulaire déjà soumis');
    expect(wrapper.text()).toContain('Merci pour votre participation');
    
    // Le formulaire ne devrait PAS être visible
    expect(wrapper.find('form').exists()).toBe(false);
  });

  /**
   * Test 3 : Vérification que l'initialisation s'arrête si statut = true
   * Comportement attendu : payLoadPersonaliser ne doit pas être initialisé
   */
  it('ne devrait pas initialiser payLoadPersonaliser si statut = true', async () => {
    // ARRANGE
    const mockResponse = {
      data: {
        data: {
          id: 'survey-123',
          statut: true,
          survey_form: null
        }
      }
    };

    EnqueteIndividuelService.getFormEvaluation = vi.fn().mockResolvedValue(mockResponse);

    // ACT
    const wrapper = mount(SurveyFormView, {
      global: {
        stubs: {
          LoaderSnipper: true
        }
      }
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    // ASSERT
    // payLoadPersonaliser.surveyId ne devrait PAS être défini
    expect(wrapper.vm.payLoadPersonaliser.surveyId).toBe('');
    expect(wrapper.vm.payLoadPersonaliser.idParticipant).toBe('');
    
    // response_data devrait être vide
    expect(Object.keys(wrapper.vm.payLoadPersonaliser.response_data).length).toBe(0);
  });

  /**
   * Test 4 : Vérification de l'initialisation complète si statut = false
   * Comportement attendu : payLoadPersonaliser doit être correctement initialisé
   */
  it('devrait initialiser payLoadPersonaliser si statut = false', async () => {
    // ARRANGE
    const mockResponse = {
      data: {
        data: {
          id: 'survey-123',
          statut: false,
          survey_form: {
            libelle: 'Test Survey',
            form_data: {
              forms: [
                {
                  id: 'section-1',
                  intitule: 'Section 1',
                  elements: [
                    {
                      id: 'field-1',
                      attribut: 'nom',
                      label: 'Nom',
                      type_champ: 'text',
                      default_value: 'Valeur par défaut',
                      ordre_affichage: 1
                    },
                    {
                      id: 'field-2',
                      attribut: 'email',
                      label: 'Email',
                      type_champ: 'email',
                      default_value: '',
                      ordre_affichage: 2
                    }
                  ]
                }
              ]
            }
          }
        }
      }
    };

    EnqueteIndividuelService.getFormEvaluation = vi.fn().mockResolvedValue(mockResponse);

    // ACT
    const wrapper = mount(SurveyFormView, {
      global: {
        stubs: {
          LoaderSnipper: true
        }
      }
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    // ASSERT
    expect(wrapper.vm.payLoadPersonaliser.surveyId).toBe('survey-123');
    expect(wrapper.vm.payLoadPersonaliser.idParticipant).toBe('participant-uuid-456');
    
    // response_data devrait contenir les champs avec valeurs par défaut
    expect(wrapper.vm.payLoadPersonaliser.response_data.nom).toBe('Valeur par défaut');
    expect(wrapper.vm.payLoadPersonaliser.response_data.email).toBe('');
  });

  /**
   * Test 5 : Cas limite - statut undefined
   * Comportement attendu : Traiter comme non soumis (falsy value)
   */
  it('devrait traiter statut undefined comme non soumis', async () => {
    // ARRANGE
    const mockResponse = {
      data: {
        data: {
          id: 'survey-123',
          // statut est undefined (non défini)
          survey_form: {
            libelle: 'Test',
            form_data: { forms: [] }
          }
        }
      }
    };

    EnqueteIndividuelService.getFormEvaluation = vi.fn().mockResolvedValue(mockResponse);

    // ACT
    const wrapper = mount(SurveyFormView, {
      global: {
        stubs: {
          LoaderSnipper: true
        }
      }
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    // ASSERT
    // undefined est falsy, donc isFinished devrait rester false
    expect(wrapper.vm.isFinished).toBe(false);
  });

  /**
   * Test 6 : Vérification du comportement après soumission réussie
   * Comportement attendu : isFinished passe à true après send()
   */
  it('devrait marquer isFinished = true après une soumission réussie', async () => {
    // ARRANGE
    const mockGetResponse = {
      data: {
        data: {
          id: 'survey-123',
          statut: false,
          survey_form: {
            libelle: 'Test',
            form_data: { forms: [] }
          }
        }
      }
    };

    EnqueteIndividuelService.getFormEvaluation = vi.fn().mockResolvedValue(mockGetResponse);
    EnqueteIndividuelService.sendResponse = vi.fn().mockResolvedValue({ success: true });

    const wrapper = mount(SurveyFormView, {
      global: {
        stubs: {
          LoaderSnipper: true
        }
      }
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    // ACT - Simuler la soumission
    await wrapper.vm.send(wrapper.vm.payLoadPersonaliser);

    // ASSERT
    expect(wrapper.vm.isFinished).toBe(true);
    expect(EnqueteIndividuelService.sendResponse).toHaveBeenCalledTimes(1);
  });
});
