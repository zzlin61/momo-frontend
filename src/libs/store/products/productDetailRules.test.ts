import { describe, expect, it } from 'vitest';
import { validateProductSelection } from './productDetailRules';
import { createMockProductRepository } from '../../apiservices/products/mockProductRepository';

describe('product selection rules', () => {
  it('rejects missing or unavailable options and invalid quantities', async () => {
    const product = await createMockProductRepository().getById('15745582');
    if (!product) throw new Error('Missing fixture');
    for (const selection of [
      { colorId: 'missing', size: '26', quantity: 1 },
      { colorId: 'graphite', size: '', quantity: 1 },
      { colorId: 'chalk', size: '23.5', quantity: 1 },
      ...[0, 6, 1.5, NaN].map(quantity => ({ colorId: 'graphite', size: '26', quantity })),
    ]) expect(validateProductSelection(product, selection).valid).toBe(false);
    expect(validateProductSelection(product, { colorId: 'graphite', size: '26', quantity: 2 })).toMatchObject({ valid: true, total: 4980 });
  });
});
