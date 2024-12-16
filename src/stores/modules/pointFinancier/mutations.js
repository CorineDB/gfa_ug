import {
    SET_LIST as SET_LIST_POINTFINANCIER,
} from "../../mutations.type";

export default {

    [SET_LIST_POINTFINANCIER](state, lists) {
        state.lists = lists
        localStorage.setItem('pointFinancier', JSON.stringify(lists))
    },
};
