import {
    FIND as findGouvernement
} from "@/store/mutations.type";

export default {

    getGouvernements : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('gouvernements') 
                
                ? state.lists = JSON.parse(localStorage.getItem('gouvernements'))

                : []
    },

    getGouvernement : state => {
        return state.gouvernement;
    },

    getTotal : state => {
        return this.getGouvernements(state).length;
    },

    [findGouvernement] : state => ({key, value}) => {
        return this.getGouvernements(state).find(item => item[key] === value);
    }
}