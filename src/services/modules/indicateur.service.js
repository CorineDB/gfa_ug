import ApiService from "@/services/configs/api.service";

const IndicateursService = {
  query(type, params) {
    return ApiService.query("indicateurs", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("/gfa/indicateurs", slug);
  },
  getAll() {
    return ApiService.get("/gfa/indicateurs");
  },
  getIndicateurBailleur() {
    return ApiService.get("/gfa/bailleur/indicateurs");
  },

  create(params) {
    return ApiService.post("/gfa/indicateurs", params);
  },
  createSuivi(params) {
    return ApiService.post("/gfa/suivi-indicateurs", params);
  },
  getAllSuivis() {
    return ApiService.get(`/gfa/suivi-indicateurs`);
  },
  detailSuivi(id) {
    return ApiService.get(`/gfa/indicateurs/${id}/suivis`);
  },
  validateSuivi(id) {
    return ApiService.post(`/gfa/suivi-indicateurs/${id}/valider`);
  },
  addStructure(id, payload) {
    return ApiService.post(`/gfa/indicateurs/${id}/addStrutureResponsable`, payload);
  },
  addYearsCible(id, payload) {
    return ApiService.post(
      `/gfa/indicateurs/${id}/addAnneesCible
`,
      payload
    );
  },
  filtre(params) {
    return ApiService.post("/gfa/indicateurs/filtres", params);
  },

  update(slug, params) {
    return ApiService.update("/gfa/indicateurs", slug, params);
  },

  // ANCIENNE VERSION - POST
  // updateComplet(id, params) {
  //   return ApiService.post(`/gfa/indicateurs/${id}/complet`, params);
  // },

  // NOUVELLE VERSION - PUT (comme demandé par le backend)
  updateComplet(id, params) {
    return ApiService.put(`/gfa/indicateurs/${id}/complet`, params);
  },

  destroy(slug) {
    return ApiService.delete(`/gfa/indicateurs/${slug}`);
  },

  programmes(slug) {
    return ApiService.get(`/gfa/indicateurs/${slug}/programmes`);
  },
};

export default IndicateursService;
