import {
    FETCH_LIST as FETCH_LIST_SOUS_COMPOSANTE,
    GET as GET_SOUS_COMPOSANTE,
    STORE as STORE_SOUS_COMPOSANTE,
    UPDATE as UPDATE_SOUS_COMPOSANTE,
    DESTROY as DESTROY_SOUS_COMPOSANTE,
} from "../../actions.type"

import {
    SET_LIST as SET_LIST_SOUS_COMPOSANTE,
    FIND as findSousComposante,
    ADD as ADD_SOUS_COMPOSANTE,
    MODIFY as MODIFY_SOUS_COMPOSANTE,
    REMOVE as REMOVE_SOUS_COMPOSANTE
} from "../../mutations.type"

import SousComposanteService from "@/services/modules/composante.service";

import ComposanteService from "@/services/modules/composante.service";

export default {
    
    FETCH_LIST_SOUS_COMPOSANTE : async ({ commit }) => {

        const { data, status } = await SousComposanteService.get();

        if(status === 200 || status === 201)
            commit(SET_LIST_SOUS_COMPOSANTE, data.data);

        return { data, status };
    },
    
    FETCH_LIST_SOUS_COMPOSANTE_OF_COMPOSANTE : async ({ commit }, id) => {
        
        const { data, status } = await ComposanteService.sousComposantes(id);

        if(status === 200 || status === 201)
            commit(SET_LIST_SOUS_COMPOSANTE, data.data);

        return { data, status };
    },
    

    async GET_SOUS_COMPOSANTE ({ commit, getters }, {key, value }) {

        let sousComposante = getters.findSousComposante({key: key, value : value})

        if((sousComposante === null || sousComposante || undefined) && typeof value === "int"){

            const { data, status } = await SousComposanteService.get(value);

            sousComposante = data.data

            return sousComposante
        }
    },

    async STORE_SOUS_COMPOSANTE ({ commit }, payload) {
        
        const { data, status } = await SousComposanteService.create(payload);

        if(status === 200 || status === 201)
            commit(ADD_SOUS_COMPOSANTE, data.data);

        return { data, status };

    },

    async UPDATE_SOUS_COMPOSANTE ({ commit }, {sousComposante, id}) {

        const { data, status } = await SousComposanteService.update(id, sousComposante);

        if(status === 200 || status === 201)
            commit(MODIFY_SOUS_COMPOSANTE, data.data);

        return { data, status };

    },

    async DESTROY_SOUS_COMPOSANTE ({ commit }, idSousComposante) {
        
        const { data, status } = await SousComposanteService.destroy(idSousComposante);

        if(status === 200 || status === 201 || status === 204)
            commit(REMOVE_SOUS_COMPOSANTE, idSousComposante);

        return { data, status };

    }
}