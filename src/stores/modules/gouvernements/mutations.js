import Gouvernement from './gouvernements';

import {
    SET_LIST as SET_LIST_GOUVERNEMENT,
    ADD as ADD_NEW_GOUVERNEMENT,
    FILL,
    MODIFY as MODIFY_GOUVERNEMENT,
    REMOVE as REMOVE_GOUVERNEMENT
} from "../../mutations.type";

export default {

    [SET_LIST_GOUVERNEMENT](state, lists) {
        state.lists = lists
        localStorage.setItem('gouvernements', JSON.stringify(lists))
    },

    [FILL](state, gouvernement) {
        state.gouvernement = new Gouvernement(gouvernement)
    },

    [ADD_NEW_GOUVERNEMENT](state, gouvernement) {
        state.lists.unshift(gouvernement)
    },

    [MODIFY_GOUVERNEMENT](state, gouvernement) {

        let gouvernements = state.lists.map(item => {
            if(item.id === gouvernement?.id){
                item = gouvernement
            }
            return item
        })

        state.lists = [...gouvernements]

        localStorage.setItem('gouvernements', JSON.stringify(state.lists))
    },

    [REMOVE_GOUVERNEMENT](state, idGouvernement) {
        let gouvernements = state.lists.filter(item => {
            return item.id !== idGouvernement
        });
    
        state.lists = [...gouvernements]
        localStorage.setItem('gouvernements', JSON.stringify(state.lists))
    },
};
