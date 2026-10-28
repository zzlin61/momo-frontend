import { expect, it } from 'vitest';
import { recordRecentProduct, selectRecommendations } from './productDiscoveryRules';
import type { Product } from './productModel';

it('keeps eight unique ids ordered by latest successful visit', () => {
  expect(recordRecentProduct(['b', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'], 'a'))
    .toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
});
it('promotes the same brand while preserving candidate order and excluding self and duplicates', () => {
  const item = (id: string, brand = 'other'): Product => ({ id, brand, name: id, price: 100 });
  expect(selectRecommendations([
    item('b'), item('c', 'same'), item('self', 'same'), item('d'), item('e', 'same'), item('c', 'same'), item('f'),
  ], item('self', 'same')).map(product => product.id)).toEqual(['c', 'e', 'b', 'd']);
});
