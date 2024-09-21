
import { is } from 'ramda'

export default class ScopePtab{
    constructor (scopePtab = {})
    {
        this.id = is(String, scopePtab.id) ? scopePtab.id : '',
        this.nom = is(String, scopePtab.nom) ? scopePtab.nom : '',
        this.slug = is(String, scopePtab.slug) ? scopePtab.slug : '',
        this.created_at = is(Object, scopePtab.created_at) ? (new Date(scopePtab.created_at._date)).toISOString() : scopePtab.created_at
    }
}