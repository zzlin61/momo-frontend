import type { ProductDetail, ProductRepository } from '../../libs/store/products/productModel';
import { useProductDiscovery } from '../../libs/store/products/useProductDiscovery';
import { ProductCard } from './ProductCard';
import styles from './ProductDiscovery.module.css';

export function ProductDiscovery({ product, repository }: { product: ProductDetail; repository: ProductRepository }) {
  const { recommendations, history, historyLoading, retry, clearHistory } = useProductDiscovery(product, repository);
  return <div className={styles.discovery}>
    <section aria-label="商品推薦" className={styles.section}>
      <h2>商品推薦</h2>
      <p className={styles.hint}>繼續探索適合你的運動選物</p>
      {recommendations.status === 'loading' && <p role="status">商品推薦載入中…</p>}
      {recommendations.status === 'error' && <div role="alert"><p>暫時無法載入商品推薦</p><button className="secondaryButton" onClick={retry}>重新載入推薦</button></div>}
      {recommendations.status === 'success' && (recommendations.products.length
        ? <div className={styles.grid}>{recommendations.products.map(item => <ProductCard key={item.id} product={item} />)}</div>
        : <p>目前沒有其他推薦商品</p>)}
    </section>
    <section aria-label="瀏覽紀錄" className={styles.section}>
      <div className={styles.heading}><h2>瀏覽紀錄</h2><button className="secondaryButton" onClick={clearHistory}>清除瀏覽紀錄</button></div>
      <p className={styles.hint}>僅在此瀏覽器保留最近瀏覽的商品</p>
      {historyLoading ? <p role="status">瀏覽紀錄載入中…</p> : history.length
        ? <div className={styles.grid}>{history.map(item => <ProductCard key={item.id} product={item} />)}</div>
        : <p>尚無其他瀏覽紀錄</p>}
    </section>
  </div>;
}
