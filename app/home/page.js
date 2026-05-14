'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { searchCatalogue } from '../../lib/catalogue'
import SetCard from '../../components/SetCard'
import { CatalogueStatusProvider } from '../../components/StampRow'
import GlobeComponent from '../../components/GlobeComponent'

const FILTER_FIELDS = [
  { value: 'sg_number', label: 'SG number', type: 'stamp' },
  { value: 'denomination', label: 'Denomination', type: 'stamp' },
  { value: 'colour_primary', label: 'Colour', type: 'stamp' },
  { value: 'year_issued', label: 'Year issued', type: 'stamp' },
  { value: 'watermark', label: 'Watermark', type: 'stamp' },
  { value: 'printer', label: 'Printer', type: 'stamp' },
  { value: 'perforation_gauge', label: 'Perforation', type: 'variation' },
  { value: 'is_error', label: 'Error stamp', type: 'boolean' },
  { value: 'is_proof', label: 'Specimen / Proof', type: 'boolean' },
  { value: 'is_booklet_pane', label: 'Booklet pane', type: 'boolean' },
  { value: 'price_min', label: 'Min value (£)', type: 'price' },
  { value: 'price_max', label: 'Max value (£)', type: 'price' },
]

const COUNTRIES = [
  { label: 'Great Britain', iso: 'GB', flag: '🇬🇧' },
  { label: 'Falkland Islands', iso: 'FK', flag: '🇫🇰' },
  { label: 'Australia', iso: 'AU', flag: '🇦🇺' },
  { label: 'Canada', iso: 'CA', flag: '🇨🇦' },
  { label: 'India', iso: 'IN', flag: '🇮🇳' },
  { label: 'South Africa', iso: 'ZA', flag: '🇿🇦' },
  { label: 'Nigeria', iso: 'NG', flag: '🇳🇬' },
  { label: 'Egypt', iso: 'EG', flag: '🇪🇬' },
  { label: 'Israel', iso: 'IL', flag: '🇮🇱' },
  { label: 'France', iso: 'FR', flag: '🇫🇷' },
  { label: 'Germany', iso: 'DE', flag: '🇩🇪' },
  { label: 'United States', iso: 'US', flag: '🇺🇸' },
  { label: 'New Zealand', iso: 'NZ', flag: '🇳🇿' },
  { label: 'Bermuda', iso: 'BM', flag: '🇧🇲' },
  { label: 'Hong Kong', iso: 'HK', flag: '🇭🇰' },
  { label: 'Jamaica', iso: 'JM', flag: '🇯🇲' },
]

const TEXT_OPERATORS = [
  { value: 'includes', label: 'includes' },
  { value: 'excludes', label: 'does not include' },
  { value: 'is', label: 'is' },
  { value: 'is_not', label: 'is not' },
  { value: 'is_empty', label: 'is empty' },
]

const NUMBER_OPERATORS = [
  { value: 'gte', label: 'is at least' },
  { value: 'lte', label: 'is at most' },
  { value: 'is', label: 'is exactly' },
]

const BOOLEAN_OPERATORS = [
  { value: 'is_true', label: 'is true' },
  { value: 'is_false', label: 'is false' },
]

function getOperators(field) {
  const f = FILTER_FIELDS.find(x => x.value === field)
  if (!f) return TEXT_OPERATORS
  if (f.type === 'boolean') return BOOLEAN_OPERATORS
  if (f.value === 'year_issued' || f.value === 'price_min' || f.value === 'price_max') return NUMBER_OPERATORS
  return TEXT_OPERATORS
}

function newRow() {
  return { id: Math.random().toString(36).slice(2), field: 'sg_number', operator: 'includes', value: '' }
}

function normaliseDenomination(str) {
  if (!str) return str
  return str
    .replace(/1\/2/g, '\u00bd')
    .replace(/1\/4/g, '\u00bc')
    .replace(/3\/4/g, '\u00be')
    .replace(/1\/3/g, '\u2153')
    .replace(/2\/3/g, '\u2154')
}

