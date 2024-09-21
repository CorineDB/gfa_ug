import Indicateur from './indicateur';

import {
    SET_LIST as SET_LIST_INDICATEUR,
    ADD as ADD_NEW_INDICATEUR,
    FILL,
    MODIFY as MODIFY_INDICATEUR,
    REMOVE as REMOVE_INDICATEUR,
} from "@/store/mutations.type";

export default {

    [SET_LIST_INDICATEUR](state, lists) {
        state.lists = lists
        localStorage.setItem('indicateurs', JSON.stringify(lists))
    },

    [FILL](state, indicateur) {
        state.indicateur = new Indicateur(indicateur)
    },

    [ADD_NEW_INDICATEUR](state, indicateur) {
        state.lists.unshift(indicateur)
    },

    [MODIFY_INDICATEUR](state, indicateur) {

        let indicateurs = state.lists.map(item => {
            if(item.id === indicateur?.id){
                item = indicateur
            }
            return item
        })

        state.lists = [...indicateurs]

        localStorage.setItem('indicateurs', JSON.stringify(state.lists))
    },

    [REMOVE_INDICATEUR](state, idIndicateur) {
        let indicateurs = state.lists.filter(item => {
            return item.id !== idIndicateur
        });
    
        state.lists = [...indicateurs]
        localStorage.setItem('indicateurs', JSON.stringify(state.lists))
    },
};
