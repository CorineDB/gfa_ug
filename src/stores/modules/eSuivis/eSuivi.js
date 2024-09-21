import { is, isEmpty } from 'ramda'

export default class ESuivi {
    constructor (eSuivi = {}) 
    {
        this.id = is(String, eSuivi.id) ? eSuivi.id : eSuivi.id,
        this.nom = is(String, eSuivi.nom) ? eSuivi.nom :  eSuivi.nom,
        this.code = is(String, eSuivi.code) ? parseInt(eSuivi.code) : eSuivi.code,
        this.programmeId = is(String, eSuivi.programmeId) ? eSuivi.programmeId : eSuivi.programmeId,
        this.statut = is(String, eSuivi.statut) ? parseInt(eSuivi.statut) : eSuivi.statut,
        this.debut = is(Object, eSuivi.debut) ? (new Date(eSuivi.debut._date)).toISOString() : eSuivi.debut,
        this.fin = is(Object, eSuivi.fin) ? (new Date(eSuivi.fin._date)).toISOString() : eSuivi.fin,
        this.created_at = is(Object, eSuivi.created_at) ? (new Date(eSuivi.created_at._date)).toISOString() : eSuivi.created_at
    }
}