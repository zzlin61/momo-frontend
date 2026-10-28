# libs 分層規範

狀態：**已完成既有程式歸屬搬遷，仍使用原本 React hook 與 mock 資料；未安裝狀態管理套件**。歸屬對照見 [搬遷紀錄](../../docs/layer-migration.md)。

## 現行目錄

```text
src/
├── app/                      # 路由與依賴組合
├── pages/                    # UI頁面與URL連接
├── components/               # UI呈現與互動
│   ├── layout/
│   ├── product/
│   └── search/
├── libs/
│   ├── apiservices/products/ # interface、mock adapter、正規化資料型別
│   ├── store/products/       # Business模型、規則、useProducts狀態協調
│   └── utils/               # UI通用純函式
└── data/                    # fixtures，僅adapter直接讀取
```

| 目錄 | 責任 | 規範 |
|---|---|---|
| apiservices | 按領域組織資料來源interface與adapter、資料格式 | [資料來源規範](apiservices/README.md) |
| store | Business模型、純規則、衍生資料與非同步狀態 | [Business規範](store/README.md) |
| utils | UI通用純函式，不承擔商品政策或資料請求 | [utils規範](utils/README.md) |

libs 是單一Vite應用的原始碼資料夾，不是獨立package。entities、features、shared 的舊位置已由上述責任位置取代，不保留相容轉出口。app composition 是選擇具體adapter的地方；UI透過Business模型與hook取得商品。

## 依賴方向

```text
UI → store（Business）→ apiservices（interface/types）
UI → utils
app composition → 具體mock adapter → data fixtures
```

- apiservices 不依賴store或UI；型別位於各領域types，執行時清洗位於mapper。
- Business使用資料來源interface，狀態implementation目前為React hook；純規則不依賴React。store 不代表已採用Zustand。
- utils 不匯入資料來源、Business或特定畫面。
- ProductRecord 位於apiservices；Business暫以Product型別重用其形狀，避免資料來源反向依賴Business及無意義的二次映射。
- Business的productModel提供型別入口，沒有runtime adapter轉出口。只有mock adapter讀取fixtures。
- 暫不建立libs/hooks；有跨領域重用的React行為才抽取。商品專用hook仍靠近商品Business module。

## 狀態所有權

| 資料 | 唯一來源 |
|---|---|
| 已提交keyword/sort/brand | Router URL |
| 輸入草稿、IME、focus、展開狀態 | UI本地狀態 |
| 結果、loading/error、retry、請求失效 | Business useProducts |
| 品牌選項、篩選排序與結果數 | productRules即時計算 |
| 金額顯示字串 | UI formatter |

URL與請求快照不是兩個可分別修改的查詢來源。首頁與搜尋各自呼叫hook，沒有共用單一products槽；effect cleanup使舊回應失效。

## 教學範例與正式程式

所有 `.example.ts.md` **仍是未啟用的文件範例**，不參與runtime或現有測試。範例內相對import是在抽出為同名ts檔後成立，不能直接匯入Markdown。假設response/DTO mapper及store action契約都不是目前後端或狀態管理implementation。

實際執行檔為ProductRepository、mockProductRepository、ProductRecord、productModel、productRules、useProducts與formatPrice。範例的ProductRecord較嚴格、金額formatter也可能與現況不同；它們示範未來選擇，不是現有契約的替代版本。

未來更換資料來源或狀態管理implementation時，保持現有使用者行為測試，針對實際契約補上驗證，再取代舊implementation；不保留兩套狀態來源。現行細節見 [架構](../../docs/architecture.md)。

## 2026-10-28 搬遷驗證

執行 `pnpm check:layers` 檢查靜態import/export：資料來源不得依賴Business/UI、Business不得依賴UI、utils保持純工具、UI不可直接引用資料來源。它使用既有TypeScript parser，不增加套件；動態import與未來alias需擴充檢查策略。目前沒有這類引用。

## 商品詳情擴充

商品路由／productId由Router擁有；資料來源新增getById與ProductDetailRecord，Business新增useProductDetail／productDetailRules，UI新增ProductPage／ProductGallery／ProductPurchase。商品選購確認只存在本頁，離開或換商品即重設，不是購物車。層級依賴仍以check:layers檢查。

## Tabs與Discovery正式module

ProductInfoTabs位於components/product，只有UI本地tab state。ProductDiscovery組合推薦／歷史；Business useProductDiscovery與productDiscoveryRules處理候選排序、排除當前、canonical歷史ID及async；apiservices/products/recentProductStorage隔離本機儲存。UI不直接讀寫localStorage或fixtures，沒有新套件store。
