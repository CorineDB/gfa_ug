import {
    FETCH_LIST as FETCH_LIST_STRUCTURE,
    GET as GET_STRUCTURE,
    STORE as STORE_STRUCTURE,
    UPDATE as UPDATE_STRUCTURE,
    DESTROY as DESTROY_STRUCTURE,
} from "@/store/actions.type"

import {
    SET_LIST as SET_LIST_STRUCTURE,
} from "@/store/mutations.type"

import ProgrammeService from "@/services/modules/programme.service";
import Structure from "./structure";

export default {
    
    FETCH_LIST_STRUCTURE_OF_PROGRAMME : async ({ commit }, id) => {
        
        const { data, status } = await ProgrammeService.structures(id);

        commit(SET_LIST_STRUCTURE, data.data);

        return { data, status };
    },

    async GET_STRUCTURE ({ commit, getters }, {key, value }) {

        let structure = null

        structure = getters.findstructure({key: key, value : value})

        return structure;
    },
}