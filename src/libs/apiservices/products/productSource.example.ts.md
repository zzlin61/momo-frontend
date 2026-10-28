# productSource.ts — 資料來源 seam 範例（未啟用）

此範例接收經注入的資料載入函式，沒有 fetch、假網址或實際 HTTP 呼叫。它示範資料來源 interface 與 mapper 的合作，不要求現在新增一個轉呼叫 module。

```ts
import type {
  ProductRecord,
  SearchProductsParams,
} from './types/searchProducts';
import { mapProductsResponse } from './productMapper';

export interface ProductSource {
  search(params: SearchProductsParams): Promise<readonly ProductRecord[]>;
}

export function createProductSource(
  loadResponse: (params: SearchProductsParams) => Promise<unknown>,
): ProductSource {
  return {
    async search(params) {
      const response = await loadResponse(params);
      return mapProductsResponse(response);
    },
  };
}
```

loadResponse 的 implementation 與任何端點由未來獲授權的契約決定。現在 UI 繼續使用現有 ProductRepository；不把此文件或教學 response 插入 mock 路徑。這個範例僅示範 search，首頁 featured 契約尚未在此重複建立。
