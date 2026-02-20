'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase';
import { STORE_MODELS } from '@/lib/catalog-data';
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
  modelNames: {
    [key: string]: string;
  };
  modelOptionsCoefficients?: {
    [modelId: string]: {
      [optionKey: string]: number;
    };
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
  
  // État pour la gestion des coefficients d'options par produit
  const [selectedProductForOptions, setSelectedProductForOptions] = useState<string>('');
  
  // États pour le mode édition des cartes
  const [editingGlobal, setEditingGlobal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  
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
    modelCoefficients: {},
    modelNames: {},
    modelOptionsCoefficients: {}
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
      
      // Recharger les coefficients sans recharger la page
      setTimeout(() => {
        loadCoefficients();
      }, 1500);
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

  const removeProductCoefficient = async (modelId: string) => {
    // Au lieu de supprimer, on met la valeur par défaut
    // L'API l'écrira dans le fichier, et au prochain chargement
    // le filtrage intelligent l'enlèvera car égale au défaut
    const model = STORE_MODELS[modelId as keyof typeof STORE_MODELS];
    if (!model) return;

    const newCoefficients = {
      ...coefficients,
      modelCoefficients: {
        ...coefficients.modelCoefficients,
        [modelId]: coefficients.COEFF_MARGE  // Mettre le coefficient global
      },
      modelNames: {
        ...coefficients.modelNames,
        [modelId]: model.name
      }
    };

    setCoefficients(newCoefficients);
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
        body: JSON.stringify(newCoefficients),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la sauvegarde');
      }

      setMessage({ type: 'success', text: 'Coefficient réinitialisé au défaut avec succès !' });
      setTimeout(() => {
        setMessage(null);
        loadCoefficients();
      }, 1500);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Erreur lors de la sauvegarde' });
    } finally {
      setSaving(false);
    }
  };

  // Fonctions pour gérer les coefficients d'options par produit
  const updateProductOption = (modelId: string, optionKey: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      return;
    }

    setCoefficients({
      ...coefficients,
      modelOptionsCoefficients: {
        ...(coefficients.modelOptionsCoefficients || {}),
        [modelId]: {
          ...(coefficients.modelOptionsCoefficients?.[modelId] || {}),
          [optionKey]: numValue
        }
      }
    });
  };

  const resetProductOptions = async (modelId: string) => {
    // Au lieu de supprimer, on met les valeurs par défaut
    // L'API les écrira dans le fichier
    const newCoefficients = {
      ...coefficients,
      modelOptionsCoefficients: {
        ...(coefficients.modelOptionsCoefficients || {}),
        [modelId]: { ...coefficients.OPTIONS_COEFFICIENTS }  // Copier les coefficients globaux
      }
    };

    setCoefficients(newCoefficients);
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
        body: JSON.stringify(newCoefficients),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la sauvegarde');
      }

      setMessage({ type: 'success', text: 'Options réinitialisées au défaut avec succès !' });
      setTimeout(() => {
        setMessage(null);
        loadCoefficients();
      }, 1500);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Erreur lors de la sauvegarde' });
    } finally {
      setSaving(false);
    }
  };

  const copyGlobalOptionsToProduct = (modelId: string) => {
    setCoefficients({
      ...coefficients,
      modelOptionsCoefficients: {
        ...(coefficients.modelOptionsCoefficients || {}),
        [modelId]: { ...coefficients.OPTIONS_COEFFICIENTS }
      }
    });

    setMessage({ type: 'success', text: 'Coefficients globaux copiés vers ce produit' });
    setTimeout(() => setMessage(null), 3000);
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
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête simplifié */}
        <div className="mb-6">
          <Link href="/admin" className="text-blue-600 hover:text-blue-700 mb-3 inline-block text-sm">
            ← Retour au tableau de bord
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Coefficients</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Modifiez les marges globales et par produit en cliquant sur "Modifier" dans chaque carte
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

        {/* 🌍 CARTE GLOBALE - Coefficients par défaut */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-8 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                🌍 Coefficients Globaux
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Appliqués par défaut à tous les produits et options
              </p>
            </div>
            {!editingGlobal ? (
              <button
                onClick={() => setEditingGlobal(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                ✏️ Modifier
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingGlobal(false);
                    loadCoefficients();
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    handleSave();
                    setEditingGlobal(false);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  ✓ Valider
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coefficient de marge */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">📊</span>
                <h3 className="font-bold text-gray-900">Coefficient de Marge</h3>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Multiplié au prix d'achat pour tous les produits
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={coefficients.COEFF_MARGE}
                  onChange={(e) => updateCoeffMarge(e.target.value)}
                  disabled={!editingGlobal}
                  className={`px-4 py-3 border rounded-lg w-32 text-xl font-bold text-center ${
                    editingGlobal 
                      ? 'border-blue-500 bg-white text-gray-900' 
                      : 'border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed'
                  }`}
                />
                <span className="text-sm text-gray-600">
                  × Prix d'achat
                </span>
              </div>
            </div>

            {/* Coefficients options */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">⚙️</span>
                <h3 className="font-bold text-gray-900">Coefficients Options</h3>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Appliqués aux options de tous les produits
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {Object.entries(coefficients.OPTIONS_COEFFICIENTS).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <label className="text-xs text-gray-700 flex-1 truncate" title={key}>
                      {key.replace(/_/g, ' ')}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      value={value}
                      onChange={(e) => updateOptionCoeff(key as keyof CoefficientData['OPTIONS_COEFFICIENTS'], e.target.value)}
                      disabled={!editingGlobal}
                      className={`px-2 py-1 border rounded w-16 text-sm text-center ${
                        editingGlobal 
                          ? 'border-blue-500 bg-white' 
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 🏷️ GRILLE DE CARTES PRODUITS */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            🏷️ Coefficients par Produit
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Personnalisez les coefficients de marge et d'options pour chaque produit individuellement
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(STORE_MODELS)
              .sort((a, b) => a[1].name.localeCompare(b[1].name))
              .map(([modelId, model]) => {
                const isEditing = editingProduct === modelId;
                const hasCustomCoeff = coefficients.modelCoefficients[modelId] !== undefined;
                const currentMargeCoeff = hasCustomCoeff 
                  ? coefficients.modelCoefficients[modelId] 
                  : coefficients.COEFF_MARGE;
                
                const hasOptionsCoeff = coefficients.modelOptionsCoefficients?.[modelId] !== undefined;
                const optionsCount = hasOptionsCoeff 
                  ? Object.keys(coefficients.modelOptionsCoefficients![modelId]).length 
                  : 0;

                return (
                  <div 
                    key={modelId}
                    className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all border-2 ${
                      hasCustomCoeff || hasOptionsCoeff
                        ? 'border-green-400 bg-gradient-to-br from-green-50 to-white'
                        : 'border-gray-200'
                    }`}
                  >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-sm leading-tight">
                            {model.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">{modelId}</p>
                          {(hasCustomCoeff || hasOptionsCoeff) && (
                            <div className="flex gap-1 mt-2">
                              {hasCustomCoeff && (
                                <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full font-semibold">
                                  Marge ✓
                                </span>
                              )}
                              {hasOptionsCoeff && (
                                <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full font-semibold">
                                  {optionsCount} opt.
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {!isEditing ? (
                          <button
                            onClick={() => setEditingProduct(modelId)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium whitespace-nowrap"
                          >
                            ✏️ Modifier
                          </button>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => {
                                handleSave();
                                setEditingProduct(null);
                              }}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium whitespace-nowrap"
                            >
                              ✓ Valider
                            </button>
                            <button
                              onClick={() => {
                                setEditingProduct(null);
                                loadCoefficients();
                              }}
                              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs whitespace-nowrap"
                            >
                              Annuler
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-4">
                      {/* Coefficient de marge */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-semibold text-gray-700">
                            📊 Coef. Marge
                          </label>
                          {hasCustomCoeff && !isEditing && (
                            <button
                              onClick={() => {
                                removeProductCoefficient(modelId);
                              }}
                              className="text-xs text-gray-500 hover:text-red-600"
                              title="Réinitialiser au coefficient global"
                            >
                              ♻️ Défaut
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.1"
                            min="1"
                            value={hasCustomCoeff ? currentMargeCoeff : ''}
                            placeholder={`${coefficients.COEFF_MARGE}`}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              if (newValue && parseFloat(newValue) > 0) {
                                setCoefficients({
                                  ...coefficients,
                                  modelCoefficients: {
                                    ...coefficients.modelCoefficients,
                                    [modelId]: parseFloat(newValue)
                                  },
                                  modelNames: {
                                    ...coefficients.modelNames,
                                    [modelId]: model.name
                                  }
                                });
                              }
                            }}
                            disabled={!isEditing}
                            className={`flex-1 px-3 py-2 border rounded-lg text-center font-bold ${
                              isEditing
                                ? hasCustomCoeff
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            }`}
                          />
                          <span className="text-xs text-gray-500">
                            {!hasCustomCoeff && `(${coefficients.COEFF_MARGE})`}
                          </span>
                        </div>
                      </div>

                      {/* Coefficient options */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-semibold text-gray-700">
                            ⚙️ Coef. Options ({optionsCount || 'global'})
                          </label>
                          {hasOptionsCoeff && !isEditing && (
                            <button
                              onClick={() => {
                                resetProductOptions(modelId);
                              }}
                              className="text-xs text-gray-500 hover:text-red-600"
                              title="Réinitialiser aux coefficients globaux"
                            >
                              ♻️ Défaut
                            </button>
                          )}
                        </div>
                        
                        {isEditing ? (
                          <div className="space-y-2 max-h-48 overflow-y-auto bg-gray-50 rounded-lg p-2">
                            {Object.keys(coefficients.OPTIONS_COEFFICIENTS).map((optionKey) => {
                              const currentValue = coefficients.modelOptionsCoefficients?.[modelId]?.[optionKey];
                              const globalValue = coefficients.OPTIONS_COEFFICIENTS[optionKey as keyof typeof coefficients.OPTIONS_COEFFICIENTS];
                              const isCustom = currentValue !== undefined;

                              return (
                                <div key={optionKey} className="flex items-center gap-2">
                                  <label className="text-xs text-gray-700 flex-1 truncate" title={optionKey}>
                                    {optionKey.replace(/_/g, ' ')}
                                  </label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    value={currentValue !== undefined ? currentValue : globalValue}
                                    onChange={(e) => updateProductOption(modelId, optionKey, e.target.value)}
                                    className={`px-2 py-1 border rounded w-16 text-xs text-center ${
                                      isCustom ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                                    }`}
                                    placeholder={`${globalValue}`}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 text-center">
                            {hasOptionsCoeff 
                              ? `${optionsCount} option(s) personnalisée(s)`
                              : 'Utilise les coefficients globaux'
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => router.push('/admin')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Retour Admin
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
