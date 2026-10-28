# 對照與限制

本次依既定作業文字需求與 momo 熟悉的資訊結構實作。沒有抓取真站或執行真站逐畫面比較；以下是預期結構差距，不是像素一致性報告。

| 區域 | 本版 | 狀態 |
|---|---|---|
| 共享 header／搜尋 | 粉紅文字識別、搜尋框、熱門詞、分類導覽 | approximate |
| 首頁 | 分類側欄、運動主視覺、兩塊促銷、精選商品 | approximate |
| 商品網格 | 自製 SVG、品牌、名稱、標籤、NTD價格 | intentional divergence |
| 搜尋 | URL keyword、結果數、排序、品牌篩選 | approximate |
| 空結果 | 示意圖、修正提示、asics建議、回首頁 | approximate |
| 手機版 | 水平導覽、兩欄卡片、隱藏側欄 | intentional divergence |
| logo／產品照片／實際優惠 | 無官方圖像資產，只有文字辨識與自編資料 | intentional divergence |
| 會員／購物車／交易／詳情頁 | 本次不提供 | missing / out of scope |

## 驗證界線

- 已檢視5張瀏覽器截圖；桌面1440×1100與手機390×844的首頁／搜尋，另有桌面空結果。
- 測試 loading/error/retry/stale response 為元件測試；瀏覽器 smoke 未注入錯誤 adapter。
- 未做完整螢幕閱讀器、各系統 IME、200% zoom、所有瀏覽器／裝置矩陣或自動 axe 掃描。
- frontend-design-premium 的 Python audit 無可用 Python runtime；DESIGN.md 專屬 CLI 未安裝，未為此引入未核准套件。這兩項未完成，不宣稱 static strict audit 或 designmd lint 已通過。
- 原始 IMPLEMENTATION_PLAN.md 不改寫；完整計畫的時間目標不是本次實際耗時宣稱。提交及協作紀錄維持真實時間。
