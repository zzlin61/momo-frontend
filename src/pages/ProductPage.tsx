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
    <nav className={styles.sectionNav} aria-label="商品資訊導覽"><a href="#product-description">商品介紹</a><a href="#product-specifications">商品規格</a><a href="#product-notice">選購說明</a></nav>
    <section id="product-description" className={styles.description}>
      <div><span>MADE FOR YOUR EVERYDAY</span><h2>找到你的日常節奏。</h2><p>{product.description}</p></div>
      <div className={styles.featureList}>{product.features.map((feature, index) => <div key={feature}><span>{String(index + 1).padStart(2, '0')}</span><p>{feature}</p></div>)}</div>
    </section>
    <section id="product-specifications" className={styles.specifications}><h2>商品規格</h2><dl>{product.specifications.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></section>
    <section id="product-notice" className={styles.notice}><h2>選購說明</h2><p>此頁為前端展示作品。商品圖像、規格、可選尺寸、數量上限與價格皆為示範設定，不代表實際商品或庫存。選購確認不會產生訂單、付款或配送安排。</p><Link to={back}>繼續探索商品 →</Link></section>
  </>;
}
