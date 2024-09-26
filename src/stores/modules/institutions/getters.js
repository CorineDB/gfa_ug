import {
    FIND as findInstitution
} from "../../mutations.type";

export default {

    getInstitutions : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('institutions') 
                
                ? state.lists = JSON.parse(localStorage.getItem('institutions'))

                : []
    },

    getInstitution : state => {
        return state.institution;
    },

    getTotal : state => {
        return this.getInstitutions(state).length;
    },

    [findInstitution] : state => ({key, value}) => {
        return this.getInstitutions(state).find(item => item[key] === value);
    }
}