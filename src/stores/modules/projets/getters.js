import {
    FIND as findProjet
} from "../../mutations.type";

export default {

    getProjets : state => {

        return state.lists.length > 0

                ? state.lists

                : localStorage.getItem('projets') 
                
                ? state.lists = JSON.parse(localStorage.getItem('projets'))

                : []
    },

    getProjet : state => {
        return state.projet;
    },

    getTotal : state => {
        return this.getProjets(state).length;
    },

    findProjet : state => ({key, value}) => {
        
        return this.getProjets(state).find(item => item[key] === value);
    }
}