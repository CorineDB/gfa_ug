
import ApiService from "@/services/configs/api.service"

const UniteeDeGestionService = {

    query(type, params) {
      return ApiService.query("unitee-de-gestions", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("unitee-de-gestions", slug);
    },

    create(params) {
      return ApiService.post("unitee-de-gestions", params);
    },

    update(slug, params) {
      return ApiService.update("unitee-de-gestions", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`unitee-de-gestions/${slug}`);
    },

    programme(slug) {
      return ApiService.get(`unitee-de-gestions/${slug}/programme`);
    }

  };

  export default UniteeDeGestionService;