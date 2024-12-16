import { is } from 'ramda'

export default class Site {
    constructor (site = {}) 
    {
        this.id = is(Number, site.id) ? parseInt(site.id) : site.id,
        this.nom = site.nom,
        this.longitude = site.longitude,
        this.latitude = site.latitude,
        this.created_at = is(Object, site.created_at) ? (new Date(site.created_at._date)).toISOString() : site.created_at
    }
}