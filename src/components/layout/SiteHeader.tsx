import { Link, useMatch } from 'react-router';
import { SearchForm } from '../search/SearchForm';
import styles from './SiteHeader.module.css';

const links = [['運動戶外', '運動'], ['流行鞋款', '鞋'], ['ASICS', 'asics'], ['New Balance', 'New Balance'], ['日常穿搭', '日常'], ['精選配件', '配件']];
export function SiteHeader() {
  const match = useMatch('/search/:keyword');

  return (
    <header className={styles.header}>
      <div className={styles.utility}><div className="pageWidth"><span>momo 購物網・前端展示</span><span>為你的日常，多一點喜歡 <b>♡</b></span></div></div>
      <div className={styles.main + ' pageWidth'}>
        <Link to="/" className={styles.logo} aria-label="momo 回首頁">momo<span>購物網</span></Link>
        <SearchForm keyword={match?.params.keyword ?? ''} />
        <div className={styles.promise}><span className={styles.promiseIcon}>✓</span><div><strong>好物，安心選</strong><small>生活靈感，從這裡開始</small></div></div>
      </div>
      <nav className={styles.nav} aria-label="主要分類"><div className="pageWidth">
        <Link to="/" className={styles.all}><span>☰</span> 全站商品分類</Link>
        {links.map(([label, query]) => <Link key={query} to={'/search/' + encodeURIComponent(query)}>{label}</Link>)}
        <span className={styles.navNote}>每一天，都有新發現 ✦</span>
      </div></nav>
    </header>
  );
}
