import {
  FIND as findIndicateur
} from "../../mutations.type";

export default {

  getIndicateurs : state => {

      return state.lists

              ? state.lists

              : localStorage.getItem('indicateurs-mod') 
              
              ? state.lists = JSON.parse(localStorage.getItem('indicateurs-mod'))

              : []
  },

  getIndicateur : state => {
      return state.indicateur;
  },

  getTotal : state => {
      return this.getIndicateurs(state).length;
  },

  [findIndicateur] : state => ({key, value}) => {
      return this.getIndicateurs(state).find(item => item[key] === value);
  }
}