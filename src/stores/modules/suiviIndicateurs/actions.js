import {
  FETCH_LIST as FETCH_LIST_SUIVI,
  GET as GET_SUIVI,
  STORE as STORE_SUIVI,
  UPDATE as UPDATE_SUIVI,
  DESTROY as DESTROY_SUIVI,
} from "@/store/actions.type"

import {
  SET_LIST as SET_LIST_SUIVI,
  FIND as findSuivi,
  ADD as ADD_SUIVI,
  MODIFY as MODIFY_SUIVI,
  REMOVE as REMOVE_SUIVI
} from "@/store/mutations.type"

import SuiviIndicateursService from "@/services/modules/indicateur.suivi.service";

export default {
  
  FETCH_LIST_SUIVI : async ({ commit }) => {

      const { data, status } = await SuiviIndicateursService.get();

      if(status === 200 || status === 201) 
          commit(SET_LIST_SUIVI, data.data);

      return { data, status };
  },

  FILTRE_SUIVI : async ({ commit }, payload) => {

    const { data, status } = await SuiviIndicateursService.filtre(payload);

    if(status === 200 || status === 201) 
        commit(SET_LIST_SUIVI, data.data);

    return { data, status };
},

  async GET_SUIVI ({ commit, getters }, {key, value }) {

      let suivi = null
      
      suivi = getters.findIndicateur({key: key, value : value})

      if((suivi === null || suivi || undefined) && typeof value === "int"){

          const { data, status } = await SuiviIndicateursService.get(value);

          if(status === 200 || status === 201)
              suivi = data.data
      }

      return suivi;
  },

  async STORE_SUIVI ({ commit }, payload) {
      
      const { data, status } = await SuiviIndicateursService.create(payload);

      if(status === 200 || status === 201)
          commit(ADD_SUIVI, data.data);

      return { data, status };

  },

  async UPDATE_SUIVI ({ commit }, {suivi, id}) {
      
      const { data, status } = await SuiviIndicateursService.update(id, suivi);

      if(status === 200 || status === 201)
          commit(MODIFY_SUIVI, data.data);

      return { data, status };

  },

  async DESTROY_SUIVI ({ commit }, idSuivi) {
      
      const { data, status } = await SuiviIndicateursService.destroy(idSuivi);

      if(status === 200 || status === 201 || status === 204)
          commit(REMOVE_SUIVI, idSuivi);

      return { data, status };

  }
}