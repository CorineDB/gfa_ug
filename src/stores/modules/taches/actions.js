
import {
    SET_LIST as SET_LIST_TACHE,
    FIND as findTache,
    ADD as ADD_TACHE,
    MODIFY as MODIFY_TACHE,
    REMOVE as REMOVE_TACHE
} from "../../mutations.type"

import TacheService from "@/services/modules/tache.service";
import ActiviteService from "@/services/modules/activite.service";

export default {
    
    FETCH_LIST_TACHE : async ({ commit }, {id}) => {

        const { data, status } = await TacheService.programme();

        commit(SET_LIST_TACHE, data.data);

        return { data, status };
    },
        
    FETCH_LIST_TACHE_OF_ACTIVITE : async ({ commit }, id) => {
        
        const { data, status } = await ActiviteService.taches(id);

        commit(SET_LIST_TACHE, data.data);

        return { data, status };
    },
    

    async GET_TACHE ({ commit, getters }, {key, value }) {

        let tache = getters.findTache({key: key, value : value})

        if((tache === null || tache || undefined) && typeof value === "int"){

            const { data, status } = await TacheService.get(value);

            tache = data.data

            return tache
        }
    },

    async STORE_TACHE ({ commit }, payload) {
        
        const { data, status } = await TacheService.create(payload);

        commit(ADD_TACHE, data.data);

        return { data, status };

    },

    async UPDATE_TACHE ({ commit }, {tache, id}) {
        
        const { data, status } = await TacheService.update(id, tache);

        commit(MODIFY_TACHE, data.data);

        return { data, status };

    },

    async SUIVRE_OLD_TACHE ({ commit }) {
        
        const { data, status } = await TacheService.myOldSuivis(commit);

        return { data, status };

    },

    async DESTROY_TACHE ({ commit }, idTache) {
        
        const { data, status } = await TacheService.destroy(idTache);

        commit(REMOVE_TACHE, idTache);

        return { data, status };

    }
}