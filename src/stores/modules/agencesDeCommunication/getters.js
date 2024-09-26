import { FIND as findAgenceDeCommunication } from "../../mutations.type";

export default {

    getAgencesDeCommunication : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('agences-de-communication') 
                
                ? state.lists = JSON.parse(localStorage.getItem('agences-de-communication'))

                : []
    },

    getAgenceDeCommunication : state => {
        return state.mod;
    },

    getTotal : state => {
        return this.getAgencesDeCommunication(state).length;
    },

    [findAgenceDeCommunication] : state => ({key, value}) => {
        return this.getAgencesDeCommunication(state).find(item => item[key] === value);
    }
}