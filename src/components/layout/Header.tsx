import type { ReactNode } from 'react'

export function Header({
  title = 'Investor Dashboard',
  children,
}: {
  title?: string
  children?: ReactNode
}) {
  return (
    <header className="dashboard-header">
      <h1 className="header-title">{title}</h1>
      <div className="header-actions">{children}</div>
    </header>
  )
}
