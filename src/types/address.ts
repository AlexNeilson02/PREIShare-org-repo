export interface Address {
  /** Street number and name. */
  line1: string;

  /** Unit or suite, if any. */
  line2?: string;

  /** City. */
  city: string;

  /** State, province, or region. */
  region: string;

  /** Postal code as text, not a number. */
  postalCode: string;

  /** Country code or name. */
  country: string;
}
