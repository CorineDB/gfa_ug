
import ApiService from '@/services/configs/api.service'

const ptaService = {
    // query connexion services
    query(type, params) {
      return ApiService.query("ptas/reviserPtab", {
        params: params
      });
    },
    // getters services
    get(slug) {
      return ApiService.get("ptas/reviserPtab", slug);
    },
    //  create services
    getPta(params) {
      return ApiService.post("ptas/generer", params);
    },
    getFiltre(params) {
      return ApiService.post("ptas/filtre", params);
    },
    reviser(params) {
      return ApiService.post("ptas/reviserPtab", params);
    },
    getReviser(params) {
      return ApiService.post("ptas/getOldPtaReviser", params);
    },
    // update services
    update(slug, params) {
      return ApiService.update("ptas/reviserPtab", slug, params);
    },
    // destroy services
    destroy(slug) {
      return ApiService.delete(`ptas/reviserPtab/${slug}`);
    },

  };

  export default ptaService;
  