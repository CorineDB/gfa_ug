import {
    FIND as findUniteeDeGestion
} from "@/store/mutations.type";

export default {

    getUniteeDeGestions : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('uniteeDeGestions') 
                
                ? state.lists = JSON.parse(localStorage.getItem('uniteeDeGestions'))

                : []
    },

    getUniteeDeGestion : state => {
        return state.uniteeDeGestion;
    },

    getTotal : state => {
        return this.getUniteeDeGestions(state).length;
    },

    [findUniteeDeGestion] : state => ({key, value}) => {
        return this.getUniteeDeGestions(state).find(item => item[key] === value);
    }
}