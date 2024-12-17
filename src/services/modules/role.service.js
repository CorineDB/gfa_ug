
import ApiService from '@/services/configs/api.service'

const RolesService = {

    query(type, params) {
      return ApiService.query("roles", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("roles", slug);
    },

    create(params) {
      return ApiService.post("roles", params);
    },

    update(slug, params) {
      return ApiService.update("roles", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`roles/${slug}`);
    },

    programmes(slug) {
      return ApiService.get(`roles/${slug}/programmes`);
    }

  };

  export default RolesService;
  