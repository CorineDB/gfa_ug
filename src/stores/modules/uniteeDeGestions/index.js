
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import UniteeDeGestion from './unitee.gestion'

const state = () => ({
  errors: [],
  uniteeDeGestions: {
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
  uniteeDeGestion : new UniteeDeGestion()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
