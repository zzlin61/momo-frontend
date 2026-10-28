import type { ProductDetail } from './productModel';

export interface ProductSelection {
  colorId: string;
  size: string;
  quantity: number;
}

export function validateProductSelection(product: ProductDetail, selection: ProductSelection) {
  const color = product.colors.find(item => item.id === selection.colorId);
  if (!color) return { valid: false as const, message: '請選擇顏色' };
  if (!color.sizes.some(size => size.label === selection.size && size.available)) {
    return { valid: false as const, message: '請選擇尺寸，並確認該尺寸可供選擇' };
  }
  if (!Number.isInteger(selection.quantity) || selection.quantity < 1 || selection.quantity > product.maxQuantity) {
    return { valid: false as const, message: '請選擇 1 至 ' + product.maxQuantity + ' 件商品' };
  }
  return {
    valid: true as const,
    color: color.name,
    size: selection.size,
    quantity: selection.quantity,
    total: product.price * selection.quantity,
  };
}
