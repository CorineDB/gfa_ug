import {
  FIND as findRole
} from "../../mutations.type";

export default {

  getRoles : state => {

      return state.lists

              ? state.lists

              : localStorage.getItem('roles') 
              
              ? state.lists = JSON.parse(localStorage.getItem('roles'))

              : []
  },

  getRole : state => {
      return state.role;
  },

  getTotal : state => {
      return this.getRoles(state).length;
  },

  [findRole] : state => ({key, value}) => {
      return this.getRoles(state).find(item => item[key] === value);
  }
}