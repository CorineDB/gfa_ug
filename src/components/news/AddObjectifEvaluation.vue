<template>
  <div>
    <Modal size="modal-xl" backdrop="static" :show="showModal" @hidden="showModal = false">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">Ajouter les objectifs</h2>
      </ModalHeader>
      <form @submit.prevent="submitObjectifs">
        <ModalBody>
          <div v-if="!isLoadingPrincipes" class="grid grid-cols-1 gap-4 max-h-[75vh] overflow-y-auto">
            <!-- <div v-for="(principe, index) in principes" :key="index" class="">
              <div>
                <label :for="principe.id" class="form-label">{{ principe.nom }}</label>
                <input :id="principe.id" type="number" required class="form-control" min="0" max="1" step="0.1" v-model="responses[principe.id].objectif_attendu" :placeholder="principe.nom" />
                <div v-if="errors[`objectifsAttendu.${index}.objectif_attendu`]" class="mt-2 text-danger">{{ getFieldErrors(errors[`objectifsAttendu.${index}.objectif_attendu`]) }}</div>
              </div>
                          </div> -->
            <div v-for="(principe, index) in principes" :key="index" class="mb-3">
              <p class="mb-1 text-sm font-medium">{{ principe.nom }}</p>
              <div class="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
                <div class="input-group">
                  <div class="flex items-center justify-center text-sm input-group-text">Factuel</div>
                  <input type="number" min="0" max="1" step="0.1" class="form-control" v-model="responses[principe.id].outils.find((item) => item.type === 'factuel').objectif_attendu" placeholder="Objectif factuel" />
                </div>
                <div class="input-group">
                  <div class="flex items-center justify-center text-sm input-group-text">Perception</div>
                  <input type="number" min="0" max="1" step="0.1" class="form-control" v-model="responses[principe.id].outils.find((item) => item.type === 'perception').objectif_attendu" placeholder="Objectif perception" />
                </div>
                <div class="input-group">
                  <div class="flex items-center justify-center text-sm input-group-text">Synthetique</div>
                  <input type="number" min="0" max="1" step="0.1" class="form-control" v-model="responses[principe.id].outils.find((item) => item.type === 'synthetique').objectif_attendu" placeholder="Objectif synthetique" />
                </div>
              </div>
            </div>
          </div>
          <LoaderSnipper v-else />
        </ModalBody>
        <ModalFooter>
          <div class="flex gap-2">
            <button type="button" @click="resetForm" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
            <VButton :loading="isLoading" label="Ajouter" />
          </div>
        </ModalFooter>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import EvaluationService from "../../services/modules/evaluation.gouvernance.service";
import InputForm from "@/components/news/InputForm.vue";
import { getFieldErrors } from "../../utils/helpers";
import VButton from "@/components/news/VButton.vue";
import { reactive } from "vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { toast } from "vue3-toastify";

const prop = defineProps({
  evaluation: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update-datas"]);

const isLoading = ref(false);
const isLoadingPrincipes = ref(true);
const showModal = defineModel("show");
const errors = ref({});
const responses = reactive({});
const payload = reactive({
  objectifsAttendu: [],
});
const principes = ref([]);

const resetForm = () => {
  principes.value = [];
  isLoadingPrincipes.value = true;
  errors.value = {};
  showModal.value = false;
};

const submitObjectifs = async () => {
  payload.objectifsAttendu = Object.values(responses);
  console.log("payload", payload);
  isLoading.value = true;
  const action = EvaluationService.addObjectifPrincipe(prop.evaluation.id, payload);
  try {
    await action;
    resetForm();
    toast.success(`Objectifs ajoutés avec succès.`);
    setTimeout(() => {
      emit("update-datas");
    }, 500);
  } catch (e) {
    if (e.response && e.response.status === 422) {
      errors.value = e.response.data.errors;
    } else {
      toast.error(getAllErrorMessages(e));
    }
  } finally {
    isLoading.value = false;
  }
};
const getPrincipes = async () => {
  const action = EvaluationService.getPrincipesObjectif(prop.evaluation.id);
  try {
    const result = await action;
    principes.value = result.data.data;
    initializeFormData();
  } catch (e) {
    toast.error(getAllErrorMessages(e));
  } finally {
    isLoadingPrincipes.value = false;
  }
};

const initializeFormData = () => {
  principes.value.forEach((principe) => {
    responses[principe.id] = {
      principeId: principe.id,
      outils: [
        {
          type: "factuel",
          objectif_attendu: "",
        },
        {
          type: "perception",
          objectif_attendu: "",
        },
        {
          type: "synthetique",
          objectif_attendu: "",
        },
      ],
    };
  });
};

watch(
  () => showModal.value,
  async (newValue) => {
    if (newValue) {
      await getPrincipes();
    } else {
      errors.value = {};
    }
  }
);
</script>

<style scoped></style>
