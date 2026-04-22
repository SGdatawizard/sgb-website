'use client'
import { useState } from 'react'
import Link from 'next/link'

const LOGO = 'https://gmufbvrxogukrxtgyuag.supabase.co/storage/v1/object/public/images/logo/logo.png'
const BASE = 'https://gmufbvrxogukrxtgyuag.supabase.co/storage/v1/object/public/images/carousel/'

const subNav = [
  ['Great Britain', '/stamps/great-britain'],
  ['Commonwealth', '/stamps/commonwealth'],
  ['Gibbons Stamp Monthly', '/stamps/stamp-monthly'],
  ['Publications', '/stamps/publications'],
  ['Albums & Accessories', '/stamps/albums'],
]

const featuredGB = [
  { id: 1, name: '1840 Penny Black, plate 1a', price: 1250, condition: 'Used', badge: 'Featured', desc: 'A superb example of the world\'s first adhesive postage stamp, with four clear margins.' },
  { id: 2, name: '1841 Penny Red, imperf', price: 320, condition: 'Mint', badge: null, desc: 'Fine unmounted mint example with large margins and bright colour.' },
  { id: 3, name: '1883 10s Ultramarine', price: 850, condition: 'Used', badge: 'New', desc: 'Scarce high value definitive with good colour and clean perforations.' },
  { id: 4, name: '1929 PUC £1 black', price: 420, condition: 'Mint', badge: null, desc: 'Post Union Congress £1, lightly hinged with fresh appearance.' },
]

const featuredCommonwealth = [
  { id: 5, name: '1935 Silver Jubilee omnibus set', price: 85, condition: 'Mint', badge: 'Featured', desc: 'Complete omnibus set from all participating Commonwealth territories.' },
  { id: 6, name: 'Canada 1851 12d black', price: 2400, condition: 'Used', badge: null, desc: 'One of the great classics of Canadian philately, cut square with good margins.' },
  { id: 7, name: 'Australia 1913 Roo 5s', price: 180, condition: 'Used', badge: 'New', desc: 'First Kangaroo & Map issue, good used with strong colour.' },
  { id: 8, name: 'India 1854 4a blue & red', price: 95, condition: 'Used', badge: null, desc: 'Die I, cut square, good colour with four margins.' },
]

const featuredPublications = [
  { id: 9, name: 'Stanley Gibbons Catalogue 2024 — Great Britain', price: 38, condition: null, badge: 'New', desc: 'The essential reference for every Great Britain collector. Fully updated for 2024.' },
  { id: 10, name: 'Commonwealth & Empire Catalogue', price: 65, condition: null, badge: null, desc: 'Comprehensive listings for all Commonwealth issues from 1840 to present day.' },
  { id: 11, name: 'Gibbons Stamp Monthly — 12 issue subscription', price: 65, condition: null, badge: 'Featured', desc: 'Annual subscription to the world\'s leading stamp collecting magazine.' },
  { id: 12, name: 'Stamps of the World — 5 volume set', price: 185, condition: null, badge: null, desc: 'The definitive world catalogue, covering over 500,000 stamps across five volumes.' },
]

function NavBar({ basketCount }) {
  return (
    <>
      {/* Main nav */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #ddd', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px', position: 'relative' }}>
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
          <input placeholder="Search stamps..." style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', border: '0.5px solid #ddd', borderRadius: '3px', padding: '6px 10px', width: '140px' }} />
          <Link href="/account" style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 500, color: '#333' }}>My account</Link>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 600, color: '#02383A', cursor: 'pointer' }}>Basket ({basketCount})</span>
        </div>
      </nav>

      {/* Stamps sub-nav */}
      <div style={{ background: '#02383A', padding: '0 40px', display: 'flex', gap: '0', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginRight: '24px', whiteSpace: 'nowrap' }}>Stamps</span>
        {subNav.map(([label, href]) => (
          <Link key={label} href={href}
            style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', padding: '13px 18px', letterSpacing: '0.04em', textDecoration: 'none', borderBottom: '2px solid transparent', display: 'block' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#FFAE55'; e.currentTarget.style.borderBottom = '2px solid #FFAE55' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.borderBottom = '2px solid transparent' }}
          >{label}</Link>
        ))}
      </div>
    </>
  )
}

