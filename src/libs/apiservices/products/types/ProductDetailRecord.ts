import type { ProductRecord } from './ProductRecord';

export interface ProductColor {
  id: string;
  name: string;
  artworkVariant: number;
  sizes: { label: string; available: boolean }[];
}

export interface ProductDetailRecord extends ProductRecord {
  description: string;
  features: string[];
  colors: ProductColor[];
  maxQuantity: number;
  specifications: { label: string; value: string }[];
}
