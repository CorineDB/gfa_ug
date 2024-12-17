
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Suivi from './suivi'

const state = () => ({
  errors: [],
  suivis: {
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
  suivi : new Suivi()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
