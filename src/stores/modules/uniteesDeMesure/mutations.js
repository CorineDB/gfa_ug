import UniteeDeMesure from './unitee.mesure';

import {
    SET_LIST as SET_LIST_UNITEE_DE_MESURE,
    ADD as ADD_NEW_UNITEE_DE_MESURE,
    FILL,
    MODIFY as MODIFY_UNITEE_DE_MESURE,
    REMOVE as REMOVE_UNITEE_DE_MESURE
} from "@/store/mutations.type";

export default {

    [SET_LIST_UNITEE_DE_MESURE](state, lists) {
        state.lists = lists
        localStorage.setItem('unitees-de-mesure', JSON.stringify(lists))
    },

    [FILL](state, uniteeDeMesure) {
        state.uniteeDeMesure = new UniteeDeMesure(uniteeDeMesure)
    },

    [ADD_NEW_UNITEE_DE_MESURE](state, uniteeDeMesure) {
        state.lists.unshift(uniteeDeMesure)
    },

    [MODIFY_UNITEE_DE_MESURE](state, uniteeDeMesure) {

        let uniteesDeMesure = state.lists.map(item => {
            if(item.id === uniteeDeMesure?.id){
                item = uniteeDeMesure
            }
            return item
        })

        state.lists = [...uniteesDeMesure]

        localStorage.setItem('unitees-de-mesure', JSON.stringify(state.lists))
    },

    [REMOVE_UNITEE_DE_MESURE](state, idUniteeDeMesure) {
        let uniteesDeMesure = state.lists.filter(item => {
            return item.id !== idUniteeDeMesure
        });
    
        state.lists = [...uniteesDeMesure]
        localStorage.setItem('unitees-de-mesure', JSON.stringify(state.lists))
    },
};
