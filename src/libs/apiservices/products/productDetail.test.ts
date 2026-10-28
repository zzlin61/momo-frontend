import { describe, expect, it, vi } from 'vitest';
import { createMockProductRepository } from './mockProductRepository';

describe('product detail repository', () => {
  it('loads detail by stable id and reference product code', async () => {
    const repository = createMockProductRepository();
    const detail = await repository.getById('15745582');
    expect(detail?.id).toBe('demo-asics-01');
    expect(detail?.name).toBe('輕量跑鞋');
    expect(detail?.price).toBe(2490);
    expect(detail?.colors.length).toBeGreaterThan(0);
    expect(detail).toEqual(await repository.getById('demo-asics-01'));
  });
  it('returns null for an unknown product', async () => {
    await expect(createMockProductRepository().getById('missing')).resolves.toBeNull();
  });
  it('does not expose mutable nested fixture data', async () => {
    const repository = createMockProductRepository();
    const original = await repository.getById('15745582');
    const detail = await repository.getById('15745582');
    if (!detail) throw new Error('Missing demo detail');
    detail.colors[0].sizes[0].available = false;
    detail.features.push('changed');
    detail.specifications[0].value = 'changed';
    expect(await repository.getById('15745582')).toEqual(original);
  });
  it('rejects when configured to fail', async () => {
    await expect(createMockProductRepository({ error: new Error('offline') }).getById('15745582')).rejects.toThrow('offline');
  });
  it('keeps detail requests pending for the configured delay', async () => {
    vi.useFakeTimers();
    try {
      let settled = false;
      const pending = createMockProductRepository({ delayMs: 50 }).getById('15745582').then(result => { settled = true; return result; });
      await vi.advanceTimersByTimeAsync(49);
      expect(settled).toBe(false);
      await vi.advanceTimersByTimeAsync(1);
      expect((await pending)?.id).toBe('demo-asics-01');
    } finally { vi.useRealTimers(); }
  });
});
