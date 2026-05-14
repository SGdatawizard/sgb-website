'use client'

import { useEffect, useRef } from 'react'

export default function PriceChart({ data, currentMint, currentUsed }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !data.length) return

    async function drawChart() {
      const { Chart, registerables } = await import('chart.js')
      Chart.register(...registerables)

      const existing = Chart.getChart(canvasRef.current)
      if (existing) existing.destroy()

      const labels = [
        ...data.map(d => d.catalogue_year.toString()),
        '2026'
      ]

      const mintData = [
        ...data.map(d => parseFloat(d.value_mint) || null),
        currentMint ? parseFloat(currentMint) : null
      ]

      const usedData = [
        ...data.map(d => parseFloat(d.value_used) || null),
        currentUsed ? parseFloat(currentUsed) : null
      ]

      new Chart(canvasRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Mint',
              data: mintData,
              borderColor: '#1a5c1a',
              backgroundColor: 'rgba(26,92,26,0.07)',
              borderWidth: 1.5,
              pointRadius: 3,
              pointBackgroundColor: '#1a5c1a',
              tension: 0.35,
            },
            {
              label: 'Used',
              data: usedData,
              borderColor: '#7a3d00',
              backgroundColor: 'rgba(122,61,0,0.07)',
              borderWidth: 1.5,
              pointRadius: 3,
              pointBackgroundColor: '#7a3d00',
              tension: 0.35,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                font: { size: 11, family: 'Open Sans' },
                color: '#888',
                boxWidth: 12,
                padding: 8,
              }
            },
            tooltip: {
              callbacks: {
                label: ctx => `£${ctx.parsed.y.toLocaleString('en-GB')}`
              }
            }
          },
          scales: {
            x: {
              ticks: { font: { size: 11, family: 'Open Sans' }, color: '#aaa' },
              grid: { color: 'rgba(0,0,0,0.05)' }
            },
            y: {
              ticks: {
                font: { size: 11, family: 'Open Sans' },
                color: '#aaa',
                callback: v => `£${v.toLocaleString('en-GB')}`
              },
              grid: { color: 'rgba(0,0,0,0.05)' }
            }
          }
        }
      })
    }

    drawChart()
  }, [data, currentMint, currentUsed])

  return (
    <div style={{ width: '100%', height: '140px', position: 'relative' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
