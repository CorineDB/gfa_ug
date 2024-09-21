import { is, isEmpty } from 'ramda'

export default class PointFinancier {
    constructor (pointFinancier = {}) 
    {
        this.bailleur = is(String, pointFinancier.bailleur) ? pointFinancier.bailleur :  pointFinancier.bailleur,
        this.montantFinancier = is(String, pointFinancier.montantFinancier) ? parseInt(pointFinancier.montantFinancier) : pointFinancier.montantFinancier,
        this.tauxDeDecaissement = is(String, pointFinancier.tauxDeDecaissement) ? parseInt(pointFinancier.tauxDeDecaissement) : pointFinancier.tauxDeDecaissement,
        this.decaissement = is(String, pointFinancier.decaissement) ? parseInt(pointFinancier.decaissement) : pointFinancier.decaissement,
        this.ptab = is(String, pointFinancier.ptab) ? parseInt(pointFinancier.ptab) : pointFinancier.ptab,
        this.realisationPta = is(String, pointFinancier.realisationPta) ? parseInt(pointFinancier.realisationPta) : pointFinancier.realisationPta,
        this.tef = is(String, pointFinancier.tef) ? parseInt(pointFinancier.tef) : pointFinancier.tef,
        this.realisationGlobal = is(String, pointFinancier.realisationGlobal) ? parseInt(pointFinancier.realisationGlobal) : pointFinancier.realisationGlobal,
        this.tefGlobal = is(String, pointFinancier.tefGlobal) ? parseInt(pointFinancier.tefGlobal) : pointFinancier.montantFinancier
    }
}