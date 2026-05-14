'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const SUPABASE_URL = 'https://ambzwvkbxpkjuwmjnvgj.supabase.co'
const IMG = (name) => `${SUPABASE_URL}/storage/v1/object/public/homepage-images/${name}`

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

const COUNTRY_GROUPS = [
  { group: 'Great Britain', countries: ['GB'] },
  { group: 'Commonwealth', countries: ['AU', 'CA', 'NZ', 'BM', 'JM', 'HK', 'FK'] },
  { group: 'Africa', countries: ['ZA', 'NG', 'EG'] },
  { group: 'Asia & Middle East', countries: ['IN', 'IL'] },
  { group: 'Europe', countries: ['FR', 'DE'] },
  { group: 'Americas', countries: ['US', 'CA'] },
]

const THEME_GROUPS = [
  { group: 'Nature', themes: ['Animals', 'Birds', 'Flowers', 'Nature'] },
  { group: 'Transport', themes: ['Ships', 'Vehicles', 'Aircraft'] },
  { group: 'History & Culture', themes: ['Royalty', 'Military', 'Religion', 'People', 'Art'] },
  { group: 'Geography', themes: ['Maps', 'Architecture'] },
  { group: 'Sport & Science', themes: ['Sports', 'Space'] },
]

const ACCOUNT_SECTIONS = [
  {
    id: 'collection',
    label: 'My Collection',
    href: '/account',
    bg: '#293451',
    textColor: '#fff',
    accentColor: '#a3925f',
    img: IMG('GB0048.jpg'),
    desc: 'Your complete philatelic collection in one place. Track catalogue values, record what you paid, and organise by country and series.',
    stat: '41 items',
    cta: 'View collection →',
  },
  {
    id: 'wishlist',
    label: 'Wishlist',
    href: '/account',
    bg: '#7a1a2e',
    textColor: '#fff',
    accentColor: 'rgba(255,255,255,0.6)',
    img: IMG('GB0040.jpg'),
    desc: 'Stamps you want but don\'t yet own. Flag items from the catalogue and track how their values move over time.',
    stat: '12 stamps',
    cta: 'View wishlist →',
  },
  {
    id: 'sgb100',
    label: 'SGB 100',
    href: '/sgb100',
    bg: '#0a0e1a',
    textColor: '#fff',
    accentColor: '#a3925f',
    img: IMG('GB0043_1.jpg'),
    desc: 'The 100 best-performing stamps by catalogue value appreciation since 2005. A performance index for serious collectors.',
    stat: 'Index: 2,847 pts',
    cta: 'View index →',
  },
  {
    id: 'budget',
    label: 'Budget Tracker',
    href: '/account',
    bg: '#fff',
    textColor: '#293451',
    accentColor: '#888',
    img: IMG('GB0050.jpg'),
    desc: 'Set a monthly spending limit and track every purchase against it. Stay on top of what you\'re spending on stamps.',
    stat: '£142.50 remaining',
    cta: 'View budget →',
  },
  {
    id: 'sell',
    label: 'Looking to Sell',
    href: '/account',
    bg: '#f5f5f3',
    textColor: '#293451',
    accentColor: '#888',
    img: IMG('GB0048.jpg'),
    desc: 'Flag stamps from your collection that you\'d consider selling. Once you reach £500 catalogue value, request a free expert valuation.',
    stat: null,
    cta: 'View flagged →',
  },
  {
    id: 'community',
    label: 'Community',
    href: '/community',
    bg: '#f5f5f3',
    textColor: '#293451',
    accentColor: '#888',
    img: IMG('GB0040.jpg'),
    desc: 'Discuss stamps, share finds and ask questions. Connect with collectors, dealers and experts from around the world.',
    stat: null,
    cta: 'Go to community →',
  },
]

