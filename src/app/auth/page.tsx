'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
const RECAPTCHA_ENABLED = RECAPTCHA_SITE_KEY && RECAPTCHA_SITE_KEY.length > 0;

function AuthPageContent() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Si reCAPTCHA n'est pas configuré, continuer sans vérification
    if (!RECAPTCHA_ENABLED) {
      console.warn('⚠️ reCAPTCHA non configuré - authentification sans vérification');
    } else if (!executeRecaptcha) {
      setError('reCAPTCHA non initialisé');
      return;
    }

    setLoading(true);
    try {
      // Vérifier reCAPTCHA seulement s'il est configuré
      if (RECAPTCHA_ENABLED && executeRecaptcha) {
        const recaptchaToken = await executeRecaptcha('auth_submit');
        const verifyRes = await fetch('/api/recaptcha', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recaptchaToken }),
        });
        if (!verifyRes.ok) {
          throw new Error('Vérification reCAPTCHA échouée');
        }
      }

      if (mode === 'login') {
        await signIn(email, password);
        router.push('/');
      } else {
        await signUp(email, password);
        setMessage('Compte créé. Vous pouvez vous connecter.');
        setMode('login');
      }
    } catch (err: any) {
      setError(err?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l font-semibold transition-colors ${mode==='login'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setMode('login')}
          >
            Se connecter
          </button>
          <button
            className={`px-4 py-2 rounded-r font-semibold transition-colors ${mode==='signup'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setMode('signup')}
          >
            Créer un compte
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-100 text-red-800 rounded font-semibold">{error}</div>}
          {message && <div className="p-3 bg-green-100 text-green-800 rounded font-semibold">{message}</div>}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Mot de passe</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Veuillez patienter...' : (mode==='login'?'Se connecter':'Créer un compte')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AuthPage() {
  // Si reCAPTCHA n'est pas configuré, afficher le contenu sans le provider
  if (!RECAPTCHA_ENABLED) {
    return <AuthPageContent />;
  }
  
  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY} scriptProps={{ async: true, defer: true }}>
      <AuthPageContent />
    </GoogleReCaptchaProvider>
  );
}
