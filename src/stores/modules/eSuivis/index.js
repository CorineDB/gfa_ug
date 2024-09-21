
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import ESuivi from './eSuivi'

const state = () => ({
  errors: [],
  eSuivis: {
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
  eSuivi : new ESuivi()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
