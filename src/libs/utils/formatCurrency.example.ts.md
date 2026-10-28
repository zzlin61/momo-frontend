# formatCurrency.ts — UI formatter 範例（未啟用）

此範例只格式化已驗證的「新台幣元」金額，沒有單位換算、取價或業務折扣政策。UI目前使用libs/utils/formatPrice.ts，保持原顯示；本例尚未啟用。

```ts
const twdFormatter = new Intl.NumberFormat('zh-TW', {
  style: 'currency',
  currency: 'TWD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCurrency(amountTwd: number): string {
  if (!Number.isSafeInteger(amountTwd) || amountTwd < 0) {
    throw new RangeError('Expected a non-negative integer TWD amount');
  }
  return twdFormatter.format(amountTwd);
}
```

呼叫端使用原始數值作排序與計算；格式化字串只用於呈現。不得先格式化再回頭解析成價格。正式接入前應驗證目標瀏覽器的貨幣符號呈現；此範例不變更既有畫面的字樣。
