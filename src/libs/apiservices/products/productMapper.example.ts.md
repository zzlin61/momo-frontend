# productMapper.ts — runtime 清洗範例（未啟用）

對應未來 `products/productMapper.ts`。輸入為 unknown，必填文字不可空白；price_twd 必須為非負整數元；tags 的 null／未提供依此教學契約轉成空陣列。其他型別錯誤直接失敗。

```ts
import type { ProductRecord } from './types/searchProducts';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredText(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('Invalid product field: ' + field);
  }
  return value.trim();
}

function mapProduct(value: unknown): ProductRecord {
  if (!isRecord(value)) throw new Error('Invalid product record');
  const price = value.price_twd;
  if (typeof price !== 'number' || !Number.isSafeInteger(price) || price < 0) {
    throw new Error('Invalid product price_twd');
  }

  const rawTags = value.tags ?? [];
  if (!Array.isArray(rawTags)) throw new Error('Invalid product tags');
  const tags = rawTags.map((tag: unknown) => requiredText(tag, 'tags'));

  return {
    id: requiredText(value.product_id, 'product_id'),
    name: requiredText(value.product_name, 'product_name'),
    brand: requiredText(value.brand_name, 'brand_name'),
    price,
    tags,
  };
}

export function mapProductsResponse(response: unknown): ProductRecord[] {
  if (!isRecord(response) || !Array.isArray(response.items)) {
    throw new Error('Invalid products response');
  }
  return response.items.map((item: unknown) => mapProduct(item));
}
```

整份回應中有不合法商品時，此範例拒絕整份資料。這是明確的範例政策；正式產品若允許部分結果，必須額外定義哪些資料被排除及如何回報，不默默丟失資料。價格0在此僅代表有效的外部數值，不代表 Business 已判定可售。
