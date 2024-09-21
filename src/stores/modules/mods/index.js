
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Mod from './mod'

const state = () => ({
  errors: [],
  mods: {
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
  mod : new Mod()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
