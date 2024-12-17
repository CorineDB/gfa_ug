import {
    FIND as findTache
} from "../../mutations.type";

export default {

    getTaches : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('taches') 
                
                ? state.lists = JSON.parse(localStorage.getItem('taches'))

                : []
    },

    getTache : state => {
        return state.tache;
    },

    getTotal : state => {
        return this.getTaches(state).length;
    },

    [findTache] : state => ({key, value}) => {
        return this.getTaches(state).find(item => item[key] === value);
    }
}