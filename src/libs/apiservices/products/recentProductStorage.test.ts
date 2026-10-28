import { afterEach, expect, it, vi } from 'vitest';
import { readRecentProductIds, writeRecentProductIds } from './recentProductStorage';
afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
it('ignores corrupt and invalid stored data', () => {
  localStorage.setItem('momo.recent-products.v1', '{');
  expect(readRecentProductIds()).toEqual([]);
  localStorage.setItem('momo.recent-products.v1', JSON.stringify(['a', null, 4, '', 'b']));
  expect(readRecentProductIds()).toEqual(['a', 'b']);
});
it('survives blocked browser storage for both reads and writes', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
  expect(readRecentProductIds()).toEqual([]);
  expect(() => writeRecentProductIds(['a'])).not.toThrow();
});
