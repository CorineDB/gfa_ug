import {
    FIND as findFormulaire
} from "../../mutations.type";

export default {

    getFormulaires : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('formulaires') 
                
                ? state.lists = JSON.parse(localStorage.getItem('formulaires'))

                : []
    },

    getFormulaire : state => {
        return state.formulaire;
    },

    getTotal : state => {
        return this.getFormulaires(state).length;
    },

    [findFormulaire] : state => ({key, value}) => {
        return this.getFormulaires(state).find(item => item[key] === value);
    }
}