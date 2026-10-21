import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { createBrowserSupabaseClient } from '../../lib/supabase/client'

export const Route = createFileRoute('/auth/signup')({
  component: SignupPage,
})

function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    try {
      const supabase = createBrowserSupabaseClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      await navigate({ to: '/dashboard' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign up.')
    }
  }

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell mx-auto max-w-md rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Account</p>
        <h1 className="display-title mb-6 text-3xl font-bold text-[var(--sea-ink)]">
          Sign up
        </h1>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]">
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 font-normal text-[var(--sea-ink)]"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]">
            Password
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 font-normal text-[var(--sea-ink)]"
              required
            />
          </label>
          <p
            role="alert"
            className="min-h-6 text-sm text-[var(--palm)]"
          >
            {error}
          </p>
          <button
            type="submit"
            className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)]"
          >
            Sign up
          </button>
        </form>
      </section>
    </main>
  )
}
