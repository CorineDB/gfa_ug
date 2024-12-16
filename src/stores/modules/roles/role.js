import { is } from 'ramda'
import Permission from '../../modules/permissions/permission'

export default class Role {
    constructor (role = {}) 
    {
        this.id = is(Number, role.id) ? parseInt(role.id) : role.id,
        this.nom = role.nom,
        this.slug = role.slug,
        this.description = role.description,
        this.roleable_id = role.roleable_id,
        this.roleable_type = role.roleable_type,
        this.permissions = role.permissions
        this.created_at = is(Object, role.created_at) ? (new Date(role.created_at._date)).toISOString() : role.created_at
    }
}