<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Rapport</h2>
  <div class="w-full mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
    </div>

    <!-- Modal for creating/updating backdrop="static"-->
    <Modal size="modal-lg" :show="showSendMail" @hidden="showSendMail">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">Envoyer un rapport</h2>
      </ModalHeader>
      <form @submit.prevent="sendRapport">
        <ModalBody>
          <div class="grid grid-cols-1 gap-4">
            <!-- <pre> editorData {{ editorData }}</pre> -->
            <div class="form-group my-2">
              <InputForm label="Objet" class="flex-1" v-model="objet" type="text" />
            </div>

            <!-- <pre>Edit data {{ edit.Data }}</pre> -->

            <div class="form-group my-2">
              <InputForm label="Destinataire" class="flex-1" v-model="bcc" type="text" />
            </div>
            <!-- <pre>{{ Update }}</pre> -->
            <div class="form-group my-2">
              <InputForm class="col-span-12" type="file" @change="handleFileChange" required="required" placeHolder="choisir un fichier" label="Fichiers" />
            </div>
            <!-- <pre>{{ FormRapport }}</pre> -->
          </div>
        </ModalBody>
        <ModalFooter>
          <div class="flex gap-2">
            <button type="button" @click="showSendMail = false" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
            <VButton :loading="isLoading" label="Envoyer" />
          </div>
        </ModalFooter>
      </form>
    </Modal>

    <!-- backdrop="static" -->
    <Modal size="modal-lg" :show="showRapport" @hidden="showRapport">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">Aperçu du rapport</h2>
      </ModalHeader>

      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <!-- <div v-html="rapport" class="custom-ck"></div> -->
        </div>
      </ModalBody>
    </Modal>

    <!-- formulaire -->
    <div v-if="!Update" class="p-4 col-span-12">
      <h1 class="text-xl font-bold">Production de rapport</h1>

      <form action="" @submit.prevent="saveRapport" class="p-5 w-full">
        <div class="form-group my-2">
          <InputForm label="Titre du rapport" class="flex-1" v-model="nom" type="text" />
        </div>

        <div class="form-group my-2">
          <label class="text-xs font-semibold">Contenu du rapport </label>
          <ClassicEditor v-model="editorData" />
        </div>
        <div class="py-2 my-4 flex justify-end space-x-8">
          <VButton :loading="chargement" label="Enrégistrer" />

          <button type="button" class="btn btn-primary w-full my-3 px-2" :disabled="editorData == '' && nom == ''" @click.stop.prevent="modalMail()" label="Envoyer par mail">Envoyer par mail</button>
        </div>
      </form>
    </div>

    <div v-else class="p-4 col-span-12">
      <h1 class="text-xl font-bold">Modification de rapport</h1>
      <form action="" @submit.prevent="saveEditRapport" class="p-5 w-full">
        <div class="form-group my-2">
          <InputForm label="Titre du rapport" class="flex-1" v-model="edit.nom" type="text" />
        </div>

        <div class="form-group my-2">
          <label class="text-xs font-semibold">Contenu du rapport </label>
          <ClassicEditor v-model="edit.Data" />
        </div>
        <div class="py-2 my-4 flex justify-end space-x-8">
          <VButton :loading="chargement3" label="Enrégistrer" />

          <VButton @click="modalMail()" label=" Envoyer par mail " />
        </div>
      </form>
    </div>

    <!-- fin formulaire -->

    <!-- tableau -->

    <div class="align-middle inline-block bg-white overflow-x-auto p-3 rounded-sm rounded-br-lg w-full">
      <!-- header -->

      <table class="w-1/2">
        <thead>
          <tr>
            <th class="pb-0 hover:bg-gray-200 text-left whitespace-nowrap leading-4 text-primary tracking-wider">
              <span @click="showMail" :class="{ 'border-primary border-b-4': voirExempleMail }" class="mx-2 inline-block cursor-pointer text-base uppercase font-bold"> Exemplaire de rapport </span>
            </th>

            <th class="pb-0 hover:bg-gray-200 text-left whitespace-nowrap leading-4 text-primary tracking-wider">
              <span @click="showHistory" :class="{ 'border-primary border-b-4': voirHistorique }" class="mx-2 inline-block cursor-pointer text-base uppercase font-bold"> Historique d'envoie </span>
            </th>
          </tr>
        </thead>
      </table>
      <!-- fin header -->

      <table class="w-full border-t border-gray-200">
        <!--Il s'agit d'un tableau decomposé alors filter vos donnée avant de 'integretrer par bailleur' -->

        <tbody v-if="voirExempleMail" class="bg-white" id="table1">
          <!--Specifier le nombre de ligne +1 de la table -->

          <tr v-for="(rapport, index) in rapports" :key="index" :class="{ 'bg-white': voirHistorique }" class="border-b border-gray-200 hover:shadow hover:bg-gray-50" title="Cliquer pour voir" v-title>
            <td class="p-3 whitespace-no-wrap text-xs" ref="mail" @click="useRapport(rapport.rapport, index)">
              {{ rapport.nom }}
            </td>
            <td class="flex items-center justify-center">
              <span class="mr-2 cursor-pointer transform hover:text-blue-500 hover:scale-110" title="modifier le rapport" v-title @click="editRapport(rapport)">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                </svg>
              </span>

              <span @click="deleteRapport(rapport.id)" class="mr-2 cursor-pointer transform hover:text-red-500 hover:scale-110" title="supprimer" v-title>
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
                </svg>
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <table v-if="voirHistorique" class="w-full">
        <tbody class="bg-white">
          <!--Specifier le nombre de ligne +1 de la table -->
          <tr v-for="(email, index2) in emails" :key="index2" class="border-b bg-white border-gray-200 hover:shadow hover:bg-gray-50">
            <td class="p-3 whitespace-no-wrap text-xs" @click="showModalRapport(emai, index2)">Objet : {{ email.objet }}</td>
            <!-- <div v-html="email.rapport" @click="showModalRapport(email, index2)" style="display: none;"> </div> -->

            <td class="p-3 whitespace-no-wrap text-xs" @click="showModalRapport(email, index2)">Enyoyé à : {{ email.destinataires }}</td>

            <td>
              <VButton label="Générer pdf " @click="generatePDF(email.rapport)" />
              <!-- <button title="générer pdf" v-title class="h-auto py-1 px-2 space-x-1 text-xs font-semibold text-white uppercase bg-primary focus:outline-none focus:shadow-outline" @click="generateReport(index2, email.rapport)">
                <span class="mx-2 text-sm font-semibold">generer pdf </span>
              </button> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- fin tableau -->
  </div>
