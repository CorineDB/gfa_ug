
import ApiService from '@/services/configs/api.service'

const ComposantesService = {

    query(type, params) {
      return ApiService.query("composantes", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("composantes", slug);
    },

    create(params) {
      return ApiService.post("composantes", params);
    },

    mySuivis(slug) {
      return ApiService.get(`composantes/${slug}/suivis`);
    },
    getSuivi() {
      const params = {
        type: "composante"
      }
      return ApiService.post(`suivis/filterByModule`, params);
    },

    update(slug, params) {
      return ApiService.update("composantes", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`composantes/${slug}`);
    },

    activites(slug) {
      return ApiService.get(`composantes/${slug}/activites`);
    },

    sousComposantes(slug) {
      return ApiService.get(`composantes/${slug}/sousComposantes`);
    },

    projet(slug) {
      return ApiService.get(`composantes/${slug}/projet`);
    }

  };

  export default ComposantesService;
  