import { is } from 'ramda'

import User from '../../modules/users/user'
import Programme from '../../modules/programmes/programme'

export default class Mod {
    constructor (mod = {}) 
    {
        this.id = is(Number, mod.id) ? parseInt(mod.id) : mod.id,
        this.programmeId = is(Number, mod.programmeId) ? (mod.programmeId) : mod.programmeId,
        this.userId = is(Number, mod.userId) ? (mod.userId) : mod.userId,
        this.user = is(Object, mod.user) ? new User(mod.user) : mod.user,
        this.programme = is(Object, mod.programme) ? new Programme(mod.programme) : mod.programme,
        this.created_at = is(Object, mod.created_at) ? (new Date(mod.created_at._date)).toISOString() : mod.created_at
    }
}