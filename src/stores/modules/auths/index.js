
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = () => ({
  authenticateUser : null,
  access_token : null,
  identifiant : {
    "email" : null,
    "password" : null
  }
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
