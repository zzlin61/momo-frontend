# 現行架構

單一 Vite SPA，依三層責任組織。人類授權的搬遷已完成；[舊新歸屬對照](layer-migration.md) 是歷史資料，原始 [IMPLEMENTATION_PLAN](../IMPLEMENTATION_PLAN.md) 的 feature folders 不是目前目錄。

## 責任與依賴

| 位置 | 內容 |
|---|---|
| app | 三條路由、預設 repository 建立與注入、全域樣式／tokens |
| pages | 首頁、搜尋、商品頁組合；Router 路徑／query 與返回來源連接 |
| components/layout、search、product | 導覽、表單、商品卡／圖像、圖集、選購、tabs、推薦及歷史呈現 |
| libs/apiservices/products | ProductRepository、mockProductRepository、recentProductStorage、正規化 record types |
| libs/store/products | productModel、商品投影／選購／推薦規則、useProducts／useProductDetail／useProductDiscovery |
| libs/utils | formatPrice 等 UI 純函式 |
| data | 12 筆商品與由它們產生的本機詳情 fixtures |

依賴為 UI → Business → 資料來源 interface/types；UI → utils；app composition → 具體 mock adapter → fixtures。只有資料 adapter 直接讀 fixtures；資料來源不匯入 Business／UI，Business 不匯入 UI。fixture 的 type-import 不形成反向 runtime 依賴。

ProductRecord／ProductDetailRecord 由資料來源定義；Business Product／ProductDetail 重用其形狀，沒有為層數增加無差異資料拷貝。ProductRepository 透過 Business 型別入口提供 UI 使用，具體 adapter 僅由 app 組合。

`libs/store` 目前使用 React hook，不代表已採用 Zustand；純規則不依賴 React。`libs/hooks` 尚未建立。7 份 example.ts.md 仍是文件，並非正式 mapper 或已啟用 store。

## 資料來源

ProductRepository 有三個 Promise 操作：

- listFeatured：依 fixture 順序回傳商品。
- search：trim 後以名稱／品牌／tags 作大小寫不敏感的子字串匹配；空白回傳空陣列，無 fuzzy。
- getById：接受 stable ID 或 productCode，成功回傳詳情，未找到回傳 null。

預設 app adapter 延遲180ms；factory 可指定固定 delay/error。清單複製商品及 tags，詳情以 structuredClone 隔離巢狀資料。沒有 HTTP endpoint、外部商品圖片或真實 response；教學 DTO 文件不介入現有資料流。

第一筆原 ID demo-asics-01 另外有 productCode 15745582。兩者查到同一個 canonical 商品，不代表與官方商品名稱／價格一致。

## 狀態所有權

| 資料 | Owner |
|---|---|
| 搜尋 keyword／sort／brand、商品路徑 ID | Router |
| 搜尋草稿、IME、focus、選項、數量、tab | UI 本地狀態 |
| 載入／失敗／重試與失效請求判斷 | Business hooks |
| 品牌選項、清單排序、數量、推薦與選購總額 | Business 純規則 |
| 最近商品 ID 的去重／順序／八筆上限 | Business |
| localStorage 存取與損毀／禁用容錯 | recentProductStorage adapter |
| 金額顯示字串 | UI formatter |

useProducts 保留 keyword/revision 對應結果與 cleanup；useProductDetail 另外以 repository/productId/revision 識別結果。useProductDiscovery 對同 repository/key 共享尚未完成的請求，完成後即移除，不是永久快取。cleanup 與結果識別阻止舊回應，清除歷史亦使舊結果失效。

## 路由與呈現

搜尋明確提交才執行，沒有輸入即查，因此未加 debounce。空白與 IME 組字不導航，clear 返回首頁且保留輸入焦點。URL sort/brand 由 SearchPage 傳給 productRules，legacy query 不影響 matching。

商品卡以 Link 與 Router state 保留來源；返回僅接受 / 或 /search/ 開頭的內部路徑，無可用 state 時回品牌搜尋。詳情 legacy query 忽略。換商品以 canonical product.id 重設購買草稿、tabs 與 discovery。

ProductInfoTabs 使用 tablist/tab/tabpanel、roving tabindex、方向鍵／Home／End，只更新本地 state，不改 pathname/query/hash。ProductPurchase 的原生 radio／fieldset 保有鍵盤語意；Business 驗證尺寸可選性及整數數量1–5，確認僅本頁顯示，不建立訂單。

## 推薦與瀏覽紀錄

推薦由 listFeatured 提供候選，排除當前及重複 ID，同品牌優先、其餘保持來源順序，最多4件。推薦 loading/error/retry 獨立於商品詳情。

成功詳情掛載 discovery 後，canonical ID 以最近在前、去重、最多8筆寫入 `momo.recent-products.v1`。儲存只含 ID，不含價格、時間戳或個資；顯示排除當前，歷史明細 null／單筆失敗會忽略。清除立即更新畫面。

storage adapter 對 JSON 損毀或瀏覽器禁用回傳空值／忽略寫入，讓商品頁繼續使用；沒有保證故障後的跨頁／刷新保存，也沒有跨分頁即時同步或跨裝置同步。

## 驗證與文件

[check:layers](../scripts/check-layers.mjs) 檢查 runtime 靜態 import/export，排除測試；目前不解析 dynamic import 或未來 path alias。Vitest 僅掃 src，避免 nested worktrees 重複計數。

[驗證說明](verification.md) 區分當前 CLI 檢查與上次瀏覽器證據；[已知限制](comparison.md) 記錄尚未修正的既有行為，不能把教學範例的正規化策略宣稱已在 runtime 啟用。
