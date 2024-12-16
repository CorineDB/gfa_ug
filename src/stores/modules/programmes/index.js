import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Programme from './programme'

const state = () => ({
  errors: [],
  programmes: {
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
  programme : new Programme()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
