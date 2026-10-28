# momo-frontend

Mocking momoshop 前端作業。目前已完成可執行專案骨架與商品 mock 資料層，完整 P0 規格見 [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)。

## 環境與指令

Node.js >=22.12，pnpm 10.20.0。

```sh
pnpm install
pnpm dev
pnpm lint
pnpm test
pnpm build
pnpm preview
```

若尚未安裝 pnpm，可將上列 `pnpm` 替換為 `npx --yes pnpm@10.20.0`。開發伺服器網址見終端輸出；Vite 開發環境支援直接開啟搜尋路由。

`lint` 目前執行 TypeScript 靜態檢查，並非 ESLint 規則檢查；避免在本批增加未核准的套件。`test` 為一次性執行，互動監看使用 `pnpm test:watch`。

## 目前範圍

- React + strict TypeScript + Vite；React Router 管理 `/` 與 `/search/:keyword`。
- CSS Modules、Vitest、React Testing Library 與路由冒煙測試。
- 首頁與搜尋頁目前只有明確標示的佔位內容。
- 商品型別、非同步 mock repository 與 4 筆本機 fixtures 已完成。資料層支援 `asics` 結果、`ascis` 空結果，以及名稱／品牌／標籤的大小寫不敏感子字串搜尋。空白查詢回傳空陣列。
- 搜尋表單與 loading/error/empty/success 尚未接入頁面，目前瀏覽器仍顯示路由佔位內容。
- 搜尋 query parameters 暫時忽略；不提供模糊搜尋。不存取 momo API 或外部商品資源。

## 架構與後續工作

`app` 組合路由、`pages` 組合頁面、`features/search` 管理搜尋、`entities/product` 管理商品領域、`data` 放 fixtures、`shared` 提供通用元件。空目錄尚無實作，不建立預測性的抽象或 barrel exports。

下一步依序為首頁和搜尋表單、各種結果狀態、可及性與響應式版面。正式 SPA 部署需由主機設定 history fallback。

詳見 [架構](docs/architecture.md)、[取捨](docs/tradeoffs.md)、[協作紀錄](docs/ai-collaboration.md)。

