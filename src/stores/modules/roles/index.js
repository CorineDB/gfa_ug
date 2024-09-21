
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Role from './role'

const state = () => ({
  errors: [],
  indicateurs: {
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
  role : new Role()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
