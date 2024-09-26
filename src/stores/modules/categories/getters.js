import {
  FIND as findCategorie
} from "../../mutations.type";

export default {

  getCategories : state => {

      return state.lists

              ? state.lists

              : localStorage.getItem('categories') 
              
              ? state.lists = JSON.parse(localStorage.getItem('categories'))

              : []
  },

  getCategorie : state => {
      return state.categorie;
  },

  getTotal : state => {
      return this.getCategories(state).length;
  },

  [findCategorie] : state => ({key, value}) => {
      return this.getCategories(state).find(item => item[key] === value);
  }
}