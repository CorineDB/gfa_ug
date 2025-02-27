<template>
     <div class="container px-6 mx-auto">
      <div
        class="flex flex-col text-center md:text-left md:flex-row h-screen justify-evenly md:items-center"
      >
        <div class="flex flex-col w-full">
          <div>
            <img alt="Midone Tailwind HTML Admin Template" class="w-48 p-4 bg-white rounded-xl mx-auto md:float-left " src="../../assets/images/GFA.png" />
           
          </div>
          <h1 class="text-5xl text-white font-bold my-5">GFA Survey</h1>
          <p class="w-full md:w-11/12 mx-auto md:mx-0 text-white mb-5">
            Responsabilité partagée, Qualité améliorée : Unis pour un meilleur service social.
          </p>
        </div>
        <div class="w-full md:w-full lg:w-9/12 mx-auto md:mx-0">
          <div class="bg-white p-10 flex flex-col w-full shadow-xl rounded-xl">
            <Alert v-if="showAlert" class="flex items-center mb-2 alert-danger"> <AlertCircleIcon class="w-6 h-6 mr-2" /> Email ou mot de passe incorrect.</Alert>
            
            <h2 class="text-2xl font-bold text-gray-800 text-left mb-5">
              Se connecter
            </h2>
            <form @submit.prevent="save" autocomplete="on" class="w-full">
              <div id="input" class="flex flex-col w-full my-5">
                <label for="username" class="text-gray-500 mb-2"
                  >Email</label
                >
                <input
                  type="text"
                  id="username"
                  placeholder="Email"
                  class="appearance-none border-2 border-gray-100 rounded-lg px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:shadow-lg"
                  autocomplete="on" v-model.trim="login"
                />
              </div>
              <div id="input" class="flex flex-col w-full my-5">
                <label for="password" class="text-gray-500 mb-2"
                  >Mot de passe</label
                >
                <div class="relative w-full">

                
                <input
                 :type="statePassword"
                  id="password"
                  v-model.trim="password"
                  placeholder="Mots de passe"
                  class="appearance-none border-2 border-gray-100 rounded-lg px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:shadow-lg w-full"
                />
                <span @click="invisible" v-if="show" class="absolute z-10 text-blue-500 cursor-pointer right-4 top-2">
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.8em" width="1.6em" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <clipPath>
                          <path fill="none" d="M124-288l388-672 388 672H124z" clip-rule="evenodd"></path>
                        </clipPath>
                      </defs>
                      <path d="M508 624a112 112 0 0 0 112-112c0-3.28-.15-6.53-.43-9.74L498.26 623.57c3.21.28 6.45.43 9.74.43zm370.72-458.44L836 122.88a8 8 0 0 0-11.31 0L715.37 232.23Q624.91 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 0 0 0 51.5q56.7 119.43 136.55 191.45L112.56 835a8 8 0 0 0 0 11.31L155.25 889a8 8 0 0 0 11.31 0l712.16-712.12a8 8 0 0 0 0-11.32zM332 512a176 176 0 0 1 258.88-155.28l-48.62 48.62a112.08 112.08 0 0 0-140.92 140.92l-48.62 48.62A175.09 175.09 0 0 1 332 512z"></path>
                      <path d="M942.2 486.2Q889.4 375 816.51 304.85L672.37 449A176.08 176.08 0 0 1 445 676.37L322.74 798.63Q407.82 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 0 0 0-51.5z"></path></svg>
                  </span>
                  <span @click="invisible" v-if="!show" class="absolute z-10 text-blue-500 cursor-pointer right-4 top-2"> 
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1.8em" width="1.6em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"></path>
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"></path></svg>
                  </span>
              </div>
              </div>
              <div id="button" class="flex flex-col w-full my-5">
              <VButton :loading="chargement" label="Se connecter" class="py-3" />
                
               
              
                <div class="flex justify-between mt-5">
                  
                  <div class="flex items-center mr-auto w-3/5">
                    <input id="remember-me" type="checkbox" class="mr-2 border form-check-input" />
                    <label class="mr-3 cursor-pointer select-none" for="remember-me">Se souvenir de moi</label>
                  </div>
                  <a
                    href="#" @click="goPageRequest()"
                    class="w-2/5 text-center font-medium text-gray-500 cursor-pointer"
                    >Mots de passe oublié?</a
                  >
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  <!-- <div>  
    <div class="sm:px-10 md:px-0">
      <div class="block grid-cols-2 gap-4 bg-white xl:grid">
        BEGIN: Login Info
        <div class="flex-col hidden min-h-screen p-5 bg-primary xl:flex">
          <a href="" class="p-2 pt-5 mx-auto bg-white border shadow-sm -intro-x h-fit w-fit rounded-xl">
            <img alt="Midone Tailwind HTML Admin Template" class="w-48 mx-auto" src="../../assets/images/GFA.png" />
          </a>
          <div class="my-auto text-center bg-primary">
            <img alt="Midone Tailwind HTML Admin Template" class="w-1/2 mx-auto -intro-x" src="@/assets/images/Checklist-rafiki.svg" />
            <div class="mt-10 text-3xl font-medium leading-tight text-white -intro-x">GFA Survey <br /></div>
            <div class="px-4 mt-5 text-xl text-white -intro-x text-opacity-70 dark:text-slate-400">Responsabilité partagée, Qualité améliorée : Unis pour un meilleur service social.</div>
          </div>
        </div>
        END: Login Info
        BEGIN: Login Form
        <form @submit.prevent="save" autocomplete="on" class="flex items-center h-screen py-5 m-10 _bg-white xl:h-auto xl:py-0 sm:mx-auto xl:my-0">
          <div class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
            <Alert v-if="showAlert" class="flex items-center mb-2 alert-danger"> <AlertCircleIcon class="w-6 h-6 mr-2" /> Email ou mot de passe incorrect.</Alert>
            <h2 class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">Se connecter</h2>
            <div class="mt-2 text-center intro-x text-slate-400 xl:hidden">Responsabilité partagée, Qualité améliorée : Unis pour un meilleur service social.</div>
            <div class="mt-8 intro-x">
              <div>
                <input type="text" autocomplete="on" v-model.trim="login" class="block px-4 py-3 intro-x login__input form-control" placeholder="Email" />
               
              </div>

              <div class="">
                <div class="relative">
                  <input :type="statePassword" class="block px-4 py-3 mt-4 intro-x login__input form-control" v-model.trim="password" placeholder="Mots de passe" />

                  <span @click="invisible" v-if="show" class="absolute z-10 text-blue-500 cursor-pointer right-4 top-2"
                    ><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.8em" width="1.6em" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <clipPath>
                          <path fill="none" d="M124-288l388-672 388 672H124z" clip-rule="evenodd"></path>
                        </clipPath>
                      </defs>
                      <path d="M508 624a112 112 0 0 0 112-112c0-3.28-.15-6.53-.43-9.74L498.26 623.57c3.21.28 6.45.43 9.74.43zm370.72-458.44L836 122.88a8 8 0 0 0-11.31 0L715.37 232.23Q624.91 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 0 0 0 51.5q56.7 119.43 136.55 191.45L112.56 835a8 8 0 0 0 0 11.31L155.25 889a8 8 0 0 0 11.31 0l712.16-712.12a8 8 0 0 0 0-11.32zM332 512a176 176 0 0 1 258.88-155.28l-48.62 48.62a112.08 112.08 0 0 0-140.92 140.92l-48.62 48.62A175.09 175.09 0 0 1 332 512z"></path>
                      <path d="M942.2 486.2Q889.4 375 816.51 304.85L672.37 449A176.08 176.08 0 0 1 445 676.37L322.74 798.63Q407.82 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 0 0 0-51.5z"></path></svg
                  ></span>
                  <span @click="invisible" v-if="!show" class="absolute z-10 text-blue-500 cursor-pointer right-4 top-2"
                    ><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1.8em" width="1.6em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"></path>
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"></path></svg
                  ></span>
                </div>
                
              </div>
            </div>
            <div class="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
              <div class="flex items-center mr-auto">
                <input id="remember-me" type="checkbox" class="mr-2 border form-check-input" />
                <label class="mr-3 cursor-pointer select-none" for="remember-me">Se souvenir de moi</label>
              </div>
              <span class="cursor-pointer" @click="goPageRequest()">Mots de passe oublié?</span>
            </div>
            <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
              
              <VButton :loading="chargement" label="Se connecter" class="py-3" />
            </div>
            <div class="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left">Célerité holding tout les droits réservés {{ year }}</div>
          </div>
        </form>
        END: Login Form
      </div>
    </div>
  </div> -->
