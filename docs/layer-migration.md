# 三層目錄歸屬與搬遷計畫

> **歷史對照，已完成於5759aeb。** 下方23個測試及當時範圍是搬遷批次結果，不是現行測試數。後續商品頁、tabs與Discovery已擴充；現行所有權見[architecture](architecture.md)，最新驗證見[verification](verification.md)。


2026-10-28，人類授權先更新歸屬對照，確認無衝突後執行搬遷；不安裝狀態管理套件、不改畫面或mock資料。本文件為原始IMPLEMENTATION_PLAN的後續補充。

| 舊位置 | 新位置 | 責任 |
|---|---|---|
| entities/product/Product.ts | libs/apiservices/products/types/ProductRecord.ts | 本機資料來源正規化型別 |
| 商品模型及狀態型別 | libs/store/products/productModel.ts | Business模型；重用ProductRecord形狀，集中狀態契約 |
| entities/product/ProductRepository.ts | libs/apiservices/products/ProductRepository.ts | 資料來源interface |
| entities/product/mockProductRepository.ts及測試 | libs/apiservices/products/ | mock adapter與資料契約測試 |
| entities/product/useProducts.ts | libs/store/products/useProducts.ts | 現有React狀態協調，不導入Zustand |
| SearchPage內品牌／排序／數量推導 | libs/store/products/productRules.ts | Business純投影，保持既有語意 |
| entities/product/ProductCard、Artwork、Results及CSS | components/product/ | UI商品呈現 |
| features/search/SearchForm及CSS | components/search/ | 表單草稿、導頁、IME、focus |
| shared/layout/PageShell及CSS | components/layout/ | UI容器 |
| app/SiteHeader及CSS | components/layout/ | UI導覽與搜尋表單組合 |
| ProductCard金額數字格式化 | libs/utils/formatPrice.ts | UI純函式；保留原有顯示結果 |
| app、pages、data | 原處 | 組合、路由與頁面、fixtures |

## 搬遷前確認

- 資料來源不能依賴Business，因此ProductRecord定義在apiservices/types；Business重用此資料形狀，不建立反向import。
- UI透過Business模型／hook使用資料，只有app composition選擇具體mock adapter。fixtures僅由adapter讀取，type-import資料來源型別不產生執行時依賴。
- React hook作為Business狀態implementation保留，純規則不依賴React。libs/store不宣稱已安裝任何狀態管理套件。
- 原始7份 `.example.ts.md` 仍為未啟用的教學文件，不直接改成正式程式，也不與同名runtime檔混淆。
- URL、request cleanup／retry、mock查詢與資料複製、卡片CSS及所有使用者行為測試保持。

## 驗收

原有23個測試、TypeScript與build通過；瀏覽器smoke回歸；舊entities/features/shared空目錄移除，沒有相容轉出口或兩套implementation。檢查libs/apiservices不依賴store/UI、Business不依賴UI、utils不依賴上層；同步更新現行規範與設計owner路徑。

## 完成狀態

2026-10-28已依對照完成搬遷。23個既有測試、TypeScript、build、check:layers與Chrome browser smoke通過；未新增狀態管理依賴。正式檔案與未啟用範例均已在各層README標示。
