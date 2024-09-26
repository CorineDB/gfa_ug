import {
    FIND as findMissionDeControle
} from "../../mutations.type";

export default {

    getMissionDeControles : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('missionDeControles') 
                
                ? state.lists = JSON.parse(localStorage.getItem('missionDeControles'))

                : []
    },

    getMissionDeControle : state => {
        return state.missionDeControle;
    },

    getTotal : state => {
        return this.getMissionDeControles(state).length;
    },

    [findMissionDeControle] : state => ({key, value}) => {
        return this.getMissionDeControles(state).find(item => item[key] === value);
    }
}