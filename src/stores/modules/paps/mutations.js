import Pap from './pap';

import {
    SET_LIST as SET_LIST_PAP,
    ADD as ADD_NEW_PAP,
    FILL,
    MODIFY as MODIFY_PAP,
    REMOVE as REMOVE_PAP
} from "../../mutations.type";

export default {

    [SET_LIST_PAP](state, lists) {
        state.lists = lists
        localStorage.setItem('paps', JSON.stringify(lists))
    },

    [FILL](state, pap) {
        state.pap = new Pap(pap)
    },

    [ADD_NEW_PAP](state, pap) {
        state.lists.unshift(pap)
    },

    [MODIFY_PAP](state, pap) {

        let paps = state.lists.map(item => {
            if(item.id === pap?.id){
                item = pap
            }
            return item
        })

        state.lists = [...paps]

        localStorage.setItem('paps', JSON.stringify(state.lists))
    },

    [REMOVE_PAP](state, idPap) {
        let paps = state.lists.filter(item => {
            return item.id !== idPap
        });
    
        state.lists = [...paps]
        localStorage.setItem('paps', JSON.stringify(state.lists))
    },
};
