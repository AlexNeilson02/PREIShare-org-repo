import type { ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { getPageTitle } from './navConfig'

export function Header({
  children,
  navOpen = false,
  onToggleNav,
}: {
  title?: string
  children?: ReactNode
  navOpen?: boolean
  onToggleNav?: () => void
}) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <header className="dashboard-header dash-header">
      {onToggleNav ? (
        <button
          type="button"
          className="dash-menu-toggle md:hidden"
          aria-label="Open navigation"
          aria-expanded={navOpen}
          aria-controls="dashboard-sidebar"
          onClick={onToggleNav}
        >
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z" />
          </svg>
        </button>
      ) : null}
      <h1 className="header-title">{getPageTitle(pathname)}</h1>
      <div className="header-actions">{children}</div>
    </header>
  )
}
