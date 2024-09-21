import Programme from './programme';

import {
    SET_LIST as SET_LIST_PROGRAMME,
    ADD as ADD_NEW_PROGRAMME,
    FILL,
    MODIFY as MODIFY_PROGRAMME,
    REMOVE as REMOVE_PROGRAMME
} from "@/store/mutations.type";

export default {

    [SET_LIST_PROGRAMME](state, lists) {
        state.lists = lists
        localStorage.setItem('programmes', JSON.stringify(lists))
    },

    [FILL](state, programme) {
        state.programme = new Programme(programme)
    },

    [ADD_NEW_PROGRAMME](state, programme) {
        state.lists.unshift(programme)
    },

    [MODIFY_PROGRAMME](state, programme) {

        let programmes = state.lists.map(item => {
            if(item.id === programme?.id){
                item = programme
            }
            return item
        })

        state.lists = [...programmes]

        localStorage.setItem('programmes', JSON.stringify(state.lists))
    },

    [REMOVE_PROGRAMME](state, idProgramme) {
        let programmes = state.lists.filter(item => {
            return item.id !== idProgramme
        });
    
        state.lists = [...programmes]
        localStorage.setItem('programmes', JSON.stringify(state.lists))
    },
};
