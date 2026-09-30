import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/profile')({ component: ProfilePage })

function ProfilePage() {
  return (
    <section>
      <h1>Profile</h1>
      <p>Mock placeholder: member name and contact details will go here.</p>
    </section>
  )
}
