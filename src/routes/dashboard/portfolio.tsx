import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/portfolio')({ component: PortfolioPage })

function PortfolioPage() {
  return (
    <main>
      <h1>Portfolio</h1>
      <p>Mock placeholder: holdings table will go here.</p>
    </main>
  )
}
