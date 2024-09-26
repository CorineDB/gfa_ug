import ESuivi from './eSuivi';

import {
    SET_LIST as SET_LIST_ESUIVI,
    ADD as ADD_NEW_ESUIVI,
    FILL,
    MODIFY as MODIFY_ESUIVI,
    REMOVE as REMOVE_ESUIVI
} from "../../mutations.type";

export default {

    [SET_LIST_ESUIVI](state, lists) {
        state.lists = lists
        localStorage.setItem('eSuivis', JSON.stringify(lists))
    },

    [FILL](state, eSuivi) {
        state.eSuivi = new ESuivi(eSuivi)
    },

    [ADD_NEW_ESUIVI](state, eSuivi) {
        state.lists.unshift(eSuivi)
    },

    [MODIFY_ESUIVI](state, eSuivi) {

        let eSuivis = state.lists.map(item => {
            if(item.id === eSuivi?.id){
                item = eSuivi
            }
            return item
        })

        state.lists = [...eSuivis]

        localStorage.setItem('eSuivis', JSON.stringify(state.lists))
    },

    [REMOVE_ESUIVI](state, idESuivi) {
        let eSuivis = state.lists.filter(item => {
            return item.id !== idESuivi
        });
    
        state.lists = [...eSuivis]
        localStorage.setItem('eSuivis', JSON.stringify(state.lists))
    },
};
