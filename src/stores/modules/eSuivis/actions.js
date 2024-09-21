import {
    FETCH_LIST as FETCH_LIST_ESUIVI,
    GET as GET_ESUIVI,
    STORE as STORE_ESUIVI,
    UPDATE as UPDATE_ESUIVI,
    DESTROY as DESTROY_ESUIVI,
} from "@/store/actions.type"

import {
    SET_LIST as SET_LIST_ESUIVI,
    FIND as findESuivi,
    ADD as ADD_ESUIVI,
    MODIFY as MODIFY_ESUIVI,
    REMOVE as REMOVE_ESUIVI
} from "@/store/mutations.type"

import ESuiviService from "@/services/modules/eSuivi.service";

export default {
    
    FETCH_LIST_ESUIVI : async ({ commit }, id) => {

        const { data, status } = await ESuiviService.get();

        commit(SET_LIST_ESUIVI, data.data);

        return { data, status };
    },
    

    async GET_ESUIVI ({ commit, getters }, {key, value }) {

        let eSuivi = getters.findESuivi({key: key, value : value})

        if((eSuivi === null || eSuivi || undefined) && typeof value === "int"){

            const { data, status } = await ESuiviService.get(value);

            eSuivi = data.data

            return eSuivi
        }
    },

    async STORE_ESUIVI ({ commit }, payload) {
        
        const { data, status } = await ESuiviService.create(payload);

        commit(ADD_ESUIVI, data.data);

        return { data, status };

    },

    async DATE ({ commit }, payload) {
        
        const { data, status } = await ESuiviService.dates(payload);

        return data.data;

    },

    async FORMULAIRE ({ commit }, payload) {
        
        const { data, status } = await ESuiviService.formulaires(payload);

        return data.data;

    },

    async GRAPHES ({ commit }, payload) {
        
        const { data, status } = await ESuiviService.graphes(payload);

        return data.data;

    },

    async UPDATE_ESUIVI ({ commit }, {eSuivi, id}) {
        
        const { data, status } = await ESuiviService.update(id, eSuivi);

        commit(MODIFY_ESUIVI, data.data);

        return { data, status };

    },

    async DESTROY_ESUIVI ({ commit }, idESuivi) {
        
        const { data, status } = await ESuiviService.destroy(idESuivi);

        commit(REMOVE_ESUIVI, idESuivi);

        return { data, status };

    },
}