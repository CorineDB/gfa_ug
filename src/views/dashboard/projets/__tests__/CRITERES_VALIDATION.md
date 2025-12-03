# Critères de Validation - Préremplissage Conditionnel des Organisations

## Contexte
Lors de la modification d'un projet, le système doit vérifier le type de l'utilisateur propriétaire (`owner.user.type`) avant de préremplir le champ organisation.

## Fonctionnalité Implémentée
**Règle de gestion** : Si le type d'utilisateur du propriétaire est `unitee-de-gestion`, le champ organisation ne doit PAS être prérempli. Pour tous les autres types, le préremplissage s'effectue normalement.

---

## Critères de Validation

### ✅ Critère 1 : Non-préremplissage pour "unitee-de-gestion"
**Condition** : Lorsqu'un utilisateur modifie un projet dont le propriétaire a le type `unitee-de-gestion`

**Résultat attendu** :
- Le champ `organisationId` doit être `null` ou vide
- Tous les autres champs du formulaire doivent être préremplis normalement
- Le modal de modification doit s'ouvrir correctement

**Test associé** : ✅ Test unitaire passé
```javascript
it('ne doit PAS préremplir le champ organisation quand owner.user.type est "unitee-de-gestion"')
```

**Validation manuelle** :
1. Se connecter avec un compte ayant des projets
2. Trouver un projet dont le propriétaire est de type `unitee-de-gestion`
3. Cliquer sur "Modifier" pour ce projet
4. Vérifier que le champ "Organisation" est vide
5. Vérifier que tous les autres champs (nom, dates, budget, etc.) sont bien préremplis

---

### ✅ Critère 2 : Préremplissage normal pour les autres types
**Condition** : Lorsqu'un utilisateur modifie un projet dont le propriétaire a un type différent de `unitee-de-gestion` (ex: `ong`, `osc_fosir`, `autre_osc`)

**Résultat attendu** :
- Le champ `organisationId` doit contenir l'ID de l'organisation du propriétaire
- Le champ organisation doit afficher le nom de l'organisation
- Tous les autres champs doivent être préremplis

**Tests associés** : ✅ Tests unitaires passés
```javascript
it('doit préremplir le champ organisation quand owner.user.type n\'est PAS "unitee-de-gestion"')
it('doit préremplir le champ organisation pour le type "osc_fosir"')
```

**Validation manuelle** :
1. Se connecter avec un compte ayant des projets
2. Trouver un projet dont le propriétaire est de type `ong`, `osc_fosir` ou autre
3. Cliquer sur "Modifier" pour ce projet
4. Vérifier que le champ "Organisation" est prérempli avec le nom de l'organisation
5. Vérifier que tous les autres champs sont bien préremplis

---

### ✅ Critère 3 : Gestion des cas limites
**Condition** : Lorsqu'un projet n'a pas de propriétaire (`owner` est `null` ou `undefined`)

**Résultat attendu** :
- Le champ `organisationId` doit être `null`
- L'application ne doit pas planter
- Le formulaire doit s'ouvrir normalement avec les autres champs préremplis

**Test associé** : ✅ Test unitaire passé
```javascript
it('doit gérer le cas où owner est null')
```

**Validation manuelle** :
1. Tester avec un projet sans propriétaire (si possible dans votre base de données)
2. Vérifier qu'aucune erreur JavaScript n'apparaît dans la console
3. Vérifier que le formulaire s'ouvre correctement

---

### ✅ Critère 4 : Intégrité des autres champs
**Condition** : Quel que soit le type d'utilisateur

**Résultat attendu** :
Tous les champs suivants doivent être préremplis correctement :
- ✅ Nom du projet
- ✅ Code PTA
- ✅ Date de début
- ✅ Date de fin
- ✅ Pays
- ✅ Fond propre (budgetNational)
- ✅ Subvention (pret)
- ✅ Sites (liste des sites associés)
- ✅ Couleur (si applicable)

**Test associé** : ✅ Test unitaire passé
```javascript
it('doit préremplir tous les autres champs correctement quel que soit le type d\'utilisateur')
```

