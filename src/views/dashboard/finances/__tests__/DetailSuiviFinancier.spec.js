import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import DetailSuiviFinancier from '../DetailSuiviFinancier.vue';

// Mock des services
vi.mock('@/services/modules/suiviFinancier.service', () => ({
  default: {
    getSuiviByActivite: vi.fn(() => Promise.resolve({ data: { data: [] } })),
    create: vi.fn(() => Promise.resolve()),
    update: vi.fn(() => Promise.resolve()),
    destroy: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock('@/services/modules/auth.service', () => ({
  default: {
    getCurrentUser: vi.fn(() =>
      Promise.resolve({
        data: {
          data: {
            programme: {
              debut: '2024-01-01',
              fin: '2026-12-31',
            },
          },
        },
      })
    ),
  },
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: 'test-activite-id',
    },
  }),
  useRouter: () => ({
    back: vi.fn(),
  }),
}));

vi.mock('tabulator-tables', () => ({
  default: class MockTabulator {
    constructor() {
      this.setFilter = vi.fn();
    }
  },
}));

describe('DetailSuiviFinancier - Modification d\'un suivi', () => {
  let wrapper;

  const mockSuiviItem = {
    id: '82yG9qJPVlj5MmkKovNEJZA7xaG1WdR5xbLYbOD09PyergX82Qn6pwqzBwdXjaxW',
    codePta: '897.968.1.1.1',
    nom: 'Activité 1',
    annee: 2025,
    type: 'fond-propre',
    dateDeSuivi: '2025-12-31 10:26:28',
    trimestre: 4,
    created_at: '2025-12-08 10:26:28',
    consommer: 25,
  };

  beforeEach(() => {
    wrapper = mount(DetailSuiviFinancier, {
      global: {
        stubs: {
          VButton: true,
          InputForm: true,
          DeleteButton: true,
          LoaderSnipper: true,
          Modal: true,
          ModalHeader: true,
          ModalBody: true,
          ModalFooter: true,
          TomSelect: true,
          SearchIcon: true,
          FilterIcon: true,
          RefreshCwIcon: true,
          PlusIcon: true,
          CornerDownLeftIcon: true,
          XCircleIcon: true,
        },
      },
    });
  });

  describe('Test de pré-remplissage du formulaire de modification', () => {
    it('devrait pré-remplir correctement tous les champs du formulaire lors de la modification', async () => {
      // Appeler la fonction handleEdit avec les données du mock
      wrapper.vm.handleEdit(mockSuiviItem);

      await nextTick();

      // Vérifications
      expect(wrapper.vm.isCreate).toBe(false);
      expect(wrapper.vm.idSelect).toBe(mockSuiviItem.id);
      expect(wrapper.vm.showModalCreate).toBe(true);

      // Vérifier que le payload est correctement rempli
      expect(wrapper.vm.payload.trimestre).toBe(mockSuiviItem.trimestre);
      expect(wrapper.vm.payload.annee).toBe(mockSuiviItem.annee);
      expect(wrapper.vm.payload.consommer).toBe(mockSuiviItem.consommer);

      // Vérifier que les valeurs sont du bon type (nombre)
      expect(typeof wrapper.vm.payload.trimestre).toBe('number');
      expect(typeof wrapper.vm.payload.annee).toBe('number');
      expect(typeof wrapper.vm.payload.consommer).toBe('number');
    });

    it('devrait pré-remplir le trimestre avec la valeur correcte (4)', async () => {
      wrapper.vm.handleEdit(mockSuiviItem);
      await nextTick();

      expect(wrapper.vm.payload.trimestre).toBe(4);
      expect(wrapper.vm.payload.trimestre).not.toBe(1);
      expect(wrapper.vm.payload.trimestre).not.toBe(2);
      expect(wrapper.vm.payload.trimestre).not.toBe(3);
    });

    it('devrait pré-remplir l\'année avec la valeur correcte (2025)', async () => {
      wrapper.vm.handleEdit(mockSuiviItem);
      await nextTick();

      expect(wrapper.vm.payload.annee).toBe(2025);
      // Vérifier que c'est bien la valeur de l'item et non une valeur par défaut
      expect(wrapper.vm.payload.annee).toBe(mockSuiviItem.annee);
    });

    it('devrait pré-remplir le montant consommé avec la valeur correcte (25)', async () => {
      wrapper.vm.handleEdit(mockSuiviItem);
      await nextTick();

      expect(wrapper.vm.payload.consommer).toBe(25);
      expect(wrapper.vm.payload.consommer).not.toBe(0);
    });

    it('devrait conserver l\'activiteId lors de la modification', async () => {
      const initialActiviteId = wrapper.vm.payload.activiteId;
      
      wrapper.vm.handleEdit(mockSuiviItem);
      await nextTick();

      expect(wrapper.vm.payload.activiteId).toBe(initialActiviteId);
      expect(wrapper.vm.payload.activiteId).toBe('test-activite-id');
    });

    it('devrait ouvrir le modal en mode modification', async () => {
      expect(wrapper.vm.showModalCreate).toBe(false);
      expect(wrapper.vm.isCreate).toBe(true);

      wrapper.vm.handleEdit(mockSuiviItem);
      await nextTick();

      expect(wrapper.vm.showModalCreate).toBe(true);
      expect(wrapper.vm.isCreate).toBe(false);
    });

    it('devrait gérer correctement les valeurs numériques sous forme de chaînes', async () => {
      const itemAvecStrings = {
        ...mockSuiviItem,
        annee: '2025',
        trimestre: '4',
        consommer: '25',
      };

      wrapper.vm.handleEdit(itemAvecStrings);
      await nextTick();

      // Les valeurs doivent être converties en nombres
      expect(typeof wrapper.vm.payload.trimestre).toBe('number');
      expect(typeof wrapper.vm.payload.annee).toBe('number');
      expect(typeof wrapper.vm.payload.consommer).toBe('number');
      
      expect(wrapper.vm.payload.trimestre).toBe(4);
      expect(wrapper.vm.payload.annee).toBe(2025);
      expect(wrapper.vm.payload.consommer).toBe(25);
    });
  });

  describe('Test de réinitialisation après modification', () => {
    it('devrait réinitialiser le formulaire après annulation', async () => {
      wrapper.vm.handleEdit(mockSuiviItem);
      await nextTick();

      expect(wrapper.vm.payload.consommer).toBe(25);

      wrapper.vm.resetForm();
      await nextTick();

      expect(wrapper.vm.payload.consommer).toBe(0);
      expect(wrapper.vm.showModalCreate).toBe(false);
      expect(wrapper.vm.formErrors).toEqual({});
    });
  });
});
