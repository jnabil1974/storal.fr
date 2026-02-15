'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Epilogue } from 'next/font/google';

const epilogue = Epilogue({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  display: 'swap',
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

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
      title: 'Newsletter',
      href: '/admin/newsletter',
      icon: '📧',
      description: 'Abonnés newsletter'
    },
    {
      title: 'Gestion SEO',
      href: '/admin/seo',
      icon: '🔍',
      description: 'Métadonnées'
    },
  ];

  return (
    <div className={`${epilogue.className} min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="max-w-full mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all celestial-glow">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-[#2c3e50] uppercase">Storal</h1>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Administration</p>
                </div>
              </Link>
              <span className="hidden md:block text-gray-300 text-2xl font-light">|</span>
              <Link href="/" className="hidden md:flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour au site
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <span className="text-2xl">👤</span>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Admin</p>
                  <p className="text-sm font-bold text-[#2c3e50] truncate max-w-[150px]">{user?.email || 'Administrateur'}</p>
                </div>
              </div>
              {loading ? null : user ? (
                <button
                  type="button"
                  onClick={signOut}
                  className="px-4 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors uppercase tracking-wider"
                >
                  Déconnexion
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 min-h-[calc(100vh-5rem)] bg-white/50 backdrop-blur-sm shadow-xl border-r border-gray-200/50 flex flex-col">
          <nav className="p-6 space-y-2 flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || 
                              (item.href !== '/admin' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200 scale-[1.02]'
                      : 'text-gray-700 hover:bg-white hover:shadow-md hover:scale-[1.01]'
                  }`}
                >
                  <span className={`text-3xl transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <div className={`font-bold text-sm uppercase tracking-wider ${isActive ? 'text-white' : 'text-[#2c3e50]'}`}>
                      {item.title}
                    </div>
                    <div className={`text-xs mt-0.5 ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-8 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer sidebar */}
          <div className="p-6 border-t border-gray-200/50 bg-gradient-to-br from-slate-50 to-blue-50/30 mt-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs font-bold text-[#2c3e50] uppercase tracking-wider">Système actif</p>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-semibold">Storal Admin Panel</p>
              <p className="text-gray-400">Version 2.0.0 • 2026</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
