import {
    FETCH_LIST as FETCH_LIST_UNITEE_DE_MESURE,
    GET as GET_UNITEE_DE_MESURE,
    STORE as STORE_UNITEE_DE_MESURE,
    UPDATE as UPDATE_UNITEE_DE_MESURE,
    DESTROY as DESTROY_UNITEE_DE_MESURE,
} from "@/store/actions.type"

import {
    SET_LIST as SET_LIST_UNITEE_DE_MESURE,
    FIND as findUniteeDeMesure,
    ADD as ADD_UNITEE_DE_MESURE,
    MODIFY as MODIFY_UNITEE_DE_MESURE,
    REMOVE as REMOVE_UNITEE_DE_MESURE
} from "@/store/mutations.type"

import UniteeDeMesureService from "@/services/modules/unitee.mesure.service";
import UniteeDeMesure from "./unitee.mesure";

export default {
    
    FETCH_LIST_UNITEE_DE_MESURE : async ({ commit }) => {

        const { data, status } = await UniteeDeMesureService.get();

        if(status === 200 || status === 201)
            commit(SET_LIST_UNITEE_DE_MESURE, data.data);

        return { data, status };
    },

    async GET_UNITEE_DE_MESURE ({ commit, getters }, {key, value }) {

        let uniteeDeMesure = null

        uniteeDeMesure = getters.findUniteeDeMesure({key: key, value : value})

        if((uniteeDeMesure === null || uniteeDeMesure || undefined) && typeof value === "int"){

            const { data, status } = await UniteeDeMesureService.get(value);

            if(status === 200 || status === 201)
                uniteeDeMesure = data.data
        }

        return uniteeDeMesure;
    },

    async STORE_UNITEE_DE_MESURE ({ commit }, payload) {
        
        const { data, status } = await UniteeDeMesureService.create(payload);

        if(status === 200 || status === 201)
            commit(ADD_UNITEE_DE_MESURE, data.data);

        return { data, status };

    },

    async UPDATE_UNITEE_DE_MESURE ({ commit }, {uniteeDeMesure, id}) {
        
        const { data, status } = await UniteeDeMesureService.update(id, uniteeDeMesure);

        if(status === 200 || status === 201)
            commit(MODIFY_UNITEE_DE_MESURE, data.data);

        return { data, status };

    },

    async DESTROY_UNITEE_DE_MESURE ({ commit }, idUniteeDeMesure) {
        
        const { data, status } = await UniteeDeMesureService.destroy(idUniteeDeMesure);

        if(status === 200 || status === 201 || status === 204)
            commit(REMOVE_UNITEE_DE_MESURE, idUniteeDeMesure);

        return { data, status };

    }
}