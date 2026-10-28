# 初始化取捨

- 依使用者本次要求只完成計畫 Phase 2 第一批骨架，後續 P0 不宣稱完成。
- 使用單一應用與 feature folders；新增第二個需要獨立部署的應用時再評估 workspace，搬移成本為路徑與設定調整。
- React Router 使用 `react-router` 的瀏覽器 API，不需額外 `react-router-dom` 包裝套件。
- `lint` 使用 strict TypeScript 檢查，無風格或 React Hooks 專屬 lint 規則；需要 ESLint 時先取得新增套件同意。
- 保留規劃中的空資料夾，以 `.gitkeep` 追蹤；不預先加入尚未使用的領域程式碼。未來加入實作時移除對應標記即可。
- 僅本機 Git 初始化；未取得 agent commit 授權，不自行 commit，不設定遠端。建議首個訊息：`chore: bootstrap frontend workspace`。

## 商品資料層取捨

- 固定 4 筆自行撰寫的示範品名／價格，品牌名稱僅為搜尋資料，不代表真實商品報價；無圖片與外部請求。
- 使用簡單子字串匹配，無 fuzzy、分詞或排序；空白回傳 []，featured 提供首頁獨立資料入口。未來新增查詢規則只需更改 adapter 與契約測試。
- 預設零延遲，factory 可設定固定 delayMs/error，支援 deterministic UI 測試；沒有新增 MSW 或資料請求套件。真正 API adapter 導入時需重新確認錯誤與延遲語意。
- 每次回傳淺複製商品與 tags，成本隨這個小資料集線性增加，換取消費端隔離；資料量擴大時可改為 readonly contract。
- 這批僅執行既定計畫第二步，尚不實作搜尋 UI，也尚未建立 commit。
