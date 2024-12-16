
import ApiService from '@/services/configs/api.service'

const IndicateursService = {

    query(type, params) {
      return ApiService.query("indicateur-mods", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("indicateur-mods", slug);
    },
    getIndicateurBailleur() {
      return ApiService.get("bailleur/indicateurs");
    },

    create(params) {
      return ApiService.post("indicateur-mods", params);
    },

    filtre(params) {
      return ApiService.post("indicateurs/filtres", params);
    },

    update(slug, params) {
      return ApiService.update("indicateur-mods", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`indicateur-mods/${slug}`);
    },

    programmes(slug) {
      return ApiService.get(`indicateurs/${slug}/programmes`);
    }

  };

  export default IndicateursService;
  