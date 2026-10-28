import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import type { ProductDetail } from '../../libs/store/products/productModel';
import { ProductInfoTabs } from './ProductInfoTabs';

const product: ProductDetail = {
  id: 'test-shoe', name: '測試跑鞋', brand: 'ASICS', price: 2490,
  description: '為日常跑步準備的輕量鞋款。', features: ['輕量舒適', '透氣鞋面'],
  colors: [], maxQuantity: 5, specifications: [{ label: '材質', value: '網布' }],
};
afterEach(cleanup);
function Location() { const location = useLocation(); return <output aria-label="目前網址">{location.pathname + location.search + location.hash}</output>; }
function open(detail = product) {
  return render(<MemoryRouter initialEntries={['/product/test-shoe?Area=search#existing']}><Location /><ProductInfoTabs product={detail} back="/search/asics?sort=price-desc" /></MemoryRouter>);
}
function assertActive(name: string) {
  const tabs = screen.getAllByRole('tab');
  for (const tab of tabs) {
    expect(tab.getAttribute('aria-selected')).toBe(String(tab.textContent === name));
    expect(tab.tabIndex).toBe(tab.textContent === name ? 0 : -1);
  }
  const active = screen.getByRole('tab', { name });
  const panel = screen.getByRole('tabpanel');
  expect(panel.id).toBe(active.getAttribute('aria-controls'));
  expect(panel.getAttribute('aria-labelledby')).toBe(active.id);
  expect(screen.getByLabelText('目前網址').textContent).toBe('/product/test-shoe?Area=search#existing');
}

describe('ProductInfoTabs', () => {
  it('defaults to the introduction and connects each tab to its panel', () => {
    open();
    expect(screen.getByRole('tablist', { name: '商品資訊' })).toBeTruthy();
    assertActive('商品介紹');
    expect(within(screen.getByRole('tabpanel')).getByRole('heading', { name: '找到你的日常節奏。' })).toBeTruthy();
    expect(screen.getByText(product.description)).toBeTruthy();
    expect(screen.getByText('輕量舒適')).toBeTruthy();
    for (const tab of screen.getAllByRole('tab')) expect(document.getElementById(tab.getAttribute('aria-controls')!)).toBeTruthy();
  });
  it('switches content by click without changing any part of the URL', () => {
    open();
    fireEvent.click(screen.getByRole('tab', { name: '商品規格' }));
    assertActive('商品規格');
    expect(within(screen.getByRole('tabpanel')).getByText('網布')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: '找到你的日常節奏。' })).toBeNull();
    fireEvent.click(screen.getByRole('tab', { name: '選購說明' }));
    assertActive('選購說明');
    expect(within(screen.getByRole('tabpanel')).getByRole('link', { name: '繼續探索商品 →' }).getAttribute('href')).toBe('/search/asics?sort=price-desc');
  });
  it('automatically activates and focuses tabs with wrapping arrows, Home and End', () => {
    open();
    const introduction = screen.getByRole('tab', { name: '商品介紹' });
    introduction.focus();
    const actions = [ ['ArrowLeft', '選購說明'], ['ArrowRight', '商品介紹'], ['ArrowRight', '商品規格'], ['End', '選購說明'], ['Home', '商品介紹'] ];
    for (const [key, name] of actions) {
      fireEvent.keyDown(document.activeElement!, { key });
      assertActive(name);
      expect(document.activeElement).toBe(screen.getByRole('tab', { name }));
    }
  });
  it('resets to introduction when the product identity changes', () => {
    const view = open();
    fireEvent.click(screen.getByRole('tab', { name: '商品規格' }));
    view.rerender(<MemoryRouter><Location /><ProductInfoTabs product={{ ...product, id: 'another-shoe', description: '另一項商品介紹' }} back="/search/asics" /></MemoryRouter>);
    assertActive('商品介紹');
    expect(screen.getByText('另一項商品介紹')).toBeTruthy();
  });
});
