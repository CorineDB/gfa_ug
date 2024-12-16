import {
    FETCH_LIST as FETCH_LIST_REPONSE,
    GET as GET_REPONSE,
    STORE as STORE_REPONSE,
    UPDATE as UPDATE_REPONSE,
    DESTROY as DESTROY_REPONSE,
} from "../../actions.type"

import {
    SET_LIST as SET_LIST_REPONSE,
    FIND as findReponse,
    ADD as ADD_REPONSE,
    MODIFY as MODIFY_REPONSE,
    REMOVE as REMOVE_REPONSE
} from "../../mutations.type"

import ReponseService from "@/services/modules/reponse.service";

export default {
    
    FETCH_LIST_REPONSE : async ({ commit }, id) => {

        const { data, status } = await ReponseService.get();

        commit(SET_LIST_REPONSE, data.data);

        return { data, status };
    },
    

    async GET_REPONSE ({ commit, getters }, {key, value }) {

        let reponse = getters.findReponse({key: key, value : value})

        if((reponse === null || reponse || undefined) && typeof value === "int"){

            const { data, status } = await ReponseService.get(value);

            reponse = data.data

            return reponse
        }
    },

    async STORE_REPONSE ({ commit }, payload) {
        
        const { data, status } = await ReponseService.create(payload);

        commit(ADD_REPONSE, data.data);

        return { data, status };

    },

    async UPDATE_REPONSE ({ commit }, {reponse, id}) {
        
        const { data, status } = await ReponseService.update(id, reponse);

        commit(MODIFY_REPONSE, data.data);

        return { data, status };

    },

    async DESTROY_REPONSE ({ commit }, idReponse) {
        
        const { data, status } = await ReponseService.destroy(idReponse);

        commit(REMOVE_REPONSE, idReponse);

        return { data, status };

    },
}