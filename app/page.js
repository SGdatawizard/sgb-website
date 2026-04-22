'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [slide, setSlide] = useState(0)
  const [basketCount, setBasketCount] = useState(0)

  const slides = [
    {
      eyebrow: 'Stanley Gibbons — New arrivals',
      title: 'Rare stamps & philatelic treasures',
      body: 'From Victorian Penny Blacks to modern limited editions — the world\'s finest stamp collection, curated for collectors at every level.',
      btn1: 'Shop stamps',
      btn2: 'View catalogues',
      link1: '/stamps',
      link2: '/stamps?cat=catalogues',
    },
    {
      eyebrow: 'Baldwin\'s — Coin department',
      title: 'Ancient & modern numismatics',
      body: 'From Greek ancients to modern gold sovereigns — Baldwin\'s has been the trusted name in rare coins since 1872.',
      btn1: 'Shop coins',
      btn2: 'View all lots',
      link1: '/coins',
      link2: '/coins',
    },
    {
      eyebrow: 'Live auction — Next sale',
      title: 'Upcoming auction: June 2025',
      body: 'Over 800 lots spanning rare stamps, world coins, medals & banknotes. Live online bidding available.',
      btn1: 'View catalogue',
      btn2: 'Register to bid',
      link1: '/auctions',
      link2: '/auctions',
    },
  ]

  const stampProducts = [
    { cat: 'Great Britain', name: '1840 Penny Black, plate 1a', price: '£1,250', badge: 'Featured' },
    { cat: 'Commonwealth', name: '1935 Silver Jubilee omnibus set', price: '£85', badge: 'New' },
    { cat: 'Europe', name: 'Germany 1923 inflation series', price: '£42', badge: null },
    { cat: 'Publications', name: 'Stanley Gibbons catalogue 2024', price: '£38', badge: null },
  ]

  const coinProducts = [
    { cat: 'Gold', name: '1887 Victoria Jubilee Sovereign', price: '£780', badge: 'Featured' },
    { cat: 'Ancient', name: 'Roman denarius, Julius Caesar', price: '£1,100', badge: null },
    { cat: 'Silver', name: '1935 Crown, George V', price: '£245', badge: 'New' },
    { cat: 'World', name: 'USA 1893 Columbian half dollar', price: '£320', badge: null },
  ]

  const prev = () => setSlide((slide + 2) % 3)
  const next = () => setSlide((slide + 1) % 3)

  return (
    <div style={{ fontFamily: 'var(--font-opensans)', background: '#f5f2ec' }}>

      {/* Announcement bar */}
      <div style={{ background: '#02383A', textAlign: 'center', padding: '9px', fontFamily: 'var(--font-montserrat)', fontSize: '11px', letterSpacing: '0.06em', color: '#FFAE55' }}>
        Stanley Gibbons Baldwin's — The home of stamps, coins & collectibles since 1856
      </div>

      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #ddd', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '15px', letterSpacing: '0.1em', color: '#02383A' }}>STANLEY GIBBONS</div>
          <div style={{ width: '100%', height: '0.5px', background: '#02383A', opacity: 0.3, margin: '2px 0' }} />
          <div style={{ fontFamily: 'var(--font-libre)', fontSize: '9px', letterSpacing: '0.08em', color: '#FFAE55', fontStyle: 'italic' }}>Baldwin's · Est. 1872</div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[['Stamps', '/stamps'], ['Coins', '/coins'], ['Auctions', '/auctions'], ['Publications', '/stamps?cat=catalogues'], ['About', '/about']].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 500, color: '#333', padding: '6px 10px' }}>{label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <input placeholder="Search products..." style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: '#888', border: '0.5px solid #ddd', borderRadius: '3px', padding: '6px 10px', width: '140px' }} />
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 600, color: '#02383A' }}>Basket ({basketCount})</span>
        </div>
      </nav>

      {/* Carousel */}
      <div style={{ background: '#02383A', position: 'relative', overflow: 'hidden', minHeight: '340px', display: 'flex', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', width: '300%', transform: `translateX(-${slide * 33.333}%)`, transition: 'transform 0.5s ease' }}>
          {slides.map((s, i) => (
            <div key={i} style={{ width: '33.333%', flexShrink: 0, display: 'flex', alignItems: 'center', padding: '40px 48px', gap: '40px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', letterSpacing: '0.14em', color: '#FFAE55', textTransform: 'uppercase', marginBottom: '10px' }}>{s.eyebrow}</div>
                <div style={{ fontFamily: 'var(--font-libre)', fontSize: '30px', color: '#fff', fontWeight: 700, lineHeight: 1.2, marginBottom: '12px' }}>{s.title}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '22px', maxWidth: '380px' }}>{s.body}</div>
                <Link href={s.link1} style={{ background: '#FFAE55', color: '#02383A', padding: '11px 24px', fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 700, borderRadius: '3px', marginRight: '12px' }}>{s.btn1}</Link>
                <Link href={s.link2} style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.35)', padding: '11px 24px', fontFamily: 'var(--font-montserrat)', fontSize: '12px', borderRadius: '3px' }}>{s.btn2}</Link>
              </div>
            </div>
          ))}
        </div>
        <button onClick={prev} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.12)', border: '0.5px solid rgba(255,255,255,0.2)', color: '#fff', width: '34px', height: '34px', borderRadius: '50%', fontSize: '18px' }}>‹</button>
        <button onClick={next} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.12)', border: '0.5px solid rgba(255,255,255,0.2)', color: '#fff', width: '34px', height: '34px', borderRadius: '50%', fontSize: '18px' }}>›</button>
        <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '7px' }}>
          {[0, 1, 2].map(i => (
            <button key={i} onClick={() => setSlide(i)} style={{ width: '7px', height: '7px', borderRadius: '50%', background: slide === i ? '#FFAE55' : 'rgba(255,255,255,0.3)', border: 'none' }} />
          ))}
        </div>
      </div>

      {/* Featured stamps */}
      <ProductSection title="Featured stamps" link="/stamps" linkLabel="View all stamps" products={stampProducts} onAdd={() => setBasketCount(c => c + 1)} />

      {/* Auction strip */}
      <div style={{ background: '#02383A', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', letterSpacing: '0.12em', color: '#FFAE55', textTransform: 'uppercase', marginBottom: '6px' }}>Next sale — June 2025</div>
          <div style={{ fontFamily: 'var(--font-libre)', fontSize: '20px', color: '#fff', fontWeight: 700, marginBottom: '4px' }}>Stanley Gibbons Baldwin's Auction</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>800+ lots · Stamps, coins, medals & banknotes · Live & online bidding</div>
        </div>
        <Link href="/auctions" style={{ background: '#FFAE55', color: '#02383A', padding: '10px 24px', fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 700, borderRadius: '3px' }}>View full catalogue</Link>
      </div>

      {/* Featured coins */}
      <ProductSection title="Featured coins" link="/coins" linkLabel="View all coins" products={coinProducts} onAdd={() => setBasketCount(c => c + 1)} />

      {/* Footer */}
      <footer style={{ background: '#1a1a1a', padding: '32px 32px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '32px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', color: '#FFAE55', marginBottom: '4px' }}>STANLEY GIBBONS BALDWIN'S</div>
            <div style={{ fontFamily: 'var(--font-libre)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', marginBottom: '10px' }}>The home of stamps, coins & collectibles</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>Two of the world's most respected names in philately and numismatics, united under one roof. Est. 1856 & 1872.</div>
          </div>
          {[['Stamps', ['Great Britain', 'Commonwealth', 'Europe', 'Publications']], ['Coins', ['Gold coins', 'Ancient coins', 'World coins', 'Medals']], ['Company', ['Auctions', 'About us', 'Contact', 'Admin']]].map(([title, links]) => (
            <div key={title}>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#FFAE55', textTransform: 'uppercase', marginBottom: '10px' }}>{title}</div>
              {links.map(l => <div key={l} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginBottom: '6px', cursor: 'pointer' }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>© 2025 Stanley Gibbons Baldwin's Ltd. All rights reserved.</span>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>Terms · Privacy · Cookie policy</span>
        </div>
      </footer>
    </div>
  )
}

function ProductSection({ title, link, linkLabel, products, onAdd }) {
  return (
    <div style={{ padding: '36px 32px', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-libre)', fontSize: '20px', color: '#02383A', fontWeight: 700 }}>{title}</div>
          <div style={{ width: '48px', height: '2px', background: '#FFAE55', marginTop: '4px' }} />
        </div>
        <Link href={link} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', color: '#FFAE55', fontWeight: 600 }}>{linkLabel} ›</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        {products.map((p, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '5px', border: '0.5px solid #e0ddd6', overflow: 'hidden' }}>
            <div style={{ height: '110px', background: '#e8e3da', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span style={{ fontFamily: 'var(--font-libre)', fontSize: '11px', color: '#888' }}>Image coming soon</span>
              {p.badge && <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#02383A', color: '#FFAE55', fontSize: '9px', fontFamily: 'var(--font-montserrat)', fontWeight: 700, padding: '2px 7px', borderRadius: '2px' }}>{p.badge}</div>}
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: '9px', fontFamily: 'var(--font-montserrat)', color: '#FFAE55', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '3px' }}>{p.cat}</div>
              <div style={{ fontFamily: 'var(--font-libre)', fontSize: '12px', color: '#1a1a1a', marginBottom: '5px', lineHeight: 1.4 }}>{p.name}</div>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '13px', fontWeight: 700, color: '#02383A' }}>{p.price}</div>
            </div>
            <button onClick={onAdd} style={{ display: 'block', width: '100%', background: '#02383A', color: '#fff', border: 'none', padding: '8px', fontFamily: 'var(--font-montserrat)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em' }}>Add to basket</button>
          </div>
        ))}
      </div>
    </div>
  )
}
