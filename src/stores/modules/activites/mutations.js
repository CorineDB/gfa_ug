import Activite from './activite';

import {
    SET_LIST as SET_LIST_ACTIVITE,
    ADD as ADD_NEW_ACTIVITE,
    FILL,
    MODIFY as MODIFY_ACTIVITE,
    REMOVE as REMOVE_ACTIVITE
} from "@/store/mutations.type";

export default {

    [SET_LIST_ACTIVITE](state, lists) {
        state.lists = lists
        localStorage.setItem('activites', JSON.stringify(lists))
    },

    [FILL](state, activite) {
        state.activite = new Activite(activite)
    },

    [ADD_NEW_ACTIVITE](state, activite) {
        state.lists.unshift(activite)
    },

    [MODIFY_ACTIVITE](state, activite) {

        let activites = state.lists.map(item => {
            if(item.id === activite?.id){
                item = activite
            }
            return item
        })

        state.lists = [...activites]

        localStorage.setItem('activites', JSON.stringify(state.lists))
    },

    [REMOVE_ACTIVITE](state, idActivite) {
        let activites = state.lists.filter(item => {
            return item.id !== idActivite
        });
    
        state.lists = [...activites]
        localStorage.setItem('activites', JSON.stringify(state.lists))
    },
};
