import ApiService from "@/services/configs/api.service";

const SyntheseService = {
  // getters services
  get(enqueteDeCollecteId, organisationId) {
    return ApiService.get(`gfa/enquetes-de-collecte/${enqueteDeCollecteId}/resultats/${organisationId}`);
  },

  getOrganizations(slug) {
    return ApiService.get(`gfa/organisations`);
  },
};

export default SyntheseService;
