import Reponse from './reponse';

import {
    SET_LIST as SET_LIST_REPONSE,
    ADD as ADD_NEW_REPONSE,
    FILL,
    MODIFY as MODIFY_REPONSE,
    REMOVE as REMOVE_REPONSE
} from "../../mutations.type";

export default {

    [SET_LIST_REPONSE](state, lists) {
        state.lists = lists
        localStorage.setItem('reponses', JSON.stringify(lists))
    },

    [FILL](state, reponse) {
        state.reponse = new Reponse(reponse)
    },

    [ADD_NEW_REPONSE](state, reponse) {
        state.lists.unshift(reponse)
    },

    [MODIFY_REPONSE](state, reponse) {

        let reponses = state.lists.map(item => {
            if(item.id === reponse?.id){
                item = reponse
            }
            return item
        })

        state.lists = [...reponses]

        localStorage.setItem('reponses', JSON.stringify(state.lists))
    },

    [REMOVE_REPONSE](state, idReponse) {
        let reponses = state.lists.filter(item => {
            return item.id !== idReponse
        });
    
        state.lists = [...reponses]
        localStorage.setItem('reponses', JSON.stringify(state.lists))
    },
};
