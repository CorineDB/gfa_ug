
import ApiService from '@/services/configs/api.service'

const cadreLogiqueService = {

  get(slug) {
    return ApiService.get(`projets/${slug}/cadreLogique/`);
  }

};

export default cadreLogiqueService;