function CatalogueInner() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filterRows, setFilterRows] = useState([newRow()])

  const runSearch = useCallback(async function(q, c, filters) {
    setLoading(true)
    setSearched(true)
    const normalisedQuery = normaliseDenomination(q)
    const data = await searchCatalogue(normalisedQuery, c, filters)
    setResults(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    const q = searchParams.get('q')
    const c = searchParams.get('country')
    if (c) {
      setCountry(c)
      runSearch(q || '', c, {})
    } else if (q) {
      setQuery(q)
      runSearch(q, '', {})
    }
  }, [searchParams, runSearch])

  function handleGlobeSelect(iso) {
    setCountry(iso)
    setQuery('')
    runSearch('', iso, {})
  }

  function addRow() {
    setFilterRows(prev => [...prev, newRow()])
  }

  function removeRow(id) {
    setFilterRows(prev => prev.filter(r => r.id !== id))
  }

  function updateRow(id, key, value) {
    setFilterRows(prev => prev.map(r => {
      if (r.id !== id) return r
      const updated = { ...r, [key]: value }
      if (key === 'field') {
        const ops = getOperators(value)
        updated.operator = ops[0].value
        updated.value = ''
      }
      return updated
    }))
  }

  function clearFilters() {
    setFilterRows([newRow()])
  }

  const activeFilterCount = filterRows.filter(r => r.value !== '' || r.operator === 'is_true' || r.operator === 'is_false' || r.operator === 'is_empty').length

  function buildFilters() {
    const filters = {}
    filterRows.forEach(row => {
      const f = FILTER_FIELDS.find(x => x.value === row.field)
      if (!f) return
      if (f.type === 'boolean') {
        if (row.operator === 'is_true') filters[row.field] = true
        if (row.operator === 'is_false') filters[row.field] = false
        return
      }
      if (row.operator === 'is_empty') {
        filters[row.field + '_empty'] = true
        return
      }
      if (!row.value) return
      const normVal = row.field === 'denomination' ? normaliseDenomination(row.value) : row.value
      filters[row.field] = { op: row.operator, val: normVal }
    })
    return filters
  }

  async function handleSearch() {
    const filters = buildFilters()
    await runSearch(query, country, filters)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch()
  }

  const groupedBySeries = results.reduce((acc, stamp) => {
    const seriesName = stamp.stamp_series?.name || 'Uncategorised'
    if (!acc[seriesName]) {
      acc[seriesName] = { series: stamp.stamp_series, stamps: [] }
    }
    acc[seriesName].stamps.push(stamp)
    return acc
  }, {})

  const sortedSeries = Object.entries(groupedBySeries).sort((a, b) => {
    const yearA = parseInt(a[1].series?.year_start) || 9999
    const yearB = parseInt(b[1].series?.year_start) || 9999
    return yearA - yearB
  })

  const selectStyle = {
    padding: '8px 10px',
    borderRadius: '5px',
    border: '0.5px solid rgba(255,255,255,0.2)',
    background: '#344467',
    color: '#fff',
    fontFamily: 'Open Sans, sans-serif',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
  }

  const inputStyle = {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '5px',
    border: '0.5px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontFamily: 'Open Sans, sans-serif',
    fontSize: '13px',
    outline: 'none',
    minWidth: '120px',
  }

  const selectedCountry = COUNTRIES.find(c => c.iso === country)

  return (
    <div style={{ padding: '24px 48px' }}>
      <div style={{ background: '#293451', borderRadius: '10px', padding: '20px 24px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by SG number, series name, year, colour, denomination..."
            style={{ flex: 1, padding: '11px 16px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.12)', color: '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', outline: 'none' }}
          />
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            style={{ padding: '11px 14px', borderRadius: '6px', border: 'none', background: '#344467', color: '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', outline: 'none', minWidth: '200px' }}
          >
            <option value="">Select country</option>
            {COUNTRIES.map(c => (
              <option key={c.iso} value={c.iso}>{c.flag} {c.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{ padding: '11px 18px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)', background: showFilters ? 'rgba(163,146,95,0.2)' : 'transparent', color: activeFilterCount > 0 ? '#a3925f' : 'rgba(255,255,255,0.8)', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {'Filters' + (activeFilterCount > 0 ? ' (' + activeFilterCount + ')' : '')}
          </button>
          <button
            onClick={handleSearch}
            style={{ padding: '11px 24px', borderRadius: '6px', border: 'none', background: '#a3925f', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Search
          </button>
        </div>

        {showFilters && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '0.5px solid rgba(255,255,255,0.15)' }}>
            {filterRows.map((row, index) => {
              const field = FILTER_FIELDS.find(x => x.value === row.field)
              const operators = getOperators(row.field)
              const isBoolean = field?.type === 'boolean'
              const isEmptyOp = row.operator === 'is_empty'
              return (
                <div key={row.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.4)', minWidth: '36px', textAlign: 'right' }}>
                    {index === 0 ? 'Where' : 'And'}
                  </div>
                  <select value={row.field} onChange={e => updateRow(row.id, 'field', e.target.value)} style={selectStyle}>
                    {FILTER_FIELDS.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                  <select value={row.operator} onChange={e => updateRow(row.id, 'operator', e.target.value)} style={selectStyle}>
                    {operators.map(op => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>
                  {!isBoolean && !isEmptyOp && (
                    <input
                      type="text"
                      value={row.value}
                      onChange={e => updateRow(row.id, 'value', e.target.value)}
                      placeholder="Value..."
                      style={inputStyle}
                    />
                  )}
                  <button onClick={() => removeRow(row.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '18px', padding: '4px 6px', lineHeight: 1, flexShrink: 0 }}>
                    ×
                  </button>
                </div>
              )
            })}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
              <button onClick={addRow} style={{ background: 'none', border: 'none', color: '#a3925f', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: '0' }}>
                + Add filter
              </button>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', cursor: 'pointer', padding: '0', textDecoration: 'underline' }}>
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {!searched && (
        <div style={{ borderRadius: '10px', overflow: 'hidden', background: 'radial-gradient(ellipse at 60% 40%, #1a2744 0%, #0c1628 50%, #050a14 100%)', height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ textAlign: 'center', padding: '28px 24px 0', flexShrink: 0 }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#a3925f', marginBottom: '10px' }}>
              Explore the catalogue
            </div>
            <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: '0 auto', maxWidth: '500px', lineHeight: '1.8' }}>
              Use the search bar and country selector above, or drag the globe and click a pin to browse stamps by territory.
            </p>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <GlobeComponent onCountrySelect={handleGlobeSelect} />
          </div>
        </div>
      )}

      {loading && (
        <div style={{ background: '#fff', borderRadius: '10px', border: '0.5px solid #ddd', padding: '60px 40px', textAlign: 'center', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#888' }}>
          Searching...
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div style={{ background: '#fff', borderRadius: '10px', border: '0.5px solid #ddd', padding: '60px 40px', textAlign: 'center', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#888' }}>
          No stamps found. Try a different search or adjust your filters.
        </div>
      )}

      {!loading && (
        <CatalogueStatusProvider>
          {sortedSeries.map(function(item) {
            return (
              <SetCard
                key={item[0]}
                series={item[1].series}
                stamps={item[1].stamps}
              />
            )
          })}
        </CatalogueStatusProvider>
      )}
    </div>
  )
}

export default function Catalogue() {
  return (
    <Suspense fallback={
      <div style={{ padding: '24px 48px', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#888' }}>
        Loading...
      </div>
    }>
      <CatalogueInner />
    </Suspense>
  )
}