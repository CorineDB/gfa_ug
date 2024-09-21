import Mod from './mod';

import {
    SET_LIST as SET_LIST_MOD,
    ADD as ADD_NEW_MOD,
    FILL,
    MODIFY as MODIFY_MOD,
    REMOVE as REMOVE_MOD
} from "@/store/mutations.type";

export default {

    [SET_LIST_MOD](state, lists) {
        state.lists = lists
        localStorage.setItem('mods', JSON.stringify(lists))
    },

    [FILL](state, mod) {
        state.mod = new Mod(mod)
    },

    [ADD_NEW_MOD](state, mod) {
        state.lists.unshift(mod)
    },

    [MODIFY_MOD](state, mod) {

        let mods = state.lists.map(item => {
            if(item.id === mod?.id){
                item = mod
            }
            return item
        })

        state.lists = [...mods]

        localStorage.setItem('mods', JSON.stringify(state.lists))
    },

    [REMOVE_MOD](state, idMod) {
        let mods = state.lists.filter(item => {
            return item.id !== idMod
        });
    
        state.lists = [...mods]
        localStorage.setItem('mods', JSON.stringify(state.lists))
    },
};
