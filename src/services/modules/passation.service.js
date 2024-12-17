
import ApiService from '@/services/configs/api.service'

const PassationsService = {

    query(type, params) {
      return ApiService.query("passations", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("/passations", slug);
    },

    create(params) {
      return ApiService.post("passations", params);
    },

    update(slug, params) {
      return ApiService.update("passations", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`passations/${slug}`);
    },

    importCSV(params) {
      return ApiService.post("passations/importation", params);
    },

    mods(slug) {
      return ApiService.get(`programmes/${slug}/mods/passations`);
    },
    missionDeControles(slug) {
      return ApiService.get(`programmes/${slug}/missionDeControles/passations`);
    },

  };

  export default PassationsService;
  