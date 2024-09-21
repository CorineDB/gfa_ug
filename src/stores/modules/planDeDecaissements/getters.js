import {
  FIND as findPlanDeDecaissement
} from "@/store/mutations.type";

export default {

  getPlanDeDecaissements : state => {

      return state.lists

              ? state.lists

              : localStorage.getItem('') 
              
              ? state.lists = JSON.parse(localStorage.getItem('plan-de-decaissements'))

              : []
  },

  getPlanDeDecaissement : state => {
      return state.planDeDecaissement;
  },

  getTotal : state => {
      return this.getPlanDeDecaissements(state).length;
  },

  [findPlanDeDecaissement] : state => ({key, value}) => {
      return this.getPlanDeDecaissements(state).find(item => item[key] === value);
  }
}