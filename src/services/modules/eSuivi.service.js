
import ApiService from '@/services/configs/api.service'

const ESuiviService = {

    query(type, params) {
      return ApiService.query("eSuivis", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("eSuivis", slug);
    },

    create(params) {
      return ApiService.post("eSuivis", params);
    },

    update(slug, params) {
      return ApiService.update("eSuivis", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`eSuivis/${slug}`);
    },

    dates(params) {
      return ApiService.post("eSuivis/dates", params);
    },

    formulaires(params) {
      return ApiService.post("eSuivis/formulaires", params);
    },

    graphes(params) {
      return ApiService.post("eSuivis/graphes", params);
    },

  };

  export default ESuiviService;
  