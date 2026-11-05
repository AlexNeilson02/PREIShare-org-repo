export interface Ownership {
  /** Person or entity name. */
  ownerName: string;

  /** Optional ownership share as a percent (0–100). */
  ownershipPercent?: number;

  /** Optional free text about splits or co-owners. */
  notes?: string;
}
