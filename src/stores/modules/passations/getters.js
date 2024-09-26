import {
    FIND as findPassation
} from "../../mutations.type";

export default {

    getPassations : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('passations') 
                
                ? state.lists = JSON.parse(localStorage.getItem('passations'))

                : []
    },

    getPassation : state => {
        return state.passation;
    },

    getTotal : state => {
        return this.getPassations(state).length;
    },

    findPassation : state => ({key, value}) => {
        //console.log(this.getPassations(state))
        return this.getPassations(state).find(item => item[key] === value);
    }
}