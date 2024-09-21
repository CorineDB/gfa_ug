
import ApiService from '@/services/configs/api.service'

const OngService = {

    query(type, params) {
      return ApiService.query("ongs", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("ongs", slug);
    },

    create(params) {
      return ApiService.post("ongs", params);
    },

    update(slug, params) {
      return ApiService.update("ongs", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`ongs/${slug}`);
    }

  };

  export default OngService;
  