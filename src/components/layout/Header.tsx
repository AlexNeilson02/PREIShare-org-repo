import type { ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { getPageTitle } from './navConfig'

export function Header({
  children,
}: {
  title?: string
  children?: ReactNode
}) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <header className="dashboard-header">
      <h1 className="header-title">{getPageTitle(pathname)}</h1>
      <div className="header-actions">{children}</div>
    </header>
  )
}
