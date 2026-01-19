'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = getSupabaseClient();
  const [message, setMessage] = useState('Validation en cours...');
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    if (!supabase) {
      setError('Supabase non initialisé');
      return;
    }
    if (!code) {
      router.replace('/auth');
      return;
    }

    const run = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Erreur exchangeCodeForSession', error);
        setError('Impossible de valider le compte.');
        return;
      }
      setMessage('Compte validé, redirection...');
      router.replace('/my-orders');
    };

    run();
  }, [router, searchParams, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md text-center">
        {error ? (
          <>
            <h1 className="text-xl font-semibold text-red-600 mb-4">Erreur</h1>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => router.replace('/auth')}
            >
              Revenir à l&apos;authentification
            </button>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-gray-900 mb-3">Patientez...</h1>
            <p className="text-gray-700">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
