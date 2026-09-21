export interface FinancialSummary {
  /** Listed price amount as a number, not a formatted dollar string. */
  askingPrice: number;

  /** Currency code for askingPrice, such as USD. */
  currency: string;

  /** Optional projected IRR as a percent (12.5 means 12.5%). */
  projectedIrrPercent?: number;

  /** Optional cap rate as a percent (5.8 means 5.8%). */
  capRatePercent?: number;
}
