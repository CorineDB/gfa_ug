import {
  FETCH_LIST as FETCH_LIST_INDICATEUR,
  GET as GET_INDICATEUR,
  STORE as STORE_INDICATEUR,
  UPDATE as UPDATE_INDICATEUR,
  DESTROY as DESTROY_INDICATEUR,
} from "../../actions.type"

import {
  SET_LIST as SET_LIST_INDICATEUR,
  FIND as findIndicateur,
  ADD as ADD_INDICATEUR,
  MODIFY as MODIFY_INDICATEUR,
  REMOVE as REMOVE_INDICATEUR
} from "../../mutations.type"

import IndicateurService from "@/services/modules/indicateur.service";

export default {
  
  FETCH_LIST_INDICATEUR : async ({ commit }) => {

      const { data, status } = await IndicateurService.get();

      if(status === 200 || status === 201) 
          commit(SET_LIST_INDICATEUR, data.data);

      return { data, status };
  },

  FILTRE_INDICATEUR : async ({ commit }, payload) => {

    const { data, status } = await IndicateurService.filtre(payload);

    if(status === 200 || status === 201) 
        commit(SET_LIST_INDICATEUR, data.data);

    return { data, status };
  },

  async GET_INDICATEUR ({ commit, getters }, {key, value }) {

      let indicateur = null
      
      indicateur = getters.findIndicateur({key: key, value : value})

      if((indicateur === null || indicateur || undefined) && typeof value === "int"){

          const { data, status } = await IndicateurService.get(value);

          if(status === 200 || status === 201)
              indicateur = data.data
      }

      return indicateur;
  },

  async STORE_INDICATEUR ({ commit }, payload) {
      
      const { data, status } = await IndicateurService.create(payload);

      if(status === 200 || status === 201)
          commit(ADD_INDICATEUR, data.data);

      return { data, status };

  },

  async UPDATE_INDICATEUR ({ commit }, {indicateur, id}) {
      
      const { data, status } = await IndicateurService.update(id, indicateur);

      if(status === 200 || status === 201)
          commit(MODIFY_INDICATEUR, data.data);

      return { data, status };

  },

  async DESTROY_INDICATEUR ({ commit }, idIndicateur) {
      
      const { data, status } = await IndicateurService.destroy(idIndicateur);

      if(status === 200 || status === 201 || status === 204)
          commit(REMOVE_INDICATEUR, idIndicateur);

      return { data, status };

  }
}