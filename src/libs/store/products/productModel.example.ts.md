# productModel.ts — 商品探索模型範例（未啟用）

正規化資料已足夠供目前商品探索使用，因此先重用形狀，不增加沒有業務差異的欄位映射。若未來出現可售判定或價格政策，再由 Business 擁有其模型與轉換。

```ts
import type { ProductRecord } from '../../apiservices/products/types/searchProducts';

export type Product = ProductRecord;

export type ProductSort = 'recommended' | 'price-asc' | 'price-desc';

export interface ProductQuery {
  readonly keyword: string;
  readonly brand: string;
  readonly sort: ProductSort;
}
```

此 alias 僅是文件中示範的選擇，不取代目前 `src/libs/store/products/productModel.ts`。Business 可依賴資料來源的正規化型別；資料來源不能反過來匯入 Business。
