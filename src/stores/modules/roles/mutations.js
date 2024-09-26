import Role from './role';

import {
    SET_LIST as SET_LIST_ROLE,
    ADD as ADD_NEW_ROLE,
    FILL,
    MODIFY as MODIFY_ROLE,
    REMOVE as REMOVE_ROLE,
} from "../../mutations.type";

export default {

    [SET_LIST_ROLE](state, lists) {
        state.lists = lists
        localStorage.setItem('roles', JSON.stringify(lists))
    },

    [FILL](state, role) {
        state.role = new Role(role)
    },

    [ADD_NEW_ROLE](state, role) {
        state.lists.unshift(role)
    },

    [MODIFY_ROLE](state, role) {

        let roles = state.lists.map(item => {
            if(item.id === role?.id){
                item = role
            }
            return item
        })

        state.lists = [...roles]

        localStorage.setItem('roles', JSON.stringify(state.lists))
    },

    [REMOVE_ROLE](state, idRole) {
        let roles = state.lists.filter(item => {
            return item.id !== idRole
        });
        state.lists = [...roles]
        localStorage.setItem('roles', JSON.stringify(state.lists))
    },
};
