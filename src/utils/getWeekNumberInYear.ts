function getWeekNumberInYear(date: Date): number {
  // Copy date so don't modify original
  date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(((date.valueOf() - yearStart.valueOf()) / 86400000 + 1) / 7);
  // Return week number
  return weekNo;
}

let result = getWeekNumberInYear(new Date('2023-12-31'));
console.log(result);
