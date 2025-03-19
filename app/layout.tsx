import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tintern | Change How You Think About Applications',
  description: 'Spend less time searching for jobs with Tintern. Our easy swiping mechanism saves you 30 hours a week.',
  keywords: 'job search, application, career, employment, tintern',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}