function ProductCard({ product, section, onAdd }) {
  return (
    <div style={{ background: '#fff', borderRadius: '5px', border: '0.5px solid #e0ddd6', overflow: 'hidden' }}>
      <Link href={`/stamps/${section}/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ height: '180px', background: '#e8e3da', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer' }}>
          <span style={{ fontFamily: 'var(--font-libre)', fontSize: '11px', color: '#aaa', fontStyle: 'italic' }}>Image coming soon</span>
          {product.badge && (
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#02383A', color: '#FFAE55', fontSize: '9px', fontFamily: 'var(--font-montserrat)', fontWeight: 700, padding: '3px 8px', borderRadius: '2px', letterSpacing: '0.06em' }}>{product.badge}</div>
          )}
        </div>
        <div style={{ padding: '12px 14px' }}>
          {product.condition && (
            <div style={{ fontSize: '9px', fontFamily: 'var(--font-montserrat)', color: '#FFAE55', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>{product.condition}</div>
          )}
          <div style={{ fontFamily: 'var(--font-libre)', fontSize: '13px', color: '#1a1a1a', marginBottom: '6px', lineHeight: 1.4 }}>{product.name}</div>
          <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '11px', color: '#888', marginBottom: '8px', lineHeight: 1.5 }}>{product.desc}</div>
          <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '15px', fontWeight: 700, color: '#02383A' }}>£{product.price.toLocaleString()}</div>
        </div>
      </Link>
      <button onClick={onAdd} style={{ display: 'block', width: '100%', background: '#02383A', color: '#fff', border: 'none', padding: '10px', fontFamily: 'var(--font-montserrat)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer' }}
        onMouseEnter={e => e.currentTarget.style.background = '#FFAE55'}
        onMouseLeave={e => e.currentTarget.style.background = '#02383A'}
        onMouseEnterCapture={e => e.currentTarget.style.color = '#02383A'}
      >Add to basket</button>
    </div>
  )
}

function SectionHeader({ title, linkLabel, href }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-libre)', fontSize: '22px', color: '#02383A', fontWeight: 700 }}>{title}</div>
        <div style={{ width: '48px', height: '2px', background: '#FFAE55', marginTop: '6px' }} />
      </div>
      <Link href={href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', color: '#FFAE55', fontWeight: 600, letterSpacing: '0.04em', textDecoration: 'none' }}>{linkLabel} ›</Link>
    </div>
  )
}

export default function StampsPage() {
  const [basketCount, setBasketCount] = useState(0)
  const addToBasket = () => setBasketCount(c => c + 1)

  return (
    <div style={{ fontFamily: 'var(--font-opensans)', background: '#f5f2ec', minHeight: '100vh' }}>
      <NavBar basketCount={basketCount} />

      {/* Hero — stamp photo background */}
      <div style={{ position: 'relative', height: '340px', overflow: 'hidden' }}>
        <img src={`${BASE}web4.png`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(2,56,58,0.88) 0%, rgba(2,56,58,0.5) 50%, rgba(2,56,58,0.15) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 72px', maxWidth: '600px' }}>
          <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', letterSpacing: '0.18em', color: '#FFAE55', textTransform: 'uppercase', marginBottom: '12px' }}>Stanley Gibbons — Est. 1856</div>
          <div style={{ fontFamily: 'var(--font-libre)', fontSize: '38px', color: '#fff', fontWeight: 700, lineHeight: 1.15, marginBottom: '14px' }}>The world's finest philatelic collection</div>
          <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '24px' }}>From Victorian Penny Blacks to modern limited editions — rare stamps, catalogues and accessories for collectors at every level.</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/stamps/great-britain" style={{ display: 'inline-block', background: '#FFAE55', color: '#02383A', padding: '12px 26px', fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', borderRadius: '3px' }}>Shop Great Britain →</Link>
            <Link href="/stamps/commonwealth" style={{ display: 'inline-block', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', padding: '12px 26px', fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em', borderRadius: '3px' }}>Shop Commonwealth</Link>
          </div>
        </div>
      </div>

      {/* Featured Great Britain */}
      <div style={{ padding: '52px 40px', background: '#fff' }}>
        <SectionHeader title="Featured — Great Britain" linkLabel="View all Great Britain stamps" href="/stamps/great-britain" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {featuredGB.map(p => <ProductCard key={p.id} product={p} section="great-britain" onAdd={addToBasket} />)}
        </div>
      </div>

      {/* Divider banner */}
      <div style={{ background: '#02383A', padding: '28px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', letterSpacing: '0.14em', color: '#FFAE55', textTransform: 'uppercase', marginBottom: '6px' }}>Gibbons Stamp Monthly</div>
          <div style={{ fontFamily: 'var(--font-libre)', fontSize: '20px', color: '#fff', fontWeight: 700 }}>The world's leading stamp magazine</div>
          <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Subscribe today and never miss an issue</div>
        </div>
        <Link href="/stamps/stamp-monthly" style={{ background: '#FFAE55', color: '#02383A', padding: '11px 24px', fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 700, borderRadius: '3px', whiteSpace: 'nowrap', textDecoration: 'none' }}>Subscribe now →</Link>
      </div>

      {/* Featured Commonwealth */}
      <div style={{ padding: '52px 40px', background: '#f5f2ec' }}>
        <SectionHeader title="Featured — Commonwealth" linkLabel="View all Commonwealth stamps" href="/stamps/commonwealth" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {featuredCommonwealth.map(p => <ProductCard key={p.id} product={p} section="commonwealth" onAdd={addToBasket} />)}
        </div>
      </div>

      {/* Featured Publications */}
      <div style={{ padding: '52px 40px', background: '#fff' }}>
        <SectionHeader title="Featured — Publications & Catalogues" linkLabel="View all publications" href="/stamps/publications" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {featuredPublications.map(p => <ProductCard key={p.id} product={p} section="publications" onAdd={addToBasket} />)}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#1a1a1a', padding: '28px 40px' }}>
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
