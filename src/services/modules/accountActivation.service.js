
import ApiService from '@/services/configs/api.service'

const ActivationAccount = {

    query(type, params) {
      return ApiService.query("activation-de-compte", {
        params: params
      });
    },

    activerCompte(slug) {
      return ApiService.get("activation-de-compte", slug);
    },
    confirmationCompte(slug) {
        return ApiService.get("confirmation-de-compte", slug);
      },
  
    create(params) {
      return ApiService.post("activation-de-compte", params);
    },

    update(slug, params) {
      return ApiService.update("activation-de-compte", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`activation-de-compte/${slug}`);
    }
  };

  export default ActivationAccount;
  