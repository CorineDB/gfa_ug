import { is, isEmpty } from 'ramda'
import Projet from '../../modules/projets/projet'

export default class Decaissement {
  constructor (decaissement = {})
  {
    this.id = is(Number, decaissement.id) ? parseInt(decaissement.id) : decaissement.id,
    this.montant = is(String, decaissement.montant) ? parseInt(decaissement.montant) : decaissement.montant,
    this.type = decaissement.type,
    this.projet = is(Object, decaissement.projet) ? new Projet(decaissement.projet) : decaissement.projet,
    this.created_at = is(Object, decaissement.created_at) ? (new Date(decaissement.created_at._date)).toISOString() : decaissement.created_at
  }
}
