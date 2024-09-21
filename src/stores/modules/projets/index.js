
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Projet from './projet'

const state = () => ({
  errors: [],
  projets: {
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
  projet : new Projet()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
