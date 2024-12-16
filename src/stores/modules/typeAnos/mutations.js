import TypeAno from './type.anos';

import {
    SET_LIST as SET_LIST_TYPE_ANO,
    ADD as ADD_NEW_TYPE_ANO,
    FILL,
    MODIFY as MODIFY_TYPE_ANO,
    REMOVE as REMOVE_TYPE_ANO
} from "../../mutations.type";

export default {

    [SET_LIST_TYPE_ANO](state, lists) {
        state.lists = lists
        localStorage.setItem('typeAnos', JSON.stringify(lists))
    },

    [FILL](state, typeAno) {
        state.typeAno = new TypeAno(typeAno)
    },

    [ADD_NEW_TYPE_ANO](state, typeAno) {
        state.lists.unshift(typeAno)
    },

    [MODIFY_TYPE_ANO](state, typeAno) {

        let typeAnos = state.lists.map(item => {
            if(item.id === typeAno?.id){
                item = typeAno
            }
            return item
        })

        state.lists = [...typeAnos]

        localStorage.setItem('typeAnos', JSON.stringify(state.lists))
    },

    [REMOVE_TYPE_ANO](state, idTypeAno) {
        let typeAnos = state.lists.filter(item => {
            return item.id !== idTypeAno
        });
    
        state.lists = [...typeAnos]
        localStorage.setItem('typeAnos', JSON.stringify(state.lists))
    },
};
