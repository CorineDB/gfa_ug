
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Passation from './passation'

const state = () => ({
  errors: [],
  passations: {
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
  passation : new Passation()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
