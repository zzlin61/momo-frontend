import { useState } from 'react';
import { ProductArtwork } from './ProductArtwork';
import styles from './ProductGallery.module.css';

const views = [
  { label: '側面圖', className: 'side' },
  { label: '俯視圖', className: 'top' },
  { label: '細節圖', className: 'detail' },
] as const;

export function ProductGallery({ variant, socks, name }: { variant: number; socks: boolean; name: string }) {
  const [view, setView] = useState(0);
  return <section className={styles.gallery} aria-label="商品圖集">
    <div className={styles.stage}>
      <span className={styles.badge}>momo SELECT</span>
      <div className={styles.art + ' ' + styles[views[view].className]} role="img" aria-label={name + '・' + views[view].label}>
        <ProductArtwork variant={variant} socks={socks} />
      </div>
      <span className={styles.caption}>原創示意圖・以示範配色呈現</span>
      <span className={styles.index}>{view + 1} / {views.length}</span>
    </div>
    <div className={styles.thumbnails} aria-label="選擇商品視角">
      {views.map((item, index) => <button key={item.label} type="button" aria-label={'查看' + item.label}
        aria-pressed={view === index} className={view === index ? styles.active : ''} onClick={() => setView(index)}>
        <div className={styles[item.className]}><ProductArtwork variant={variant} socks={socks} /></div>
        <span>{item.label}</span>
      </button>)}
    </div>
    <p className={styles.note}>{socks ? '小配件，為日常多加一點舒適。' : '好看的日常，從一雙喜歡的鞋開始。'}圖像為自行繪製的展示素材。</p>
  </section>;
}
