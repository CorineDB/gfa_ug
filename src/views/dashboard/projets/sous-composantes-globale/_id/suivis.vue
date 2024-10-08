<template>
 

</template>

<script>

import { mapGetters, mapMutations, mapActions } from "vuex";
import extractFormData from "@/utils/extract-data";
import ComposanteService from "@/services/modules/composante.service.js";
export default {
  components: {
   
  },
  data() {
      return ({
        showModal2:false,
       
        champsRecherche:[
          {name:'Date de suivi',type:'date',placeholdere:"",isSelect:false,isTextArea:false,data:'',required:false,},
        ],
        cols:2,
        title:'',
        headers:[
          {name:'BN',cle:'bn',props:'valeurCible',width:"w-28"},
          {name:'Pret',cle:'pret',width:"w-28"},
          {name:'Poids',cle:'poids',width:"w-28"},
          {name:'Date de creation',cle:'created_at',width:"w-24"},
        ],
        taches: [
          {bn:'200000000000',pret:'200000000',poids:"20",created_at:'10-08-2022'},
          {bn:'200000000000',pret:'200000000',poids:"20",created_at:'10-08-2022'},
          {bn:'200000000000',pret:'200000000',poids:"20",created_at:'10-08-2022'},
          {bn:'200000000000',pret:'200000000',poids:"20",created_at:'10-08-2022'},
          {bn:'200000000000',pret:'200000000',poids:"20",created_at:'10-08-2022'},
          {bn:'200000000000',pret:'200000000',poids:"20",created_at:'10-08-2022'},
          {bn:'200000000000',pret:'200000000',poids:"20",created_at:'10-08-2022'},
        ]
      });
  },
 
  computed: {
   
    
  },
  
  methods: {
    getSuivi() {
      ComposanteService.mySuivis().then((data) => {
        this.suivis = data.data.data
        console.log('mes suivis',this.suivis)
      }).catch((e) => {
        console.log(e)
      })
    },
  },
  mounted() {
   
  },
}
</script>

<style scoped>

</style>