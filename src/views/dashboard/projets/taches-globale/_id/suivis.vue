<template>
</template>

<script>

import TacheService from "@/services/modules/tache.service.js";

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
        suivis:[],
        headers: [
          { name: "Tache", cle: "tache"},
          { name: "code pta", cle: "codePta"},
          { name: "poids initial", cle:'poidsInitial'},
          { name: "poids actuel", cle:'poidsActuel'},
          { name: "date de creation", cle:'created_at'},
        ],
        taches:[],
        dataTable:[],
        suivis:[],
      });
  },
 
  computed: {
   
    
  },
  
  methods: {
    getSuivi() {
      TacheService.mySuivis(this.$route.params.id).then((data) => {
        const datas = data.data.data
         datas.forEach(element => {
          const tache = element.tache.nom
          const codePta = element.tache.codePta
          const poidsInitial = element.tache.poids
          const poidsActuel = element.poidsActuel
          const created_at = element.created_at
          this.dataTable.push({tache:tache,codePta:codePta,poidsInitial:poidsInitial,poidsActuel:poidsActuel,created_at:created_at})
        })
      }).catch((e) => {
      })
    },
    currentTache() {
      TacheService.get(this.$route.params.id).then((data) => {
        this.taches= data.data.data
      }).catch((e) => {
      })
    }
  },
  mounted() {
    this.getSuivi()
    this.currentTache()
  },
}
</script>

<style scoped>

</style>