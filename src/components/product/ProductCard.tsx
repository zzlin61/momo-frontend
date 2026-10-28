import type { Product } from '../../libs/store/products/productModel';
import { ProductArtwork } from './ProductArtwork';
import styles from './ProductCard.module.css';

import { formatPrice } from '../../libs/utils/formatPrice';
export function ProductCard({ product }: { product: Product }) {
  const variant = [...product.id].reduce((value, char) => value + char.charCodeAt(0), 0) % 4;
  return <article className={styles.card} aria-label={product.brand + ' ' + product.name}>
    <div className={styles.image}><span className={styles.label}>精選好物</span><ProductArtwork variant={variant} socks={product.tags?.includes('配件')} /></div>
    <div className={styles.body}>
      <p className={styles.brand}>{product.brand}</p>
      <h3>{product.name}</h3>
      <p className={styles.description}>{product.tags?.join('・')}</p>
      <p className={styles.price} aria-label={'售價 ' + formatPrice(product.price) + ' 元'} data-price={product.price}><span>$</span>{formatPrice(product.price)}</p>
      <div className={styles.bottom}><span>嚴選推薦</span><span>示範商品</span></div>
    </div>
  </article>;
}
