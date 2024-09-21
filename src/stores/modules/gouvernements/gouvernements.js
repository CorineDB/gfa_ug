import { is } from 'ramda'

import User from '@/store/modules/users/user'
import Programme from '@/store/modules/programmes/programme'

export default class Gouvernement {
    constructor (gouvernement = {}) 
    {
        this.id = is(Number, gouvernement.id) ? parseInt(gouvernement.id) : gouvernement.id,
        this.nom = gouvernement.nom,
        this.programmeId = is(Number, gouvernement.programmeId) ? (gouvernement.programmeId) : gouvernement.programmeId,
        this.userId = is(Number, gouvernement.userId) ? (gouvernement.userId) : gouvernement.userId,
        this.user = is(Object, gouvernement.user) ? new User(gouvernement.user) : gouvernement.user,
        this.programme = is(Object, gouvernement.programme) ? new Programme(gouvernement.programme) : gouvernement.programme,
        this.created_at = is(Object, gouvernement.created_at) ? (new Date(gouvernement.created_at._date)).toISOString() : gouvernement.created_at
    }
}