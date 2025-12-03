# Documentation - Préremplissage Conditionnel des Organisations

## 📋 Résumé de l'Implémentation

### Objectif
Implémenter une logique conditionnelle lors de la modification d'un projet pour gérer le préremplissage du champ "Organisation" en fonction du type d'utilisateur du propriétaire.

### Règle de Gestion
- **Si** `owner.user.type === 'unitee-de-gestion'` → **Ne PAS** préremplir le champ organisation
- **Sinon** → Préremplir normalement avec `owner.id`

---

## 🔧 Modifications Apportées

### 1. Fichier Principal : `index.vue`
**Chemin** : `/src/views/dashboard/projets/index.vue`  
**Fonction modifiée** : `modifierProjet(projet)`  
**Lignes** : 2143-2183

#### Code Avant
```javascript
this.formData.organisationId = projet.owner.id;
```

#### Code Après
```javascript
// Logique conditionnelle : vérifier le type de l'utilisateur du propriétaire
// Si le type est 'unitee-de-gestion', ne pas préremplir le champ organisation
if (projet.owner && projet.owner.user && projet.owner.user.type === 'unitee-de-gestion') {
  // Ne pas préremplir le champ organisation pour les unités de gestion
  this.formData.organisationId = null;
} else {
  // Préremplir normalement pour les autres types d'organisations
  this.formData.organisationId = projet.owner ? projet.owner.id : null;
}
```

#### Améliorations
- ✅ Vérification de l'existence de `projet.owner` (évite les erreurs null)
- ✅ Vérification de l'existence de `projet.owner.user` (sécurité supplémentaire)
- ✅ Logique conditionnelle basée sur le type d'utilisateur
- ✅ Gestion du cas où `owner` est null

---

## 🧪 Tests Unitaires

### Fichier de Test
**Chemin** : `/src/views/dashboard/projets/__tests__/modifierProjet.spec.js`

### Tests Implémentés (6 tests)

#### Test 1 : Non-préremplissage pour unitee-de-gestion ✅
```javascript
it('ne doit PAS préremplir le champ organisation quand owner.user.type est "unitee-de-gestion"')
```
**Vérifie** : `formData.organisationId === null` quand type = `unitee-de-gestion`

#### Test 2 : Préremplissage pour les autres types ✅
```javascript
it('doit préremplir le champ organisation quand owner.user.type n\'est PAS "unitee-de-gestion"')
```
**Vérifie** : `formData.organisationId === owner.id` quand type ≠ `unitee-de-gestion`

#### Test 3 : Gestion du cas owner null ✅
```javascript
it('doit gérer le cas où owner est null')
```
**Vérifie** : Pas d'erreur et `formData.organisationId === null` quand owner absent

#### Test 4 : Intégrité des autres champs ✅
```javascript
it('doit préremplir tous les autres champs correctement quel que soit le type d\'utilisateur')
```
**Vérifie** : Tous les champs (nom, dates, budget, sites, etc.) sont préremplis

#### Test 5 : Type osc_fosir ✅
```javascript
it('doit préremplir le champ organisation pour le type "osc_fosir"')
```
**Vérifie** : Le préremplissage fonctionne pour les OSC FOSIR

#### Test 6 : Réinitialisation du formulaire ✅
```javascript
it('doit réinitialiser les erreurs et le formulaire avant le préremplissage')
```
**Vérifie** : Les erreurs et anciennes données sont effacées

### Résultats des Tests
```
✓ src/views/dashboard/projets/__tests__/modifierProjet.spec.js (6 tests) 36ms
  ✓ modifierProjet - Préremplissage conditionnel des organisations (6)
    ✓ ne doit PAS préremplir le champ organisation... 14ms
    ✓ doit préremplir le champ organisation... 1ms
    ✓ doit gérer le cas où owner est null 1ms
    ✓ doit préremplir tous les autres champs... 2ms
    ✓ doit préremplir le champ organisation pour "osc_fosir" 1ms
    ✓ doit réinitialiser les erreurs... 11ms

Test Files  1 passed (1)
Tests       6 passed (6)
```

---

## 📊 Structure des Données

