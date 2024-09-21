import PlanDeDecaissement from './plan.decaissement';

import {
    SET_LIST as SET_LIST_PLAN_DE_DECAISSEMENT,
    ADD as ADD_NEW_PLAN_DE_DECAISSEMENT,
    FILL,
    MODIFY as MODIFY_PLAN_DE_DECAISSEMENT,
    REMOVE as REMOE_PLAN_DE_DECAISSEMENT
} from "@/store/mutations.type";

export default {

    [SET_LIST_PLAN_DE_DECAISSEMENT](state, lists) {
        state.lists = lists
        localStorage.setItem('plan-de-decaissements', JSON.stringify(lists))
    },

    [FILL](state, planDeDecaissement) {
        state.planDeDecaissement = new PlanDeDecaissement(planDeDecaissement)
    },

    [ADD_NEW_PLAN_DE_DECAISSEMENT](state, planDeDecaissement) {
        state.lists.unshift(planDeDecaissement)
    },

    [MODIFY_PLAN_DE_DECAISSEMENT](state, planDeDecaissement) {

        let planDeDecaissements = state.lists.map(item => {
            if(item.id === planDeDecaissement?.id){
                item = planDeDecaissement
            }
            return item
        })

        state.lists = [...planDeDecaissements]

        localStorage.setItem('plan-de-decaissements', JSON.stringify(state.lists))
    },

    [REMOE_PLAN_DE_DECAISSEMENT](state, idPlanDeDecaissement) {
        let planDeDecaissements = state.lists.filter(item => {
            return item.id !== idPlanDeDecaissement
        });
    
        state.lists = [...planDeDecaissements]
        localStorage.setItem('plan-de-decaissements', JSON.stringify(state.lists))
    }
};
