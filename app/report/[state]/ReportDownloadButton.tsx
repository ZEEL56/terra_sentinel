'use client'

import { useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

interface Props {
  stateName: string
}

export default function ReportDownloadButton({ stateName }: Props) {
  const [exporting, setExporting] = useState(false)

  async function handleDownload() {
    const element = document.getElementById('flood-report')
    if (!element || exporting) return

    setExporting(true)
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#0a0a0a',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 8
      const contentWidth = pageWidth - margin * 2
      const imgHeight = (canvas.height * contentWidth) / canvas.width
      let heightLeft = imgHeight
      let position = margin

      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight)
      heightLeft -= pageHeight - margin * 2

      while (heightLeft > 0) {
        position = margin - (imgHeight - heightLeft)
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight)
        heightLeft -= pageHeight - margin * 2
      }

      const safeName = stateName.replace(/\s+/g, '-').toLowerCase()
      pdf.save(`TerraSentinel-Flood-Report-${safeName}.pdf`)
    } catch (err) {
      console.error('PDF export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={exporting}
      className="shrink-0 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-wait transition px-5 py-3 rounded-xl font-semibold text-black shadow-lg shadow-cyan-500/20"
    >
      {exporting ? 'Generating PDF…' : 'Download Report PDF'}
    </button>
  )
}