### Exemple de Projet avec unitee-de-gestion
```json
{
  "id": "projet-123",
  "nom": "Projet Test",
  "owner": {
    "id": "owner-123",
    "user": {
      "id": "user-123",
      "nom": "Unité de test des statistique",
      "type": "unitee-de-gestion"  ← Type vérifié
    }
  }
}
```

### Types d'Utilisateurs Supportés
- `unitee-de-gestion` → **Pas de préremplissage**
- `ong` → Préremplissage normal
- `osc_fosir` → Préremplissage normal
- `autre_osc` → Préremplissage normal
- Autres types → Préremplissage normal

---

## 🎯 Cas d'Usage

### Cas 1 : Modification d'un projet par une Unité de Gestion
**Scénario** :
1. Un utilisateur clique sur "Modifier" pour un projet
2. Le projet appartient à une unité de gestion
3. Le modal s'ouvre

**Résultat** :
- ✅ Tous les champs sont préremplis (nom, dates, budget, sites)
- ✅ Le champ "Organisation" reste **vide**
- ✅ L'utilisateur peut sélectionner manuellement une organisation

### Cas 2 : Modification d'un projet par une ONG
**Scénario** :
1. Un utilisateur clique sur "Modifier" pour un projet
2. Le projet appartient à une ONG
3. Le modal s'ouvre

**Résultat** :
- ✅ Tous les champs sont préremplis
- ✅ Le champ "Organisation" est **prérempli** avec l'ONG propriétaire
- ✅ L'utilisateur peut modifier l'organisation si nécessaire

---

## 🔍 Points de Vigilance

### Sécurité
- ✅ Vérification de l'existence de `owner` avant accès
- ✅ Vérification de l'existence de `owner.user` avant accès
- ✅ Gestion du cas null/undefined

### Performance
- ✅ Pas d'impact sur les performances (simple condition if/else)
- ✅ Pas de requête supplémentaire au backend

### Compatibilité
- ✅ Compatible avec tous les types d'utilisateurs existants
- ✅ Pas de régression sur les fonctionnalités existantes
- ✅ Fonctionne avec le système de v-select actuel

---

## 📝 Commandes Utiles

### Exécuter les tests
```bash
# Tous les tests
npm test

# Tests spécifiques à cette fonctionnalité
npm test -- src/views/dashboard/projets/__tests__/modifierProjet.spec.js

# Tests en mode watch
npm test -- --watch

# Tests avec couverture
npm run test:coverage
```

### Lancer l'application
```bash
npm run dev
```

---

## 📚 Références

### Fichiers Concernés
1. `/src/views/dashboard/projets/index.vue` - Composant principal
2. `/src/views/dashboard/projets/__tests__/modifierProjet.spec.js` - Tests unitaires
3. `/src/views/dashboard/projets/__tests__/CRITERES_VALIDATION.md` - Critères de validation
4. `/src/views/dashboard/projets/Untitled-1.json` - Exemple de données

### Technologies Utilisées
- **Vue.js 3** - Framework frontend
- **Vitest** - Framework de tests
- **v-select** - Composant de sélection

---

## ✅ Checklist de Déploiement

### Avant le Déploiement
- [x] Code implémenté
- [x] Tests unitaires créés
- [x] Tous les tests passent
- [x] Documentation créée
- [ ] Revue de code effectuée
- [ ] Tests manuels validés
- [ ] Validation Product Owner

### Après le Déploiement
- [ ] Monitoring des erreurs
- [ ] Feedback utilisateurs
- [ ] Vérification en production
- [ ] Documentation mise à jour si nécessaire

---

## 🐛 Debugging

### En cas de problème

#### Le champ organisation n'est pas vide pour unitee-de-gestion
**Vérifier** :
1. La valeur de `projet.owner.user.type` dans la console
2. Que le type est exactement `'unitee-de-gestion'` (sensible à la casse)
3. Que le code modifié est bien déployé

#### Le champ organisation est vide pour les ONG
**Vérifier** :
1. Que `projet.owner` existe
2. Que `projet.owner.id` est défini
3. La valeur de `projet.owner.user.type`

#### Erreur JavaScript
**Vérifier** :
1. Que `projet.owner` n'est pas undefined
2. Les logs dans la console du navigateur
3. La structure des données retournées par l'API

---

**Auteur** : Équipe de développement  
**Date** : 2025-12-02  
**Version** : 1.0  
**Statut** : ✅ Implémenté et testé
