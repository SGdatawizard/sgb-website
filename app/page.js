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
            <Link key={label} href={href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 500, color: '#333', padding: '6px 10px' }}>{label}</Link
