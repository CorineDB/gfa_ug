import {
  FIND as findAno
} from "../../mutations.type";

export default {

  getAnos : state => {

      return state.lists

              ? state.lists

              : localStorage.getItem('anos') 
              
              ? state.lists = JSON.parse(localStorage.getItem('anos'))

              : []
  },

  getAno : state => {
      return state.activite;
  },

  getTotal : state => {
      return this.getAnos(state).length;
  },

  [findAno] : state => ({key, value}) => {
      return this.getAnos(state).find(item => item[key] === value);
  }
}