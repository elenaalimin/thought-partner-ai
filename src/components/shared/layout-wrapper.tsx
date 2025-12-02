'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from './sidebar'
import { cn } from '@/lib/utils'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')
  const isWelcomePage = pathname === '/welcome'
  const shouldShowSidebar = !isAuthPage && !isWelcomePage
  
  return (
    <div className="flex min-h-screen">
      {shouldShowSidebar && <Sidebar />}
      <main className={cn("flex-1", shouldShowSidebar && "ml-64")}>
        {children}
      </main>
    </div>
  )
}

