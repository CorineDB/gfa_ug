import {
  SET_LIST as SET_LIST_TYPE_ANO,
  FIND as findTypeAno,
  ADD as ADD_TYPE_ANO,
  MODIFY as MODIFY_TYPE_ANO,
  REMOVE as REMOVE_TYPE_ANO
} from "@/store/mutations.type"

import TypeAnoService from "@/services/modules/type.ano.service";

export default {
  
  FETCH_LIST_TYPE_ANO : async ({ commit }) => {

      const { data, status } = await TypeAnoService.get();

      if(status === 200 || status === 201) 
          commit(SET_LIST_TYPE_ANO, data.data);

      return { data, status };
  },

  async GET_TYPE_ANO ({ commit, getters }, {key, value }) {

      let typeAno = null
      
      typeAno = getters.findTypeAno({key: key, value : value})

      if((typeAno === null || typeAno || undefined) && typeof value === "int"){

          const { data, status } = await TypeAnoService.get(value);

          if(status === 200 || status === 201)
              typeAno = data.data
      }

      return typeAno;
  },

  async STORE_TYPE_ANO ({ commit }, payload) {
      
      const { data, status } = await TypeAnoService.create(payload);

      if(status === 200 || status === 201)
          commit(ADD_TYPE_ANO, data.data);

      return { data, status };

  },

  async UPDATE_TYPE_ANO ({ commit }, {typeAno, id}) {
      
      const { data, status } = await TypeAnoService.update(id, typeAno);

      if(status === 200 || status === 201)
          commit(MODIFY_TYPE_ANO, data.data);

      return { data, status };

  },

  async DESTROY_TYPE_ANO ({ commit }, idTypeAno) {
      
      const { data, status } = await TypeAnoService.destroy(idTypeAno);

      if(status === 200 || status === 201 || status === 204)
          commit(REMOVE_TYPE_ANO, idTypeAno);

      return { data, status };

  }
}