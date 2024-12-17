
import ApiService from '@/services/configs/api.service'

const resultatService = {

    query(type, params) {
      return ApiService.query("resultats", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("resultats", slug);
    },

    create(params) {
      return ApiService.post("resultats", params);
    },

    update(slug, params) {
      return ApiService.update("resultats", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`resultats/${slug}`);
    }

  };

  export default resultatService;
  