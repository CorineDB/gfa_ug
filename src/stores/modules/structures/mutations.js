import Mod from './structure';

import {
    SET_LIST as SET_LIST_STRUCTURE,
    
} from "../../mutations.type";

export default {

    [SET_LIST_STRUCTURE](state, lists) {
        state.lists = lists
        localStorage.setItem('structures', JSON.stringify(lists))
    },

};
