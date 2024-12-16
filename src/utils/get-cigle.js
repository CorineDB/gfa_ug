const cigle = (names) => {

  let acronym = ''

  names.split(' ').map((value) => {acronym += value[0]})
  
  return acronym.toUpperCase()
}

export default cigle