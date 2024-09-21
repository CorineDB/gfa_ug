import {
    FIND as findOng
} from "@/store/mutations.type";

export default {

    getOngs : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('ongs') 
                
                ? state.lists = JSON.parse(localStorage.getItem('ongs'))

                : []
    },

    getOng : state => {
        return state.ong;
    },

    getTotal : state => {
        return this.getOngs(state).length;
    },

    [findOng] : state => ({key, value}) => {
        return this.getOngs(state).find(item => item[key] === value);
    }
}