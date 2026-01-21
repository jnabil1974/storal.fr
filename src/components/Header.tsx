'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

export default function Header() {
  const { cart } = useCart();
  const { user, signOut } = useAuth();
  const [hasOrders, setHasOrders] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authDebug, setAuthDebug] = useState<{userEmail?: string|null; allowList: string[]}>({ allowList: [] });

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    console.log('Header user:', user?.email);
    if (user?.email) {
      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'admin@storal.fr')
        .split(',')
        .map((e) => e.trim().toLowerCase());
      const allowed = adminEmails.includes(user.email.toLowerCase());
      setIsAdmin(allowed);
      setAuthDebug({ userEmail: user.email, allowList: adminEmails });

      // Double check via server (token-based) to avoid ENV mismatches
      (async () => {
        try {
          const supabase = getSupabaseClient();
          if (!supabase) return;
          const { data: { session } } = await supabase.auth.getSession();
          const token = session?.access_token;
          if (!token) return;
          const res = await fetch('/api/admin/check', { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            setIsAdmin(true);
            console.log('Admin check (server): OK');
          } else {
            console.log('Admin check (server) failed with', res.status);
          }
        } catch (e) {
          console.warn('Admin check (server) error', e);
        }
      })();
    } else {
      setIsAdmin(false);
      setAuthDebug({ userEmail: null, allowList: [] });
    }
  }, [user]);

  // Vérifier si l'utilisateur a des commandes
  useEffect(() => {
    const checkOrders = async () => {
      if (!user?.email) {
        setHasOrders(false);
        return;
      }
      try {
        const res = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          console.log('Header orders length:', Array.isArray(data) ? data.length : 'not array');
          setHasOrders(Array.isArray(data) && data.length > 0);
        } else {
          console.warn('checkOrders response not ok', res.status);
          setHasOrders(false);
        }
      } catch (err) {
        console.error('checkOrders error', err);
        setHasOrders(false);
      }
    };
    checkOrders();
  }, [user]);

  const showMyOrders = (!!user || hasOrders) && !isAdmin;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <div className="text-2xl font-bold text-blue-600 cursor-pointer">
            Storal
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
            Accueil
          </Link>
          {showMyOrders && (
            <Link href="/my-orders" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Mes commandes
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Admin
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button onClick={() => signOut()} className="text-gray-700 hover:text-blue-600 transition font-medium">Se déconnecter</button>
            </div>
          ) : (
            <Link href="/auth" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Se connecter
            </Link>
          )}
          
          {/* Cart Button */}
          <Link href="/cart" className="relative">
            <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition font-medium">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 8m10 0l2 8m0 0H9m8 0a2 2 0 100-4 2 2 0 000 4zm0 0a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
              Panier
            </button>
            {cart.totalItems > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cart.totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
