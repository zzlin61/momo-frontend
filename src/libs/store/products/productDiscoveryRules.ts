import type { Product } from './productModel';

export function recordRecentProduct(ids: string[], currentId: string): string[] {
  return [...new Set([currentId, ...ids])].slice(0, 8);
}

export function selectRecommendations(products: Product[], current: Product): Product[] {
  return products.filter((product, index) => product.id !== current.id
    && products.findIndex(candidate => candidate.id === product.id) === index)
    .sort((a, b) => Number(b.brand === current.brand) - Number(a.brand === current.brand))
    .slice(0, 4);
}
