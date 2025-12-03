import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Tests unitaires pour la fonctionnalité de modification de projet
 * avec préremplissage conditionnel basé sur le type d'utilisateur
 */
describe('modifierProjet - Préremplissage conditionnel des organisations', () => {
  let componentInstance;

  beforeEach(() => {
    // Créer une instance simulée du composant
    componentInstance = {
      messageErreur: {},
      formData: {},
      isUpdate: false,
      title: '',
      showModal: false,
      projetId: null,
      sitesId: [],
      showCloseModal: vi.fn(),
      
      /**
       * Fonction de modification de projet avec logique conditionnelle
       * @param {Object} projet - Le projet à modifier
       */
      modifierProjet(projet) {
        this.messageErreur = {};
        this.formData = {};
        this.isUpdate = true;
        this.title = "Modifier";
        this.showModal = true;

        this.projetId = projet.id;
        this.formData.nom = projet.nom;
        this.formData.couleur = projet.couleur;
        this.formData.debut = projet.debut;
        this.formData.fin = projet.fin;
        this.formData.pays = projet.pays;
        this.formData.pret = projet.pret;
        this.sitesId = projet.sites.map((site) => site.id);
        this.formData.sites = this.sitesId;
        this.formData.nombreEmploie = 0;
        this.formData.budgetNational = projet.budgetNational;
        this.formData.codePta = projet.codePta;

        // Logique conditionnelle : vérifier le type de l'utilisateur du propriétaire
        if (projet.owner && projet.owner.user && projet.owner.user.type === 'unitee-de-gestion') {
          // Ne pas préremplir le champ organisation pour les unités de gestion
          this.formData.organisationId = null;
        } else {
          // Préremplir normalement pour les autres types
          this.formData.organisationId = projet.owner ? projet.owner.id : null;
        }

        this.showCloseModal(true);
      }
    };
  });

  /**
   * Test 1: Vérifier que l'organisation n'est PAS préremplie 
   * quand le type d'utilisateur est 'unitee-de-gestion'
   */
  it('ne doit PAS préremplir le champ organisation quand owner.user.type est "unitee-de-gestion"', () => {
    // Arrange - Créer un projet avec un owner de type unitee-de-gestion
    const projetAvecUniteGestion = {
      id: 'projet-123',
      nom: 'Projet Test',
      couleur: '#FF0000',
      debut: '2025-01-01',
      fin: '2025-12-31',
      pays: 'Bénin',
      pret: 100000,
      budgetNational: 50000,
      codePta: 'PTA-001',
      sites: [
        { id: 'site-1', nom: 'Site 1' },
        { id: 'site-2', nom: 'Site 2' }
      ],
      owner: {
        id: 'owner-123',
        user: {
          id: 'user-123',
          nom: 'Unité de test des statistique',
          type: 'unitee-de-gestion'
        }
      }
    };

    // Act - Appeler la méthode modifierProjet
    componentInstance.modifierProjet(projetAvecUniteGestion);

    // Assert - Vérifier que organisationId n'est PAS prérempli
    expect(componentInstance.formData.organisationId).toBeNull();
    expect(componentInstance.isUpdate).toBe(true);
    expect(componentInstance.formData.nom).toBe('Projet Test');
    expect(componentInstance.showCloseModal).toHaveBeenCalledWith(true);
  });

  /**
   * Test 2: Vérifier que l'organisation EST préremplie 
   * quand le type d'utilisateur n'est PAS 'unitee-de-gestion'
   */
  it('doit préremplir le champ organisation quand owner.user.type n\'est PAS "unitee-de-gestion"', () => {
    // Arrange - Créer un projet avec un owner de type ONG
    const projetAvecONG = {
      id: 'projet-456',
      nom: 'Projet ONG',
      couleur: '#00FF00',
      debut: '2025-02-01',
      fin: '2025-11-30',
      pays: 'Togo',
      pret: 200000,
      budgetNational: 75000,
      codePta: 'PTA-002',
      sites: [
        { id: 'site-3', nom: 'Site 3' }
      ],
      owner: {
        id: 'owner-456',
        user: {
          id: 'user-456',
          nom: 'ONG Partenaire',
          type: 'ong'
        }
      }
    };

    // Act - Appeler la méthode modifierProjet
    componentInstance.modifierProjet(projetAvecONG);

    // Assert - Vérifier que organisationId EST prérempli
    expect(componentInstance.formData.organisationId).toBe('owner-456');
    expect(componentInstance.isUpdate).toBe(true);
    expect(componentInstance.formData.nom).toBe('Projet ONG');
  });

  /**
   * Test 3: Vérifier le comportement quand owner est null
   */
  it('doit gérer le cas où owner est null', () => {
    // Arrange - Créer un projet sans owner
    const projetSansOwner = {
      id: 'projet-789',
      nom: 'Projet Sans Owner',
      couleur: '#0000FF',
      debut: '2025-03-01',
      fin: '2025-10-31',
      pays: 'Niger',
      pret: 150000,
      budgetNational: 60000,
      codePta: 'PTA-003',
      sites: []
    };

    // Act - Appeler la méthode modifierProjet
    componentInstance.modifierProjet(projetSansOwner);

    // Assert - Vérifier que organisationId est null
    expect(componentInstance.formData.organisationId).toBeNull();
    expect(componentInstance.isUpdate).toBe(true);
  });

  /**
   * Test 4: Vérifier que tous les autres champs sont préremplis correctement
   * indépendamment du type d'utilisateur
   */
  it('doit préremplir tous les autres champs correctement quel que soit le type d\'utilisateur', () => {
    // Arrange
    const projet = {
      id: 'projet-999',
      nom: 'Projet Complet',
      couleur: '#FFFF00',
      debut: '2025-04-01',
      fin: '2025-09-30',
      pays: 'Burkina Faso',
      pret: 300000,
      budgetNational: 100000,
      codePta: 'PTA-004',
      sites: [
        { id: 'site-4', nom: 'Site 4' },
        { id: 'site-5', nom: 'Site 5' }
      ],
      owner: {
        id: 'owner-999',
        user: {
          id: 'user-999',
          nom: 'Unité de gestion',
          type: 'unitee-de-gestion'
        }
      }
    };

    // Act
    componentInstance.modifierProjet(projet);

    // Assert - Vérifier tous les champs sauf organisationId
    expect(componentInstance.formData.nom).toBe('Projet Complet');
    expect(componentInstance.formData.couleur).toBe('#FFFF00');
    expect(componentInstance.formData.debut).toBe('2025-04-01');
    expect(componentInstance.formData.fin).toBe('2025-09-30');
    expect(componentInstance.formData.pays).toBe('Burkina Faso');
    expect(componentInstance.formData.pret).toBe(300000);
    expect(componentInstance.formData.budgetNational).toBe(100000);
    expect(componentInstance.formData.codePta).toBe('PTA-004');
    expect(componentInstance.sitesId).toEqual(['site-4', 'site-5']);
    expect(componentInstance.formData.sites).toEqual(['site-4', 'site-5']);
  });

  /**
   * Test 5: Vérifier que le type 'osc_fosir' prérempli l'organisation
   */
  it('doit préremplir le champ organisation pour le type "osc_fosir"', () => {
    // Arrange
    const projetAvecOSC = {
      id: 'projet-111',
      nom: 'Projet OSC',
      couleur: '#FF00FF',
      debut: '2025-05-01',
      fin: '2025-08-31',
      pays: 'Mali',
      pret: 250000,
      budgetNational: 80000,
      codePta: 'PTA-005',
      sites: [{ id: 'site-6', nom: 'Site 6' }],
      owner: {
        id: 'owner-111',
        user: {
          id: 'user-111',
          nom: 'OSC FOSIR',
          type: 'osc_fosir'
        }
      }
    };

    // Act
    componentInstance.modifierProjet(projetAvecOSC);

    // Assert
    expect(componentInstance.formData.organisationId).toBe('owner-111');
  });

  /**
   * Test 6: Vérifier la réinitialisation des erreurs et du formulaire
   */
  it('doit réinitialiser les erreurs et le formulaire avant le préremplissage', () => {
    // Arrange
    componentInstance.messageErreur = { nom: 'Erreur existante' };
    componentInstance.formData = { ancien: 'data' };

    const projet = {
      id: 'projet-222',
      nom: 'Nouveau Projet',
      couleur: '#00FFFF',
      debut: '2025-06-01',
      fin: '2025-07-31',
      pays: 'Sénégal',
      pret: 180000,
      budgetNational: 70000,
      codePta: 'PTA-006',
      sites: [],
      owner: {
        id: 'owner-222',
        user: {
          id: 'user-222',
          nom: 'Organisation Test',
          type: 'autre_osc'
        }
      }
    };

    // Act
    componentInstance.modifierProjet(projet);

    // Assert
    expect(componentInstance.messageErreur).toEqual({});
    expect(componentInstance.formData.ancien).toBeUndefined();
    expect(componentInstance.formData.nom).toBe('Nouveau Projet');
  });
});
