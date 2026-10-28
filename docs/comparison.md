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
| 商品詳情頁 | 圖集、規格、選項與本機選購確認 | approximate |
| 會員／持久化購物車／交易 | 本次不提供 | missing / out of scope |

## 驗證界線

- 已檢視5張瀏覽器截圖；桌面1440×1100與手機390×844的首頁／搜尋，另有桌面空結果。
- 測試 loading/error/retry/stale response 為元件測試；瀏覽器 smoke 未注入錯誤 adapter。
- 未做完整螢幕閱讀器、各系統 IME、200% zoom、所有瀏覽器／裝置矩陣或自動 axe 掃描。
- frontend-design-premium 的 Python audit 無可用 Python runtime；DESIGN.md 專屬 CLI 未安裝，未為此引入未核准套件。這兩項未完成，不宣稱 static strict audit 或 designmd lint 已通過。
- 原始 IMPLEMENTATION_PLAN.md 不改寫；完整計畫的時間目標不是本次實際耗時宣稱。提交及協作紀錄維持真實時間。

## 商品詳情對照補充

已新增商品詳情：左圖集、右標題／價格／選項、下方介紹／規格／說明，屬approximate資訊結構。參考頁以web可讀內容確認品號、圖集與顏色／尺寸／數量等區塊；沒有擷取真站圖片、API或宣稱pixel parity。商品名稱及價格維持本機mock。

商品卡與詳情頁的原missing狀態已由本次擴充實現；會員、持久化cart與交易仍不提供。新增桌面／手機詳情截圖與本機選購流程smoke，完整錯誤重試與快速切換仍由整合測試驗證。

## 商品tabs與底部探索補充

依人類本次明確要求，介紹／規格／選購說明已改為本地tab面板，不再用hash錨點；底部有可點商品推薦與真實瀏覽紀錄，仍使用自編mock商品。Chrome驗證URL完全不變、鍵盤focus、跨商品與重新整理還原／清除；並保存桌面與手機截圖。這不是對真站推薦演算法或跨裝置歷史的複製。
