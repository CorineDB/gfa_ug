import { SET_LIST as SET_LIST_PLAN_DE_DECAISSEMENT, FIND as findDecaissement, ADD as ADD_PLAN_DE_DECAISSEMENT, MODIFY as MODIFY_PLAN_DE_DECAISSEMENT, REMOVE as REMOVE_PLAN_DE_DECAISSSMENT } from "../../mutations.type";

import PlanDeDecaissementService from "@/services/modules/plan.decaissement.service";
import ActiviteService from "@/services/modules/activite.service";
import PlanDeDecaissement from "./plan.decaissement";

export default {
  FETCH_LIST_PLAN_DE_DECAISSEMENT: async ({ commit }) => {
    const { data, status } = await PlanDeDecaissementService.get();

    if (status === 200 || status === 201) commit(SET_LIST_PLAN_DE_DECAISSEMENT, data.data);

    return { data, status };
  },

  FETCH_LIST_PLAN_DE_DECAISSEMENT_ACTIVITE: async ({ commit }, idActivite) => {
    const { data, status } = await ActiviteService.plansDeDecaissement(idActivite);

    if (status === 200 || status === 201) commit(SET_LIST_PLAN_DE_DECAISSEMENT, data.data);

    return { data, status };
  },

  async GET_PLAN_DE_DECAISSEMENT({ commit, getters }, { key, value }) {
    let planDeDecaissement = null;

    planDeDecaissement = getters.findPlanDeDecaissement({ key: key, value: value });

    if ((planDeDecaissement === null || planDeDecaissement || undefined) && typeof value === "int") {
      const { data, status } = await PlanDeDecaissementService.get(value);

      if (status === 200 || status === 201) categorie = data.data;
    }

    return planDeDecaissement;
  },

  async STORE_PLAN_DE_DECAISSEMENT({ commit }, payload) {
    const { data, status } = await PlanDeDecaissementService.create(payload);

    if (status === 200 || status === 201) commit(ADD_PLAN_DE_DECAISSEMENT, data.data);

    return { data, status };
  },

  async UPDATE_PLAN_DE_DECAISSEMENT({ commit }, { planDeDecaissement, id }) {
    const { data, status } = await PlanDeDecaissementService.update(id, planDeDecaissement);

    if (status === 200 || status === 201) commit(MODIFY_PLAN_DE_DECAISSEMENT, data.data);

    return { data, status };
  },

  async DESTROY_PLAN_DE_DECAISSEMENT({ commit }, idPlanDeDecaissement) {
    const { data, status } = await PlanDeDecaissementService.destroy(idPlanDeDecaissement);

    if (status === 200 || status === 201 || status === 204) commit(REMOVE_PLAN_DE_DECAISSSMENT, idPlanDeDecaissement);

    return { data, status };
  },
};
