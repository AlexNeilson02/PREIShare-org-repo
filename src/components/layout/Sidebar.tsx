import type { ReactNode } from 'react'

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
      <nav className="sidebar-nav">
        <ul>
          <li>
            <a href="/dashboard">Home</a>
          </li>
          <li>
            <a href="/dashboard/portfolio">Portfolio</a>
          </li>
          <li>
            <a href="/dashboard/deals">Deals</a>
          </li>
          <li>
            <a href="/dashboard/profile">Profile</a>
          </li>
        </ul>
      </nav>
      {children}
    </aside>
  )
}
