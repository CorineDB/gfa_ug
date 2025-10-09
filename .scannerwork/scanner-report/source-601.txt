
import ApiService from '@/services/configs/api.service'

const PointFinancierService = {
  
    pointFinancier(params) {
      return ApiService.post("tables/tauxDecaissement", params);
    },
  };

  export default PointFinancierService;
  