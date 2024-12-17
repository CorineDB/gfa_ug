
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Ong from './ong'

const state = () => ({
  errors: [],
  ongs: {
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
  ong : new Ong()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
