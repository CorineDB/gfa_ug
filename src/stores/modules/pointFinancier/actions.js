import {
    SET_LIST as SET_LIST_POINTFINANCIER,

} from "@/store/mutations.type"

import PointFinancierService from "@/services/modules/pointFinancier.service";

export default {
    
    FETCH_LIST_POINTFINANCIER : async ({ commit }, payload) => {

        const { data, status } = await PointFinancierService.pointFinancier(payload);

        commit(SET_LIST_POINTFINANCIER, data.data);

        return { data, status };
    }
    
}