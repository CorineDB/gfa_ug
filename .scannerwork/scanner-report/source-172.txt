import {
  FETCH_LIST as FETCH_LIST_UTILISATEUR,
  GET as GET_UTILISATEUR,
  STORE as STORE_UTILISATEUR,
  UPDATE as UPDATE_UTILISATEUR,
  DESTROY as DESTROY_UTILISATEUR,
} from "../../actions.type"

import {
  SET_LIST as SET_UTILISATEUR,
  FIND as findUniteeDeGestion,
  ADD as ADD_UTILISATEUR,
  MODIFY as MODIFY_UTILISATEUR,
  REMOVE as REMOVE_UTILISATEUR
} from "../../mutations.type"

import UtilisateurService from "@/services/modules/utilisateur.service";

export default {
  
  FETCH_LIST_UTILISATEUR : async ({ commit }) => {

      const { data, status } = await UtilisateurService.get();

      if(status === 200 || status === 201)
          commit(SET_UTILISATEUR, data.data);

      return { data, status };
  },

  async GET_UTILISATEUR ({ commit, getters }, {key, value }) {

      let uniteeDeGestion = null

      uniteeDeGestion = getters.findUniteeDeGestion({key: key, value : value})

      if((uniteeDeGestion === null || uniteeDeGestion || undefined) && typeof value === "int"){

          const { data, status } = await UtilisateurService.get(value);

          if(status === 200 || status === 201)
              uniteeDeGestion = data.data
      }

      return uniteeDeGestion
  },

  async STORE_UTILISATEUR ({ commit }, payload) {
      
      const { data, status } = await UtilisateurService.create(payload);

      if(status === 200 || status === 201)
          commit(ADD_UTILISATEUR, data.data);

      return { data, status };

  },

  async UPDATE_UTILISATEUR ({ commit }, {utilisateur, id}) {
      
      const { data, status } = await UtilisateurService.update(id, utilisateur);

      if(status === 200 || status === 201)
          commit(MODIFY_UTILISATEUR, data.data);

      return { data, status };

  },

  async DESTROY_UTILISATEUR ({ commit }, IdUtilisateur) {
      
      const { data, status } = await UtilisateurService.destroy(IdUtilisateur);

      if(status === 200 || status === 201 || status === 204)
          commit(REMOVE_UTILISATEUR, IdUtilisateur);

      return { data, status };

  }
}