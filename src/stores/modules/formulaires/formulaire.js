import { is } from 'ramda'

export default class Formulaire {
    constructor (formulaire = {}) 
    {
        this.id = is(Number, formulaire.id) ? parseInt(formulaire.id) : formulaire.id,
        this.nom = formulaire.nom,
        this.auteur = formulaire.auteur,
        this.created_at = is(Object, formulaire.created_at) ? (new Date(formulaire.created_at._date)).toISOString() : formulaire.created_at
    }
}