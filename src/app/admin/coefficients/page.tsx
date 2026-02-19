'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';

interface CoefficientData {
  COEFF_MARGE: number;
  OPTIONS_COEFFICIENTS: {
    LED_ARMS: number;
    LED_CASSETTE: number;
    LAMBREQUIN_FIXE: number;
    LAMBREQUIN_ENROULABLE: number;
    CEILING_MOUNT: number;
    AUVENT: number;
    FABRIC: number;
    FRAME_COLOR_CUSTOM: number;
    INSTALLATION: number;
  };
  modelCoefficients: {
    [key: string]: number;
  };
}

export default function CoefficientsAdmin() {
  const router = useRouter();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [coefficients, setCoefficients] = useState<CoefficientData>({
    COEFF_MARGE: 1.8,
    OPTIONS_COEFFICIENTS: {
      LED_ARMS: 2.0,
      LED_CASSETTE: 2.0,
      LAMBREQUIN_FIXE: 1.5,
      LAMBREQUIN_ENROULABLE: 1.8,
      CEILING_MOUNT: 1.6,
      AUVENT: 1.7,
      FABRIC: 1.4,
      FRAME_COLOR_CUSTOM: 1.8,
      INSTALLATION: 1.3,
    },
    modelCoefficients: {}
  });

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setCheckingAuth(false);
        router.push('/auth');
        return;
      }

      try {
        const supabase = getSupabaseClient();
        if (!supabase) throw new Error('Supabase non initialisé');
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) {
          setCheckingAuth(false);
          router.push('/auth');
          return;
        }
        const res = await fetch('/api/admin/check', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          setCheckingAuth(false);
          router.push('/');
          return;
        }
        setIsAdmin(true);
        setCheckingAuth(false);
      } catch (e) {
        console.error('Admin check error', e);
        setCheckingAuth(false);
        router.push('/');
      }
    };

    checkAdmin();
  }, [user, router]);

  // Charger les coefficients actuels
  useEffect(() => {
    if (isAdmin) {
      loadCoefficients();
    }
  }, [isAdmin]);

  const loadCoefficients = async () => {
    try {
      const response = await fetch('/api/admin/coefficients');
      if (!response.ok) throw new Error('Erreur chargement coefficients');
      const data = await response.json();
      setCoefficients(data);
    } catch (error) {
      console.error('Erreur chargement coefficients:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des coefficients' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase non initialisé');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Non authentifié');

      const response = await fetch('/api/admin/coefficients', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(coefficients),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la sauvegarde');
      }

      setMessage({ type: 'success', text: 'Coefficients mis à jour avec succès !' });
      
      // Recharger les coefficients après 2 secondes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Erreur lors de la sauvegarde' });
    } finally {
      setSaving(false);
    }
  };

  const updateCoeffMarge = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setCoefficients({ ...coefficients, COEFF_MARGE: numValue });
    }
  };

  const updateOptionCoeff = (key: keyof CoefficientData['OPTIONS_COEFFICIENTS'], value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setCoefficients({
        ...coefficients,
        OPTIONS_COEFFICIENTS: {
          ...coefficients.OPTIONS_COEFFICIENTS,
          [key]: numValue
        }
      });
    }
  };

  const updateModelCoeff = (modelId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setCoefficients({
        ...coefficients,
        modelCoefficients: {
          ...coefficients.modelCoefficients,
          [modelId]: numValue
        }
      });
    }
  };

  if (checkingAuth || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8">
          <Link href="/admin" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Retour au tableau de bord
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Coefficients de Vente</h1>
          <p className="text-gray-600 mt-2">
            Modifier les marges appliquées sur les produits et options
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Coefficient global */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Coefficient de marge par défaut</h2>
          <p className="text-gray-600 mb-4 text-sm">
            Coefficient appliqué par défaut à tous les modèles (avant application des coefficients spécifiques)
          </p>
          <div className="flex items-center gap-4">
            <label className="font-medium text-gray-700">COEFF_MARGE :</label>
            <input
              type="number"
              step="0.1"
              min="1"
              value={coefficients.COEFF_MARGE}
              onChange={(e) => updateCoeffMarge(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg w-32 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <span className="text-gray-600 text-sm">
              (exemple : 1.8 = 80% de marge)
            </span>
          </div>
        </div>

        {/* Coefficients par option */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Coefficients par type d'option</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Marges différenciées appliquées aux différentes options
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(coefficients.OPTIONS_COEFFICIENTS).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="font-medium text-gray-900">{key}</label>
                  <p className="text-xs text-gray-500">
                    {getOptionDescription(key)}
                  </p>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={value}
                  onChange={(e) => updateOptionCoeff(key as keyof CoefficientData['OPTIONS_COEFFICIENTS'], e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg w-24 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Coefficients par modèle */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Coefficients spécifiques par modèle</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Ces coefficients remplacent le COEFF_MARGE par défaut pour les modèles spécifiés
          </p>
          <div className="space-y-4">
            {Object.entries(coefficients.modelCoefficients).map(([modelId, value]) => (
              <div key={modelId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="font-medium text-gray-900">{modelId.toUpperCase()}</label>
                  <p className="text-xs text-gray-500">Coefficient spécifique pour ce modèle</p>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={value}
                  onChange={(e) => updateModelCoeff(modelId, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg w-24 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => router.push('/admin')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Enregistrement...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function getOptionDescription(key: string): string {
  const descriptions: { [key: string]: string } = {
    LED_ARMS: 'LED sur les bras - technologie avancée',
    LED_CASSETTE: 'LED dans le coffre - éclairage intégré',
    LAMBREQUIN_FIXE: 'Lambrequin fixe - accessoire basique',
    LAMBREQUIN_ENROULABLE: 'Lambrequin enroulable motorisé',
    CEILING_MOUNT: 'Fixation plafond - installation spéciale',
    AUVENT: 'Auvent et joues - protection latérale',
    FABRIC: 'Toile de store - matière première',
    FRAME_COLOR_CUSTOM: 'Couleur RAL personnalisée',
    INSTALLATION: 'Installation professionnelle',
  };
  return descriptions[key] || '';
}
