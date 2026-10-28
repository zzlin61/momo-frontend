import type { ProductRecord } from './types/ProductRecord';

export interface ProductRepository {
  listFeatured(): Promise<ProductRecord[]>;
  search(query: string): Promise<ProductRecord[]>;
}