function lotUrl(sale) {
  const SGB_BASE = 'https://sgbaldwins.com/auctions/'
  if (sale.auction_slug && sale.lot_number) return SGB_BASE + sale.auction_slug + '/lot/' + sale.lot_number
  return SGB_BASE + 'upcoming-auctions'
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [realisations, setRealisations] = useState([])
  const [openCountrySection, setOpenCountrySection] = useState(false)
  const [openThemeSection, setOpenThemeSection] = useState(false)
  const [openCountryGroup, setOpenCountryGroup] = useState(null)
  const [openThemeGroup, setOpenThemeGroup] = useState(null)
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

  function handleSearch() {
    if (query.trim()) router.push('/catalogue?q=' + encodeURIComponent(query.trim()))
    else router.push('/catalogue')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch()
  }

  function browseCountry(iso) {
    router.push('/catalogue?country=' + iso)
  }

  function browseTheme(theme) {
    router.push('/catalogue?q=' + encodeURIComponent(theme))
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function countryName(iso) {
    const map = { FK: 'Falkland Islands', GB: 'Great Britain', US: 'United States', AU: 'Australia', CA: 'Canada', NZ: 'New Zealand', BM: 'Bermuda' }
    return map[iso] || iso || '—'
  }

  return (
    <div style={{ background: '#f5f5f3', minHeight: '100vh' }}>

      {/* ── Search ──────────────────────────────────────────────────── */}
      <div style={{ background: '#293451', padding: '48px 80px 40px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Stanley Gibbons Vision
          </div>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '32px', fontWeight: '600', color: '#fff', margin: '0 0 28px', lineHeight: '1.2' }}>
            What are you looking for?
          </h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search stamps, countries, series, SG numbers..."
              style={{ flex: 1, padding: '14px 20px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.12)', color: '#fff', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', outline: 'none' }}
            />
            <button
              onClick={handleSearch}
              style={{ padding: '14px 32px', borderRadius: '6px', border: 'none', background: '#a3925f', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Search
            </button>
          </div>
          <div style={{ marginTop: '12px', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            Try: "Penny Black", "SG 1", "1933 Centenary", "Falkland Islands"
          </div>
        </div>
      </div>

      {/* ── Browse by country / theme ─────────────────────────────── */}
      <div style={{ background: '#fff', padding: '40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* By country */}
          <div style={{ border: '0.5px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <button
              onClick={() => setOpenCountrySection(v => !v)}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: openCountrySection ? '#293451' : '#fafaf8', border: 'none', cursor: 'pointer' }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: '600', color: openCountrySection ? '#fff' : '#293451' }}>Browse by country</div>
                <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: openCountrySection ? 'rgba(255,255,255,0.5)' : '#aaa', marginTop: '2px' }}>Jump straight to a country's full catalogue</div>
              </div>
              <span style={{ color: openCountrySection ? '#a3925f' : '#aaa', fontSize: '18px', transition: 'transform 0.2s', display: 'inline-block', transform: openCountrySection ? 'rotate(180deg)' : 'none', flexShrink: 0, marginLeft: '16px' }}>&#8964;</span>
            </button>
            {openCountrySection && (
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {COUNTRY_GROUPS.map(({ group, countries: isos }) => {
                  const isOpen = openCountryGroup === group
                  const items = COUNTRIES.filter(c => isos.includes(c.iso))
                  return (
                    <div key={group} style={{ border: '0.5px solid #eee', borderRadius: '6px', overflow: 'hidden' }}>
                      <button
                        onClick={() => setOpenCountryGroup(isOpen ? null : group)}
                        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: isOpen ? '#eaecf2' : '#fafaf8', border: 'none', cursor: 'pointer' }}
                      >
                        <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#293451' }}>{group}</span>
                        <span style={{ color: '#aaa', fontSize: '12px', transform: isOpen ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>&#8964;</span>
                      </button>
                      {isOpen && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#eee' }}>
                          {items.map(c => (
                            <button key={c.iso} onClick={() => browseCountry(c.iso)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#fff', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                              <span style={{ fontSize: '16px', lineHeight: 1 }}>{c.flag}</span>
                              <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#333' }}>{c.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* By theme */}
          <div style={{ border: '0.5px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <button
              onClick={() => setOpenThemeSection(v => !v)}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: openThemeSection ? '#293451' : '#fafaf8', border: 'none', cursor: 'pointer' }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: '600', color: openThemeSection ? '#fff' : '#293451' }}>Browse by theme</div>
                <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: openThemeSection ? 'rgba(255,255,255,0.5)' : '#aaa', marginTop: '2px' }}>Find stamps by subject matter</div>
              </div>
              <span style={{ color: openThemeSection ? '#a3925f' : '#aaa', fontSize: '18px', transition: 'transform 0.2s', display: 'inline-block', transform: openThemeSection ? 'rotate(180deg)' : 'none', flexShrink: 0, marginLeft: '16px' }}>&#8964;</span>
            </button>
            {openThemeSection && (
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {THEME_GROUPS.map(({ group, themes: themeLabels }) => {
                  const isOpen = openThemeGroup === group
                  const items = THEMES.filter(t => themeLabels.includes(t.label))
                  return (
                    <div key={group} style={{ border: '0.5px solid #eee', borderRadius: '6px', overflow: 'hidden' }}>
                      <button
                        onClick={() => setOpenThemeGroup(isOpen ? null : group)}
                        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: isOpen ? '#eaecf2' : '#fafaf8', border: 'none', cursor: 'pointer' }}
                      >
                        <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#293451' }}>{group}</span>
                        <span style={{ color: '#aaa', fontSize: '12px', transform: isOpen ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>&#8964;</span>
                      </button>
                      {isOpen && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#eee' }}>
                          {items.map(t => (
                            <button key={t.label} onClick={() => browseTheme(t.label)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#fff', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                              <span style={{ fontSize: '15px', lineHeight: 1 }}>{t.icon}</span>
                              <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#333' }}>{t.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Account sections ─────────────────────────────────────────── */}
      <div style={{ background: '#f5f5f3', padding: '48px 80px' }}>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '24px' }}>Your account</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          {ACCOUNT_SECTIONS.map(section => (
            <a key={section.id} href={section.href} style={{ background: section.bg, borderRadius: '10px', overflow: 'hidden', textDecoration: 'none', display: 'flex', flexDirection: 'column', border: section.bg === '#fff' || section.bg === '#f5f5f3' ? '0.5px solid #ddd' : 'none' }}>
              <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                <img src={section.img} alt={section.label} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 0%, ${section.bg} 100%)` }} />
                <div style={{ position: 'absolute', bottom: '12px', left: '20px' }}>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: section.accentColor, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>{section.label}</div>
                  {section.stat && <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: '600', color: section.textColor }}>{section.stat}</div>}
                </div>
              </div>
              <div style={{ padding: '16px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: section.bg === '#fff' || section.bg === '#f5f5f3' ? '#666' : 'rgba(255,255,255,0.65)', lineHeight: '1.6', marginBottom: '16px', flex: 1 }}>{section.desc}</div>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: section.bg === '#fff' || section.bg === '#f5f5f3' ? '#293451' : section.accentColor, letterSpacing: '0.04em' }}>{section.cta}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Recent realisations ──────────────────────────────────────── */}
      <div style={{ background: '#fff', padding: '48px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '600', color: '#293451', marginBottom: '4px' }}>Recent realisations</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#888' }}>Latest hammer prices from Stanley Gibbons auctions</div>
          </div>
          <a href="https://sgbaldwins.com/auctions/upcoming-auctions" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451', textDecoration: 'none', padding: '8px 16px', border: '0.5px solid #293451', borderRadius: '5px', letterSpacing: '0.04em' }}>Upcoming auctions →</a>
        </div>
        <div style={{ border: '0.5px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
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
                <tr><td colSpan={8} style={{ padding: '32px', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#aaa', textAlign: 'center' }}>Loading recent realisations...</td></tr>
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
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px', background: sale.sale_condition?.toLowerCase().includes('mint') ? '#e8f4e8' : '#fdf0e0', color: sale.sale_condition?.toLowerCase().includes('mint') ? '#1a5c1a' : '#7a3d00' }}>
                        {sale.sale_condition || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '11px 14px', fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: '600', color: '#293451', whiteSpace: 'nowrap' }}>{'£' + parseFloat(sale.sale_price).toLocaleString('en-GB')}</td>
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

      {/* ── Upcoming auctions strip ───────────────────────────────────── */}
      <div style={{ background: '#293451', padding: '32px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Upcoming Stanley Gibbons auctions</div>
        <a href="https://sgbaldwins.com/auctions/upcoming-auctions" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#a3925f', textDecoration: 'none', padding: '9px 20px', border: '1px solid #a3925f', borderRadius: '5px', letterSpacing: '0.04em' }}>
          View upcoming auctions →
        </a>
      </div>

    </div>
  )
}