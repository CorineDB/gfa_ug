
import ApiService from '@/services/configs/api.service'

const RevisionPtabService = {

    get(slug) {
      return ApiService.get("ptabScopes", slug);
    },

    getOldPtaReviser(params) {
      return ApiService.post("ptas/getOldPtaReviser", params);
    },

    reviserPtab(params) {
      return ApiService.post("ptas/reviserPtab", params);
    },

    getPtabReviser(params)
    {
      return ApiService.post("ptas/getPtabReviser", params);
    }

  };

  export default RevisionPtabService;
  