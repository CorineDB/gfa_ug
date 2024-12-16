import { is, isEmpty } from 'ramda'
import Indicateur from '../../modules/indicateurs-mod/indicateur';


export default class Suivi {
    constructor (suivi = {})
    {
        this.annee = is(Number, suivi.annee) ? parseInt(suivi.annee) : suivi.annee,
        this.trimestre = is(Number, suivi.trimestre) ? parseInt(suivi.trimestre) : suivi.trimestre,
        this.valeurCible = is(Number, suivi.valeurCible) ? (suivi.valeurCible) : suivi.valeurCible,
        this.valeurRealise = is(Number, suivi.valeurRealise) ? (suivi.valeurRealise) : suivi.valeurRealise,
        this.indicateurModId = is(Number, suivi.indicateurId) ? (suivi.indicateurId) : suivi.indicateurId,
        this.indicateur = is(Object, suivi.indicateur) ? new Indicateur(suivi.indicateur) : suivi.indicateur,
        this.commentaire = is(String, suivi.commentaire) ? (suivi.commentaire) : suivi.commentaire,
        this.created_at = is(Object, suivi.created_at) ? (new Date(suivi.created_at._date)).toISOString() : suivi.created_at
    }
}