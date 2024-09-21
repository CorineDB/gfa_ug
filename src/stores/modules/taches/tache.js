import { is, isEmpty } from 'ramda'

export default class Tache {
    constructor (tache = {}) 
    {
        this.id = is(String, tache.id) ? tache.id : tache.id,
        this.nom = is(String, tache.nom) ? tache.nom :  tache.nom,
        this.code = is(String, tache.code) ? parseInt(tache.code) : tache.code,
        this.description = is(String, tache.description) ? tache.description : tache.description,
        this.poids = is(Number, tache.poids) ? tache.poids : tache.poids,
        this.position = is(String, tache.position) ? parseInt(tache.position) : tache.budgetNational,
        this.tepPrevu = is(String, tache.tepPrevu) ? parseInt(tache.tepPrevu) : tache.budgetNational,
        this.activite = is(Object, tache.activite) ? (tache.activite) : null,
        this.activiteId = is(String, tache.activiteId) ? tache.activiteId : tache.activiteId,
        this.tep = is(String, tache.tep) ? parseInt(tache.tep) : tache.tep,
        this.statut = is(String, tache.statut) ? parseInt(tache.statut) : tache.statut,
        this.debut = is(Object, tache.debut) ? (new Date(tache.debut._date)).toISOString() : tache.debut,
        this.fin = is(Object, tache.fin) ? (new Date(tache.fin._date)).toISOString() : tache.fin,
        this.created_at = is(Object, tache.created_at) ? (new Date(tache.created_at._date)).toISOString() : tache.created_at
    }
}