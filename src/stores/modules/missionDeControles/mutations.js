import MissionDeControle from './mission.controle';

import {
    SET_LIST as SET_LIST_MISSION_DE_CONTROLE,
    ADD as ADD_NEW_MISSION_DE_CONTROLE,
    FILL,
    MODIFY as MODIFY_MISSION_DE_CONTROLE,
    REMOVE as REMOVE_MISSION_DE_CONTROLE
} from "../../mutations.type";

export default {

    [SET_LIST_MISSION_DE_CONTROLE](state, lists) {
        state.lists = lists
        localStorage.setItem('missionDeControles', JSON.stringify(lists))
    },

    [FILL](state, missionDeControle) {
        state.missionDeControle = new MissionDeControle(missionDeControle)
    },

    [ADD_NEW_MISSION_DE_CONTROLE](state, missionDeControle) {
        state.lists.unshift(missionDeControle)
    },

    [MODIFY_MISSION_DE_CONTROLE](state, missionDeControle) {

        let missionDeControles = state.lists.map(item => {
            if(item.id === missionDeControle?.id){
                item = missionDeControle
            }
            return item
        })

        state.lists = [...missionDeControles]

        localStorage.setItem('missionDeControles', JSON.stringify(state.lists))
    },

    [REMOVE_MISSION_DE_CONTROLE](state, idMissionDeControle) {
        let missionDeControles = state.lists.filter(item => {
            return item.id !== idMissionDeControle
        });
    
        state.lists = [...missionDeControles]
        localStorage.setItem('missionDeControles', JSON.stringify(state.lists))
    },
};
