import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LoadingProvider } from '@/components/providers/loading-provider'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/components/providers/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FamaLink - Télémédecine pour l\'Afrique',
  description: 'Plateforme de télémédecine pour connecter médecins et patients en Afrique',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <AuthProvider>
          <LoadingProvider>
            {children}
            <Toaster />
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  )
}