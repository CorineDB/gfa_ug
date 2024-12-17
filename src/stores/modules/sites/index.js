
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Site from './site'

const state = () => ({
  errors: [],
  sites: {
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
  site : new Site()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
