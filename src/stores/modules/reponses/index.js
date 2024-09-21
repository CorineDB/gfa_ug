
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Reponse from './reponse'

const state = () => ({
  errors: [],
  reponses: {
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
  reponse : new Reponse()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
