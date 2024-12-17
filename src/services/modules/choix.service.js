import ApiService from "@/services/configs/api.service";

const ChoixService = {
  query(type, params) {
    return ApiService.query("choises", {
      params: params,
    });
  },
  get(slug) {
    return ApiService.get(`choises`);
  },
  create(params) {
    return ApiService.post("choises", params);
  },
  update(slug, params) {
    return ApiService.update("choises", slug, params);
  },
  destroy(slug) {
    return ApiService.delete(`choises/${slug}`);
  },
};

export default ChoixService;
