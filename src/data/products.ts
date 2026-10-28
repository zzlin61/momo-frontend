import type { Product } from '../entities/product/Product';

// Authored demo names/prices, not a real catalogue or offer. No external assets.
export const productFixtures: readonly Product[] = [
  { id: 'demo-asics-01', name: '輕量跑鞋', brand: 'ASICS', price: 2490, tags: ['日常訓練', '運動'] },
  { id: 'demo-asics-02', name: '緩震慢跑鞋', brand: 'ASICS', price: 3290, tags: ['長跑', '運動'] },
  { id: 'demo-nb-01', name: '休閒步行鞋', brand: 'New Balance', price: 2190, tags: ['日常穿搭', '步行'] },
  { id: 'demo-local-01', name: '透氣運動襪', brand: 'Momo Demo', price: 290, tags: ['配件', '運動'] },
];
