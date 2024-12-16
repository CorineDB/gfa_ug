import { is, isEmpty } from 'ramda'
import Projet from '../../modules/projets/projet'

export default class PlanDeDecaissement {
  constructor (planDeDecaissement = {})
  {
    this.id = is(Number, planDeDecaissement.id) ? parseInt(planDeDecaissement.id) : planDeDecaissement.id,
    this.montant = is(String, planDeDecaissement.montant) ? parseInt(planDeDecaissement.montant) : planDeDecaissement.montant,
    this.type = planDeDecaissement.type,
    this.projet = is(Object, planDeDecaissement.projet) ? new Projet(planDeDecaissement.projet) : planDeDecaissement.projet,
    this.created_at = is(Object, planDeDecaissement.created_at) ? (new Date(planDeDecaissement.created_at._date)).toISOString() : planDeDecaissement.created_at
  }
}