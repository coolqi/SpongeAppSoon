/**
 * Format money number to currency.
 *
 * @param input - Input raw money number
 * @returns Formatted money in AUD currency
 */
export const currencyFormatter = Intl.NumberFormat('en-AU', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 4,
});

export function formatAmount(input: number): string {
  return currencyFormatter.format(input);
}