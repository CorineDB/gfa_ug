import ApiService from "@/services/configs/api.service";

const QuestionOperationnelle = {
  query(type, params) {
    return ApiService.query("gfa/questions-operationnelle", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("gfa/questions-operationnelle", slug);
  },

  create(params) {
    return ApiService.post("gfa/questions-operationnelle", params);
  },

  update(slug, params) {
    return ApiService.update("gfa/questions-operationnelle", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`gfa/questions-operationnelle/${slug}`);
  },
};

export default QuestionOperationnelle;
