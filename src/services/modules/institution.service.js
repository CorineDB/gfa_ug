
import ApiService from "@/services/configs/api.service"

const InstitutionService = {

    query(type, params) {
      return ApiService.query("institutions", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("institutions", slug);
    },

    create(params) {
      return ApiService.post("institutions", params);
    },

    update(slug, params) {
      return ApiService.update("institutions", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`institutions/${slug}`);
    },

    programme(slug) {
      return ApiService.get(`institutions/${slug}/programme`);
    }

  };

  export default InstitutionService;