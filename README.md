# momo-frontend

Mocking momoshop 前端展示作品，包含首頁、搜尋與商品詳情。使用 React、strict TypeScript、Vite、React Router、CSS Modules、Vitest／React Testing Library 與 pnpm；資料來自本機 mock，圖像為自製 SVG。沒有 momo API、外部圖片或交易服務。

## 安裝與執行

需求：Node.js >=22.12、pnpm 10.20.0。版本與指令以 [package.json](package.json)、[pnpm-lock.yaml](pnpm-lock.yaml) 為準。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check:layers
pnpm lint
pnpm test
pnpm build
pnpm preview
```

未安裝 pnpm 時可將指令中的 `pnpm` 替換為 `npx --yes pnpm@10.20.0`。開發及 preview 網址以終端輸出為準；`lint` 目前是 TypeScript 檢查，未配置 ESLint 或 formatter。監看測試使用 `pnpm test:watch`。

直接重新整理深層路由在 Vite dev 可用；正式 SPA 主機需要 history fallback。瀏覽器 smoke 的專用啟動方式見 [驗證說明](docs/verification.md)。

## 支援流程

| 路由 | 內容 |
|---|---|
| `/` | 搜尋導覽、分類、活動主視覺、12 筆精選商品 |
| `/search/:keyword` | 依名稱／品牌／tags 作大小寫不敏感的子字串搜尋 |
| `/search/asics` | 8 筆 ASICS 示範商品 |
| `/search/ascis` | 空結果、修正提示與搜尋建議 |
| `/product/:productId` | 商品詳情、圖集、規格選項與示範確認 |
| `/product/15745582` | 第一筆 mock 商品的示範品號；不是即時官方商品資料 |

搜尋提交 trim 後導頁，空白或 IME 組字中不提交；clear 回首頁並保留搜尋欄焦點。keyword 由 URL 還原，sort／brand 存於 query。支援 `sort=recommended|price-asc|price-desc`；舊 `_isFuzzy`、`searchType` 不參與匹配。

商品卡可進入各自詳情。從首頁／搜尋進入時，Router state 保留來源路徑與 query；重新直接開啟且無來源 state 時，返回連結預設前往品牌搜尋。

商品頁提供：

- 自製圖集、顏色／可選尺寸、1–5 件數量與本機選購確認；換色重選尺寸，換商品重設草稿。
- 商品介紹／規格／選購說明 tabs，滑鼠、左右鍵／Home／End 切換，pathname／query／hash 不變。
- 最多 4 件推薦，排除當前商品、同品牌優先。
- 成功瀏覽後記錄 canonical 商品 ID，最近在前、去重、最多 8 筆；顯示排除當前商品，可清除。僅存本機 localStorage；儲存不可用時無法保證跨刷新保存。

loading、error／retry、空結果與詳情 not-found 有明確狀態，失效回應不覆寫新查詢。商品、價格、配色、尺寸可選性與數量限制全為示範；確認不建立購物車、付款或訂單。

## 三層架構

```text
src/
├── app/                      路由、依賴組合、全域 tokens
├── pages/                    頁面組合與 Router 連接
├── components/               layout／search／product UI
├── libs/
│   ├── apiservices/products/ 資料契約、mock adapter、本機儲存
│   ├── store/products/       Business 模型、規則與 React 狀態 hook
│   └── utils/                UI 通用純函式
└── data/                     本機 fixtures
```

UI → Business → 資料來源 interface；app composition 選擇具體 adapter。未安裝 Zustand 或其他狀態管理套件，`store` 是責任分類。舊 entities／features／shared 已搬遷，沒有平行實作；詳見 [現行架構](docs/architecture.md)。

[src/libs](src/libs/README.md) 另保留 7 份明確標示、未接入 runtime 的 `.example.ts.md`。範例的假設 DTO 與 store 契約不是現行後端或已啟用功能。未有跨領域重用需求，因此沒有建立 libs/hooks。

## 驗證與限制

目前主專案有 10 個測試檔、51 個測試；包含資料契約、搜尋、選購規則、tabs、推薦、儲存故障與整合流程。Vitest 限定 `src`，避免重複掃描保留的 `.worktrees`。

[驗證說明](docs/verification.md) 收錄實際指令、結果、Chrome smoke 前置條件與覆蓋範圍；[瀏覽器報告](docs/browser-smoke.json) 及 [11 張截圖](docs/verification.md#畫面證據) 保留最近功能批次的證據，並非每次文件修改都重跑瀏覽器。

沒有逐像素一致性宣稱、真實庫存、會員、持久化購物車、結帳、分頁、進階篩選或正式部署。已知搜尋狀態／無效排序與測試工具限制詳見 [差距與限制](docs/comparison.md)。

## 文件入口

- [文件索引](docs/README.md)：區分現行規範、完成計畫與歷史紀錄。
- [設計](DESIGN.md)、[架構](docs/architecture.md)、[取捨](docs/tradeoffs.md)。
- [原始計畫與後續差異](IMPLEMENTATION_PLAN.md)：保留初始提案，不作現行指令來源。
- [真實協作與提交紀錄](docs/ai-collaboration.md)：包含 worktree 並行與整合。

後續先由人類檢視版面與互動；若獲授權提供正式資料契約，再替換 adapter、補契約測試與 URL 分頁，接續 CI、部署與更完整的無障礙驗證。
