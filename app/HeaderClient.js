'use client'

import { usePathname } from 'next/navigation'

export default function HeaderClient() {
  const pathname = usePathname()

  // Hide the global nav on the landing page — it has its own minimal header
  if (pathname === '/') return null

  return (
    <header style={{
      background: '#293451',
      padding: '0 32px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
    }}>
      <div style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: '600',
        fontSize: '18px',
        color: '#fff',
        letterSpacing: '0.02em',
        flexShrink: 0,
      }}>
        SG
        <span style={{ color: '#a3925f', marginLeft: '8px', fontWeight: '400' }}>
          Vision
        </span>
      </div>

      <nav style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '32px',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '13px',
        fontWeight: '600',
      }}>
        {['/home', '/catalogue', '/sgb100', '/community', '/account'].map((href, i) => (
          <a key={href} href={href} style={{
            color: 'rgba(255,255,255,0.8)',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            fontSize: '12px',
          }}>
            {['Home', 'Catalogue', 'SGB 100', 'Community', 'Account'][i]}
          </a>
        ))}
      </nav>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
        <a href="/account" style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '12px',
          fontWeight: '600',
          color: 'rgba(255,255,255,0.8)',
          textDecoration: 'none',
          padding: '7px 16px',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '5px',
          letterSpacing: '0.04em',
        }}>
          Sign in
        </a>
        <a href="/account" style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '12px',
          fontWeight: '600',
          color: '#fff',
          textDecoration: 'none',
          padding: '7px 16px',
          background: '#a3925f',
          borderRadius: '5px',
          letterSpacing: '0.04em',
        }}>
          Subscribe
        </a>
      </div>
    </header>
  )
}
