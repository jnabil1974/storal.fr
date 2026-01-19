'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function CartButton() {
  const { cart } = useCart();

  return (
    <Link href="/cart" className="relative">
      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        🛒 Panier
        {cart.totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {cart.totalItems}
          </span>
        )}
      </button>
    </Link>
  );
}
