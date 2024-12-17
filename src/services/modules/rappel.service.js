
import ApiService from '@/services/configs/api.service'

const RappelService = {
    // query connexion services
    query(type, params) {
      return ApiService.query("rappels", {
        params: params
      });
    },
    // getters services
    get(slug) {
      return ApiService.get("rappels", slug);
    },
    //  create services
    create(params) {
      return ApiService.post("rappels", params);
    },
    // update services
    update(slug, params) {
      return ApiService.update("rappels", slug, params);
    },
    // destroy services
    destroy(slug) {
      return ApiService.delete(`rappels/${slug}`);
    },


  };

  export default RappelService;
  