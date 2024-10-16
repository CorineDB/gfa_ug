<template>
 


 
</template>

<script>
import PtabService from "@/services/modules/pta.service.js";
import BailleursService from "@/services/modules/bailleur.service.js";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  components: {},
  data() {
    return {
      tabPtab: [],
      annee: null,
    };
  },
  computed: {
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
  },

  methods: {
    getPta() {
      console.log(this.$router);
      let data = {};
      data = {
        organisationId: this.$route.params.ongId,
      };
    //   
    //   if (this.annee == null) {
    //     const year = new Date().getFullYear();
    //   } else {
    //     data = {
    //       programmeId: this.currentUser.programme.id,
    //       annee: Number(this.annee),
    //     };
    //   }
      PtabService.getOrganisationPta(data)
        .then((data) => {
          console.log(data);
          this.tabPtab = data.data.data[0];
        })
        .catch((error) => {
          console.log(error);
        });
         
    }
  },
  mounted() {
    this.getPta();
  },
};
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
