import {
  FIND as findSite
} from "@/store/mutations.type";

export default {

  getSites : state => {

      return state.lists

              ? state.lists

              : localStorage.getItem('sites') 
              
              ? state.lists = JSON.parse(localStorage.getItem('sites'))

              : []
  },

  getSite : state => {
      return state.site;
  },

  getTotal : state => {
      return this.getSites(state).length;
  },

  [findSite] : state => ({key, value}) => {
      return this.getSites(state).find(item => item[key] === value);
  }
}