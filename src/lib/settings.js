const SETTINGS_KEY = 'quicksign-settings'

export function getSettings() {
  return JSON.parse(
    localStorage.getItem(SETTINGS_KEY) ||
      JSON.stringify({
        organization: 'QuickSign',
        password: '123456',
        darkMode: false
      })
  )
}

export function saveSettings(settings) {
  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify(settings)
  )
}