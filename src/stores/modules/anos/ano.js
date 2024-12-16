import { is, isEmpty } from 'ramda'
import User from '../../modules/users/user'

export default class Ano {
  constructor (ano = {})
  {
    this.id = is(Number, ano.id) ? parseInt(ano.id) : ano.id,
    this.dossier = is(String, ano.dossier) ? ano.dossier : ano.dossier,
    this.statut = is(String, ano.statut) ? parseInt(ano.statut) : ano.statut,
    this.dateSoumission = is(Object, ano.dateSoumission) ? (new Date(ano.dateSoumission._date)).toISOString() : ano.dateSoumission,
    this.destinataire = is(String, ano.destinataire) ? (ano.destinataire) : ano.destinataire,
    this.bailleurId = is(String, ano.bailleurId) ? (ano.bailleurId) : ano.bailleurId,
    this.typeId = is(String, ano.typeId) ? (ano.typeId) : ano.typeId,
    this.created_at = is(Object, ano.created_at) ? (new Date(ano.created_at._date)).toISOString() : ano.created_at
  }
}