import Utilisateur from './utilisateur';

import {
    SET_LIST as SET_UTILISATEUR,
    ADD as ADD_NEW_UTILISATEUR,
    FILL,
    MODIFY as MODIFFY_UTILISATEUR,
    REMOVE as REMOVE_UTILISATEUR
} from "../../mutations.type";

export default {

    [SET_UTILISATEUR](state, lists) {
        state.lists = lists
        localStorage.setItem('utilisateurs', JSON.stringify(lists))
    },

    [FILL](state, utilisateur) {
        state.utilisateur = new Utilisateur(utilisateur)
    },

    [ADD_NEW_UTILISATEUR](state, utilisateur) {
        state.lists.unshift(utilisateur)
    },

    [MODIFFY_UTILISATEUR](state, utilisateur) {

        let utilisateurs = state.lists.map(item => {
            if(item.id === utilisateur?.id){
                item = utilisateur
            }
            return item
        })

        state.lists = [...utilisateurs]

        localStorage.setItem('utilisateurs', JSON.stringify(state.lists))
    },

    [REMOVE_UTILISATEUR](state, idUtilisateurs) {
        let utilisateurs = state.lists.filter(item => {
            return item.id !== idUtilisateurs
        });
    
        state.lists = [...utilisateurs]
        localStorage.setItem('utilisateurs', JSON.stringify(state.lists))
    },
};
