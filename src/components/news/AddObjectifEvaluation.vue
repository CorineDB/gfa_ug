<template>
  <div>
    <Modal size="modal-lg" backdrop="static" :show="showModal" @hidden="showModal = false">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">Ajouter les objectifs</h2>
      </ModalHeader>
      <form @submit.prevent="submitObjectifs">
        <ModalBody>
          <div v-if="!isLoadingPrincipes" class="grid grid-cols-1 gap-4 max-h-[75vh] overflow-y-auto">
            <div v-for="(principe, index) in principes" :key="index" class="">
              <!-- <InputForm :label="principe.nom" class="flex-1" min="0" max="1" step="0.1" v-model="responses[principe.id].objectif_attendu" :control="getFieldErrors(errors[`objectifsAttendu.${index}.objectif_attendu`])" type="number" /> -->
              <div>
                <label :for="principe.id" class="form-label">{{ principe.nom }}</label>
                <input :id="principe.id" type="number" required class="form-control" min="0" max="1" step="0.1" v-model="responses[principe.id].objectif_attendu" :placeholder="principe.nom" />
                <div v-if="errors[`objectifsAttendu.${index}.objectif_attendu`]" class="mt-2 text-danger">{{ getFieldErrors(errors[`objectifsAttendu.${index}.objectif_attendu`]) }}</div>
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
      objectif_attendu: "",
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
