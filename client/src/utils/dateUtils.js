/**
 * Gets the Monday-Sunday week boundaries for a given date
 * @param {Date} date - The reference date
 * @returns {Object} Object with start (Monday) and end (Sunday) dates
 */
export const getWeekBoundaries = (date = new Date()) => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Calculate days to go back to reach Monday
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  
  // Calculate the start of the week (Monday)
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - daysFromMonday);
  
  // Calculate the end of the week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  
  return { start: startOfWeek, end: endOfWeek }
}

/**
 * Gets date string for a specific weekday in the current week
 * @param {string} weekday - Day name (Monday, Tuesday, etc.)
 * @param {Date} referenceDate - The reference date to determine current week
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
export const getDateOfWeekday = (weekday, referenceDate = new Date()) => {
  // Monday-based week array
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  // Get the start of the week (Monday)
  const { start: startOfWeek } = getWeekBoundaries(referenceDate)
  
  // Find the target day index (0-6, Monday-Sunday)
  const targetDayIndex = weekdays.indexOf(weekday);
  if (targetDayIndex === -1) return null // Invalid weekday name
  
  // Calculate the target date
  const targetDate = new Date(startOfWeek);
  targetDate.setDate(startOfWeek.getDate() + targetDayIndex);
  
  return targetDate.toISOString().split('T')[0] // Format: 'YYYY-MM-DD'
}

/**
 * Gets an array of days in the current week (Monday-Sunday)
 * @param {Date} startOfWeek - Starting date of the week (Monday)
 * @returns {Array} Array of day objects with date, weekday name, and ISO date string
 */
export const getDaysInWeek = (startOfWeek) => {
  const days = []
  const date = new Date(startOfWeek)
  
  for (let i = 0; i < 7; i++) {
    const thisDate = new Date(date)
    days.push({
      date: thisDate,
      weekday: thisDate.toLocaleDateString('en', { weekday: 'long' }),
      dateString: thisDate.toISOString().split('T')[0] // YYYY-MM-DD format for lookup
    })
    date.setDate(date.getDate() + 1)
  }
  return days
};

/**
 * Format the week display string
 * @param {Date} startDate - Start of week (Monday)
 * @param {Date} endDate - End of week (Sunday)
 * @returns {string} Formatted date range string
 */
export const formatWeekDisplay = (startDate, endDate) => {
  const startDay = startDate.getDate();
  const startMonth = startDate.toLocaleString('en', { month: 'long' })
  
  const endDay = endDate.getDate()
  const endMonth = endDate.toLocaleString('en', { month: 'long' })
  
  const startYear = startDate.getFullYear()
  const endYear = endDate.getFullYear()
  
  if (startMonth === endMonth && startYear === endYear) {
    return `${startDay}-${endDay} ${startMonth}, ${startYear}`;
  } else if (startYear === endYear) {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${startYear}`;
  } else {
    return `${startDay} ${startMonth}, ${startYear} - ${endDay} ${endMonth}, ${endYear}`;
  }
}