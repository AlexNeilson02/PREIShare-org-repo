import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { navItems } from './navConfig'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const menuLabel = open ? 'Close menu' : 'Open menu'

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={menuLabel}
        aria-expanded={open}
        aria-controls="mobile-dashboard-menu"
        onClick={() => setOpen((current) => !current)}
        className="rounded-md border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-2 text-sm font-semibold text-[var(--sea-ink)]"
      >
        {menuLabel}
      </button>
      {open ? (
        <nav id="mobile-dashboard-menu" aria-label="Dashboard" className="mt-2">
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-semibold text-[var(--sea-ink-soft)] no-underline hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  )
}
