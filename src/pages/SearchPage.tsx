import { useParams } from 'react-router';

export function SearchPage() {
  const { keyword } = useParams<'keyword'>();
  return (
    <>
      <h1>搜尋：{keyword}</h1>
      <p>目前為路由骨架，尚未接入本機商品資料。</p>
    </>
  );
}
