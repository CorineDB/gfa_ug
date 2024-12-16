import {
    FIND as findEntrepriseExecutante
} from "../../mutations.type";

export default {

    getEntreprisesExecutante : state => {

        return state.lists > 0

                ? state.lists

                : localStorage.getItem('entreprises-executante') 
                
                ? state.lists = JSON.parse(localStorage.getItem('entreprises-executante'))

                : []
    },

    getEntrepriseExecutante : state => {
        return state.entrepriseExecutante;
    },

    getTotal : state => {
        return this.getEntreprisesExecutante(state).length;
    },

    [findEntrepriseExecutante] : state => ({key, value}) => {
        return this.getEntreprisesExecutante(state).find(item => item[key] === value);
    }
}