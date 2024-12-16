
import ApiService from '@/services/configs/api.service'

const ReponseService = {

    query(type, params) {
      return ApiService.query("reponses", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("reponses", slug);
    },

    create(params) {
      return ApiService.post("reponses", params);
    },

    update(slug, params) {
      return ApiService.update("reponses", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`reponses/${slug}`);
    },

  };

  export default ReponseService;
  