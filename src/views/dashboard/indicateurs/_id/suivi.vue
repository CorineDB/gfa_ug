<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <!-- Titre général -->
    <h1 class="text-3xl font-bold text-blue-800 mb-6">Suivi de l'Indicateur</h1>

    <!-- Disposition en deux colonnes -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Colonne de gauche : Informations textuelles -->
      <div class="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-600">
        <h2 class="text-xl font-semibold text-blue-700 mb-4">INDICATEUR</h2>
        <p class="text-gray-700 mb-4">Indicateur 1: Nombre de personnes bénéficiant d'une amélioration des services essentiels (eau, assainissement, énergie, gestion des déchets)</p>

        <h3 class="text-lg font-semibold text-blue-600 mb-2">DESCRIPTION</h3>
        <p class="text-gray-600 mb-4">Personnes vivant mieux du fait de la construction des ouvrages</p>

        <h3 class="text-lg font-semibold text-blue-600 mb-2">BAILLEUR</h3>
        <p class="text-gray-600 mb-4">Agence Française de Développement</p>

        <h3 class="text-lg font-semibold text-blue-600 mb-2">CATEGORIE</h3>
        <p class="text-gray-600 mb-4">Indicateur d'Impact</p>

        <h3 class="text-lg font-semibold text-blue-600 mb-2">VALEUR DE BASE</h3>
        <p class="text-gray-600 mb-4">0</p>

        <h3 class="text-lg font-semibold text-blue-600 mb-2">UNITÉ DE MESURE</h3>
        <p class="text-gray-600">Km2</p>
      </div>

      <!-- Colonne de droite : Tableau avec défilement -->
      <div class="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-600 w-full overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead class="bg-blue-600 text-white">
            <tr>
              <th class="px-4 py-2 text-left">Valeur réalisé</th>
              <th class="px-4 py-2 text-left">Valeur cible</th>
              <th class="px-4 py-2 text-left">Écart</th>
              <th class="px-4 py-2 text-left">Valeur cumulée</th>
              <th class="px-4 py-2 text-left">Trimestre</th>
              <th class="px-4 py-2 text-left">Année suivi</th>
              <th class="px-4 py-2 text-left">Date de création</th>
            </tr>
          </thead>
          <tbody class="bg-gray-50 text-gray-700">
            <tr class="border-b">
              <td class="border px-4 py-2">55872</td>
              <td class="border px-4 py-2">25600</td>
              <td class="border px-4 py-2">30272</td>
              <td class="border px-4 py-2">25600</td>
              <td class="border px-4 py-2">3</td>
              <td class="border px-4 py-2">2023</td>
              <td class="border px-4 py-2">2023-09-26 04:31:41</td>
            </tr>
            <tr class="border-b">
              <td class="border px-4 py-2">0</td>
              <td class="border px-4 py-2">25600</td>
              <td class="border px-4 py-2">-25600</td>
              <td class="border px-4 py-2">25600</td>
              <td class="border px-4 py-2">1</td>
              <td class="border px-4 py-2">2023</td>
              <td class="border px-4 py-2">2023-03-06 02:59:06</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import IndicateurSuiviService from "@/services/modules/indicateur.suivi.service.js";
import IndicateurService from "@/services/modules/indicateur.service.js";

export default {
  components: {},
  data() {
    return {
      showModal2: false,
      champsRecherche: [{ name: "Date de suivi", type: "date", placeholdere: "", isSelect: false, isTextArea: false, data: "", required: false }],
      cols: 2,
      title: "",
      suivis: [],
      headers: [
        { name: "Valeur realisé", cle: "valeurRealise", edit: false },
        { name: "Valeur cible", cle: "valeurCible", edit: false },
        { name: "Ecart", cle: "valeurEcart", edit: false },
        { name: "Valeur cumulée", cle: "valeurCumul", edit: false },
        { name: "Trimestre", cle: "trimestre", edit: false },
        { name: "Année suivi", cle: "anneeSuivi", edit: false },
        { name: "date de creation", cle: "created_at", edit: false },
      ],
      indicateur: [],
      dataTable: [],
      suivis: [],
      search: "",
    };
  },

  methods: {
    active() {
      this.$store.dispatch("active");
    },
    disabled() {
      this.$store.dispatch("disabled");
    },
    getSuivi() {
      this.active();
      IndicateurSuiviService.mySuivis(this.$route.params.id)
        .then((data) => {
          const datas = data.data.data;
          datas.forEach((element) => {
            const valeurRealise = element.valeurRealise[0];
            const valeurCible = element.valeurCible.valeurCible[0];
            const valeurCumul = element.valeurCible.valeurCible[0];
            const trimestre = element.trimestre;
            const anneeSuivi = element.valeurCible.annee;
            const valeurEcart = valeurRealise - valeurCible;
            const created_at = element.created_at;
            this.dataTable.push({ valeurRealise: valeurRealise, valeurCible: valeurCible, valeurEcart: valeurEcart, valeurCumul: valeurCumul, trimestre: trimestre, anneeSuivi: anneeSuivi, created_at: created_at });
          });

          this.disabled();
        })
        .catch((error) => {
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            this.$toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
            //console.log('dernier message', error.message);
          }
          this.disabled();
        });
    },

    title_csv() {
      return "suivi-indicateur-" + this.indicateur.nom + "-" + new Date();
    },

    currentTache() {
      IndicateurService.get(this.$route.params.id)
        .then((data) => {
          this.indicateur = data.data.data;
        })
        .catch((error) => {
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            this.$toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
            //console.log('dernier message', error.message);
          }
        });
    },
  },
  computed: {
    json_data() {
      const data = [];
      if (this.dataTable != undefined || this.dataTable != null) {
        this.filteredSuivis.forEach((element) => {
          if (this.indicateur != undefined || this.indicateur != null) {
            const indicateurs = this.indicateur;
            const valeurRealise = element.valeurRealise;
            const valeurCible = element.valeurCible;
            const valeurCumul = "";
            const trimestre = element.trimestre;
            const annee_de_Suivi = element.anneeSuivi;
            const ecart = element.valeurEcart;
            const date_de_creation = element.created_at;
            const indicateur = indicateurs.nom;
            const bailleurs = indicateurs.bailleur.nom;
            const unitee_de_mesure = indicateurs.unitee_mesure.nom;
            const commentaire = "";
            data.push({ bailleurs, indicateur, unitee_de_mesure, valeurCible, valeurRealise, ecart, commentaire, date_de_creation });
          }
        });
        return data;
      }
    },
    filteredSuivis() {
      var self = this;
      return this.dataTable.filter(function (suivi) {
        return suivi.created_at.toLowerCase().indexOf(self.search.toLowerCase()) >= 0;
      });
    },
  },
  mounted() {
    this.currentTache();
    this.getSuivi();
  },
};
</script>

<style scoped></style>
