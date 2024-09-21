import { is, isEmpty } from 'ramda'

export default class Composante {
    constructor (composante = {}) 
    {
        this.id = is(String, composante.id) ? composante.id : composante.id,
        this.nom = is(String, composante.nom) ? composante.nom :  composante.nom,
        this.code = is(String, composante.code) ? composante.code : composante.code,
        this.sigle = is(String, composante.sigle) ? composante.sigle : composante.sigle,
        this.description = is(String, composante.description) ? composante.description : composante.description,
        this.poids = is(Number, composante.poids) ? composante.poids : composante.poids,
        this.budgetNational = is(String, composante.budgetNational) ? parseInt(composante.budgetNational) : composante.budgetNational,
        this.pret = is(String, composante.pret) ? parseInt(composante.pret) : composante.pret,
        this.position = is(String, composante.position) ? parseInt(composante.position) : composante.budgetNational,
        this.tepPrevu = is(String, composante.tepPrevu) ? parseInt(composante.tepPrevu) : composante.budgetNational,
        this.projet = is(Object, composante.projet) ? (composante.projet) : null,
        this.projetId = is(String, composante.projetId) ? composante.projetId : composante.projetId,
        this.composante = is(Object, composante.composante) ? (composante.composante) : null,
        this.composanteId = is(String, composante.composanteId) ? composante.composanteId : composante.composanteId,
        this.tep = is(String, composante.tep) ? parseInt(composante.tep) : composante.tep,
        this.statut = is(String, composante.statut) ? parseInt(composante.statut) : composante.statut,
        this.debut = is(Object, composante.debut) ? (new Date(composante.debut._date)).toISOString() : composante.debut,
        this.fin = is(Object, composante.fin) ? (new Date(composante.fin._date)).toISOString() : composante.fin,
        this.created_at = is(Object, composante.created_at) ? (new Date(composante.created_at._date)).toISOString() : composante.created_at
    }
}