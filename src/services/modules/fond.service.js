import ApiService from "@/services/configs/api.service";

const FondsService = {
  query(type, params) {
    return ApiService.query("/gfa/fonds", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("/gfa/fonds", slug);
  },

  create(params) {
    return ApiService.post("/gfa/fonds", params);
  },

  update(slug, params) {
    return ApiService.update("/gfa/fonds", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`/gfa/fonds/${slug}`);
  },
};

export default FondsService;
