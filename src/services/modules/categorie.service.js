
import ApiService from '@/services/configs/api.service'

const CategoriesService = {

    query(type, params) {
      return ApiService.query("categories", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("categories", slug);
    },

    create(params) {
      return ApiService.post("categories", params);
    },

    update(slug, params) {
      return ApiService.update("categories", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`categories/${slug}`);
    },


  };

  export default CategoriesService;
  