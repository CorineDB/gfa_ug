import Passation from './passation';

import {
    SET_LIST as SET_LIST_PASSATION,
    ADD as ADD_NEW_PASSATION,
    FILL,
    MODIFY as MODIFY_PASSATION,
    REMOVE as REMOVE_PASSATION
} from "@/store/mutations.type";

export default {

    [SET_LIST_PASSATION](state, lists) {
        state.lists = lists
        localStorage.setItem('passations', JSON.stringify(lists))
    },

    [FILL](state, passation) {
        state.passation = new Passation(passation)
    },

    [ADD_NEW_PASSATION](state, passation) {
        state.lists.unshift(passation)
    },

    [MODIFY_PASSATION](state, passation) {

        let passations = state.lists.map(item => {
            if(item.id === passation?.id){
                item = passation
            }
            return item
        })

        state.lists = [...passations]

        localStorage.setItem('passations', JSON.stringify(state.lists))
    },

    [REMOVE_PASSATION](state, idPassation) {
        let passations = state.lists.filter(item => {
            return item.id !== idPassation
        });
    
        state.lists = [...passations]
        localStorage.setItem('passations', JSON.stringify(state.lists))
    },
};
