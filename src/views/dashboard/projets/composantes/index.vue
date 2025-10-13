<template>
  
</template>

<script>

import { mapGetters, mapActions } from "vuex";

import { getStringValueOfStatutCode } from '@/utils/index'
import ProjetService from "@/services/modules/projet.service.js";
import ComposantesService from '@/services/modules/composante.service';
export default {
  components: {
    
  },
  data() {
    return {
      currentPage: true,
      version: 'current',
      composanteVisible: false,
      version: "",
      scopes: [],
      currentRole: '',
      composantes: [],
      idProjet: ''
    }
  },
  computed: {
    ...mapGetters('auths', { currentUser: 'GET_AUTHENTICATE_USER' })
  },

  methods: {

    active() {
      this.$store.dispatch('active')
    },
    disabled() {
      this.$store.dispatch('disabled')
    },
    validation(data) {
      const id = data.id
      const datas = {
        statut: -1,
        projetId: this.idProjet
      }
      ComposantesService.update(id, datas).then(() => {
        this.$toast.success('validation effectué')

      }).catch((error) => {
        if (error.response) {
          // Requête effectuée mais le serveur a répondu par une erreur.
          const message = error.response.data.message
          this.$toast.error(message)
        } else if (error.request) {
          // Demande effectuée mais aucune réponse n'est reçue du serveur.
        } else {
          // Une erreur s'est produite lors de la configuration de la demande
        }

      })
    },
    getComposante(id) {
      this.active()
      ProjetService.composantes(id).then((data) => {
        const datas = data.data.data
        this.composantes = datas
        this.disabled()
      }).catch((e) => {
        this.disabled()
      })
    },

    getStatus(status) {
      return getStringValueOfStatutCode(status);
    },

    ...mapActions("revisionPtab", {
      fetchProgrammeScopes: "FETCH_PROGRAMME_SCOPES"
    }),

    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        if (element.slug === 'voir-une-composante') {
          this.composanteVisible = true
        }
      });
    },

    choiceVersion(version) {
      if (this.scopes.length > 0) {
        if ("" === version) {
          this.currentPage = true;
        } else {
          this.currentPage = false;
        }
      } else {
        this.currentPage = true;
      }
    },
  },

  created() {

    if (this.currentUser.programme.id) {
      this.currentRole = this.currentUser.type
      const bailleurInfo = JSON.parse(localStorage.getItem("bailleurInfo"));
      if (bailleurInfo) {
        const idProjet = bailleurInfo.id
        this.idProjet = idProjet
        this.getComposante(idProjet)
      } else {
        this.fetchProgrammeScopes(this.currentUser.programme.id).then((response) => {
          this.scopes = response.data.data
        });
      }

    }
  },
  mounted() {
    this.getPermission()
  }
};
</script>

<style>

</style>
