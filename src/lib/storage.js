export const STORAGE_KEY = 'quicksign-records'

export function getRecords() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}

export function saveRecord(record) {
  const records = getRecords()

  records.unshift(record)

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(records)
  )
}

export function clearRecords() {
  localStorage.removeItem(STORAGE_KEY)
}