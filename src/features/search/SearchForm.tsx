import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import styles from './SearchForm.module.css';

export function SearchForm({ keyword }: { keyword: string }) {
  const [value, setValue] = useState(keyword);
  useEffect(() => { setValue(keyword); }, [keyword]);
  const composing = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className={styles.wrapper}>
      <form role="search" noValidate className={styles.form} onSubmit={event => {
        event.preventDefault();
        const query = value.trim();
        if (!query || composing.current) return;
        setValue(query);
        navigate('/search/' + encodeURIComponent(query));
      }}>
        <label className="srOnly" htmlFor="product-search">搜尋商品</label>
        <input ref={input} id="product-search" type="search" placeholder="搜尋喜歡的商品、品牌" value={value}
          onChange={event => setValue(event.target.value)}
          onCompositionStart={() => { composing.current = true; }}
          onCompositionEnd={() => { composing.current = false; }}
        />
        {value && <button type="button" className={styles.clear} aria-label="清除搜尋" onClick={() => {
          setValue('');
          if (location.pathname.startsWith('/search/')) navigate('/');
          input.current?.focus();
        }}>×</button>}
        <button type="submit" aria-label="搜尋" className={styles.submit}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><span>搜尋</span></button>
      </form>
      <div className={styles.trending}><span>熱門搜尋</span><Link to="/search/asics">asics 跑鞋</Link><Link to="/search/New%20Balance">New Balance</Link><Link to="/search/運動">運動好物</Link></div>
    </div>
  );
}
