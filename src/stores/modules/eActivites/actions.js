import {
    FETCH_LIST as FETCH_LIST_EACTIVITE,
    GET as GET_EACTIVITE,
    STORE as STORE_EACTIVITE,
    UPDATE as UPDATE_EACTIVITE,
    DESTROY as DESTROY_EACTIVITE,
} from "@/store/actions.type"

import {
    SET_LIST as SET_LIST_EACTIVITE,
    FIND as findEActivite,
    ADD as ADD_EACTIVITE,
    MODIFY as MODIFY_EACTIVITE,
    REMOVE as REMOVE_EACTIVITE
} from "@/store/mutations.type"

import EActiviteService from "@/services/modules/activite.environnement.service";

export default {
    
    FETCH_LIST_EACTIVITE : async ({ commit }, id) => {

        const { data, status } = await EActiviteService.programme(id);

        commit(SET_LIST_EACTIVITE, data.data);

        return { data, status };
    },
    

    async GET_EACTIVITE ({ commit, getters }, {key, value }) {

        let eActivite = getters.findEActivite({key: key, value : value})

        if((eActivite === null || eActivite || undefined) && typeof value === "int"){

            const { data, status } = await EActiviteService.get(value);

            eActivite = data.data

            return eActivite
        }
    },

    async STORE_EACTIVITE ({ commit }, payload) {
        
        const { data, status } = await EActiviteService.create(payload);

        commit(ADD_EACTIVITE, data.data);

        return { data, status };

    },

    async UPDATE_EACTIVITE ({ commit }, {eActivite, id}) {
        
        const { data, status } = await EActiviteService.update(id, eActivite);

        commit(MODIFY_EACTIVITE, data.data);

        return { data, status };

    },

    async DESTROY_EACTIVITE ({ commit }, idEActivite) {
        
        const { data, status } = await EActiviteService.destroy(idEActivite);

        commit(REMOVE_EACTIVITE, idEActivite);

        return { data, status };

    }
}