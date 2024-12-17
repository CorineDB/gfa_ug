import { is } from 'ramda'
import Role from '../../modules/roles/role'

export default class Utilisateur {
    constructor (utilisateur = {}) 
    {
      this.id = is(Number, utilisateur.id) ? parseInt(utilisateur.id) : utilisateur.id,
      this.nom = utilisateur.nom,
      this.prenom = utilisateur.prenom,
      this.email = is(String, utilisateur.email) ? (utilisateur.email) : utilisateur.email,
      this.roles = is(Array, utilisateur.roles) ? new Role(utilisateur.roles) : utilisateur.roles,
      this.created_at = is(Object, utilisateur.created_at) ? (new Date(utilisateur.created_at._date)).toISOString() : utilisateur.created_at
    }
}