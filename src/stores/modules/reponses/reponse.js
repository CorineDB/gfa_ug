import { is, isEmpty } from 'ramda'

export default class Reponse {
    constructor (reponse = {}) 
    {
        this.id = is(String, reponse.id) ? reponse.id : reponse.id,
        this.created_at = is(Object, reponse.created_at) ? (new Date(reponse.created_at._date)).toISOString() : reponse.created_at
    }
}