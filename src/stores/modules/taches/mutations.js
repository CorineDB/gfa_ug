import Tache from './tache';

import {
    SET_LIST as SET_LIST_TACHE,
    ADD as ADD_NEW_TACHE,
    FILL,
    MODIFY as MODIFY_TACHE,
    REMOVE as REMOVE_TACHE
} from "../../mutations.type";

export default {

    [SET_LIST_TACHE](state, lists) {
        state.lists = lists
        localStorage.setItem('taches', JSON.stringify(lists))
    },

    [FILL](state, tache) {
        state.tache = new Tache(tache)
    },

    [ADD_NEW_TACHE](state, tache) {
        state.lists.unshift(tache)
    },

    [MODIFY_TACHE](state, tache) {

        let taches = state.lists.map(item => {
            if(item.id === tache?.id){
                item = tache
            }
            return item
        })

        state.lists = [...taches]

        localStorage.setItem('taches', JSON.stringify(state.lists))
    },

    [REMOVE_TACHE](state, idTache) {
        let taches = state.lists.filter(item => {
            return item.id !== idTache
        });
    
        state.lists = [...taches]
        localStorage.setItem('taches', JSON.stringify(state.lists))
    },
};
