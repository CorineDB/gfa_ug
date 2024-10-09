<template>
  <main class="ml-64 p-6">
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-3xl font-bold">Nom du Projet</h2>
    <div>
      <button class="bg-blue-600 text-white px-4 py-2 rounded mx-2">Ajouter une tâche</button>
      <button class="bg-gray-200 px-4 py-2 rounded mx-2">Modifier projet</button>
      <button class="bg-gray-200 px-4 py-2 rounded mx-2">Partager</button>
    </div>
  </div>
  
  <section class="mb-8">
    <h3 class="text-xl font-semibold mb-4">Résumé du Projet</h3>
    <p class="text-gray-700">Ce projet a pour objectif de développer une plateforme web intuitive permettant aux utilisateurs de gérer leurs tâches efficacement. Le projet est actuellement en phase de développement avec une équipe de 5 personnes.</p>
  </section>
  
  <section>
    <h3 class="text-xl font-semibold mb-4">Tâches</h3>
    <table class="min-w-full bg-white">
      <thead>
        <tr class="w-full bg-gray-200 text-left">
          <th class="py-2 px-4">Tâche</th>
          <th class="py-2 px-4">Statut</th>
          <th class="py-2 px-4">Priorité</th>
          <th class="py-2 px-4">Assigné à</th>
          <th class="py-2 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b">
          <td class="py-2 px-4">Créer la maquette UI</td>
          <td class="py-2 px-4 text-green-600">En cours</td>
          <td class="py-2 px-4">Haute</td>
          <td class="py-2 px-4">Alice</td>
          <td class="py-2 px-4">
            <button class="bg-blue-500 text-white px-2 py-1 rounded">Détails</button>
            <button class="bg-red-500 text-white px-2 py-1 rounded">Supprimer</button>
          </td>
        </tr>
        <!-- Autres tâches -->
      </tbody>
    </table>
  </section>
</main>

<main class="p-6">
  <h2 class="text-3xl font-bold mb-6">Liste des Projets</h2>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Carte de projet -->
    <div class="bg-white shadow-lg rounded-lg p-4">
      <h3 class="text-xl font-bold mb-2">Nom du Projet A</h3>
      <p class="text-gray-700 mb-4">Résumé court du projet en quelques phrases, expliquant l'objectif et le statut actuel.</p>
      <div class="flex justify-between items-center">
        <span class="text-green-600 font-semibold">En cours</span>
        <button class="bg-blue-600 text-white px-4 py-2 rounded">Voir Détails</button>
      </div>
    </div>

    <!-- Autres projets (copie le div ci-dessus pour chaque projet) -->
    <div class="bg-white shadow-lg rounded-lg p-4">
      <h3 class="text-xl font-bold mb-2">Nom du Projet B</h3>
      <p class="text-gray-700 mb-4">Description du projet, avec le statut actuel et quelques détails.</p>
      <div class="flex justify-between items-center">
        <span class="text-red-600 font-semibold">En retard</span>
        <button class="bg-blue-600 text-white px-4 py-2 rounded">Voir Détails</button>
      </div>
    </div>
    
    <!-- Exemple pour un autre projet -->
    <div class="bg-white shadow-lg rounded-lg p-4">
      <h3 class="text-xl font-bold mb-2">Nom du Projet C</h3>
      <p class="text-gray-700 mb-4">Informations sur ce projet et son statut.</p>
      <div class="flex justify-between items-center">
        <span class="text-yellow-600 font-semibold">À venir</span>
        <button class="bg-blue-600 text-white px-4 py-2 rounded">Voir Détails</button>
      </div>
    </div>
  </div>
</main>

