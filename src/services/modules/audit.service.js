
import ApiService from '@/services/configs/api.service'

const auditService = {
    // query connexion services
    query(type, params) {
      return ApiService.query("audits", {
        params: params
      });
    },
    // getters services
    get(slug) {
      return ApiService.get("audits", slug);
    },
    //  create services
    create(params) {
      return ApiService.post("audits", params);
    },
    // update services
    update(slug, params) {
      return ApiService.post(`audits/${slug}`, params);
    },
    // destroy services
    destroy(slug) {
      return ApiService.delete(`audits/${slug}`);
    },


  };

  export default auditService;
  