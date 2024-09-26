import { is } from 'ramda'
import EntrepriseExecutante from '../../modules/entreprisesExecutante/entreprise.executante'

export default class Passation {
    constructor (passation = {})
    {
        this.id = is(Number, passation.id) ? parseInt(passation.id) : passation.id,
        this.estimation = is(String, passation.estimation) ? parseInt(passation.estimation) : passation.estimation,
        this.montant = is(String, passation.montant) ? parseInt(passation.montant) : passation.montant,
        this.montantAvance = is(String, passation.montantAvance) ? parseInt(passation.montantAvance) : passation.montantAvance,
        this.ordreDeService = passation.ordreDeService,
        this.responsableSociologue = passation.responsableSociologue,
        this.travaux = passation.travaux
        this.entrepriseExecutantId = passation.entrepriseExecutantId
        this.entrepriseExecutant = is(Object, passation.entrepriseExecutant) ? new EntrepriseExecutante(passation.entrepriseExecutant) : passation.entrepriseExecutant,
        this.siteId = passation.siteId
        this.site = passation.site
        this.dateDobtentionAvance = is(Object, passation.dateDobtentionAvance) ? (new Date(passation.dateDobtentionAvance._date)).toISOString() : passation.dateDobtentionAvance
        this.dateDeSignature = is(Object, passation.dateDeSignature) ? (new Date(passation.dateDeSignature._date)).toISOString() : passation.dateDeSignature
        this.dateDobtention = is(Object, passation.dateDobtention) ? (new Date(passation.dateDobtention._date)).toISOString() : passation.dateDobtention
        this.dateDeDemarrage = is(Object, passation.dateDeDemarrage) ? (new Date(passation.dateDeDemarrage._date)).toISOString() : passation.dateDeDemarrage
        this.datePrevisionnel = is(Object, passation.datePrevisionnel) ? (new Date(passation.datePrevisionnel._date)).toISOString() : passation.datePrevisionnel
        this.dateDeDemarrage = is(Object, passation.dateDeDemarrage) ? (new Date(passation.dateDeDemarrage._date)).toISOString() : passation.dateDeDemarrage
        this.created_at = is(Object, passation.created_at) ? (new Date(passation.created_at._date)).toISOString() : passation.created_at
    }
}