# productStore.ts — 狀態與意圖契約範例（未啟用）

本檔只有假設的狀態型別與動作契約，**沒有可執行 store implementation**，也沒有引用 Zustand。它示範未來狀態管理套件要承接的行為，不宣稱以下動作已可使用。

```ts
import type { Product, ProductQuery } from './productModel';

export type ProductSearchState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading'; readonly query: ProductQuery }
  | {
      readonly status: 'success';
      readonly query: ProductQuery;
      readonly products: readonly Product[];
    }
  | {
      readonly status: 'error';
      readonly query: ProductQuery;
      readonly message: string;
    };

export interface ProductSearchActions {
  search(query: ProductQuery): Promise<void>;
  retry(): Promise<void>;
  dispose(): void;
}
```

## 未來 implementation 應遵守的生命週期

1. 每個商品搜尋 module instance 有自己的 request identity；組合時注入資料來源 adapter。
2. search 接收由 URL 推導的 query 快照，進入 loading 並建立新的 request identity。
3. 只讓仍有效的請求完成後寫入 success 或 error；success 的空陣列呈現 empty。
4. retry 重新使用最後一次查詢；idle 沒有查詢時為 no-op。
5. dispose 使未完成回應失效；本契約約定為終止該 instance，後續不再呼叫 search/retry。新掛載建立新 instance。
6. Promise<void> 動作的錯誤由狀態承接，不把資料來源 rejection 留給 UI 形成未處理錯誤。UI 的重試按鈕不需理解原始 response 或 Error。
7. 排序／品牌與 count 透過 productRules 投影；loading/error 不投影成成功空清單。請求快照不是第二個可編輯 URL 狀態。

dispose 是持有未完成請求之 module 的正式生命週期能力，與測試專用 reset 不同。若選用 Zustand，可用 actions 與 selector 實現，不要求 Redux 式 dispatch；此處暫不決定套件或訂閱細節。

useProducts已搬至libs/store/products，UI測試仍在app；此文件亦不代表現有流程已實作上述 store 契約。
