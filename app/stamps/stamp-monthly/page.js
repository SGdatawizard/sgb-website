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

const subscriptions = [
  { id: 1, name: 'GSM Subscription — UK', price: 57.00, desc: 'Annual postal subscription delivered to all UK addresses. 12 issues per year.', region: 'UK', inStock: true },
  { id: 2, name: 'GSM Subscription — Europe', price: 90.00, desc: 'Annual postal subscription delivered to all European addresses. 12 issues per year.', region: 'Europe', inStock: true },
  { id: 3, name: 'GSM Subscription — Rest of World', price: 95.00, desc: 'Annual postal subscription delivered worldwide outside UK and Europe. 12 issues per year.', region: 'ROW', inStock: true },
]

export default function StampMonthlyPage() {
  const [basketCount, setBasketCount] = useState(0)
  const [email, setEmail] = useState('')

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
          <input placeholder="Search..." style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', border: '0.5px solid #e0e0e0', borderRadius: '4px', padding: '7px 12px', width: '150px', outline: 'none' }} />
          <Link href="/account" style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', color: '#555', textDecoration: 'none' }}>My account</Link>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 600, color: '#02383A', cursor: 'pointer' }}>Basket ({basketCount})</span>
        </div>
      </nav>

      {/* Stamps sub-nav */}
      <div style={{ background: '#02383A', padding: '0 40px', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginRight: '24px', whiteSpace: 'nowrap' }}>Stamps</span>
        {subNav.map(([label, href]) => (
          <Link key={label} href={href}
            style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: label === 'Gibbons Stamp Monthly' ? 600 : 400, color: label === 'Gibbons Stamp Monthly' ? '#FFAE55' : 'rgba(255,255,255,0.7)', padding: '13px 18px', letterSpacing: '0.03em', textDecoration: 'none', borderBottom: label === 'Gibbons Stamp Monthly' ? '2px solid #FFAE55' : '2px solid transparent', display: 'block' }}
            onMouseEnter={e => { if (label !== 'Gibbons Stamp Monthly') { e.currentTarget.style.color = '#FFAE55' } }}
            onMouseLeave={e => { if (label !== 'Gibbons Stamp Monthly') { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' } }}
          >{label}</Link>
        ))}
      </div>

      {/* Breadcrumb + title */}
      <div style={{ padding: '20px 40px', borderBottom: '0.5px solid #ebebeb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
          <Link href="/stamps" style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: '#999', textDecoration: 'none' }}>Stamps</Link>
          <span style={{ color: '#ddd', fontSize: '12px' }}>›</span>
          <span style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: '#555' }}>Gibbons Stamp Monthly</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-libre)', fontSize: '26px', color: '#1a1a1a', fontWeight: 700 }}>Gibbons Stamp Monthly</div>
            <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: '#999', marginTop: '3px' }}>The world's leading magazine for stamp collectors</div>
          </div>
          <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: '#999' }}>3 items</div>
        </div>
      </div>

      {/* Important notice */}
      <div style={{ margin: '32px 40px', padding: '20px 28px', background: '#faf9f7', border: '0.5px solid #e8e4dc', borderLeft: '3px solid #02383A', borderRadius: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{ flexShrink: 0, marginTop: '1px' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7.5" stroke="#02383A" strokeWidth="1"/>
              <path d="M8 7v4M8 5.5v.5" stroke="#02383A" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 700, color: '#02383A', letterSpacing: '0.04em', marginBottom: '6px' }}>Important notice</div>
            <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: '#555', lineHeight: 1.75 }}>
              If you have an existing online GSM subscription, you can access your account directly via{' '}
              <a href="https://gibbonsstampmonthly.com/" target="_blank" rel="noopener noreferrer"
                style={{ color: '#02383A', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                gibbonsstampmonthly.com
              </a>.{' '}
              Please note that currently <span style={{ fontWeight: 600, color: '#1a1a1a' }}>only postal subscriptions</span> are available for purchase via this shop.
            </div>
          </div>
        </div>
      </div>

      {/* Subscription cards */}
      <div style={{ padding: '0 40px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '900px' }}>
          {subscriptions.map(s => (
            <div key={s.id} style={{ background: '#fff', borderRadius: '8px', border: '0.5px solid #ebebeb', overflow: 'hidden', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#ccc'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#ebebeb'}
            >
              {/* Magazine cover placeholder */}
              <div style={{ height: '200px', background: '#1a2744', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '20px' }}>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Gibbons</div>
                <div style={{ fontFamily: 'var(--font-libre)', fontSize: '22px', fontWeight: 700, color: '#fff', fontStyle: 'italic', lineHeight: 1.1 }}>Stamp</div>
                <div style={{ fontFamily: 'var(--font-libre)', fontSize: '22px', fontWeight: 700, color: '#FFAE55', lineHeight: 1.1 }}>Monthly</div>
                <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.2)', margin: '4px 0' }} />
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>{s.region}</div>
              </div>

              <div style={{ padding: '16px 18px' }}>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: '#FFAE55', textTransform: 'uppercase', marginBottom: '6px' }}>Annual subscription · {s.region}</div>
                <div style={{ fontFamily: 'var(--font-libre)', fontSize: '15px', color: '#1a1a1a', marginBottom: '6px', lineHeight: 1.4 }}>{s.name}</div>
                <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: '#aaa', marginBottom: '14px', lineHeight: 1.6 }}>{s.desc}</div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '14px' }}>£{s.price.toFixed(2)}</div>
                <button
                  onClick={() => setBasketCount(c => c + 1)}
                  style={{ width: '100%', background: '#02383A', color: '#fff', border: 'none', padding: '11px', fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer', borderRadius: '6px', transition: 'background 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FFAE55'; e.currentTarget.style.color = '#02383A' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#02383A'; e.currentTarget.style.color = '#fff' }}
                >Subscribe now</button>
              </div>
            </div>
          ))}
        </div>

        {/* About GSM */}
        <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '0.5px solid #ebebeb', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: '#FFAE55', textTransform: 'uppercase', marginBottom: '10px' }}>Est. 1890</div>
            <div style={{ fontFamily: 'var(--font-libre)', fontSize: '24px', color: '#1a1a1a', fontWeight: 700, marginBottom: '14px', lineHeight: 1.3 }}>The world's leading stamp collecting magazine</div>
            <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: '#777', lineHeight: 1.85, marginBottom: '16px' }}>
              Gibbons Stamp Monthly has been the essential read for stamp collectors since 1890. Every issue is packed with expertly written articles, new issue coverage, auction reports, market analysis and the Stanley Gibbons catalogue supplement.
            </div>
            <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: '#777', lineHeight: 1.85 }}>
              Whether you're a beginner or an advanced collector, GSM keeps you informed, inspired and connected to the global philatelic community.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              ['12', 'Issues per year'],
              ['130+', 'Years of publishing'],
              ['Pages', 'Of expert content'],
              ['Global', 'Collector community'],
            ].map(([num, label]) => (
              <div key={label} style={{ background: '#faf9f7', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-libre)', fontSize: '28px', color: '#02383A', fontWeight: 700, marginBottom: '4px' }}>{num}</div>
                <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: '#999' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter signup */}
      <div style={{ background: '#02383A', padding: '40px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', maxWidth: '900px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-libre)', fontSize: '20px', color: '#fff', fontWeight: 700, marginBottom: '8px' }}>Sign up for the latest news from Stanley Gibbons Baldwin's</div>
            <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>By entering your email you agree to receive marketing communications. You can unsubscribe at any time.</div>
          </div>
          <div style={{ display: 'flex', gap: '0' }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', fontFamily: 'var(--font-opensans)', fontSize: '13px', border: 'none', borderRadius: '6px 0 0 6px', outline: 'none', background: '#fff' }}
            />
            <button style={{ background: '#FFAE55', color: '#02383A', border: 'none', padding: '12px 20px', fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', borderRadius: '0 6px 6px 0', whiteSpace: 'nowrap' }}>
              Subscribe →
            </button>
          </div>
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
