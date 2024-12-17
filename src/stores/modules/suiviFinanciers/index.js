
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import SuiviFinancier from './suiviFinancier'

const state = () => ({
  errors: [],
  suiviFinanciers: {
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
  suiviFinancier : new SuiviFinancier()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
