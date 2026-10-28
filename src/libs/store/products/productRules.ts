import type { ProductState } from './productModel';

// Preserve the existing search-page projection and source ordering.
export function projectProductResults(state: ProductState, brand: string, sort: string) {
  const brands = state.status === 'success'
    ? [...new Set(state.products.map(product => product.brand))]
    : [];
  const filtered: ProductState = state.status === 'success'
    ? {
        status: 'success',
        products: state.products
          .filter(product => !brand || product.brand === brand)
          .sort((a, b) => sort === 'price-asc' ? a.price - b.price
            : sort === 'price-desc' ? b.price - a.price : 0),
      }
    : state;
  return {
    brands,
    filtered,
    count: filtered.status === 'success' ? filtered.products.length : null,
  };
}
