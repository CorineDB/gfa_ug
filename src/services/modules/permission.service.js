
import ApiService from '@/services/configs/api.service'

const  PermissionsService = {

    query(type, params) {
      return ApiService.query("permissions", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("permissions", slug);
    },

    create(params) {
      return ApiService.post("permissions", { permission: params });
    },

    update(slug, params) {
      return ApiService.update("permissions", slug, { permission: params });
    },

    destroy(slug) {
      return ApiService.delete(`permissions/${slug}`);
    },

    roles(slug) {
      return ApiService.get(`permissions/${slug}/roles`);
    }

  };

  export default PermissionsService;