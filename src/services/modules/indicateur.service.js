
import ApiService from '@/services/configs/api.service'

const IndicateursService = {

    query(type, params) {
      return ApiService.query("indicateurs", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("indicateurs", slug);
    },
    getIndicateurBailleur() {
      return ApiService.get("bailleur/indicateurs");
    },

    create(params) {
      return ApiService.post("indicateurs", params);
    },

    filtre(params) {
      return ApiService.post("indicateurs/filtres", params);
    },

    update(slug, params) {
      return ApiService.update("indicateurs", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`indicateurs/${slug}`);
    },

    programmes(slug) {
      return ApiService.get(`indicateurs/${slug}/programmes`);
    }

  };

  export default IndicateursService;
  