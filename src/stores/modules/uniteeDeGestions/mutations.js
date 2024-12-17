import UniteeDeGestion from './unitee.gestion';

import {
    SET_LIST as SET_LIST_UNITEE_DE_GESTION,
    ADD as ADD_NEW_UNITEE_DE_GESTION,
    FILL,
    MODIFY as MODIFY_UNITEE_DE_GESTION,
    REMOVE as REMOVE_UNITEE_DE_GESTION
} from "../../mutations.type";

export default {

    [SET_LIST_UNITEE_DE_GESTION](state, lists) {
        state.lists = lists
        localStorage.setItem('uniteeDeGestions', JSON.stringify(lists))
    },

    [FILL](state, uniteeDeGestion) {
        state.uniteeDeGestion = new UniteeDeGestion(uniteeDeGestion)
    },

    [ADD_NEW_UNITEE_DE_GESTION](state, uniteeDeGestion) {
        state.lists.unshift(uniteeDeGestion)
    },

    [MODIFY_UNITEE_DE_GESTION](state, uniteeDeGestion) {

        let uniteeDeGestions = state.lists.map(item => {
            if(item.id === uniteeDeGestion?.id){
                item = uniteeDeGestion
            }
            return item
        })

        state.lists = [...uniteeDeGestions]

        localStorage.setItem('uniteeDeGestions', JSON.stringify(state.lists))
    },

    [REMOVE_UNITEE_DE_GESTION](state, idUniteeDeGestion) {
        let uniteeDeGestions = state.lists.filter(item => {
            return item.id !== idUniteeDeGestion
        });
    
        state.lists = [...uniteeDeGestions]
        localStorage.setItem('uniteeDeGestions', JSON.stringify(state.lists))
    },
};
