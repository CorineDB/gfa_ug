import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Tests unitaires pour la fonctionnalité de changement de statut d'activité
 * avec gestion des loaders individuels
 */
describe('changerStatut - Gestion des loaders par activité', () => {
  let componentInstance;
  let mockChangerStatutActivite;

  beforeEach(() => {
    // Mock de l'action Vuex qui retourne une promesse
    mockChangerStatutActivite = vi.fn(() => new Promise(resolve => {
      setTimeout(() => {
        resolve({ status: 200 });
      }, 100);
    }));

    // Créer une instance simulée du composant
    componentInstance = {
      // État initial
      loaderStatut: {}, // Changé de false à un objet pour gérer par ID
      selectedIds: {
        sousComposantId: "",
        composantId: ""
      },
      
      // Mocks des méthodes dépendantes
      changerStatutActivite: mockChangerStatutActivite,
      loadSousComposantDetails: vi.fn(),
      loadComposantDetails: vi.fn(),
      
      /**
       * Fonction à tester (copie de la logique implémentée)
       */
      changerStatut(item, statut = 2) {
        // Initialiser l'objet si nécessaire (bien que fait dans data)
        if (!this.loaderStatut) this.loaderStatut = {};
        
        // Activer le loader pour cet item spécifique
        this.loaderStatut[item.id] = true;

        const nouveauStatut = statut;
        const payLoad = {
          statut: nouveauStatut,
        };

        return this.changerStatutActivite({ statut: payLoad, id: item.id })
          .then((response) => {
            // Désactiver le loader pour cet item spécifique
            this.loaderStatut[item.id] = false;
            
            if (response.status == 200 || response.status == 201) {
              // Logique de rechargement (mockée ici)
              if (this.selectedIds.sousComposantId && this.selectedIds.sousComposantId !== "") {
                this.loadSousComposantDetails();
              } else if (this.selectedIds.composantId && this.selectedIds.composantId !== "") {
                this.loadComposantDetails();
              }
            }
            return response;
          })
          .catch(() => {
            this.loaderStatut[item.id] = false;
          });
      }
    };
  });

  /**
   * Test 1: Vérifier que le loader s'active pour l'item spécifique
   */
  it('doit activer le loader pour l\'ID de l\'activité spécifique au début de l\'appel', () => {
    // Arrange
    const item = { id: 'activite-123', statut: 0 };
    
    // Act - On lance l'appel sans attendre la fin pour vérifier l'état intermédiaire
    const promise = componentInstance.changerStatut(item, 2);
    
    // Assert - Le loader doit être true immédiatement
    expect(componentInstance.loaderStatut['activite-123']).toBe(true);
    
    // Cleanup - On attend la fin pour ne pas polluer les autres tests
    return promise;
  });

  /**
   * Test 2: Vérifier que le loader se désactive après la résolution
   */
  it('doit désactiver le loader pour l\'ID de l\'activité spécifique après la résolution', async () => {
    // Arrange
    const item = { id: 'activite-456', statut: 0 };
    
    // Act
    await componentInstance.changerStatut(item, 2);
    
    // Assert
    expect(componentInstance.loaderStatut['activite-456']).toBe(false);
  });

  /**
   * Test 3: Vérifier que les loaders sont indépendants (ne pas affecter un autre item)
   */
  it('ne doit pas affecter le loader d\'une autre activité', () => {
    // Arrange
    const item1 = { id: 'activite-A', statut: 0 };
    const item2 = { id: 'activite-B', statut: 0 };
    
    // État initial : item2 pourrait être false ou undefined
    componentInstance.loaderStatut['activite-B'] = false;
    
    // Act
    const promise = componentInstance.changerStatut(item1, 2);
    
    // Assert
    expect(componentInstance.loaderStatut['activite-A']).toBe(true);
    expect(componentInstance.loaderStatut['activite-B']).toBe(false);
    
    return promise;
  });
});
