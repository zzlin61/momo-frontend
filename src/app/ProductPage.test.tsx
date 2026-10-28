import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { createMockProductRepository } from '../libs/apiservices/products/mockProductRepository';
import type { ProductRepository } from '../libs/store/products/productModel';
import type { ProductDetailRecord } from '../libs/apiservices/products/types/ProductDetailRecord';

afterEach(cleanup);
function open(path = '/product/15745582', repository = createMockProductRepository()) {
  return render(<MemoryRouter initialEntries={[path]}><App repository={repository} /></MemoryRouter>);
}

describe('product detail', () => {
  it('opens the reference code directly and ignores reference query parameters', async () => {
    open('/product/15745582?Area=search&kw=asics');
    expect(await screen.findByRole('heading', { level: 1, name: 'ASICS 輕量跑鞋' })).toBeTruthy();
    expect(screen.getByText('品號：15745582')).toBeTruthy();
    expect(screen.getByRole('group', { name: '尺寸' })).toBeTruthy();
    expect(document.title).toContain('輕量跑鞋');
  });
  it('opens product cards and returns to the same sorted search', async () => {
    open('/search/asics?sort=price-desc');
    const card = await screen.findByRole('article', { name: 'ASICS 輕量跑鞋' });
    fireEvent.click(within(card).getByRole('link'));
    await screen.findByRole('heading', { level: 1, name: 'ASICS 輕量跑鞋' });
    fireEvent.click(screen.getByRole('link', { name: '返回商品列表' }));
    await screen.findByRole('heading', { level: 1, name: 'asics' });
    expect(screen.getByRole('button', { name: '價格由高到低' }).getAttribute('aria-pressed')).toBe('true');
  });
  it('shows loading before detail arrives', async () => {
    open('/product/15745582', createMockProductRepository({ delayMs: 30 }));
    expect(screen.getByRole('status').textContent).toContain('載入商品');
    await screen.findByRole('heading', { level: 1, name: 'ASICS 輕量跑鞋' });
  });
  it('distinguishes an unknown product from a request error', async () => {
    open('/product/missing');
    expect(await screen.findByRole('heading', { name: '找不到這項商品' })).toBeTruthy();
    expect(screen.getByRole('link', { name: '回首頁逛逛' })).toBeTruthy();
  });
  it('allows retry after a detail request fails', async () => {
    let fail = true;
    const base = createMockProductRepository();
    open('/product/15745582', { ...base, getById: id => fail ? Promise.reject(new Error('offline')) : base.getById(id) });
    await screen.findByRole('alert');
    fail = false;
    fireEvent.click(screen.getByRole('button', { name: '重新載入' }));
    await screen.findByRole('heading', { level: 1, name: 'ASICS 輕量跑鞋' });
  });
  it('requires a size and confirms a local selection with bounded quantity', async () => {
    open();
    await screen.findByRole('heading', { level: 1, name: 'ASICS 輕量跑鞋' });
    fireEvent.click(screen.getByRole('button', { name: '確認選購（示範）' }));
    expect(screen.getByRole('alert').textContent).toContain('請選擇尺寸');
    fireEvent.click(screen.getByRole('radio', { name: '26 CM' }));
    expect((screen.getByRole('button', { name: '減少數量' }) as HTMLButtonElement).disabled).toBe(true);
    for (let i = 0; i < 6; i++) fireEvent.click(screen.getByRole('button', { name: '增加數量' }));
    expect(screen.getByLabelText('選購數量').textContent).toBe('5');
    expect((screen.getByRole('button', { name: '增加數量' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: '確認選購（示範）' }));
    expect(screen.getByRole('status', { name: '選購確認' }).textContent).toContain('黑銀灰／26 CM／5 件');
    expect(screen.getByRole('status', { name: '選購確認' }).textContent).toContain('12,450');
    fireEvent.click(screen.getByRole('radio', { name: '米白綠' }));
    expect((screen.getByRole('radio', { name: '26 CM' }) as HTMLInputElement).checked).toBe(false);
    expect((screen.getByRole('radio', { name: '23.5 CM' }) as HTMLInputElement).disabled).toBe(true);
    expect(screen.queryByText(/12,450/)).toBeNull();
  });
  it('switches gallery views with named controls', async () => {
    open();
    await screen.findByRole('heading', { level: 1, name: 'ASICS 輕量跑鞋' });
    fireEvent.click(screen.getByRole('button', { name: '查看俯視圖' }));
    expect(screen.getByRole('button', { name: '查看俯視圖' }).getAttribute('aria-pressed')).toBe('true');
  });
  it('does not overwrite a newer product with an old response', async () => {
    let resolveOld: (detail: ProductDetailRecord | null) => void = () => {};
    const base = createMockProductRepository();
    const repository: ProductRepository = { ...base, getById: id => id === '15745582' ? new Promise(resolve => { resolveOld = resolve; }) : base.getById(id) };
    function SwitchProduct() { const navigate = useNavigate(); return <button onClick={() => navigate('/product/demo-asics-02')}>切換測試商品</button>; }
    render(<MemoryRouter initialEntries={['/product/15745582']}><SwitchProduct /><App repository={repository} /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: '切換測試商品' }));
    await screen.findByRole('heading', { level: 1, name: 'ASICS 緩震慢跑鞋' });
    resolveOld(await base.getById('15745582'));
    await waitFor(() => expect(screen.queryByRole('heading', { level: 1, name: 'ASICS 輕量跑鞋' })).toBeNull());
    expect(screen.getByRole('heading', { level: 1, name: 'ASICS 緩震慢跑鞋' })).toBeTruthy();
  });
});
