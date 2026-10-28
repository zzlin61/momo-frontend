# 參考差異與已知限制

本作品沿用 momo 熟悉的搜尋與商品資訊結構，內容為本機自編資料與自製SVG。商品參考頁曾以可讀內容確認資訊區塊；沒有真站逐畫面／逐像素驗證，也沒有下載官方圖片或呼叫其API。

## 功能與呈現對照

| 區域 | 本版 | 判定 |
|---|---|---|
| Header／搜尋 | 粉紅文字識別、搜尋框、熱門詞、分類導覽 | approximate |
| 首頁 | 分類、運動主視覺、促銷與商品網格 | approximate |
| 商品圖／價格 | 自製SVG與自編示範報價 | intentional divergence |
| 搜尋 | keyword URL、結果數、品牌及價格排序 | approximate |
| 空結果 | 修正提示、asics建議與回首頁 | approximate |
| 商品詳情 | 圖集、規格選項、數量與本機確認 | approximate |
| 資訊切換 | 本地tabs，不改pathname/query/hash | 人類指定的互動契約 |
| 推薦 | 排除自己、同品牌優先，最多4件 | intentional divergence |
| 瀏覽紀錄 | 成功瀏覽的本機canonical IDs，可清除 | intentional divergence |
| 手機 | 兩欄商品、單欄詳情、可捲動分類導覽 | intentional divergence |
| 會員／cart／交易 | 未提供 | out of scope |

## 已知程式缺口

- 搜尋失敗時，下方error/retry正確，但標題的count為null，仍顯示「商品載入中」。
- 不支援的sort值會保留於query；資料使用原順序，排序按鈕沒有active項。文件範例中的fallback正規化尚未接入。
- 未提供任意未知路徑的全站404；僅商品不存在有明確not-found。
- 瀏覽紀錄儲存不可用時不阻斷詳情，但不保證保存；無跨分頁即時同步。歷史明細單筆失敗／不存在會忽略，不另列錯誤。
- 圖集為自製SVG的示意視角，非官方實拍／真正3D旋轉；數量5與尺寸可選性是demo設定。

- 本次重跑觀察到React重複key警告；[ProductPage](../src/pages/ProductPage.tsx)三個同層商品區塊使用相同product.id作key。此警告尚未修正。
- [ProductPage.test](../src/app/ProductPage.test.tsx)的直接商品URL案例曾因document.title仍為載入文字而失敗（50/51）；單檔8/8與之後全套51/51通過。測試沒有獨立等待title effect，存在時序風險；尚未判定根因或宣稱已根治。

以上維持程式現況，文件整理不修正功能，也不將缺口隱藏在「完整完成」宣稱中。

## 驗證界線

目前有51個測試與11張Chrome截圖；實際範圍及證據日期見 [verification](verification.md)。元件測試涵蓋載入、錯誤、重試及過期回應；Chrome smoke未注入錯誤adapter。

尚未完成完整螢幕閱讀器、多平台實體IME、200%zoom、所有瀏覽器／裝置矩陣、axe掃描、CI或正式部署。合成IME事件測試不等於所有系統輸入法已驗證。

frontend-design-premium的Python audit因當時沒有可用Python runtime未執行，designmd CLI也未安裝；沒有為此增加未核准套件，未宣稱兩者通過。本次不重新檢查或修復該工具環境。

原始計畫時間盒是規劃目標，不是實際耗時證明；提交與 [協作紀錄](ai-collaboration.md) 才是開發歷程來源。
