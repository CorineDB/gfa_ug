import Categorie from './categorie';

import {
    SET_LIST as SET_LIST_CATEGORIE,
    ADD as ADD_NEW_CATEGORIE,
    FILL,
    MODIFY as MODIFY_CATEGORIE,
    REMOVE as REMOVE_CATEGORIE
} from "@/store/mutations.type";

export default {

    [SET_LIST_CATEGORIE](state, lists) {
        state.lists = lists
        localStorage.setItem('categories', JSON.stringify(lists))
    },

    [FILL](state, categorie) {
        state.categorie = new Categorie(categorie)
    },

    [ADD_NEW_CATEGORIE](state, categorie) {
        state.lists.unshift(categorie)
    },

    [MODIFY_CATEGORIE](state, categorie) {

        let categories = state.lists.map(item => {
            if(item.id === categorie?.id){
                item = categorie
            }
            return item
        })

        state.lists = [...categories]

        localStorage.setItem('categories', JSON.stringify(state.lists))
    },

    [REMOVE_CATEGORIE](state, idCategorie) {
        let bailleurs = state.lists.filter(item => {
            return item.id !== idCategorie
        });
    
        state.lists = [...bailleurs]
        localStorage.setItem('categories', JSON.stringify(state.lists))
    },
};
