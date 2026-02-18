'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, CartState, AddToCartPayload } from '@/types/cart';

interface CartContextType {
  cart: CartState;
  addItem: (payload: AddToCartPayload) => Promise<CartItem>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = localStorage.getItem('cart_session_id');
  
  // Valider le format UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!sessionId || !uuidRegex.test(sessionId)) {
    // Générer un UUID valide (format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
    sessionId = crypto.randomUUID();
    localStorage.setItem('cart_session_id', sessionId);
    console.log('🆔 Nouveau sessionId généré:', sessionId);
  }
  return sessionId;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
    lastUpdated: new Date(),
    promoCode: undefined,
    discount: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  // Récupérer le session ID et charger le panier
  useEffect(() => {
    const id = getOrCreateSessionId();
    setSessionId(id);
    loadCart(id);
    
    // Récupérer le code promo depuis localStorage
    const savedPromoCode = localStorage.getItem('cart_promo_code');
    if (savedPromoCode) {
      setCart(prev => {
        const discount = prev.totalPrice * 0.05;
        return { ...prev, promoCode: savedPromoCode, discount };
      });
    }
  }, []);

  // Recalculer la remise quand le totalPrice change
  useEffect(() => {
    if (cart.promoCode && cart.totalPrice > 0) {
      const discount = cart.totalPrice * 0.05;
      setCart(prev => ({ ...prev, discount }));
    }
  }, [cart.totalPrice, cart.promoCode]);

  const loadCart = async (sid: string) => {
    if (!sid) return;
    console.log('🔵 loadCart called with sessionId:', sid);
    setIsLoading(true);
    try {
      const url = `/api/cart?sessionId=${encodeURIComponent(sid)}`;
      console.log('📡 Fetching cart from:', url);
      
      const res = await fetch(url);
      console.log('📡 Response status:', res.status, res.statusText);
      
      if (res.ok) {
        const data = await res.json();
        console.log('📦 Raw cart data from API:', data);
        console.log('📦 Items count:', data.items?.length || 0);
        
        const mappedItems = data.items.map((item: any) => {
          console.log('📦 Mapping item:', {
            id: item.id,
            product_id: item.product_id,
            product_name: item.product_name
          });
          return {
            id: item.id,
            sessionId: item.session_id,
            productId: item.product_id,
            productType: item.product_type,
            productName: item.product_name,
            basePrice: item.base_price,
            configuration: item.configuration,
            quantity: item.quantity,
            pricePerUnit: item.price_per_unit,
            totalPrice: item.total_price,
            addedAt: new Date(item.added_at || item.created_at),
            updatedAt: new Date(item.updated_at),
          };
        });
        
        console.log('📦 Mapped items:', mappedItems);
        
        const newCart = {
          items: mappedItems,
          totalItems: data.totalItems,
          totalPrice: data.totalPrice,
          lastUpdated: new Date(),
        };
        
        console.log('✅ Setting cart state:', newCart);
        setCart(newCart);
      } else {
        console.error('❌ Failed to load cart:', res.status, res.statusText);
      }
    } catch (err) {
      console.error('❌ Error loading cart:', err);
    } finally {
      setIsLoading(false);
      console.log('🏁 loadCart finished');
    }
  };

  const addItem = async (payload: AddToCartPayload): Promise<CartItem> => {
    setIsLoading(true);
    try {
      const requestData = { sessionId, ...payload };
      console.log('🛒 Adding to cart:', requestData);
      
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      
      console.log('📝 Response status:', res.status, res.statusText);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Failed to add item. Status:', res.status, 'Response:', errorText);
        throw new Error(`Failed to add item: ${res.status} - ${errorText}`);
      }
      
      const item = await res.json();
      console.log('✅ Item added:', item);
      await loadCart(sessionId);
      return item;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('🔴 Cart error:', errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cart?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove item');
      await loadCart(sessionId);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantity }),
      });
      if (!res.ok) throw new Error('Failed to update quantity');
      await loadCart(sessionId);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cart?sessionId=${encodeURIComponent(sessionId)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to clear cart');
      setCart({
        items: [],
        totalItems: 0,
        totalPrice: 0,
        lastUpdated: new Date(),
        promoCode: undefined,
        discount: undefined,
      });
      // Supprimer aussi le code promo du localStorage
      localStorage.removeItem('cart_promo_code');
    } finally {
      setIsLoading(false);
    }
  };

  const applyPromoCode = (code: string): boolean => {
    const normalizedCode = code.trim().toUpperCase();
    
    // Vérifier si le code est valide (STORAL5)
    if (normalizedCode === 'STORAL5') {
      const discount = cart.totalPrice * 0.05;
      setCart(prev => ({ ...prev, promoCode: normalizedCode, discount }));
      localStorage.setItem('cart_promo_code', normalizedCode);
      return true;
    }
    
    return false;
  };

  const removePromoCode = () => {
    setCart(prev => ({ ...prev, promoCode: undefined, discount: undefined }));
    localStorage.removeItem('cart_promo_code');
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, applyPromoCode, removePromoCode, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
