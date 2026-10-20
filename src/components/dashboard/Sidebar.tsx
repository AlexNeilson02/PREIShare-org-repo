import { Link } from '@tanstack/react-router'
import { navItems } from './navConfig'

export function Sidebar() {
  return (
    <nav aria-label="Dashboard" className="hidden md:block">
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {navItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="block rounded-md px-3 py-2 text-sm font-semibold text-[var(--sea-ink-soft)] no-underline hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
