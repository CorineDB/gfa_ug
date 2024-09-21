import { is, isEmpty } from 'ramda'

export default class Activite {
    constructor (activite = {}) 
    {
        this.id = is(String, activite.id) ? activite.id : activite.id,
        this.nom = is(String, activite.nom) ? activite.nom :  activite.nom,
        this.structureResponsable = is(String, activite.structureResponsable) ? activite.structureResponsable :  activite.structureResponsable,
        this.structureAssociee = is(String, activite.structureAssociee) ? activite.structureAssociee :  activite.structureAssociee,
        this.code = is(String, activite.code) ? parseInt(activite.code) : activite.code,
        this.description = is(String, activite.description) ? activite.description : activite.description,
        this.type = is(String, activite.type) ? activite.type : activite.type,
        this.poids = is(Number, activite.poids) ? activite.poids : activite.poids,
        this.budgetNational = is(String, activite.budgetNational) ? parseInt(activite.budgetNational) : activite.budgetNational,
        this.pret = is(String, activite.pret) ? parseInt(activite.pret) : activite.budgetNational,
        this.position = is(String, activite.position) ? parseInt(activite.position) : activite.budgetNational,
        this.tepPrevu = is(String, activite.tepPrevu) ? parseInt(activite.tepPrevu) : activite.budgetNational,
        this.composanteId = is(String, activite.composanteId) ? activite.composanteId : activite.composanteId,
        this.user = is(Object, activite.user) ? (activite.user) : null,
        this.userId = is(String, activite.userId) ? activite.userId : activite.userId,
        this.tep = is(String, activite.tep) ? parseInt(activite.tep) : activite.tep,
        this.tef = is(String, activite.tef) ? parseInt(activite.tef) : activite.tef,
        this.statut = is(String, activite.statut) ? parseInt(activite.statut) : activite.statut,
        this.debut = is(Object, activite.debut) ? (new Date(activite.debut._date)).toISOString() : activite.debut,
        this.fin = is(Object, activite.fin) ? (new Date(activite.fin._date)).toISOString() : activite.fin,
        this.created_at = is(Object, activite.created_at) ? (new Date(activite.created_at._date)).toISOString() : activite.created_at
    }
}