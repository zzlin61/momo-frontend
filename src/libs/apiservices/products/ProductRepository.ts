import type { ProductDetailRecord } from './types/ProductDetailRecord';
import type { ProductRecord } from './types/ProductRecord';

export interface ProductRepository {
  getById(productId: string): Promise<ProductDetailRecord | null>;
  listFeatured(): Promise<ProductRecord[]>;
  search(query: string): Promise<ProductRecord[]>;
}
