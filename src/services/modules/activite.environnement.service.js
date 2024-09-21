
import ApiService from '@/services/configs/api.service'

const ActiviteEnvironnementService = {

    query(type, params) {
      return ApiService.query("eActivites", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("/eActivites", slug);
    },

    create(params) {
      return ApiService.post("eActivites", params);
    },

    update(slug, params) {
      return ApiService.update("eActivites", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`eActivites/${slug}`);
    },

    programme(slug) {
      return ApiService.get(`programmes/${slug}/eActivites`);
    },

  };

  export default ActiviteEnvironnementService;
  