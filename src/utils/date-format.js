
const formatDate = (date, format, delimiters = '-') => {
    let d = new Date(date);
    let month = (d.getMonth() + 1).toString();
    let day = d.getDate().toString();
    let year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    let dateFormat = [];

    if(format?.year == 'year')
      dateFormat.push(year)

    if(format?.month == 'month')
      dateFormat.push(month)

    if(format?.day == 'day')
      dateFormat.push(day)

    return dateFormat.join(delimiters);
};

export default formatDate