import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { createMockProductRepository } from '../libs/apiservices/products/mockProductRepository';
import type { Product } from '../libs/store/products/productModel';
import type { ProductRepository } from '../libs/store/products/productModel';

afterEach(cleanup);
function open(path = '/', repository = createMockProductRepository()) {
  return render(<MemoryRouter initialEntries={[path]}><App repository={repository} /></MemoryRouter>);
}

describe('storefront', () => {
  it('renders home and featured products', async () => {
    open();
    expect(screen.getByRole('heading', { name: /把喜歡的生活/ })).toBeTruthy();
    expect(await screen.findByText('輕量跑鞋')).toBeTruthy();
  });
  it('submits a trimmed search and restores its value from the URL', async () => {
    open();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '  asics  ' } });
    fireEvent.submit(screen.getByRole('search'));
    expect(await screen.findByRole('heading', { name: 'asics' })).toBeTruthy();
    expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('asics');
    expect(await screen.findByText('輕量跑鞋')).toBeTruthy();
    expect(screen.queryByText('休閒步行鞋')).toBeNull();
  });
  it('does not navigate for blank input or IME composition', () => {
    open();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '   ' } });
    fireEvent.submit(screen.getByRole('search'));
    expect(screen.getByRole('heading', { name: /把喜歡的生活/ })).toBeTruthy();
    fireEvent.compositionStart(screen.getByRole('searchbox'));
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '鞋' } });
    fireEvent.submit(screen.getByRole('search'));
    expect(screen.getByRole('heading', { name: /把喜歡的生活/ })).toBeTruthy();
  });
  it('shows empty results for ascis and offers a working suggestion', async () => {
    open('/search/ascis');
    expect(await screen.findByText('找不到符合「ascis」的商品')).toBeTruthy();
    fireEvent.click(screen.getByRole('link', { name: '試試 asics' }));
    expect(await screen.findByText('輕量跑鞋')).toBeTruthy();
  });
  it('clears a committed query and returns focus to the field', async () => {
    open('/search/asics');
    fireEvent.click(screen.getByRole('button', { name: '清除搜尋' }));
    expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('');
    expect(document.activeElement).toBe(screen.getByRole('searchbox'));
    expect(await screen.findByRole('heading', { name: /把喜歡的生活/ })).toBeTruthy();
  });
  it('uses decoded keyword and ignores legacy query parameters', async () => {
    open('/search/%E8%BC%95%E9%87%8F%E8%B7%91%E9%9E%8B?_isFuzzy=0&searchType=1');
    expect(screen.getByRole('heading', { name: '輕量跑鞋' })).toBeTruthy();
    expect(await screen.findByRole('article', { name: 'ASICS 輕量跑鞋' })).toBeTruthy();
  });
  it('shows loading then results', async () => {
    open('/search/asics', createMockProductRepository({ delayMs: 30 }));
    expect(screen.getByRole('status').textContent).toContain('正在尋找');
    expect(await screen.findByText('輕量跑鞋')).toBeTruthy();
  });
  it('shows an error and allows retry', async () => {
    let fail = true;
    const base = createMockProductRepository();
    const repository: ProductRepository = {
      ...base,
      search: query => fail ? Promise.reject(new Error('offline')) : base.search(query),
    };
    open('/search/asics', repository);
    expect(await screen.findByRole('alert')).toBeTruthy();
    fail = false;
    fireEvent.click(screen.getByRole('button', { name: '重新載入' }));
    expect(await screen.findByText('輕量跑鞋')).toBeTruthy();
  });
  it('ignores an old response after a newer query', async () => {
    let resolveOld: (products: Product[]) => void = () => {};
    const base = createMockProductRepository();
    const repository: ProductRepository = {
      ...base,
      search: query => query === 'asics'
        ? new Promise(resolve => { resolveOld = resolve; })
        : base.search(query),
    };
    open('/search/asics', repository);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'ascis' } });
    fireEvent.submit(screen.getByRole('search'));
    await screen.findByText('找不到符合「ascis」的商品');
    resolveOld([{ id: 'old', name: '舊資料', brand: 'ASICS', price: 1 }]);
    await waitFor(() => expect(screen.queryByText('舊資料')).toBeNull());
    expect(screen.getByText('找不到符合「ascis」的商品')).toBeTruthy();
  });
  it('sorts results by price', async () => {
    open('/search/asics');
    await screen.findByText('輕量跑鞋');
    fireEvent.click(screen.getByRole('button', { name: '價格由低到高' }));
    const prices = screen.getAllByLabelText(/售價/).map(node => Number(node.getAttribute('data-price')));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
  it('filters by brand and allows removing the filter', async () => {
    open('/search/日常');
    await screen.findByText('休閒步行鞋');
    fireEvent.click(screen.getByRole('button', { name: 'New Balance' }));
    expect(screen.queryByText('輕量跑鞋')).toBeNull();
    expect(screen.getByText('休閒步行鞋')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '移除品牌篩選' }));
    expect(screen.getByText('輕量跑鞋')).toBeTruthy();
  });
});
