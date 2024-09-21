import Site from './site';

import {
    SET_LIST as SET_LIST_SITE,
    ADD as ADD_NEW_SITE,
    FILL,
    MODIFY as MODIFY_SITE,
    REMOVE as REMOVE_SITE,
} from "@/store/mutations.type";

export default {

    [SET_LIST_SITE](state, lists) {
        state.lists = lists
        localStorage.setItem('sites', JSON.stringify(lists))
    },

    [FILL](state, site) {
        state.site = new Role(site)
    },

    [ADD_NEW_SITE](state, site) {
        state.lists.unshift(site)
    },

    [MODIFY_SITE](state, site) {

        let sites = state.lists.map(item => {
            if(item.id === site?.id){
                item = site
            }
            return item
        })

        state.lists = [...sites]

        localStorage.setItem('sites', JSON.stringify(state.lists))
    },

    [REMOVE_SITE](state, idSite) {
        let sites = state.lists.filter(item => {
            return item.id !== idSite
        });
        state.lists = [...sites]
        localStorage.setItem('sites', JSON.stringify(state.lists))
    },
};
