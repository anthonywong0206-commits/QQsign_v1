export function exportCSV(records) {
  const headers = [
    '編號',
    '姓名',
    '時間'
  ]

  const rows = records.map((record) => [
    record.number,
    record.name,
    record.time
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;'
  })

  const link = document.createElement('a')

  link.href = URL.createObjectURL(blob)

  link.download = 'quicksign-records.csv'

  link.click()
}