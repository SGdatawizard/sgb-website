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
  { id: 1, name: '1840 Penny Black, plate 1a', price: 1250, condition: 'Used', monarch: 'Queen Victoria', category: 'Penny Black', qvSub: 'Penny Black', badge: 'Featured', desc: 'A superb example of the world\'s first adhesive postage stamp, with four clear margins and light maltese cross cancellation.' },
  { id: 2, name: '1841 Penny Red, imperf', price: 320, condition: 'Mint', monarch: 'Queen Victoria', category: 'Perforated Reds and Blues', qvSub: '1841 Reds and Blues', badge: null, desc: 'Fine unmounted mint example with large margins and bright colour.' },
  { id: 3, name: '1840 2d Blue, plate 1', price: 2800, condition: 'Used', monarch: 'Queen Victoria', category: 'Penny Black', qvSub: '1840 2d Blue', badge: 'Featured', desc: 'Superb used example of the 1840 2d Blue with four good margins.' },
  { id: 4, name: '1883 10s Ultramarine', price: 850, condition: 'Used', monarch: 'Queen Victoria', category: 'Surface Printed', qvSub: 'Surface Printed', badge: 'New', desc: 'Scarce high value definitive with good colour and clean perforations.' },
  { id: 5, name: '1929 PUC £1 black', price: 420, condition: 'Mint', monarch: 'King George V', category: 'Sets', qvSub: null, badge: null, desc: 'Post Union Congress £1, lightly hinged with fresh appearance.' },
  { id: 6, name: '1935 Silver Jubilee 1d', price: 45, condition: 'Mint', monarch: 'King George V', category: 'Sets', qvSub: null, badge: null, desc: 'Unmounted mint, bright fresh colour.' },
  { id: 7, name: '1937 Coronation set', price: 38, condition: 'Mint', monarch: 'King George VI', category: 'Sets', qvSub: null, badge: null, desc: 'Complete set unmounted mint, superb fresh condition.' },
  { id: 8, name: '1948 RSW set on cover', price: 95, condition: 'Cover', monarch: 'King George VI', category: 'Sets', qvSub: null, badge: 'New', desc: 'Royal Silver Wedding set on first day cover, fine used.' },
  { id: 9, name: '1966 World Cup set', price: 28, condition: 'Mint', monarch: 'Queen Elizabeth II', category: 'Sets', qvSub: null, badge: null, desc: 'Complete set of 4, unmounted mint, very fresh.' },
  { id: 10, name: '1971 Machin 10p blue, misperf', price: 180, condition: 'Mint', monarch: 'Queen Elizabeth II', category: 'Colour Trials', qvSub: null, badge: 'Featured', desc: 'Dramatic misperforated example of the Machin definitive.' },
  { id: 11, name: '1902 KEVII 10s ultramarine', price: 620, condition: 'Used', monarch: 'King Edward VII', category: 'Surface Printed', qvSub: null, badge: null, desc: 'Fine used high value with good perforations and colour.' },
  { id: 12, name: '1936 KEVIII ½d green, booklet pane', price: 85, condition: 'Mint', monarch: 'King Edward VIII', category: 'Booklet Panes', qvSub: null, badge: null, desc: 'Unmounted mint pane of 6 from Edward VIII booklet.' },
  { id: 13, name: '1840 Mulready letter sheet', price: 340, condition: 'Used', monarch: 'Queen Victoria', category: 'Mulready', qvSub: 'Mulreadys and Caricatures', badge: null, desc: 'Used Mulready 1d letter sheet with good strike.' },
  { id: 14, name: '1882 £5 orange, Postal Fiscal', price: 1850, condition: 'Used', monarch: 'Queen Victoria', category: 'Postal Fiscals', qvSub: null, badge: 'Featured', desc: 'Superb used example of this rare high value postal fiscal.' },
  { id: 15, name: '1913 Seahorse 10s, Waterlow', price: 780, condition: 'Used', monarch: 'King George V', category: 'Sets', qvSub: null, badge: null, desc: 'Good used example of the popular Seahorse high value.' },
  { id: 16, name: '1959 Graphite-line set', price: 55, condition: 'Mint', monarch: 'Queen Elizabeth II', category: 'Sets', qvSub: null, badge: null, desc: 'Complete set of 8 in unmounted mint condition.' },
]

