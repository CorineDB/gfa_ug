
import ApiService from "@/services/configs/api.service"

const FormulaireService = {

    query(type, params) {
      return ApiService.query("utilisateurs/fichiers", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("utilisateurs/fichiers", slug);
    },

    getById(slug) {
      return ApiService.get("fichiers", slug);
    },

    create(params) {
      return ApiService.post("fichiers", params);
    },

    update(slug, params) {
      return ApiService.update("utilisateurs/fichiers", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`utilisateurs/fichiers/${slug}`);
    },

    getSuivi(slug, params) {
      return ApiService.post("formulaire/getSuivi", params);
    },
    
  };

  export default FormulaireService;
  