export const addDays = (date, n) => {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export const addMonths = (date, n) => {
  const d = new Date(date)
  d.setMonth(d.getMonth() + n)
  return d
}
