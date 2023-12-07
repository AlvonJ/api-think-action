function getWeekNumberInMonth(date: Date): number {
  // Get the first day of the month
  let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  // Get the first day of the week that contains the given date
  let firstDayOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));

  // Calculate the number of weeks by finding the difference between the first day of the week and the first day of the month,
  // adding 1 to account for the first week, and dividing by 7
  return Math.ceil((firstDayOfWeek.getDate() - firstDayOfMonth.getDate() + 1) / 7);
}

let date = new Date('2023-12-31');
console.log('Week:', getWeekNumberInMonth(date));
