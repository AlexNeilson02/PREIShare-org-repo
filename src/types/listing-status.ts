// Closed set of lifecycle states from the field inventory.
// Only these exact strings are allowed—no free text.
export type ListingStatus =
  | 'draft'
  | 'published'
  | 'under_offer'
  | 'sold'
  | 'archived';
