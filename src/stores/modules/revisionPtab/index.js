
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import ScopePtab from './scope.ptab'

const state = () => ({
  errors: [],
  scopePtab: {
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
  revisionPtab : new ScopePtab()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
