import { is } from 'ramda'

export default class Structure {
    constructor (structure = {}) 
    {
        this.id = is(String, structure.id) ? structure.id : '',
        this.nom = is(String, structure.nom) ? structure.nom : '',
        this.prenom = is(String, structure.prenom) ? structure.prenom : '',
        this.email = is(String, structure.email) ? structure.email : '',
        this.contact = is(String, structure.contact) ? parseInt(structure.contact) : '',
        this.type = structure.type,
        this.poste = structure.poste,
        this.roles = structure.roles
        this.created_at = is(Object, structure.created_at) ? (new Date(structure.created_at._date)).toISOString() : structure.created_at
    }
}