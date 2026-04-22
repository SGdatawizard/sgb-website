'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const LOGO = 'https://gmufbvrxogukrxtgyuag.supabase.co/storage/v1/object/public/images/logo/logo.png'

const slides = [
  {
    images: [
      'https://gmufbvrxogukrxtgyuag.supabase.co/storage/v1/object/public/images/carousel/web1.png',
      'https://gmufbvrxogukrxtgyuag.supabase.co/storage/v1/object/public/images/carousel/web2.png',
    ],
    tagline: 'The world\'s finest philatelic collection',
    sub: 'Rare stamps, catalogues & publications',
    btn: 'Shop stamps',
    link: '/stamps',
  },
  {
    images: [
      'https://gmufbvrxogukrxtgyuag.supabase.co/storage/v1/object/public/images/carousel/web3.png',
      'https://gmufbvrxogukrxtgyuag.supabase.co/storage/v1/object/public/images/carousel/web4.png',
    ],
    tagline: 'Numismatics of the highest order',
    sub: 'Ancient & modern coins, medals & banknotes',
    btn: 'Shop coins',
    link: '/coins',
  },
  {
    images: [
      'https://gmufbvrxogukrxtgyuag.supabase.co/storage/v1/object/public/images/carousel/web5.png',
    ],
    tagline: 'Live & online auctions',
    sub: '800+ lots — stamps, coins, medals & banknotes',
    btn: 'View catalogue',
    link: '/auctions',
  },
]

