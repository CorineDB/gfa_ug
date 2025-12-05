# Solution pour le positionnement dynamique des divs absolute

## Problème
Vous avez des divs avec `position: sticky` et des divs avec `position: absolute`. Actuellement, vous utilisez des classes Tailwind codées en dur comme `left-[7rem]`, `left-[9rem]`, `left-[6rem]`, `left-28` qui ne s'adaptent pas automatiquement à la largeur réelle de la div sticky.

## Solution

### 1. Pour `/home/freddy/Bureau/gfa/gfa-survey/src/views/dashboard/finances/suivi.vue`

#### Étape 1 : Ajouter les refs et computed properties (dans la section `<script setup>`)

Ajoutez ces lignes après les autres déclarations de `ref` et `computed` (vers la ligne 330) :

```javascript
// Ref pour la div sticky et calcul dynamique du left
const stickyDivRef = ref(null);
const stickyDivWidth = ref(0);

// Computed property pour calculer automatiquement le left
const dynamicLeftPosition = computed(() => {
  if (stickyDivWidth.value > 0) {
    return `${stickyDivWidth.value + 10}px`; // +10px pour un petit espacement
  }
  return '0px';
});

// Fonction pour mettre à jour la largeur de la div sticky
const updateStickyWidth = () => {
  if (stickyDivRef.value) {
    stickyDivWidth.value = stickyDivRef.value.offsetWidth;
  }
};

// Observer pour détecter les changements de taille
const resizeObserver = new ResizeObserver(() => {
  updateStickyWidth();
});
```

#### Étape 2 : Modifier le `onMounted` (vers la ligne 799)

Ajoutez ceci dans la fonction `onMounted` existante :

```javascript
onMounted(() => {
  getDatas();
  getcurrentUser();
  
  // Ajouter ces lignes :
  nextTick(() => {
    updateStickyWidth();
    if (stickyDivRef.value) {
      resizeObserver.observe(stickyDivRef.value);
    }
  });
});
```

#### Étape 3 : Modifier le template (ligne 833)

**Avant :**
```vue
<div style="width: 35%; position: sticky; left: 0; background: transparent; z-index: 1; margin-right: 1%">
```

**Après :**
```vue
<div ref="stickyDivRef" style="width: 35%; position: sticky; left: 0; background: transparent; z-index: 1; margin-right: 1%">
```

#### Étape 4 : Modifier la div absolute (ligne 850)

**Avant :**
```vue
<div class="absolute shadow-md perso sm:rounded-lg" :class="{ 'left-[7rem]': filteredSuiviFinanciers.length === 0, 'left-[9rem]': filteredSuiviFinanciers.length > 0 }">
```

**Après :**
```vue
<div class="absolute shadow-md perso sm:rounded-lg" :style="{ left: dynamicLeftPosition }">
```

---

### 2. Pour `/home/freddy/Bureau/gfa/gfa-survey/src/views/dashboard/planDeDecaissement.vue`

#### Étape 1 : Ajouter les imports nécessaires

Dans la section `<script>`, ajoutez `nextTick` aux imports de Vue :

```javascript
import { computed, onMounted, reactive, ref, nextTick } from "vue";
```

#### Étape 2 : Ajouter les refs et computed properties (dans la section `data()`)

Ajoutez ces propriétés dans l'objet `data()` :

```javascript
data() {
  return {
    // ... propriétés existantes ...
    stickyDivWidth: 0,
  };
},
```

Et ajoutez ces computed properties :

```javascript
computed: {
  // ... computed existants ...
  dynamicLeftPosition() {
    if (this.stickyDivWidth > 0) {
      return `${this.stickyDivWidth + 10}px`;
    }
    return '0px';
  },
},
```

#### Étape 3 : Ajouter les méthodes

Ajoutez ces méthodes dans la section `methods` :

```javascript
methods: {
  // ... méthodes existantes ...
  updateStickyWidth() {
    const stickyDiv = this.$refs.stickyDivRef;
    if (stickyDiv) {
      this.stickyDivWidth = stickyDiv.offsetWidth;
    }
  },
},
```

#### Étape 4 : Modifier le `mounted`

```javascript
mounted() {
  // ... code existant ...
  
  // Ajouter :
  this.$nextTick(() => {
    this.updateStickyWidth();
    window.addEventListener('resize', this.updateStickyWidth);
  });
},

beforeUnmount() {
  window.removeEventListener('resize', this.updateStickyWidth);
},
```

#### Étape 5 : Modifier le template (ligne 22)

**Avant :**
```vue
<div style="position: sticky; left: 0; background: transparent; z-index: 1; margin-right: 1%">
```

**Après :**
```vue
<div ref="stickyDivRef" style="position: sticky; left: 0; background: transparent; z-index: 1; margin-right: 1%">
```

#### Étape 6 : Modifier la div absolute (ligne 54)

**Avant :**
```vue
<div class="absolute shadow-md perso sm:rounded-lg" :class="{ 'left-[6rem]': dataNew.length > 0, 'left-28': dataNew.length === 0 }">
```

**Après :**
```vue
<div class="absolute shadow-md perso sm:rounded-lg" :style="{ left: dynamicLeftPosition }">
```

---

## Avantages de cette solution

✅ **Automatique** : Le positionnement se calcule automatiquement en fonction de la largeur réelle de la div sticky  
✅ **Réactif** : S'adapte automatiquement lors du redimensionnement de la fenêtre  
✅ **Maintenable** : Plus besoin de classes codées en dur  
✅ **Précis** : Utilise la largeur réelle mesurée par le navigateur  

## Test

Après avoir appliqué ces modifications :
1. Rechargez la page
2. Vérifiez que la div absolute se positionne correctement après la div sticky
3. Redimensionnez la fenêtre et vérifiez que le positionnement s'ajuste automatiquement
