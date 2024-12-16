
import ApiService from '@/services/configs/api.service'

const ObjectifGlobalService = {

    query(type, params) {
      return ApiService.query("objectifGlobaux", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("objectifGlobaux", slug);
    },

    create(params) {
      return ApiService.post("objectifGlobaux", params);
    },

    update(slug, params) {
      return ApiService.update("objectifGlobaux", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`objectifGlobaux/${slug}`);
    }

  };

  export default ObjectifGlobalService;
  