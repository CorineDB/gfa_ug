

const pluck = (data, keys) => {

  let extractData = []

  data.map(item => {

    let objet = {}
    
    keys.map((value) => objet[value] = item[value])

    extractData.push(objet)

  })

  return extractData
};

export default pluck