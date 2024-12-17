
const extractData = (data, keys, values = null) => {

  let objet = new Object;      

  keys.map((key, y) => {

      let valeur = data.find((item) => item.key === key )

      let value = values ? values[y] : valeur[key] != undefined ? key : 'data'

      objet[key] = valeur[value]
  })

  return objet
};

export default extractData