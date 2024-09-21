
import ApiService from '@/services/configs/api.service'

const resetPassword = {
    // query connexion services
    query(type, params) {
      return ApiService.query("reinitialisation-de-mot-de-passe", {
        params: params
      });
    },
    // getters services
    get(slug) {
      return ApiService.get("reinitialisation-de-mot-de-passe", slug);
    },
    verify(slug) {
      return ApiService.get("verification-de-compte", slug);
    },
    //  create services
    create(params) {
      return ApiService.post("reinitialisation-de-mot-de-passe", params);
    },
    // update services
    update(slug, params) {
      return ApiService.update("reinitialisation-de-mot-de-passe", slug, params);
    },
    // destroy services
    destroy(slug) {
      return ApiService.delete(`reinitialisation-de-mot-de-passe/${slug}`);
    },


  };

  export default resetPassword;
  