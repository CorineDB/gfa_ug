
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import RapportIndex from '@/views/dashboard/rapport/index.vue';
import ProgrammeService from "@/services/modules/programme.service.js";
import { toast } from "vue3-toastify";
import { helper as $h } from "@/utils/helper";

// Mock des dépendances
vi.mock("@/services/modules/programme.service.js");
vi.mock("vue3-toastify");
vi.mock("@/utils/helper", () => ({
  helper: {
    ajouterObjetDansFormData: vi.fn(),
    clearFormData: vi.fn(),
    clearObjectValues: vi.fn(),
    extractContentFromArray: vi.fn()
  }
}));

// Mock des composants enfants pour éviter les erreurs de rendu
const InputForm = { template: '<div></div>' };
const VButton = { template: '<button></button>' };
const ClassicEditor = { template: '<div></div>' };
const Modal = { template: '<div><slot></slot></div>' };
const ModalHeader = { template: '<div><slot></slot></div>' };
const ModalBody = { template: '<div><slot></slot></div>' };
const ModalFooter = { template: '<div><slot></slot></div>' };
const SearchIcon = { template: '<svg></svg>' };

// Mock FormData globalement pour ce fichier de test
global.FormData = class MockFormData {
  constructor() {
    this.data = new Map();
  }
  append(key, value) {
    this.data.set(key, value);
  }
  delete(key) {
    this.data.delete(key);
  }
  keys() {
    return this.data.keys();
  }
};

describe('RapportIndex.vue - Gestion des erreurs sendRapport', () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock des méthodes appelées au created
    ProgrammeService.rapports.mockResolvedValue({ data: { data: [] } });
    ProgrammeService.emailRapports.mockResolvedValue({ data: { data: [] } });

    wrapper = shallowMount(RapportIndex, {
      global: {
        components: {
          InputForm,
          VButton,
          ClassicEditor,
          Modal,
          ModalHeader,
          ModalBody,
          ModalFooter,
          SearchIcon
        },
        stubs: {
          'router-link': true
        }
      }
    });
  });

  it('devrait afficher les messages d\'erreur spécifiques du backend dans le toast lors d\'une erreur 422', async () => {
    // ARRANGE
    const errorResponse = {
      response: {
        data: {
          statut: "error",
          message: "Erreur de validation du formulaire",
          errors: {
            "destinataires.0": [
              "The destinataires.0 must be a valid email address."
            ]
          },
          statutCode: 422
        }
      }
    };

    // Simuler l'échec de l'envoi du mail
    ProgrammeService.sendMailRapport.mockRejectedValue(errorResponse);

    // Préparer les données du formulaire
    wrapper.setData({
      objet: 'Test Objet',
      bcc: 'invalid-email',
      editorData: 'Contenu du rapport',
      isLoading: false
    });

    // ACT
    await wrapper.vm.sendRapport();

    // Attendre que les promesses soient résolues
    await new Promise(resolve => setTimeout(resolve, 0));

    // ASSERT
    // Vérifier que toast.error a été appelé
    expect(toast.error).toHaveBeenCalled();

    // Vérifier que le message spécifique est affiché
    // Le test devrait échouer ici car le code actuel affiche "Une erreur s'est produite dans votre formulaire"
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("The destinataires.0 must be a valid email address."));
  });

  it('devrait vider les champs objet et destinataire après un envoi réussi', async () => {
    // ARRANGE
    ProgrammeService.sendMailRapport.mockResolvedValue({ data: { data: [] } });

    wrapper.setData({
      objet: 'Mon Rapport',
      bcc: 'test@example.com',
      selectedFile: new File([''], 'test.pdf'),
      showSendMail: true
    });

    // ACT
    await wrapper.vm.sendRapport();
    await new Promise(resolve => setTimeout(resolve, 0));

    // ASSERT
    expect(wrapper.vm.objet).toBe('');
    expect(wrapper.vm.bcc).toBe('');
    expect(wrapper.vm.selectedFile).toBeNull();
    expect(wrapper.vm.showSendMail).toBe(false);
  });
});
