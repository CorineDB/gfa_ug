
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import UniteeDeMesure from './unitee.mesure'

const state = () => ({
  errors: [],
  uniteesDeMesure: {
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
  uniteeDeMesure : new UniteeDeMesure()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
