
import ApiService from '@/services/configs/api.service'

const DecaissementService = {

    query(type, params) {
      return ApiService.query("decaissements", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("decaissements", slug);
    },

    create(params) {
      return ApiService.post("decaissements", params);
    },

    update(slug, params) {
      return ApiService.update("decaissements", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`decaissements/${slug}`);
    },

    programmes(slug) {
      return ApiService.get(`decaissements/${slug}/programmes`);
    },

    filtre(params) {
      return ApiService.post("decaissements/filtres", params);
    },

  };

  export default DecaissementService;
  