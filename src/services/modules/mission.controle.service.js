
import ApiService from '@/services/configs/api.service'

const MissionDeControleService = {

    query(type, params) {
      return ApiService.query("mission-de-controles", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("mission-de-controles", slug);
    },

    create(params) {
      return ApiService.post("mission-de-controles", params);
    },

    update(slug, params) {
      return ApiService.update("mission-de-controles", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`mission-de-controles/${slug}`);
    },

    programme(slug) {
      return ApiService.get(`mission-de-controles/${slug}/programmes`);
    }

  };

  export default MissionDeControleService;
  