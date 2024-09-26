import { FETCH_LIST as FETCH_LIST_AGENCE_DE_COMMUNICATION, GET as GET_AGENCE_DE_COMMUNICATION, STORE as STORE_AGENCE_DE_COMMUNICATION, UPDATE as UPDATE_AGENCE_DE_COMMUNICATION, DESTROY as DESTROY_AGENCE_DE_COMMUNICATION } from "../../actions.type";

import { SET_LIST as SET_LIST_AGENCE_DE_COMMUNICATION, FIND as findAgenceDeCommunication, ADD as ADD_AGENCE_DE_COMMUNICATION, MODIFY as MODIFY_AGENCE_DE_COMMUNICATION, REMOVE as REMOVE_AGENCE_DE_COMMUNICATION } from "../../mutations.type";

import AgenceDeCommunicationService from "@/services/modules/agence.communication.service";
import AgenceDeCommunication from "./agence.communication";

export default {
  FETCH_LIST_AGENCE_DE_COMMUNICATION: async ({ commit }) => {
    const { data, status } = await AgenceDeCommunicationService.get();

    if (status === 200 || status === 201) commit(SET_LIST_AGENCE_DE_COMMUNICATION, data.data);

    return { data, status };
  },

  async GET_AGENCE_DE_COMMUNICATION({ commit, getters }, { key, value }) {
    let agenceDeCommunication = null;

    agenceDeCommunication = getters.findAgenceDeCommunication({ key: key, value: value });

    if ((agenceDeCommunication === null || agenceDeCommunication || undefined) && typeof value === "int") {
      const { data, status } = await AgenceDeCommunicationService.get(value);

      if (status === 200 || status === 201) agenceDeCommunication = data.data;

      return agenceDeCommunication;
    }
  },

  async STORE_AGENCE_DE_COMMUNICATION({ commit }, payload) {
    const { data, status } = await AgenceDeCommunicationService.create(payload);

    if (status === 200 || status === 201) commit(ADD_AGENCE_DE_COMMUNICATION, data.data);

    return { data, status };
  },

  async UPDATE_AGENCE_DE_COMMUNICATION({ commit }, { agenceDeCommunication, id }) {
    const { data, status } = await AgenceDeCommunicationService.update(id, agenceDeCommunication);

    if (status === 200 || status === 201) commit(MODIFY_AGENCE_DE_COMMUNICATION, data.data);

    return { data, status };
  },

  async DESTROY_AGENCE_DE_COMMUNICATION({ commit }, idAgenceDeCommunication) {
    const { data, status } = await AgenceDeCommunicationService.destroy(idAgenceDeCommunication);

    if (status === 200 || status === 201 || status === 204) commit(REMOVE_AGENCE_DE_COMMUNICATION, idAgenceDeCommunication);

    return { data, status };
  },
};
