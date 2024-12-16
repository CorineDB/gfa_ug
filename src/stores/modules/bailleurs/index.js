
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Bailleur from './bailleur'

const state = () => ({
  errors: [],
  bailleurs: {
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
  bailleur : new Bailleur()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
