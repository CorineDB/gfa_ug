import {
    FETCH_LIST as FETCH_LIST_MOD,
    GET as GET_MOD,
    STORE as STORE_MOD,
    UPDATE as UPDATE_MOD,
    DESTROY as DESTROY_MOD,
} from "@/store/actions.type"

import {
    SET_LIST as SET_LIST_MOD,
    FIND as findmod,
    ADD as ADD_MOD,
    MODIFY as MODIFY_MOD,
    REMOVE as REMOVE_MOD
} from "@/store/mutations.type"

import ModService from "@/services/modules/mod.service";
import ProgrammeService from "@/services/modules/programme.service";
import Mod from "./mod";

export default {
    
    FETCH_LIST_MOD : async ({ commit }) => {

        const { data, status } = await ProgrammeService.mods(0);

        if(status === 200 || status === 201)
            commit(SET_LIST_MOD, data.data);

        return { data, status };
    },
    
    FETCH_LIST_MOD_OF_PROGRAMME : async ({ commit }, id) => {
        
        const { data, status } = await ProgrammeService.mods(id);

        commit(SET_LIST_MOD, data.data);

        return { data, status };
    },

    async GET_MOD ({ commit, getters }, {key, value }) {

        let mod = null

        mod = getters.findmod({key: key, value : value})

        if((mod === null || mod || undefined) && typeof value === "int"){

            const { data, status } = await ModService.get(value);

            if(status === 200 || status === 201)
                mod = data.data
        }

        return mod;
    },

    async STORE_MOD ({ commit }, payload) {
        
        const { data, status } = await ModService.create(payload);

        if(status === 200 || status === 201)
            commit(ADD_MOD, data.data);

        return { data, status };

    },

    async UPDATE_MOD ({ commit }, {mod, id}) {
        
        const { data, status } = await ModService.update(id, mod);

        if(status === 200 || status === 201)
            commit(MODIFY_MOD, data.data);

        return { data, status };

    },

    async DESTROY_MOD ({ commit }, idMod) {
        
        const { data, status } = await ModService.destroy(idMod);

        if(status === 200 || status === 201 || status === 204)
            commit(REMOVE_MOD, idMod);

        return { data, status };

    }
}