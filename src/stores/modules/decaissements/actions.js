import {
  FETCH_LIST as FETCH_LIST_DECAISSEMENT,
  GET as GET_DECAISSEMENT,
  STORE as STORE_DECAISSEMENT,
  UPDATE as UPDATE_DECAISSEMENT,
  DESTROY as DESTROY_DECAISSEMENT,
} from "../../actions.type"

import {
  SET_LIST as SET_LIST_DECAISSEMENT,
  FIND as findDecaissement,
  ADD as ADD_DECAISSEMENT,
  MODIFY as MODIFY_DECAISSEMENT,
  REMOVE as REMOVE_DECAISSSMENT
} from "../../mutations.type"

import DecaissementService from "@/services/modules/decaissement.service";
import ProgrammeService from "@/services/modules/programme.service";
import Decaissement from "./decaissement";

export default {
  
  FETCH_LIST_DECAISSEMENT : async ({ commit }) => {

      const { data, status } = await DecaissementService.get();

      if(status === 200 || status === 201) 
          commit(SET_LIST_DECAISSEMENT, data.data);

      return { data, status };
  },

  FILTRE_DECAISSEMENT : async ({ commit }, payload) => {

    const { data, status } = await DecaissementService.filtre(payload);

    if(status === 200 || status === 201) 
        commit(SET_LIST_DECAISSEMENT, data.data);

    return { data, status };
  },

  async GET_DECAISSEMENT ({ commit, getters }, {key, value }) {

      let decaissement = null
      
      decaissement = getters.findDecaissement({key: key, value : value})

      if((decaissement === null || decaissement || undefined) && typeof value === "int"){

          const { data, status } = await DecaissementService.get(value);

          if(status === 200 || status === 201)
            categorie = data.data
      }

      return decaissement;
  },

  async STORE_DECAISSEMENT ({ commit }, payload) {
      
      const { data, status } = await DecaissementService.create(payload);

      if(status === 200 || status === 201)
          commit(ADD_DECAISSEMENT, data.data);

      return { data, status };

  },

  async UPDATE_DECAISSEMENT ({ commit }, {decaissement, id}) {
      
      const { data, status } = await DecaissementService.update(id, decaissement);

      if(status === 200 || status === 201)
          commit(MODIFY_DECAISSEMENT, data.data);

      return { data, status };

  },

  async DESTROY_DECAISSEMENT ({ commit }, idDecaissement) {
      
      const { data, status } = await DecaissementService.destroy(idDecaissement);

      if(status === 200 || status === 201 || status === 204)
          commit(REMOVE_DECAISSSMENT, idDecaissement);

      return { data, status };

  }
}