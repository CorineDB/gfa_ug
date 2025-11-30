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
              <!-- <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreurs.objet">{{ $h.extractContentFromArray(messageErreurs.objet) }}</p> -->
            </div>

            <!-- <pre>Edit data {{ edit.Data }}</pre> -->

            <div class="form-group my-2">
              <InputForm label="Destinataire" class="flex-1" v-model="bcc" type="email" multiple />
              <!-- <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreurs.destinataires">{{ $h.extractContentFromArray(messageErreurs.destinaires) }}</p> -->
            </div>
            <!-- <pre>{{ Update }}</pre> -->
            <div class="form-group my-2">
              <InputForm class="col-span-12" type="file" :key="fileInputKey" @change="handleFileChange" required="required" placeHolder="choisir un fichier" label="Fichiers" />
              <!-- <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreurs.rapport">{{ $h.extractContentFromArray(messageErreurs.rapport) }}</p> -->
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
            <InputForm 
              id="titre_rapport"
              name="nom"
              label="Titre du rapport" 
              class="flex-1" 
              v-model="nom" 
              type="text" 
            />
          </div>

          <div class="form-group my-2">
            <label class="text-xs font-semibold" for="contenu_rapport">Contenu du rapport</label>
            <ClassicEditor 
              id="contenu_rapport"
              v-model="editorData" 
            />
          </div>
          <div class="py-2 my-4 flex gap-4">
            <button
              type="submit"
              class="w-1/2 btn btn-primary px-4 py-2"
              :disabled="chargement"
              id="enregistrer_rapport"
            >
              {{ chargement ? 'Enrégistrer...' : 'Enrégistrer' }}
            </button>
            <button type="button" class="w-1/2 btn btn-primary px-4 py-2" :disabled="!editorData || !nom" @click="modalMail()">Envoyer par mail</button>

          </div>

        </form>

      <div class="px-5 pb-5 flex justify-end">
      </div>
    </div>

    <div v-else class="p-4 col-span-12">
      <h1 class="text-xl font-bold">Modification de rapport</h1>
       <form action="" @submit.prevent="saveEditRapport" class="p-5 w-full">
          <div class="form-group my-2">
            <InputForm 
              id="titre_rapport_edit"
              name="nom"
              label="Titre du rapport" 
              class="flex-1" 
              v-model="edit.nom" 
              type="text" 
            />
          </div>

          <div class="form-group my-2">
            <label class="text-xs font-semibold" for="contenu_rapport_edit">Contenu du rapport</label>
            <ClassicEditor 
              id="contenu_rapport_edit"
              v-model="edit.Data" 
            />
          </div>
          <div class="py-2 my-4 flex justify-end space-x-8">
            <VButton 
              :loading="chargement3" 
              label="Enrégistrer" 
              type="submit"
              id="enregistrer_rapport_edit"
            />

            <VButton 
              @click="modalMail()" 
              label="Envoyer par mail" 
              id="envoyer_mail_rapport"
            />
          </div>
        </form>
    </div>

    <!-- fin formulaire -->

    <!-- tableau -->

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- header -->
      <div class="border-b border-gray-200 bg-gray-50">
        <div class="flex">
          <button
            @click="showMail"
            :class="{ 'border-b-2 border-primary bg-white': voirExempleMail, 'hover:bg-gray-100': !voirExempleMail }"
            class="px-6 py-4 text-sm font-medium text-gray-700 transition-colors duration-200 focus:outline-none"
          >
            Exemplaire de rapport
          </button>
          <button
            @click="showHistory"
            :class="{ 'border-b-2 border-primary bg-white': voirHistorique, 'hover:bg-gray-100': !voirHistorique }"
            class="px-6 py-4 text-sm font-medium text-gray-700 transition-colors duration-200 focus:outline-none"
          >
            Historique d'envoi
          </button>
        </div>
      </div>
      <!-- fin header -->

      <!-- Contenu des rapports -->
      <div v-if="voirExempleMail" class="divide-y divide-gray-200">
        <div v-if="rapports.length === 0" class="p-8 text-center text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-2">Aucun rapport disponible</p>
        </div>

        <div v-for="(rapport, index) in rapports" :key="index" class="p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer" @click="useRapport(rapport.rapport, index)">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ rapport.nom }}</p>
                <p class="text-sm text-gray-500">Cliquer pour prévisualiser</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click.stop="editRapport(rapport)"
                class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                title="Modifier le rapport"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click.stop="deleteRapport(rapport.id)"
                class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-150"
                title="Supprimer"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu de l'historique -->
      <div v-if="voirHistorique" class="divide-y divide-gray-200">
        <div v-if="emails.length === 0" class="p-8 text-center text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p class="mt-2">Aucun email envoyé</p>
        </div>

        <div v-for="(email, index2) in emails" :key="index2" class="p-4 hover:bg-gray-50 transition-colors duration-150">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 flex-1 cursor-pointer" @click="showModalRapport(email, index2)">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  Objet: {{ email.objet }}
                </p>
                <p class="text-sm text-gray-500 truncate">
                  Envoyé à: {{ email.destinataires }}
                </p>
              </div>
            </div>
            <div class="ml-4">
              <button
                @click="generatePDF(email)"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
              >
                <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Générer PDF
              </button>
            </div>
          </div>
        </div>
      </div>
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
import logo1 from "@/assets/images/logo3.webp";

