<script setup>
import { ref, reactive } from 'vue';
defineProps({
  type: String,
  principe: String,
  critere: String,
  indicateur: String,
});


const emit = defineEmits(["updatePositionIndicateur", "updateTemporyElement", "deleteType", "deletePrincipe", "deleteCritere", "deleteIndicateur"]);

/* const showModalCreate = ref(false); */
const payload = reactive({ key: "", position: 1 });

const canEditPrincipe = ref(false);
const canEditCritere = ref(false);
const canEditType = ref(false);
const canEditIndicateur = ref(false);

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
  canEditIndicateur.value = false;
}

// Handle edit action
const handleEdit = (data) => {
  payload.key = data;
  canEditIndicateur.value = true;
};
</script>
<template>
  <div class="flex flex-col-reverse items-start w-full gap-2">
    <!-- 
      <div :class="[type ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="w-[91%] px-2 py-2.5 text-base font-medium truncate transition-all">{{ type || type?.length < 0 ? type : "Type de gouvernance" }}</div>
      <div :class="[principe ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="w-[94%] px-2 py-2.5 text-base truncate font-medium transition-all">{{ principe || principe?.length < 0 ? principe : "Principe" }}</div>
      <div :class="[critere ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="w-[97%] px-2 py-2.5 text-base truncate font-medium transition-all">{{ critere || critere?.length < 0 ? critere : "Critère" }}</div>
    -->
    
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

    <!-- <div :class="[indicateur ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="w-full px-2 py-2.5 text-base truncate font-medium transition-all">{{ indicateur || indicateur?.length < 0 ? indicateur : "Indicateur" }}</div> -->
    
    <div
      :class="[indicateur.id ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']"
      class="flex justify-between items-center w-[91%] px-2 py-2.5 text-base truncate font-medium transition-all">
      
      <div class="flex items-center">
        <input v-if="canEditIndicateur" type="number" min="1" step="1" name="position"
          :value="indicateur.position" @keyup.enter="updateTemporyIndicateur(indicateur.key, $event.target.value)"
          class="w-11 h-9 form-control mr-2" />

        <div class="text-wrap" v-if="indicateur.id">
          {{ !canEditIndicateur ? indicateur.position + " - " : '' }} {{ indicateur.nom }}
        </div>
        <span v-else>
          Indicateur de gouvernance
        </span>
      </div>

      <div v-if="indicateur.key && !canEditIndicateur" class="flex items-center gap-1 space-x-1 transition-all container-buttons">

          <button class="p-1.5 text-primary" @click="handleEdit(indicateur.key)">
            <Edit3Icon class="size-5" />
          </button>
          <button class="p-1.5 text-danger" @click="handleDelete(indicateur.key)">
            <TrashIcon class="size-5" />
          </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
