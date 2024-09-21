import {
    FIND as findBailleur
} from "@/store/mutations.type";

export default {

    getBailleurs : state => {

        return state.lists > 0

                ? state.lists

                : localStorage.getItem('bailleurs') 
                
                ? state.lists = JSON.parse(localStorage.getItem('bailleurs'))

                : []
    },

    getBailleur : state => {
        return state.bailleur;
    },

    getTotal : state => {
        return this.getBailleurs(state).length;
    },

    [findBailleur] : state => ({key, value}) => {
        return this.getBailleurs(state).find(item => item[key] === value);
    }
}