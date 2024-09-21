import {
    FIND as findComposante
} from "@/store/mutations.type";

export default {

    getComposantes : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('composantes') 
                
                ? state.lists = JSON.parse(localStorage.getItem('composantes'))

                : []
    },

    getComposante : state => {
        return state.composante;
    },

    getTotal : state => {
        return this.getComposantes(state).length;
    },

    [findComposante] : state => ({key, value}) => {
        return this.getComposantes(state).find(item => item[key] === value);
    }
}