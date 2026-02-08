'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'
import PageTransition from './ui/PageTransition'

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
    <>
      <Navigation />
      <div className={pathname === '/faq' ? '' : 'pt-20'}>
        <PageTransition>
          {children}
        </PageTransition>
      </div>
    </>
  )
}


