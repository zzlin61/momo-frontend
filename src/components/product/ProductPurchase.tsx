import { useRef, useState } from 'react';
import type { ProductDetail } from '../../libs/store/products/productModel';
import { validateProductSelection } from '../../libs/store/products/productDetailRules';
import { formatPrice } from '../../libs/utils/formatPrice';
import { ProductGallery } from './ProductGallery';
import styles from './ProductPurchase.module.css';

export function ProductPurchase({ product }: { product: ProductDetail }) {
  const [colorId, setColorId] = useState(product.colors[0]?.id ?? '');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const sizes = useRef<HTMLFieldSetElement>(null);
  const color = product.colors.find(item => item.id === colorId);
  const socks = product.tags?.includes('配件') ?? false;
  const sizeLabel = (value: string) => socks ? value : value + ' CM';
  const clearFeedback = () => { setError(''); setConfirmation(''); };

  return <div className={styles.layout}>
    <ProductGallery variant={color?.artworkVariant ?? 0} socks={socks} name={product.name} />
    <section className={styles.info} aria-label="商品選購資訊">
      <div className={styles.brandLine}><span>{product.brand}</span><small>品號：{product.productCode ?? product.id}</small></div>
      <h1>{product.brand} {product.name}</h1>
      <p className={styles.subtitle}>日常的每一步，都值得舒服一點。</p>
      <ul className={styles.highlights}>{product.features.slice(0, 2).map(feature => <li key={feature}>{feature}</li>)}</ul>
      <div className={styles.pricePanel}>
        <span>示範售價</span>
        <p aria-label={'售價 ' + formatPrice(product.price) + ' 元'}><small>$</small>{formatPrice(product.price)}<span>元</span></p>
        <small>本頁商品、規格與價格為展示資料，未提供交易服務。</small>
      </div>
      <form noValidate onSubmit={event => {
        event.preventDefault();
        const result = validateProductSelection(product, { colorId, size, quantity });
        if (!result.valid) {
          setError(result.message);
          setConfirmation('');
          sizes.current?.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus();
          return;
        }
        setError('');
        setConfirmation('已確認：' + result.color + '／' + sizeLabel(result.size) + '／' + result.quantity
          + ' 件，合計 $' + formatPrice(result.total) + '。此為示範，不會送出訂單。');
      }}>
        <fieldset className={styles.options}>
          <legend>顏色</legend>
          <div className={styles.colorOptions}>{product.colors.map(item => <label key={item.id} className={colorId === item.id ? styles.selected : ''}>
            <input type="radio" name="product-color" value={item.id} checked={colorId === item.id} onChange={() => { setColorId(item.id); setSize(''); clearFeedback(); }} />
            <span className={item.id === 'chalk' ? styles.chalkSwatch : styles.graphiteSwatch} aria-hidden="true" />
            {item.name}
          </label>)}</div>
        </fieldset>
        <fieldset ref={sizes} className={styles.options} aria-invalid={Boolean(error)} aria-describedby={error ? 'selection-error' : 'size-help'}>
          <legend>尺寸</legend>
          <div className={styles.sizeOptions}>{color?.sizes.map(item => <label key={item.label} className={(size === item.label ? styles.selected : '') + ' ' + (!item.available ? styles.unavailable : '')}>
            <input type="radio" name="product-size" value={item.label} checked={size === item.label} disabled={!item.available}
              onChange={() => { setSize(item.label); clearFeedback(); }} />
            {sizeLabel(item.label)}
          </label>)}</div>
          <p id="size-help" className={styles.hint}>請選擇{ socks ? '合適尺寸' : '平常穿著的公分尺寸'}；灰色尺寸暫不提供選擇。</p>
        </fieldset>
        <div className={styles.quantityRow}><span>數量</span><div className={styles.stepper}>
          <button type="button" aria-label="減少數量" disabled={quantity <= 1} onClick={() => { setQuantity(value => value - 1); clearFeedback(); }}>−</button>
          <output aria-label="選購數量">{quantity}</output>
          <button type="button" aria-label="增加數量" disabled={quantity >= product.maxQuantity} onClick={() => { setQuantity(value => value + 1); clearFeedback(); }}>＋</button>
        </div><small>每次最多 {product.maxQuantity} 件（示範）</small></div>
        <div className={styles.feedback}>
          {error && <p id="selection-error" role="alert">{error}</p>}
          {confirmation && <p role="status" aria-label="選購確認" className={styles.confirmation}>{confirmation}</p>}
        </div>
        <button type="submit" className={styles.confirm}>確認選購（示範）<span aria-hidden="true">→</span></button>
        <p className={styles.demoNotice}>選擇僅供本頁預覽，不會建立購物車或訂單。</p>
      </form>
      <div className={styles.serviceLine}><span>✓ 本機商品展示</span><span>✓ 自製圖像</span><span>✓ 無交易服務</span></div>
    </section>
  </div>;
}
