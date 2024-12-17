import Institution from './institution';

import {
    SET_LIST as SET_LIST_INSTITUTION,
    ADD as ADD_NEW_INSTITUTION,
    FILL,
    MODIFY as MODIFY_INSTITUTION,
    REMOVE as REMOVE_INSTITUTION
} from "../../mutations.type";

export default {

    [SET_LIST_INSTITUTION](state, lists) {
        state.lists = lists
        localStorage.setItem('institutions', JSON.stringify(lists))
    },

    [FILL](state, institution) {
        state.institution = new Institution(institution)
    },

    [ADD_NEW_INSTITUTION](state, institution) {
        state.lists.unshift(institution)
    },

    [MODIFY_INSTITUTION](state, institution) {

        let institutions = state.lists.map(item => {
            if(item.id === institution?.id){
                item = institution
            }
            return item
        })

        state.lists = [...institutions]

        localStorage.setItem('institutions', JSON.stringify(state.lists))
    },

    [REMOVE_INSTITUTION](state, idInstitution) {
        let institutions = state.lists.filter(item => {
            return item.id !== idInstitution
        });
    
        state.lists = [...institutions]
        localStorage.setItem('institutions', JSON.stringify(state.lists))
    },
};