<main class="p-6">
  <!-- Titre et bouton Ajouter -->
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-3xl font-bold">Liste des Projets</h2>
    <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Ajouter un Projet</button>
  </div>
  
  <!-- Barre de recherche -->
  <div class="mb-6">
    <input 
      type="text" 
      placeholder="Rechercher un projet..." 
      class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
  
  <!-- Tableau des projets -->
  <table class="min-w-full bg-white border border-gray-300 shadow-lg">
    <thead class="bg-gray-100">
      <tr>
        <th class="py-2 px-4 border-b text-left">Nom du Projet</th>
        <th class="py-2 px-4 border-b text-left">Résumé</th>
        <th class="py-2 px-4 border-b text-left">Statut</th>
        <th class="py-2 px-4 border-b text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      <!-- Projet 1 -->
      <tr class="hover:bg-gray-50 transition">
        <td class="py-2 px-4 border-b">Nom du Projet A</td>
        <td class="py-2 px-4 border-b">Résumé court du projet A.</td>
        <td class="py-2 px-4 border-b text-green-600 font-semibold">En cours</td>
        <td class="py-2 px-4 border-b flex space-x-2">
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Modifier</button>
          <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">Supprimer</button>
        </td>
      </tr>
      <!-- Projet 2 -->
      <tr class="hover:bg-gray-50 transition">
        <td class="py-2 px-4 border-b">Nom du Projet B</td>
        <td class="py-2 px-4 border-b">Résumé court du projet B.</td>
        <td class="py-2 px-4 border-b text-red-600 font-semibold">En retard</td>
        <td class="py-2 px-4 border-b flex space-x-2">
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Modifier</button>
          <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">Supprimer</button>
        </td>
      </tr>
      <!-- Projet 3 -->
      <tr class="hover:bg-gray-50 transition">
        <td class="py-2 px-4 border-b">Nom du Projet C</td>
        <td class="py-2 px-4 border-b">Résumé court du projet C.</td>
        <td class="py-2 px-4 border-b text-yellow-600 font-semibold">À venir</td>
        <td class="py-2 px-4 border-b flex space-x-2">
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Modifier</button>
          <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">Supprimer</button>
        </td>
      </tr>
    </tbody>
  </table>
</main>


</template>

<script>
import ProgrammeService from "@/services/modules/programme.service.js";
import ProjetService from "@/services/modules/projet.service.js";
import BailleurService from "@/services/modules/bailleur.service";
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import { API_BASE_URL } from "@/services/configs/environment.js";
import { extractFormData } from '@/utils/index'

