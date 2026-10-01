export type InvestorProfile = {
  displayName: string
  email: string
  membershipTier: string
  preferredContact: string
  notes: string
}

export type ProfileCardProps = {
  profile?: InvestorProfile
  isSampleData?: boolean
}

const MOCK_PROFILE: InvestorProfile = {
  displayName: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  membershipTier: 'Preferred investor',
  preferredContact: 'Email',
  notes: 'Interested in multifamily and industrial deals in the Southeast.',
}

function isEmptyProfile(profile: InvestorProfile): boolean {
  return (
    profile.displayName.trim() === '' &&
    profile.email.trim() === '' &&
    profile.membershipTier.trim() === '' &&
    profile.preferredContact.trim() === '' &&
    profile.notes.trim() === ''
  )
}

export function ProfileCard({
  profile = MOCK_PROFILE,
  isSampleData = true,
}: ProfileCardProps) {
  return (
    <section
      className="dashboard-panel profile-card island-shell rounded-2xl p-5"
      aria-labelledby="investor-profile-heading"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h2
          id="investor-profile-heading"
          className="display-title m-0 text-xl font-bold tracking-tight text-[var(--sea-ink)]"
        >
          Your profile
        </h2>
        {isSampleData ? (
          <p className="sample-data-banner demo-pill m-0" role="note">
            Sample profile — placeholder details, not a live account
          </p>
        ) : null}
      </div>

      {isEmptyProfile(profile) ? (
        <p className="empty-state m-0 text-sm text-[var(--sea-ink-soft)]">
          No profile details to show yet.
        </p>
      ) : (
        <dl className="m-0 grid gap-3">
          <div className="demo-list-item">
            <dt className="island-kicker">Name</dt>
            <dd className="m-0 mt-1 font-semibold text-[var(--sea-ink)]">
              {profile.displayName}
            </dd>
          </div>
          <div className="demo-list-item">
            <dt className="island-kicker">Email</dt>
            <dd className="m-0 mt-1 font-semibold text-[var(--sea-ink)]">
              {profile.email}
            </dd>
          </div>
          <div className="demo-list-item">
            <dt className="island-kicker">Membership</dt>
            <dd className="m-0 mt-1 font-semibold text-[var(--sea-ink)]">
              {profile.membershipTier}
            </dd>
          </div>
          <div className="demo-list-item">
            <dt className="island-kicker">Preferred contact</dt>
            <dd className="m-0 mt-1 font-semibold text-[var(--sea-ink)]">
              {profile.preferredContact}
            </dd>
          </div>
          <div className="demo-list-item">
            <dt className="island-kicker">Notes</dt>
            <dd className="m-0 mt-1 font-semibold text-[var(--sea-ink)]">
              {profile.notes}
            </dd>
          </div>
        </dl>
      )}
    </section>
  )
}
