import { ProductInfoTabs } from '../components/product/ProductInfoTabs';
import { ProductDiscovery } from '../components/product/ProductDiscovery';
import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import type { ProductRepository } from '../libs/store/products/productModel';
import { useProductDetail } from '../libs/store/products/useProductDetail';
import { ProductPurchase } from '../components/product/ProductPurchase';
import styles from './ProductPage.module.css';

function returnPath(state: unknown, fallback: string) {
  if (typeof state === 'object' && state !== null && 'from' in state
    && typeof state.from === 'string' && (state.from === '/' || state.from.startsWith('/search/'))) {
    return state.from;
  }
  return fallback;
}

export function ProductPage({ repository }: { repository: ProductRepository }) {
  const { productId = '' } = useParams<'productId'>();
  const location = useLocation();
  const { state, retry } = useProductDetail(repository, productId);
  useEffect(() => {
    document.title = state.status === 'success'
      ? state.product.brand + ' ' + state.product.name + ' | momo 前端展示'
      : state.status === 'not-found' ? '找不到商品 | momo 前端展示'
        : state.status === 'error' ? '商品載入失敗 | momo 前端展示' : '載入商品中 | momo 前端展示';
  }, [state]);

  if (state.status !== 'success') return <section className={styles.feedback} aria-label="商品詳情">
    {state.status === 'loading' && <div role="status"><span className={styles.spinner} aria-hidden="true" /><h1>載入商品中</h1><p>正在準備商品資訊，請稍候。</p></div>}
    {state.status === 'error' && <div role="alert"><h1>商品暫時無法載入</h1><p>請再試一次，或返回首頁繼續探索。</p><button className="primaryButton" onClick={retry}>重新載入</button></div>}
    {state.status === 'not-found' && <div><span className={styles.emptySymbol}>?</span><h1>找不到這項商品</h1><p>請確認商品連結，或回首頁看看其他好物。</p><Link className="primaryButton" to="/">回首頁逛逛</Link></div>}
  </section>;

  const product = state.product;
  const back = returnPath(location.state, '/search/' + encodeURIComponent(product.brand));
  return <>
    <nav className={styles.breadcrumb} aria-label="麵包屑"><Link to="/">首頁</Link><span>›</span><Link to={'/search/' + encodeURIComponent(product.brand)}>{product.brand}</Link><span>›</span><span>{product.name}</span></nav>
    <div className={styles.pageTop}><span>YOUR EVERYDAY, WELL CHOSEN.</span><Link to={back}>返回商品列表</Link></div>
    <ProductPurchase key={product.id} product={product} />
    <ProductInfoTabs key={product.id} product={product} back={back} />
    <ProductDiscovery key={product.id} product={product} repository={repository} />
  </>;
}
