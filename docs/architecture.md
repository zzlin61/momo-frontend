# 架構

單一Vite SPA，依三層責任組織，沒有monorepo、HTTP端點或狀態管理套件。原始IMPLEMENTATION_PLAN保留為baseline；人類授權的歸屬變更與對照見 [layer-migration.md](layer-migration.md)，詳細規範見 [src/libs](../src/libs/README.md)。

## 現行責任

- app：路由、預設repository建立一次、測試注入與應用外框組合。
- pages：頁面組合、Router keyword/query連接；不持有fixtures或商品排序implementation。
- components/layout：SiteHeader與PageShell；components/search：SearchForm；components/product：商品卡、SVG與結果呈現。它們是UI，不擁有資料來源implementation。
- libs/apiservices/products：ProductRepository interface、mockProductRepository與測試；types/ProductRecord定義正規化資料。
- libs/store/products：productModel重用ProductRecord與資料來源契約、宣告ProductState；useProducts協調請求；productRules提供品牌／排序／數量投影。此處是Business，不代表已導入Zustand。
- libs/utils/formatPrice：UI數字格式化，維持原來NumberFormat('zh-TW')輸出；美元符號及無障礙文案仍由ProductCard負責。
- data/products：原有12筆fixtures與價格不變，僅mock adapter直接讀取；type-import資料來源型別不形成向上依賴。

依賴：UI → Business → 資料來源interface/types；UI → utils；app composition → 具體adapter → fixtures。apiservices不依賴Business或UI，Business不依賴UI。沒有entities/features/shared的舊runtime轉出口或雙重implementation。

## 資料與請求

App的預設mock延遲180ms，透過ProductRepository props注入兩頁；測試可注入受控adapter。useProducts保留revision retry、keyword關聯結果、effect cleanup與過期回應防護。首頁featured與搜尋各有hook instance，不共用一個全域products槽。

mock adapter保留Promise、固定錯誤／延遲、名稱／品牌／tags匹配、空白查詢空結果與回傳複製。沒有加入假設的response DTO或HTTP implementation。ProductRecord與Business Product目前形狀一致，透過type alias重用，不作無差異的資料拷貝。

## URL與UI

Router解碼/search/:keyword，keyword是canonical state。sort/brand存於query，legacy query不影響matching；草稿與IME/focus由SearchForm處理。clear回首頁使舊搜尋cleanup，表單不因route key重建。

SearchPage將state、brand、sort交給productRules投影；不重複保存count或篩選清單。投影保留原排序及品牌語意，不在本次目錄重構改變無效sort或error標題文案等既有行為。範例中的正規化策略尚未啟用。

## 驗證與設計

DESIGN.md記錄設計與canonical UI owner；app/global.css擁有runtime tokens。CSS、SVG與markup保持，沒有UI重設計。原有repository與App行為測試繼續驗證資料與搜尋契約，scripts/browser-smoke.mjs驗證實際瀏覽器流程及RWD。

7份example.ts.md仍是教學文件，與正式ts檔有清楚區分；狀態管理及真實response契約需要未來另外決定。
