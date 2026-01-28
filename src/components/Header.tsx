'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import Logo from './Logo';
import { ProductCategory } from '@/types/categories';

export default function Header() {
  const { cart } = useCart();
  const { user, signOut } = useAuth();
  const [hasOrders, setHasOrders] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [authDebug, setAuthDebug] = useState<{userEmail?: string|null; allowList: string[]}>({ allowList: [] });

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) return;
        const { data, error } = await supabase
          .from('product_categories')
          .select('*')
          .order('order_index', { ascending: true });
        if (!error && data) {
          setCategories(data.map((row: any) => ({
            id: row.id,
            slug: row.slug,
            name: row.name,
            displayName: row.display_name,
            description: row.description,
            imageUrl: row.image_url,
            imageAlt: row.image_alt,
            orderIndex: row.order_index,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
          })));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

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
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="cursor-pointer hover:scale-105 transition-transform duration-200">
              <Logo />
            </div>
          </Link>

          {/* Navigation centrale */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Category Links - TEMPORAIREMENT DÉSACTIVÉ */}
            {/* {categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/products/${cat.slug}`} 
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-all"
              >
                {cat.displayName}
              </Link>
            ))} */}

            {showMyOrders && (
              <Link href="/my-orders" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-all">
                Mes commandes
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold transition-all">
                Admin
              </Link>
            )}
          </div>

          {/* Actions à droite: Téléphone, User, Cart */}
          <div className="flex items-center gap-4">
            {/* Phone Number */}
            <a href="tel:+33185093446" className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                />
              </svg>
              <span className="text-sm font-semibold">01 85 09 34 46</span>
            </a>

            {/* User Section */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium hidden md:inline">{user.email}</span>
                </div>
                <button 
                  onClick={() => signOut()} 
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link href="/auth" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium hidden md:inline">Connexion</span>
              </Link>
            )}
            
            {/* Cart Button */}
            <Link href="/cart" className="relative">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all font-semibold shadow-md hover:shadow-lg">
                <svg
                  className="w-5 h-5"
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
                <span className="hidden md:inline">Panier</span>
              </button>
              {cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                  {cart.totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
