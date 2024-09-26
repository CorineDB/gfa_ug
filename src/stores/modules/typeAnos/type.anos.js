import { is, isEmpty } from 'ramda'
import User from '../../modules/users/user'

export default class TypeAno {
  constructor (typeAno = {})
  {
    this.id = is(Number, typeAno.id) ? parseInt(typeAno.id) : typeAno.id,
    this.nom = is(String, typeAno.mom) ? typeAno.mom : typeAno.mom,
    this.duree = is(String, typeAno.duree) ? parseInt(typeAno.duree) : typeAno.duree,
    this.created_at = is(Object, typeAno.created_at) ? (new Date(typeAno.created_at._date)).toISOString() : typeAno.created_at
  }
}