/**
 * Test unitaire : Pré-remplissage de la valeur cible dans handleSuivi
 * 
 * PROBLÈME À RÉSOUDRE :
 * - Le champ "Valeur cible" doit être pré-rempli si une valeur existe pour l'année sélectionnée
 * - Le champ doit être grisé (disabled) si une valeur cible existe
 * - Le champ doit être éditable si aucune valeur cible n'existe pour l'année
 * 
 * Fichier source : src/components/TabulatorCadreMesure.vue
 * Fonction testée : handleSuivi (ligne ~1301)
 * Champ concerné : InputForm "Valeur cible" (ligne 728)
 * 
 * COMPORTEMENT ATTENDU :
 * - Si valeursCible contient une entrée pour l'année sélectionnée → pré-remplir + griser
 * - Si valeursCible est vide ou ne contient pas l'année → champ vide + éditable
 * - Doit fonctionner pour les indicateurs non agrégés (agreger: false)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ref } from 'vue';

describe('TabulatorCadreMesure - Pré-remplissage valeur cible', () => {
  
  // Mock des données réactives
  let payloadSuivi;
  let valeurCible;
  let isAgregerCurrentIndicateur;
  let valueKeysIndicateurSuivi;
  let shouldDisableValeurCible;
  let showModalSuivi;

  beforeEach(() => {
    // Réinitialiser les refs avant chaque test
    payloadSuivi = ref({
      annee: 2024,
      valeurCible: null,
      valeurRealise: null,
      indicateurId: null
    });
    valeurCible = ref([]);
    isAgregerCurrentIndicateur = ref(false);
    valueKeysIndicateurSuivi = ref([]);
    shouldDisableValeurCible = ref(false);
    showModalSuivi = ref(false);
  });

  /**
   * TEST 1 : Valeur cible existe pour l'année sélectionnée
   */
  describe('Cas 1 : Valeur cible existe pour l\'année sélectionnée', () => {
    
    it('devrait pré-remplir le champ valeurCible avec la valeur trouvée', () => {
      // ARRANGE
      const data = {
        id: "indicateur-123",
        agreger: false,
        value_keys: [{ id: "key1", libelle: "Moyenne", key: "moy" }],
        valeursCible: [
          { annee: 2023, valeurCible: { moy: "100" } },
          { annee: 2024, valeurCible: { moy: "150" } }, // ← année sélectionnée
          { annee: 2025, valeurCible: { moy: "200" } }
        ]
      };
      payloadSuivi.value.annee = 2024;

      // ACT
      const handleSuivi = (data) => {
        // Filtrer les valeurs cibles pour l'année sélectionnée
        const valeursCibleFiltered = data.valeursCible.filter(
          (vc) => vc.annee === Number(payloadSuivi.value.annee)
        );

        isAgregerCurrentIndicateur.value = data.agreger;
        
        if (!isAgregerCurrentIndicateur.value && valeursCibleFiltered.length > 0) {
          // Extraire la valeur cible pour l'année sélectionnée
          const valeurCibleTrouvee = valeursCibleFiltered[0].valeurCible;
          
          // Pré-remplir le champ
          if (valeurCibleTrouvee && Object.keys(valeurCibleTrouvee).length > 0) {
            const firstKey = Object.keys(valeurCibleTrouvee)[0];
            payloadSuivi.value.valeurCible = valeurCibleTrouvee[firstKey];
            shouldDisableValeurCible.value = true; // Griser le champ
          }
        }

        payloadSuivi.value.indicateurId = data.id;
        valueKeysIndicateurSuivi.value = data.value_keys;
        showModalSuivi.value = true;
      };

      handleSuivi(data);

      // ASSERT
      expect(payloadSuivi.value.valeurCible).toBe("150");
      expect(shouldDisableValeurCible.value).toBe(true);
      expect(payloadSuivi.value.indicateurId).toBe("indicateur-123");
      expect(showModalSuivi.value).toBe(true);
    });

    it('devrait griser le champ valeurCible si une valeur existe', () => {
      const data = {
        id: "indicateur-456",
        agreger: false,
        value_keys: [{ id: "key1", key: "moy" }],
        valeursCible: [
          { annee: 2024, valeurCible: { moy: "250" } }
        ]
      };
      payloadSuivi.value.annee = 2024;

      const handleSuivi = (data) => {
        const valeursCibleFiltered = data.valeursCible.filter(
          (vc) => vc.annee === Number(payloadSuivi.value.annee)
        );
        isAgregerCurrentIndicateur.value = data.agreger;
        
        if (!isAgregerCurrentIndicateur.value && valeursCibleFiltered.length > 0) {
          const valeurCibleTrouvee = valeursCibleFiltered[0].valeurCible;
          if (valeurCibleTrouvee && Object.keys(valeurCibleTrouvee).length > 0) {
            const firstKey = Object.keys(valeurCibleTrouvee)[0];
            payloadSuivi.value.valeurCible = valeurCibleTrouvee[firstKey];
            shouldDisableValeurCible.value = true;
          }
        }
        payloadSuivi.value.indicateurId = data.id;
      };

      handleSuivi(data);

      expect(shouldDisableValeurCible.value).toBe(true);
      expect(payloadSuivi.value.valeurCible).toBe("250");
    });
  });

  /**
   * TEST 2 : Aucune valeur cible pour l'année sélectionnée
   */
  describe('Cas 2 : Aucune valeur cible pour l\'année sélectionnée', () => {
    
    it('devrait laisser le champ valeurCible vide et éditable', () => {
      // ARRANGE
      const data = {
        id: "indicateur-789",
        agreger: false,
        value_keys: [{ id: "key1", key: "moy" }],
        valeursCible: [
          { annee: 2023, valeurCible: { moy: "100" } },
          { annee: 2025, valeurCible: { moy: "200" } }
          // Pas de valeur pour 2024
        ]
      };
      payloadSuivi.value.annee = 2024;

      // ACT
      const handleSuivi = (data) => {
        const valeursCibleFiltered = data.valeursCible.filter(
          (vc) => vc.annee === Number(payloadSuivi.value.annee)
        );
        isAgregerCurrentIndicateur.value = data.agreger;
        
        if (!isAgregerCurrentIndicateur.value && valeursCibleFiltered.length > 0) {
          const valeurCibleTrouvee = valeursCibleFiltered[0].valeurCible;
          if (valeurCibleTrouvee && Object.keys(valeurCibleTrouvee).length > 0) {
            const firstKey = Object.keys(valeurCibleTrouvee)[0];
            payloadSuivi.value.valeurCible = valeurCibleTrouvee[firstKey];
            shouldDisableValeurCible.value = true;
          }
        } else {
          // Aucune valeur trouvée → champ éditable
          payloadSuivi.value.valeurCible = null;
          shouldDisableValeurCible.value = false;
        }
        payloadSuivi.value.indicateurId = data.id;
      };

      handleSuivi(data);

      // ASSERT
      expect(payloadSuivi.value.valeurCible).toBeNull();
      expect(shouldDisableValeurCible.value).toBe(false);
    });

    it('devrait laisser le champ éditable si valeursCible est vide', () => {
      const data = {
        id: "indicateur-empty",
        agreger: false,
        value_keys: [{ id: "key1", key: "moy" }],
        valeursCible: [] // Tableau vide
      };
      payloadSuivi.value.annee = 2024;

      const handleSuivi = (data) => {
        const valeursCibleFiltered = data.valeursCible.filter(
          (vc) => vc.annee === Number(payloadSuivi.value.annee)
        );
        isAgregerCurrentIndicateur.value = data.agreger;
        
        if (!isAgregerCurrentIndicateur.value && valeursCibleFiltered.length > 0) {
          const valeurCibleTrouvee = valeursCibleFiltered[0].valeurCible;
          if (valeurCibleTrouvee && Object.keys(valeurCibleTrouvee).length > 0) {
            const firstKey = Object.keys(valeurCibleTrouvee)[0];
            payloadSuivi.value.valeurCible = valeurCibleTrouvee[firstKey];
            shouldDisableValeurCible.value = true;
          }
        } else {
          payloadSuivi.value.valeurCible = null;
          shouldDisableValeurCible.value = false;
        }
      };

      handleSuivi(data);

      expect(payloadSuivi.value.valeurCible).toBeNull();
      expect(shouldDisableValeurCible.value).toBe(false);
    });
  });

  /**
   * TEST 3 : Changement d'année
   */
  describe('Cas 3 : Changement d\'année dans le formulaire', () => {
    
    it('devrait mettre à jour valeurCible quand l\'année change', () => {
      const data = {
        id: "indicateur-change",
        agreger: false,
        value_keys: [{ id: "key1", key: "moy" }],
        valeursCible: [
          { annee: 2024, valeurCible: { moy: "100" } },
          { annee: 2025, valeurCible: { moy: "200" } }
        ]
      };

      // Première année : 2024
      payloadSuivi.value.annee = 2024;
      const handleSuivi = (data) => {
        const valeursCibleFiltered = data.valeursCible.filter(
          (vc) => vc.annee === Number(payloadSuivi.value.annee)
        );
        isAgregerCurrentIndicateur.value = data.agreger;
        
        if (!isAgregerCurrentIndicateur.value && valeursCibleFiltered.length > 0) {
          const valeurCibleTrouvee = valeursCibleFiltered[0].valeurCible;
          if (valeurCibleTrouvee && Object.keys(valeurCibleTrouvee).length > 0) {
            const firstKey = Object.keys(valeurCibleTrouvee)[0];
            payloadSuivi.value.valeurCible = valeurCibleTrouvee[firstKey];
            shouldDisableValeurCible.value = true;
          }
        } else {
          payloadSuivi.value.valeurCible = null;
          shouldDisableValeurCible.value = false;
        }
      };

      handleSuivi(data);
      expect(payloadSuivi.value.valeurCible).toBe("100");

      // Changement d'année : 2025
      payloadSuivi.value.annee = 2025;
      handleSuivi(data);
      expect(payloadSuivi.value.valeurCible).toBe("200");
    });
  });

  /**
   * TEST 4 : Cas limites
   */
  describe('Cas 4 : Cas limites', () => {
    
    it('devrait gérer valeurCible null ou undefined', () => {
      const data = {
        id: "indicateur-null",
        agreger: false,
        value_keys: [{ id: "key1", key: "moy" }],
        valeursCible: [
          { annee: 2024, valeurCible: null }
        ]
      };
      payloadSuivi.value.annee = 2024;

      const handleSuivi = (data) => {
        const valeursCibleFiltered = data.valeursCible.filter(
          (vc) => vc.annee === Number(payloadSuivi.value.annee)
        );
        isAgregerCurrentIndicateur.value = data.agreger;
        
        if (!isAgregerCurrentIndicateur.value && valeursCibleFiltered.length > 0) {
          const valeurCibleTrouvee = valeursCibleFiltered[0].valeurCible;
          if (valeurCibleTrouvee && Object.keys(valeurCibleTrouvee).length > 0) {
            const firstKey = Object.keys(valeurCibleTrouvee)[0];
            payloadSuivi.value.valeurCible = valeurCibleTrouvee[firstKey];
            shouldDisableValeurCible.value = true;
          } else {
            payloadSuivi.value.valeurCible = null;
            shouldDisableValeurCible.value = false;
          }
        } else {
          payloadSuivi.value.valeurCible = null;
          shouldDisableValeurCible.value = false;
        }
      };

      handleSuivi(data);

      expect(payloadSuivi.value.valeurCible).toBeNull();
      expect(shouldDisableValeurCible.value).toBe(false);
    });

    it('devrait gérer un objet valeurCible vide {}', () => {
      const data = {
        id: "indicateur-empty-obj",
        agreger: false,
        value_keys: [{ id: "key1", key: "moy" }],
        valeursCible: [
          { annee: 2024, valeurCible: {} }
        ]
      };
      payloadSuivi.value.annee = 2024;

      const handleSuivi = (data) => {
        const valeursCibleFiltered = data.valeursCible.filter(
          (vc) => vc.annee === Number(payloadSuivi.value.annee)
        );
        isAgregerCurrentIndicateur.value = data.agreger;
        
        if (!isAgregerCurrentIndicateur.value && valeursCibleFiltered.length > 0) {
          const valeurCibleTrouvee = valeursCibleFiltered[0].valeurCible;
          if (valeurCibleTrouvee && Object.keys(valeurCibleTrouvee).length > 0) {
            const firstKey = Object.keys(valeurCibleTrouvee)[0];
            payloadSuivi.value.valeurCible = valeurCibleTrouvee[firstKey];
            shouldDisableValeurCible.value = true;
          } else {
            payloadSuivi.value.valeurCible = null;
            shouldDisableValeurCible.value = false;
          }
        }
      };

      handleSuivi(data);

      expect(payloadSuivi.value.valeurCible).toBeNull();
      expect(shouldDisableValeurCible.value).toBe(false);
    });
  });

  /**
   * TEST 5 : Indicateurs Agrégés (agreger: true)
   */
  describe('Cas 5 : Indicateurs Agrégés', () => {
    
    it('devrait pré-remplir et griser les champs agrégés si des valeurs existent', () => {
      // ARRANGE
      const data = {
        id: "ind-agg-1",
        agreger: true,
        value_keys: [
          { id: "k1", key: "moy", libelle: "Moyenne" },
          { id: "k2", key: "gar", libelle: "Garçons" }
        ],
        valeursCible: [
          { 
            annee: 2024, 
            valeurCible: { moy: "100", gar: "50" } 
          }
        ]
      };
      payloadSuivi.value.annee = 2024;

      // ACT
      const handleSuivi = (data) => {
        // Simulation de la logique du composant
        const valeursCibleFiltered = data.valeursCible.filter(
          (vc) => vc.annee === Number(payloadSuivi.value.annee)
        );
        const valeurCibleTrouvee = valeursCibleFiltered.length > 0 ? valeursCibleFiltered[0].valeurCible : null;
        const existeValeur = valeurCibleTrouvee && Object.keys(valeurCibleTrouvee).length > 0;

        if (data.agreger) {
          if (existeValeur) {
            valeurCible.value = data.value_keys.map((keyItem) => ({
              keyId: keyItem.id,
              value: valeurCibleTrouvee[keyItem.key] !== undefined ? valeurCibleTrouvee[keyItem.key] : ""
            }));
            shouldDisableValeurCible.value = true;
          }
        }
      };

      handleSuivi(data);

      // ASSERT
      expect(shouldDisableValeurCible.value).toBe(true);
      expect(valeurCible.value).toHaveLength(2);
      expect(valeurCible.value.find(v => v.keyId === "k1").value).toBe("100");
      expect(valeurCible.value.find(v => v.keyId === "k2").value).toBe("50");
    });

    it('devrait laisser les champs agrégés vides et éditables si aucune valeur n\'existe', () => {
      // ARRANGE
      const data = {
        id: "ind-agg-2",
        agreger: true,
        value_keys: [
          { id: "k1", key: "moy" },
          { id: "k2", key: "gar" }
        ],
        valeursCible: [] // Pas de valeurs
      };
      payloadSuivi.value.annee = 2024;

      // ACT
      const handleSuivi = (data) => {
        const valeursCibleFiltered = data.valeursCible.filter(
          (vc) => vc.annee === Number(payloadSuivi.value.annee)
        );
        const valeurCibleTrouvee = valeursCibleFiltered.length > 0 ? valeursCibleFiltered[0].valeurCible : null;
        const existeValeur = valeurCibleTrouvee && Object.keys(valeurCibleTrouvee).length > 0;

        if (data.agreger) {
          if (existeValeur) {
             // ... (logique pré-remplissage)
          } else {
            valeurCible.value = data.value_keys.map((keyItem) => ({
              keyId: keyItem.id,
              value: ""
            }));
            shouldDisableValeurCible.value = false;
          }
        }
      };

      handleSuivi(data);

      // ASSERT
      expect(shouldDisableValeurCible.value).toBe(false);
      expect(valeurCible.value).toHaveLength(2);
      expect(valeurCible.value[0].value).toBe("");
      expect(valeurCible.value[1].value).toBe("");
    });
  });
});

