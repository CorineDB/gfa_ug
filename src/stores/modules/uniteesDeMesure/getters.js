import {
    FIND as findUniteeDeMesure
} from "../../mutations.type";

export default {

    getUniteesDeMesure : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('unitees-de-mesure') 
                
                ? state.lists = JSON.parse(localStorage.getItem('unitees-de-mesure'))

                : []
    },

    getUniteeDeMesure : state => {
        return state.uniteeDeMesure;
    },

    getTotal : state => {
        return this.getUniteesDeMesure(state).length;
    },

    [findUniteeDeMesure] : state => ({key, value}) => {
        return this.getUniteesDeMesure(state).find(item => item[key] === value);
    }
}