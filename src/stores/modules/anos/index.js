
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Ano from './ano'

const state = () => ({
  errors: [],
  anos: {
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
  ano : new Ano()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
