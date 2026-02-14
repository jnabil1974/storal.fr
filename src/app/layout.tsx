import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatVisibilityController from "@/components/ChatVisibilityController";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Storal.fr - Stores et Fermetures sur mesure",
  description: "Créez vos stores, portes blindées et fermetures sur mesure",
  icons: {
    icon: [
      { url: "/favicon.svg?v=2", type: "image/svg+xml", sizes: "any" },
      { url: "/favicon.ico?v=2", type: "image/x-icon" },
      { url: "/icon.png?v=1", type: "image/png", sizes: "32x32" },
    ],
    shortcut: ["/favicon.ico?v=2"],
    apple: [{ url: "/apple-icon.png?v=1", sizes: "180x180" }],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#1A2B4C" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            {/* Top Info Bar */}
            <div className="bg-slate-900 text-white text-sm py-3 border-b border-slate-700">
              <div className="w-full px-4 flex flex-wrap justify-center md:justify-between items-center gap-4">
                <div className="hidden md:flex space-x-6 text-gray-300">
                  <span className="flex items-center gap-2">🇫🇷 Fabrication Française</span>
                  <span className="flex items-center gap-2">🛡️ Garantie Jusqu'à 12 Ans</span>
                  <span className="flex items-center gap-2">🚚 Livraison Incluse</span>
                </div>
                <div className="flex space-x-4 text-gray-300">
                  <a href="tel:+33185093446" className="font-bold text-white hover:text-blue-400 transition">📞 01 85 09 34 46</a>
                </div>
              </div>
            </div>
            <Header />
            {/* 🎯 Bannière publicitaire - 100px */}
            <div className="h-[100px] bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 border-b border-gray-200 flex items-center justify-center px-4">
              <p className="text-center text-gray-600 text-sm font-medium">
                🎁 Espace réservé pour bannière publicitaire
              </p>
            </div>
            <main>{children}</main>
            <Footer />
            <ChatVisibilityController />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
