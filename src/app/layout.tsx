import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FamaLink - Télésanté pour l\'Afrique',
  description: 'Plateforme de téléconsultation et gestion médicale adaptée aux besoins africains',
  keywords: ['télésanté', 'télémédecine', 'Afrique', 'consultation', 'médecin'],
  authors: [{ name: 'FamaLink Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <div id="root" className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}