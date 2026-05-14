'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

const SUPABASE_URL = 'https://ambzwvkbxpkjuwmjnvgj.supabase.co'
const IMG = (name) => `${SUPABASE_URL}/storage/v1/object/public/homepage-images/${name}`
const SGB_BASE = 'https://sgbaldwins.com/auctions/'

function lotUrl(sale) {
  if (!sale) return SGB_BASE + 'upcoming-auctions'
  if (sale.auction_slug && sale.lot_number) {
    return SGB_BASE + sale.auction_slug + '/lot/' + sale.lot_number
  }
  return SGB_BASE + 'upcoming-auctions'
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [realisations, setRealisations] = useState([])
  const router = useRouter()

  useEffect(() => {
    async function fetchRealisations() {
      const { data } = await supabase
        .from('sales_records')
        .select(`
          id,
          lot_number,
          sale_number,
          sale_price,
          sale_condition,
          sale_date,
          country_iso,
          auction_slug,
          stamp_variations (
            sg_sub_number,
            colour_shade,
            stamps (
              sg_number,
              denomination,
              colour_primary,
              stamp_series (name)
            )
          )
        `)
        .not('variation_id', 'is', null)
        .order('sale_date', { ascending: false })
        .limit(10)
      if (data) setRealisations(data)
    }
    fetchRealisations()
  }, [])

  function handleSearch() {
    if (query.trim()) {
      router.push('/catalogue?q=' + encodeURIComponent(query))
    } else {
      router.push('/catalogue')
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch()
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function countryName(iso) {
    const map = { FK: 'Falkland Islands', GB: 'Great Britain', US: 'United States', AU: 'Australia', CA: 'Canada', NZ: 'New Zealand' }
    return map[iso] || iso || '—'
  }

  const features = [
    { title: 'Complete catalogue', desc: 'Every stamp ever issued, from every country, catalogued to SG standard with full variation detail.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { title: 'Historic price charts', desc: 'Track how catalogue values have moved over decades, from 2005 to today, for every stamp and variation.', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
    { title: 'Auction realisations', desc: 'Real hammer prices from Stanley Gibbons auctions, linked back to the original lot for full provenance.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Advanced filters', desc: 'Filter by watermark, printer, perforation, colour, year, condition and price simultaneously.', icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z' },
    { title: '170 years of authority', desc: 'Stanley Gibbons has catalogued stamps since 1856. This is that knowledge, made digital and searchable.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { title: 'Reference images', desc: 'High-resolution reference images from retail and auction, matched to the exact SG variation.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ]

  return (
    <div style={{ background: '#f5f5f3' }}>

      <div style={{ position: 'relative', width: '100%', height: '580px', overflow: 'hidden' }}>
        <img src={IMG('GB0048.jpg')} alt="Penny Black with Stanley Gibbons catalogue" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(41,52,81,0.92) 0%, rgba(41,52,81,0.75) 50%, rgba(41,52,81,0.2) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 80px' }}>
          <div style={{ maxWidth: '580px' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
              The world authority on stamps
            </div>
            <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '52px', fontWeight: '600', color: '#fff', lineHeight: '1.1', margin: '0 0 20px' }}>
              Every stamp.<br />
              <span style={{ color: '#a3925f' }}>Every detail.</span><br />
              Every price.
            </h1>
            <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.7', marginBottom: '36px' }}>
              The most comprehensive philatelic catalogue ever built. Powered by 170 years of Stanley Gibbons expertise.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={query}
                onChange={function(e) { setQuery(e.target.value) }}
                onKeyDown={handleKeyDown}
                placeholder="Search by SG number, country, colour..."
                style={{ flex: 1, padding: '14px 20px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', outline: 'none' }}
              />
              <button onClick={handleSearch} style={{ padding: '14px 32px', borderRadius: '6px', border: 'none', background: '#a3925f', color: '#293451', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Search catalogue
              </button>
            </div>
            <div style={{ marginTop: '16px', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
              Try: "Penny Black", "SG 1", "1933 Centenary", "Falkland Islands"
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#293451', padding: '28px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
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

      <div style={{ background: '#fff', padding: '72px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Everything you need</div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '36px', fontWeight: '600', color: '#293451', marginBottom: '16px' }}>The complete philatelic resource</div>
          <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '16px', color: '#888', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' }}>
            Built for collectors, dealers and investors who need precision data and historic context.
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          {features.map(function(f) {
            return (
              <div key={f.title} style={{ padding: '32px 28px', border: '0.5px solid #eee', borderRadius: '8px', background: '#fafaf8' }}>
                <div style={{ width: '44px', height: '44px', background: '#e6f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
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
          <a href="/catalogue" style={{ display: 'inline-block', padding: '13px 28px', background: '#a3925f', color: '#293451', borderRadius: '6px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', textDecoration: 'none', alignSelf: 'flex-start' }}>
            Browse the catalogue
          </a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '460px' }}>
        <div style={{ background: '#f5f5f3', padding: '64px 72px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Historic price data</div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '36px', fontWeight: '600', color: '#293451', lineHeight: '1.2', marginBottom: '20px' }}>
            Know what a stamp<br />is really worth.
          </div>
          <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '15px', color: '#666', lineHeight: '1.8', marginBottom: '32px' }}>
            Catalogue values stretching back decades, combined with real auction hammer prices, give you the most complete picture of any stamp's true market value.
          </div>
          <a href="/catalogue" style={{ display: 'inline-block', padding: '13px 28px', background: '#293451', color: '#fff', borderRadius: '6px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', textDecoration: 'none', alignSelf: 'flex-start' }}>
            See price history
          </a>
        </div>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={IMG('GB0043_1.jpg')} alt="10 pound stamp with tweezers" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      </div>

      <div style={{ background: '#fff', padding: '72px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '32px', fontWeight: '600', color: '#293451' }}>
            Recent realisations
          </div>
          <a href="https://sgbaldwins.com/auctions/upcoming-auctions" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#293451', textDecoration: 'none', padding: '10px 20px', border: '1px solid #293451', borderRadius: '6px' }}>
            Upcoming auctions
          </a>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #293451' }}>
              {['Country', 'SG no.', 'Description', 'Hammer price', 'Sale', 'Date', ''].map(function(h) {
                return (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 0', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#293451', textTransform: 'uppercase', letterSpacing: '0.06em', paddingRight: '16px' }}>
                    {h}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {realisations.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '32px 0', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#aaa', textAlign: 'center' }}>
                  Loading recent realisations...
                </td>
              </tr>
            ) : realisations.map(function(sale) {
              const variation = sale.stamp_variations
              const stamp = variation ? variation.stamps : null
              const sgNum = variation ? variation.sg_sub_number : '—'
              const desc = variation ? (variation.colour_shade || (stamp ? stamp.colour_primary : '')) : '—'
              const price = '£' + parseFloat(sale.sale_price).toLocaleString('en-GB')
              const country = countryName(sale.country_iso)
              const saleDate = formatDate(sale.sale_date)
              return (
                <tr key={sale.id} style={{ borderBottom: '0.5px solid #eee' }}>
                  <td style={{ padding: '13px 16px 13px 0', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#666' }}>{country}</td>
                  <td style={{ padding: '13px 16px 13px 0', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#293451' }}>{sgNum}</td>
                  <td style={{ padding: '13px 16px 13px 0', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#444' }}>{desc}</td>
                  <td style={{ padding: '13px 16px 13px 0', fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: '600', color: '#293451', whiteSpace: 'nowrap' }}>{price}</td>
                  <td style={{ padding: '13px 16px 13px 0', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888' }}>{sale.sale_number}</td>
                  <td style={{ padding: '13px 16px 13px 0', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', whiteSpace: 'nowrap' }}>{saleDate}</td>
                  <td style={{ padding: '13px 0', textAlign: 'right' }}>
                    <a href={lotUrl(sale)} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451', textDecoration: 'none', padding: '6px 14px', border: '0.5px solid #293451', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                      View lot
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{ position: 'relative', overflow: 'hidden', minHeight: '320px', display: 'flex', alignItems: 'center' }}>
        <img src={IMG('GB0050.jpg')} alt="Queen Elizabeth engraving" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(41,52,81,0.85)' }} />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', padding: '0 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Stanley Gibbons Auctions</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '40px', fontWeight: '600', color: '#fff', lineHeight: '1.2', marginBottom: '12px' }}>Upcoming auctions</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '15px', color: 'rgba(255,255,255,0.7)', maxWidth: '500px', lineHeight: '1.7' }}>
              Browse forthcoming Stanley Gibbons auction sales and register to bid on rare philatelic material.
            </div>
          </div>
          <a href="https://sgbaldwins.com/auctions/upcoming-auctions" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '16px 40px', background: '#a3925f', color: '#293451', borderRadius: '6px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '14px', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '48px' }}>
            View upcoming auctions
          </a>
        </div>
      </div>

      <div style={{ background: '#293451', padding: '40px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '16px', color: '#fff', marginBottom: '4px' }}>
            Stanley Gibbons <span style={{ color: '#a3925f', fontWeight: '400' }}>Catalogue</span>
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
        <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>2026 Stanley Gibbons</div>
      </div>

    </div>
  )
}
