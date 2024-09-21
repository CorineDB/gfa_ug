import {
    FETCH_LIST as FETCH_LIST_GOUVERNEMENT,
    GET as GET_GOUVERNEMENT,
    STORE as STORE_GOUVERNEMENT,
    UPDATE as UPDATE_GOUVERNEMENT,
    DESTROY as DESTROY_GOUVERNEMENT,
} from "@/store/actions.type"

import {
    SET_LIST as SET_LIST_GOUVERNEMENT,
    FIND as findGouvernement,
    ADD as ADD_GOUVERNEMENT,
    MODIFY as MODIFY_GOUVERNEMENT,
    REMOVE as REMOVE_GOUVERNEMENT
} from "@/store/mutations.type"

import GouvernementService from "@/services/modules/gouvernement.service";
import Gouvernement from "./gouvernements";

export default {
    
    FETCH_LIST_GOUVERNEMENT : async ({ commit }) => {

        const { data, status } = await GouvernementService.get();

        if(status === 200 || status === 201)
            commit(SET_LIST_GOUVERNEMENT, data.data);

        return { data, status };
    },

    async GET_GOUVERNEMENT ({ commit, getters }, {key, value }) {

        let gouvernement = null

        gouvernement = getters.findGouvernement({key: key, value : value})

        if((gouvernement === null || gouvernement || undefined) && typeof value === "int"){

            const { data, status } = await GouvernementService.get(value);

            if(status === 200 || status === 201)
                gouvernement = data.data
        }

        return gouvernement
    },

    async STORE_GOUVERNEMENT ({ commit }, payload) {
        
        const { data, status } = await GouvernementService.create(payload);

        if(status === 200 || status === 201)
            commit(ADD_GOUVERNEMENT, data.data);

        return { data, status };

    },

    async UPDATE_GOUVERNEMENT ({ commit }, {gouvernement, id}) {
        
        const { data, status } = await GouvernementService.update(id, gouvernement);

        if(status === 200 || status === 201)
            commit(MODIFY_GOUVERNEMENT, data.data);

        return { data, status };

    },

    async DESTROY_GOUVERNEMENT ({ commit }, idGouvernement) {
        
        const { data, status } = await GouvernementService.destroy(idGouvernement);

        if(status === 200 || status === 201 || status === 204)
            commit(REMOVE_GOUVERNEMENT, idGouvernement);

        return { data, status };

    }
}