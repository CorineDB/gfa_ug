
import {
    SET_LIST as SET_LIST_SCOPE_PTAB
} from "@/store/mutations.type";

export default {

    [SET_LIST_SCOPE_PTAB](state, lists) {
        state.lists = lists
        localStorage.setItem('scopes-ptab', JSON.stringify(lists))
    }
};
