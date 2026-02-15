'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'
import PageTransition from './ui/PageTransition'
import Footer from './Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboardRoute = pathname?.startsWith('/dashboard')

  if (isDashboardRoute) {
    return (
      <PageTransition>
        {children}
      </PageTransition>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className={`flex-grow ${pathname === '/faq' ? '' : 'pt-20'}`}>
        <PageTransition>
          {children}
        </PageTransition>
      </div>
      <Footer />
    </div>
  )
}


