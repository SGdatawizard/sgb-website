import './globals.css'

export const metadata = {
  title: 'Stanley Gibbons Vision',
  description: 'The world\'s most comprehensive philatelic catalogue',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GlobalHeader />
        <main style={{ minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>
      </body>
    </html>
  )
}

function GlobalHeader() {
  // The landing page (/) renders its own minimal header and handles its own full-height hero.
  // We use a client component to conditionally hide the global nav on that route.
  return <HeaderClient />
}

// We need a client component to read the pathname
import HeaderClient from './HeaderClient'
