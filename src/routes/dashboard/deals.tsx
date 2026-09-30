import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/deals')({ component: DealsPage })

function DealsPage() {
  return (
    <section>
      <h1>Deals</h1>
      <p>Mock placeholder: open deals list will go here.</p>
    </section>
  )
}
