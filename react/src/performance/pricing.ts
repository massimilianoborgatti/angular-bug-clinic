export type Period = 'monthly' | 'annual';
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
export function projectPrices(period: Period, fixed: boolean) {
  // The table represents the same 4,000 workspace estimates in both versions.
  // The legacy export formats five billing columns before selecting one visible price.
  const amounts = Array.from(
    { length: 4000 },
    (_, index) => (8 + (index % 24)) * (period === 'annual' ? 0.75 : 1),
  );
  if (fixed) return { price: formatter.format(amounts[0]), estimates: amounts.length };
  const rows = amounts.map((amount) => {
    const columns = [amount, amount * 12, amount / 5, amount * 3, amount / 4].map((value) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value),
    );
    return columns[0];
  });
  return { price: rows[0], estimates: rows.length };
}
