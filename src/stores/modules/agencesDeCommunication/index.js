
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import AgenceDeCommunication from './agence.communication'

const state = () => ({
  errors: [],
  agencesDeCommunication: {
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
  agenceDeCommunication : new AgenceDeCommunication()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
