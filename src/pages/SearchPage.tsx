
import { Link, useParams, useSearchParams } from 'react-router';
import type { ProductRepository } from '../libs/store/products/productModel';
import { ProductResults } from '../components/product/ProductResults';
import { useProducts } from '../libs/store/products/useProducts';
import { projectProductResults } from '../libs/store/products/productRules';
import styles from './SearchPage.module.css';

export function SearchPage({ repository }: { repository: ProductRepository }) {
  const { keyword = '' } = useParams<'keyword'>();
  const { state, retry } = useProducts(repository, keyword);
  const [params, setParams] = useSearchParams();
  const sort = params.get('sort') ?? 'recommended';
  const brand = params.get('brand') ?? '';


  const { brands, filtered, count } = projectProductResults(state, brand, sort);
  const update = (key: string, value: string) => { const next = new URLSearchParams(params); if(value) next.set(key,value); else next.delete(key); setParams(next, { replace: true }); };
  return <>
    <nav className={styles.breadcrumb} aria-label="麵包屑"><Link to="/">首頁</Link><span>›</span><span>搜尋結果</span></nav>
    <div className={styles.layout}>
      <aside className={styles.filters}><h2>縮小搜尋範圍</h2><section><h3>商品分類</h3><Link to="/search/鞋">運動・休閒鞋 <span>›</span></Link><Link to="/search/配件">運動配件 <span>›</span></Link></section><section><h3>品牌</h3>{brands.length ? <><button className={!brand ? styles.selected : ''} onClick={() => update('brand','')} aria-pressed={!brand}>全部品牌</button>{brands.map(item => <button key={item} className={brand === item ? styles.selected : ''} aria-pressed={brand === item} onClick={() => update('brand',item)}>{item}</button>)}</> : <p>找到商品後顯示品牌</p>}</section><section className={styles.tip}><span>✧</span><h3>找一點靈感？</h3><p>從喜歡的品牌開始，<br />發現更多日常好物。</p><Link to="/search/asics">探索 ASICS →</Link></section></aside>
      <section className={styles.results} aria-label="商品搜尋結果">
        <div className={styles.title}><div><span>SEARCH RESULTS</span><h1 tabIndex={-1}>{keyword}</h1></div><p aria-live="polite">{count === null ? '商品載入中' : <>共 <strong>{count}</strong> 件商品</>}</p></div>
        <div className={styles.related}><span>相關搜尋</span>{['asics', '跑鞋', '運動', 'New Balance'].map(query => <Link key={query} to={'/search/' + encodeURIComponent(query)}>{query}</Link>)}</div>
        <div className={styles.toolbar}><div className={styles.sorts} aria-label="商品排序">{[['recommended','綜合推薦'],['price-asc','價格由低到高'],['price-desc','價格由高到低']].map(([value,label]) => <button key={value} aria-pressed={sort === value} className={sort === value ? styles.active : ''} onClick={() => update('sort',value)}>{label}</button>)}</div><span>全部商品</span></div>
        {brand && <div className={styles.activeFilter}>品牌：{brand}<button onClick={() => update('brand','')} aria-label="移除品牌篩選">×</button></div>}
        <ProductResults state={filtered} retry={retry} keyword={keyword} />
        {count !== null && count > 0 && <p className={styles.end}>以上為全部 {count} 件商品，試試其他關鍵字，發現更多好物。</p>}
      </section>
    </div>
  </>;
}