//import ExportPdf from '@ckeditor/ckeditor5-export-pdf/src/exportpdf';

export default {
  components: {
    InputForm,
    VButton,
  },
  data() {
    return {
      messageErreurs: {},
      savedInput: [],
      chargement: false,
      chargement3: false,
      isLoading: false,
      showModal: false,
      showSendMail: false,
      showRapport: false,
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
      editorData: "",
      // editorConfig: {
      //   // The configuration of the editor.
      // },
      voirExempleMail: true,
      voirHistorique: false,
      selectMail: false,
      rapportId: "",
      contenueModifie: "",
      edit: {
        nom: "",
        Data: "",
        id: "",
      },
      selectedFile: null,
      FormRapport: new FormData(),
      fileInputKey: 0,
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
      if (this.Update) {
        this.saveEditRapport();
      }  else {
        this.saveRapport();
      }

      this.showSendMail = true;
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
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
          }
        });
    },
    formatRapportForPDF(rapportData) {
      // Déterminer si c'est un objet complet ou juste du contenu HTML
      const isFullObject = typeof rapportData === 'object' && rapportData !== null;
      const objet = isFullObject ? rapportData.objet : 'Rapport';
      const contenu = isFullObject ? rapportData.rapport : rapportData;
      const date = isFullObject && rapportData.created_at
        ? new Date(rapportData.created_at).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
      const destinataires = isFullObject ? rapportData.destinataires : '';

      return `
        <div style="font-family: Arial, sans-serif; max-width: 210mm; margin: 0 auto; background: white; color: #000;">
          <!-- En-tête avec logo -->
          <div style="background: linear-gradient(135deg, #0f3460 0%, #1a4d7a 100%); padding: 15px 20px; margin-bottom: 25px;">
            <div style="display: flex; align-items: center; gap: 15px;">
              <img src="${logo1}" alt="Logo Programme" style="height: 45px; width: auto; object-fit: contain;" />
              <h2 style="margin: 0; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: white; flex: 1;">
                Programme Redevabilité Phase 3
              </h2>
            </div>
          </div>

          <!-- Informations du rapport -->
          <div style="border-left: 4px solid #0f3460; padding: 15px 20px; margin: 0 20px 30px 20px; background: #f8f9fa;">
            <h1 style="color: #0f3460; font-size: 24px; margin: 0 0 15px 0; font-weight: bold;">
              ${objet}
            </h1>
            <div style="color: #495057; font-size: 13px; line-height: 1.8;">
              <p style="margin: 5px 0;">
                <strong style="color: #0f3460;">Date de génération:</strong> ${date}
              </p>
              ${destinataires ? `
                <p style="margin: 5px 0;">
                  <strong style="color: #0f3460;">Destinataires:</strong> ${destinataires}
                </p>
              ` : ''}
            </div>
          </div>

          <!-- Contenu du rapport -->
          <div style="padding: 0 20px; line-height: 1.8; color: #212529;">
            ${contenu}
          </div>

          <!-- Pied de page -->
          <div style="margin-top: 50px; padding: 20px; background: #0f3460; color: white; text-align: center; font-size: 11px;">
            <p style="margin: 5px 0; font-weight: 600;">Programme Redevabilité Phase 3</p>
            <p style="margin: 5px 0; opacity: 0.9;">Document généré automatiquement - ${date}</p>
            <p style="margin: 5px 0; opacity: 0.8;">© ${new Date().getFullYear()} - Tous droits réservés</p>
          </div>
        </div>
      `;
    },

    generatePDF(content) {
      // Formater le contenu avec les métadonnées
      const formattedContent = this.formatRapportForPDF(content);

      // Créer un conteneur temporaire pour le contenu du PDF
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        padding: 20px;
        background: white;
        font-family: Arial, sans-serif;
        color: #000;
        line-height: 1.6;
      `;
      wrapper.innerHTML = formattedContent;

      // Appliquer des styles aux images pour qu'elles s'adaptent bien
      const images = wrapper.querySelectorAll('img');
      images.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '10px auto';
      });

      // Appliquer des styles aux tableaux
      const tables = wrapper.querySelectorAll('table');
      tables.forEach(table => {
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';
        table.style.marginBottom = '15px';
        table.style.border = '1px solid #E5E7EB';

        // Styliser les cellules
        const cells = table.querySelectorAll('td, th');
        cells.forEach(cell => {
          cell.style.border = '1px solid #E5E7EB';
          cell.style.padding = '8px';
        });

        // Styliser les en-têtes
        const headers = table.querySelectorAll('th');
        headers.forEach(th => {
          th.style.backgroundColor = '#F3F4F6';
          th.style.fontWeight = 'bold';
        });
      });

      // Appliquer des styles aux listes
      const lists = wrapper.querySelectorAll('ul, ol');
      lists.forEach(list => {
        list.style.marginLeft = '20px';
        list.style.marginBottom = '15px';
      });

      // Appliquer des styles aux paragraphes
      const paragraphs = wrapper.querySelectorAll('p');
      paragraphs.forEach(p => {
        p.style.marginBottom = '10px';
        p.style.textAlign = 'justify';
      });

      // Générer un nom de fichier basé sur l'objet si disponible
      let filename = 'rapport';
      if (typeof content === 'object' && content.objet) {
        filename = content.objet
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }
      filename = `${filename}_${new Date().toISOString().split('T')[0]}.pdf`;

      const options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: filename,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          backgroundColor: '#ffffff'
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
          compress: true
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after'
        }
      };

      // Générer et télécharger le PDF
      html2pdf()
        .set(options)
        .from(wrapper)
        .save()
        .then(() => {
          toast.success("PDF généré avec succès");
        })
        .catch((error) => {
          toast.error("Erreur lors de la génération du PDF");
        });
    },

    generateReport(data, content) {
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
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
          }
        });
    },

    saveRapport() {
      var form = {
        nom: this.nom,
        rapport: this.editorData,
      };

      this.contenueModifie = this.editorData;

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
          }
        });
    },
    resetFileInput() {
      // Réinitialiser le champ de fichier
      this.selectedFile = null; // Réinitialiser la variable selectedFile
      this.fileInputKey++; // Forcer le re-rendu de l'input file
    },

    sendRapport() {

      
      if (!this.isLoading) {
        this.isLoading = true;

        this.users = this.bcc.split(",").map((email) => email.trim());

        var form = {
          objet: this.objet,
          destinataires: this.users,
          rapport: this.contenueModifie,
        };

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

        this.isLoading = true;

        ProgrammeService.sendMailRapport(this.FormRapport)
          .then((data) => {
            toast.success("Email envoyé");
            this.emails = data.data.data;
            this.isLoading = false;
            this.showSendMail = false;
            this.resetFileInput();
            $h.clearFormData(this.FormRapport);
            $h.clearObjectValues(form);
            this.objet = "";
            this.bcc = "";
            // this.messageErreur = {};
          })
          .catch((errors) => {
            this.isLoading = false;

            if (errors.response && errors.response.data && errors.response.data.errors) {
              const errorList = errors.response.data.errors;
              
              // Afficher chaque message d'erreur retourné par l'API
              Object.keys(errorList).forEach(key => {
                const messages = errorList[key];
                if (Array.isArray(messages)) {
                  messages.forEach(msg => toast.error(msg));
                } else {
                  toast.error(messages);
                }
              });

              this.messageErreurs = errorList;
            } else if (errors.response && errors.response.data && errors.response.data.message) {
              toast.error(errors.response.data.message);
            } else {
              toast.error("Une erreur inattendue s'est produite");
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

      this.showRapport = true;

      // this.$refs.modalRapport[index2].innerHTML = data
    },

    editRapport(data) {
      this.Update = true;
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

        this.contenueModifie = this.edit.Data;

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
