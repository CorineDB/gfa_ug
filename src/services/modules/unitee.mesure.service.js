
import ApiService from '@/services/configs/api.service'

const UniteeDeMesureService = {

    query(type, params) {
      return ApiService.query("unitees-de-mesure", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("unitees-de-mesure", slug);
    },

    create(params) {
      return ApiService.post("unitees-de-mesure", params);
    },

    update(slug, params) {
      return ApiService.update("unitees-de-mesure", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`unitees-de-mesure/${slug}`);
    }
  };

  export default UniteeDeMesureService;
  