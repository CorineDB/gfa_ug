
import ApiService from '@/services/configs/api.service'

const BailleursService = {

    query(type, params) {
      return ApiService.query("bailleurs", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("bailleurs", slug);
    },

    create(params) {
      return ApiService.post("bailleurs", params);
    },

    update(slug, params) {
      return ApiService.post(`bailleur/${slug}/update`,params);
    },

    destroy(slug) {
      return ApiService.delete(`bailleurs/${slug}`);
    },

    programmes(slug) {
      return ApiService.get(`bailleurs/${slug}/programmes`);
    },

    bailleursOfProgramme(slug) {
      return ApiService.get(`programmes/${slug}/bailleurs`);
    },

  };

  export default BailleursService;
  