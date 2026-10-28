import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { createMockProductRepository } from '../libs/apiservices/products/mockProductRepository';

afterEach(() => { cleanup(); localStorage.clear(); });
function LocationProbe() {
  const location = useLocation();
  return <output aria-label="測試目前網址">{location.pathname + location.search + location.hash}</output>;
}
function open(path = '/product/15745582?Area=search&kw=asics') {
  return render(<MemoryRouter initialEntries={[path]}><LocationProbe /><App repository={createMockProductRepository()} /></MemoryRouter>);
}

describe('product tabs and discovery integration', () => {
  it('changes visible tab content without touching pathname, query or hash', async () => {
    open();
    await screen.findByRole('heading', { level: 1, name: 'ASICS 輕量跑鞋' });
    const original = screen.getByLabelText('測試目前網址').textContent;
    expect(screen.getByRole('tab', { name: '商品介紹' }).getAttribute('aria-selected')).toBe('true');
    fireEvent.click(screen.getByRole('tab', { name: '商品規格' }));
    expect(within(screen.getByRole('tabpanel')).getByText('品牌')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: '找到你的日常節奏。' })).toBeNull();
    fireEvent.click(screen.getByRole('tab', { name: '選購說明' }));
    expect(within(screen.getByRole('tabpanel')).getByText(/選購確認不會產生訂單/)).toBeTruthy();
    expect(screen.getByLabelText('測試目前網址').textContent).toBe(original);
    const introduction = screen.getByRole('tab', { name: '商品介紹' });
    fireEvent.keyDown(screen.getByRole('tab', { name: '選購說明' }), { key: 'Home' });
    expect(document.activeElement).toBe(introduction);
    expect(introduction.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByLabelText('測試目前網址').textContent).toBe(original);
  });
  it('shows actual previous products, restores history and clears it', async () => {
    open();
    await screen.findByRole('heading', { level: 1, name: 'ASICS 輕量跑鞋' });
    const recommendations = await screen.findByRole('region', { name: '商品推薦' });
    const next = await within(recommendations).findByRole('link', { name: '查看 ASICS 緩震慢跑鞋' });
    expect(within(recommendations).queryByRole('link', { name: '查看 ASICS 輕量跑鞋' })).toBeNull();
    fireEvent.click(screen.getByRole('tab', { name: '商品規格' }));
    fireEvent.click(next);
    await screen.findByRole('heading', { level: 1, name: 'ASICS 緩震慢跑鞋' });
    expect(screen.getByRole('tab', { name: '商品介紹' }).getAttribute('aria-selected')).toBe('true');
    const history = screen.getByRole('region', { name: '瀏覽紀錄' });
    expect(await within(history).findByRole('link', { name: '查看 ASICS 輕量跑鞋' })).toBeTruthy();
    expect(within(history).queryByRole('link', { name: '查看 ASICS 緩震慢跑鞋' })).toBeNull();
    cleanup();
    open('/product/demo-asics-02');
    await screen.findByRole('heading', { level: 1, name: 'ASICS 緩震慢跑鞋' });
    const restored = screen.getByRole('region', { name: '瀏覽紀錄' });
    expect(await within(restored).findByRole('link', { name: '查看 ASICS 輕量跑鞋' })).toBeTruthy();
    fireEvent.click(within(restored).getByRole('button', { name: '清除瀏覽紀錄' }));
    expect(within(restored).queryByRole('article')).toBeNull();
    expect(JSON.parse(localStorage.getItem('momo.recent-products.v1') ?? '[]')).toEqual([]);
  });
});
