'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';
import { VerifyOtpParams } from '@supabase/supabase-js';

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = getSupabaseClient();
  const [message, setMessage] = useState('Validation en cours...');
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const token = searchParams.get('token');
    const type = (searchParams.get('type') as VerifyOtpParams['type']) || 'signup';
    const email = searchParams.get('email') || undefined;
    if (!supabase) {
      setError('Supabase non initialisé');
      return;
    }
    const run = async () => {
      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (token) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type,
            email,
          });
          if (error) throw error;
        } else {
          router.replace('/auth');
          return;
        }
        setMessage('Compte validé, redirection...');
        router.replace('/my-orders');
      } catch (err: any) {
        console.error('Erreur validation Supabase', err);
        setError(err?.message || 'Impossible de valider le compte.');
      }
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

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow p-6 w-full max-w-md text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-3">Patientez...</h1>
          <p className="text-gray-700">Chargement...</p>
        </div>
      </div>
    }>
      <AuthCallbackInner />
    </Suspense>
  );
}
