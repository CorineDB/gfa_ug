
import ApiService from '@/services/configs/api.service'

const HistoriqueService = {

    query(type, params) {
      return ApiService.query("historiques", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("historiques", slug);
    },

    create(params) {
      return ApiService.post("historiques", params);
    },

    update(slug, params) {
      return ApiService.update("historiques", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`historiques/${slug}`);
    },

   

  };

  export default HistoriqueService;
  