
import User from '@/store/modules/users/user'
import { is } from 'ramda'

export default class Ong {
    constructor (ong = {})
    {
        this.id = is(Number, ong.id) ? parseInt(ong.id) : ong.id,
        this.userId = is(Number, ong.userId) ? (ong.userId) : ong.userId,
        this.user = is(Object, ong.user) ? new User(ong.user) : ong.user,
        this.programme = is(Object, ong.programme) ? new Programme(ong.programme) : ong.programme,
        this.created_at = is(Object, ong.created_at) ? (new Date(ong.created_at._date)).toISOString() : ong.created_at
    }
}