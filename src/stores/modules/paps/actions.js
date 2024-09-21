import {
    FETCH_LIST as FETCH_LIST_PAP,
    GET as GET_PAP,
    STORE as STORE_PAP,
    UPDATE as UPDATE_PAP,
    DESTROY as DESTROY_PAP,
} from "@/store/actions.type"

import {
    SET_LIST as SET_LIST_PAP,
    FIND as findPap,
    ADD as ADD_PAP,
    MODIFY as MODIFY_PAP,
    REMOVE as REMOVE_PAP
} from "@/store/mutations.type"

import PapService from "@/services/modules/paps.service";

export default {
    
    FETCH_LIST_PAP : async ({ commit }, {id}) => {

        const { data, status } = await PapService.programme(id);

        commit(SET_LIST_PAP, data.data);

        return { data, status };
    },
    

    async GET_PAP ({ commit, getters }, {key, value }) {

        let pap = getters.findPap({key: key, value : value})

        if((pap === null || pap || undefined) && typeof value === "int"){

            const { data, status } = await PapService.get(value);

            pap = data.data

            return pap
        }
    },

    async STORE_PAP ({ commit }, payload) {
        console.log('ok');
        const { data, status } = await PapService.create(payload);

        commit(ADD_PAP, data.data);

        return { data, status };

    },

    async IMPORTATION_PAP ({ commit }, payload) {
        
        const { data, status } = await PapService.importCSV(payload);

        return { data, status };

    },


    async UPDATE_PAP ({ commit }, {pap, id}) {
        
        const { data, status } = await PapService.update(id, pap);

        commit(MODIFY_PAP, data.data);

        return { data, status };

    },

    async DESTROY_PAP ({ commit }, idPap) {
        
        const { data, status } = await PapService.destroy(idPap);

        commit(REMOVE_PAP, idPap);

        return { data, status };

    }
}