'use client'
import { useState } from 'react'
import Link from 'next/link'

const LOGO = 'https://gmufbvrxogukrxtgyuag.supabase.co/storage/v1/object/public/images/logo/logo.png'

const subNav = [
  ['Great Britain', '/stamps/great-britain'],
  ['Commonwealth', '/stamps/commonwealth'],
  ['Gibbons Stamp Monthly', '/stamps/stamp-monthly'],
  ['Publications', '/stamps/publications'],
  ['Albums & Accessories', '/stamps/albums'],
]

const products = [
  { id: 1, name: 'Southern Africa Stamp Catalogue 3rd Edition', price: 39.95, format: 'Print', region: 'British Commonwealth', inStock: false, badge: 'New Edition', desc: 'Comprehensive listings for Southern African territories.' },
  { id: 2, name: 'Arabia Stamp Catalogue 2nd Edition', price: 39.95, format: 'Print', region: 'Other', inStock: true, badge: 'New Edition', desc: 'Definitive reference for stamps of the Arabian peninsula.' },
  { id: 3, name: '2026 Collect British Stamps Catalogue', price: 19.95, format: 'Print', region: 'Great Britain', inStock: true, badge: null, desc: 'The essential annual guide for Great Britain collectors.' },
  { id: 4, name: 'Brunei, Malaysia and Singapore Stamp Catalogue 6th Edition', price: 34.95, format: 'Print', region: 'British Commonwealth', inStock: true, badge: null, desc: 'Fully updated listings for these key Commonwealth territories.' },
  { id: 5, name: '2026 Stamps of the World — Set of 6 volumes', price: 199.95, format: 'Print', region: 'ROW', inStock: true, badge: 'New Edition', desc: 'The complete world stamp catalogue in six comprehensive volumes.' },
  { id: 6, name: '2026 Commonwealth & British Empire Stamps 1840–1970', price: 89.95, format: 'Print', region: 'British Commonwealth', inStock: true, badge: 'New Edition', desc: 'The indispensable reference for Commonwealth collectors worldwide.' },
  { id: 7, name: 'New Zealand and Dependencies Stamp Catalogue 8th Edition', price: 39.95, format: 'Print', region: 'British Commonwealth', inStock: true, badge: null, desc: 'Comprehensive coverage of New Zealand and its dependencies.' },
  { id: 8, name: 'Central Africa Catalogue 3rd Edition', price: 34.95, format: 'Print', region: 'British Commonwealth', inStock: false, badge: null, desc: 'Listings for stamps of Central African territories.' },
  { id: 9, name: 'Collect Channel Islands & Isle of Man Stamps', price: 16.95, format: 'Print', region: 'Great Britain', inStock: true, badge: null, desc: 'Complete listings for Channel Islands and Isle of Man issues.' },
  { id: 10, name: 'Stamps of the World Digital Edition — Annual', price: 49.95, format: 'Digital', region: 'ROW', inStock: true, badge: 'New Edition', desc: 'Full digital access to the world\'s most comprehensive stamp catalogue.' },
  { id: 11, name: 'Great Britain Concise Stamp Catalogue 2026', price: 24.95, format: 'Print', region: 'Great Britain', inStock: true, badge: 'New Edition', desc: 'The concise annual catalogue for Great Britain collectors.' },
  { id: 12, name: 'Collect British Stamps — Digital Edition', price: 12.95, format: 'Digital', region: 'Great Britain', inStock: true, badge: null, desc: 'Digital version of the essential British stamp reference.' },
  { id: 13, name: 'West Africa Stamp Catalogue 2nd Edition', price: 34.95, format: 'Print', region: 'British Commonwealth', inStock: true, badge: null, desc: 'Comprehensive listings for West African Commonwealth territories.' },
  { id: 14, name: 'India & Indian States Catalogue 3rd Edition', price: 79.95, format: 'Print', region: 'British Commonwealth', inStock: false, badge: null, desc: 'The definitive reference for Indian philately including all states.' },
  { id: 15, name: 'Philatelic Terms Illustrated', price: 19.95, format: 'Print', region: 'Other', inStock: true, badge: null, desc: 'Essential illustrated guide to philatelic terminology for all collectors.' },
  { id: 16, name: 'Stanley Gibbons Catalogue Supplement 2026', price: 9.95, format: 'Print', region: 'ROW', inStock: true, badge: 'New Edition', desc: 'Annual supplement with new issues and price updates.' },
]

