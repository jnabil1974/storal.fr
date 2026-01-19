'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
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
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
        router.push('/');
      } else {
        await signUp(email, password);
        setMessage('Compte créé. Vous pouvez vous connecter.');
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l ${mode==='login'?'bg-blue-600 text-white':'bg-gray-100'}`}
            onClick={() => setMode('login')}
          >
            Se connecter
          </button>
          <button
            className={`px-4 py-2 rounded-r ${mode==='signup'?'bg-blue-600 text-white':'bg-gray-100'}`}
            onClick={() => setMode('signup')}
          >
            Créer un compte
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-100 text-red-800 rounded">{error}</div>}
          {message && <div className="p-3 bg-green-100 text-green-800 rounded">{message}</div>}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Veuillez patienter...' : (mode==='login'?'Se connecter':'Créer un compte')}
          </button>
        </form>
      </div>
    </div>
  );
}
