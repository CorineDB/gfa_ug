import Ong from './ong';

import {
    SET_LIST as SET_LIST_ONG,
    ADD as ADD_NEW_ONG,
    FILL,
    MODIFY as MODIFY_ONG,
    REMOVE as REMOVE_ONG
} from "../../mutations.type";

export default {

    [SET_LIST_ONG](state, lists) {
        state.lists = lists
        localStorage.setItem('ongs', JSON.stringify(lists))
    },

    [FILL](state, ong) {
        state.ong = new Ong(ong)
    },

    [ADD_NEW_ONG](state, ong) {
        state.lists.unshift(ong)
    },

    [MODIFY_ONG](state, ong) {

        let ongs = state.lists.map(item => {
            if(item.id === ong?.id){
                item = ong
            }
            return item
        })

        state.lists = [...ongs]

        localStorage.setItem('ongs', JSON.stringify(state.lists))
    },

    [REMOVE_ONG](state, idOng) {
        let ongs = state.lists.filter(item => {
            return item.id !== idOng
        });
    
        state.lists = [...ongs]
        localStorage.setItem('ongs', JSON.stringify(state.lists))
    },
};
