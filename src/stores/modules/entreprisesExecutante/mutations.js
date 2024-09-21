import EntrepriseExecutante from './entreprise.executante';

import {
    SET_LIST as SET_LIST_ENTREPRISE_EXECUTANTE,
    ADD as ADD_NEW_ENTREPRISE_EXECUTANTE,
    FILL,
    MODIFY as MODIFY_ENTREPRISE_EXECUTANTE,
    REMOVE as REMOVE_ENTREPRISE_EXECUTANTE
} from "@/store/mutations.type";

export default {

    [SET_LIST_ENTREPRISE_EXECUTANTE](state, lists) {
        state.lists = lists
        localStorage.setItem('entreprises-executante', JSON.stringify(lists))
    },

    [FILL](state, entrepriseExecutante) {
        state.entrepriseExecutante = new EntrepriseExecutante(entrepriseExecutante)
    },

    [ADD_NEW_ENTREPRISE_EXECUTANTE](state, entrepriseExecutante) {
        state.lists.unshift(entrepriseExecutante)
    },

    [MODIFY_ENTREPRISE_EXECUTANTE](state, entrepriseExecutante) {

        let entreprisesExecutante = state.lists.map(item => {
            if(item.id === entrepriseExecutante?.id){
                item = entrepriseExecutante
            }
            return item
        })

        state.lists = [...entreprisesExecutante]

        localStorage.setItem('entreprises-executante', JSON.stringify(state.lists))
    },

    [REMOVE_ENTREPRISE_EXECUTANTE](state, idEntrepriseExecutante) {
        let entreprisesExecutante = state.lists.filter(item => {
            return item.id !== idEntrepriseExecutante
        });
    
        state.lists = [...entreprisesExecutante]
        localStorage.setItem('entreprises-executante', JSON.stringify(state.lists))
    },
};
