import { is } from 'ramda'

export default class UniteeDeMesure {
    constructor (uniteeDeMesure = {}) 
    {
        this.id = is(Number, uniteeDeMesure.id) ? parseInt(uniteeDeMesure.id) : uniteeDeMesure.id,
        this.nom = uniteeDeMesure.nom,
        this.created_at = is(Object, uniteeDeMesure.created_at) ? (new Date(uniteeDeMesure.created_at._date)).toISOString() : uniteeDeMesure.created_at
    }
}