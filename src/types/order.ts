import { CartItem } from './cart';

export interface Order {
  id: string;
  userId?: string;
  sessionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  deliveryCountry: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  stripePaymentId?: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderPayload {
  userId?: string;
  sessionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  deliveryCountry: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  stripePaymentId?: string;
  paymentMethod?: string;
  recaptchaToken?: string;
}
