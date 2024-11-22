export interface CartItem {
  product_id: string;
  discount?: number;
  type_discount?: null;
  type_campign?: null;
  code_coupon?: null;
  code_discount?: null;
  product_variation_id?: null;
  quantity: number;
  price_unit?: number;
  subtotal?: number;
  total: number;
  currency: string;
}
