
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import Categorie from './categorie'

const state = () => ({
  errors: [],
  categories: {
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
  categorie : new Categorie()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
