
import ApiService from '@/services/configs/api.service'

const AnosService = {
    // query connexion services
    query(type, params) {
      return ApiService.query("anos", {
        params: params
      });
    },
    // getters services
    get(slug) {
      return ApiService.get("anos", slug);
    },
    getReponseAnos(slug) {
      return ApiService.get(`ano/${slug}/reponses`);
    },
   
    //  create services
    create(params) {
      return ApiService.post("anos", params);
    },
    reponseAnos(params) {
      return ApiService.post("reponseAnos", params);
    },
    commentaire(params) {
      return ApiService.post("---------", params);
    },
    
    // update services
    update(slug, params) {
      return ApiService.update("anos", slug, params);
    },
    // destroy services
    destroy(slug) {
      return ApiService.delete(`anos/${slug}`);
    },

    // programmes(slug) {
    //   return ApiService.get(`anos/${slug}/programmes`);
    // }

  };

  export default AnosService;
  