# 架構

單一 Vite SPA；依賴方向為 app/pages → features/entities/shared、features → entities/shared。shared 不匯入上層，沒有 feature 間互相依賴或 barrel exports。

## 組合與資料

- app/App.tsx 在 composition boundary 建立單一 mock repository，透過 props 將 ProductRepository 傳給兩頁；App 可注入替代 repository 供測試。
- pages 只組合靜態版面、商品結果與搜尋控制，不持有 fixtures。SearchPage 的排序與品牌為 URL query 狀態。
- entities/product/Product.ts 與 ProductRepository.ts 定義領域與 Promise 契約。
- mockProductRepository.ts 是唯一讀取 data/products.ts 的執行時 adapter；fixtures 僅 type-import 商品模型。
- useProducts 負責 request lifecycle、revision retry 與 effect cleanup。結果連同 keyword/revision 保存，route 改變時立即顯示 loading；已失效的 Promise 無法覆寫新資料。
- ProductCard、ProductArtwork、ProductResults 是首頁與搜尋頁共用的商品呈現。SVG 沒有遠端圖片來源，穩定 viewBox 保留幾何比例。
- app/SiteHeader 組合 feature SearchForm 與導覽。shared/PageShell 只提供自然流動的 main 容器。

## URL 與表單

/search/:keyword 經 Router 解碼，表單本地 state 只是草稿，keyword 改變時同步回填。不在輸入時請求；僅顯式提交，trim 後空值／IME 組字不導頁。clear 導回首頁使搜尋 request cleanup，立即清空並保留欄位焦點。表單不因 route key 重建。

sort 與 brand 存於 query，排序／篩選在固定小資料集上執行；legacy _isFuzzy/searchType 不參與 matching。按鈕排序不引入 Select 套件。首頁與結果均一次呈現全部小資料集，不建立虛假的頁數。

## Adapter 與錯誤

createMockProductRepository({ delayMs, error }) 支援固定行為。預設 app 延遲180ms，可見載入狀態；測試可使用零延遲、假時鐘或受控 Promise。respond 複製商品與 tags，避免外部修改污染 fixtures。未來替換授權 API adapter 時保留介面與 UI state 契約。

## 設計與驗證

DESIGN.md 記錄設計意圖與 canonical owners；src/app/global.css 擁有 runtime tokens。搜尋表單與結果元件無重複實作，無 UI framework。

repository tests 驗證資料契約；App integration tests 驗證使用者操作；scripts/browser-smoke.mjs 使用 Node 內建 WebSocket 操作隔離 Chrome，無新增應用依賴。瀏覽器截圖、結果與限制列於 docs。

## 後續三層規範與範例（未接入）

人類已確認先新增 [src/libs 分層規範](../src/libs/README.md)，包含 apiservices、store（Business）與 UI utils。未來共用 hooks 有實際需要再建立。範例採 `.example.ts.md`，不是可執行或可匯入的 module；未安裝狀態管理套件，也未搬移目前頁面、hook、mock 或 fixtures。

此為原始計畫後續的設計補充，不代表現行程式已完成三層遷移。實際遷移需另行確認範圍，維持 URL 狀態所有權、adapter seam 與現有使用者行為測試。