const formats = ['Digital', 'Print']
const regions = ['British Commonwealth', 'Great Britain', 'Other', 'ROW']

function FilterSection({ title, open, onToggle, children }) {
  return (
    <div style={{ borderBottom: '0.5px solid #ebebeb' }}>
      <button onClick={onToggle} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-opensans)', fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>
        {title}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
          <path d="M1 3.5L5 7L9 3.5" stroke="#999" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && <div style={{ paddingBottom: '14px' }}>{children}</div>}
    </div>
  )
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '4px 0', cursor: 'pointer' }}>
      <div style={{ width: '15px', height: '15px', borderRadius: '3px', border: `1px solid ${checked ? '#02383A' : '#ccc'}`, background: checked ? '#02383A' : '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
        {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
      <span style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: '#444', lineHeight: 1.4 }}>{label}</span>
    </label>
  )
}

export default function PublicationsPage() {
  const [basketCount, setBasketCount] = useState(0)
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(299)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [outOfStockOnly, setOutOfStockOnly] = useState(false)
  const [selectedFormats, setSelectedFormats] = useState([])
  const [selectedRegions, setSelectedRegions] = useState([])
  const [sortBy, setSortBy] = useState('Featured')
  const [openSections, setOpenSections] = useState({ availability: true, price: true, format: true, region: true })

  const toggleSection = key => setOpenSections(s => ({ ...s, [key]: !s[key] }))
  const toggleItem = (list, setList, item) => setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])

  let filtered = products.filter(p => {
    if (p.price < minPrice || p.price > maxPrice) return false
    if (inStockOnly && !p.inStock) return false
    if (outOfStockOnly && p.inStock) return false
    if (selectedFormats.length > 0 && !selectedFormats.includes(p.format)) return false
    if (selectedRegions.length > 0 && !selectedRegions.includes(p.region)) return false
    return true
  })

  if (sortBy === 'Price: low to high') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sortBy === 'Price: high to low') filtered = [...filtered].sort((a, b) => b.price - a.price)

  const hasFilters = inStockOnly || outOfStockOnly || selectedFormats.length > 0 || selectedRegions.length > 0 || minPrice > 0 || maxPrice < 299

  const clearAll = () => {
    setMinPrice(0); setMaxPrice(299)
    setInStockOnly(false); setOutOfStockOnly(false)
    setSelectedFormats([]); setSelectedRegions([])
  }

  return (
    <div style={{ fontFamily: 'var(--font-opensans)', background: '#fff', minHeight: '100vh' }}>

      {/* Main nav */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #e8e8e8', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px', position: 'relative' }}>
        <Link href="/"><img src={LOGO} alt="Stanley Gibbons Baldwin's" style={{ height: '56px', width: 'auto' }} /></Link>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px' }}>
          {[['Stamps', '/stamps'], ['Coins', '/coins'], ['Bullion', '/bullion'], ['Auctions', '/auctions'], ['About', '/about']].map(([label, href]) => (
            <Link key={label} href={href}
              style={{ fontFamily: 'var(--font-montserrat)', fontSize: '13px', fontWeight: label === 'Stamps' ? 700 : 500, color: label === 'Stamps' ? '#02383A' : '#333', padding: '6px 14px', letterSpacing: '0.05em', textDecoration: 'none', borderBottom: label === 'Stamps' ? '2px solid #FFAE55' : '2px solid transparent' }}
              onMouseEnter={e => { if (label !== 'Stamps') e.currentTarget.style.textDecoration = 'underline' }}
              onMouseLeave={e => { if (label !== 'Stamps') e.currentTarget.style.textDecoration = 'none' }}
            >{label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <input placeholder="Search publications..." style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', border: '0.5px solid #e0e0e0', borderRadius: '4px', padding: '7px 12px', width: '150px', outline: 'none' }} />
          <Link href="/account" style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', color: '#555', textDecoration: 'none' }}>My account</Link>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 600, color: '#02383A', cursor: 'pointer' }}>Basket ({basketCount})</span>
        </div>
      </nav>

      {/* Stamps sub-nav */}
      <div style={{ background: '#02383A', padding: '0 40px', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginRight: '24px', whiteSpace: 'nowrap' }}>Stamps</span>
        {subNav.map(([label, href]) => (
          <Link key={label} href={href}
            style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: label === 'Publications' ? 600 : 400, color: label === 'Publications' ? '#FFAE55' : 'rgba(255,255,255,0.7)', padding: '13px 18px', letterSpacing: '0.03em', textDecoration: 'none', borderBottom: label === 'Publications' ? '2px solid #FFAE55' : '2px solid transparent', display: 'block' }}
            onMouseEnter={e => { if (label !== 'Publications') { e.currentTarget.style.color = '#FFAE55' } }}
            onMouseLeave={e => { if (label !== 'Publications') { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' } }}
          >{label}</Link>
        ))}
      </div>

      {/* Breadcrumb + title + gift voucher */}
      <div style={{ padding: '20px 40px', borderBottom: '0.5px solid #ebebeb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
          <Link href="/stamps" style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: '#999', textDecoration: 'none' }}>Stamps</Link>
          <span style={{ color: '#ddd', fontSize: '12px' }}>›</span>
          <span style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: '#555' }}>Publications</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '40px', paddingBottom: '4px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-libre)', fontSize: '26px', color: '#1a1a1a', fontWeight: 700 }}>Publications</div>
            <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: '#999', marginTop: '3px' }}>Catalogues, handbooks & reference works from Stanley Gibbons</div>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '0.5px solid #ebebeb', borderRight: '0.5px solid #ebebeb', padding: '0 40px' }}>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 700, color: '#02383A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '5px' }}>Gift Vouchers</div>
            <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: '#999', lineHeight: 1.7, maxWidth: '420px' }}>
              To redeem or purchase a voucher, please contact us on{' '}
              <a href="tel:+441425472363" style={{ color: '#02383A', fontWeight: 600, textDecoration: 'none' }}>+44 1425 472363</a>
              {' '}or email{' '}
              <a href="mailto:shop@sgbaldwins.com" style={{ color: '#02383A', fontWeight: 600, textDecoration: 'none' }}>shop@sgbaldwins.com</a>
              {' '}and we will be more than happy to assist you.
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: '#999' }}>{filtered.length} items</div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'flex', padding: '0 40px', gap: '48px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Sidebar */}
        <div style={{ width: '220px', flexShrink: 0, padding: '24px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontFamily: 'var(--font-opensans)', fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>Filters</span>
            {hasFilters && (
              <button onClick={clearAll} style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: '#999', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Clear all</button>
            )}
          </div>

          <div style={{ marginTop: '8px' }}>

            <FilterSection title="Availability" open={openSections.availability} onToggle={() => toggleSection('availability')}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '4px 0', cursor: 'pointer' }}>
                <div style={{ width: '15px', height: '15px', borderRadius: '3px', border: `1px solid ${inStockOnly ? '#02383A' : '#ccc'}`, background: inStockOnly ? '#02383A' : '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => setInStockOnly(v => !v)}>
                  {inStockOnly && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: '#444' }}>In stock</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '4px 0', cursor: 'pointer' }}>
                <div style={{ width: '15px', height: '15px', borderRadius: '3px', border: `1px solid ${outOfStockOnly ? '#02383A' : '#ccc'}`, background: outOfStockOnly ? '#02383A' : '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => setOutOfStockOnly(v => !v)}>
                  {outOfStockOnly && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: '#444' }}>Out of stock</span>
              </label>
            </FilterSection>

            <FilterSection title="Price" open={openSections.price} onToggle={() => toggleSection('price')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '0.5px solid #ddd', borderRadius: '6px', overflow: 'hidden', flex: 1 }}>
                  <span style={{ padding: '6px 8px', fontFamily: 'var(--font-opensans)', fontSize: '13px', color: '#aaa', background: '#fafafa', borderRight: '0.5px solid #ddd' }}>£</span>
                  <input type="number" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} style={{ width: '100%', padding: '6px 8px', border: 'none', fontFamily: 'var(--font-opensans)', fontSize: '13px', outline: 'none', background: '#fff' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: '#aaa' }}>to</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '0.5px solid #ddd', borderRadius: '6px', overflow: 'hidden', flex: 1 }}>
                  <span style={{ padding: '6px 8px', fontFamily: 'var(--font-opensans)', fontSize: '13px', color: '#aaa', background: '#fafafa', borderRight: '0.5px solid #ddd' }}>£</span>
                  <input type="number" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '100%', padding: '6px 8px', border: 'none', fontFamily: 'var(--font-opensans)', fontSize: '13px', outline: 'none', background: '#fff' }} />
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '11px', color: '#bbb' }}>The highest price is £299.00</div>
            </FilterSection>

            <FilterSection title="Format" open={openSections.format} onToggle={() => toggleSection('format')}>
              {formats.map(f => <Checkbox key={f} label={f} checked={selectedFormats.includes(f)} onChange={() => toggleItem(selectedFormats, setSelectedFormats, f)} />)}
            </FilterSection>

            <FilterSection title="Region" open={openSections.region} onToggle={() => toggleSection('region')}>
              {regions.map(r => <Checkbox key={r} label={r} checked={selectedRegions.includes(r)} onChange={() => toggleItem(selectedRegions, setSelectedRegions, r)} />)}
            </FilterSection>

          </div>
        </div>

        {/* Product grid */}
        <div style={{ flex: 1, padding: '24px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', border: '0.5px solid #e0e0e0', borderRadius: '6px', padding: '7px 12px', color: '#555', background: '#fff', cursor: 'pointer', outline: 'none' }}>
              <option>Featured</option>
              <option>Price: low to high</option>
              <option>Price: high to low</option>
              <option>Newest</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontFamily: 'var(--font-libre)', fontSize: '18px', color: '#bbb', fontStyle: 'italic', marginBottom: '12px' }}>No items match your filters</div>
              <button onClick={clearAll} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', color: '#02383A', background: 'none', border: '0.5px solid #02383A', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer' }}>Clear all filters</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              {filtered.map(p => (
                <div key={p.id} style={{ background: '#fff', borderRadius: '8px', border: '0.5px solid #ebebeb', overflow: 'hidden', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#ccc'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#ebebeb'}
                >
                  <Link href={`/stamps/publications/${p.id}`} style={{ textDecoration: 'none', display: 'block' }}>

                    {/* Book cover image area */}
                    <div style={{ height: '240px', background: '#1a2744', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '8px' }}>Stanley Gibbons</div>
                        <div style={{ fontFamily: 'var(--font-libre)', fontSize: '11px', color: '#fff', lineHeight: 1.4, fontWeight: 700 }}>{p.name}</div>
                      </div>
                      {p.badge && (
                        <div style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', background: '#fff', color: '#1a1a1a', fontSize: '9px', fontFamily: 'var(--font-montserrat)', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{p.badge.toUpperCase()}</div>
                      )}
                    </div>

                    <div style={{ padding: '14px 14px 8px' }}>
                      <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', fontFamily: 'var(--font-opensans)', color: '#888', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px' }}>{p.format}</span>
                        <span style={{ fontSize: '10px', fontFamily: 'var(--font-opensans)', color: '#888', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px' }}>{p.region}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-libre)', fontSize: '13px', color: '#1a1a1a', marginBottom: '8px', lineHeight: 1.45 }}>{p.name}</div>
                      <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '15px', fontWeight: 700, color: '#1a1a1a', marginBottom: p.inStock ? '0' : '4px' }}>£{p.price.toFixed(2)}</div>
                      {!p.inStock && (
                        <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', fontWeight: 700, color: '#cc3333', letterSpacing: '0.04em' }}>Out of stock — ships within 28 days</div>
                      )}
                    </div>
                  </Link>
                  <div style={{ padding: '0 14px 14px' }}>
                    <button
                      onClick={() => setBasketCount(c => c + 1)}
                      style={{ width: '100%', background: p.inStock ? '#02383A' : '#888', color: '#fff', border: 'none', padding: '9px', fontFamily: 'var(--font-montserrat)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer', borderRadius: '6px', transition: 'background 0.2s' }}
                      onMouseEnter={e => { if (p.inStock) { e.currentTarget.style.background = '#FFAE55'; e.currentTarget.style.color = '#02383A' } }}
                      onMouseLeave={e => { if (p.inStock) { e.currentTarget.style.background = '#02383A'; e.currentTarget.style.color = '#fff' } }}
                    >{p.inStock ? 'Add to basket' : 'Pre-order'}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#1a1a1a', padding: '28px 40px', marginTop: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src={LOGO} alt="Stanley Gibbons Baldwin's" style={{ height: '40px', opacity: 0.8 }} />
          <span style={{ fontFamily: 'var(--font-opensans)', fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>© 2025 Stanley Gibbons Baldwin's Ltd.</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[['Coins', '/coins'], ['Bullion', '/bullion'], ['Auctions', '/auctions']].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
