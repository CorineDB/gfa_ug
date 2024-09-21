
import ApiService from '@/services/configs/api.service'

const BackupService = {

    query(type, params) {
      return ApiService.query("backups/lancer", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("backups/lancer", slug);
    },
    getBackup(slug) {
        return ApiService.get("backups/lancer", slug);
    },

    create(params) {
      return ApiService.post("backups/lancer", params);
    },

    update(slug, params) {
      return ApiService.update("backups/lancer", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`backups/lancer/${slug}`);
    },

    programmes(slug) {
      return ApiService.get(`backups/lancer/${slug}/programmes`);
    }

  };

  export default BackupService;
  