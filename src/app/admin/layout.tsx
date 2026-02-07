'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: '📊',
      description: 'Vue d\'ensemble'
    },
    {
      title: 'Commandes',
      href: '/admin/orders',
      icon: '📦',
      description: 'Gestion des commandes'
    },
    {
      title: 'Catégories',
      href: '/admin/categories',
      icon: '🏷️',
      description: 'Produits & images'
    },
    {
      title: 'Toiles',
      href: '/admin/toiles',
      icon: '🎨',
      description: 'Catalogue des toiles'
    },
    {
      title: 'Couleurs Matest',
      href: '/admin/matest-colors',
      icon: '🎭',
      description: 'Nuancier RAL Matest'
    },
    {
      title: 'Produits Store Banne',
      href: '/admin/store-banne-products',
      icon: '☀️',
      description: 'Images & infos stores'
    },
    {
      title: 'Newsletter',
      href: '/admin/newsletter',
      icon: '📧',
      description: 'Abonnés newsletter'
    },
    {
      title: 'Carrousel Hero',
      href: '/admin/hero-slides',
      icon: '🖼️',
      description: 'Slides d\'accueil'
    },
    {
      title: 'Gestion SEO',
      href: '/admin/seo',
      icon: '🔍',
      description: 'Métadonnées'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                ← Retour au site
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
            </div>
            <div className="text-sm text-gray-600">
              👤 Administrateur
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-screen shadow-sm flex flex-col">
          <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || 
                              (item.href !== '/admin' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer sidebar */}
          <div className="p-4 border-t bg-gray-50 mt-auto">
            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-semibold">Store Menuiserie Admin</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
