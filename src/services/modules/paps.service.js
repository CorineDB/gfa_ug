
import ApiService from '@/services/configs/api.service'

const PapsService = {

    query(type, params) {
      return ApiService.query("sinistres", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("/sinistres", slug);
    },

    create(params) {
      return ApiService.post("sinistres", params);
    },

    update(slug, params) {
      return ApiService.update("sinistres", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`sinistres/${slug}`);
    },

    importCSV(params) {
      return ApiService.post("sinistres/importation", params);
    },

    programme(slug) {
      return ApiService.get(`programmes/${slug}/sinistres`);
    },

  };

  export default PapsService;
  