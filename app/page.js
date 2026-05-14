'use client'

const SUPABASE_URL = 'https://ambzwvkbxpkjuwmjnvgj.supabase.co'
const IMG = (name) => `${SUPABASE_URL}/storage/v1/object/public/homepage-images/${name}`

export default function LandingPage() {
  return (
    <div style={{ background: '#f5f5f3', minHeight: '100vh' }}>

      {/* Landing header — logo left, login right, no nav */}
      <div style={{ position: 'relative', zIndex: 20, height: '80px', background: '#293451', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* SG crest box */}
          <div style={{ width: '52px', height: '52px', border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700', fontSize: '18px', color: '#fff', letterSpacing: '0.02em', lineHeight: 1 }}>SG</div>
          </div>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700', fontSize: '15px', color: '#fff', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1, marginBottom: '3px' }}>Stanley Gibbons</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontWeight: '400', fontSize: '10px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>The home of stamp collecting</div>
          </div>
        </div>
        <a href="/home" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', padding: '9px 24px', border: '1.5px solid #a3925f', borderRadius: '5px', letterSpacing: '0.04em', color: '#fff' }}>
          Log in
        </a>
      </div>

      {/* Hero */}
      <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 196px)', minHeight: '380px', overflow: 'hidden' }}>
        <img src={IMG('GB0048.jpg')} alt="Penny Black" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(41,52,81,0.93) 0%, rgba(41,52,81,0.78) 55%, rgba(41,52,81,0.25) 100%)' }} />

        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 80px' }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '20px' }}>
              The world authority on stamps
            </div>
            <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '58px', fontWeight: '600', color: '#fff', lineHeight: '1.08', margin: '0 0 24px' }}>
              Every stamp.<br />
              <span style={{ color: '#a3925f' }}>Every detail.</span><br />
              Every price.
            </h1>
            <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '17px', color: 'rgba(255,255,255,0.72)', lineHeight: '1.75', marginBottom: '44px', maxWidth: '480px' }}>
              The most comprehensive philatelic catalogue ever built. Powered by 170 years of Stanley Gibbons expertise.
            </p>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <a href="/account" style={{ display: 'inline-block', padding: '15px 36px', borderRadius: '6px', border: '1.5px solid #a3925f', background: 'transparent', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '14px', textDecoration: 'none', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
                Get started
              </a>
              <a href="/account" style={{ display: 'inline-block', padding: '14px 0', border: 'none', background: 'transparent', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '14px', textDecoration: 'none', letterSpacing: '0.03em', whiteSpace: 'nowrap', borderBottom: '1.5px solid #a3925f' }}>
                View pricing
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: '#293451', padding: '22px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
        {[
          { value: '500,000+', label: 'Stamps catalogued' },
          { value: '200+', label: 'Countries and territories' },
          { value: '170 years', label: 'Of philatelic expertise' },
          { value: 'Millions', label: 'In auction realisations' },
        ].map(function(stat, i) {
          return (
            <div key={stat.label} style={{ textAlign: 'center', padding: '0 24px', borderLeft: i > 0 ? '0.5px solid rgba(255,255,255,0.15)' : 'none' }}>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '28px', fontWeight: '600', color: '#a3925f', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Feature cards */}
      <div style={{ background: '#fff', padding: '80px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Everything you need</div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '36px', fontWeight: '600', color: '#293451', marginBottom: '16px' }}>The complete philatelic resource</div>
          <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '16px', color: '#888', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' }}>
            Built for collectors, dealers and investors who need precision data and historic context.
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          {[
            { title: 'Complete catalogue', desc: 'Every stamp ever issued, from every country, catalogued to SG standard with full variation detail.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { title: 'Historic price charts', desc: 'Track how catalogue values have moved over decades, from 2005 to today, for every stamp and variation.', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
            { title: 'Auction realisations', desc: 'Real hammer prices from Stanley Gibbons auctions, linked back to the original lot for full provenance.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { title: 'Advanced filters', desc: 'Filter by watermark, printer, perforation, colour, year, condition and price simultaneously.', icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z' },
            { title: '170 years of authority', desc: 'Stanley Gibbons has catalogued stamps since 1856. This is that knowledge, made digital and searchable.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            { title: 'Reference images', desc: 'High-resolution reference images from retail and auction, matched to the exact SG variation.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
          ].map(function(f) {
            return (
              <div key={f.title} style={{ padding: '32px 28px', border: '0.5px solid #eee', borderRadius: '8px', background: '#fafaf8' }}>
                <div style={{ width: '44px', height: '44px', background: '#eaecf2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#293451" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.icon} />
                  </svg>
                </div>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: '600', color: '#293451', marginBottom: '8px' }}>{f.title}</div>
                <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#666', lineHeight: '1.7' }}>{f.desc}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Split — precision */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '460px' }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={IMG('GB0040.jpg')} alt="Twopenny Blue block" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{ background: '#293451', padding: '64px 72px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Unmatched precision</div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '36px', fontWeight: '600', color: '#fff', lineHeight: '1.2', marginBottom: '20px' }}>
            Every variation.<br />Every sub-number.
          </div>
          <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', marginBottom: '32px' }}>
            From shades and perforations to watermark varieties and overprints, every catalogued variation has its own record, its own price history, and its own auction data.
          </div>
          <a href="/home" style={{ display: 'inline-block', padding: '13px 28px', background: '#a3925f', color: '#fff', borderRadius: '6px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', textDecoration: 'none', alignSelf: 'flex-start' }}>
            Browse the catalogue
          </a>
        </div>
      </div>

      {/* Split — pricing */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '460px' }}>
        <div style={{ background: '#f5f5f3', padding: '64px 72px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Historic price data</div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '36px', fontWeight: '600', color: '#293451', lineHeight: '1.2', marginBottom: '20px' }}>
            Know what a stamp<br />is really worth.
          </div>
          <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '15px', color: '#666', lineHeight: '1.8', marginBottom: '32px' }}>
            Catalogue values stretching back decades, combined with real auction hammer prices, give you the most complete picture of any stamp's true market value.
          </div>
          <a href="/home" style={{ display: 'inline-block', padding: '13px 28px', background: '#293451', color: '#fff', borderRadius: '6px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', textDecoration: 'none', alignSelf: 'flex-start' }}>
            See price history
          </a>
        </div>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={IMG('GB0043_1.jpg')} alt="10 pound stamp with tweezers" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      </div>

      {/* CTA banner */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: '320px', display: 'flex', alignItems: 'center' }}>
        <img src={IMG('GB0050.jpg')} alt="Queen Elizabeth engraving" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(41,52,81,0.87)' }} />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', padding: '0 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Start today</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '40px', fontWeight: '600', color: '#fff', lineHeight: '1.2', marginBottom: '12px' }}>Join Stanley Gibbons Vision</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '15px', color: 'rgba(255,255,255,0.7)', maxWidth: '500px', lineHeight: '1.7' }}>
              Access the world's most comprehensive philatelic catalogue and start building your collection today.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0, marginLeft: '48px' }}>
            <a href="/account" style={{ display: 'inline-block', padding: '15px 40px', background: '#a3925f', color: '#fff', borderRadius: '6px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '14px', textDecoration: 'none', whiteSpace: 'nowrap', textAlign: 'center' }}>
              Get started
            </a>
            <a href="/account" style={{ display: 'inline-block', padding: '14px 40px', background: 'transparent', color: '#fff', borderRadius: '6px', border: '1.5px solid rgba(255,255,255,0.4)', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '14px', textDecoration: 'none', whiteSpace: 'nowrap', textAlign: 'center' }}>
              View pricing
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#293451', padding: '40px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '16px', color: '#fff', marginBottom: '4px' }}>
            SG <span style={{ color: '#a3925f', fontWeight: '400' }}>Vision</span>
          </div>
          <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>The world authority on stamps since 1856</div>
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          {[
            { label: 'Catalogue', href: '/catalogue' },
            { label: 'Account', href: '/account' },
            { label: 'Upcoming auctions', href: 'https://sgbaldwins.com/auctions/upcoming-auctions' },
          ].map(function(link) {
            return (
              <a key={link.label} href={link.href} style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                {link.label}
              </a>
            )
          })}
        </div>
        <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>© 2026 Stanley Gibbons</div>
      </div>

    </div>
  )
}
