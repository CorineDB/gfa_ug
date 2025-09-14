<script setup>
import { ref, reactive } from "vue";

defineProps({
  principe: Object,
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

const emit = defineEmits(["editPositionPrincipe", "editPositionQuestion", "deletePrincipe", "deleteQuestion"]);

/* const showModalCreate = ref(false); */
const payload = reactive({ key: "", position: 1 });

const canEditPrincipe = ref(false);
const canEditQuestion = ref([]);

function handleDelete(data) {
  emit("deleteQuestion", data);
}
function handleDeletePrincipe(data) {
  emit("deletePrincipe", data, "principe");
}
function editPrincipe(data) {
  payload.key = data;
  canEditPrincipe.value = true;
}

function updateTemporyPrincipe(id, position) {
  console.log(id, position);
  emit("editPositionPrincipe", id, position, true);
  canEditPrincipe.value = false;
}

function updateTemporyQuestion(key, position) {
  console.log(key, position);
  emit("editPositionQuestion", key, position, true);
  canEditQuestion.value[key] = false;
}

// Handle edit action
const handleEdit = (data) => {
  payload.key = data;
  canEditQuestion.value[data] = true;
};
</script>
<template>
  <div class="flex flex-col-reverse items-start w-full gap-2">
    <div :class="[principe.id ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="flex items-center justify-between w-[94%] px-2 py-2.5 text-base truncate font-medium transition-all">
      <div class="text-wrap">
        {{ principe.id ? principe.position + " - " + principe.nom : "Principe" }}
      </div>

      <div v-if="principe.nom != ''" class="flex items-center gap-1 space-x-1 transition-all container-buttons">
        <div v-if="canEditPrincipe">
          <input type="number" min="1" step="1" name="position" :value="principe.position" @keyup.enter="updateTemporyPrincipe(principe.id, $event.target.value)" class="w-2/5 form-control" />
        </div>
        <div v-else>
          <button class="p-1.5 text-primary" @click="editPrincipe(principe.id)">
            <Edit3Icon class="size-5" />
          </button>
          <button class="p-1.5 text-danger" @click="handleDeletePrincipe(principe.id)">
            <TrashIcon class="size-5" />
          </button>
        </div>
      </div>
    </div>
    <p v-if="principe !== ''" class="text-sm font-bold my-2">Principe</p>

    <div v-for="item in [...indicateurArray].reverse()" :key="item.id" :class="[item.indicateur.id ? 'text-black border-yellow-200 border-l-2 bg-white rounded shadow' : 'border-dashed border-gray-400 text-gray-600 border-2']" class="flex items-center justify-between w-full px-2 py-2.5 text-base truncate font-medium transition-all">
      <div class="text-wrap">
        {{ item.indicateur.id ? item.indicateur.position + " - " + item.indicateur.nom : "Question opérationnelle" }}
      </div>

      <div v-if="item.indicateur.nom != ''" class="flex items-center gap-1 space-x-1 transition-all container-buttons">
        <div v-if="canEditQuestion[item.key]">
          <input type="number" min="1" step="1" name="position" :value="item.indicateur.position" @keyup.enter="updateTemporyQuestion(item.key, $event.target.value)" class="w-2/5 form-control" />
        </div>
        <div v-else>
          <button class="p-1.5 text-primary" @click="handleEdit(item.key)">
            <Edit3Icon class="size-5" />
          </button>
          <button class="p-1.5 text-danger" @click="handleDelete(item.key)">
            <TrashIcon class="size-5" />
          </button>
        </div>
      </div>
    </div>
    <p v-if="indicateurArray[0].indicateur.nom !== ''" class="text-sm font-bold my-2">Question opérationnelle</p>
  </div>
</template>

<style scoped></style>
