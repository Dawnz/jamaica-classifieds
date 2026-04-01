import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import Providers from './providers'
import './globals.css'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', weight: ['700','900'] })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['400','500','600'] })

export const metadata: Metadata = {
  title: "Jamaica Classifieds — Buy, Sell & Trade in Jamaica",
  description: "Jamaica's #1 classifieds marketplace. Buy and sell across all 14 parishes.",
  keywords: "Jamaica classifieds, buy sell Jamaica, Jamaica ads, real estate Jamaica, cars Jamaica",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
