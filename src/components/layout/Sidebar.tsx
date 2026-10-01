import type { ReactNode } from 'react'
import { NavItems } from './NavItems'

export function Sidebar({
  brandLabel = 'PREIshare',
  children,
}: {
  brandLabel?: string
  children?: ReactNode
}) {
  return (
    <aside aria-label="Investor navigation" className="dashboard-sidebar p-4 md:w-64">
      <div className="sidebar-brand">{brandLabel}</div>
      <NavItems />
      {children}
    </aside>
  )
}