export default {
  components: {
   
  },
  data() {
    return {
      savedInput: [],
      base_url: API_BASE_URL,
      showModal: false,
      showSearch: false,
      line: false,
      dates: { fin: '' },
      isUpdate: false,
      submitText: "Enregistrer",
      cols: 1,
      mosaique: true,
      programmeId: this.currentUser?.programme?.id,
      showProlonger: false,
      chargement: false,
      projetId: '',
      title: '',
      search: "",
      projetAttributs: ['nom', 'description', 'debut', 'fin', 'objectifGlobaux', 'budgetNational', 'pret', 'couleur', 'ville', 'bailleurId', 'tauxEngagement'],
      projetAttributsUpdate: ['nom', 'description', 'debut', 'fin', 'objectifGlobaux', 'budgetNational', 'pret', 'couleur', 'ville', 'tauxEngagement'],
      champs: [],
      champsUpdate: [],
      option: [
        { name: "supprimer" },
        { name: "modifier" },
        { name: "prolonger" },
        /*  { name: "continuer" }, */
      ],
      optionUpdate: [
        { name: "modifier" },
        /*  { name: "continuer" }, */
      ],
      optionD: [
        { name: "supprimer" },
        /*  { name: "continuer" }, */
      ],
      projetId: '',
      projetVisible: false,
      projetAdd: false,
      projetDelete: false,
      projetUpdate: false,
      dashboardProjetVisible: false,
      bailleurVisible: false,
      validation: false,
      sendRequest: false,
      fichiers: [],
      image: {},
      projets: [],
      bailleurs: [],
      deleteData: {},
      deleteModal: false,

    }

  },

  computed: {

    //importation des variables du module auths
    ...mapState({
      identifiant: state => state.auths.identifiant,
      projet: state => state.projets.projet,
      loading: state => state.loading,
      errors: state => state.errors
    }),

    ...mapGetters({
      projet: "getProjet",
      //bailleurs: "bailleurs/getBailleurs",
      currentUser: 'auths/GET_AUTHENTICATE_USER'
    }),
    filteredProjet() {
      var self = this;
      return this.projets.filter(function (projet) {
        return projet.bailleur.sigle.toLowerCase().indexOf(self.search.toLowerCase()) >= 0 ||
          projet.nom.toLowerCase().indexOf(self.search.toLowerCase()) >= 0 ||
          projet.codePta.toLowerCase().indexOf(self.search.toLowerCase()) >= 0;
      });
    },

  },

  methods: {
    getFile(data) {
      this.champs[7].data = data
      for (const property in data) {
        this.fichiers.push(data[property])
      }
      this.fichiers.pop()
      this.fichiers.pop()


    },
    getImage(data) {
      this.champs[6].data = data
      this.image = data

    },
    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        if (element.slug === 'voir-un-projet') {
          this.projetVisible = true
        }
        if (element.slug === 'creer-un-projet') {
          this.projetAdd = true
        }
        if (element.slug === 'modifier-un-projet') {
          this.projetUpdate = true
        }
        if (element.slug === 'supprimer-un-projet') {
          this.projetDelete = true
        }
        if (element.slug === 'voir-details-projet') {
          this.dashboardProjetVisible = true
        }
        if (element.slug === 'voir-un-bailleur') {
          this.bailleurVisible = true
        }
        if (element.slug === 'validation') {
          this.validation = true
        }

      });
    },
    prolonger(projet) {
      this.projetId = projet.id
      this.showProlonger = true
    },
    gotoNext(projet, index) {
      const profondeurProjet = {
        isClick: true,
        position: index,
        id: projet.id
      }

      localStorage.setItem('profondeurProjet', JSON.stringify(profondeurProjet));
      this.$router.push({ name: 'dashboard_projets_composantes_globale' })
    },

    active() {
      this.$store.dispatch('active')
    },
    disabled() {
      this.$store.dispatch('disabled')
    },
    fetchProjets(programme) {
      this.active()
      ProgrammeService.projets(programme).then((data) => {
        const datas = data.data.data
        this.projets = datas
        this.disabled()
      }).catch((error) => {
        this.disabled()
        if (error.response) {
          // Requête effectuée mais le serveur a répondu par une erreur.
          const message = error.response.data.message
          this.$toast.error(message)
        } else if (error.request) {
          // Demande effectuée mais aucune réponse n'est reçue du serveur.
          //console.log(error.request);
        } else {
          // Une erreur s'est produite lors de la configuration de la demande
        }
      })
    },

    //Charger les fonctions de communication avec le serveur
    ...mapMutations({
      setErrors: 'SET_ERRORS_MESSAGE', // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setProjet: 'projets/FILL' // map `this.CREATE_INSTANCE_PROJET()` to `this.$store.commit('CREATE_INSTANCE_PROJET')`
    }),

    ...mapActions('projets', {

      saveProjet: "STORE_PROJET",
      prolongerDateProjet: "PROLONGER_DATE_PROJET",
      updateProjet: "UPDATE_PROJET",
      deleteProjet: "DESTROY_PROJET"
    }),

    // ...mapActions('bailleurs', { fetchBailleurs: 'FETCH_LIST_BAILLEUR_OF_PROGRAMME' }),

    gotoDetails(projet) {
      if (this.dashboardProjetVisible) {
        this.$router.push({ name: 'projets_id_details', params: { id: projet.id, projet: projet } })
      }
    },

    addDate() {
      this.dates.push({})
    },

   close () {
      this.showCloseModal()
      this.resetForm()
      this.sendRequest = false;
    },
    close2() {
      this.showCloseModal()
      this.sendRequest = false;
      this.savedInput = []
      for (let i = 0; i < this.champs.length; i++) {
        this.savedInput.push(this.champs[i].data)
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem('formData', parsed);

    },

    showCloseModal(value = false) {
      this.showModal = value
    },



    addProjet() {
      this.title = 'Ajouter'
      this.submitText = "Enregistrer"
      this.isUpdate = false
      let formData = this.champs.map((value) => {
        if (value.key === 'bailleurId') {
          value['options'] = this.bailleurs
        }

        else if (value.key === 'statut') {
          value['options'] = this.$store.state.statuts
        }

        return value

      })
      this.champs = formData

      this.showCloseModal(true)
    },

    modifierProjet(projet) {
      localStorage.removeItem('formData')
      this.isUpdate = true
      this.title = 'Modifier un projet'

      this.submitText = "Modifier"

      this.projetId = projet.id

      this.projetAttributsUpdate.forEach((item) => {

        this.champsUpdate.find((value, index) => {

          if (value.key !== 'statut') {
            if (value.key === item) {
              this.champsUpdate[index]['data'] = projet[item]
            }
          }

        })

      })

      this.showCloseModal(true)

    },


    async supprimerProjet(projet, index) {
      this.deleteModal = true
      this.deleteData.data = projet
      this.deleteData.index = index
    },
    deleteProjets(data) {
      this.filteredProjet.splice(data.index, 1)
      this.deleteModal = false
      ProjetService.destroy(data.data.id).then((data) => {
        this.$toast.success("Operation effectué avec success !")

      }).catch((error) => {

        if (error.response) {
          // Requête effectuée mais le serveur a répondu par une erreur.
          const message = error.response.data.message
          this.$toast.error(message)
        } else if (error.request) {
          // Demande effectuée mais aucune réponse n'est reçue du serveur.
          //console.log(error.request);
        } else {
          // Une erreur s'est produite lors de la configuration de la demande
        }
      })
    },

    saveProlongerDate() {

      this.chargement = true

      this.prolongerDateProjet({ projet: this.dates, id: this.projetId }).then(response => {

        if (response.status == 200 || response.status == 201) {

          this.showProlonger = false;

          this.fetchProjets(this.programmeId);
        }

      }).catch((error) => {
        alert(error.response?.data?.errors['fin']);
      })

      this.chargement = false
    },

    dupliquer() {
      this.title = "Dupliquer projet existant"
      this.showModal = true
    },


    resetForm() {

      this.champs = this.champs.map(item => { item.data = ''; return item })

      window.document.getElementById('vform').reset()

      this.setProjet({})
    },


    sendForm() {
      if (this.sendRequest === false) {
        this.sendRequest = true;

        this.champs = this.champs.map(item => { item.errors = []; return item })
        this.champsUpdate = this.champsUpdate.map(item => { item.errors = []; return item })
        let projet = {}
        if (this.isUpdate) {
          projet = extractFormData(this.champsUpdate, this.projetAttributsUpdate)
          projet.id = this.projetId
        } else {
          projet = extractFormData(this.champs, this.projetAttributs)
          projet.bailleurId = projet.bailleurId.id
        }

        projet.programmeId = this.programmeId



        if (projet?.id) {
          projet.statut = projet.statut
          this.updateProjet({ projet: projet, id: projet?.id }).then(response => {

            if (response.status == 200 || response.status == 201) {
              this.sendRequest = false;
              this.fetchProjets(this.programmeId)
              this.close()
            }

          }).catch((error) => {
            this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors })
            this.sendRequest = false;
            this.champs.map(value => value.errors = this.erreurs[value.key])
          })
        }
        else {
          this.sendRequest = true;
          projet.statut = -2
          const demo = {
            "nom": projet.nom,
            "description": projet.description,
            "debut": projet.debut,
            "fin": projet.fin, 
            "objectifGlobaux": projet.objectifGlobaux,
            "budgetNational": projet.budgetNational,
            "pret": projet.pret,
            "couleur": projet.couleur,
            "ville": projet.ville,
            "statut": -1,
            "bailleurId": projet.bailleurId,
            "programmeId": projet.programmeId,
            "id": ""
          }

          const formData = new FormData();
          formData.append('nom', demo.nom)
          formData.append('description', demo.description)
          formData.append('debut', demo.debut)
          formData.append('fin', demo.fin)
          formData.append('objectifGlobaux', demo.objectifGlobaux)
          formData.append('budgetNational', demo.budgetNational)
          formData.append('pret', demo.pret)
          formData.append('couleur', demo.couleur)
          formData.append('budgetNational', Number(demo.budgetNational))
          formData.append('pret', demo.pret)
          formData.append('couleur', demo.couleur)
          formData.append('ville', demo.ville)
          formData.append('statut', demo.statut)
          formData.append('image', this.image)
          for (let i = 0; i < this.fichiers.length; i++) {
            let file = this.fichiers[i];

            formData.append('fichier' + i, file);
          }

          formData.append('bailleurId', demo.bailleurId)
          formData.append('programmeId', demo.programmeId)

          this.saveProjet(formData).then(response => {
            if (response.status == 200 || response.status == 201) {
              this.close()
              this.resetForm()
              localStorage.removeItem('formData');
              this.fetchProjets(this.programmeId)
              this.sendRequest = false;
            }
          }).catch((error) => {


            this.sendRequest = false;


          })

        }
      }


    },

    validerProjet(id) {
      let projet = {}
      projet.statut = -1
      this.updateProjet({ projet: projet, id: id }).then(response => {

        if (response.status == 200 || response.status == 201) {
          this.$toast.success("projet valider")
          this.fetchProjets(this.programmeId)
        }

      }).catch((error) => {
        if (error.response) {
          // Requête effectuée mais le serveur a répondu par une erreur.
          const message = error.response.data.message
          this.$toast.error(message)
        } else if (error.request) {
          // Demande effectuée mais aucune réponse n'est reçue du serveur.
          //console.log(error.request);
        } else {
          // Une erreur s'est produite lors de la configuration de la demande
          //console.log('dernier message', error.message);
        }

      })


    },
    fetchBailleurs(programme) {

      BailleurService.bailleursOfProgramme(programme).then((data) => {
        const datas = data.data.data
        this.bailleurs = datas
        this.champs = [
          { name: 'Nom du projet', key: "nom", type: 'text', placeholdere: "Nom du projet", isSelect: false, isTextArea: false, data: '', required: true, title: "renseigner le nom du projet", errors: [] },
          { name: 'Prêt', type: 'number', key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Budget Nationnal', key: "budgetNational", type: 'number', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Date début', key: "debut", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, },
          { name: 'Date fin', type: 'date', key: "fin", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Couleur', type: 'color', key: "couleur", placeholdere: 'Choississez une couleur', isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'couverture du projet', type: 'file', placeholdere: 'Choississez une couverture', isImage: true, isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Pièce jointe', type: 'file', placeholdere: 'televerser des fichiers', isSelect: false, isImage: false, isTextArea: false, data: '', required: false, errors: [] },
          { name: 'Ville', key: "ville", type: '', placeholdere: 'Selectionnez une ville', isSelect: true, isTextArea: false, data: '', required: true, options: ['cotonou', 'calavi', 'bohicon'], isSimpleTable: true, errors: [] },
          { name: 'Bailleur', key: "bailleurId", type: '', placeholdere: 'Selectionnez un bailleur', isSelect: true, isTextArea: false, data: '', required: true, options: datas, cle: 'id', value: 'sigle', errors: [] },
          { name: 'Objectifs globaux', key: "objectifGlobaux", type: '', placeholdere: '', isSelect: false, isTextArea: true, data: '', required: false, errors: [] },
          { name: 'Objectifs specifiques', key: "objectifSpecifique", type: 'text', placeholdere: 'Definir les objectifs', isSelect: false, isTextArea: false, data: '', required: false, errors: [] },
          { name: 'Taux engagement', key: "tauxEngagement", type: 'text', placeholdere: 'Taux engagement', isSelect: false, isTextArea: false, data: '', required: false, errors: [] },
          { name: 'Description', type: '', key: "description", placeholdere: 'Description du projet', isSelect: false, isTextArea: true, data: '', required: false, errors: [] },

        ]
        this.champsUpdate = [
          { name: 'Nom du projet', key: "nom", type: 'text', placeholdere: "Nom du projet", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Prêt', type: 'text', key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Budget Nationnal', key: "budgetNational", type: 'text', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Date début', key: "debut", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, },
          { name: 'Date fin', type: 'date', key: "fin", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Couleur', type: 'color', key: "couleur", placeholdere: 'Choississez une couleur', isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
          { name: 'Ville', key: "ville", type: '', placeholdere: 'Selectionnez une ville', isSelect: true, isTextArea: false, data: '', required: true, options: ['cotonou', 'calavi', 'bohicon'], isSimpleTable: true, errors: [] },
          { name: 'Objectifs globaux', key: "objectifGlobaux", type: '', placeholdere: '', isSelect: false, isTextArea: true, data: '', required: false, errors: [] },
          { name: 'Objectif specifique', key: "objectifSpecifique", type: 'text', placeholdere: 'Definir les objectifs', isSelect: false, isTextArea: false, data: '', required: false, errors: [] },
          { name: 'Taux engagement', key: "tauxEngagement", type: 'text', placeholdere: 'Taux engagement', isSelect: false, isTextArea: false, data: '', required: false, errors: [] },
          { name: 'Description', type: '', key: "description", placeholdere: 'Description du projet', isSelect: false, isTextArea: true, data: '', required: false, errors: [] },

        ]

      }).catch((error) => {

      })
    },
  },

  watch: {
    loading: function (value) {
      //this.loading = value
    },

    errors: function (errors) {
      this.champs.forEach((value) => { value.errors = errors[value.key] })
    }

  },

  created() {

    this.getPermission()
    if (!this.projetVisible) {
      this.$router.push('/401-non-autorise')
    }
    this.programmeId = this.currentUser.programme.id
    if (this.programmeId) {
      if (this.bailleurVisible) {
        this.fetchBailleurs(this.programmeId)
        this.fetchProjets(this.programmeId)
      }
      else {
        this.fetchProjets(this.programmeId)
      }


    }
  }
}
</script>

<style scoped>
.icon-bold {
  font-weight: 800;
}
.dropdown-content{
  transform: translate(  200px, 200px);
}
.custom_height {
  height: 288px;
}

.block_img {
  height: 208px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
