
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Pap from './pap'

const state = () => ({
  errors: [],
  paps: {
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
  pap : new Pap()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
