<template>
  <!-- BEGIN: Top Bar -->

  <div class="top-bar">
    <!-- toast notification -->
    <Notification refKey="successNotification" :options="{ duration: 3000 }" class="flex">
      <CheckCircleIcon v-if="message.type === 'success'" class="text-success" />
      <div class="ml-4 mr-4">
        <div :class="{ 'text-red-500 capitalize ': message.type != 'success' }" class="font-medium">{{ message.type }}</div>
        <div class="mt-1 text-slate-500">
          {{ message.message }}
        </div>
      </div>
    </Notification>
    <!-- toast notification -->
    <!-- BEGIN: Breadcrumb -->

    <Breadcrumb />

    <!-- BEGIN: Account Menu -->

    <!-- <pre>{{ yearsStore.getYears }}</pre> -->

    <Dropdown class="w-8 h-8 intro-x">
      <DropdownToggle tag="div" role="button" class="dropdown-toggle image-fit zoom-in">
        <div class="flex items-center justify-center w-8 h-8 bg-blue-400 rounded-full shadow-lg cursor-pointer">
          <img v-if="usersProfileImage" :src="usersProfileImage" alt="" />
          <span v-else class="p-2 text-sm font-bold text-white uppercase"> {{ currentUsers.initiale }} </span>
        </div>
      </DropdownToggle>
      <DropdownMenu class="w-56">
        <DropdownContent class="text-white bg-primary">
          <DropdownHeader tag="div" class="!font-normal">
            <div class="font-medium">
              <!-- {{  currentUsers.prenom }} -->
              <span> {{ currentUsers.nom }} </span>
            </div>
            <div class="text-xs text-white/70 mt-0.5 dark:text-slate-500">
              {{ currentUsers.role }}
            </div>
          </DropdownHeader>
          <DropdownDivider class="border-white/[0.08]" />
          <DropdownItem class="dropdown-item hover:bg-white/5">
            <span @click="gotoProfil" class="flex w-full space-y-2" to=""> <UserIcon class="w-4 h-4 mr-2" /> Profil </span>
          </DropdownItem>
          <DropdownItem class="dropdown-item hover:bg-white/5">
            <router-link class="flex w-full space-y-2" to="/dashboard/resetPassword"> <LockIcon class="w-4 h-4 mr-2" /> Réinitialiser le Mot de Passe </router-link>
          </DropdownItem>

          <DropdownDivider class="border-white/[0.08]" />
          <DropdownItem class="dropdown-item hover:bg-white/5">
            <span class="flex items-center space-x-2 cursor-pointer" @click="logout"> <ToggleRightIcon class="w-4 h-4 mr-2" /> Se déconnecter</span>
          </DropdownItem>
        </DropdownContent>
      </DropdownMenu>
    </Dropdown>

    <!-- END: Account Menu -->
  </div>
  <!-- END: Top Bar -->
</template>

<script setup>
import { ref, reactive, onMounted, provide, computed } from "vue";
import { useAuthStore } from "@/stores/modules/authentification";
import AuthentificationService from "@/services/modules/auth.service";
import { useRouter, useRoute } from "vue-router";
import { API_BASE_URL } from "@/services/configs/environment";
import Breadcrumb from "../Breadcrumb.vue";
import { toast } from "vue3-toastify";
import AuthService from "@/services/modules/auth.service";
import { useYearsStore } from "@/stores/years";
import { onBeforeUnmount } from "vue";

//Store years
const yearsStore = useYearsStore();
const debutProgramme = ref("");
const finProgramme = ref("");




let inactivityTimer;

 


const getcurrentUser = async () => {
  await AuthService.getCurrentUser()
    .then((result) => {
      debutProgramme.value = result.data.data.programme.debut;
      finProgramme.value = result.data.data.programme.fin;

      years();
    })
    .catch((e) => {
      toast.error("Une erreur est survenue: Utilisateur connecté .");
    });
};

const years = () => {
  let anneeDebut = parseInt(`${debutProgramme.value.split("-")[0]}`);
  let anneeFin = parseInt(`${finProgramme.value.split("-")[0]}`);
  let annees = [];
  for (let annee = anneeDebut; annee <= anneeFin; annee++) {
    if (annee <= new Date().getFullYear()) {
      annees.push(annee);
    }
  }

  
  yearsStore.setYears(annees);
  
  return annees;
};

//fin store years
const router = useRouter();
const route = useRoute();
const searchDropdown = ref(false);
const showSearchDropdown = () => {
  searchDropdown.value = true;
};
const hideSearchDropdown = () => {
  searchDropdown.value = false;
};

const store = useAuthStore();
const currentUsers = reactive({});
const successNotification = ref();
const initiale = ref();

const message = reactive({
  type: "success",
  message: "",
});

const usersProfileImage = ref("");

onMounted(() => {
    // setupInactivityListeners(); // ⬅️ Ajouté ici

  const usersInfo = JSON.parse(localStorage.getItem("authenticateUser"));

  getcurrentUser();

  

  if (usersInfo) {
    // usersProfileImage.value = API_BASE_URL + usersInfo.users.profil
    currentUsers.nom = usersInfo.nom;
    // currentUsers.nom = "test";
    // currentUsers.prenom = usersInfo.users.prenom
    currentUsers.role = usersInfo.role[0].nom;
    //  + currentUsers.prenom[0]
    let storeInitial = currentUsers.nom[0] + "";
    storeInitial = storeInitial.toUpperCase();
    initiale.value = storeInitial;
    currentUsers.initiale = initiale.value;
  }
});
onBeforeUnmount(() => {
  // removeInactivityListeners();
});

const logout = () => {
  localStorage.removeItem("bsdInfo");
  localStorage.removeItem("access_token");
  localStorage.removeItem("authenticateUser");
  localStorage.clear();
  toast.success("Vous êtes déconnecté");
  setTimeout(() => {
    router.push("/");
  }, 100);
  AuthentificationService.logout()
    .then(() => {
      toast.success("Vous êtes déconnecté");
    })
    .catch((error) => {
      setTimeout(() => {
        router.push("/");
      }, 100);
     

      // Afficher le message d'erreur du serveur
      const errorMessage = error.response?.data?.message || "Erreur de déconnexion";
      toast.error(errorMessage);
    });
};

const gotoProfil = () => {
  router.push("/dashboard/profil");
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
