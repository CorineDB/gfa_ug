import Composante from './composante';

import {
    SET_LIST as SET_LIST_COMPOSANTE,
    ADD as ADD_NEW_COMPOSANTE,
    FILL,
    MODIFY as MODIFY_COMPOSANTE,
    REMOVE as REMOVE_COMPOSANTE
} from "@/store/mutations.type";

export default {

    [SET_LIST_COMPOSANTE](state, lists) {
        state.lists = lists
        localStorage.setItem('composantes', JSON.stringify(lists))
    },

    SET_LIST_COMPOSANTES(state, lists) {
        state.lists = lists
    },

    [FILL](state, composante) {
        state.composante = new Composante(composante)
    },

    [ADD_NEW_COMPOSANTE](state, composante) {
        state.lists.unshift(composante)
    },

    [MODIFY_COMPOSANTE](state, composante) {

        let composantes = state.lists.map(item => {
            if(item.id === composante?.id){
                item = composante
            }
            return item
        })

        state.lists = [...composantes]

        localStorage.setItem('composantes', JSON.stringify(state.lists))
    },

    [REMOVE_COMPOSANTE](state, idComposante) {
        let composantes = state.lists.filter(item => {
            return item.id !== idComposante
        });
    
        state.lists = [...composantes]
        localStorage.setItem('composantes', JSON.stringify(state.lists))
    },
};
