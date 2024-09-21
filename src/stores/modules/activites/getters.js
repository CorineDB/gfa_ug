import {
    FIND as findActivite
} from "@/store/mutations.type";

export default {

    getActivites : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('activites') 
                
                ? state.lists = JSON.parse(localStorage.getItem('activites'))

                : []
    },

    getActivite : state => {
        return state.activite;
    },

    getTotal : state => {
        return this.getActivites(state).length;
    },

    [findActivite] : state => ({key, value}) => {
        return this.getActivites(state).find(item => item[key] === value);
    }
}