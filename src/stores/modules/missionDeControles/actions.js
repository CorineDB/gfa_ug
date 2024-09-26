import {
    FETCH_LIST as FETCH_LIST_MISSION_DE_CONTROLE,
    GET as GET_MISSION_DE_CONTROLE,
    STORE as STORE_MISSION_DE_CONTROLE,
    UPDATE as UPDATE_MISSION_DE_CONTROLE,
    DESTROY as DESTROY_MISSION_DE_CONTROLE,
} from "../../actions.type"

import {
    SET_LIST as SET_LIST_MISSION_DE_CONTROLE,
    FIND as findMissionDeControle,
    ADD as ADD_MISSION_DE_CONTROLE,
    MODIFY as MODIFY_MISSION_DE_CONTROLE,
    REMOVE as REMOVE_MISSION_DE_CONTROLE
} from "../../mutations.type"

import MissionDeControleService from "@/services/modules/mission.controle.service";
import MissionDeControle from "./mission.controle";

export default {
    
    FETCH_LIST_MISSION_DE_CONTROLE : async ({ commit }) => {

        const { data, status } = await MissionDeControleService.get();

        if(status === 200 || status === 201)
            commit(SET_LIST_MISSION_DE_CONTROLE, data.data);

        return { data, status };
    },

    async GET_MISSION_DE_CONTROLE ({ commit, getters }, {key, value }) {

        let missionDeControle = null

        missionDeControle = getters.findMissionDeControle({key: key, value : value})

        if((missionDeControle === null || missionDeControle || undefined) && typeof value === "int"){

            const { data, status } = await MissionDeControleService.get(value);

            if(status === 200 || status === 201)
                missionDeControle = data.data
        }

        return missionDeControle;
    },

    async STORE_MISSION_DE_CONTROLE ({ commit }, payload) {
        
        const { data, status } = await MissionDeControleService.create(payload);

        if(status === 200 || status === 201)
            commit(ADD_MISSION_DE_CONTROLE, data.data);

        return { data, status };

    },

    async UPDATE_MISSION_DE_CONTROLE ({ commit }, {missionDeControle, id}) {
        
        const { data, status } = await MissionDeControleService.update(id, missionDeControle);

        if(status === 200 || status === 201)
            commit(MODIFY_MISSION_DE_CONTROLE, data.data);

        return { data, status };

    },

    async DESTROY_MISSION_DE_CONTROLE ({ commit }, idMissionDeControle) {
        
        const { data, status } = await MissionDeControleService.destroy(idMissionDeControle);

        if(status === 200 || status === 201 || status === 204)
            commit(REMOVE_MISSION_DE_CONTROLE, idMissionDeControle);

        return { data, status };

    }
}