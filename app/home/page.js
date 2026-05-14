'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const FILTER_FIELDS = [
  { value: 'sg_number', label: 'SG number' },
  { value: 'denomination', label: 'Denomination' },
  { value: 'colour_primary', label: 'Colour' },
  { value: 'year_issued', label: 'Year issued' },
  { value: 'watermark', label: 'Watermark' },
  { value: 'printer', label: 'Printer' },
  { value: 'perforation_gauge', label: 'Perforation' },
  { value: 'price_min', label: 'Min value (£)' },
  { value: 'price_max', label: 'Max value (£)' },
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
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState([])
  const [filterField, setFilterField] = useState('sg_number')
  const [filterValue, setFilterValue] = useState('')
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

  function handleSearch() {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    activeFilters.forEach((f, i) => {
      params.set('filter_field_' + i, f.field)
      params.set('filter_value_' + i, f.value)
    })
    router.push('/catalogue?' + params.toString())
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch()
  }

  function addFilter() {
    if (!filterValue.trim()) return
    setActiveFilters(prev => [...prev, { field: filterField, value: filterValue.trim() }])
    setFilterValue('')
  }

  function removeFilter(i) {
    setActiveFilters(prev => prev.filter((_, idx) => idx !== i))
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
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>
            Stanley Gibbons Vision
          </div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '28px', fontWeight: '600', color: '#fff', marginBottom: '24px', textAlign: 'center' }}>
            Search the catalogue
          </div>

          {/* Main search bar */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by SG number, country, series, colour, denomination..."
              style={{ flex: 1, padding: '14px 20px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.12)', color: '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', outline: 'none' }}
            />
            <button
              onClick={handleSearch}
              style={{ padding: '14px 32px', borderRadius: '6px', border: 'none', background: '#a3925f', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Search
            </button>
          </div>

          {/* Active filter pills */}
          {activeFilters.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {activeFilters.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(163,146,95,0.2)', border: '1px solid rgba(163,146,95,0.4)', borderRadius: '20px', padding: '4px 12px', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#fff' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{FILTER_FIELDS.find(ff => ff.value === f.field)?.label}:</span>
                  <span>{f.value}</span>
                  <button onClick={() => removeFilter(i)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '14px', padding: '0 0 0 4px', lineHeight: 1 }}>×</button>
                </div>
              ))}
              <button onClick={() => setActiveFilters([])} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Clear all</button>
            </div>
          )}

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{ background: 'none', border: 'none', color: showFilters ? '#a3925f' : 'rgba(255,255,255,0.5)', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', cursor: 'pointer', padding: 0, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>{showFilters ? '▲' : '▼'}</span> {showFilters ? 'Hide filters' : 'Add filters'} {activeFilters.length > 0 && `(${activeFilters.length} active)`}
          </button>

          {/* Filter builder */}
          {showFilters && (
            <div style={{ marginTop: '16px', padding: '20px', background: 'rgba(255,255,255,0.07)', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.12)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '10px', alignItems: 'flex-end', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Filter by</div>
                  <select
                    value={filterField}
                    onChange={e => setFilterField(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '0.5px solid rgba(255,255,255,0.2)', background: '#344467', color: '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                  >
                    {FILTER_FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Value</div>
                  <input
                    type="text"
                    value={filterValue}
                    onChange={e => setFilterValue(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addFilter() }}
                    placeholder="e.g. 1d. red"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '0.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <button
                  onClick={addFilter}
                  style={{ padding: '9px 20px', borderRadius: '6px', border: 'none', background: '#a3925f', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap', alignSelf: 'flex-end' }}
                >
                  + Add
                </button>
                <button
                  onClick={handleSearch}
                  style={{ padding: '9px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap', alignSelf: 'flex-end' }}
                >
                  Search
                </button>
              </div>

              {/* Quick filter chips */}
              <div>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Quick filters</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Mint only', field: 'condition', value: 'Mint' },
                    { label: 'Under £100', field: 'price_max', value: '100' },
                    { label: '£100–£500', field: 'price_min', value: '100' },
                    { label: 'Pre-1900', field: 'year_issued', value: '1900' },
                    { label: 'Error stamps', field: 'is_error', value: 'true' },
                    { label: 'Watermarked', field: 'watermark', value: 'Crown' },
                    { label: 'Perforated 14', field: 'perforation_gauge', value: '14' },
                  ].map(chip => (
                    <button
                      key={chip.label}
                      onClick={() => setActiveFilters(prev => [...prev, { field: chip.field, value: chip.value }])}
                      style={{ padding: '5px 12px', borderRadius: '20px', border: '0.5px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
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