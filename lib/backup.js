export function exportBackup(data) {
  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    {
      type: 'application/json'
    }
  )

  const link = document.createElement('a')

  link.href = URL.createObjectURL(blob)

  link.download = 'quicksign-backup.json'

  link.click()
}

export function importBackup(file, callback) {
  const reader = new FileReader()

  reader.onload = () => {
    const data = JSON.parse(reader.result)

    callback(data)
  }

  reader.readAsText(file)
}