import { is } from 'ramda'

import User from '@/store/modules/users/user'
import Programme from '@/store/modules/programmes/programme'

export default class MissionDeControle {
    constructor (missionDeControle = {}) 
    {
        this.id = is(Number, missionDeControle.id) ? parseInt(missionDeControle.id) : missionDeControle.id,
        this.nom = missionDeControle.nom,
        this.programmeId = is(Number, missionDeControle.programmeId) ? (missionDeControle.programmeId) : missionDeControle.programmeId,
        this.userId = is(Number, missionDeControle.userId) ? (missionDeControle.userId) : missionDeControle.userId,
        this.user = is(Object, missionDeControle.user) ? new User(missionDeControle.user) : missionDeControle.user,
        this.programme = is(Object, missionDeControle.programme) ? new Programme(missionDeControle.programme) : missionDeControle.programme,
        this.created_at = is(Object, missionDeControle.created_at) ? (new Date(missionDeControle.created_at._date)).toISOString() : missionDeControle.created_at
    }
}