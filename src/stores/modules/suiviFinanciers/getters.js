import {
    FIND as findSuiviFinancier
} from "../../mutations.type";

export default {

    getSuiviFinanciers : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('suiviFinanciers') 
                
                ? state.lists = JSON.parse(localStorage.getItem('suiviFinanciers'))

                : []
    },

    getSuiviFinancier : state => {
        return state.suiviFinancier;
    },

    getTotal : state => {
        return this.getSuiviFinanciers(state).length;
    },

    findSuiviFinancier : state => ({key, value}) => {
        //console.log(this.getSuiviFinanciers(state))
        return this.getSuiviFinanciers(state).find(item => item[key] === value);
    }
}