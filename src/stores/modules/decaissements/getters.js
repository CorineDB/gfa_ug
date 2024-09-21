import {
  FIND as findDecaisement
} from "@/store/mutations.type";

export default {

  getDecaissements : state => {

      return state.lists

              ? state.lists

              : localStorage.getItem('') 
              
              ? state.lists = JSON.parse(localStorage.getItem('decaissements'))

              : []
  },

  getDecaissement : state => {
      return state.decaissement;
  },

  getTotal : state => {
      return this.getDecaissements(state).length;
  },

  [findDecaisement] : state => ({key, value}) => {
      return this.getDecaissements(state).find(item => item[key] === value);
  }
}