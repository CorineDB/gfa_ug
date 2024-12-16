
import ApiService from '@/services/configs/api.service'

const ObjectifSpecifiqueService = {

    query(type, params) {
      return ApiService.query("objectifSpecifiques", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("objectifSpecifiques", slug);
    },

    create(params) {
      return ApiService.post("objectifSpecifiques", params);
    },

    update(slug, params) {
      return ApiService.update("objectifSpecifiques", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`objectifSpecifiques/${slug}`);
    }

  };

  export default ObjectifSpecifiqueService;
  