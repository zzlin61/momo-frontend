# productRules.ts — 純規則範例（未啟用）

對應未來商品探索 module 的 implementation。keyword/sort/brand 由 UI 的路由連接傳入；函式不讀取 window.location 或 React hook。

```ts
import type { Product, ProductQuery } from './productModel';

export function normalizeProductQuery(input: {
  keyword: string;
  brand?: string;
  sort?: string;
}): ProductQuery {
  return {
    keyword: input.keyword.trim(),
    brand: input.brand?.trim() ?? '',
    sort: input.sort === 'price-asc' || input.sort === 'price-desc'
      ? input.sort
      : 'recommended',
  };
}

// items 已是資料來源對 keyword 搜尋後的結果。
// 本函式只投影品牌與排序，不再執行第二次 keyword matching。
export function projectProducts(
  items: readonly Product[],
  query: ProductQuery,
) {
  const products = items.filter(item => !query.brand || item.brand === query.brand);
  if (query.sort === 'price-asc') products.sort((a, b) => a.price - b.price);
  if (query.sort === 'price-desc') products.sort((a, b) => b.price - a.price);

  return {
    products,
    count: products.length,
    brands: [...new Set(items.map(item => item.brand))],
  };
}
```

filter 建立新陣列後才 sort，原始結果順序保留。recommended 維持來源順序，不捏造推薦分數。count 是投影結果，不另以 setter 管理。價格顯示格式不在此處處理。
