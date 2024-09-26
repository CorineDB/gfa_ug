import EActivite from './eActivite';

import {
    SET_LIST as SET_LIST_EACTIVITE,
    ADD as ADD_NEW_EACTIVITE,
    FILL,
    MODIFY as MODIFY_EACTIVITE,
    REMOVE as REMOVE_EACTIVITE
} from "../../mutations.type";

export default {

    [SET_LIST_EACTIVITE](state, lists) {
        state.lists = lists
        localStorage.setItem('eActivites', JSON.stringify(lists))
    },

    [FILL](state, eActivite) {
        state.eActivite = new EActivite(eActivite)
    },

    [ADD_NEW_EACTIVITE](state, eActivite) {
        state.lists.unshift(eActivite)
    },

    [MODIFY_EACTIVITE](state, eActivite) {

        let eActivites = state.lists.map(item => {
            if(item.id === eActivite?.id){
                item = eActivite
            }
            return item
        })

        state.lists = [...eActivites]

        localStorage.setItem('eActivites', JSON.stringify(state.lists))
    },

    [REMOVE_EACTIVITE](state, idEActivite) {
        let eActivites = state.lists.filter(item => {
            return item.id !== idEActivite
        });
    
        state.lists = [...eActivites]
        localStorage.setItem('eActivites', JSON.stringify(state.lists))
    },
};