</template>

<script>
//import { required, minLength, numeric, email, sameAs } from 'vuelidate/lib/validators';
//import gRecaptcha from '@finpo/vue2-recaptcha-invisible';
import { required, minLength, numeric, email, sameAs } from "@vuelidate/validators";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";

//import Vmodal from '@/components/Vmodal'
import axios from "axios";
import VButton from "@/components/news/VButton.vue";
import { API_BASE_URL } from "@/services/configs/environment.js";
import { toast } from "vue3-toastify";
import { useSideMenuStore } from "@/stores/side-menu";
import { useSimpleMenuStore } from "@/stores/simple-menu";

//const sideMenuStore = useSideMenuStore();
//const simpleMenuStore = useSimpleMenuStore();

export default {
  name: "IndexPage",
  components: { VButton },
  data() {
    return {
      base_url: API_BASE_URL,
      statePassword: "password",
      show: false,
      showAlert: false,
      state: {
        email: "",
        password: "",
      },
      year: new Date().getFullYear(),
      login: "",
      password: "",
      isRobot: true,
      chargement: false,
      soumettre: false,
      isValidate: false,
      showSend: false,
      isLoading: false,
    };
  },
  computed: {
    //importation des variables du module auths
    ...mapState({
      identifiant: (state) => state.auths.identifiant,
      accountValidate: (state) => state.accountValidate,
      loading: (state) => state.loading,
    }),
  },

  methods: {
    //Charger les fonctions de connexion au serveur
    ...mapActions({
      authentification: "auths/LOGIN",
    }),
    toast,
    gotoValidate() {
      this.showSend = true;
    },
    goPageRequest() {
      this.$router.push({ name: "request_password" });
    },
    resentLink() {
      this.soumettre = true;
      if (!this.$v.login.$invalid) {
        this.$router.push({ name: "resendLink", params: { identifiant: this.login } });
        this.showSend = false;
      }
    },
    async save() {
      this.soumettre = true;
      this.chargement = true;
      if (this.chargement === true) {
        const identifiant = {};
        identifiant.email = this.login;
        identifiant.password = this.password;
        const datas = await axios.get(`${this.base_url}/sanctum/csrf-cookie`);
        //const datas = true;
        // datas.status == 204
        if (datas) {
          await this.authentification(identifiant)
            .then((response, status) => {
              if (response.statut === "success" || response.status === 200) {
                const usersInfo = JSON.parse(localStorage.getItem("authenticateUser"));

                //  let permissions = usersInfo.role[0].permissions;

                //   let permissions = [
                //    {
                //      id: "07BZNxb9Q4mR1Y0AkbE3xvzo2GdDqnjZK1JZ6leKapX95rgMwP78NLBVWQ4LEvAn",
                //       nom: "Voir un projet",
                //       slug: "voir-un-projet",
                //     },
                //   ];

                //  sideMenuStore.setTabPermission(permissions);

                // sideMenuStore.addToMenuIfPermissionGranted();

                // simpleMenuStore.setTabPermission(permissions);

                // sideMenuStore.addToMenuIfPermissionGranted();

                this.chargement = false;
                if (response.data.utilisateur.type == "administrateur") {
                  // this.$toast.success("Connexion réussie")
                  this.$router.push("/dashboard/programme");
                } else {
                  // this.$toast.success("Connexion réussie")
                  this.$router.push("/dashboard/projets");
                }
              }
            })
            .catch((error) => {
              console.log(error);
              if (error.response.status == 422) {
                this.showAlert = true;
                toast.error("Email ou mot de passe incorrect reesayer !!!");
              } else {
                toast.error("Identifiants incorrect !!!");
              }
              this.chargement = false;
            });
        } else {
          this.$toast.error("Connexion impossible reesayer !!!");
        }
      }

      //  if (!this.$v.login.$invalid && !this.$v.password.$invalid) {

      //  }
    },

    validate() {
      // validate your form , if you don't have validate prop , default validate pass .
      return true;
    },
    callback(token) {
      // google recaptcha token , then you can pass to backend with your form data .
      if (token) {
        //alert(token);
        this.$toast.success("Confirmer");
        this.isRobot = false;
      } else {
        // if you use data-size show reCAPTCHA , maybe you will get empty token.
        //alert('please check you are not robot');
        this.$toast.error("Verifier que vous n'est pas un robot  !!!");
      }
    },
    invisible() {
      this.statePassword = !this.show ? "text" : "password";
      this.show = !this.show;
      //this.$toast.success('Profile saved',)
    },
  },
  mounted() {
    if (localStorage.getItem("authenticateUser") && localStorage.getItem("access_token")) {
      window.location.href = "/dashboard/projets";
    }
    this.isValidate = localStorage.getItem("activeCompte");
  },

  validations: {
    login: {
      required,
      email,
    },

    password: {
      required,
      minLength: minLength(6),
    },
  },

  watch: {
    loading: function (params) {
      //this.loading = params
    },
  },
};
</script>

<style scoped>
.custom-bg {
  background-color: #0f3460;
}
</style>
