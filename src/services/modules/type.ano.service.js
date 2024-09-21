
import ApiService from '@/services/configs/api.service'

const TypeAnosService = {
    // query connexion services
    query(type, params) {
      return ApiService.query("typeAnos", {
        params: params
      });
    },
    // getters services
    get(slug) {
      return ApiService.get("typeAnos", slug);
    },
    //  create services
    create(params) {
      return ApiService.post("typeAnos", params);
    },
    // update services
    update(slug, params) {
      return ApiService.update("typeAnos", slug, params);
    },
    // destroy services
    destroy(slug) {
      return ApiService.delete(`typeAnos/${slug}`);
    },

  };

  export default TypeAnosService;
  