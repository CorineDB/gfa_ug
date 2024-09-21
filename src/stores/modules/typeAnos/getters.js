import {
  FIND as findTypeAno
} from "@/store/mutations.type";

export default {

  getTypeAnos : state => {

      return state.lists

              ? state.lists

              : localStorage.getItem('typeAnos') 
              
              ? state.lists = JSON.parse(localStorage.getItem('typeAnos'))

              : []
  },

  getTypeAno : state => {
      return state.activite;
  },

  getTotal : state => {
      return this.getTypeAnos(state).length;
  },

  [findTypeAno] : state => ({key, value}) => {
      return this.getTypeAnos(state).find(item => item[key] === value);
  }
}