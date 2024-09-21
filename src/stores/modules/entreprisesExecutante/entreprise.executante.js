import { is, isEmpty } from 'ramda'
import User from '@/store/modules/users/user'
import Passation from '@/store/modules/passations/passation'
import Bailleur from '@/store/modules/bailleurs/bailleur'

export default class EntrepriseExecutante{
    constructor (entrepriseExecutante = {})
    {
        this.id = is(Number, entrepriseExecutante.id) ? parseInt(entrepriseExecutante.id) : entrepriseExecutante.id,
        this.userId = is(Number, entrepriseExecutante.userId) ? (entrepriseExecutante.userId) : entrepriseExecutante.userId,
        this.user = is(Object, entrepriseExecutante.user) ? new User(entrepriseExecutante.user) : entrepriseExecutante.user,
        this.passations = entrepriseExecutante.passations
        this.sites = entrepriseExecutante.sites
        this.bailleurs = entrepriseExecutante.bailleurs
        this.created_at = is(Object, entrepriseExecutante.created_at) ? (new Date(entrepriseExecutante.created_at._date)).toISOString() : entrepriseExecutante.created_at
        
    }
}