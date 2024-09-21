import { is, isEmpty } from 'ramda'

export default class EActivite {
    constructor (eActivite = {}) 
    {
        this.id = is(String, eActivite.id) ? eActivite.id : eActivite.id,
        this.nom = is(String, eActivite.nom) ? eActivite.nom :  eActivite.nom,
        this.code = is(String, eActivite.code) ? parseInt(eActivite.code) : eActivite.code,
        this.programmeId = is(String, eActivite.programmeId) ? eActivite.programmeId : eActivite.programmeId,
        this.statut = is(String, eActivite.statut) ? parseInt(eActivite.statut) : eActivite.statut,
        this.debut = is(Object, eActivite.debut) ? (new Date(eActivite.debut._date)).toISOString() : eActivite.debut,
        this.fin = is(Object, eActivite.fin) ? (new Date(eActivite.fin._date)).toISOString() : eActivite.fin,
        this.created_at = is(Object, eActivite.created_at) ? (new Date(eActivite.created_at._date)).toISOString() : eActivite.created_at
    }
}