<template>
  <Notification refKey="successNotification" :options="{ duration: 3000 }" class="flex">
    <CheckCircleIcon v-if="message.type === 'success'" class="text-success" />
    <div class="ml-4 mr-4">
      <div :class="{ 'text-red-500 capitalize ': message.type != 'success' }" class="font-medium">
        {{ message.type }}
      </div>
      <div class="mt-1 text-slate-500">
        {{ message.message }}
      </div>
    </div>
  </Notification>

  
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Changer le mot de passe</h2>
  </div>
  <div class="grid grid-cols-12 gap-6">
    <!-- BEGIN: Profile Menu -->
    <div class="flex flex-col-reverse col-span-12 lg:col-span-4 2xl:col-span-3 lg:block">
      <div class="mt-5 intro-y box">
        <div class="relative flex items-center p-5">
          <div class="w-12 h-12 image-fit">
            <img alt="Midone Tailwind HTML Admin Template" class="rounded-full" :src="usersProfileImage" />
          </div>
          <div class="ml-4 mr-auto">
            <div class="text-base font-medium">{{ currentUsers.nom }} {{ currentUsers.prenom }}</div>
            <div class="text-slate-500">{{ currentUsers.role }}</div>
          </div>
        </div>
        <div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
          <router-link class="flex items-center font-medium text-primary" href="" to="/dashboard/profil"> <ActivityIcon class="w-4 h-4 mr-2" /> Information Personnel </router-link>
          <router-link class="flex items-center mt-5" to="/dashboard/resetPassword"> <LockIcon class="w-4 h-4 mr-2" /> Changer de mot de passe </router-link>
        </div>
      </div>
    </div>
    <!-- END: Profile Menu -->
    <div class="col-span-12 lg:col-span-8 2xl:col-span-9">
      <!-- BEGIN: Change Password -->
      <div class="intro-y box lg:mt-5">
        <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
          <h2 class="mr-auto text-base font-medium">Change Password</h2>
        </div>
        <div class="p-5">
          <form @submit.prevent="modifierMotPasse">
            <div>
              <label for="change-password-form-1" class="form-label">Ancien Mot de passe</label>
              <input id="change-password-form-1" type="password" class="form-control" v-model="formData.oldPassword" placeholder="Entrer votre ancien Mot de passe" />
            </div>
            <div class="mt-3">
              <label for="change-password-form-2" class="form-label">Nouveau Mot passe</label>
              <div class="flex items-center space-x-2">
                <input id="change-password-form-2" :type="statePassword" class="form-control" v-model="formData.newPassword" placeholder="Entrer le nouveau Mot de passe" />
                <EyeIcon @click="invisible" v-show="!show" />
                <EyeOffIcon @click="invisible" v-show="show" />
              </div>
            </div>
            <div class="mt-3">
              <label for="change-password-form-3" class="form-label">Confirmer nouveau Mot de passe</label>
              <div class="flex items-center space-x-2">
                <input id="change-password-form-3" :type="statePassword2" class="form-control" v-model="formData.confirmPassword" placeholder="Confirmer le nouveau mot de passe" />

                <EyeIcon @click="invisible2" v-show="!show2" />
                <EyeOffIcon @click="invisible2" v-show="show2" />
              </div>
            </div>

            <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
              <button type="submit" class="w-full px-4 py-3 align-top btn btn-primary custom-bg xl:mr-3">
                <span class="text-sm font-semibold uppercase" v-if="!chargement"> Modifier Mot de passe </span>
                <span v-else class="flex items-center justify-center space-x-2">
                  <span class="px-4 font-semibold"> chargement ... </span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-center animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <!-- END: Change Password -->
    </div>
  </div>
</template>

<script setup>
import AuthentificationService from "@/services/modules/authentification.service";
import { provide, ref, reactive, onMounted } from "vue";
import { API_BASE_URL } from "@/services/configs/environment";
import { toast } from "vue3-toastify";

const formData = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const show = ref(false);

const show2 = ref(false);

const chargement = ref(false);

const successNotification = ref();

const statePassword = ref("password");

const statePassword2 = ref("password");

const currentUsers = reactive({});

const usersProfileImage = ref("");

onMounted(() => {
  const usersInfo = JSON.parse(localStorage.getItem("authenticateUser"));

  usersProfileImage.value = API_BASE_URL + usersInfo.users.profil;

  if (usersInfo) {
    currentUsers.id = usersInfo.users.id;
    currentUsers.nom = usersInfo.users.nom;
    currentUsers.prenom = usersInfo.users.prenom;
    currentUsers.role = usersInfo.users.role.nom;
    currentUsers.email = usersInfo.users.email;
    // currentUsers.number = usersInfo.users.entreprise.contact
    let storeInitial = currentUsers.nom[0] + "" + currentUsers.prenom[0];
    storeInitial = storeInitial.toUpperCase();
  }
});

const message = reactive({
  type: "",
  message: "",
});

const invisible = () => {
  statePassword.value = !show.value ? "text" : "password";
  show.value = !show.value;
};

const invisible2 = () => {
  statePassword2.value = !show2.value ? "text" : "password";
  show2.value = !show2.value;
};

const modifierMotPasse = () => {
  toast.info("Les mots doivent être identiques");

  if (formData.confirmPassword == formData.newPassword) {
    if (!chargement.value) {
      chargement.value = true;

      let newPassword = { current_password: formData.oldPassword, new_password: formData.newPassword, new_password_confirmation: formData.confirmPassword };

      AuthentificationService.changePassword(newPassword)
        .then((response) => {
          chargement.value = false;
          message.type = response.data.statut;
          message.message = response.data.message;
          successNotificationToggle();
        })
        .catch((err) => {
          chargement.value = false;
          message.type = err.data.status;
          message.message = err.data.message;
          successNotificationToggle();
        });
    }
  } else {
    toast.info("Les mots doivent être identiques");
  }
};

provide("bind[successNotification]", (el) => {
  // Binding
  successNotification.value = el;
});
const successNotificationToggle = () => {
  // Show notification
  successNotification.value.showToast();
};
</script>
