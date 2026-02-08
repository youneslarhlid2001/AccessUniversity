import type { Metadata } from 'next'
import './globals.css'
import PublicLayout from '@/components/PublicLayout'

export const metadata: Metadata = {
  title: 'AccèsUniversity - Votre accompagnement vers l\'excellence',
  description: 'Plateforme d\'accompagnement pour trouver votre école idéale',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <PublicLayout>
          {children}
        </PublicLayout>
      </body>
    </html>
  )
}

