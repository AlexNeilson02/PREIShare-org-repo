// Renders nav links from navConfig and marks the active route.

import { Link } from '@tanstack/react-router'
import { dashboardNavItems } from './navConfig'

export function NavItems() {
  return (
    <nav aria-label="Dashboard" className="sidebar-nav">
      <ul className="nav-list m-0 flex list-none flex-col gap-1 p-0">
        {dashboardNavItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className="nav-link px-3 py-2 text-sm font-semibold"
              activeProps={{
                className: 'nav-link is-active px-3 py-2 text-sm font-semibold',
                'aria-current': 'page',
              }}
              activeOptions={{ exact: item.path === '/dashboard' }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
