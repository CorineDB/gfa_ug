import {
    FIND as findPap
} from "../../mutations.type";

export default {

    getPaps : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('paps') 
                
                ? state.lists = JSON.parse(localStorage.getItem('paps'))

                : []
    },

    getPap : state => {
        return state.pap;
    },

    getTotal : state => {
        return this.getPaps(state).length;
    },

    findPap : state => ({key, value}) => {
        //console.log(this.getPaps(state))
        return this.getPaps(state).find(item => item[key] === value);
    }
}