# 架構

單一 Vite SPA，沒有 monorepo、全域狀態套件或 UI framework。

- `app/`：入口組合、路由與全域樣式。
- `pages/`：目前首頁與搜尋頁佔位，後續僅組合功能元件。
- `features/search/`：預留搜尋表單及行為。
- `entities/product/`：預留 Product、repository interface、mock adapter 及商品呈現。
- `data/`：預留 fixtures；未來僅 repository/adapter 可直接讀取。
- `shared/layout/`：通用容器，不依賴 pages/features/entities。

依賴方向為 app/pages → features/entities/shared；features → entities/shared。搜尋 keyword 由 Router 解碼後取得，URL 為 canonical state。目前未建立 repository 或資料流程；後續依計畫透過非同步 repository 隔離 fixtures，並在搜尋 hook 防止舊回應覆寫。

## 商品資料層（第二批）

`Product.ts` 定義模型，`ProductRepository.ts` 定義 Promise 介面，`mockProductRepository.ts` 為唯一讀取 `data/products.ts` 的 adapter。fixtures 僅 type-import 商品型別，不引入執行時領域依賴。

`createMockProductRepository({ delayMs, error })` 建立固定行為的 mock。預設零延遲但仍回傳 Promise；設定 delayMs 可觀察 pending，設定 error 使兩個操作 reject。測試使用假時鐘，無隨機延遲或網路。featured 目前按 fixture 順序回傳所有示範商品；搜尋以 trim/lowercase 後的子字串比對名稱、品牌、tags，空白查詢回傳空陣列。每次回傳複製物件及 tags，避免消費端污染後續結果。

頁面尚未接入資料。下一批由 app composition 建立單一 repository instance，再注入搜尋功能與首頁；不在尚無消費端時增加未使用的全域 instance。
