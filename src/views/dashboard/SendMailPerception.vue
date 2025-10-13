<script setup>
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import { onMounted, reactive } from "vue";
import EvaluationService from "@/services/modules/evaluation.gouvernance.service";
import { ref, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { computed } from "vue";

//vérifier numéro de téléphone
const { proxy } = getCurrentInstance();
const currentPhone = ref("");

const isValid = computed(() => {
   
  return proxy.$isValidPhoneNumber(currentPhone.value, "BJ");
});

const route = useRoute();
const router = useRouter();

const options = [
  { label: "Adresse Email", id: "email" },
  { label: "Numéro de téléphone", id: "contact" },
];

const payload = reactive({
  organisationId: "",
  participants: {
    type_de_contact: options[0].id,
    email: [],
    phone: [],
  },
});
const idEvaluation = route.query.e;
const currentOption = ref(options[0].id);
const currentEmail = ref("");

const isLoading = ref(false);

const addEmail = () => {
  if (currentEmail.value) {
    if (!payload.participants.email.includes(currentEmail.value)) {
      payload.participants.email.unshift(currentEmail.value);
      currentEmail.value = "";
    } else {
      toast.info("Adresse email déja ajouté");
    }
  }
};

const addPhone = () => {
  if (currentPhone.value && isValid.value) {
    if (!payload.participants.phone.includes(currentPhone.value)) {
      payload.participants.phone.unshift(currentPhone.value);
      currentPhone.value = "";
    } else {
      toast.info("Numéro de téléphone déja ajouté");
    }
  }
};
const goBack = () => {
  router.push({ name: "SoumissionsEnqueteDeCollecte", params: { id: idEvaluation } });
};
const resetForm = () => {};

const submitData = async () => {
  isLoading.value = true;
  try {
    await EvaluationService.addParticipantPerception(idEvaluation, payload);
    toast.success(`Participants ajoutés.`);
    resetForm();
  } catch (e) {
    toast.error(getAllErrorMessages(e));
  } finally {
    isLoading.value = false;
  }
};

const deleteItem = (item) => {
  if (payload.participants.type_de_contact == options[0].id) {
    payload.participants.email.splice(item, 1);
  } else {
    payload.participants.phone.splice(item, 1);
  }
};

const filterData = computed(() => (payload.participants.type_de_contact === options[0].id ? payload.participants.email : payload.participants.phone));

onMounted(() => {
  payload.organisationId = route.params.o;
});
</script>
<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Envoyer des mails pour la participation</h2>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
        <div class="flex">
          <button @click="goBack()" class="mr-2 shadow-md btn btn-primary"><ArrowLeftIcon class="w-4 h-4 mr-3" />Retour</button>
        </div>
      </div>
    </div>
    <div class="max-w-screen-lg p-4 mx-auto mt-10 box">
      <p class="text-base font-medium">Ajouter des participants</p>
      <hr class="my-4" />
      <div class="gap-4 m-h-[50vh] flex flex-col justify-between">
        <div class="space-y-6">
          <div>
            <label class="form-label">Type de données</label>
            <div class="flex gap-2">
              <div v-for="(option, index) in options" :key="index" class="form-check">
                <input v-model="payload.participants.type_de_contact" :id="option.id" class="form-check-input" type="radio" name="option" :value="option.id" />
                <label class="form-check-label" :for="option.id">{{ option.label }}</label>
              </div>
            </div>
          </div>
          <form v-show="payload.participants.type_de_contact === options[0].id" @submit.prevent="addEmail">
            <div class="flex items-end gap-4">
              <InputForm class="" label="Adresse email" v-model="currentEmail" type="email" />
              <button class="btn btn-primary"><PlusIcon class="w-4 h-4 mr-3" />Ajouter</button>
            </div>
          </form>
          <form v-show="payload.participants.type_de_contact === options[1].id" @submit.prevent="addPhone">
            <div class="flex items-end gap-4">
              <div >
                  <InputForm
                    label="Numéro de téléphone"
                    v-model="currentPhone"
                    maxlength="13"
                    placeholder="+229xxxxxxxxxx"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                  />
                  
                  <!-- Message de validation avec animation -->
                  <div class="mt-4 min-h-[1.5rem]">
                    <p v-if="isValid" class="flex items-center text-green-600 font-medium text-sm animate-pulse">
                      <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      Numéro valide
                    </p>
                    <p v-else-if="currentPhone && currentPhone.length > 0" class="flex items-center text-red-500 font-medium text-sm">
                      <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                      Numéro invalide
                    </p>
                  </div>
              </div>
              <button class="btn btn-primary"><PlusIcon class="w-4 h-4 mr-3" />Ajouter</button>
            </div>
          </form>

          <div class="flex flex-wrap items-center w-full max-w-full gap-3">
            <div class="flex items-center justify-between gap-2 px-3 py-1 text-sm font-medium bg-white rounded-full shadow cursor-pointer text-primary" v-for="(mail, index) in filterData" :key="index">
              <span>{{ mail }} </span>
              <button @click="deleteItem(index)" class="p-2 transition-colors rounded-full hover:bg-red-100"><PlusIcon class="w-4 h-4 text-danger" /></button>
            </div>
          </div>
        </div>
        <VButton :loading="isLoading" class="py-3" label="Enregistrer" @click="submitData" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
