# utils：UI 通用純函式

狀態：formatPrice.ts已接入ProductCard並保留原本數字格式。formatCurrency.example.ts.md仍是未啟用的教學範例，不取代現行金額文案。

函式應不依賴 React、DOM、store、資料來源或特定商品政策，並有清楚的輸入／輸出。例：[formatCurrency](formatCurrency.example.ts.md)。

金額顯示、純文字組合等跨畫面共用能力可放在此處。商品篩選／可售政策屬 Business，response 清洗屬 apiservices。只有單一畫面使用且具有該畫面語意的函式可先留在原處，避免為集中而集中。

需要 effect、ref 或訂閱的 React hook 不是一般 utils。出現跨領域共用需求後再建立 libs/hooks；商品 hook 仍由商品 module 擁有。
