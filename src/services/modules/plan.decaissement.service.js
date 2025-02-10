import ApiService from "@/services/configs/api.service";

const PlanDeDecaissementService = {
  query(type, params) {
    return ApiService.query("planDecaissements", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("planDecaissements", slug);
  },

  create(params) {
    return ApiService.post("planDecaissements", params);
  },

  update(slug, params) {
    return ApiService.update("planDecaissements", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`planDecaissements/${slug}`);
  },

  programmes(slug) {
    return ApiService.get(`planDecaissement/${slug}/programmes`);
  },
};

export default PlanDeDecaissementService;
