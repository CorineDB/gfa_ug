import ApiService from "@/services/configs/api.service";

const OngService = {
  query(type, params) {
    return ApiService.query("gfa/organisations", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/organisations", slug);
  },

  programmeOng(slug) {
    return ApiService.get("gfa/programmes/evaluations-organisations/null", slug);
  },

  programmeEvaluationsOrganisations(slug) {
    return ApiService.get("gfa/programmes/evaluations-organisations-stats/null", slug);
  },

  

  find(id) {
    return ApiService.get(`gfa/organisations/${id}`);
  },

  create(params) {
    return ApiService.post("gfa/organisations", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/organisations", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/organisations/${slug}`);
  },
};

export default OngService;
