import { productFixtures } from '../../../data/products';
import type { ProductRecord } from './types/ProductRecord';
import type { ProductRepository } from './ProductRepository';

interface MockProductRepositoryOptions {
  delayMs?: number;
  error?: Error;
}

export function createMockProductRepository(
  { delayMs = 0, error }: MockProductRepositoryOptions = {},
): ProductRepository {
  async function respond(products: readonly ProductRecord[]): Promise<ProductRecord[]> {
    if (delayMs > 0) {
      await new Promise<void>(resolve => setTimeout(resolve, delayMs));
    }
    if (error) throw error;
    return products.map(product => ({
      ...product,
      ...(product.tags ? { tags: [...product.tags] } : {}),
    }));
  }

  return {
    listFeatured() {
      return respond(productFixtures);
    },
    search(query) {
      const keyword = query.trim().toLowerCase();
      const matches = keyword
        ? productFixtures.filter(product =>
            [product.name, product.brand, ...(product.tags ?? [])].some(field =>
              field.toLowerCase().includes(keyword),
            ),
          )
        : [];
      return respond(matches);
    },
  };
}
