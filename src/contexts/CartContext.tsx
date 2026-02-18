'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, CartState, AddToCartPayload } from '@/types/cart';

interface CartContextType {
  cart: CartState;
  addItem: (payload: AddToCartPayload) => Promise<CartItem>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  // Récupérer le session ID et charger le panier
  useEffect(() => {
    const id = getOrCreateSessionId();
    setSessionId(id);
    loadCart(id);
  }, []);

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
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, isLoading }}>
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
