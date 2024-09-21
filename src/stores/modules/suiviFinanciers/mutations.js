import SuiviFinancier from './suiviFinancier';

import {
    SET_LIST as SET_LIST_SUIVIFINANCIER,
    ADD as ADD_NEW_SUIVIFINANCIER,
    FILL,
    MODIFY as MODIFY_SUIVIFINANCIER,
    REMOVE as REMOVE_SUIVIFINANCIER
} from "@/store/mutations.type";

export default {

    [SET_LIST_SUIVIFINANCIER](state, lists) {
        state.lists = lists
        localStorage.setItem('suiviFinanciers', JSON.stringify(lists))
    },

    [FILL](state, suiviFinancier) {
        state.suiviFinancier = new SuiviFinancier(suiviFinancier)
    },

    [ADD_NEW_SUIVIFINANCIER](state, suiviFinancier) {
        state.lists.unshift(suiviFinancier)
    },

    [MODIFY_SUIVIFINANCIER](state, suiviFinancier) {

        let suiviFinanciers = state.lists.map(item => {
            if(item.id === suiviFinancier?.id){
                item = suiviFinancier
            }
            return item
        })

        state.lists = [...suiviFinanciers]

        localStorage.setItem('suiviFinanciers', JSON.stringify(state.lists))
    },

    [REMOVE_SUIVIFINANCIER](state, idSuiviFinancier) {
        let suiviFinanciers = state.lists.filter(item => {
            return item.id !== idSuiviFinancier
        });
    
        state.lists = [...suiviFinanciers]
        localStorage.setItem('suiviFinanciers', JSON.stringify(state.lists))
    },
};