export default function Home() {
  const [slide, setSlide] = useState(0)
  const [basketCount, setBasketCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const currentSlide = slides[slide]
  const currentImage = currentSlide.images[0]

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

  return (
    <div style={{ fontFamily: 'var(--font-opensans)', background: '#f5f2ec' }}>

      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #ddd', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px', position: 'relative' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[['Stamps', '/stamps'], ['Coins', '/coins'], ['Auctions', '/auctions'], ['Publications', '/stamps?cat=catalogues']].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 500, color: '#333', padding: '6px 10px', letterSpacing: '0.05em' }}>{label}</Link>
          ))}
        </div>

        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <img src={LOGO} alt="Stanley Gibbons Baldwin's" style={{ height: '56px', width: 'auto' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <input placeholder="Search..." style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: '#888', border: '0.5px solid #ddd', borderRadius: '3px', padding: '6px 10px', width: '130px' }} />
          {[['My account', '/account'], ['About', '/about']].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 500, color: '#333', letterSpacing: '0.05em' }}>{label}</Link>
          ))}
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 600, color: '#02383A', cursor: 'pointer' }}>Basket ({basketCount})</span>
        </div>
      </nav>

      {/* Full-screen carousel */}
      <div style={{ position: 'relative', height: '580px', overflow: 'hidden' }}>
        <img
          key={currentImage}
          src={currentImage}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.05) 100%)' }} />

        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 72px', maxWidth: '640px' }}>
          <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', letterSpacing: '0.16em', color: '#FFAE55', textTransform: 'uppercase', marginBottom: '14px' }}>
            {currentSlide.sub}
          </div>
          <div style={{ fontFamily: 'var(--font-libre)', fontSize: '42px', color: '#fff', fontWeight: 700, lineHeight: 1.15, marginBottom: '28px' }}>
            {currentSlide.tagline}
          </div>
          <Link href={currentSlide.link} style={{ display: 'inline-block', background: '#FFAE55', color: '#02383A', padding: '13px 30px', fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', borderRadius: '3px', width: 'fit-content' }}>
            {currentSlide.btn} →
          </Link>
        </div>

        {/* Slide indicators */}
        <div style={{ position: 'absolute', bottom: '28px', left: '72px', display: 'flex', gap: '8px' }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{ width: i === slide ? '28px' : '8px', height: '8px', borderRadius: '4px', background: i === slide ? '#FFAE55' : 'rgba(255,255,255,0.5)', border: 'none', padding: 0, transition: 'all 0.3s ease', cursor: 'pointer' }}
            />
          ))}
        </div>
      </div>

      {/* Featured stamps */}
      <ProductSection
        title="Featured stamps"
        link="/stamps"
        linkLabel="View all stamps"
        products={stampProducts}
        onAdd={() => setBasketCount(c => c + 1)}
      />

      {/* Auction strip */}
      <div style={{ background: '#02383A', padding: '36px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', letterSpacing: '0.14em', color: '#FFAE55', textTransform: 'uppercase', marginBottom: '8px' }}>Next sale — June 2025</div>
          <div style={{ fontFamily: 'var(--font-libre)', fontSize: '22px', color: '#fff', fontWeight: 700, marginBottom: '6px' }}>Stanley Gibbons Baldwin's Auction</div>
          <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>800+ lots · Stamps, coins, medals & banknotes · Live & online bidding</div>
        </div>
        <Link href="/auctions" style={{ background: '#FFAE55', color: '#02383A', padding: '12px 28px', fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 700, borderRadius: '3px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
          View full catalogue →
        </Link>
      </div>

      {/* Featured coins */}
      <ProductSection
        title="Featured coins"
        link="/coins"
        linkLabel="View all coins"
        products={coinProducts}
        onAdd={() => setBasketCount(c => c + 1)}
      />

      {/* Footer */}
      <footer style={{ background: '#1a1a1a', padding: '40px 40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '32px' }}>
          <div>
            <img src={LOGO} alt="Stanley Gibbons Baldwin's" style={{ height: '48px', width: 'auto', marginBottom: '14px', opacity: 0.9 }} />
            <div style={{ fontFamily: 'var(--font-libre)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', marginBottom: '10px' }}>The home of stamps, coins & collectibles</div>
            <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.8 }}>Two of the world's most respected names in philately and numismatics, united under one roof. Est. 1856 & 1872.</div>
          </div>
          {[
            ['Stamps', ['Great Britain', 'Commonwealth', 'Europe', 'Publications']],
            ['Coins', ['Gold coins', 'Ancient coins', 'World coins', 'Medals']],
            ['Company', ['Auctions', 'About us', 'Contact', 'Admin portal']],
          ].map(([title, links]) => (
            <div key={title}>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#FFAE55', textTransform: 'uppercase', marginBottom: '14px' }}>{title}</div>
              {links.map(l => (
                <div key={l} style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', cursor: 'pointer' }}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-opensans)', fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>© 2025 Stanley Gibbons Baldwin's Ltd. All rights reserved.</span>
          <span style={{ fontFamily: 'var(--font-opensans)', fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>Terms · Privacy · Cookie policy</span>
        </div>
      </footer>

    </div>
  )
}

function ProductSection({ title, link, linkLabel, products, onAdd }) {
  return (
    <div style={{ padding: '48px 40px', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-libre)', fontSize: '22px', color: '#02383A', fontWeight: 700 }}>{title}</div>
          <div style={{ width: '48px', height: '2px', background: '#FFAE55', marginTop: '6px' }} />
        </div>
        <Link href={link} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', color: '#FFAE55', fontWeight: 600, letterSpacing: '0.04em' }}>{linkLabel} ›</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {products.map((p, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '5px', border: '0.5px solid #e0ddd6', overflow: 'hidden' }}>
            <div style={{ height: '160px', background: '#e8e3da', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span style={{ fontFamily: 'var(--font-libre)', fontSize: '11px', color: '#aaa', fontStyle: 'italic' }}>Image coming soon</span>
              {p.badge && (
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#02383A', color: '#FFAE55', fontSize: '9px', fontFamily: 'var(--font-montserrat)', fontWeight: 700, padding: '3px 8px', borderRadius: '2px', letterSpacing: '0.06em' }}>{p.badge}</div>
              )}
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '9px', fontFamily: 'var(--font-montserrat)', color: '#FFAE55', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>{p.cat}</div>
              <div style={{ fontFamily: 'var(--font-libre)', fontSize: '13px', color: '#1a1a1a', marginBottom: '6px', lineHeight: 1.4 }}>{p.name}</div>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '14px', fontWeight: 700, color: '#02383A' }}>{p.price}</div>
            </div>
            <button onClick={onAdd} style={{ display: 'block', width: '100%', background: '#02383A', color: '#fff', border: 'none', padding: '10px', fontFamily: 'var(--font-montserrat)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer' }}>
              Add to basket
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
