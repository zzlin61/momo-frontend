import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, expect, it } from 'vitest';
import { createMockProductRepository } from '../../libs/apiservices/products/mockProductRepository';
import { ProductDiscovery } from './ProductDiscovery';
import { StrictMode } from 'react';

afterEach(() => { cleanup(); localStorage.clear(); });
it('keeps the first visit empty, records canonical ids and restores history after remount', async () => {
  const repository = createMockProductRepository();
  const products = await repository.listFeatured();
  const first = (await repository.getById(products[0].id))!;
  const second = (await repository.getById(products[1].id))!;
  const view = render(<MemoryRouter><ProductDiscovery product={first} repository={repository} /></MemoryRouter>);
  expect(within(screen.getByRole('region', { name: '瀏覽紀錄' })).getByText('尚無其他瀏覽紀錄')).toBeTruthy();
  await screen.findAllByRole('article');
  expect(JSON.parse(localStorage.getItem('momo.recent-products.v1')!)).toEqual([first.id]);
  view.unmount();
  render(<MemoryRouter><ProductDiscovery product={second} repository={repository} /></MemoryRouter>);
  const history = screen.getByRole('region', { name: '瀏覽紀錄' });
  expect(await within(history).findByRole('article', { name: first.brand + ' ' + first.name })).toBeTruthy();
  expect(JSON.parse(localStorage.getItem('momo.recent-products.v1')!)).toEqual([second.id, first.id]);
  fireEvent.click(within(history).getByRole('button', { name: '清除瀏覽紀錄' }));
  expect(within(history).getByText('尚無其他瀏覽紀錄')).toBeTruthy();
  expect(JSON.parse(localStorage.getItem('momo.recent-products.v1')!)).toEqual([]);
});
it('isolates recommendation errors and retries without losing detail or history', async () => {
  const base = createMockProductRepository();
  const product = (await base.getById('15745582'))!;
  let fail = true;
  const repository = { ...base, listFeatured: () => fail ? Promise.reject(new Error('offline')) : base.listFeatured() };
  render(<MemoryRouter><ProductDiscovery product={product} repository={repository} /></MemoryRouter>);
  expect(await screen.findByRole('alert')).toBeTruthy();
  fail = false;
  fireEvent.click(screen.getByRole('button', { name: '重新載入推薦' }));
  const recommendations = screen.getByRole('region', { name: '商品推薦' });
  expect((await within(recommendations).findAllByRole('article')).length).toBeLessThanOrEqual(4);
  expect(within(recommendations).queryByRole('article', { name: product.brand + ' ' + product.name })).toBeNull();
});
it('shares strict-mode requests and ignores missing historical products', async () => {
  const base = createMockProductRepository();
  const product = (await base.getById('15745582'))!;
  localStorage.setItem('momo.recent-products.v1', JSON.stringify(['missing']));
  let featuredCalls = 0;
  let historyCalls = 0;
  const repository = { ...base,
    listFeatured: () => { featuredCalls++; return base.listFeatured(); },
    getById: (id: string) => { historyCalls++; return base.getById(id); },
  };
  render(<StrictMode><MemoryRouter><ProductDiscovery product={product} repository={repository} /></MemoryRouter></StrictMode>);
  await screen.findAllByRole('article');
  expect(await within(screen.getByRole('region', { name: '瀏覽紀錄' })).findByText('尚無其他瀏覽紀錄')).toBeTruthy();
  expect(featuredCalls).toBe(1);
  expect(historyCalls).toBe(1);
});
it('does not restore a history request that completes after clearing', async () => {
  const base = createMockProductRepository();
  const candidates = await base.listFeatured();
  const product = (await base.getById(candidates[0].id))!;
  const previous = (await base.getById(candidates[1].id))!;
  localStorage.setItem('momo.recent-products.v1', JSON.stringify([previous.id]));
  let complete!: (value: typeof previous) => void;
  const repository = { ...base, getById: () => new Promise<typeof previous>(resolve => { complete = resolve; }) };
  render(<MemoryRouter><ProductDiscovery product={product} repository={repository} /></MemoryRouter>);
  await screen.findAllByRole('article');
  const history = screen.getByRole('region', { name: '瀏覽紀錄' });
  fireEvent.click(within(history).getByRole('button', { name: '清除瀏覽紀錄' }));
  complete(previous);
  expect(await within(history).findByText('尚無其他瀏覽紀錄')).toBeTruthy();
  expect(within(history).queryByRole('article')).toBeNull();
});
