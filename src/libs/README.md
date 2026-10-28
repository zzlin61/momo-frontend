# libs 分層規範

狀態：**規範與文件範例，尚未接入應用程式**。本次人類決策為先說明分層，維持既有 UI／mock 執行路徑，暫不安裝狀態管理套件。

所有程式範例使用 `.example.ts.md`，其中的 TypeScript code fence 表示未來同名 `.ts` 的內容。它們不是可匯入的 runtime module，也不屬於現有測試覆蓋。範例內相對 import 僅在轉為同名 `.ts` 後成立；不要直接從 UI 匯入這些文件。

## 目錄與責任

| 目錄 | 擁有的責任 | 不放在這裡 |
|---|---|---|
| [apiservices](apiservices/README.md) | 按領域組織資料來源 adapter、params/payload/response types、runtime 檢查與正規化 | UI、store 操作、商品排序等商業政策 |
| [store](store/README.md) | Business module：商品模型、純規則、衍生資料、非同步狀態協調 | React DOM、CSS、外部 response 格式細節 |
| [utils](utils/README.md) | UI 使用的通用純函式，例如金額顯示格式 | 商品政策、資料來源 adapter、帶生命週期的 hook |

`store` 是 Business module 的組織名稱，尚不代表已使用 Zustand。未來的狀態管理 implementation 可替換，純規則不因此依賴套件。`libs` 仍是單一 Vite 應用內的原始碼資料夾，不是 monorepo 或獨立 package。

`libs/hooks` 等有跨領域重用需求再建立。商品探索專用 hook 靠近商品 Business module；處理 DOM／表單草稿的 hook 靠近 UI；只有通用的 React 行為才進共用 hooks。

## 依賴方向

未來目標：

```text
UI ──→ store（Business module）──→ apiservices（資料來源 adapter）
UI ──→ utils／通用 hooks
app composition ──→ 選擇並注入資料來源 adapter
```

- apiservices 不匯入 store、React 或 UI。
- store 可依賴資料來源 interface 與正規化資料，不接收原始 response。
- utils 不匯入 store、apiservices、pages 或 feature domain；需要領域知識的函式留在該領域。
- 共用 hooks 不反向依賴特定商品流程；領域 hook 可使用通用 hook。
- app composition 負責選擇 adapter；目前繼續使用現有 ProductRepository 與 mock implementation。
- types 放編譯期描述，mapper 放 runtime implementation。多領域各自擁有 types，避免單一全站 types 雜物區。

## 狀態所有權

| 資料 | 唯一來源 |
|---|---|
| 已提交的 keyword／sort／brand | Router URL |
| 尚未提交的搜尋文字、IME、focus、展開狀態 | UI 本地狀態 |
| 請求結果、loading／error、重試與 request identity | 未來 Business module |
| 篩選結果、品牌選項、結果數 | 由資料及查詢推導，避免多份獨立 setter |
| 金額顯示字串 | UI formatter |

Business module 可以保存此次 request 使用的 query 快照以辨識結果；它不是可獨立修改的第二個 URL 狀態。首頁 featured 與搜尋的 request scope 要隔離，離開或改變查詢時讓舊回應失效。

## 現況與遷移條件

目前真正執行的流程仍為 `app → pages → useProducts → ProductRepository → mockProductRepository → data/products.ts`。商品型別、搜尋表單、排序、格式化、fixtures 與既有測試位置都未變更。

未來開始遷移時，先選一條商品探索流程，保持既有使用者行為測試，透過同一 interface 驗證 loading/error/retry/stale response。每次完成一個 module 後移除被取代的 implementation，不保留新舊兩套狀態來源。確認使用者採用的狀態管理套件後才安裝；不預先建立未使用的 HTTP adapter 或新增實際端點。

本規範補充原始 IMPLEMENTATION_PLAN 的後續演進；不追溯宣稱既有功能已採三層。詳見 [現行架構](../../docs/architecture.md)。
