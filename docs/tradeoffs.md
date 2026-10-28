# 現行決策與取捨

本文件描述目前選擇；逐批提案、授權及測試歷程保留於 [AI 協作紀錄](ai-collaboration.md)。原始規劃與實際差異見 [IMPLEMENTATION_PLAN](../IMPLEMENTATION_PLAN.md)。

| 決策 | 選擇與理由 | 成本／限制 | 重新評估條件 |
|---|---|---|---|
| 專案組織 | 單一 Vite app；UI／Business／資料來源三層，層內按商品領域分類 | 沒有獨立 package 或發佈 seam | 第二個獨立應用或真實共用需求 |
| 目錄演進 | entities/features/shared 已按責任搬至 components/libs，不留平行實作 | import 與文件需要同步 | 新領域出現時沿責任分類，不恢復混合目錄 |
| 狀態管理 | URL + 本地 UI state + Business React hooks | 非完整資料快取框架；需自行維護 request lifecycle | 真實跨流程狀態、快取／失效需求；套件需先取得同意 |
| 資料 | typed Promise repository、12筆本機商品／自編詳情 | 無真實庫存、價格或後端契約 | 授權且明確的正式資料契約 |
| DTO | 正式資料已正規化；mapper 僅有未啟用教學範例 | 不能宣稱已做外部 runtime 驗證 | 真實 response 與商品模型有差異 |
| 模型 | Business 以 type alias 重用正規化 record | 資料形狀目前相同，沒有獨立領域轉換 | 出現可售政策等實質業務差異 |
| 樣式／素材 | CSS Modules、全域tokens、自製SVG與系統字型 | 與真站照片及像素有差異 | 有合法素材及人類確認的視覺需求 |
| 搜尋 | 明確提交、無 fuzzy；URL 保存keyword/sort/brand | 無進階分詞或分頁 | 資料量／正式搜尋契約改變 |
| 清單呈現 | 小資料集一次顯示；推薦最多4件 | 無假分頁或無限捲動 | 資料量足以需要分頁 |
| Tabs | 原生button與本地state，不改URL | tab不作深連結或刷新還原 | 人類要求可分享的tab狀態 |
| 推薦 | 同品牌優先的穩定本機規則 | 不是個人化或銷量演算法 | 明確的授權推薦契約 |
| 瀏覽紀錄 | 本機最多8筆canonical IDs，可清除 | storage失敗不保證保存；無跨裝置／分頁即時同步 | 有同步需求且已確認資料政策 |
| 選購確認 | 尺寸／顏色／數量驗證與總額，只有頁面確認 | 沒有cart、付款、登入、訂單 | 人類另行定義交易需求 |
| 品質工具 | strict TypeScript、51個測試、層級檢查、Chrome smoke | lint非ESLint；沒有完整a11y/visual CI | 團隊／交付條件要求且核准工具 |
| 並行協作 | 分離worktree、feature commit再cherry-pick整合 | 要隔離依賴及測試掃描範圍 | 後續有可獨立開發的任務 |

## 撤回與替換成本

資料來源可透過 ProductRepository seam 替換；UI 不需要知道 transport，但實際錯誤、分頁與取消契約必須重新測試。狀態管理替換時保留純規則、URL所有權及使用者行為測試，移除舊implementation，避免兩套canonical state。

照片可取代自製圖像，但需保留圖片比例及合法使用證據；頁面tab若改為URL狀態，須一起修改目前「URL不變」的明確契約與測試。

歷史的四筆fixtures、只建骨架、尚未提交等敘述是 [協作歷程](ai-collaboration.md) 的時點事實，已不作為現行規範。已知程式缺口另見 [comparison](comparison.md)，本次文件整理沒有混入功能修正。
