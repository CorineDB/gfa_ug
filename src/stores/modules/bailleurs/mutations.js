import Bailleur from './bailleur';

import {
    SET_LIST as SET_LIST_BAILLEUR,
    ADD as ADD_NEW_BAILLEUR,
    FILL,
    MODIFY as MODIFY_BAILLEUR,
    REMOVE as REMOVE_BAILLEUR
} from "@/store/mutations.type";

export default {

    [SET_LIST_BAILLEUR](state, lists) {
        state.lists = lists
        localStorage.setItem('bailleurs', JSON.stringify(lists))
    },

    [FILL](state, bailleur) {
        state.bailleur = new Bailleur(bailleur)
    },

    [ADD_NEW_BAILLEUR](state, bailleur) {
        state.lists.unshift(bailleur)
    },

    [MODIFY_BAILLEUR](state, bailleur) {

        let bailleurs = state.lists.map(item => {
            if(item.id === bailleur?.id){
                item = bailleur
            }
            return item
        })

        state.lists = [...bailleurs]

        localStorage.setItem('bailleurs', JSON.stringify(state.lists))
    },

    [REMOVE_BAILLEUR](state, idBailleur) {
        let bailleurs = state.lists.filter(item => {
            return item.id !== idBailleur
        });
    
        state.lists = [...bailleurs]
        localStorage.setItem('bailleurs', JSON.stringify(state.lists))
    },
};
