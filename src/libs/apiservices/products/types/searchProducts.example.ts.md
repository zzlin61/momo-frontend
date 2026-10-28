# searchProducts.ts — 型別範例（未啟用）

以下為**假設的教學契約**，不是實際 API 文件。本檔不參與應用程式編譯；未來對應檔名為 `types/searchProducts.ts`。

```ts
export interface SearchProductsParams {
  keyword: string;
}

export interface ProductResponseItem {
  product_id: string;
  product_name: string;
  brand_name: string;
  price_twd: number;
  tags?: string[] | null;
}

export interface SearchProductsResponse {
  items: ProductResponseItem[];
}

// 正規化後的資料來源表示法，消除外部欄位命名與 null。
export interface ProductRecord {
  readonly id: string;
  readonly name: string;
  readonly brand: string;
  readonly price: number;
  readonly tags: readonly string[];
}
```

`SearchProductsResponse` 描述驗證後應符合的形狀。宣告此型別不會自動檢查外部資料；原始回應先交給 mapper，不能只用 `as SearchProductsResponse` 跳過驗證。
