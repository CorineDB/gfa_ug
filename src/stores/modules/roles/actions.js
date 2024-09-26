import {
  FETCH_LIST as FETCH_LIST_ROLE,
  GET as GET_ROLE,
  STORE as STORE_ROLE,
  UPDATE as UPDATE_ROLE,
  DESTROY as DESTROY_ROLE,
} from "../../actions.type"

import {
  SET_LIST as SET_LIST_ROLE,
  FIND as findRole,
  ADD as ADD_ROLE,
  MODIFY as MODIFY_ROLE,
  REMOVE as REMOVE_INDICATEUR
} from "../../mutations.type"

import RolesService from "@/services/modules/role.service";

export default {
  
  FETCH_LIST_ROLE : async ({ commit }) => {

      const { data, status } = await RolesService.get();

      if(status === 200 || status === 201) 
          commit(SET_LIST_ROLE, data.data);

      return { data, status };
  },

  async GET_ROLE ({ commit, getters }, {key, value }) {

      let role = null
      
      role = getters.findRole({key: key, value : value})

      if((role === null || role || undefined) && typeof value === "int"){

          const { data, status } = await RolesService.get(value);

          if(status === 200 || status === 201)
            role = data.data
      }

      return role;
  },

  async STORE_ROLE ({ commit }, payload) {
      
      const { data, status } = await RolesService.create(payload);

      if(status === 200 || status === 201)
          commit(ADD_ROLE, data.data);
      return { data, status };

  },

  async UPDATE_ROLE ({ commit }, {role, id}) {
      
      const { data, status } = await RolesService.update(id, role);

      if(status === 200 || status === 201)
        commit(MODIFY_ROLE, data.data);

      return { data, status };

  },

  async DESTROY_ROLE ({ commit }, idRole) {
      
      const { data, status } = await RolesService.destroy(idRole);

      if(status === 200 || status === 201 || status === 204)
          commit(REMOVE_INDICATEUR, idRole);

      return { data, status };

  }
}