</template>

<script>
//add import

import ProgrammeService from "@/services/modules/programme.service.js";
import InputForm from "@/components/news/InputForm.vue";
import VButton from "@/components/news/VButton.vue";
import html2pdf from "html2pdf.js";
import { toast } from "vue3-toastify";
import { helper as $h } from "@/utils/helper";

//import ExportPdf from '@ckeditor/ckeditor5-export-pdf/src/exportpdf';

export default {
  components: {
    InputForm,
    VButton,
  },
  data() {
    return {
      savedInput: [],
      chargement: false,
      chargement2: false,
      chargement3: false,
      showModal: false,
      showSendMail: false,
      showRapport: false,
      update: false,
      Update: false,
      title: "",
      nom: "",
      objet: "",
      bcc: "",
      rapport: "",
      objetRapport: "",
      users: [],

      rapports: [],
      emails: [],
      // editor: ClassicEditor,
      editorData: "Contenu du rapport",
      // editorConfig: {
      //   // The configuration of the editor.
      // },
      voirExempleMail: true,
      voirHistorique: false,
      selectMail: false,
      rapportId: "",
      edit: {
        nom: "",
        Data: "",
        id: "",
      },
      selectedFile: null,
      FormRapport: new FormData(),
    };
  },
  computed: {},
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;

        // Créer une prévisualisation de l'image
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file); // Lire le fichier en tant qu'URL de données
      }
    },
    modalMail() {
      this.showSendMail = true;
      this.chargement2 = false;
    },

    getRapports() {
      ProgrammeService.rapports()
        .then((data) => {
          this.rapports = data.data.data;
        })
        .catch((error) => {
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
            //console.log('dernier message', error.message);
          }
        });
    },
    generatePDF(content) {
      const options = {
        margin: 1,
        filename: "rapport.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      html2pdf().set(options).from(content).save();
    },

    generateReport(data, content) {
      console.log(content);
      document.getElementById(data).innerHTML = content;
      this.$refs.element[data].generatePdf();
    },

    showMail() {
      this.voirExempleMail = true;

      this.voirHistorique = false;
    },

    showHistory() {
      this.voirExempleMail = false;

      this.voirHistorique = true;
    },

    getEmails() {
      ProgrammeService.emailRapports()
        .then((data) => {
          this.emails = data.data.data;
        })
        .catch((error) => {
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
            //console.log('dernier message', error.message);
          }
        });
    },

    saveRapport() {
      var form = {
        nom: this.nom,
        rapport: this.editorData,
      };

      ProgrammeService.rapport(form)
        .then((data) => {
          this.chargement = false;
          toast.success("nouveau element ajouté");
          this.resetFileInput();
          $h.clearFormData(this.FormRapport);
          this.nom = "";
          this.editorData = "";
          // this.messageErreur = {};
          this.getRapports();
        })
        .catch((error) => {
          this.chargement = false;

          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          }
        });
    },
    resetFileInput() {
      // Réinitialiser le champ de fichier
      this.selectedFile = null; // Réinitialiser la variable selectedFile
    },

    sendRapport() {
      if (this.chargement2 == false) {
        this.chargement2 = true;

        this.users = this.bcc.split(",").map((email) => email.trim());

        

        var form = {
          objet: this.objet,
          destinataires: this.users,
          rapport: this.Update ? this.edit.Data : this.editorData,
        };

        console.log("form", form);
        //edit.Data

        for (const key of Array.from(this.FormRapport.keys())) {
          this.FormRapport.delete(key);
        }

        $h.ajouterObjetDansFormData(form, this.FormRapport);

        if (this.selectedFile) {
          this.FormRapport.append("fichier[]", this.selectedFile);
        }

        // Ajouter manuellement le tableau `sites` à FormData
        if (form.destinataires && Array.isArray(form.destinataires)) {
          form.destinataires.forEach((destinataire, index) => {
            this.FormRapport.append(`destinataires[${index}]`, destinataire);
          });
        }

        ProgrammeService.sendMailRapport(this.FormRapport)
          .then((data) => {
            this.chargement2 = false;
            toast.success("Email envoyé");
            this.emails = data.data.data;
            this.showSendMail = false;
            this.resetFileInput();
            $h.clearFormData(this.FormRapport);
            $h.clearObjectValues(form);
            // this.messageErreur = {};
          })
          .catch((error) => {
            this.chargement2 = false;

            if (error.response) {
              // Requête effectuée mais le serveur a répondu par une erreur.
              const message = error.response.data.message;
              toast.error(message);
            } else if (error.request) {
              // Demande effectuée mais aucune réponse n'est reçue du serveur.
              //console.log(error.request);
            }
          });
      }
    },

    useRapport(data, index) {
      this.editorData = data;
      for (var i = 0; i < this.rapports.length; i++) {
        if (i == index) {
          this.$refs.mail[index].style.backgroundColor = "#8400ffa4";
        } else {
          this.$refs.mail[i].style.backgroundColor = "#ffffff";
        }
      }
    },

    showModalRapport(data, index2) {
      this.rapportId = index2;
      this.rapport = data;

      console.log(data);
      this.showRapport = true;
      // console.log(this.$refs.modalRapport)

      // this.$refs.modalRapport[index2].innerHTML = data
    },

    editRapport(data) {
      this.Update = true;
      console.log(data);
      this.edit.nom = data.nom;
      this.edit.Data = data.rapport;
      this.edit.id = data.id;
    },

    saveEditRapport() {
      if (this.chargement3 == false) {
        this.chargement3 = true;

        var form = {
          nom: this.edit.nom,
          rapport: this.edit.Data,
        };
        ProgrammeService.updateRapports(this.edit.id, form)
          .then((data) => {
            this.chargement3 = false;
            toast.success("element modifié avec success");

            this.Update = false;
            this.getRapports();
          })
          .catch((error) => {
            this.chargement3 = false;

            if (error.response) {
              // Requête effectuée mais le serveur a répondu par une erreur.
              const message = error.response.data.message;
              toast.error(message);
            } else if (error.request) {
              // Demande effectuée mais aucune réponse n'est reçue du serveur.
              //console.log(error.request);
            }
          });
      }
    },
    deleteRapport(data) {
      ProgrammeService.deleteRapport(data)
        .then((data) => {
          toast.success("element supprimé avec success");
          this.getRapports();
        })
        .catch((error) => {
          toast.error("erreur suppression");
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          }
        });
    },
  },

  created() {
    this.getRapports();

    this.getEmails();
  },
};
</script>

<style></style>
