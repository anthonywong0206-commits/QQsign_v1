import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportPNG(elementId) {
  const element = document.getElementById(elementId)

  const canvas = await html2canvas(element)

  const link = document.createElement('a')

  link.download = 'quicksign-record.png'
  link.href = canvas.toDataURL()

  link.click()
}

export async function exportPDF(elementId) {
  const element = document.getElementById(elementId)

  const canvas = await html2canvas(element)

  const imgData = canvas.toDataURL('image/png')

  const pdf = new jsPDF('p', 'mm', 'a4')

  const width = 190
  const height = (canvas.height * width) / canvas.width

  pdf.addImage(imgData, 'PNG', 10, 10, width, height)

  pdf.save('quicksign.pdf')
}