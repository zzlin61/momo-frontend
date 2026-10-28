# 文件索引

最後整理：2026-10-28。現行功能以 [README](../README.md)、程式碼及下列維護文件為準；歷史計畫中的舊路徑、測試數與未完成敘述只描述當時。

## 現行文件

| 文件 | 用途 |
|---|---|
| [AGENTS](../AGENTS.md) | agent 工作流程、依賴規則與授權範圍 |
| [DESIGN](../DESIGN.md) | 視覺 tokens、UI owner 與互動約定 |
| [architecture](architecture.md) | 三層責任、資料流、URL 與狀態所有權 |
| [tradeoffs](tradeoffs.md) | 現行決策、成本及重新評估條件 |
| [comparison](comparison.md) | 參考頁差異、已知缺口與驗證界線 |
| [verification](verification.md) | 執行方式、實際檢查、瀏覽器前置條件及畫面 |
| [libs 規範](../src/libs/README.md) | 各層細節與未啟用範例辨識 |

## 已完成計畫與歷史

| 文件 | 狀態 |
|---|---|
| [原始 IMPLEMENTATION_PLAN](../IMPLEMENTATION_PLAN.md) | 初版兩條路由及 feature folders 的規劃 baseline；頂部列出後續授權差異 |
| [layer-migration](layer-migration.md) | 三層搬遷的歷史對照，已完成 |
| [product-detail plan](superpowers/plans/2026-10-28-product-detail.md) | 商品頁第一版已完成，原錨點設計後來由 tabs 取代 |
| [tabs/discovery plan](superpowers/plans/2026-10-28-product-tabs-discovery.md) | 兩個 worktree 並行功能與整合已完成 |
| [tabs-agent-log](tabs-agent-log.md) | tabs 隔離工作樹當時的 41 tests，不是現行主專案數量 |
| [discovery-agent-log](discovery-agent-log.md) | discovery 隔離工作樹當時的 45 tests，不是現行主專案數量 |
| [ai-collaboration](ai-collaboration.md) | 按時間保留的任務、檢查、限制與提交紀錄 |

歷史文件保留當時事實，不將舊測試數改成最新數量，也不將舊提案追溯寫成已獲核准的新架構。主工作樹與保留的 worktree 可由 `git worktree list` 查核；提交以 `git log` 為準。
