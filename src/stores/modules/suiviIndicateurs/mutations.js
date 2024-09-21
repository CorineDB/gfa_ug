import Suivi from './suivi';

import {
    SET_LIST as SET_LIST_SUIVI,
    ADD as ADD_NEW_SUIVI,
    FILL,
    MODIFY as MODIFY_SUIVI,
    REMOVE as REMOVE_SUIVI,
} from "@/store/mutations.type";

export default {

    [SET_LIST_SUIVI](state, lists) {
        state.lists = lists
        localStorage.setItem('suvi-indicateurs', JSON.stringify(lists))
    },

    [FILL](state, suivi) {
        state.suivi = new Suivi(suivi)
    },

    [ADD_NEW_SUIVI](state, suivi) {
        state.lists.unshift(suivi)
    },

    [MODIFY_SUIVI](state, suivi) {

        let suivis = state.lists.map(item => {
            if(item.id === suivi?.id){
                item = suivi
            }
            return item
        })

        state.lists = [...suivis]

        localStorage.setItem('suvi-indicateurs', JSON.stringify(state.lists))
    },

    [REMOVE_SUIVI](state, IdSuivi) {
        let suivis = state.lists.filter(item => {
            return item.id !== IdSuivi
        });
    
        state.lists = [...suivis]
        localStorage.setItem('suivi-indicateurs', JSON.stringify(state.lists))
    },
};
