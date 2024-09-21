import {
  FETCH_LIST as FETCH_LIST_CATEGORIE,
  GET as GET_CATEGORIE,
  STORE as STORE_CATEGORIE,
  UPDATE as UPDATE_CATEGORIE,
  DESTROY as DESTROY_CATEGORIE,
} from "@/store/actions.type"

import {
  SET_LIST as SET_LIST_CATEGORIE,
  FIND as findCategorie,
  ADD as ADD_CATEGORIE,
  MODIFY as MODIFY_CATEGORIE,
  REMOVE as REMOVE_CATEGORIE
} from "@/store/mutations.type"

import CategorieService from "@/services/modules/categorie.service";
import Categorie from "./categorie";

export default {
  
  FETCH_LIST_CATEGORIE : async ({ commit }) => {

      const { data, status } = await CategorieService.get();

      if(status === 200 || status === 201) 
          commit(SET_LIST_CATEGORIE, data.data);

      return { data, status };
  },

  async GET_CATEGORIE ({ commit, getters }, {key, value }) {

      let categorie = null
      
      categorie = getters.findCategorie({key: key, value : value})

      if((categorie === null || categorie || undefined) && typeof value === "int"){

          const { data, status } = await CategorieService.get(value);

          if(status === 200 || status === 201)
            categorie = data.data
      }

      return categorie;
  },

  async STORE_CATEGORIE ({ commit }, payload) {
      
      const { data, status } = await CategorieService.create(payload);

      if(status === 200 || status === 201)
          commit(ADD_CATEGORIE, data.data);

      return { data, status };

  },

  async UPDATE_CATEGORIE ({ commit }, {categorie, id}) {
      
      const { data, status } = await CategorieService.update(id, categorie);

      if(status === 200 || status === 201)
          commit(MODIFY_CATEGORIE, data.data);

      return { data, status };

  },

  async DESTROY_CATEGORIE ({ commit }, idCategorie) {
      
      const { data, status } = await CategorieService.destroy(idCategorie);

      if(status === 200 || status === 201 || status === 204)
          commit(REMOVE_CATEGORIE, idCategorie);

      return { data, status };

  }
}