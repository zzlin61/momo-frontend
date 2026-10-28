import { ProductPage } from '../pages/ProductPage';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useMatch } from 'react-router';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';
import { PageShell } from '../components/layout/PageShell';
import { SiteHeader } from '../components/layout/SiteHeader';
import { createMockProductRepository } from '../libs/apiservices/products/mockProductRepository';
import type { ProductRepository } from '../libs/store/products/productModel';
import styles from './App.module.css';

const defaultRepository = createMockProductRepository({ delayMs: 180 });
export function App({ repository = defaultRepository }: { repository?: ProductRepository }) {
  const location = useLocation();
  const match = useMatch('/search/:keyword');
  useEffect(() => {
    if (!location.pathname.startsWith('/product/')) document.title = match ? (match.params.keyword ?? '') + ' 搜尋結果 | momo 前端展示' : 'momo 購物網｜生活好物，喜歡就選';
    if (location.pathname !== '/') document.getElementById('main-content')?.focus();
  }, [location.pathname, match?.params.keyword]);
  return <>
    <a className="skipLink" href="#main-content">跳到主要內容</a>
    <SiteHeader />
    <PageShell>
      <Routes>
        <Route path="/product/:productId" element={<ProductPage repository={repository} />} />
        <Route path="/" element={<HomePage repository={repository} />} />
        <Route path="/search/:keyword" element={<SearchPage repository={repository} />} />
      </Routes>
    </PageShell>
    <footer className={styles.footer}><div className="pageWidth"><div><strong>momo<span>生活裡的喜歡，都在這裡。</span></strong><p>前端展示作品 · 商品與價格均為示範資料，未提供交易服務。</p></div><span>DESIGNED FOR YOUR EVERYDAY<br />© 2026 momo frontend prototype</span></div></footer>
  </>;
}
