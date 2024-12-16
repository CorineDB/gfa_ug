import {
    FIND as findSousComposante
} from "../../mutations.type";

export default {

    getSousComposantes : state => {

        return state.lists

                ? state.lists

                : localStorage.getItem('sous-composantes') 
                
                ? state.lists = JSON.parse(localStorage.getItem('sous-composantes'))

                : []
    },

    getSousComposante : state => {
        return state.sousComposante;
    },

    getTotal : state => {
        return this.getSousComposantes(state).length;
    },

    [findSousComposante] : state => ({key, value}) => {
        return this.getSousComposantes(state).find(item => item[key] === value);
    }
}