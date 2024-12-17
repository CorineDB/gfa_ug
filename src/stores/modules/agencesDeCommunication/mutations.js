import AgenceDeCommunication from "./agence.communication";

import { SET_LIST as SET_LIST_AGENCE_DE_COMMUNICATION, ADD as ADD_NEW_AGENCE_DE_COMMUNICATION, FILL, MODIFY as MODIFY_AGENCE_DE_COMMUNICATION, REMOVE as REMOVE_AGENCE_DE_COMMUNICATION } from "../../mutations.type";

export default {

    [SET_LIST_AGENCE_DE_COMMUNICATION](state, lists) {
        state.lists = lists
        localStorage.setItem('agences-de-communication', JSON.stringify(lists))
    },

    [FILL](state, agenceDeCommunication) {
        state.agenceDeCommunication = new AgenceDeCommunication(agenceDeCommunication)
    },

    [ADD_NEW_AGENCE_DE_COMMUNICATION](state, agenceDeCommunication) {
        state.lists.unshift(agenceDeCommunication)
    },

    [MODIFY_AGENCE_DE_COMMUNICATION](state, agenceDeCommunication) {

        let agencesDeCommunication = state.lists.map(item => {
            if(item.id === agenceDeCommunication?.id){
                item = agenceDeCommunication
            }
            return item
        })

        state.lists = [...agencesDeCommunication]

        localStorage.setItem('agences-de-communication', JSON.stringify(state.lists))
    },

    [REMOVE_AGENCE_DE_COMMUNICATION](state, idAgenceDeCommunication) {
        let agencesDeCommunication = state.lists.filter(item => {
            return item.id !== idAgenceDeCommunication
        });
    
        state.lists = [...agencesDeCommunication]
        localStorage.setItem('agences-de-communication', JSON.stringify(state.lists))
    },
};
