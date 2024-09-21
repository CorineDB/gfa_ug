import {
  FIND as findSuivi
} from "@/store/mutations.type";

export default {

  getSuivis : state => {

      return state.lists

        ? state.lists

       : localStorage.getItem('suivi-indicateurs') 
              
       ? state.lists = JSON.parse(localStorage.getItem('suivi-indicateurs'))

       : []
  },

  getSuivi : state => {
      return state.suivi;
  },

  getTotal : state => {
      return this.getSuivis(state).length;
  },

  [findSuivi] : state => ({key, value}) => {
      return this.getSuivis(state).find(item => item[key] === value);
  }
}