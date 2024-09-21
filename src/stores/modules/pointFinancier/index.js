
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import PointFinancier from './pointFinancier'

const state = () => ({
  errors: [],
  activites: {
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
    "total" : null,
    
  },
  lists: [],
  pointFinancier : new PointFinancier()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
