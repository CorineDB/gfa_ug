import Formulaire from './formulaire';

import {
    SET_LIST as SET_LIST_FORMULAIRE,
    ADD as ADD_NEW_FORMULAIRE,
    FILL,
    MODIFY as MODIFY_FORMULAIRE,
    REMOVE as REMOVE_FORMULAIRE
} from "../../mutations.type";

export default {

    [SET_LIST_FORMULAIRE](state, lists) {
        state.lists = lists
        localStorage.setItem('formulaires', JSON.stringify(lists))
    },

    [FILL](state, formulaire) {
        state.formulaire = new Formulaire(formulaire)
    },

    [ADD_NEW_FORMULAIRE](state, formulaire) {
        state.lists.unshift(formulaire)
    },

    [MODIFY_FORMULAIRE](state, formulaire) {

        let formulaires = state.lists.map(item => {
            if(item.id === formulaire?.id){
                item = formulaire
            }
            return item
        })

        state.lists = [...formulaires]

        localStorage.setItem('formulaires', JSON.stringify(state.lists))
    },

    [REMOVE_FORMULAIRE](state, idFormulaire) {
        let formulaires = state.lists.filter(item => {
            return item.id !== idFormulaire
        });
    
        state.lists = [...formulaires]
        localStorage.setItem('formulaires', JSON.stringify(state.lists))
    },
};
