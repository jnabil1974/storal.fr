import { ProductType, ProductConfig } from './products';

export interface CartItem {
  id: string;
  sessionId: string;
  productId: string;
  productType: ProductType;
  productName: string;
  basePrice: number;
  configuration: ProductConfig;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  addedAt: Date;
  updatedAt: Date;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  lastUpdated: Date;
}

export interface AddToCartPayload {
  productId: string;
  productType: ProductType;
  productName: string;
  basePrice: number;
  configuration: ProductConfig;
  quantity: number;
  pricePerUnit: number;
}
