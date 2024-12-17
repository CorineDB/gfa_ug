
import ApiService from '@/services/configs/api.service'

const UtilisateurService = {

    query(type, params) {
      return ApiService.query("utilisateurs", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("utilisateurs", slug);
    },
    getByProgramme(id) {
      return ApiService.get(`programmes/${id}/users`);
    },
   
    create(params) {
      return ApiService.post("utilisateurs", params);
    },

    update(slug, params) {
      return ApiService.update("utilisateurs", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`utilisateurs/${slug}`);
    },


  };

  export default UtilisateurService;
  