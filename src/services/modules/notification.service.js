
import ApiService from '@/services/configs/api.service'

const NotificationService = {

   

    get(slug) {
      return ApiService.get("utilisateur/getNotifications", slug);
    },

  
    checkMessage(params) {
     
      return ApiService.post("utilisateur/readNotifications", params);
    },

    destroy() {
      return ApiService.get(`utilisateurs/deleteAllNotifications`);
    },

    programme(slug) {
      return ApiService.get(`mods/${slug}/programmes`);
    }

  };

  export default NotificationService;
  