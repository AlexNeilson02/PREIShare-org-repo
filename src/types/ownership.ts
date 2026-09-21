export type OwnershipRelationship =
  | 'primary_owner'
  | 'co_owner'
  | 'broker'
  | 'property_manager';

export interface Ownership {
  /** Which contact this row refers to (name or id). */
  contactNameOrId: string;

  /** Relationship to the asset. */
  relationship: OwnershipRelationship;

  /** Optional ownership share as a percent (60 means 60%). */
  sharePercent?: number;
}
