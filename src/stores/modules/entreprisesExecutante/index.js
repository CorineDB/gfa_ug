
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import EntrepriseExecutante from './entreprise.executante';

const state = () => ({
  errors: [],
  entreprisesExecutante: {
    "currentPage" : null,
    "data" : [],
    "firstPageURL" : null,
    "from" : null,
    "lastPage" : null,
    "lastPageURL" : null,
    "links" : null,
    "nextPageURL" : null,
    "path" : null,
    "perPage" : null,
    "prevPage" : null,
    "from" : null,
    "total" : null
  },
  lists: [],
  entrepriseExecutante : new EntrepriseExecutante()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
