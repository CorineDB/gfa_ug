import { is, isEmpty } from 'ramda'

export default class Projet {
    constructor (projet = {}) 
    {
        this.id = is(String, projet.id) ? projet.id : projet.id,
        this.nom = is(String, projet.nom) ? projet.nom :  projet.nom,
        this.link = is(String, projet.link) ? projet.link :  projet.link,
        this.code = is(String, projet.code) ? parseInt(projet.code) : projet.code,
        this.description = is(String, projet.description) ? projet.description : projet.description,
        this.couleur = is(String, projet.couleur) ? projet.couleur : projet.couleur,
        this.poids = is(Number, projet.poids) ? projet.poids : projet.poids,
        this.objectifGlobaux = is(String, projet.objectifGlobaux) ? projet.objectifGlobaux : projet.objectifGlobaux,
        this.budgetNational = is(String, projet.budgetNational) ? parseInt(projet.budgetNational) : projet.budgetNational,
        this.pret = is(String, projet.pret) ? parseInt(projet.pret) : projet.budgetNational,
        this.nombreEmploie = is(String, projet.nombreEmploie) ? parseInt(projet.nombreEmploie) : projet.budgetNational,
        this.tepPrevu = is(String, projet.tepPrevu) ? parseInt(projet.tepPrevu) : projet.budgetNational,
        this.bailleur = is(Object, projet.bailleur) ? (projet.bailleur) : null,
        this.baiileurId = is(String, projet.baiileurId) ? projet.baiileurId : projet.baiileurId,
        /*this.programme = is(Object, projet.programme) ? (new Programme(projet.programme)) : null,*/
        this.programmeId = is(String, projet.programmeId) ? projet.programmeId : projet.programmeId,
        this.tep = is(String, projet.tep) ? parseInt(projet.tep) : projet.tep,
        this.statut = is(String, projet.statut) ? parseInt(projet.statut) : projet.statut,
        this.debut = is(Object, projet.debut) ? (new Date(projet.debut._date)).toISOString() : projet.debut,
        this.fin = is(Object, projet.fin) ? (new Date(projet.fin._date)).toISOString() : projet.fin,
        this.created_at = is(Object, projet.created_at) ? (new Date(projet.created_at._date)).toISOString() : projet.created_at
    }
}