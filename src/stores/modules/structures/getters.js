import {
    FIND as findStructure
} from "../../mutations.type";

export default {

    getStructures : state => {

        return state.lists.length > 0

                ? state.lists

                : localStorage.getItem('structures') 
                
                ? state.lists = JSON.parse(localStorage.getItem('structures'))

                : []
    },

    getStructure : state => {
        return state.structure;
    },

    getTotal : state => {
        return this.getStructures(state).length;
    },

    [findStructure] : state => ({key, value}) => {
        return this.getStructures(state).find(item => item[key] === value);
    }
}