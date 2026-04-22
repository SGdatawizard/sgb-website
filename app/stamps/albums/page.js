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

export default function AlbumsPage() {
  const [basketCount] = useState(0)

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
            style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: label === 'Albums & Accessories' ? 600 : 400, color: label === 'Albums & Accessories' ? '#FFAE55' : 'rgba(255,255,255,0.7)', padding: '13px 18px', letterSpacing: '0.03em', textDecoration: 'none', borderBottom: label === 'Albums & Accessories' ? '2px solid #FFAE55' : '2px solid transparent', display: 'block' }}
            onMouseEnter={e => { if (label !== 'Albums & Accessories') { e.currentTarget.style.color = '#FFAE55' } }}
            onMouseLeave={e => { if (label !== 'Albums & Accessories') { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' } }}
          >{label}</Link>
        ))}
      </div>

      {/* Breadcrumb + title */}
      <div style={{ padding: '20px 40px', borderBottom: '0.5px solid #ebebeb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
          <Link href="/stamps" style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: '#999', textDecoration: 'none' }}>Stamps</Link>
          <span style={{ color: '#ddd', fontSize: '12px' }}>›</span>
          <span style={{ fontFamily: 'var(--font-opensans)', fontSize: '12px', color: '#555' }}>Albums & Accessories</span>
        </div>
        <div style={{ fontFamily: 'var(--font-libre)', fontSize: '26px', color: '#1a1a1a', fontWeight: 700 }}>Albums & Accessories</div>
        <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: '#999', marginTop: '3px' }}>Stanley Gibbons albums & accessories, fulfilled by Dauwalders</div>
      </div>

      {/* Main content */}
      <div style={{ padding: '48px 40px', maxWidth: '800px' }}>

        {/* Partnership notice */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#02383A', textTransform: 'uppercase', marginBottom: '20px' }}>Albums & Accessories Licensing Partnership</div>

          {[
            'To offer our customers a better and improved range of stamp albums and accessories, we have partnered with Dauwalders, who oversee the production and distribution of all Stanley Gibbons albums and accessories.',
            'Dauwalders, based in Salisbury, Wiltshire, are specialists in albums and accessories and have been trading for over 60 years. They share our passion and commitment to the hobby and bring extensive expertise to this area of the business.',
            'Under this partnership, Dauwalders have taken responsibility for all aspects of the albums and accessories operation — from production through to fulfilment. This includes the full range of Davo products.',
            'Stanley Gibbons will continue to provide the album page designs to ensure full consistency across the range and alignment with our catalogues. We are working closely with Dauwalders on ongoing improvements and new product developments.',
            'Stanley Gibbons Baldwin\'s will continue to serve customers with our catalogues, digital products, and stamps through retail and auction, all handled by the Stanley Gibbons Baldwin\'s team. This licensing partnership with Dauwalders applies solely to Stanley Gibbons albums and accessories.',
          ].map((para, i) => (
            <p key={i} style={{ fontFamily: 'var(--font-opensans)', fontSize: '14px', color: '#555', lineHeight: 1.85, marginBottom: '18px' }}>{para}</p>
          ))}
        </div>

        {/* Dauwalders CTA */}
        <div style={{ background: '#faf9f7', border: '0.5px solid #e8e4dc', borderRadius: '8px', padding: '28px 32px', marginBottom: '32px' }}>
          <div style={{ fontFamily: 'var(--font-libre)', fontSize: '17px', color: '#1a1a1a', fontWeight: 700, marginBottom: '10px' }}>View the full range of Stanley Gibbons Albums & Accessories</div>
          <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: '#777', lineHeight: 1.7, marginBottom: '20px' }}>
            To browse and purchase the complete Stanley Gibbons albums and accessories range, please visit Dauwalders directly using the link below.
          </div>
          
            href="https://www.dauwalders.co.uk/stanley-gibbons-albums-2135-c"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', background: '#02383A', color: '#fff', padding: '12px 24px', fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', borderRadius: '6px', textDecoration: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FFAE55'; e.currentTarget.style.color = '#02383A' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#02383A'; e.currentTarget.style.color = '#fff' }}
          >
            Visit Dauwalders &#8594;
          </a>
        </div>

        {/* Contact */}
        <div style={{ borderTop: '0.5px solid #ebebeb', paddingTop: '28px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{ flexShrink: 0, marginTop: '2px' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7.5" stroke="#02383A" strokeWidth="1"/>
              <path d="M8 7v4M8 5.5v.5" stroke="#02383A" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'var(--font-opensans)', fontSize: '13px', color: '#777', lineHeight: 1.75 }}>
            Should you have any questions please contact us at{' '}
            <a href="mailto:support@stanleygibbons.com" style={{ color: '#02383A', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              support@stanleygibbons.com
            </a>
            {' '}or call our customer service team on{' '}
            <a href="tel:+441425472363" style={{ color: '#02383A', fontWeight: 600, textDecoration: 'none' }}>
              +44 1425 472363
            </a>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer style={{ background: '#1a1a1a', padding: '28px 40px', marginTop: '40px' }}>
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
