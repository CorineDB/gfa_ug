import {
    FIND as findESuivi
} from "../../mutations.type";

export default {

    getESuivis : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('eSuivis') 
                
                ? state.lists = JSON.parse(localStorage.getItem('eSuivis'))

                : []
    },

    getESuivi : state => {
        return state.projet;
    },

    getTotal : state => {
        return this.getESuivis(state).length;
    },

    findESuivi : state => ({key, value}) => {
        //console.log(this.getESuivis(state))
        return this.getESuivis(state).find(item => item[key] === value);
    }
}