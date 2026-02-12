/**
 * Hooks React pour récupérer les données du configurateur
 * Gère le chargement, le cache et les erreurs
 */

import { useState, useEffect, useCallback } from 'react';
import type { ToileColor, MatestColor, MatestFinishType, ConfiguratorData } from '@/types/configurator';

// ============================================
// HOOK: useConfiguratorFabrics
// ============================================

export interface UseFabricsOptions {
  manufacturer?: string;
  category?: string;
  colorFamily?: string;
  autoFetch?: boolean;
}

export function useConfiguratorFabrics(options: UseFabricsOptions = {}) {
  const [fabrics, setFabrics] = useState<ToileColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFabrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/configurator/data?endpoint=fabrics');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des toiles');
      }

      const data = await response.json();
      let filteredFabrics = data.fabrics || [];

      // Appliquer les filtres côté client si nécessaire
      if (options.manufacturer && options.manufacturer !== 'all') {
        filteredFabrics = filteredFabrics.filter(
          (f: ToileColor) => f.toile_type?.manufacturer === options.manufacturer
        );
      }

      if (options.category && options.category !== 'all') {
        filteredFabrics = filteredFabrics.filter(
          (f: ToileColor) => f.category === options.category
        );
      }

      if (options.colorFamily && options.colorFamily !== 'all') {
        filteredFabrics = filteredFabrics.filter(
          (f: ToileColor) => f.color_family === options.colorFamily
        );
      }

      setFabrics(filteredFabrics);
    } catch (err) {
      console.error('Erreur fetchFabrics:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [options.manufacturer, options.category, options.colorFamily]);

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchFabrics();
    }
  }, [fetchFabrics, options.autoFetch]);

  return {
    fabrics,
    loading,
    error,
    refetch: fetchFabrics
  };
}

// ============================================
// HOOK: useConfiguratorColors
// ============================================

export interface UseColorsOptions {
  productSlug?: string;
  finish?: string;
  autoFetch?: boolean;
}

export function useConfiguratorColors(options: UseColorsOptions = {}) {
  const [colors, setColors] = useState<MatestColor[]>([]);
  const [finishTypes, setFinishTypes] = useState<MatestFinishType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchColors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ endpoint: 'colors' });
      if (options.productSlug) {
        params.append('productSlug', options.productSlug);
      }

      const response = await fetch(`/api/configurator/data?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des couleurs');
      }

      const data = await response.json();
      let filteredColors = data.colors || [];

      // Appliquer le filtre finish côté client si nécessaire
      if (options.finish && options.finish !== 'all') {
        filteredColors = filteredColors.filter(
          (c: MatestColor) => c.finish === options.finish
        );
      }

      setColors(filteredColors);
      setFinishTypes(data.finishTypes || []);
    } catch (err) {
      console.error('Erreur fetchColors:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [options.productSlug, options.finish]);

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchColors();
    }
  }, [fetchColors, options.autoFetch]);

  return {
    colors,
    finishTypes,
    loading,
    error,
    refetch: fetchColors
  };
}

// ============================================
// HOOK: useConfiguratorData (complet)
// ============================================

export function useConfiguratorData() {
  const [data, setData] = useState<ConfiguratorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/configurator/data?endpoint=all');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      console.error('Erreur fetchConfiguratorData:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// ============================================
// UTILITAIRES
// ============================================

/**
 * Fonction helper pour vider le cache
 */
export async function clearConfiguratorCache(): Promise<boolean> {
  try {
    const response = await fetch('/api/configurator/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'clear-cache' })
    });

    return response.ok;
  } catch (error) {
    console.error('Erreur clearCache:', error);
    return false;
  }
}
