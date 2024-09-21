
import ApiService from "@/services/configs/api.service"

const GouvernementService = {

    query(type, params) {
      return ApiService.query("gouvernements", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("gouvernements", slug);
    },

    create(params) {
      return ApiService.post("gouvernements", params);
    },

    update(slug, params) {
      return ApiService.update("gouvernements", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`gouvernements/${slug}`);
    },

    programme(slug) {
      return ApiService.get(`gouvernements/${slug}/programme`);
    }

  };

  export default GouvernementService;