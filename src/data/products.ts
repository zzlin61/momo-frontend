import type { Product } from '../entities/product/Product';

// Authored demo names/prices, not a real catalogue or offer. No external assets.
export const productFixtures: readonly Product[] = [
  { id: 'demo-asics-01', name: '輕量跑鞋', brand: 'ASICS', price: 2490, tags: ['日常訓練', '運動'] },
  { id: 'demo-asics-02', name: '緩震慢跑鞋', brand: 'ASICS', price: 3290, tags: ['長跑', '運動'] },
  { id: 'demo-nb-01', name: '休閒步行鞋', brand: 'New Balance', price: 2190, tags: ['日常穿搭', '步行'] },
  { id: 'demo-local-01', name: '透氣運動襪', brand: 'Momo Demo', price: 290, tags: ['配件', '運動'] },
  { id: 'demo-asics-03', name: '城市漫步休閒鞋', brand: 'ASICS', price: 1990, tags: ['日常穿搭', '步行'] },
  { id: 'demo-asics-04', name: '穩定支撐訓練鞋', brand: 'ASICS', price: 2890, tags: ['日常訓練', '運動'] },
  { id: 'demo-asics-05', name: '輕彈競速跑鞋', brand: 'ASICS', price: 4290, tags: ['長跑', '運動'] },
  { id: 'demo-asics-06', name: '全天候舒適步行鞋', brand: 'ASICS', price: 2290, tags: ['步行', '日常'] },
  { id: 'demo-asics-07', name: '經典復古休閒鞋', brand: 'ASICS', price: 2690, tags: ['日常穿搭', '休閒'] },
  { id: 'demo-asics-08', name: '透氣網布運動鞋', brand: 'ASICS', price: 1790, tags: ['日常訓練', '運動'] },
  { id: 'demo-nb-02', name: '復古拼接休閒鞋', brand: 'New Balance', price: 2590, tags: ['日常穿搭', '休閒'] },
  { id: 'demo-local-02', name: '日常中筒運動襪', brand: 'Momo Demo', price: 390, tags: ['配件', '日常'] },
];
