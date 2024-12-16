import {
  FETCH_LIST as FETCH_LIST_ANO,
  GET as GET_ANO,
  STORE as STORE_ANO,
  UPDATE as UPDATE_ANO,
  DESTROY as DESTROY_ANO,
} from "../../actions.type"

import {
  SET_LIST as SET_LIST_ANO,
  FIND as findAno,
  ADD as ADD_ANO,
  MODIFY as MODIFY_ANO,
  REMOVE as REMOVE_ANO
} from "../../mutations.type"

import AnoService from "@/services/modules/ano.service";
import Ano from "./ano";

export default {
  
  FETCH_LIST_ANO : async ({ commit }) => {

      const { data, status } = await AnoService.get();

      if(status === 200 || status === 201) 
          commit(SET_LIST_ANO, data.data);

      return { data, status };
  },

  async GET_ANO ({ commit, getters }, {key, value }) {

      let ano = null
      
      ano = getters.findAno({key: key, value : value})

      if((ano === null || ano || undefined) && typeof value === "int"){

          const { data, status } = await AnoService.get(value);

          if(status === 200 || status === 201)
              ano = data.data
      }

      return ano;
  },

  async STORE_ANO ({ commit }, payload) {
      
      const { data, status } = await AnoService.create(payload);

      if(status === 200 || status === 201)
          commit(ADD_ANO, data.data);

      return { data, status };

  },

  async UPDATE_ANO ({ commit }, {ano, id}) {
      
      const { data, status } = await AnoService.update(id, ano);

      if(status === 200 || status === 201)
          commit(MODIFY_ANO, data.data);

      return { data, status };

  },

  async DESTROY_ANO ({ commit }, idAno) {
      
      const { data, status } = await AnoService.destroy(idAno);

      if(status === 200 || status === 201 || status === 204)
          commit(REMOVE_ANO, idAno);

      return { data, status };

  }
}