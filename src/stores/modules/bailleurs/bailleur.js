import { is, isEmpty } from 'ramda'
import User from '@/store/modules/users/user'
import Programme from '@/store/modules/programmes/programme'

export default class Bailleur {
    constructor (bailleur = {})
    {
        this.id = is(Number, bailleur.id) ? parseInt(bailleur.id) : bailleur.id,
        this.code = is(String, bailleur.code) ? parseInt(bailleur.code) : bailleur.code,
        this.sigle = bailleur.sigle,
        this.pays = is(String, bailleur.pays) ? bailleur.pays : '',
        this.userId = is(Number, bailleur.userId) ? (bailleur.userId) : bailleur.userId,
        this.user = is(Object, bailleur.user) ? new User(bailleur.user) : bailleur.user,
        this.programmes = isEmpty(bailleur.programmes) ? [] : Array<Programme> bailleur.programmes,
        this.created_at = is(Object, bailleur.created_at) ? (new Date(bailleur.created_at._date)).toISOString() : bailleur.created_at
    }
}