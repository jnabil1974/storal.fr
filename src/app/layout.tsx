import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ConditionalLayout from "@/components/ConditionalLayout";
import CookieBanner from "@/components/CookieBanner";
import GoogleScripts from "@/components/GoogleScripts";
import TopBar from "@/components/TopBar";

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
            <TopBar />
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            
            {/* Scripts Google (chargés uniquement si consentement) */}
            <GoogleScripts />
            
            {/* Banner cookies CNIL */}
            <CookieBanner />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
