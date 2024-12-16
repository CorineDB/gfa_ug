import Decaissement from './decaissement';

import {
    SET_LIST as SET_LIST_DECAISSEMENT,
    ADD as ADD_NEW_DECAISSEMENT,
    FILL,
    MODIFY as MODIFY_DECAISSEMENT,
    REMOVE as REMOE_DECAISSEMENT
} from "../../mutations.type";

export default {

    [SET_LIST_DECAISSEMENT](state, lists) {
        state.lists = lists
        localStorage.setItem('decaissements', JSON.stringify(lists))
    },

    [FILL](state, decaissement) {
        state.decaissement = new Decaissement(decaissement)
    },

    [ADD_NEW_DECAISSEMENT](state, decaissement) {
        state.lists.unshift(decaissement)
    },

    [MODIFY_DECAISSEMENT](state, decaissement) {

        let decaissements = state.lists.map(item => {
            if(item.id === decaissement?.id){
                item = decaissement
            }
            return item
        })

        state.lists = [...decaissements]

        localStorage.setItem('decaissements', JSON.stringify(state.lists))
    },

    [REMOE_DECAISSEMENT](state, idDecaissement) {
        let decaissements = state.lists.filter(item => {
            return item.id !== idDecaissement
        });
    
        state.lists = [...decaissements]
        localStorage.setItem('decaissements', JSON.stringify(state.lists))
    },
};
