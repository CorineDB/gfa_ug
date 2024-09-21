import {
    FETCH_LIST as FETCH_LIST_PASSATION,
    GET as GET_PASSATION,
    STORE as STORE_PASSATION,
    UPDATE as UPDATE_PASSATION,
    DESTROY as DESTROY_PASSATION,
} from "@/store/actions.type"

import {
    SET_LIST as SET_LIST_PASSATION,
    FIND as findPassation,
    ADD as ADD_PASSATION,
    MODIFY as MODIFY_PASSATION,
    REMOVE as REMOVE_PASSATION
} from "@/store/mutations.type"

import PassationService from "@/services/modules/passation.service";

export default {
    
    FETCH_LIST_MOD_PASSATION : async ({ commit }, id) => {

        const { data, status } = await PassationService.mods(id);

        commit(SET_LIST_PASSATION, data.data);

        return { data, status };
    },

    FETCH_LIST_MISSIONDECONTROLE_PASSATION : async ({ commit }, id) => {

        const { data, status } = await PassationService.missionDeControles(id);

        commit(SET_LIST_PASSATION, data.data);

        return { data, status };
    },
    

    async GET_PASSATION ({ commit, getters }, {key, value }) {

        let passation = getters.findPassation({key: key, value : value})

        if((passation === null || passation || undefined) && typeof value === "int"){

            const { data, status } = await PassationService.get(value);

            passation = data.data

            return passation
        }
    },

    async STORE_PASSATION ({ commit }, payload) {
        
        const { data, status } = await PassationService.create(payload);

        commit(ADD_PASSATION, data.data);

        return { data, status };

    },

    async IMPORTATION_PASSATION ({ commit }, payload) {
        
        const { data, status } = await PassationService.importCSV(payload);

        return { data, status };

    },


    async UPDATE_PASSATION ({ commit }, {passation, id}) {
        
        const { data, status } = await PassationService.update(id, passation);

        commit(MODIFY_PASSATION, data.data);

        return { data, status };

    },

    async DESTROY_PASSATION ({ commit }, idPassation) {
        
        const { data, status } = await PassationService.destroy(idPassation);

        commit(REMOVE_PASSATION, idPassation);

        return { data, status };

    }
}