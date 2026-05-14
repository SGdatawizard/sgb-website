'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

function countryName(iso) {
  const map = { FK: 'Falkland Islands', GB: 'Great Britain', AU: 'Australia', CA: 'Canada', NZ: 'New Zealand' }
  return map[iso] || iso || '—'
}

function fmt(val) {
  if (!val) return '—'
  return '£' + parseFloat(val).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function cleanDescription(stamp) {
  if (stamp.denomination && stamp.colour_primary) return stamp.denomination + ' ' + stamp.colour_primary
  return stamp.colour_primary || stamp.denomination || '—'
}

export default function SGB100() {
  const [stamps, setStamps] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState('pct_change')
  const [sortDir, setSortDir] = useState('desc')

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: hist2005 } = await supabase
          .from('historic_catalogue_values')
          .select('variation_id, value_mint')
          .eq('catalogue_year', 2005)
          .not('value_mint', 'is', null)

        const { data: hist2015 } = await supabase
          .from('historic_catalogue_values')
          .select('variation_id, value_mint')
          .eq('catalogue_year', 2015)
          .not('value_mint', 'is', null)

        if (!hist2005 || hist2005.length === 0) { setLoading(false); return }

        const map2005 = {}
        hist2005.forEach(h => { map2005[h.variation_id] = parseFloat(h.value_mint) })
        const map2015 = {}
        if (hist2015) hist2015.forEach(h => { map2015[h.variation_id] = parseFloat(h.value_mint) })

        const varIds = Object.keys(map2005)

        const { data: variations } = await supabase
          .from('stamp_variations')
          .select(`
            id,
            sg_sub_number,
            sg_cat_value_mint,
            colour_shade,
            stamps (
              denomination,
              colour_primary,
              country_iso,
              stamp_series ( name )
            )
          `)
          .in('id', varIds)
          .not('sg_cat_value_mint', 'is', null)

        if (!variations) { setLoading(false); return }

        const processed = variations
          .map(sv => {
            const v2005 = map2005[sv.id]
            const v2015 = map2015[sv.id] || null
            const current = parseFloat(sv.sg_cat_value_mint)
            if (!v2005 || v2005 === 0 || current <= v2005 || current < 100) return null
            return {
              id: sv.id,
              sg_number: sv.sg_sub_number,
              current_mint: current,
              mint_2005: v2005,
              mint_2015: v2015,
              pct_change: ((current - v2005) / v2005) * 100,
              denomination: sv.stamps?.denomination,
              colour_primary: sv.colour_shade || sv.stamps?.colour_primary,
              country_iso: sv.stamps?.country_iso,
            }
          })
          .filter(Boolean)
          .sort((a, b) => b.pct_change - a.pct_change)
          .slice(0, 100)

        setStamps(processed)
      } catch (err) {
        console.error('SGB100 fetch error:', err)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const totalCurrent = stamps.reduce((s, x) => s + x.current_mint, 0)
  const total2005 = stamps.reduce((s, x) => s + x.mint_2005, 0)
  const total2015 = stamps.reduce((s, x) => s + (x.mint_2015 || x.mint_2005), 0)
  const indexPct = total2005 > 0 ? ((totalCurrent - total2005) / total2005) * 100 : 0
  const base = 1000
  const indexNow = total2005 > 0 ? base * (totalCurrent / total2005) : base
  const index2005 = base
  const index2015 = total2005 > 0 ? base * (total2015 / total2005) : base

  function handleSort(field) {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const sorted = [...stamps].sort((a, b) => {
    const av = a[sortField] || 0
    const bv = b[sortField] || 0
    return sortDir === 'desc' ? bv - av : av - bv
  })

  function SortArrow({ field }) {
    if (sortField !== field) return <span style={{ color: '#ccc', marginLeft: '4px' }}>↕</span>
    return <span style={{ color: '#a3925f', marginLeft: '4px' }}>{sortDir === 'desc' ? '↓' : '↑'}</span>
  }

  function IndexChart() {
    if (total2005 === 0) return null
    const points = [
      { year: '2005', val: index2005, label: fmt(total2005) },
      { year: '2015', val: index2015, label: fmt(total2015) },
      { year: '2026', val: indexNow, label: fmt(totalCurrent) },
    ]
    const maxVal = Math.max(...points.map(p => p.val))
    const minVal = Math.min(...points.map(p => p.val)) * 0.85
    const w = 1200, h = 225
    const pad = { top: 30, right: 60, bottom: 50, left: 70 }
    const chartW = w - pad.left - pad.right
    const chartH = h - pad.top - pad.bottom
    const x = (i) => pad.left + (i / (points.length - 1)) * chartW
    const y = (val) => pad.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH
    const pathD = points.map((p, i) => (i === 0 ? 'M' : 'L') + ' ' + x(i) + ' ' + y(p.val)).join(' ')
    const areaD = pathD + ' L ' + x(points.length - 1) + ' ' + (h - pad.bottom) + ' L ' + x(0) + ' ' + (h - pad.bottom) + ' Z'
    return (
      <svg viewBox={'0 0 ' + w + ' ' + h} style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a3925f" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#a3925f" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const yPos = pad.top + chartH * t
          const val = maxVal - (maxVal - minVal) * t
          return (
            <g key={i}>
              <line x1={pad.left} y1={yPos} x2={w - pad.right} y2={yPos} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
              <text x={pad.left - 10} y={yPos + 4} textAnchor="end" fill="rgba(255,255,255,0.35)" fontSize="12" fontFamily="Open Sans, sans-serif">{Math.round(val)}</text>
            </g>
          )
        })}
        <path d={areaD} fill="url(#chartGrad)" />
        <path d={pathD} fill="none" stroke="#a3925f" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.val)} r="7" fill="#a3925f" stroke="#293451" strokeWidth="2.5" />
            <text x={x(i)} y={h - pad.bottom + 22} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="13" fontFamily="Montserrat, sans-serif" fontWeight="600">{p.year}</text>
            <text x={x(i)} y={y(p.val) - 16} textAnchor="middle" fill="#fff" fontSize="13" fontFamily="Montserrat, sans-serif" fontWeight="600">{p.label}</text>
          </g>
        ))}
      </svg>
    )
  }

  const thStyle = {
    padding: '10px 14px',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '10px',
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    textAlign: 'left',
    borderBottom: '0.5px solid #eee',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    background: '#fafaf8',
  }

  return (
    <div style={{ background: '#f5f5f3', minHeight: '100vh' }}>

      <div style={{ background: '#293451', padding: '56px 80px 0' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Stanley Gibbons
            </div>
            <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '64px', fontWeight: '600', color: '#fff', margin: '0 0 8px', lineHeight: 1 }}>
              SGB 100
            </h1>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>
              The 100 best-performing stamps by catalogue value appreciation
            </div>
            <div style={{ display: 'flex', gap: '48px' }}>
              {[
                { label: 'Index value', value: loading ? '—' : Math.round(indexNow).toLocaleString(), color: '#fff' },
                { label: 'Since 2005', value: loading ? '—' : '+' + indexPct.toFixed(1) + '%', color: '#a3925f' },
                { label: 'Total catalogue value', value: loading ? '—' : fmt(totalCurrent), color: '#fff' },
                { label: 'Base year (2005)', value: '1,000', color: 'rgba(255,255,255,0.4)' },
              ].map(function(stat) {
                return (
                  <div key={stat.label}>
                    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{stat.label}</div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '40px', fontWeight: '600', color: stat.color }}>{stat.value}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '0', marginLeft: '-80px', marginRight: '-80px', paddingLeft: '80px', paddingRight: '80px' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Index performance
          </div>
          <div style={{ height: '225px' }}>
            {!loading && <IndexChart />}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderTop: '0.5px solid rgba(255,255,255,0.1)', paddingTop: '24px', paddingBottom: '24px', marginTop: '24px' }}>
          {[
            { label: 'Stamps tracked', value: loading ? '—' : stamps.length },
            { label: 'Best performer', value: loading || !stamps[0] ? '—' : 'SG ' + stamps[0].sg_number },
            { label: 'Top gain', value: loading || !stamps[0] ? '—' : '+' + stamps[0].pct_change.toFixed(1) + '%' },
            { label: 'Index base (2005)', value: '1,000 pts' },
          ].map(function(stat, i) {
            return (
              <div key={stat.label} style={{ paddingLeft: i > 0 ? '32px' : 0, borderLeft: i > 0 ? '0.5px solid rgba(255,255,255,0.1)' : 'none' }}>
                <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{stat.label}</div>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: '600', color: '#fff' }}>{stat.value}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ background: '#fff', padding: '48px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '40px', borderBottom: '0.5px solid #eee' }}>
        {[
          { title: 'A 170-year market', body: 'Stanley Gibbons has been pricing and trading stamps since 1856. That\'s a deeper track record than most asset classes, with a global network of collectors, dealers and auction houses behind every valuation.' },
          { title: 'Know what you own', body: 'Every stamp in the SGB 100 has a published catalogue value, a documented history, and a trusted pricing authority behind it. No guesswork, no opacity — just a clear, established market.' },
          { title: 'Held, displayed, enjoyed', body: 'Unlike digital assets or paper instruments, stamps are objects you can hold, exhibit, and pass down. Many of the world\'s great collections have been built over generations.' },
        ].map(function(card) {
          return (
            <div key={card.title}>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: '600', color: '#293451', marginBottom: '10px' }}>{card.title}</div>
              <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#666', lineHeight: '1.8' }}>{card.body}</div>
            </div>
          )
        })}
      </div>

      <div style={{ padding: '40px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: '600', color: '#293451' }}>The SGB 100</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#888', marginTop: '4px' }}>
              Ranked by catalogue value appreciation since 2005. Click column headers to sort.
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ background: '#fff', borderRadius: '8px', padding: '60px', textAlign: 'center', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#aaa' }}>
            Loading index...
          </div>
        ) : stamps.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '8px', padding: '60px', textAlign: 'center', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#aaa' }}>
            No data available
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '8px', border: '0.5px solid #eee', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: '48px', cursor: 'default' }}>#</th>
                  <th style={thStyle}>SG no.</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Country</th>
                  <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => handleSort('mint_2005')}>2005 <SortArrow field="mint_2005" /></th>
                  <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => handleSort('mint_2015')}>2015 <SortArrow field="mint_2015" /></th>
                  <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => handleSort('current_mint')}>Current <SortArrow field="current_mint" /></th>
                  <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => handleSort('pct_change')}>Since 2005 <SortArrow field="pct_change" /></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(function(stamp, i) {
                  const isHot = stamp.pct_change >= 100
                  return (
                    <tr key={stamp.id} style={{ borderBottom: '0.5px solid #f5f5f5', background: isHot ? '#fffdf8' : '#fff' }}>
                      <td style={{ padding: '12px 14px', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#bbb' }}>
                        {sortField === 'pct_change' && sortDir === 'desc' ? i + 1 : ''}
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#293451' }}>
                        {stamp.sg_number}
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#444', maxWidth: '280px' }}>
                        {cleanDescription(stamp)}
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888' }}>
                        {countryName(stamp.country_iso)}
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#888', textAlign: 'right' }}>
                        {fmt(stamp.mint_2005)}
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#888', textAlign: 'right' }}>
                        {fmt(stamp.mint_2015)}
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: '600', color: '#293451', textAlign: 'right' }}>
                        {fmt(stamp.current_mint)}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <span style={{
                          fontFamily: 'Montserrat, sans-serif',
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          background: stamp.pct_change >= 100 ? '#fff5e0' : stamp.pct_change >= 50 ? '#f0f8f0' : '#f5f5f5',
                          color: stamp.pct_change >= 100 ? '#b87520' : stamp.pct_change >= 50 ? '#1a5c1a' : '#666',
                        }}>
                          +{stamp.pct_change.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: '20px', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#aaa', textAlign: 'center' }}>
          Index values based on Stanley Gibbons catalogue prices. Past performance is not indicative of future results.
        </div>
      </div>

    </div>
  )
}
