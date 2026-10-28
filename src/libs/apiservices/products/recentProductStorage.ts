const key = 'momo.recent-products.v1';

export function readRecentProductIds(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string' && id.length > 0) : [];
  } catch { return []; }
}

export function writeRecentProductIds(ids: string[]): void {
  try { localStorage.setItem(key, JSON.stringify(ids)); } catch { /* Browsing still works when storage is disabled. */ }
}
