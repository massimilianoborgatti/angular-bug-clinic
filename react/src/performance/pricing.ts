export type Period = 'monthly' | 'annual';
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
export function projectPrices(period: Period, fixed: boolean) {
  // The table represents the same 4,000 workspace estimates in both versions.
  // Broken reconstructs the locale formatter for every row on every interaction.
  const amounts = Array.from(
    { length: 4000 },
    (_, index) => (8 + (index % 24)) * (period === 'annual' ? 0.75 : 1),
  );
  if (fixed) return { price: formatter.format(amounts[0]), estimates: amounts.length };
  const rows = amounts.map((amount) => {
    const money = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
    return money.format(amount);
  });
  return { price: rows[0], estimates: rows.length };
}
