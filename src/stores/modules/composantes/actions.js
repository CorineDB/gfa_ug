import {
    FETCH_LIST as FETCH_LIST_COMPOSANTE,
    GET as GET_COMPOSANTE,
    STORE as STORE_COMPOSANTE,
    UPDATE as UPDATE_COMPOSANTE,
    DESTROY as DESTROY_COMPOSANTE,
} from "@/store/actions.type"

import {
    SET_LIST as SET_LIST_COMPOSANTE,
    FIND as findComposante,
    ADD as ADD_COMPOSANTE,
    MODIFY as MODIFY_COMPOSANTE,
    REMOVE as REMOVE_COMPOSANTE
} from "@/store/mutations.type"

import ComposanteService from "@/services/modules/composante.service";
import ProjetService from "@/services/modules/projet.service";

export default {
    
    FETCH_LIST_COMPOSANTE : async ({ commit }) => {

        const { data, status } = await ComposanteService.get();

        if(status === 200 || status === 201)
            commit(SET_LIST_COMPOSANTE, data.data);

        return { data, status };
    },
    
    FETCH_LIST_COMPOSANTE_OF_PROJET : async ({ commit }, id) => {
        
        const { data, status } = await ProjetService.composantes(id);

        if(status === 200 || status === 201)
            commit(SET_LIST_COMPOSANTE, data.data);

        return { data, status };
    },
    
    async GET_COMPOSANTE ({ commit, getters }, {key, value }) {

        let composante = getters.findComposante({key: key, value : value})

        if((composante === null || composante || undefined) && typeof value === "int"){

            const { data, status } = await ComposanteService.get(value);

            composante = data.data

            return composante
        }
    },

    async STORE_COMPOSANTE ({ commit }, payload) {
        
        const { data, status } = await ComposanteService.create(payload);

        if(status === 200 || status === 201)
            commit(ADD_COMPOSANTE, data.data);

        return { data, status };

    },

    async UPDATE_COMPOSANTE ({ commit }, {composante, id}) {
        
        const { data, status } = await ComposanteService.update(id, composante);

        if(status === 200 || status === 201)
            commit(MODIFY_COMPOSANTE, data.data);

        return { data, status };

    },

    async DESTROY_COMPOSANTE ({ commit }, idComposante) {
        
        const { data, status } = await ComposanteService.destroy(idComposante);

        if(status === 200 || status === 201 || status === 204)
            commit(REMOVE_COMPOSANTE, idComposante);

        return { data, status };

    }
}