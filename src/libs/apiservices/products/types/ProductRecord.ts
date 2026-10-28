export interface ProductRecord {
  id: string;
  productCode?: string;
  name: string;
  brand: string;
  price: number;
  imageUrl?: string;
  tags?: string[];
}
