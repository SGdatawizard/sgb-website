'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

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

const THEMES = [
  { label: 'Animals', icon: '🦁' },
  { label: 'Birds', icon: '🦅' },
  { label: 'Flowers', icon: '🌸' },
  { label: 'Ships', icon: '⛵' },
  { label: 'Vehicles', icon: '🚂' },
  { label: 'Aircraft', icon: '✈️' },
  { label: 'Royalty', icon: '👑' },
  { label: 'Maps', icon: '🗺️' },
  { label: 'Sports', icon: '🏅' },
  { label: 'Space', icon: '🚀' },
  { label: 'Art', icon: '🎨' },
  { label: 'Architecture', icon: '🏛️' },
  { label: 'Military', icon: '🎖️' },
  { label: 'Nature', icon: '🌿' },
  { label: 'People', icon: '👤' },
  { label: 'Religion', icon: '⛪' },
]

const RECOMMENDED = [
  { sgNum: 'SG 1', desc: '1840 1d. black', country: 'Great Britain', condition: 'Fine used', catValue: '£2,500', reason: 'On your wishlist' },
  { sgNum: 'SG 128', desc: '1933 1d. black & scarlet', country: 'Falkland Islands', condition: 'Unmounted mint', catValue: '£850', reason: 'Similar to your collection' },
  { sgNum: 'SG 450', desc: '1948 Silver Wedding 10s.', country: 'Great Britain', condition: 'Mint', catValue: '£320', reason: 'Popular in your area' },
  { sgNum: 'SG 2', desc: '1840 2d. blue', country: 'Great Britain', condition: 'Used', catValue: '£1,200', reason: 'Completes your set' },
]

