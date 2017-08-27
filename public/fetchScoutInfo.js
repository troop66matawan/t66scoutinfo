var scouts = [];

function fireDatetoString(dateObj) {
  var month = dateObj.month + 1;
  var day = dateObj.date;
  var year = 1900 + dateObj.year;

  return month + '/' + day + '/' + year;
}
