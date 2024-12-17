import ApiService from "@/services/configs/api.service";

const FormulaireFactuel = {
  query(type, params) {
    return ApiService.query("gfa/formulaires-de-gouvernance", {
      params: params,
    });
  },

  get(slug = "factuel") {
    return ApiService.get(`gfa/formulaires-de-gouvernance?filters[type__eq]=${slug}`);
  },
  getAll() {
    return ApiService.get(`gfa/formulaires-de-gouvernance`);
  },
  getOne(id) {
    return ApiService.get(`gfa/formulaires-de-gouvernance/${id}`);
  },

  create(payload) {
    return ApiService.post(`gfa/formulaires-de-gouvernance`, payload);
  },

  update(id, payload) {
    return ApiService.update(`gfa/formulaires-de-gouvernance/${id}`, payload);
  },

  destroy(id) {
    return ApiService.delete(`gfa/formulaires-de-gouvernance/${id}`);
  },
};

export default FormulaireFactuel;
