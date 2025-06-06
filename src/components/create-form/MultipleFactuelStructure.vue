<script setup>
import { ref, reactive } from 'vue';
defineProps({
  type: String,
  principe: String,
  critere: String,
  indicateurArray: {
    type: Array,
    default: () => [
      {
        indicateur: {
          id: "",
          nom: "",
        },
      },
    ],
  },
});

const emit = defineEmits(["updatePositionIndicateur", "updateTemporyElement", "deleteType", "deletePrincipe", "deleteCritere", "deleteIndicateur"]);

/* const showModalCreate = ref(false); */
const payload = reactive({ key: "", position: 1 });

const canEditPrincipe = ref(false);
const canEditCritere = ref(false);
const canEditType = ref(false);
const canEditIndicateur = ref([]);

function handleDelete(key) {
  console.log(key);
  emit("deleteIndicateur", key);
}

function handleDeleteType(key) {
  console.log(key);
  emit("deletePrincipe", key, 'type', true);
}

function handleDeletePrincipe(key) {
  console.log(key);
  emit("deletePrincipe", key, 'principe', true);
}

function handleDeleteCritere(key) {
  console.log(key);
  emit("deleteCritere", key, 'critere', true);
}

function editType(key) {
  payload.key = key;
  canEditType.value = true;
}

function editPrincipe(key) {
  payload.key = key;
  canEditPrincipe.value = true;
}

function editCritere(key) {
  payload.key = key;
  canEditCritere.value = true;
}


function updateTemporyType(id, position) {
  console.log(id, position);
  emit("updateTemporyElement", id, position, true, 'type');
  canEditType.value = false;
}

function updateTemporyPrincipe(id, position) {
  console.log(id, position);
  emit("updateTemporyElement", id, position, true, 'principe');
  canEditPrincipe.value = false;
}

function updateTemporyCritere(id, position) {
  console.log(id, position);
  emit("updateTemporyElement", id, position, true, 'critere');
  canEditCritere.value = false;
}

function updateTemporyIndicateur(key, position) {
  console.log(key, position);
  emit("updatePositionIndicateur", key, position, true);
  canEditIndicateur.value[key] = false;
}

// Handle edit action
const handleEdit = (data) => {
  payload.key = data;
  canEditIndicateur.value[data] = true;
};

</script>
<template>
  <div class="flex flex-col items-start w-full gap-2">
    <div
      :class="[type.id ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']"
      class="flex justify-between items-center w-full px-2 py-2.5 text-base font-medium truncate transition-all">
      
      <div class="flex items-center">
        <input v-if="canEditType" type="number" min="1" step="1" name="position"
          :value="type.position" @keyup.enter="updateTemporyType(type.key, $event.target.value)"
          class="w-11 h-9 form-control mr-2" />

        <div class="text-wrap" v-if="type.id">
          {{ !canEditType ? type.position + " - " : '' }} {{ type.nom }}
        </div>
        <span v-else>
          Type de gouvernance
        </span>
      </div>

      <div v-if="type.key && !canEditType" class="flex items-center gap-1 space-x-1 transition-all container-buttons">

          <button class="p-1.5 text-primary" @click="editType(type.key)">
            <Edit3Icon class="size-5" />
          </button>
          <button class="p-1.5 text-danger" @click="handleDeleteType(type.key)">
            <TrashIcon class="size-5" />
          </button>
      </div>
    </div>
    <div
      :class="[principe.id ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']"
      class="flex justify-between items-center w-[97%] px-2 py-2.5 text-base truncate font-medium transition-all">
      
      <div class="flex items-center">
        <input v-if="canEditPrincipe" type="number" min="1" step="1" name="position"
          :value="principe.position" @keyup.enter="updateTemporyPrincipe(principe.key, $event.target.value)"
          class="w-11 h-9 form-control mr-2" />

        <div class="text-wrap" v-if="principe.id">
          {{ !canEditPrincipe ? principe.position + " - " : '' }} {{ principe.nom }}
        </div>
        <span v-else>
          Principe de gouvernance
        </span>
      </div>

      <div v-if="principe.key && !canEditPrincipe" class="flex items-center gap-1 space-x-1 transition-all container-buttons">

          <button class="p-1.5 text-primary" @click="editPrincipe(principe.key)">
            <Edit3Icon class="size-5" />
          </button>
          <button class="p-1.5 text-danger" @click="handleDeletePrincipe(principe.key)">
            <TrashIcon class="size-5" />
          </button>
      </div>
    </div>
    <div
      :class="[critere.id ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']"
      class="flex justify-between items-center w-[94%] px-2 py-2.5 text-base truncate font-medium transition-all">
      
      <div class="flex items-center">
        <input v-if="canEditCritere" type="number" min="1" step="1" name="position"
          :value="critere.position" @keyup.enter="updateTemporyCritere(critere.key, $event.target.value)"
          class="w-11 h-9 form-control mr-2" />

        <div class="text-wrap" v-if="critere.id">
          {{ !canEditCritere ? critere.position + " - " : '' }} {{ critere.nom }}
        </div>
        <span v-else>
          Critère de gouvernance
        </span>
      </div>

      <div v-if="critere.key && !canEditCritere" class="flex items-center gap-1 space-x-1 transition-all container-buttons">

          <button class="p-1.5 text-primary" @click="editCritere(critere.key)">
            <Edit3Icon class="size-5" />
          </button>
          <button class="p-1.5 text-danger" @click="handleDeleteCritere(critere.key)">
            <TrashIcon class="size-5" />
          </button>
      </div>
    </div>

    <div v-for="item in indicateurArray" :key="item.id"
      :class="[item.indicateur.id ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']"
      class="flex justify-between items-center w-[91%] px-2 py-2.5 text-base truncate font-medium transition-all">


      <div class="flex items-center">
        <input v-if="canEditIndicateur[item.indicateur.key]" type="number" min="1" step="1" name="position"
          :value="item.indicateur.position" @keyup.enter="updateTemporyIndicateur(item.indicateur.key, $event.target.value)"
          class="w-11 h-9 form-control mr-2" />

        <div class="text-wrap">
          {{ !canEditIndicateur[item.indicateur.key] ? item.indicateur.position + " - " : '' }} {{ item.indicateur.nom }}
        </div>
      </div>

      <div v-if="item.indicateur.key && !canEditIndicateur[item.indicateur.key]" class="flex items-center gap-1 space-x-1 transition-all container-buttons">

          <button class="p-1.5 text-primary" @click="handleEdit(item.indicateur.key)">
            <Edit3Icon class="size-5" />
          </button>
          <button class="p-1.5 text-danger" @click="handleDelete(item.indicateur.key)">
            <TrashIcon class="size-5" />
          </button>
      </div>
    </div>
    <div v-if="indicateurArray.length == 0"
      class="border-dashed border-gray-400 text-gray-600 border-2 w-[91%] px-2 py-2.5 text-base truncate font-medium transition-all">
      Indicateur de gouvernance</div>

  </div>
</template>

<style scoped></style>
