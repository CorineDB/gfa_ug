import {
    FETCH_LIST as FETCH_LIST_ONG,
    GET as GET_ONG,
    STORE as STORE_ONG,
    UPDATE as UPDATE_ONG,
    DESTROY as DESTROY_ONG,
} from "../../actions.type"

import {
    SET_LIST as SET_LIST_ONG,
    FIND as findOng,
    ADD as ADD_ONG,
    MODIFY as MODIFY_ONG,
    REMOVE as REMOVE_ONG
} from "../../mutations.type"

import OngService from "@/services/modules/ong.service"
import Ong from "./ong"

export default {
    
    FETCH_LIST_ONG : async ({ commit }) => {

        const { data, status } = await OngService.get()

        if(status === 200 || status === 201) commit(SET_LIST_ONG, data.data)

        return { data, status }
    },

    async GET_ONG ({ commit, getters }, {key, value }) {

        let ong = null
        
        ong = getters.findOng({key: key, value : value})

        if((ong === null || ong || undefined) && typeof value === "int"){

            const { data, status } = await OngService.get(value)

            if(status === 200 || status === 201) ong = data.data

            return ong
        }
    },

    async STORE_ONG ({ commit }, payload) {
        
        const { data, status } = await OngService.create(payload)

        if(status === 200 || status === 201) commit(ADD_ONG, data.data)
        
        return { data, status }

    },

    async UPDATE_ONG ({ commit }, {ong, id}) {
        
        const { data, status } = await OngService.update(id, ong)

        if(status === 200 || status === 201) commit(MODIFY_ONG, data.data)

        return { data, status }

    },

    async DESTROY_ONG ({ commit }, idOng) {
        
        const { data, status } = await OngService.destroy(idOng)

        if(status === 200 || status === 201 || status === 204) commit(REMOVE_ONG, idOng)
        
        return { data, status }

    }
}