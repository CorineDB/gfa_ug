
import ApiService from '@/services/configs/api.service'

const alertService = {
    // query connexion services
    query(type, params) {
      return ApiService.query("alerteConfig", {
        params: params
      });
    },
    // getters services
    get(slug) {
      return ApiService.get("alerteConfig", slug);
    },
    //  create services
    create(params) {
      return ApiService.post("alerteConfig", params);
    },
    // update services
    update(slug, params) {
      return ApiService.update("alerteConfig", slug, params);
    },
    // destroy services
    destroy(slug) {
      return ApiService.delete(`alerteConfig/${slug}`);
    },


  };

  export default alertService;
  