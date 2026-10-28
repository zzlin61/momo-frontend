import { Link } from 'react-router';
import type { ProductRepository } from '../entities/product/ProductRepository';
import { ProductArtwork } from '../entities/product/ProductArtwork';
import { ProductResults } from '../entities/product/ProductResults';
import { useProducts } from '../entities/product/useProducts';
import styles from './HomePage.module.css';

const categories = [['◈', '運動鞋款', '鞋'], ['↗', '跑步訓練', '長跑'], ['◇', '休閒穿搭', '日常'], ['◎', '戶外生活', '步行'], ['≋', '運動配件', '配件'], ['✧', '品牌精選', 'asics']];
export function HomePage({ repository }: { repository: ProductRepository }) {
  const { state, retry } = useProducts(repository);
  return <>
    <section className={styles.feature} aria-label="本週推薦">
      <aside className={styles.categories}><p>發現你的生活提案</p>{categories.map(([icon, label, query]) => <Link key={label} to={'/search/' + encodeURIComponent(query)}><span>{icon}</span>{label}<small>›</small></Link>)}<div className={styles.categoryBottom}><b>HELLO, NEW DAY.</b><span>每個日常，都值得好好選。</span></div></aside>
      <div className={styles.hero}>
        <div className={styles.heroCopy}><span className={styles.eyebrow}>momo SELECT / 秋日運動提案</span><h1>把喜歡的生活<br />穿在每一步。</h1><p>從城市日常，到週末的遠方<br />找到剛剛好的節奏，舒服出發。</p><Link to="/search/asics" className={styles.heroButton}>探索運動鞋款 <span>↗</span></Link><span className={styles.heroCaption}>MOVE WITH YOUR EVERYDAY</span></div>
        <div className={styles.heroArt}><span className={styles.circle} /><span className={styles.artWord}>MOVE</span><div className={styles.largeShoe}><ProductArtwork variant={0} /></div><div className={styles.floatingLabel}><span>為每一步，留一點輕盈</span><strong>YOUR DAILY PAIR.</strong></div></div>
      </div>
      <div className={styles.sidePromos}>
        <Link to="/search/New%20Balance" className={styles.promoBlue}><small>STYLE EDIT</small><h2>日常百搭<br />有型，不費力</h2><span>探索 New Balance →</span><div><ProductArtwork variant={2} /></div></Link>
        <Link to="/search/配件" className={styles.promoPeach}><small>THE LITTLE THINGS</small><h2>小配件<br />大大的舒適</h2><span>運動配件精選 →</span><div><ProductArtwork socks /></div></Link>
      </div>
    </section>
    <section className={styles.services} aria-label="選物特色"><div><span>✧</span><strong>生活精選</strong><small>剛剛好的日常好物</small></div><div><span>◈</span><strong>品牌提案</strong><small>探索喜歡的運動風格</small></div><div><span>↗</span><strong>輕鬆探索</strong><small>用關鍵字找到靈感</small></div><div><span>♡</span><strong>為你挑選</strong><small>從每個小細節開始</small></div></section>
    <section className={styles.featured} aria-labelledby="featured-title"><div className={styles.sectionHeading}><div><span>GOOD FINDS, EVERY DAY</span><h2 id="featured-title">今日好物推薦<span>日常裡的小心動</span></h2></div><Link to="/search/運動">探索運動好物 ↗</Link></div><ProductResults state={state} retry={retry} /></section>
    <section className={styles.bottomBanner}><div><small>FIND YOUR EVERYDAY</small><h2>生活有很多種，喜歡的由你選。</h2></div><Link to="/search/日常">發現日常靈感 <span>→</span></Link></section>
  </>;
}
