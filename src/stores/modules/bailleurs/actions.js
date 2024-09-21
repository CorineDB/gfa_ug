import {
    FETCH_LIST as FETCH_LIST_BAILLEUR,
    GET as GET_BAILLEUR,
    STORE as STORE_BAILLEUR,
    UPDATE as UPDATE_BAILLEUR,
    DESTROY as DESTROY_BAILLEUR,
} from "@/store/actions.type"

import {
    SET_LIST as SET_LIST_BAILLEUR,
    FIND as findBailleur,
    ADD as ADD_BAILLEUR,
    MODIFY as MODIFY_BAILLEUR,
    REMOVE as REMOVE_BAILLEUR
} from "@/store/mutations.type"

import BailleurService from "@/services/modules/bailleur.service";
import Bailleur from "./bailleur";

export default {
    
    FETCH_LIST_BAILLEUR : async ({ commit }) => {

        const { data, status } = await BailleurService.get();

        if(status === 200 || status === 201) 
            commit(SET_LIST_BAILLEUR, data.data);

        return { data, status };
    },
    
    FETCH_LIST_BAILLEUR_OF_PROGRAMME : async ({ commit }, id) => {

        const { data, status } = await BailleurService.bailleursOfProgramme(id);

        commit(SET_LIST_BAILLEUR, data.data);

        return { data, status };
    },   

    async GET_BAILLEUR ({ commit, getters }, {key, value }) {

        let bailleur = null
        
        bailleur = getters.findBailleur({key: key, value : value})

        if((bailleur === null || bailleur || undefined) && typeof value === "int"){

            const { data, status } = await BailleurService.get(value);

            if(status === 200 || status === 201)
                bailleur = data.data
        }

        return bailleur;
    },

    async STORE_BAILLEUR ({ commit }, payload) {
        
        const { data, status } = await BailleurService.create(payload);

        if(status === 200 || status === 201)
            commit(ADD_BAILLEUR, data.data);

        return { data, status };

    },

    async UPDATE_BAILLEUR ({ commit }, {bailleur, id}) {
        
        const { data, status } = await BailleurService.update(id, bailleur);

        if(status === 200 || status === 201)
            commit(MODIFY_BAILLEUR, data.data);

        return { data, status };

    },

    async DESTROY_BAILLEUR ({ commit }, idBailleur) {
        
        const { data, status } = await BailleurService.destroy(idBailleur);

        if(status === 200 || status === 201 || status === 204)
            commit(REMOVE_BAILLEUR, idBailleur);

        return { data, status };

    }
}