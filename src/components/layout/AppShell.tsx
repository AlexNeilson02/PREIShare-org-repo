import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function AppShell({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <div className="app-shell flex flex-col md:flex-row">
      <Sidebar />
      <div className="app-shell-main-column">
        <Header title={title} />
        <main id="main-content" className="app-shell-content p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
