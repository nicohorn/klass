import { CartItemType, ProductType } from "./types";

export function productPrice(productData: ProductType, cartItem: CartItemType) {
  const extras = productData.options.reduce((sum, o) => {
    const selected = cartItem[o.name];
    const multiplier = o?.elements?.find(e => e.value === selected)?.multiplier ?? 1;
    const price = productData.base_price * multiplier;
    return sum + price - productData.base_price;
  }, 0)
  return Math.ceil((productData.base_price + extras) / 5) * 5;
}