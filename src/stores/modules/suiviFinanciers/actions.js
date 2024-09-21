import {
    FETCH_LIST as FETCH_LIST_SUIVIFINANCIER,
    GET as GET_SUIVIFINANCIER,
    STORE as STORE_SUIVIFINANCIER,
    UPDATE as UPDATE_SUIVIFINANCIER,
    DESTROY as DESTROY_SUIVIFINANCIER,
} from "@/store/actions.type"

import {
    SET_LIST as SET_LIST_SUIVIFINANCIER,
    FIND as findSuiviFinancier,
    ADD as ADD_SUIVIFINANCIER,
    MODIFY as MODIFY_SUIVIFINANCIER,
    REMOVE as REMOVE_SUIVIFINANCIER
} from "@/store/mutations.type"

import SuiviFinancierService from "@/services/modules/suiviFinancier.service";

export default {
    
    FETCH_LIST_SUIVIFINANCIER : async ({ commit }, id) => {

        const { data, status } = await SuiviFinancierService.byProgramme(id);

        commit(SET_LIST_SUIVIFINANCIER, data.data);

        return { data, status };
    },

    FILTRE_SUIVIFINANCIER : async ({ commit }, payload) => {

        const { data, status } = await SuiviFinancierService.filtre(payload);

        commit(SET_LIST_SUIVIFINANCIER, data.data);

        return { data, status };
    },
    

    async GET_SUIVIFINANCIER ({ commit, getters }, {key, value }) {

        let suiviFinancier = getters.findSuiviFinancier({key: key, value : value})

        if((suiviFinancier === null || suiviFinancier || undefined) && typeof value === "int"){

            const { data, status } = await SuiviFinancierService.get(value);

            suiviFinancier = data.data

            return suiviFinancier
        }
    },

    async STORE_SUIVIFINANCIER ({ commit }, payload) {
        
        const { data, status } = await SuiviFinancierService.create(payload);

        /*if(status === 200 || status === 201)
            commit(ADD_SUIVIFINANCIER, data.data);*/

        return { data, status };

    },

    async UPDATE_SUIVIFINANCIER ({ commit }, {suiviFinancier, id}) {
        
        const { data, status } = await SuiviFinancierService.update(id, suiviFinancier);

        commit(MODIFY_SUIVIFINANCIER, data.data);

        return { data, status };

    },

    async DESTROY_SUIVIFINANCIER ({ commit }, idSuiviFinancier) {
        
        const { data, status } = await SuiviFinancierService.destroy(idSuiviFinancier);

        commit(REMOVE_SUIVIFINANCIER, idSuiviFinancier);

        return { data, status };

    }
}