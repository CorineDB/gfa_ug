
import ApiService from '@/services/configs/api.service'

const ActiviteService = {

    query(type, params) {
      return ApiService.query("activites", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("activites", slug);
    },

    create(params) {
      return ApiService.post("maitrise-oeuvres", params);
    },
    addDate(slug,params) {
      return ApiService.post(`activites/${slug}/ajouterDuree`, params);
      //return ApiService.post(`activites/ajouterDuree/${slug}`, params);
    },

    getDatas(slug) {
      return ApiService.get(`programmes/${slug}/maitriseOeuvres`);
    },
    getSuivi() {
      const params = {
        type: "activite"
      }
      return ApiService.post(`suivis/filterByModule`, params);
    },

    update(slug, params) {
      return ApiService.update("activites", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`activites/${slug}`);
    },

    prolonger(slug, params) {
      return ApiService.post(`activites/${slug}/ajouterDuree`, params);
    },

    composante(slug) {
      return ApiService.get(`activites/${slug}/composante`);
    },

    taches(slug) {
      return ApiService.get(`activites/${slug}/taches`);
    },

    plansDeDecaissement(slug) {
      return ApiService.get(`activites/${slug}/plansDeDecaissement`);
    }

  };

  export default ActiviteService;
  