
import ApiService from '@/services/configs/api.service'

const SuiviFinanciersService = {

    query(type, params) {
      return ApiService.query("suiviFinanciers", {
        params: params
      });
    },

    get(slug) {
      return ApiService.get("/suiviFinanciers", slug);
    },

    create(params) {
      return ApiService.post("suiviFinanciers", params);
    },
    importCSV(params) {
      return ApiService.post("suiviFinanciers/importation", params);
    },

    update(slug, params) {
      return ApiService.update("suiviFinanciers", slug, params);
    },

    destroy(slug) {
      return ApiService.delete(`suiviFinanciers/${slug}`);
    },

    byProgramme(slug) {
      return ApiService.get(`programmes/${slug}/suiviFinanciers`);
    },
    filtre(params) {
      return ApiService.post("suiviFinanciers/filtres", params);
    },

  };

  export default SuiviFinanciersService;
  