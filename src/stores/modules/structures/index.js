
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Structure from './structure'

const state = () => ({
  errors: [],
  structures: {
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
  structure : new Structure()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
