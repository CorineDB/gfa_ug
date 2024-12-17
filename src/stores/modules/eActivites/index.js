
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import EActivite from './eActivite'

const state = () => ({
  errors: [],
  eActivites: {
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
  eActivite : new EActivite()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
