import {
    FETCH_LIST as FETCH_LIST_INSTITUTION,
    GET as GET_INSTITUTION,
    STORE as STORE_INSTITUTION,
    UPDATE as UPDATE_INSTITUTION,
    DESTROY as DESTROY_INSTITUTION,
} from "@/store/actions.type"

import {
    SET_LIST as SET_LIST_INSTITUTION,
    FIND as findInstitution,
    ADD as ADD_INSTITUTION,
    MODIFY as MODIFY_INSTITUTION,
    REMOVE as REMOVE_INSTITUTION
} from "@/store/mutations.type"

import InstitutionService from "@/services/modules/institution.service";
import Institution from "./institution";

export default {
    
    FETCH_LIST_INSTITUTION : async ({ commit }) => {

        const { data, status } = await InstitutionService.get();

        if(status === 200 || status === 201)
            commit(SET_LIST_INSTITUTION, data.data);

        return { data, status };
    },

    async GET_INSTITUTION ({ commit, getters }, {key, value }) {

        let institution = null

        institution = getters.findInstitution({key: key, value : value})

        if((institution === null || institution || undefined) && typeof value === "int"){

            const { data, status } = await InstitutionService.get(value);

            if(status === 200 || status === 201)
                institution = data.data
        }

        return institution
    },

    async STORE_INSTITUTION ({ commit }, payload) {
        
        const { data, status } = await InstitutionService.create(payload);

        if(status === 200 || status === 201)
            commit(ADD_INSTITUTION, data.data);

        return { data, status };

    },

    async UPDATE_INSTITUTION ({ commit }, {institution, id}) {
        
        const { data, status } = await InstitutionService.update(id, institution);

        if(status === 200 || status === 201)
            commit(MODIFY_INSTITUTION, data.data);

        return { data, status };

    },

    async DESTROY_INSTITUTION ({ commit }, idInstitution) {
        
        const { data, status } = await InstitutionService.destroy(idInstitution);

        if(status === 200 || status === 201 || status === 204)
            commit(REMOVE_INSTITUTION, idInstitution);

        return { data, status };

    }
}