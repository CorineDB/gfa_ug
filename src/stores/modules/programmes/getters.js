import {
    FIND as findProgramme
} from "@/store/mutations.type";

export default {

    getProgrammes : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('programmes') 
                
                ? state.lists = JSON.parse(localStorage.getItem('programmes'))

                : []
    },

    getProgramme : state => {
        return state.programme;
    },

    getTotal : state => {
        return this.getProgrammes(state).length;
    },

    [findProgramme] : state => ({key, value}) => {
        return this.getProgrammes(state).find(item => item[key] === value);
    }
}