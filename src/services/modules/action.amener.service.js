import ApiService from "@/services/configs/api.service";

const ActionMenerService = {
  query(type, params) {
    return ApiService.query("/gfa/actions-a-mener", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("/gfa/actions-a-mener", slug);
  },

  getForEvaluation(idEvaluation) {
    return ApiService.get(`/gfa/evaluations-de-gouvernance/${idEvaluation}/actions-a-mener`);
  },

  create(params) {
    return ApiService.post("/gfa/actions-a-mener", params);
  },
  validateAction(id, params) {
    return ApiService.post(`/gfa/actions-a-mener/${id}/valider`, params);
  },

  update(slug, params) {
    return ApiService.update("/gfa/actions-a-mener", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`/gfa/actions-a-mener/${slug}`);
  },
};

export default ActionMenerService;