const monarchs = ['King Edward VII', 'King Edward VIII', 'King George V', 'King George VI', 'Queen Elizabeth II', 'Queen Victoria']
const conditions = ['Cover', 'Mint', 'Used']
const qvSubCategories = ['1841 Reds and Blues', '1840 2d Blue', 'Embossed', 'Line Engraved', 'Mulreadys and Caricatures', 'Penny Black', 'Perforated Reds and Blues', 'Perforated with Plate Numbers', 'Surface Printed']
const categories = ['Booklet Panes', 'Booklets', 'Cinderellas', 'Colour Trials', 'Embossed', 'Forgeries', 'Imprimaturs', 'Isle of Man and Channel Islands', 'Mulready', 'Officials', 'Plate Proof', 'Postage Dues', 'Postal Fiscals', 'Postal Stationery', 'Pre-stamp', 'Proofs & Die Proofs', 'Railway', 'Revenues', 'Sets', 'Specimen & Cancelled', 'Surface Printed', 'Telegraphs', 'Trials & Essays', 'Underprint', 'Used Abroad']

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

function Checkbox({ label, checked, onChange, disabled }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '4px 0', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.3 : 1 }}>
      <div style={{ width: '15px', height: '15px', borderRadius: '3px', border: `1px solid ${checked ? '#02383A' : '#ccc'}`, background: checked ? '#02383A' : '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
        {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} style={{ display: 'none' }} />
      <span style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: disabled ? '#bbb' : '#444', lineHeight: 1.4 }}>{label}</span>
    </label>
  )
}

