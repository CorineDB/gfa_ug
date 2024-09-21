import { is } from 'ramda'

import User from '@/store/modules/users/user'
import Programme from '@/store/modules/programmes/programme'

export default class UniteeDeGestion {
    constructor (uniteeDeGestion = {}) 
    {
        this.id = is(Number, uniteeDeGestion.id) ? parseInt(uniteeDeGestion.id) : uniteeDeGestion.id,
        this.nom = uniteeDeGestion.nom,
        this.programmeId = is(Number, uniteeDeGestion.programmeId) ? (uniteeDeGestion.programmeId) : uniteeDeGestion.programmeId,
        this.userId = is(Number, uniteeDeGestion.userId) ? (uniteeDeGestion.userId) : uniteeDeGestion.userId,
        this.user = is(Object, uniteeDeGestion.user) ? new User(uniteeDeGestion.user) : uniteeDeGestion.user,
        this.programme = is(Object, uniteeDeGestion.programme) ? new Programme(uniteeDeGestion.programme) : uniteeDeGestion.programme,
        this.created_at = is(Object, uniteeDeGestion.created_at) ? (new Date(uniteeDeGestion.created_at._date)).toISOString() : uniteeDeGestion.created_at
    }
}