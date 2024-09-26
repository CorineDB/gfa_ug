import {
    FETCH_LIST as FETCH_LIST_FORMULAIRE,
    GET as GET_FORMULAIRE,
    STORE as STORE_FORMULAIRE,
    UPDATE as UPDATE_FORMULAIRE,
    DESTROY as DESTROY_FORMULAIRE,
} from "../../actions.type"

import {
    SET_LIST as SET_LIST_FORMULAIRE,
    FIND as findFormulaire,
    ADD as ADD_FORMULAIRE,
    MODIFY as MODIFY_FORMULAIRE,
    REMOVE as REMOVE_FORMULAIRE
} from "../../mutations.type"

import FormulaireService from "@/services/modules/formulaire.service";
import Formulaire from "./formulaire";

export default {
    
    FETCH_LIST_FORMULAIRE : async ({ commit }) => {

        const { data, status } = await FormulaireService.get();

        if(status === 200 || status === 201)
            commit(SET_LIST_FORMULAIRE, data.data);

        return { data, status };
    },

    ALL_GENERAL_FORMULAIRE : async ({ commit }) => {

        const { data, status } = await FormulaireService.allGenerals();

        if(status === 200 || status === 201)
            commit(SET_LIST_FORMULAIRE, data.data);

        return { data, status };
    },

    async GET_FORMULAIRE ({ commit, getters }, value ) {

        let formulaire = null


            const { data, status } = await FormulaireService.get(value);

            if(status === 200 || status === 201)
                formulaire = data.data

        
        
        return formulaire;
    },

    async STORE_FORMULAIRE ({ commit }, payload) {
        
        const { data, status } = await FormulaireService.create(payload);

        if(status === 200 || status === 201)
            commit(ADD_FORMULAIRE, data.data);

        return { data, status };

    },

    async UPDATE_FORMULAIRE ({ commit },{formulaire, id}) {
        
        const { data, status } = await FormulaireService.update(id, formulaire);

        if(status === 200 || status === 201)
            commit(MODIFY_FORMULAIRE, data.data);

        return { data, status };

    },

    async DESTROY_FORMULAIRE ({ commit }, idFormulaire) {
        
        const { data, status } = await FormulaireService.destroy(idFormulaire);

        if(status === 200 || status === 201 || status === 204)
            commit(REMOVE_FORMULAIRE, idFormulaire);

        return { data, status };

    },

    async GET_SUIVI (id, eSuivi) {
        
        const { data, status } = await FormulaireService.getSuivi(id, eSuivi);

        return { data, status };

    },
}