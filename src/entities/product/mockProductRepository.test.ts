import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMockProductRepository } from './mockProductRepository';

afterEach(() => vi.useRealTimers());

describe('mock product repository', () => {
  it('finds seeded asics products', async () => {
    const results = await createMockProductRepository().search('asics');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(product => product.brand === 'ASICS')).toBe(true);
  });
  it('does not fuzzy match ascis', async () => {
    await expect(createMockProductRepository().search('ascis')).resolves.toEqual([]);
  });
  it('trims and matches case-insensitively', async () => {
    const repository = createMockProductRepository();
    expect(await repository.search('  AsIcS  ')).toEqual(await repository.search('asics'));
  });
  it.each(['', '   '])('returns no results for blank query %j', async query => {
    await expect(createMockProductRepository().search(query)).resolves.toEqual([]);
  });
  it.each(['輕量跑鞋', '日常訓練', 'new balance'])('matches name, tag, or brand: %s', async query => {
    expect((await createMockProductRepository().search(query)).length).toBeGreaterThan(0);
  });
  it('returns featured products with unique stable IDs and valid prices', async () => {
    const repository = createMockProductRepository();
    const products = await repository.listFeatured();
    expect(products.length).toBeGreaterThan(0);
    expect(new Set(products.map(product => product.id)).size).toBe(products.length);
    expect(products.every(product => product.id.length > 0 && product.price > 0)).toBe(true);
    expect(await repository.listFeatured()).toEqual(products);
  });
  it('does not let callers mutate future results', async () => {
    const repository = createMockProductRepository();
    const products = await repository.listFeatured();
    const original = await repository.listFeatured();
    products[0].name = 'changed';
    products[0].tags?.push('changed');
    products.splice(1);
    expect(await repository.listFeatured()).toEqual(original);
  });
  it('keeps operations pending until the configured delay', async () => {
    vi.useFakeTimers();
    const repository = createMockProductRepository({ delayMs: 50 });
    let settled = false;
    const pending = repository.search('asics').then(results => { settled = true; return results; });
    await vi.advanceTimersByTimeAsync(49);
    expect(settled).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect((await pending).length).toBeGreaterThan(0);
  });
  it('rejects both operations with a configured error', async () => {
    const error = new Error('Mock unavailable');
    const repository = createMockProductRepository({ error });
    await expect(repository.search('asics')).rejects.toBe(error);
    await expect(repository.listFeatured()).rejects.toBe(error);
  });
});
