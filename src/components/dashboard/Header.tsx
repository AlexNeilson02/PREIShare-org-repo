import type { ReactNode } from 'react'

export type HeaderProps = {
  title?: string
  actions?: ReactNode
}

export function Header({ title = 'Dashboard', actions }: HeaderProps) {
  return (
    <header
      role="banner"
      className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 py-4 backdrop-blur-lg"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--chip-line)] bg-[var(--chip-bg)] text-sm font-bold text-[var(--lagoon-deep)] shadow-[0_8px_24px_rgba(30,90,72,0.08)]"
        >
          P
        </span>
        <div>
          <p className="island-kicker m-0">PREIshare</p>
          <p className="m-0 text-base font-semibold tracking-tight text-[var(--sea-ink)]">
            {title}
          </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {actions}
        {/* Static signed-in label only — this is not real auth. */}
        <div
          aria-label="Signed-in user placeholder"
          className="flex items-center gap-2 text-sm text-[var(--sea-ink)]"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--chip-line)] bg-[var(--chip-bg)] text-xs font-bold text-[var(--lagoon-deep)]">
            IN
          </span>
          <span className="font-semibold">Investor</span>
        </div>
      </div>
    </header>
  )
}
