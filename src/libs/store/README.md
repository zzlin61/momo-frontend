# store：Business module

狀態：**productModel.ts、productRules.ts及useProducts.ts已接入**。狀態協調沿用React hook，未建立套件store、未安裝Zustand。下方example.ts.md仍未啟用。

## 責任

- 商品模型與產品規則、查詢正規化、排序／篩選、品牌選項與結果數的推導。
- 非同步請求的 loading/error/success、重試、取消／過期回應防護與作用域。
- 透過資料來源 interface 取得正規化資料；UI 只消費狀態與觸發意圖。
- 純規則不依賴 React 或狀態管理套件，避免把每個轉換都塞進 store implementation。

## 範例

```text
store/
└── products/
    ├── productModel.example.ts.md
    ├── productRules.example.ts.md
    └── productStore.example.ts.md
```

先看 [模型](products/productModel.example.ts.md)，再看 [規則](products/productRules.example.ts.md) 與 [狀態契約](products/productStore.example.ts.md)。範例互相引用的是未來同名 ts module，不是現有 runtime module。

## 狀態與資料政策

1. Router 擁有已提交的 keyword/sort/brand；Business 取得它們作為輸入，不另建一套可獨立修改的 URL 狀態。
2. 未提交草稿、focus、IME 與畫面展開由 UI 管理。
3. 保存原始商品結果與 request 狀態；衍生清單及數量由純規則計算，避免多份可分別修改的資料。
4. 純空結果是成功載入的空清單，與 error、尚未載入不同。未來改善應避免error標題顯示仍在載入；本次搬遷保留原SearchPage文案，不混入行為修正。
5. request identity 必須含查詢及作用域；舊 Promise 完成不覆寫新狀態。首頁 featured 與搜尋不共用一個不分用途的 products 槽。
6. 資料來源 adapter 與 store instance 由 composition 注入，方便每個測試取得獨立 instance。選定 Zustand 後再決定具體建構方式。
7. 外部格式正規化在 apiservices；只有規則實際需要不同模型時才做第二次轉換。本例模型重用正規化資料，不為滿足層數多拷貝一次。
8. 搬遷後的useProducts保留既有cleanup、retry與兩頁使用者行為測試；沒有改用未啟用的store action範例。

未來驗收需包含 sort 無效值預設、篩選與排序不修改原資料、error/retry、路由快速切換、清除與卸載後回應、首頁／搜尋隔離，以及測試之間的 store 隔離。
