import { Montserrat, Libre_Baskerville, Open_Sans } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat'
})
const libreBaskerville = Libre_Baskerville({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-libre'
})
const openSans = Open_Sans({ 
  subsets: ['latin'],
  variable: '--font-opensans'
})

export const metadata = {
  title: 'Stanley Gibbons Baldwin\'s',
  description: 'The home of stamps, coins and collectibles',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${libreBaskerville.variable} ${openSans.variable}`}>
        {children}
      </body>
    </html>
  )
}
