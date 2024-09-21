import {
  FETCH_LIST as FETCH_LIST_SITE,
  GET as GET_SINITRE,
  STORE as STORE_SITE,
  UPDATE as UPDATE_SITE,
  DESTROY as DESTROY_SITE,
} from "@/store/actions.type"

import {
  SET_LIST as SET_LIST_SITE,
  FIND as findSite,
  ADD as ADD_SITE,
  MODIFY as MODIFY_SITE,
  REMOVE as REMOVE_SITE
} from "@/store/mutations.type"

import SiteService from "@/services/modules/site.service";

export default {
  
  FETCH_LIST_SITE : async ({ commit }, id) => {

      const { data, status } = await SiteService.programme(id);

      if(status === 200 || status === 201) 
          commit(SET_LIST_SITE, data.data);

      return { data, status };
  },

  async GET_SITE ({ commit, getters }, {key, value }) {

      let site = null
      
      site = getters.findSite({key: key, value : value})

      if((site === null || site || undefined) && typeof value === "int"){

          const { data, status } = await SiteService.get(value);

          if(status === 200 || status === 201)
            site = data.data
      }

      return site;
  },

  async STORE_SITE ({ commit }, payload) {
      
      const { data, status } = await SiteService.create(payload);

      if(status === 200 || status === 201)
          commit(ADD_SITE, data.data);
      return { data, status };

  },

  async UPDATE_SITE ({ commit }, {site, id}) {
      
      const { data, status } = await SiteService.update(id, site);

      if(status === 200 || status === 201)
        commit(MODIFY_SITE, data.data);

      return { data, status };

  },

  async DESTROY_SITE ({ commit }, idSite) {
      
      const { data, status } = await SiteService.destroy(idSite);

      if(status === 200 || status === 201 || status === 204)
          commit(REMOVE_SITE, idSite);

      return { data, status };

  }
}