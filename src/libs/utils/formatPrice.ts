const priceFormatter = new Intl.NumberFormat('zh-TW');

// Numeric portion only: ProductCard owns the existing dollar symbol and aria text.
export function formatPrice(amount: number): string {
  return priceFormatter.format(amount);
}
