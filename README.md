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
- `/product/15745582`：商品詳情示範；所有商品卡可進入自己的 `/product/:productId`，支援直接載入及原搜尋條件返回。
- 商品頁含自製圖集、顏色／尺寸／數量、規格及選購確認；無真實購物車或訂單，尺寸可選性為示範設定。
- 商品介紹／商品規格／選購說明以頁內tabs切換，不改變pathname、query或hash；支援左右鍵及Home／End。
- 底部商品推薦排除目前商品，同品牌優先、最多4件；瀏覽紀錄依真實成功瀏覽記錄，去重並只存本機最多8筆商品ID，可清除並於刷新還原。
- 其他關鍵字：依名稱／品牌／標籤作大小寫不敏感的子字串比對，trim 後空白不導頁。
- 搜尋可用 Enter；IME 組字時不提早提交。clear 清空並回首頁，保留搜尋欄焦點。
- 搜尋路徑為 keyword 狀態來源；直接載入、重新整理、返回均由 Router 還原。
- 價格排序及品牌篩選存於 `?sort=price-asc|price-desc|recommended&brand=...`；legacy `_isFuzzy`、`searchType` 忽略。
- 非同步資料顯示 loading／error（可重試）／empty／success，忽略已失效的回應。
- 桌面最多4欄、手機2欄；窄版收起側欄但保留搜尋、排序與已套用品牌的清除操作。

12 筆自編示範商品與價格不是正式報價。首頁目前列出全部示範商品；不模擬分頁、折扣、銷售數或庫存。

## 架構

```text
src/app/              路由、repository composition、全域 tokens
src/pages/            頁面組合、Router狀態連接
src/components/       layout／search／product UI
src/libs/apiservices/ 資料來源契約、正規化型別、mock adapter
src/libs/store/       Business模型、商品規則、React狀態hook
src/libs/utils/       UI純函式
src/data/             fixtures，僅供 mock adapter 直接讀取
```

預設 repository 在 app 建立一次，頁面接收介面，測試可注入受控 adapter。沒有全域狀態套件、UI framework 或新增套件；保留原始 [實作計畫](IMPLEMENTATION_PLAN.md)。

## 驗證與畫面

51 個 repository／Business／UI 測試涵蓋搜尋、空結果、資料隔離、延遲、錯誤、重試、清除焦點、IME、排序、品牌篩選與過期回應。實際紀錄見 [協作紀錄](docs/ai-collaboration.md)。

[瀏覽器 smoke 報告](docs/browser-smoke.json) 使用已安裝 Chrome headless，檢查1440px與390px、真實 Enter 搜尋、價格排序、空結果、focus、無整頁溢出與無外部請求。重跑需要本機 dev 5174、隔離 Chrome 的9224 debugging port，再執行 `node scripts/browser-smoke.mjs`；無額外套件。腳本不碰個人 profile。

- [首頁桌面](docs/screenshots/home-desktop.png)
- [搜尋桌面](docs/screenshots/search-desktop.png)
- [空結果桌面](docs/screenshots/empty-desktop.png)
- [首頁手機](docs/screenshots/home-mobile.png)
- [搜尋手機](docs/screenshots/search-mobile.png)
- [商品頁桌面](docs/screenshots/product-desktop.png)
- [商品頁手機](docs/screenshots/product-mobile.png)
- [商品頁手機選項](docs/screenshots/product-mobile-options.png)
- [商品tabs與推薦桌面](docs/screenshots/product-tabs-discovery-desktop.png)
- [商品tabs與推薦手機](docs/screenshots/product-tabs-discovery-mobile.png)
- [瀏覽紀錄手機](docs/screenshots/product-history-mobile.png)

## 取捨、差距與後續

此版保留 momo 粉紅搜尋與電商資訊結構，但採用原創運動選物視覺；沒有逐像素比較，也未複製真站圖片或 logo 檔。會員、持久化購物車、結帳、完整分類、分頁與進階篩選不在本次範圍。商品卡使用真實連結進入本機詳情頁；選購確認僅顯示此次選擇，不送出訂單。

下一步由人類檢視切版，再調整密度、字級、品牌色及主視覺。未來有授權 API 時替換 repository adapter，再加分頁、契約測試、CI／正式部署與更完整的無障礙檢查。

詳見 [設計](DESIGN.md)、[架構](docs/architecture.md)、[取捨](docs/tradeoffs.md)、[差異矩陣](docs/comparison.md)。

## 分層規範範例

新增的 [src/libs](src/libs/README.md) 說明 apiservices、store（Business）與 UI utils 的責任、依賴方向及7份TypeScript文件範例。所有 `.example.ts.md` 均未接入應用程式；正式程式已依[歸屬對照](docs/layer-migration.md)搬遷至components及libs，保持原UI/mock語意。沒有狀態管理套件或真實HTTP呼叫。未來再依實際需求建立 libs/hooks。


搬遷後可執行 `pnpm check:layers` 驗證靜態依賴方向；此腳本使用現有TypeScript套件，沒有新增dependency。實際資料與UI不變，Business仍使用React hook。
