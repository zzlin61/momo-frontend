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

## 第三批：頁面切版完成後的取捨

- 本批完成首頁、搜尋、空結果、狀態與RWD；設計決策見 DESIGN.md。原始計畫不重寫。
- 新增8筆自編商品（總12筆），其中8筆ASICS，讓網格能展示多列；不假裝有真實商品照片、折扣或庫存。
- 使用手繪 SVG 及4種配色而非下載版權不明的產品圖。日後可在授權清楚時替換為本機影像；現有卡片的固定比例降低換圖造成的位移。
- 搜尋在明確提交時執行，無輸入即查，因此不加 debounce。IME組字中不提交，過期回應由 cleanup 失效。
- 品牌與排序用 URL query；按鈕而非 select，避免額外浮層元件與套件。未知legacy query 忽略，無模糊匹配。
- App 預設180ms mock延遲，載入可觀察；錯誤僅測試注入，沒有面向使用者的debug開關。真實adapter替換時需重新確認延遲與重試政策。
- 資料量小，全部顯示而不造假分頁。手機收起側欄以保留兩欄商品；已套用的品牌仍可用篩選標記移除。
- 不做無目的登入、購物車或假商品詳情連結。若日後擴充交易，需要另外的領域與授權需求確認。
- 本機瀏覽器工具無法啟動，改用現有Chrome headless及Node原生CDP smoke；未新增依賴。Python strict audit與designmd CLI驗證未完成，原因見 comparison.md。

## 分層文件批次

- 人類選擇先提交規範與範例，保留現有mock執行路徑，暫不安裝狀態管理套件。
- `src/libs/apiservices`、`store`、`utils` 目前只放Markdown規範及 `.example.ts.md`；編譯時不加入未使用的示範程式。
- 範例response是教學假設，mapper明確驗證unknown；不虛構momo端點或實際HTTP契約。Business模型在資料已足夠時直接重用正規化形狀，不增加無意義的二次拷貝。
- 優點是作業能呈現分工、狀態所有權與未來測試方向；成本是文件本身尚不證明runtime分層，後續遷移需要重新驗證行為。
- 正式遷移時以新module取代舊implementation並更新文件，不長期維護兩套路徑；libs/hooks等實際跨領域重用需求再建立。
