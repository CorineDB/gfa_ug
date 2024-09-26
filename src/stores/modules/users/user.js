import { is, isEmpty } from 'ramda'
import Role from '../../modules/roles/role'

export default class User {
    constructor (user = {}) 
    {
        this.id = is(String, user.id) ? user.id : '',
        this.nom = is(String, user.nom) ? user.nom : '',
        this.prenom = is(String, user.prenom) ? user.prenom : '',
        this.email = is(String, user.email) ? user.email : '',
        this.contact = is(String, user.contact) ? parseInt(user.contact) : '',
        this.type = user.type,
        this.poste = user.poste,
        this.roles = user.roles
        this.created_at = is(Object, user.created_at) ? (new Date(user.created_at._date)).toISOString() : user.created_at
    }
}