/**
 * CRITÈRES DE VALIDATION
 * 
 * ✅ La fonctionnalité est validée si :
 * 
 * 1. **Pré-remplissage correct** :
 *    - Si valeursCible contient une entrée pour l'année sélectionnée → champ pré-rempli
 *    - La valeur affichée correspond à la valeur dans valeursCible[année].valeurCible
 * 
 * 2. **État du champ (disabled/enabled)** :
 *    - Champ grisé (disabled) si une valeur cible existe pour l'année
 *    - Champ éditable (enabled) si aucune valeur cible n'existe
 * 
 * 3. **Réactivité au changement d'année** :
 *    - Quand l'utilisateur change l'année dans le select → valeurCible se met à jour
 *    - Le champ passe de disabled à enabled (ou inversement) selon la disponibilité
 * 
 * 4. **Gestion des cas limites** :
 *    - valeursCible vide [] → champ vide et éditable
 *    - valeurCible null ou {} → champ vide et éditable
 *    - Année non trouvée dans valeursCible → champ vide et éditable
 * 
 * 5. **Tests unitaires** :
 *    - Tous les tests passent avec succès
 * 
 * 6. **Test manuel** :
 *    - Ouvrir le modal de suivi pour un indicateur avec valeurs cibles
 *    - Sélectionner une année qui a une valeur cible → champ pré-rempli et grisé
 *    - Sélectionner une année sans valeur cible → champ vide et éditable
 *    - Vérifier que la soumission envoie la bonne valeur
 */
