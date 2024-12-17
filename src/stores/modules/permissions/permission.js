import { is } from 'ramda'

export default class Permission {
    constructor (permission = {}) 
    {
        this.id = is(Number, permission.id) ? parseInt(permission.id) : permission.id,
        this.nom = permission.nom,
        this.slug = permission.slug,
        this.description = permission.description,
        this.roles = permission.roles
        this.created_at = is(Object, permission.created_at) ? (new Date(permission.created_at._date)).toISOString() : permission.created_at
    }
}