export default function GreatBritainPage() {
  const [basketCount, setBasketCount] = useState(0)
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(62500)
  const [selectedMonarchs, setSelectedMonarchs] = useState([])
  const [selectedConditions, setSelectedConditions] = useState([])
  const [selectedQVSubs, setSelectedQVSubs] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [sortBy, setSortBy] = useState('Featured')
  const [openSections, setOpenSections] = useState({ price: true, monarch: true, condition: true, qvSub: true, category: true })

  const toggleSection = key => setOpenSections(s => ({ ...s, [key]: !s[key] }))
  const toggleItem = (list, setList, item) => setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])
  const qvSelected = selectedMonarchs.includes('Queen Victoria')

  let filtered = products.filter(p => {
    if (p.price < minPrice || p.price > maxPrice) return false
    if (selectedMonarchs.length > 0 && !selectedMonarchs.includes(p.monarch)) return false
    if (selectedConditions.length > 0 && !selectedConditions.includes(p.condition)) return false
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false
    if (qvSelected && selectedQVSubs.length > 0 && (!p.qvSub || !selectedQVSubs.includes(p.qvSub))) return false
    return true
  })

  if (sortBy === 'Price: low to high') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sortBy === 'Price: high to low') filtered = [...filtered].sort((a, b) => b.price - a.price)

  const hasFilters = selectedMonarchs.length > 0 || selectedConditions.length > 0 || selectedQVSubs.length > 0 || selectedCategories.length > 0 || minPrice > 0 || maxPrice < 62500

  const clearAll = () => { setMinPrice(0); setMaxPrice(62500); setSelectedMonarchs([]); setSelectedConditions([]); setSelectedQVSubs([]); setSelectedCategories([]) }

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
          <input placeholder="Search stamps..." style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', border: '0.5px solid #e0e0e0', borderRadius: '4px', padding: '7px 12px', width: '150px', outline: 'none' }} />
          <Link href="/account" style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', color: '#555', textDecoration: 'none' }}>My account</Link>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 600, color: '#02383A', cursor: 'pointer' }}>Basket ({basketCount})</span>
        </div>
      </nav>

      {/* Stamps sub-nav */}
      <div style={{ background: '#02383A', padding: '0 40px', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginRight: '24px', whiteSpace: 'nowrap' }}>Stamps</span>
        {subNav.map(([label, href]) => (
          <Link key={label} href={href}
            style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: label === 'Great Britain' ? 600 : 400, color: label === 'Great Britain' ? '#FFAE55' : 'rgba(255,255,255,0.7)', padding: '13px 18px', letterSpacing: '0.03em', textDecoration: 'none', borderBottom: label === 'Great Britain' ? '2px solid #FFAE55' : '2px solid transparent', display: 'block' }}
            onMouseEnter={e => { if (label !== 'Great Britain') { e.currentTarget.style.color = '#FFAE55' } }}
            onMouseLeave={e => { if (label !== 'Great Britain') { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' } }}
          >{label}</Link>
        ))}
      </div>

      {/* Breadcrumb + title */}
      <div style={{ padding: '20px 40px 0', borderBottom: '0.5px solid #ebebeb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <Link href="/stamps" style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: '#999', textDecoration: 'none' }}>Stamps</Link>
          <span style={{ color: '#ddd', fontSize: '12px' }}>›</span>
          <span style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: '#555' }}>Great Britain</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '16px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-libre)', fontSize: '26px', color: '#1a1a1a', fontWeight: 700 }}>Great Britain</div>
            <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: '#999', marginTop: '3px' }}>Victorian, Edwardian & modern British stamps</div>
          </div>
          <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: '#999' }}>{filtered.length} items</div>
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
              <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '11px', color: '#bbb' }}>The highest price is £62,500.00</div>
            </FilterSection>

            <FilterSection title="Monarch" open={openSections.monarch} onToggle={() => toggleSection('monarch')}>
              {monarchs.map(m => <Checkbox key={m} label={m} checked={selectedMonarchs.includes(m)} onChange={() => toggleItem(selectedMonarchs, setSelectedMonarchs, m)} />)}
            </FilterSection>

            <FilterSection title="Condition" open={openSections.condition} onToggle={() => toggleSection('condition')}>
              {conditions.map(c => <Checkbox key={c} label={c} checked={selectedConditions.includes(c)} onChange={() => toggleItem(selectedConditions, setSelectedConditions, c)} />)}
            </FilterSection>

            <FilterSection title="QV Sub-Category" open={openSections.qvSub} onToggle={() => toggleSection('qvSub')}>
              {qvSubCategories.map(q => <Checkbox key={q} label={q} checked={selectedQVSubs.includes(q)} onChange={() => toggleItem(selectedQVSubs, setSelectedQVSubs, q)} disabled={!qvSelected} />)}
            </FilterSection>

            <FilterSection title="Category" open={openSections.category} onToggle={() => toggleSection('category')}>
              {categories.map(c => <Checkbox key={c} label={c} checked={selectedCategories.includes(c)} onChange={() => toggleItem(selectedCategories, setSelectedCategories, c)} />)}
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {filtered.map(p => (
                <div key={p.id} style={{ background: '#fff', borderRadius: '8px', border: '0.5px solid #ebebeb', overflow: 'hidden', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#ccc'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#ebebeb'}
                >
                  <Link href={`/stamps/great-britain/${p.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{ height: '200px', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '0.5px solid #ebebeb' }}>
                      <span style={{ fontFamily: 'var(--font-libre)', fontSize: '11px', color: '#ccc', fontStyle: 'italic' }}>Image coming soon</span>
                      {p.badge && (
                        <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#02383A', color: '#FFAE55', fontSize: '9px', fontFamily: 'var(--font-montserrat)', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.05em' }}>{p.badge}</div>
                      )}
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '5px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '10px', fontFamily: 'var(--font-opensans)', color: '#888', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px' }}>{p.monarch}</span>
                        <span style={{ fontSize: '10px', fontFamily: 'var(--font-opensans)', color: '#888', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px' }}>{p.condition}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-libre)', fontSize: '14px', color: '#1a1a1a', marginBottom: '5px', lineHeight: 1.45 }}>{p.name}</div>
                      <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: '#aaa', marginBottom: '10px', lineHeight: 1.5 }}>{p.desc}</div>
                      <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '16px', fontWeight: 700, color: '#1a1a1a' }}>£{p.price.toLocaleString()}</div>
                    </div>
                  </Link>
                  <div style={{ padding: '0 16px 14px' }}>
                    <button
                      onClick={() => setBasketCount(c => c + 1)}
                      style={{ width: '100%', background: '#02383A', color: '#fff', border: 'none', padding: '10px', fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer', borderRadius: '6px', transition: 'background 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#FFAE55'; e.currentTarget.style.color = '#02383A' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#02383A'; e.currentTarget.style.color = '#fff' }}
                    >Add to basket</button>
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
