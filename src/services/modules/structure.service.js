
import ApiService from '@/services/configs/api.service'

const StructureService = {

    query(type, params) {
      return ApiService.query("structures", {
        params: params
      });
    },

    get() {
      return ApiService.get(`structures`);
    },
    create(params) {
      return ApiService.post("structures", params);
    },

    update(slug, params) {
      return ApiService.update("structures", slug, params);
    },
    destroy(slug) {
      return ApiService.delete(`structures/${slug}`);
    },


  };

  export default StructureService;
  