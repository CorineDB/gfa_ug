<template>
  <div v-if="!isLoading" class="flex _flex-col justify-between items-center gap-3 my-8">
    <!-- Indication de la position actuelle -->
    <div class="hidden md:block text-gray-600">Page {{ currentPage }} sur {{ totalPages }}</div>

    <!-- Pagination -->
    <div class="flex justify-center gap-3">
      <!-- Bouton Précédent -->
      <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-3 btn btn-outline-primary">
        <slot name="prev-icon"><ChevronsLeftIcon class="size-5" /></slot>
      </button>

      <!-- Pages -->
      <div class="flex items-center justify-center gap-3 overflow-x-auto scroll-pagination custom-scroll">
        <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="page === currentPage ? 'btn-primary' : 'btn-outline-primary'" class="px-4 py-3 btn">
          {{ page }}
        </button>
      </div>

      <!-- Bouton Suivant -->
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-3 btn btn-outline-primary">
        <slot name="next-icon"><ChevronsRightIcon class="size-5" /></slot>
      </button>
    </div>

    <!-- Sélecteur pour le nombre d'éléments par page -->
    <div class="mt-4">
      <label for="itemsPerPage" class="mr-2 text-gray-600 hidden md:block lg:inline-block">Éléments par page :</label>
      <select id="itemsPerPage" v-model="localItemsPerPage" @change="updateItemsPerPage" class="border border-gray-300 rounded px-6 py-1">
        <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

// Props
const props = defineProps({
  totalItems: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    default: 20,
  },
  itemsPerPageOptions: {
    type: Array,
    default: () => [3, 6, 9, 12],
  },
  modelValue: {
    type: Number,
    default: 1,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

// Émettre des événements
const emit = defineEmits(["update:modelValue", "page-changed", "items-per-page-changed"]);

// État de la pagination
const currentPage = ref(props.modelValue);
const localItemsPerPage = ref(props.itemsPerPage);
const totalPages = computed(() => Math.ceil(props.totalItems / localItemsPerPage.value));

// Méthodes
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    updatePage();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    updatePage();
  }
};

const goToPage = (page) => {
  currentPage.value = page;
  updatePage();
};

const updatePage = () => {
  emit("update:modelValue", currentPage.value);
  emit("page-changed", currentPage.value);
};

const updateItemsPerPage = () => {
  emit("items-per-page-changed", localItemsPerPage.value);
  currentPage.value = 1; // Réinitialiser à la première page
  updatePage();
};

// Surveiller les props pour les mises à jour
watch(
  () => props.modelValue,
  (newValue) => {
    currentPage.value = newValue;
  }
);

watch(
  () => props.itemsPerPage,
  (newValue) => {
    localItemsPerPage.value = newValue;
  }
);
</script>

<style scoped>
.scroll-pagination {
  white-space: nowrap;
}
.custom-scroll::-webkit-scrollbar {
  height: 8px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #c4c4c4;
  border-radius: 4px;
}
</style>
