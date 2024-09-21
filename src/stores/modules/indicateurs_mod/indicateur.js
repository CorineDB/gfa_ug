import { is, isEmpty } from 'ramda'
import UniteDeMesure from '@/store/modules/uniteesDeMesure/unitee.mesure'


export default class Indicateur {
    constructor (indicateur = {})
    {
        this.nom = is(Number, indicateur.id) ? parseInt(indicateur.id) : indicateur.id,
        this.description = is(String, indicateur.description) ? parseInt(indicateur.description) : indicateur.description,
        this.anneDeBase = is(String, indicateur.anneDeBase) ? indicateur.anneDeBase : '',
        this.valeurDeBase = is(Number, indicateur.valeurDeBase) ? (indicateur.valeurDeBase) : indicateur.valeurDeBase,
        this.uniteeMesureId = is(Number, indicateur.uniteMesureId) ? (indicateur.uniteMesureId) : indicateur.uniteMesureId,
        this.uniteDeMesure = is(Object, indicateur.uniteDeMesure) ? new UniteDeMesure(indicateur.uniteDeMesure) : indicateur.uniteDeMesure,
        this.created_at = is(Object, indicateur.created_at) ? (new Date(indicateur.created_at._date)).toISOString() : indicateur.created_at
    }
}