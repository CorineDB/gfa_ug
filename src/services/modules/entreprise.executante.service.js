
import ApiService from "@/services/configs/api.service"

const EntrepriseExecutanteService = {

    query(type, params) {
      return ApiService.query("entreprise-executants", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("entreprise-executants", slug);
    },
    getByBailleur() {
      return ApiService.get("bailleur/entreprisesExecutantes");
    },

    create(params) {
      return ApiService.post("entreprise-executants", params);
    },

    update(slug, params) {
      return ApiService.update("entreprise-executants", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`entreprise-executants/${slug}`);
    },

    mod(slug) {
      return ApiService.get(`entreprise-executants/${slug}/mod`);
    },

    passations(slug) {
      return ApiService.get(`entreprise-executants/${slug}/passations`);
    },
    usersForEntreprise(slug) {
      return ApiService.get(`programmes/entrepriseUsers/${slug}`);
    }

  };

  export default EntrepriseExecutanteService;