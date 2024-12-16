import ApiService from "@/services/configs/api.service";

const CritereGouvernance = {
  query(type, params) {
    return ApiService.query("gfa/criteres-de-gouvernance", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/criteres-de-gouvernance", slug);
  },

  create(params) {
    return ApiService.post("gfa/criteres-de-gouvernance", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/criteres-de-gouvernance", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/criteres-de-gouvernance/${slug}`);
  },
};

export default CritereGouvernance;
