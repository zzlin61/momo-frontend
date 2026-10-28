import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router';
import type { ProductDetail } from '../../libs/store/products/productModel';
import styles from './ProductInfoTabs.module.css';

interface ProductInfoTabsProps { product: ProductDetail; back: string }
const labels = ['商品介紹', '商品規格', '選購說明'];

export function ProductInfoTabs(props: ProductInfoTabsProps) {
  return <ProductInfoTabsContent key={props.product.id} {...props} />;
}

function ProductInfoTabsContent({ product, back }: ProductInfoTabsProps) {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case 'ArrowRight': next = (index + 1) % labels.length; break;
      case 'ArrowLeft': next = (index + labels.length - 1) % labels.length; break;
      case 'Home': next = 0; break;
      case 'End': next = labels.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }
  return <div>
    <div className={styles.tabList} role="tablist" aria-label="商品資訊">
      {labels.map((label, index) => <button key={label} type="button" role="tab"
        id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`}
        aria-selected={active === index} tabIndex={active === index ? 0 : -1}
        ref={element => { tabs.current[index] = element; }}
        onClick={() => setActive(index)} onKeyDown={event => handleKeyDown(event, index)}>{label}</button>)}
    </div>
    <section role="tabpanel" id={`${id}-panel-0`} aria-labelledby={`${id}-tab-0`} hidden={active !== 0} tabIndex={0}>
      <div className={styles.description}>
        <div><span>MADE FOR YOUR EVERYDAY</span><h2>找到你的日常節奏。</h2><p>{product.description}</p></div>
        <div className={styles.featureList}>{product.features.map((feature, index) => <div key={feature}><span>{String(index + 1).padStart(2, '0')}</span><p>{feature}</p></div>)}</div>
      </div>
    </section>
    <section role="tabpanel" id={`${id}-panel-1`} aria-labelledby={`${id}-tab-1`} hidden={active !== 1} tabIndex={0}>
      <div className={styles.specifications}><h2>商品規格</h2><dl>{product.specifications.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></div>
    </section>
    <section role="tabpanel" id={`${id}-panel-2`} aria-labelledby={`${id}-tab-2`} hidden={active !== 2} tabIndex={0}>
      <div className={styles.notice}><h2>選購說明</h2><p>此頁為前端展示作品。商品圖像、規格、可選尺寸、數量上限與價格皆為示範設定，不代表實際商品或庫存。選購確認不會產生訂單、付款或配送安排。</p><Link to={back}>繼續探索商品 →</Link></div>
    </section>
  </div>;
}
