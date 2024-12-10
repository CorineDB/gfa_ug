import ApiService from "@/services/configs/api.service";

const EnqueteIndividuelService = {
  query(type, params) {
    return ApiService.query("gfa/survey-forms", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get(`gfa/survey-forms`);
  },
  getOne(id) {
    return ApiService.get(`gfa/survey-forms/${id}`);
  },

  create(params) {
    return ApiService.post("gfa/survey-forms", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/survey-forms", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/survey-forms/${slug}`);
  },
};

export default EnqueteIndividuelService;
