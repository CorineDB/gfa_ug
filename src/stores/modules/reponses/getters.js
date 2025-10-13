import {
    FIND as findReponse
} from "../../mutations.type";

export default {

    getReponses : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('reponses') 
                
                ? state.lists = JSON.parse(localStorage.getItem('reponses'))

                : []
    },

    getReponse : state => {
        return state.projet;
    },

    getTotal : state => {
        return this.getReponses(state).length;
    },

    findReponse : state => ({key, value}) => {
        
        return this.getReponses(state).find(item => item[key] === value);
    }
}