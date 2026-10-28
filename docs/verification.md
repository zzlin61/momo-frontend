# 驗證與畫面證據

本文件區分本次CLI檢查與先前功能批次的瀏覽器結果；不以文件更新日期替代證據日期。

## 專案指令

在專案根目錄：

```sh
pnpm check:layers
pnpm lint
pnpm test
pnpm build
```

沒有全域pnpm時可用 `npx --yes pnpm@10.20.0 <指令>`。若工具的sandbox阻止esbuild啟動／讀取父目錄，需要在工具允許的執行環境重新跑；不可把啟動失敗當成測試assertion通過。

- check:layers：檢查src非測試ts/tsx的static import/export；目前30個runtime檔案、94個引用。不是dynamic import／alias的完整分析。
- lint：tsc --noEmit，包含strict及unused檢查；不是ESLint。
- test：Vitest + jsdom，目前10個測試檔、51個案例。include限制src，排除nested worktree副本。
- build：TypeScript + Vite production build。

## 本次文件整理的實際重跑（2026-10-28 +08:00）

| 檢查 | 結果 |
|---|---|
| check:layers | exit0；30個runtime檔案／94個引用 |
| lint | exit0；TypeScript通過 |
| 第一輪全套test，16:14 | 50/51，直接商品URL的title斷言失敗，另有重複React key警告 |
| 單檔ProductPage test，16:15 | 8/8通過 |
| 第二輪全套test，16:15 | 10個檔案／51個測試通過 |
| build，16:15 | exit0；75modules，CSS/JS檔名與上次功能批次相同 |
| Markdown | 15份文件的本機連結／錨點與code fence檢查通過；原始計畫／歷史記事原文、設計tokens保持 |

執行使用已快取pnpm的Node入口，等同上述專案scripts；沒有安裝套件或修改runtime。重跑成功不代表偶發title問題或React key警告已修好，詳見 [已知限制](comparison.md)與 [實際協作紀錄](ai-collaboration.md)。

## 瀏覽器smoke的前置條件

[scripts/browser-smoke.mjs](../scripts/browser-smoke.mjs) 使用Node內建WebSocket/CDP；它不啟動server或Chrome，origin固定127.0.0.1:5174，debugging port固定9224。

第一個終端啟動開發server：

```sh
pnpm dev --host 127.0.0.1 --port 5174
```

Windows另一個PowerShell終端，以獨立profile啟動已安裝Chrome（路徑依本機安裝調整）：

```powershell
$browserProfile = Join-Path (Get-Location) '.browser-profile'
Start-Process -FilePath 'C:\Program Files\Google\Chrome\Application\chrome.exe' -WindowStyle Hidden -ArgumentList @(
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9224',
  ('--user-data-dir="' + $browserProfile + '"'),
  '--no-first-run',
  'about:blank'
)
node scripts/browser-smoke.mjs
```

必須從專案根目錄執行，並使用隔離profile；腳本會新增／清除示範瀏覽紀錄、導航頁面並覆寫docs下的報告及截圖。使用者一般瀏覽資料不應作測試profile。node_modules、dist、.browser-profile與.worktrees已由.gitignore排除。

## 已保存的最近瀏覽器結果

[報告](browser-smoke.json) 的日期為2026-10-28 08:01:37 UTC（16:01:37 +08:00），對應tabs/discovery整合批次。錯誤與外部HTTP陣列皆為空；本次純文件整理不重跑或改寫此報告。

覆蓋：

- 首頁12筆、asics 8筆、ascis空結果；真實Enter搜尋、sort、clear焦點。
- 首頁／搜尋在320、390、701、768、1024、1440px檢查無整頁橫向溢出。
- 商品直接URL、legacy query、找不到商品、選項／數量／總額、換色重設、圖集。
- 商品tabs完整URL不變與鍵盤focus；推薦排除當前；歷史跨頁、刷新還原與clear。
- 手機accessibility tree、原生radio方向鍵、reduced-motion、scrollbar樣式。

coverage受腳本當時的狀態與viewport限制，不代表所有螢幕、錯誤adapter或完整WCAG驗證。錯誤／retry／race／storage故障另由元件與資料測試覆蓋。

## 畫面證據

下列11張PNG保留最近功能批次的實際截圖，並已於產生時視覺檢視：

| 畫面 | 檔案 |
|---|---|
| 首頁桌面 | [home-desktop](screenshots/home-desktop.png) |
| 搜尋桌面 | [search-desktop](screenshots/search-desktop.png) |
| 空結果桌面 | [empty-desktop](screenshots/empty-desktop.png) |
| 首頁手機 | [home-mobile](screenshots/home-mobile.png) |
| 搜尋手機 | [search-mobile](screenshots/search-mobile.png) |
| 商品桌面 | [product-desktop](screenshots/product-desktop.png) |
| 商品手機 | [product-mobile](screenshots/product-mobile.png) |
| 商品手機選項 | [product-mobile-options](screenshots/product-mobile-options.png) |
| Tabs／推薦桌面 | [product-tabs-discovery-desktop](screenshots/product-tabs-discovery-desktop.png) |
| Tabs／推薦手機 | [product-tabs-discovery-mobile](screenshots/product-tabs-discovery-mobile.png) |
| 瀏覽紀錄手機 | [product-history-mobile](screenshots/product-history-mobile.png) |

## 其餘證據與限制

[agent紀錄](README.md#已完成計畫與歷史) 的41／45 tests是各自worktree的當時結果，不能相加作為主專案數量。CLI與瀏覽器的具體失敗、重跑及修正記於 [ai-collaboration](ai-collaboration.md)。

沒有執行完整screen reader、跨平台IME、200%zoom、axe或額外Python/designmd稽核；詳見 [comparison](comparison.md)。
