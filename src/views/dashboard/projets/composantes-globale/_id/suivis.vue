<template>
  

</template>

<script>
// import ModalTopRight from '@/components/ModalTopRight'
// import SearchBar from '@/components/SearchBar'
// import Titre from '@/components/Titre'
// import Vtable from '@/components/Vtable'
// import Vform from '@/components/Vform'
// import Vmodal from '@/components/Vmodal'
// import Dashboard from '@/layouts/Dashboard'
// import ComposanteService from "@/services/modules/composante.service.js";

export default {
  components: {
    // Vtable,
    // Dashboard,
    // Vmodal,
    // Vform,
    // Titre,
    // SearchBar,
    // ModalTopRight
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
          { name: "Composante", cle: "composante"},
          { name: "code pta", cle: "codePta"},
          { name: "poids initial", cle:'poidsInitial'},
          { name: "poids actuel", cle:'poidsActuel'},
          { name: "date de creation", cle:'created_at'},
        ],
        composante:[],
        dataTable:[],
        suivis:[],
      });
  },
 
  computed: {
   
    
  },
  
  methods: {
    getSuivi() {
      ComposanteService.mySuivis(this.$route.params.id).then((data) => {
        const datas = data.data.data
         datas.forEach(element => {
          const composante = element.composante.nom
          const codePta = element.tache.codePta
          const poidsInitial = element.tache.poids
          const poidsActuel = element.poidsActuel
          const created_at = element.created_at
          this.dataTable.push({composante:composante,codePta:codePta,poidsInitial:poidsInitial,poidsActuel:poidsActuel,created_at:created_at})
        })
        console.log("les suiivs",this.dataTable)
      }).catch((e) => {
        console.log(e)
      })
    },
    currentTache() {
      ComposanteService.get(this.$route.params.id).then((data) => {
        this.composante= data.data.data
      }).catch((e) => {
        console.log(e)
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