# Product tabs, recommendations and recent history plan

> **已完成的歷史計畫。** 準備提交df12543、tabs整合44d62d4、Discovery整合f11c7f7、最終接線2b34f15。兩個worktree保留供檢視；現行行為及驗證見[architecture](../../architecture.md)、[verification](../../verification.md)。下方baseline與agent責任是當時分工。


2026-10-28，人類要求頁內tabs不更改URL，並新增底部商品推薦與瀏覽紀錄；明確要求subagents各開worktree並行。

## Responsibilities and integration

- Tabs agent：components/product/ProductInfoTabs.tsx及CSS、獨立測試。輸入product:ProductDetail、back:string；aria tablist/tab/tabpanel，click與Arrow/Home/End切換；不使用Router/hash/history；換商品重設介紹tab。
- Discovery agent：components/product/ProductDiscovery.tsx及CSS、Business hook/rules、必要的local browser-storage adapter與測試。輸入product:ProductDetail、repository:ProductRepository；從repository取得候選，排除當前、同品牌優先、最多4件；記錄成功瀏覽的canonical stable id，最近在前、去重、最多8筆，顯示時排除當前；提供清除。
- 本機紀錄只存商品id，不存個資或價格；localStorage不可用/內容損壞時不讓頁面失敗，無外部傳送。不能直接讀fixtures，不新增套件。
- Root：ProductPage組合兩個新module，移除舊錨點與重複樣式；整合兩個commit，處理頁面測試、browser smoke、文件、review及最終commit。

## Acceptance

- tabs切換內容而非hash捲動；pathname/query/hash完全不變；正確aria關聯、roving tabindex及鍵盤操作；商品切換重設。
- 推薦與歷史可點進各自商品；推薦不含自己，歷史只來自真實成功瀏覽；重新整理可還原；同品號/stable id不重複；loading/error/empty清楚，清除立即更新。
- 現有商品選購與37baseline測試保留。最終check:layers/lint/test/build及Chrome桌面/手機/鍵盤/URL/歷史跨頁刷新驗證；無外部HTTP。
- 每位agent在獨立worktree工作、提交自己的feature commit，不改ProductPage或共同文件避免衝突；root更新整體協作紀錄。

## Completion

兩個worktree agent各自提交並由root cherry-pick整合。原始分支feat/product-info-tabs與feat/product-discovery及worktree保留；主工作樹51tests、lint、layers、build與Chrome smoke全部通過，另有唯讀review無需修正發現。詳細hash與實際工具限制見ai-collaboration.md。
