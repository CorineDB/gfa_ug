
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Gouvernement from './gouvernements'

const state = () => ({
  errors: [],
  gouvernements: {
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
  gouvernement : new Gouvernement()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
