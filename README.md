# momo-frontend

Mocking momoshop 前端展示：React、strict TypeScript、Vite、React Router、CSS Modules、pnpm、Vitest、React Testing Library。全程使用本機模擬資料與自製 SVG，沒有 momo API、爬取、外部圖片或交易服務。

## 安裝與執行

Node.js >=22.12，pnpm 10.20.0。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm test
pnpm build
pnpm preview
```

若未安裝 pnpm，可將上列 pnpm 替換為 `npx --yes pnpm@10.20.0`。目前工作環境已啟動的預覽為 http://127.0.0.1:5174 。新啟動的 dev 以終端輸出網址為準。

`lint` 是 TypeScript 靜態檢查，尚非 ESLint；沒有額外 formatter。測試一次性執行，監看模式為 `pnpm test:watch`。正式 SPA 部署需設定 history fallback；Vite 開發環境可直接載入搜尋路由。

## 可用流程

- `/`：共享搜尋導覽、商品分類、運動主視覺、精選商品、生活提案與 footer。
- `/search/asics`：8 筆 ASICS 示範商品。
- `/search/ascis`：明確空結果與可操作的搜尋建議。
- 其他關鍵字：依名稱／品牌／標籤作大小寫不敏感的子字串比對，trim 後空白不導頁。
- 搜尋可用 Enter；IME 組字時不提早提交。clear 清空並回首頁，保留搜尋欄焦點。
- 搜尋路徑為 keyword 狀態來源；直接載入、重新整理、返回均由 Router 還原。
- 價格排序及品牌篩選存於 `?sort=price-asc|price-desc|recommended&brand=...`；legacy `_isFuzzy`、`searchType` 忽略。
- 非同步資料顯示 loading／error（可重試）／empty／success，忽略已失效的回應。
- 桌面最多4欄、手機2欄；窄版收起側欄但保留搜尋、排序與已套用品牌的清除操作。

12 筆自編示範商品與價格不是正式報價。首頁目前列出全部示範商品；不模擬分頁、折扣、銷售數或庫存。

## 架構

```text
src/app/              路由、repository composition、header、全域 tokens
src/pages/            首頁與搜尋頁組合
src/features/search/  共用搜尋表單與導頁行為
src/entities/product/ 型別、repository、async hook、卡片及結果狀態
src/data/             fixtures，僅供 mock adapter 直接讀取
src/shared/layout/    不依賴上層功能的頁面容器
```

預設 repository 在 app 建立一次，頁面接收介面，測試可注入受控 adapter。沒有全域狀態套件、UI framework 或新增套件；保留原始 [實作計畫](IMPLEMENTATION_PLAN.md)。

## 驗證與畫面

23 個 repository／UI 測試涵蓋搜尋、空結果、資料隔離、延遲、錯誤、重試、清除焦點、IME、排序、品牌篩選與過期回應。實際紀錄見 [協作紀錄](docs/ai-collaboration.md)。

[瀏覽器 smoke 報告](docs/browser-smoke.json) 使用已安裝 Chrome headless，檢查1440px與390px、真實 Enter 搜尋、價格排序、空結果、focus、無整頁溢出與無外部請求。重跑需要本機 dev 5174、隔離 Chrome 的9224 debugging port，再執行 `node scripts/browser-smoke.mjs`；無額外套件。腳本不碰個人 profile。

- [首頁桌面](docs/screenshots/home-desktop.png)
- [搜尋桌面](docs/screenshots/search-desktop.png)
- [空結果桌面](docs/screenshots/empty-desktop.png)
- [首頁手機](docs/screenshots/home-mobile.png)
- [搜尋手機](docs/screenshots/search-mobile.png)

## 取捨、差距與後續

此版保留 momo 粉紅搜尋與電商資訊結構，但採用原創運動選物視覺；沒有逐像素比較，也未複製真站圖片或 logo 檔。會員、購物車、結帳、完整商品分類、詳情頁、分頁與進階篩選不在本次範圍。商品卡是可讀 article，不假裝能打開尚未存在的詳情頁。

下一步由人類檢視切版，再調整密度、字級、品牌色及主視覺。未來有授權 API 時替換 repository adapter，再加分頁、契約測試、CI／正式部署與更完整的無障礙檢查。

詳見 [設計](DESIGN.md)、[架構](docs/architecture.md)、[取捨](docs/tradeoffs.md)、[差異矩陣](docs/comparison.md)。
