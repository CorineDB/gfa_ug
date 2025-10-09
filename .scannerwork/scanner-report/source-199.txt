
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import MissionDeControle from './mission.controle'

const state = () => ({
  errors: [],
  missionDeControles: {
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
  missionDeControle : new MissionDeControle()
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
