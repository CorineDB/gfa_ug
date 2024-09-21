import Ano from './ano';

import {
    SET_LIST as SET_LIST_ANO,
    ADD as ADD_NEW_ANO,
    FILL,
    MODIFY as MODIFY_ANO,
    REMOVE as REMOVE_ANO
} from "@/store/mutations.type";

export default {

    [SET_LIST_ANO](state, lists) {
        state.lists = lists
        localStorage.setItem('anos', JSON.stringify(lists))
    },

    [FILL](state, ano) {
        state.ano = new Ano(ano)
    },

    [ADD_NEW_ANO](state, ano) {
        state.lists.unshift(ano)
    },

    [MODIFY_ANO](state, ano) {

        let anos = state.lists.map(item => {
            if(item.id === ano?.id){
                item = ano
            }
            return item
        })

        state.lists = [...anos]

        localStorage.setItem('anos', JSON.stringify(state.lists))
    },

    [REMOVE_ANO](state, idAno) {
        let anos = state.lists.filter(item => {
            return item.id !== idAno
        });
    
        state.lists = [...anos]
        localStorage.setItem('anos', JSON.stringify(state.lists))
    },
};
