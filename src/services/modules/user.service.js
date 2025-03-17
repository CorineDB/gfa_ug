
import ApiService from '@/services/configs/api.service'

const UsersService = {

    query(type, params) {
      return ApiService.query("gfa/utilisateurs", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("gfa/utilisateurs", slug);
    },
  
   
    create(params) {
      return ApiService.post("register", params);
    },
    addUsers(params) {
      return ApiService.post("gfa/utilisateurs", params);
    },
    

    update(slug, params) {
      return ApiService.update("gfa/utilisateurs", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`gfa/utilisateurs/${slug}`);
    },
    getUsersInfo(slug){
      return ApiService.get(`utilisateurs/${slug}`);
    }


  };

  export default UsersService;
  