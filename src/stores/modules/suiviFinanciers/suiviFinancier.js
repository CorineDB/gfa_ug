import { is, isEmpty } from 'ramda'

export default class SuiviFinancier {
    constructor (suiviFinancier = {}) 
    {
        this.id = is(Number, suiviFinancier.id) ? parseInt(suiviFinancier.id) : suiviFinancier.id,
        this.codePta = suiviFinancier.codePta,
        this.nom = suiviFinancier.nom,
        this.consommer = is(Number, suiviFinancier.consommer) ? (suiviFinancier.consommer) : suiviFinancier.consommer,
        this.trimestre = is(Number, suiviFinancier.trimestre) ? (suiviFinancier.trimestre) : suiviFinancier.trimestre,
        this.annee = is(Number, suiviFinancier.annee) ? (suiviFinancier.annee) : suiviFinancier.annee,
        this.created_at = is(Object, suiviFinancier.created_at) ? (new Date(suiviFinancier.created_at._date)).toISOString() : suiviFinancier.created_at
    }
}