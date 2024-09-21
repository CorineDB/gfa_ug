import Projet from './projet';

import {
    SET_LIST as SET_LIST_PROJET,
    ADD as ADD_NEW_PROJET,
    FILL,
    MODIFY as MODIFY_PROJET,
    REMOVE as REMOVE_PROJET
} from "@/store/mutations.type";

export default {

    [SET_LIST_PROJET](state, lists) {
        state.lists = lists
        localStorage.setItem('projets', JSON.stringify(lists))
    },

    [FILL](state, projet) {
        state.projet = new Projet(projet)
    },

    [ADD_NEW_PROJET](state, projet) {
        state.lists.unshift(projet)
    },

    [MODIFY_PROJET](state, projet) {

        let projets = state.lists.map(item => {
            if(item.id === projet?.id){
                item = projet
            }
            return item
        })

        state.lists = [...projets]

        localStorage.setItem('projets', JSON.stringify(state.lists))
    },

    [REMOVE_PROJET](state, idProjet) {
        let projets = state.lists.filter(item => {
            return item.id !== idProjet
        });
    
        state.lists = [...projets]
        localStorage.setItem('projets', JSON.stringify(state.lists))
    },
};
