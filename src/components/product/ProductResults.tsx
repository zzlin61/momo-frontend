import { Link } from 'react-router';
import type { ProductState } from '../../libs/store/products/productModel';
import { ProductCard } from './ProductCard';
import styles from './ProductResults.module.css';

export function ProductResults({ state, retry, keyword }: { state: ProductState; retry: () => void; keyword?: string }) {
  if (state.status === 'loading') return <div className={styles.feedback} role="status"><span className={styles.spinner} aria-hidden="true" /><h2>正在尋找喜歡的好物</h2><p>商品載入中，請稍候。</p></div>;
  if (state.status === 'error') return <div className={styles.feedback} role="alert"><span className={styles.symbol}>!</span><h2>商品暫時無法載入</h2><p>請再試一次，你的搜尋條件會保留。</p><button className="primaryButton" onClick={retry}>重新載入</button></div>;
  if (!state.products.length) return <div className={styles.feedback}>
    <svg className={styles.emptyArt} viewBox="0 0 160 125" aria-hidden="true"><ellipse cx="77" cy="114" rx="58" ry="6" fill="#eee9ef" /><path d="m28 39 51-20 52 20v61l-51 15-52-15Z" fill="#faf3f7" stroke="#d9c5d0" strokeWidth="2" /><path d="m28 39 52 19 51-19M80 58v57" fill="none" stroke="#d9c5d0" strokeWidth="2" /><circle cx="101" cy="46" r="24" fill="#fff" stroke="#d62872" strokeWidth="4" /><path d="m119 64 21 21" stroke="#d62872" strokeWidth="7" strokeLinecap="round" /><path d="M92 46h18" stroke="#d9c5d0" strokeWidth="3" /></svg>
    <h2>{keyword ? '找不到符合「' + keyword + '」的商品' : '目前沒有符合條件的商品'}</h2>
    <p>換個關鍵字，或試試品牌名稱，讓喜歡的好物找到你。</p>
    <div className={styles.suggestions}><Link className="primaryButton" to="/search/asics">試試 asics</Link><Link className="secondaryButton" to="/">回首頁逛逛</Link></div>
  </div>;
  return <div className={styles.grid}>{state.products.map(product => <ProductCard key={product.id} product={product} />)}</div>;
}
