'use client';

import Link from 'next/link';
import { useState } from 'react';
import Script from 'next/script';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const getRecaptchaToken = async () => {
    if (!siteKey) return null;
    if (typeof window === 'undefined' || !(window as any).grecaptcha) return null;
    try {
      // Ensure grecaptcha is fully loaded
      const grecaptcha = (window as any).grecaptcha;
      if (grecaptcha.ready) {
        return await new Promise<string | null>((resolve) => {
          grecaptcha.ready(async () => {
            try {
              const t = await grecaptcha.execute(siteKey, { action: 'newsletter' });
              resolve(t);
            } catch (e) {
              console.error('recaptcha execute error:', e);
              resolve(null);
            }
          });
        });
      }
      return await grecaptcha.execute(siteKey, { action: 'newsletter' });
    } catch (error) {
      console.error('recaptcha execute error:', error);
      return null;
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const recaptchaToken = await getRecaptchaToken();

      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, recaptchaToken }),
      });

      const result = await response.json();

      if (response.ok || response.status === 200) {
        setMessage(result.message || 'Merci pour votre inscription !');
        setEmail('');
      } else {
        setMessage(result.error || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      setMessage('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {siteKey && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
          strategy="afterInteractive"
        />
      )}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Company Information */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">STORAL</h3>
            <p className="text-sm mb-2">Store et Menuiserie</p>
            <p className="text-sm mb-1">58 rue de Monceau CS 48756</p>
            <p className="text-sm mb-4">75380 Paris Cedex 08</p>
            <div className="space-y-2">
              <p className="text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                01 85 09 34 46
              </p>
              <p className="text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                commandes@storal.fr
              </p>
            </div>
          </div>

          {/* Column 2: Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/mentions-legales" className="text-sm hover:text-white transition">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-sm hover:text-white transition">
                  Conditions générales de vente
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="text-sm hover:text-white transition">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition">
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Restez informé de nos nouveautés et offres spéciales
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                required
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Inscription...' : "S'inscrire"}
              </button>
              {message && (
                <p className={`text-sm ${message.includes('Erreur') ? 'text-red-400' : 'text-green-400'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Storal.fr - Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
