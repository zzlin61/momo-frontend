import type { ProductRecord } from '../../apiservices/products/types/ProductRecord';

export type Product = ProductRecord;
export type { ProductRepository } from '../../apiservices/products/ProductRepository';

export type ProductState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; products: Product[] };
export type { ProductDetailRecord as ProductDetail } from '../../apiservices/products/types/ProductDetailRecord';
