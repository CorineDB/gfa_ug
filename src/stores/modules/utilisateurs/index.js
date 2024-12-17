
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Utilisateur from './utilisateur'

const state = () => ({
  errors: [],
  utilisateurs: {
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
  utilisateur : new Utilisateur()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
