export type ContactRole = 'broker' | 'owner_rep';

interface InvestorContactBase {
  /** Stable unique id for this contact. */
  id: string;

  /** Person or firm name. */
  name: string;

  /** Why this contact appears on the listing: broker or owner_rep. */
  role: ContactRole;
}

/**
 * A listing contact with a name, role, and at least one reachable channel.
 * Either email or phone is required; the other may be omitted. Both may be present.
 */
export type InvestorContact =
  | (InvestorContactBase & { email: string; phone?: string })
  | (InvestorContactBase & { phone: string; email?: string });
