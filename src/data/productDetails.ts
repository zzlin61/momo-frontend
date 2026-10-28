import { productFixtures } from './products';
import type { ProductDetailRecord } from '../libs/apiservices/products/types/ProductDetailRecord';

// Original demo specifications; not the referenced seller's catalogue or inventory.
export const productDetailFixtures: readonly ProductDetailRecord[] = productFixtures.map(product => {
  const socks = product.tags?.includes('配件') ?? false;
  const labels = socks ? ['M', 'L'] : ['23.5', '24', '24.5', '25', '25.5', '26', '26.5', '27', '27.5', '28'];
  return {
    ...product,
    description: socks
      ? '柔軟的日常配件，陪你從通勤走到週末。簡單搭配，讓每一天多一點舒適。'
      : '從城市街角，到週末的散步路線。以輕盈線條和日常配色，為你的步伐留一點自由。',
    features: ['日常風格，輕鬆融入你的穿搭', '自製圖像呈現，探索不同配色', '本機示範規格，非真實商品承諾'],
    colors: [
      { id: 'graphite', name: '黑銀灰', artworkVariant: 2, sizes: labels.map(label => ({ label, available: true })) },
      { id: 'chalk', name: '米白綠', artworkVariant: 0, sizes: labels.map((label, index) => ({ label, available: index !== 0 })) },
    ],
    maxQuantity: 5,
    specifications: [
      { label: '品牌', value: product.brand },
      { label: '品號', value: product.productCode ?? product.id },
      { label: '商品類別', value: socks ? '運動配件' : '日常運動鞋' },
      { label: '款式', value: '日常休閒' },
      { label: '規格說明', value: '以上尺寸、配色與數量上限均為本機示範設定' },
    ],
  };
});
