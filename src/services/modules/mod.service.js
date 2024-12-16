
import ApiService from '@/services/configs/api.service'

const ModService = {

    query(type, params) {
      return ApiService.query("mods", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("mods", slug);
    },

    create(params) {
      return ApiService.post("mods", params);
    },

    update(slug, params) {
      return ApiService.update("mods", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`mods/${slug}`);
    },

    programme(slug) {
      return ApiService.get(`mods/${slug}/programmes`);
    }

  };

  export default ModService;
  