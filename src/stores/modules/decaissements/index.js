
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Decaissement from './decaissement'

const state = () => ({
  errors: [],
  decaissements: {
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
  decaissement : new Decaissement()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
