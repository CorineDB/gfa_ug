import { is } from 'ramda'


export default class Categorie {
    constructor (categorie = {}) 
    {
        this.id = is(String, categorie.id) ? categorie.id : '',
        this.nom = is(String, categorie.nom) ? categorie.nom : ''
        
    }
}