export default function Home() {
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeFilters, setActiveFilters] = useState([])
  const [filterField, setFilterField] = useState('sg_number')
  const [filterValue, setFilterValue] = useState('')
  const [filterRows, setFilterRows] = useState([newRow()])
  const [realisations, setRealisations] = useState([])
  const [collectionCount, setCollectionCount] = useState(41)
  const [wishlistCount, setWishlistCount] = useState(12)
  const [budgetRemaining, setBudgetRemaining] = useState(142.50)
  const [budgetTotal, setBudgetTotal] = useState(200)
  const router = useRouter()

  useEffect(() => {
    async function fetchRealisations() {
      const { data } = await supabase
        .from('sales_records')
        .select(`
          id, lot_number, sale_number, sale_price, sale_condition, sale_date, country_iso, auction_slug,
          stamp_variations ( sg_sub_number, colour_shade, stamps ( sg_number, denomination, colour_primary ) )
        `)
        .not('variation_id', 'is', null)
        .order('sale_date', { ascending: false })
        .limit(8)
      if (data) setRealisations(data)
    }
    fetchRealisations()
  }, [])

  function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function countryName(iso) {
    const map = { FK: 'Falkland Islands', GB: 'Great Britain', US: 'United States', AU: 'Australia', CA: 'Canada', NZ: 'New Zealand', BM: 'Bermuda' }
    return map[iso] || iso || '—'
  }

  function lotUrl(sale) {
    const SGB_BASE = 'https://sgbaldwins.com/auctions/'
    if (sale.auction_slug && sale.lot_number) return SGB_BASE + sale.auction_slug + '/lot/' + sale.lot_number
    return SGB_BASE + 'upcoming-auctions'
  }

  function addRow() { setFilterRows(prev => [...prev, newRow()]) }
  function removeRow(id) { setFilterRows(prev => prev.filter(r => r.id !== id)) }
  function updateRow(id, key, value) {
    setFilterRows(prev => prev.map(r => {
      if (r.id !== id) return r
      const updated = { ...r, [key]: value }
      if (key === 'field') { updated.operator = getOperators(value)[0].value; updated.value = '' }
      return updated
    }))
  }
  function clearAdvanced() { setFilterRows([newRow()]) }
  const advancedFilterCount = filterRows.filter(r => r.value !== '' || r.operator === 'is_true' || r.operator === 'is_false' || r.operator === 'is_empty').length

  function handleSearch() {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (country) params.set('country', country)
    // Pass advanced filter rows as JSON for the catalogue to parse
    const activeRows = filterRows.filter(r => r.value !== '' || r.operator === 'is_true' || r.operator === 'is_false' || r.operator === 'is_empty')
    if (activeRows.length > 0) params.set('filters', JSON.stringify(activeRows))
    router.push('/catalogue?' + params.toString())
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch()
  }

  function browseCountry(iso) {
    router.push('/catalogue?country=' + iso)
  }

  function browseTheme(theme) {
    router.push('/catalogue?q=' + encodeURIComponent(theme))
  }

  const budgetPct = Math.min(100, ((budgetTotal - budgetRemaining) / budgetTotal) * 100)

  const inputStyle = {
    fontFamily: 'Open Sans, sans-serif',
    fontSize: '13px',
    outline: 'none',
    border: '0.5px solid #ddd',
    borderRadius: '6px',
    padding: '9px 12px',
    color: '#222',
    background: '#fff',
  }

  return (
    <div style={{ background: '#f5f5f3', minHeight: '100vh' }}>

      {/* ── Search hero ─────────────────────────────────────────────── */}
      <div style={{ background: '#293451', padding: '48px 80px 40px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>
            Stanley Gibbons Vision
          </div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '28px', fontWeight: '600', color: '#fff', marginBottom: '24px', textAlign: 'center' }}>
            Search the catalogue
          </div>

          {/* Main search bar + country dropdown */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
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
              style={{ padding: '11px 18px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)', background: showFilters ? 'rgba(163,146,95,0.2)' : 'transparent', color: showFilters || advancedFilterCount > 0 ? '#a3925f' : 'rgba(255,255,255,0.8)', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              {'Filters' + (advancedFilterCount > 0 ? ' (' + advancedFilterCount + ')' : '')}
            </button>
            <button
              onClick={handleSearch}
              style={{ padding: '11px 24px', borderRadius: '6px', border: 'none', background: '#a3925f', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Search
            </button>
          </div>

          {/* Standard filters panel */}
          {showFilters && (
            <div style={{ marginTop: '4px', paddingTop: '16px', borderTop: '0.5px solid rgba(255,255,255,0.15)' }}>
              {filterRows.map((row, index) => {
                const field = FILTER_FIELDS.find(x => x.value === row.field)
                const operators = getOperators(row.field)
                const isBoolean = field?.type === 'boolean'
                const isEmptyOp = row.operator === 'is_empty'
                return (
                  <div key={row.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.4)', minWidth: '40px', textAlign: 'right' }}>
                      {index === 0 ? 'Where' : 'And'}
                    </div>
                    <select value={row.field} onChange={e => updateRow(row.id, 'field', e.target.value)} style={{ padding: '8px 10px', borderRadius: '5px', border: '0.5px solid rgba(255,255,255,0.2)', background: '#344467', color: '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                      {FILTER_FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                    <select value={row.operator} onChange={e => updateRow(row.id, 'operator', e.target.value)} style={{ padding: '8px 10px', borderRadius: '5px', border: '0.5px solid rgba(255,255,255,0.2)', background: '#344467', color: '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                      {operators.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                    </select>
                    {!isBoolean && !isEmptyOp && (
                      <input
                        type="text"
                        value={row.value}
                        onChange={e => updateRow(row.id, 'value', e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSearch() }}
                        placeholder="Value..."
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '5px', border: '0.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', outline: 'none', minWidth: '120px' }}
                      />
                    )}
                    <button onClick={() => removeRow(row.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '18px', padding: '4px 6px', lineHeight: 1, flexShrink: 0 }}>×</button>
                  </div>
                )
              })}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                <button onClick={addRow} style={{ background: 'none', border: 'none', color: '#a3925f', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: 0 }}>
                  + Add filter
                </button>
                {advancedFilterCount > 0 && (
                  <button onClick={clearAdvanced} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Browse by country / theme ───────────────────────────────── */}
      <div style={{ background: '#fff', padding: '48px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>

          {/* By country */}
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '600', color: '#293451', marginBottom: '6px' }}>Browse by country</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#888', marginBottom: '20px' }}>Jump straight to a country's full catalogue</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {COUNTRIES.map(c => (
                <button
                  key={c.iso}
                  onClick={() => browseCountry(c.iso)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '6px', border: '0.5px solid #eee', background: '#fafaf8', cursor: 'pointer', textAlign: 'left', transition: 'border 0.15s' }}
                >
                  <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0 }}>{c.flag}</span>
                  <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* By theme */}
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '600', color: '#293451', marginBottom: '6px' }}>Browse by theme</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#888', marginBottom: '20px' }}>Find stamps by subject matter</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {THEMES.map(t => (
                <button
                  key={t.label}
                  onClick={() => browseTheme(t.label)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '6px', border: '0.5px solid #eee', background: '#fafaf8', cursor: 'pointer', textAlign: 'left', transition: 'border 0.15s' }}
                >
                  <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0 }}>{t.icon}</span>
                  <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#333' }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recommended ─────────────────────────────────────────────── */}
      <div style={{ background: '#f5f5f3', padding: '48px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '600', color: '#293451', marginBottom: '4px' }}>Recommended for you</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#888' }}>Based on your wishlist, collection and browsing history</div>
          </div>
          <a href="/catalogue" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451', textDecoration: 'none', letterSpacing: '0.04em' }}>Browse all →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
          {RECOMMENDED.map(item => (
            <a key={item.sgNum} href={'/catalogue?q=' + encodeURIComponent(item.sgNum)} style={{ background: '#fff', border: '0.5px solid #ddd', borderRadius: '8px', padding: '20px', textDecoration: 'none', display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#293451' }}>{item.sgNum}</div>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px', background: '#eaecf2', color: '#293451', whiteSpace: 'nowrap' }}>{item.reason}</span>
              </div>
              <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#333', marginBottom: '4px', lineHeight: '1.4' }}>{item.desc}</div>
              <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '12px' }}>{item.country} · {item.condition}</div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '600', color: '#1a5c1a' }}>{item.catValue}</div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Feature shortcuts ────────────────────────────────────────── */}
      <div style={{ background: '#fff', padding: '48px 80px' }}>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '600', color: '#293451', marginBottom: '24px' }}>Your account</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>

          {/* My Collection */}
          <a href="/account" style={{ background: '#293451', borderRadius: '8px', padding: '24px', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#a3925f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>My Collection</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '36px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>{collectionCount}</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>items in your collection</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>View collection →</div>
          </a>

          {/* Wishlist */}
          <a href="/account" style={{ background: '#7a1a2e', borderRadius: '8px', padding: '24px', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Wishlist</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '36px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>{wishlistCount}</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>stamps on your wishlist</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>View wishlist →</div>
          </a>

          {/* Budget */}
          <a href="/account" style={{ background: '#fff', border: '0.5px solid #ddd', borderRadius: '8px', padding: '24px', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Budget tracker</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '28px', fontWeight: '600', color: '#293451', marginBottom: '4px' }}>£{budgetRemaining.toFixed(2)}</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#888', marginBottom: '12px' }}>remaining this period</div>
            <div style={{ height: '4px', background: '#eee', borderRadius: '2px', overflow: 'hidden', marginBottom: '12px' }}>
              <div style={{ height: '100%', width: budgetPct + '%', background: budgetPct > 75 ? '#c0392b' : budgetPct > 50 ? '#a3925f' : '#293451', borderRadius: '2px' }} />
            </div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#888', letterSpacing: '0.04em' }}>View budget →</div>
          </a>

        </div>

        {/* Second row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>

          {/* SGB 100 */}
          <a href="/sgb100" style={{ background: '#0a0e1a', borderRadius: '8px', padding: '24px', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#a3925f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>SGB 100</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '6px' }}>Performance index</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>The 100 best-performing stamps by catalogue value appreciation since 2005</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.04em' }}>View index →</div>
          </a>

          {/* Looking to sell */}
          <a href="/account" style={{ background: '#f5f5f3', border: '0.5px solid #ddd', borderRadius: '8px', padding: '24px', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Looking to sell</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: '600', color: '#293451', marginBottom: '6px' }}>Flagged items</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#888', marginBottom: '16px' }}>Stamps you've marked as available to sell — track value and request a valuation</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451', letterSpacing: '0.04em' }}>View flagged →</div>
          </a>

          {/* Community */}
          <a href="/community" style={{ background: '#f5f5f3', border: '0.5px solid #ddd', borderRadius: '8px', padding: '24px', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Community</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: '600', color: '#293451', marginBottom: '6px' }}>Discussions</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#888', marginBottom: '16px' }}>Share finds, ask questions and connect with collectors</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451', letterSpacing: '0.04em' }}>Go to community →</div>
          </a>

        </div>
      </div>


      {/* ── Recent realisations ─────────────────────────────────────── */}
      <div style={{ background: '#f5f5f3', padding: '48px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '600', color: '#293451', marginBottom: '4px' }}>Recent realisations</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#888' }}>Latest hammer prices from Stanley Gibbons auctions</div>
          </div>
          <a href="https://sgbaldwins.com/auctions/upcoming-auctions" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451', textDecoration: 'none', padding: '8px 16px', border: '0.5px solid #293451', borderRadius: '5px', letterSpacing: '0.04em' }}>Upcoming auctions →</a>
        </div>
        <div style={{ background: '#fff', border: '0.5px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #293451', background: '#fafaf8' }}>
                {['Country', 'SG no.', 'Description', 'Condition', 'Hammer price', 'Sale', 'Date', ''].map(h => (
                  <th key={h} style={{ padding: '10px 14px', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', color: '#293451', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {realisations.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '32px', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#aaa', textAlign: 'center' }}>Loading recent realisations...</td>
                </tr>
              ) : realisations.map(sale => {
                const variation = sale.stamp_variations
                const stamp = variation?.stamps
                const sgNum = variation?.sg_sub_number || '—'
                const desc = variation?.colour_shade || stamp?.colour_primary || '—'
                return (
                  <tr key={sale.id} style={{ borderBottom: '0.5px solid #f0f0f0' }}>
                    <td style={{ padding: '11px 14px', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888' }}>{countryName(sale.country_iso)}</td>
                    <td style={{ padding: '11px 14px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#293451' }}>{sgNum}</td>
                    <td style={{ padding: '11px 14px', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#444', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{desc}</td>
                    <td style={{ padding: '11px 14px' }}>
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px', background: sale.sale_condition?.toLowerCase().includes('mint') ? '#e8f4e8' : '#fdf0e0', color: sale.sale_condition?.toLowerCase().includes('mint') ? '#1a5c1a' : '#7a3d00', whiteSpace: 'nowrap' }}>
                        {sale.sale_condition || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '11px 14px', fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: '600', color: '#293451', whiteSpace: 'nowrap' }}>
                      {'£' + parseFloat(sale.sale_price).toLocaleString('en-GB')}
                    </td>
                    <td style={{ padding: '11px 14px', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888' }}>{sale.sale_number}</td>
                    <td style={{ padding: '11px 14px', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', whiteSpace: 'nowrap' }}>{formatDate(sale.sale_date)}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'right' }}>
                      <a href={lotUrl(sale)} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#293451', textDecoration: 'none', padding: '5px 12px', border: '0.5px solid #293451', borderRadius: '4px', whiteSpace: 'nowrap' }}>View lot</a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Recent auctions strip ────────────────────────────────────── */}
      <div style={{ background: '#293451', padding: '32px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Upcoming Stanley Gibbons auctions</div>
        <a href="https://sgbaldwins.com/auctions/upcoming-auctions" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#a3925f', textDecoration: 'none', padding: '9px 20px', border: '1px solid #a3925f', borderRadius: '5px', letterSpacing: '0.04em' }}>
          View upcoming auctions →
        </a>
      </div>

    </div>
  )
}