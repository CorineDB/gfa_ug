
import ApiService from "@/services/configs/api.service"

const FormulaireService = {

    query(type, params) {
      return ApiService.query("formulaires", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("formulaires", slug);
    },

    allGenerals(slug) {
      return ApiService.get("formulaire/generals");
    },

    create(params) {
      return ApiService.post("formulaires", params);
    },

    update(slug, params) {
      return ApiService.update("formulaires", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`formulaires/${slug}`);
    },

    getSuivi(slug, params) {
      return ApiService.post("formulaire/getSuivi", params);
    },

  };

  export default FormulaireService;
  