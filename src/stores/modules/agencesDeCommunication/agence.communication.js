
import { is } from 'ramda'

import User from '@/store/modules/users/user'

export default class AgenceDeCommunication{
    constructor (agenceDeCommunication = {}) 
    {
        this.id = is(Number, agenceDeCommunication.id) ? parseInt(agenceDeCommunication.id) : agenceDeCommunication.id,
        this.userId = is(Number, agenceDeCommunication.userId) ? (agenceDeCommunication.userId) : agenceDeCommunication.userId,
        this.user = is(Object, agenceDeCommunication.user) ? new User(agenceDeCommunication.user) : agenceDeCommunication.user,
        this.programme = is(Object, agenceDeCommunication.programme) ? new Programme(agenceDeCommunication.programme) : agenceDeCommunication.programme,
        this.created_at = is(Object, agenceDeCommunication.created_at) ? (new Date(agenceDeCommunication.created_at._date)).toISOString() : agenceDeCommunication.created_at
    }
}