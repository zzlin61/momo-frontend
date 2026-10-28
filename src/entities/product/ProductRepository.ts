import type { Product } from './Product';

export interface ProductRepository {
  listFeatured(): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
}
