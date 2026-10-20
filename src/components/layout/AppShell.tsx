import { useEffect, useState, type ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function AppShell({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) {
  const [navOpen, setNavOpen] = useState(false)
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  return (
    <div
      className={`app-shell dash-shell flex flex-col md:flex-row${navOpen ? ' nav-open' : ''}`}
    >
      <Sidebar />
      <div className="app-shell-main-column dash-main">
        <Header
          title={title}
          navOpen={navOpen}
          onToggleNav={() => setNavOpen((open) => !open)}
        />
        <main id="main-content" className="app-shell-content dash-content p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
