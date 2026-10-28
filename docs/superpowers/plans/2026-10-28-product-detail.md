# Product detail implementation plan

Goal: 新增 /product/:productId 與可直接開啟的15745582示範詳情頁，保留現有三層、mock與搜尋行為。
Architecture: apiservices擴充getById與detail record；data提供自編規格；Business hook負責讀取、重試與過期回應，純規則驗證選項；UI負責圖集、尺寸顏色、數量及本機選購確認。
Tech stack: 沿用React/TS/Vite/Router/CSS Modules與既有測試套件，不新增狀態管理。

## Scope and design

- 人類本次要求授權將初版兩條路由擴充為商品詳情；原始IMPLEMENTATION_PLAN保持baseline，AGENTS同步註記新授權。
- 保留12筆商品與既有id、名稱、價格；第一筆另有productCode15745582對應參考網址，但不是實際momo商品資料。所有卡片進入各自詳情。
- 上半部左圖集右商品資訊；價格粉紅區、native fieldset/radio選色與尺寸、數量加減、選購確認。下半部描述/規格錨點。手機改單欄。
- 自製SVG用不同視角呈現，不抓取真站圖。參考讀取只使用web可讀頁面，不呼叫momo API。
- 無登入、結帳、付款、持久化cart或假庫存承諾。本機選購確認透過inline status說明所選顏色/尺寸/數量與示範性質。

## Tasks

- [x] 先寫getById測試：穩定id/品號、找不到null、detail資料隔離、錯誤與延遲。觀察缺少getById失敗，再實作record/interface/fixtures/adapter。
- [x] 先寫商品UI測試：直接URL及legacy query、卡片導頁、loading/error/retry/not-found、選項驗證、換色清除尺寸、數量上下限與確認、不同商品切換不被舊回應覆寫。觀察缺失頁面失敗，再實作Business/UI。
- [x] 補純選購規則測試與實作，UI只觸發與呈現；不將DOM/Router寫入Business。
- [x] 型別、整套測試、check:layers、build；Chrome桌面/手機商品頁與操作smoke、截圖與無外部請求。
- [x] 獨立唯讀review、修正實質問題、更新README/architecture/tradeoffs/DESIGN/AI紀錄後提交。

## Review focus

快速商品切換/卸載；找不到商品與載入失敗區分；禁用尺寸/換色重置；數量非法值與上限；選購確認更新不得顯示過期選項；返回搜尋保留sort/brand；長標題及320px無橫向溢出；新repository契約所有測試adapter均相容。
