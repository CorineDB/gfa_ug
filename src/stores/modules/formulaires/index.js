import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Formulaire from './formulaire'

const state = () => ({
  errors: [],
  formulaires: {
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
  formulaire : new Formulaire()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
