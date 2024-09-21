import Composante from './composante';

import {
    SET_LIST as SET_LIST_SOUS_COMPOSANTE,
    ADD as ADD_NEW_SOUS_COMPOSANTE,
    FILL,
    MODIFY as MODIFY_SOUS_COMPOSANTE,
    REMOVE as REMOVE_SOUS_COMPOSANTE
} from "@/store/mutations.type";

export default {

    [SET_LIST_SOUS_COMPOSANTE](state, lists) {
        state.lists = lists
        localStorage.setItem('sous-composantes', JSON.stringify(lists))
    },

    SET_LIST_SOUSCOMPOSANTE(state, lists) {
        state.lists = lists
    },
    
    [FILL](state, sousComposante) {
        state.sousComposante = new Composante(sousComposante)
    },

    [ADD_NEW_SOUS_COMPOSANTE](state, sousComposante) {
        state.lists.unshift(sousComposante)
    },

    [MODIFY_SOUS_COMPOSANTE](state, sousComposante) {

        let sousComposantes = state.lists.map(item => {
            if(item.id === sousComposante?.id){
                item = sousComposante
            }
            return item
        })

        state.lists = [...sousComposantes]

        localStorage.setItem('sous-composantes', JSON.stringify(state.lists))
    },

    [REMOVE_SOUS_COMPOSANTE](state, idSousComposante) {
        let sousComposantes = state.lists.filter(item => {
            return item.id !== idSousComposante
        });
    
        state.lists = [...sousComposantes]
        localStorage.setItem('sous-composantes', JSON.stringify(state.lists))
    },
};
