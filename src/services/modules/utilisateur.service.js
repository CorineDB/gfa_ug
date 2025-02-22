import ApiService from "@/services/configs/api.service";

const UtilisateurService = {
  query(type, params) {
    return ApiService.query("utilisateurs", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/utilisateurs", slug);
  },
  getByProgramme(id) {
    return ApiService.get(`programmes/${id}/users`);
  },

  create(params) {
    return ApiService.post("gfa/utilisateurs", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/utilisateurs", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/utilisateurs/${slug}`);
  },
};

export default UtilisateurService;
