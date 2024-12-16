import {
    FIND as findEActivite
} from "../../mutations.type";

export default {

    getEActivites : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('eActivites') 
                
                ? state.lists = JSON.parse(localStorage.getItem('eActivites'))

                : []
    },

    getEActivite : state => {
        return state.projet;
    },

    getTotal : state => {
        return this.getEActivites(state).length;
    },

    findEActivite : state => ({key, value}) => {
        //console.log(this.getEActivites(state))
        return this.getEActivites(state).find(item => item[key] === value);
    }
}