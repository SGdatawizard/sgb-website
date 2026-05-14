'use client'

import { useState } from 'react'
import StampRow from './StampRow'
import { getSeriesImageUrls } from '../lib/catalogue'

const COUNTRY_MAP = {
  FK: 'Falkland Islands',
  BM: 'Bermuda',
  GB: 'Great Britain',
  AU: 'Australia',
  CA: 'Canada',
  NZ: 'New Zealand',
}

export default function SetCard({ series, stamps }) {
  const [imgErrors, setImgErrors] = useState({})
  const [hoveredImg, setHoveredImg] = useState(null)

  const regularStamps = stamps.filter(s => !s.sg_number.includes('/'))
  const setStamps = stamps.filter(s => s.sg_number.includes('/'))

  const baseStamps = regularStamps.filter(s => !/[a-z]+$/.test(s.sg_number))
  const letteredVariations = regularStamps.filter(s => /[a-z]+$/.test(s.sg_number))

  const enrichedBase = baseStamps.map(stamp => {
    const parentNum = parseInt(stamp.sg_number)
    const extras = letteredVariations.filter(v => parseInt(v.sg_number) === parentNum)
    if (extras.length === 0) return stamp
    const cloned = { ...stamp, stamp_variations: [...(stamp.stamp_variations || [])] }
    extras.forEach(v => {
      const variation = v.stamp_variations?.[0]
      if (variation && !cloned.stamp_variations.find(sv => sv.sg_sub_number === variation.sg_sub_number)) {
        cloned.stamp_variations.push(variation)
      }
    })
    return cloned
  })

  const orphanedVariations = letteredVariations.filter(v => {
    const parentNum = parseInt(v.sg_number)
    return !baseStamps.find(s => parseInt(s.sg_number) === parentNum)
  })

  const sortedStamps = [...enrichedBase, ...orphanedVariations].sort((a, b) => {
    const numA = parseInt(a.sg_number) || 0
    const numB = parseInt(b.sg_number) || 0
    return numA - numB
  })

  const imageUrls = series?.image_folder ? getSeriesImageUrls(series.image_folder) : []
  const countryName = COUNTRY_MAP[series?.country_iso] || series?.country_iso || null

  function scrollToStamp(typeNumber) {
    const el = document.getElementById('stamp-type-' + typeNumber)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div style={{ background: '#fff', border: '0.5px solid #ddd', borderRadius: '8px', overflow: 'visible', marginBottom: '16px' }}>
      <div style={{ background: '#293451', padding: '20px 24px', borderRadius: '8px 8px 0 0', overflow: 'visible' }}>
        <div style={{ textAlign: 'center', marginBottom: imageUrls.length > 0 ? '16px' : '0' }}>
          {countryName && (
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', color: '#293451', background: '#a3925f', padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {countryName}
              </span>
            </div>
          )}
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
            {series?.name || 'Uncategorised'}
          </div>
          <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>
            {series?.year_start && 'Issued ' + series.year_start}
            {series?.sg_section_ref && ' · ' + series.sg_section_ref}
            {series?.notes && ' · ' + series.notes}
          </div>
        </div>

        {imageUrls.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {imageUrls.map((url, i) => (
              !imgErrors[i] && (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', position: 'relative' }}
                  onMouseEnter={() => setHoveredImg(i)}
                  onMouseLeave={() => setHoveredImg(null)}
                  onTouchStart={() => setHoveredImg(hoveredImg === i ? null : i)}
                >
                  <div style={{ width: '64px', height: '76px', background: 'rgba(255,255,255,0.08)', border: hoveredImg === i ? '1.5px solid #a3925f' : '0.5px solid rgba(255,255,255,0.2)', borderRadius: '3px', overflow: 'hidden', flexShrink: 0, cursor: 'pointer', transition: 'border 0.15s' }}>
                    <img src={url} alt={'Type ' + (i + 15)} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={() => setImgErrors(prev => ({ ...prev, [i]: true }))} />
                  </div>
                  <div onClick={() => scrollToStamp(i + 15)} style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '10px', color: hoveredImg === i ? '#a3925f' : 'rgba(255,255,255,0.5)', transition: 'color 0.15s', cursor: 'pointer', textDecoration: hoveredImg === i ? 'underline' : 'none' }}>
                    T{i + 15}
                  </div>
                  {hoveredImg === i && (
                    <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '6px', width: '200px', height: '240px', background: '#fff', border: '1.5px solid #a3925f', borderRadius: '6px', overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                      <img src={url} alt={'Type ' + (i + 15) + ' expanded'} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '72px 60px 1fr 110px 110px 28px 28px 28px', padding: '8px 20px', background: '#f0f2f6', borderBottom: '0.5px solid #ddd' }}>
        {[
          { label: 'SG no.', right: false },
          { label: 'Denom.', right: false },
          { label: 'Description', right: false },
          { label: 'Mint (£)', right: true },
          { label: 'Used (£)', right: true },
          { label: '', right: false },
          { label: '', right: false },
          { label: '', right: false },
        ].map((h, i) => (
          <div key={i} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', color: '#293451', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: h.right ? 'right' : 'left' }}>
            {h.label}
          </div>
        ))}
      </div>

      {sortedStamps.map(stamp => (
        <StampRow key={stamp.id} stamp={stamp} />
      ))}

      {setStamps.map(stamp => (
        <StampRow key={stamp.id} stamp={stamp} />
      ))}
    </div>
  )
}
