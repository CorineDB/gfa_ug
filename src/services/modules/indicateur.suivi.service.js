
import ApiService from '@/services/configs/api.service'

const IndicateurSuiviService = {

    query(type, params) {
      return ApiService.query("suivi-indicateurs", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("suivi-indicateurs", slug);
    },
    getBailleurSuivi(slug) {
      return ApiService.get("bailleur/suiviIndicateurs", slug);
    },
    
    checksuivi(slug, params) {
      return ApiService.get(`indicateurs/${slug}/checkSuivi/${params}`);
    },
    mySuivis(slug) {
      return ApiService.get(`indicateurs/${slug}/suivis`);
    },
    create(params) {
      return ApiService.post("suivi-indicateurs", params);
    },

    filtre(params) {
      return ApiService.post("suivi-indicateurs/filter", params);
    },

    filtreDate(params) {
      return ApiService.post("suivi-indicateurs/dateSuivie", params);
    },

    update(slug, params) {
      return ApiService.update("suivi-indicateurs", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`suivi-indicateurs/${slug}`);
    },

    programmes(slug) {
      return ApiService.get(`suivi-indicateurs/${slug}/programmes`);
    }

  };

  export default IndicateurSuiviService;
  