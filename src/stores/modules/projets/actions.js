import {
    FETCH_LIST as FETCH_LIST_PROJET,
    GET as GET_PROJET,
    STORE as STORE_PROJET,
    UPDATE as UPDATE_PROJET,
    DESTROY as DESTROY_PROJET,
} from "../../actions.type"

import {
    SET_LIST as SET_LIST_PROJET,
    FIND as findProjet,
    ADD as ADD_PROJET,
    MODIFY as MODIFY_PROJET,
    REMOVE as REMOVE_PROJET
} from "../../mutations.type"

import ProjetService from "@/services/modules/projet.service";
import ProgrammeService from "@/services/modules/programme.service";

export default {
    
    FETCH_LIST_PROJET : async ({ commit }, id) => {

        const { data, status } = await ProjetService.get();
        
        if(status === 200 || status === 201)
            commit(SET_LIST_PROJET, data.data);

        return { data, status };
    },
    
    GET_STATISTIQUE : async ({ commit }, id) => {

        const { data } = await ProjetService.statistiques(id);

        return { data };
    },   
    
    GET_DETAILS_PROJET : async ({ commit }, id) => {

        const { data } = await ProjetService.statistiques(id);

        return { data };
    },   
    
    
    async PROLONGER_DATE_PROJET ({ commit }, {projet, id}) {

        const { data, status } = await ProjetService.prolonger(id, projet);

        return { data, status };
    },
    
    FETCH_LIST_PROJET_OF_PROGRAMME : async ({ commit }, id) => {

        const { data, status } = await ProgrammeService.projets(id);

        if(status === 200 || status === 201)
            commit(SET_LIST_PROJET, data.data);

        return { data, status };
    },   

    async GET_PROJET ({ commit, getters }, {key, value }) {

        let projet = null;

        const { data, status } = await ProjetService.get(payload, value);

        if(status === 200 || status === 201 || status === 204)
            projet = data

        return projet 

        commit(ADD_PROJET, data.data);

        return { data, status };

        projet = getters.findProjet({key: key, value : value})

        if((projet === null || projet || undefined) && typeof value === "int"){

            const { data, status } = await ProjetService.get(value);

            projet = data.data

            return projet
        }
    },

    async STORE_PROJET ({ commit }, payload) {
        
        const { data, status } = await ProjetService.create(payload);

        if(status === 200 || status === 201)
            commit(ADD_PROJET, data.data);

        return { data, status };

    },

    async UPDATE_PROJET ({ commit }, {projet, id}) {
        
        const { data, status } = await ProjetService.update(id, projet);


        if(status === 200 || status === 201)
            commit(MODIFY_PROJET, data.data);

        return { data, status };

    },

    async DESTROY_PROJET ({ commit }, idProjet) {
        
        const { data, status } = await ProjetService.destroy(idProjet);

        if(status === 200 || status === 201 || status === 204)
            commit(REMOVE_PROJET, idProjet);

        return { data, status };

    }
}