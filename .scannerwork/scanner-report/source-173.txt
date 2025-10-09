import {
  FIND as findUtilisateur
} from "../../mutations.type";

export default {

  getUtilisateurs : state => {

      return state.lists

        ? state.lists

        : localStorage.getItem('utilisateurs') 
              
        ? state.lists = JSON.parse(localStorage.getItem('utilisateurs'))
        
        : []
  },

  getUtilisateur : state => {
      return state.utilisateur;
  },

  getTotal : state => {
      return this.getUtilisateurs(state).length;
  },

  [findUtilisateur] : state => ({key, value}) => {
    return this.getUtilisateurs(state).find(item => item[key] === value);
  }
}