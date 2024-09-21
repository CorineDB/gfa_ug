
import ApiService from '@/services/configs/api.service'

const AgenceDeCommunicationService = {

    query(type, params) {
      return ApiService.query("agences-de-communication", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("agences-de-communication", slug);
    },

    create(params) {
      return ApiService.post("agences-de-communication", params);
    },

    update(slug, params) {
      return ApiService.update("agences-de-communication", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`agences-de-communication/${slug}`);
    }

  };

  export default AgenceDeCommunicationService;
  