**Validation manuelle** :
1. Modifier plusieurs projets de différents types
2. Vérifier que tous les champs listés ci-dessus sont correctement préremplis
3. Vérifier qu'aucune donnée n'est perdue ou corrompue

---

### ✅ Critère 5 : Réinitialisation du formulaire
**Condition** : À chaque ouverture du modal de modification

**Résultat attendu** :
- Les erreurs précédentes doivent être effacées (`messageErreur = {}`)
- Le formulaire doit être réinitialisé avant le préremplissage
- Les anciennes données ne doivent pas persister

**Test associé** : ✅ Test unitaire passé
```javascript
it('doit réinitialiser les erreurs et le formulaire avant le préremplissage')
```

**Validation manuelle** :
1. Modifier un projet et provoquer une erreur de validation
2. Fermer le modal
3. Ouvrir la modification d'un autre projet
4. Vérifier qu'aucune erreur de l'action précédente n'est affichée

---

## Tests Unitaires

### Résumé des tests
- ✅ **6 tests unitaires** créés
- ✅ **6 tests passés** (100% de réussite)
- ✅ Couverture complète des cas d'usage

### Commande pour exécuter les tests
```bash
npm test -- src/views/dashboard/projets/__tests__/modifierProjet.spec.js
```

---

## Validation Finale

### Checklist de validation

#### Tests Automatisés
- [x] Tous les tests unitaires passent
- [x] Aucune régression détectée
- [x] Code conforme aux standards

#### Tests Manuels
- [ ] Test avec un projet de type `unitee-de-gestion` → organisation NON préremplie
- [ ] Test avec un projet de type `ong` → organisation préremplie
- [ ] Test avec un projet de type `osc_fosir` → organisation préremplie
- [ ] Test avec un projet de type `autre_osc` → organisation préremplie
- [ ] Vérification de tous les autres champs préremplis
- [ ] Test de non-régression sur la création de projet
- [ ] Test de non-régression sur la suppression de projet

#### Tests d'Intégration
- [ ] Le formulaire s'affiche correctement
- [ ] La sauvegarde fonctionne après modification
- [ ] Les données sont correctement envoyées au backend
- [ ] Aucune erreur dans la console du navigateur

---

## Critères d'Acceptation

La fonctionnalité est considérée comme **VALIDÉE** si et seulement si :

1. ✅ **Tous les tests unitaires passent** (6/6)
2. ⏳ **Tous les tests manuels sont validés** (à effectuer)
3. ⏳ **Aucune régression n'est détectée** sur les fonctionnalités existantes
4. ⏳ **Le code est déployé** en environnement de test/production
5. ⏳ **Validation par le Product Owner** ou responsable fonctionnel

---

## Notes Techniques

### Fichiers modifiés
1. `/src/views/dashboard/projets/index.vue` (lignes 2143-2183)
   - Ajout de la logique conditionnelle dans la fonction `modifierProjet()`

### Fichiers créés
1. `/src/views/dashboard/projets/__tests__/modifierProjet.spec.js`
   - 6 tests unitaires complets

### Logique implémentée
```javascript
// Vérification du type d'utilisateur
if (projet.owner && projet.owner.user && projet.owner.user.type === 'unitee-de-gestion') {
  // Ne pas préremplir pour les unités de gestion
  this.formData.organisationId = null;
} else {
  // Préremplir normalement pour les autres types
  this.formData.organisationId = projet.owner ? projet.owner.id : null;
}
```

---

## Prochaines Étapes

1. ⏳ Effectuer les tests manuels listés ci-dessus
2. ⏳ Valider avec des données réelles en environnement de développement
3. ⏳ Faire une revue de code avec l'équipe
4. ⏳ Déployer en environnement de test
5. ⏳ Obtenir la validation du Product Owner
6. ⏳ Déployer en production

---

**Date de création** : 2025-12-02  
**Statut** : ✅ Tests unitaires validés | ⏳ En attente de validation manuelle  
**Version** : 1.0
