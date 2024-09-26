import { is, isEmpty } from 'ramda'
import Categorie from '../../modules/categories/categorie'
import Bailleur from '../../modules/bailleurs/bailleur'
import UniteDeMesure from '../../modules/uniteesDeMesure/unitee.mesure'


export default class Indicateur {
    constructor (indicateur = {})
    {
        this.nom = is(Number, indicateur.id) ? parseInt(indicateur.id) : indicateur.id,
        this.description = is(String, indicateur.description) ? parseInt(indicateur.description) : indicateur.description,
        this.anneDeBase = is(String, indicateur.anneDeBase) ? indicateur.anneDeBase : '',
        this.valeurDeBase = is(Number, indicateur.valeurDeBase) ? (indicateur.valeurDeBase) : indicateur.valeurDeBase,
        this.categorieId = is(Number, indicateur.categorieId) ? (indicateur.categorieId) : indicateur.categorieId,
        this.categorie = is(Object, indicateur.categorie) ? new Categorie(indicateur.categorie) : indicateur.categorie,
        this.bailleurId = is(Number, indicateur.bailleurId) ? (indicateur.bailleurId) : indicateur.bailleurId,
        this.bailleur = is(Object, indicateur.bailleur) ? new Bailleur(indicateur.bailleur) : indicateur.bailleur,
        this.uniteeMesureId = is(Number, indicateur.uniteMesureId) ? (indicateur.uniteMesureId) : indicateur.uniteMesureId,
        this.uniteDeMesure = is(Object, indicateur.uniteDeMesure) ? new UniteDeMesure(indicateur.uniteDeMesure) : indicateur.uniteDeMesure,
        this.created_at = is(Object, indicateur.created_at) ? (new Date(indicateur.created_at._date)).toISOString() : indicateur.created_at
    }
}