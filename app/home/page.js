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

      {/* ── Account sections — Option A alternating full-width strips ── */}

      {/* My Collection */}
      <a href="/account" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '380px', textDecoration: 'none' }}>
        <div style={{ background: '#1a3a2e', padding: '40px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#a3925f', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>My Collection</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '48px', fontWeight: '600', color: '#fff', lineHeight: '1', marginBottom: '6px' }}>41</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '14px' }}>items catalogued · £12,450 total value</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.75', maxWidth: '440px' }}>Track catalogue values, record what you paid, and organise your entire collection by country and series. See what's appreciating and what isn't.</div>
          </div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.04em', marginTop: '24px' }}>View collection →</div>
        </div>
        <div style={{ position: 'relative', overflow: 'hidden', height: '380px' }}>
          <img src="https://ambzwvkbxpkjuwmjnvgj.supabase.co/storage/v1/object/public/homepage-images/21.webp" alt="Stamp collection" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      </a>

      {/* Wishlist */}
      <a href="/account" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '380px', textDecoration: 'none' }}>
        <div style={{ position: 'relative', overflow: 'hidden', height: '380px' }}>
          <img src="https://ambzwvkbxpkjuwmjnvgj.supabase.co/storage/v1/object/public/homepage-images/16.webp" alt="Stamps on wishlist" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{ background: '#7a1a2e', padding: '40px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Wishlist</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '48px', fontWeight: '600', color: '#fff', lineHeight: '1', marginBottom: '6px' }}>12</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '14px' }}>stamps wanted · £8,200 catalogue value</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.75', maxWidth: '440px' }}>Stamps you want but don't yet own. Flag anything from the catalogue and track how values move over time while you wait for the right copy.</div>
          </div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em', marginTop: '24px' }}>View wishlist →</div>
        </div>
      </a>

      {/* SGB 100 */}
      <a href="/sgb100" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '380px', textDecoration: 'none' }}>
        <div style={{ background: '#0a0e1a', padding: '40px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#a3925f', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>SGB 100</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '30px', fontWeight: '600', color: '#fff', lineHeight: '1.2', marginBottom: '10px' }}>Performance index</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '14px' }}>Base 1,000 · 2005</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.75', maxWidth: '440px' }}>The 100 best-performing stamps by catalogue value appreciation since 2005. A performance index built on 170 years of Stanley Gibbons data.</div>
          </div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.04em', marginTop: '24px' }}>View index →</div>
        </div>
        <div style={{ position: 'relative', overflow: 'hidden', height: '380px' }}>
          <img src="https://ambzwvkbxpkjuwmjnvgj.supabase.co/storage/v1/object/public/homepage-images/3.webp" alt="Rare stamps" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      </a>

      {/* Budget + Looking to sell + Community — three compact cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0' }}>
        <a href="/account" style={{ background: '#fff', borderTop: '0.5px solid #eee', borderRight: '0.5px solid #eee', padding: '20px 28px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Budget tracker</div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '600', color: '#293451' }}>£142.50</div>
          <div style={{ height: '3px', background: '#eee', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '29%', background: '#293451', borderRadius: '2px' }} />
          </div>
          <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#666', lineHeight: '1.6', flex: 1 }}>Set a monthly spending limit and track every purchase against it.</div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451', letterSpacing: '0.04em' }}>View budget →</div>
        </a>
        <a href="/account" style={{ background: '#f5f5f3', borderTop: '0.5px solid #eee', borderRight: '0.5px solid #eee', padding: '20px 28px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Looking to sell</div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '600', color: '#293451' }}>Flagged items</div>
          <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#666', lineHeight: '1.6', flex: 1 }}>Mark stamps you'd consider selling. Reach £500 catalogue value and request a free expert valuation.</div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451', letterSpacing: '0.04em' }}>View flagged →</div>
        </a>
        <a href="/community" style={{ background: '#f5f5f3', borderTop: '0.5px solid #eee', padding: '20px 28px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Community</div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '600', color: '#293451' }}>Discussions</div>
          <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#666', lineHeight: '1.6', flex: 1 }}>Share finds, ask questions and connect with collectors and dealers from around the world.</div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451', letterSpacing: '0.04em' }}>Go to community →</div>
        </a>
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