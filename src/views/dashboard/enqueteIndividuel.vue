<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Enquête Individuelle</h2>
    <LoaderSnipper v-if="loading" />
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div v-show="!loading" class="iframe-container">
        <iframe src="https://surveyjs.io/create-free-survey" @load="onIframeLoad"></iframe>
        <div class="overlay"></div>
      </div>
    </div>
  </div>

  <button class="fixed z-20 bottom-2 btn btn-primary right-5" @click="showModalCreate = true"><PlusIcon class="mr-3 size-5" /> Créer un formulaire</button>
  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Validation</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Libellé " v-model="payload.libelle" :control="getFieldErrors(errors.libelle)" />
          <div class="flex-1">
            <label class="form-label" for="json">JSON</label>
            <div class="">
              <textarea name="json" class="form-control" id="json" placeholder="JSON" v-model="payload.json" cols="30" rows="2"></textarea>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetForm" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" label="Enregistrer" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { getFieldErrors } from "../../utils/helpers";
import { toast } from "vue3-toastify";
import EnqueteIndividuelService from "../../services/modules/enquete.individuel.service";

const iframeSrc = "https://surveyjs.io/create-free-survey";
const payload = { libelle: "", json: "" };
const loading = ref(true);
const isLoading = ref(false);
const showModalCreate = ref(false);
const isLoadingData = ref(false);
const datas = ref([]);
const errors = ref({});

function onIframeLoad() {
  loading.value = false;
}

const getDatas = async () => {
  try {
    isLoadingData.value = true;
    const { data } = await EnqueteIndividuelService.get();
    datas.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingData.value = false;
  }
};

const resetForm = () => {
  Object.keys(payload).forEach((key) => {
    payload[key] = "";
  });
  showModalCreate.value = false;
  errors.value = {};
};

const submitData = async () => {
  isLoading.value = true;
  const action = isCreate.value ? EnqueteIndividuelService.create(payload) : EnqueteIndividuelService.update(idSelect.value, payload);
  try {
    await action;
    toast.success(`Formulaire ${isCreate.value ? "crée" : "modifié"} avec succès.`);
    getDatas();
    resetForm();
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
</script>

<style scoped>
.iframe-container {
  position: relative !important;
  width: 82vw !important;
  display: flex;
  justify-content: center;
  max-width: 82vw !important;
  height: 85vh !important;
  padding-top: 56.25% !important; /* Rapport d'aspect 16:9 */
}
iframe {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  border: none !important;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 82vw !important;
  height: 95px; /* Hauteur du header à masquer */
  background-color: white; /* Ou utilisez une autre couleur selon le contexte */
  z-index: 2;
  pointer-events: none !important; /* Permet de cliquer sur le contenu en dessous */
}
</style>
