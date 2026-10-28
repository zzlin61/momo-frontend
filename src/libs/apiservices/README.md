# apiservices：資料來源 adapter

狀態：**文件範例；沒有真實端點、網路呼叫或 UI 接線**。目前作業仍使用既有 mock repository。

## 按領域組織

```text
apiservices/
└── products/
    ├── types/
    │   └── searchProducts.example.ts.md
    ├── productMapper.example.ts.md
    └── productSource.example.ts.md
```

範例中的 transport contract 是為教學自訂，不是 momo 或任何實際後端契約。未來有經授權的契約時再建立對應呼叫 implementation；搜尋 GET 的查詢範例只需 params，不為了完整目錄增加空 payload 定義。真正有 request body 的操作才定義 payload。

## 規則

1. 各領域擁有 params、必要 payload 與 response types；外部回應進入 runtime 時仍以 unknown 檢查。
2. mapper 只處理外部表示法：欄位名稱、明確允許的 null、字串空白與必要欄位驗證。契約未允許的缺值／型別不符應明確失敗，不默默變成有效商品。
3. 範例價格是「非負整數新台幣元」，無分／元或幣別換算。正式契約不同時重新定義，不猜測。
4. mapper 輸出不含外部欄位命名的 ProductRecord；排序、可售規則或品牌篩選屬 Business module。
5. types 資料夾只有型別；可執行轉換放在 mapper，不在 types 裡藏副作用。
6. adapter 經注入使用，不讀寫 store。失敗保留為可由呼叫端處理的 rejected Promise；不在此處顯示 toast 或操作 Router。
7. 只有一種實際資料格式時，沿用既有模型即可。範例示範有格式差異時的 seam，不要求為每層複製同一組型別。

## 範例與驗收方向

依序閱讀 [型別](products/types/searchProducts.example.ts.md)、[mapper](products/productMapper.example.ts.md)、[資料來源](products/productSource.example.ts.md)。

未來轉為正式程式時，測試應涵蓋有效／空回應、null tags、無效金額、必要欄位缺失、資料來源錯誤；透過 adapter interface 測試，不只斷言 mapper 函式存在。此批沒有新增 runtime 測試。
