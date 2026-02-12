/**
 * API Route pour récupérer les données du configurateur
 * Avec mise en cache pour optimiser les performances
 * 
 * Endpoints:
 * - GET /api/configurator/fabrics - Liste des toiles
 * - GET /api/configurator/colors - Liste des couleurs de structure
 * - GET /api/configurator/data - Toutes les données consolidées
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  fetchActiveFabrics,
  fetchFrameColors,
  fetchFinishTypes,
  fetchConfiguratorData
} from '@/lib/configurator-data';
import type { ConfiguratorFabricsResponse, ConfiguratorColorsResponse } from '@/types/configurator';

// Cache des données (durée: 5 minutes)
let cachedData: {
  fabrics?: ConfiguratorFabricsResponse;
  colors?: ConfiguratorColorsResponse;
  timestamp?: number;
} = {};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Vérifie si le cache est encore valide
 */
function isCacheValid(timestamp?: number): boolean {
  if (!timestamp) return false;
  return Date.now() - timestamp < CACHE_DURATION;
}

/**
 * GET /api/configurator/data
 * Retourne toutes les données du configurateur en une seule requête
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'all';
    const productSlug = searchParams.get('productSlug');
    const forceRefresh = searchParams.get('refresh') === 'true';

    // Endpoint: fabrics
    if (endpoint === 'fabrics') {
      // Vérifier le cache
      if (!forceRefresh && cachedData.fabrics && isCacheValid(cachedData.timestamp)) {
        return NextResponse.json(cachedData.fabrics, {
          headers: {
            'Cache-Control': 'public, max-age=300', // 5 minutes
            'X-Cache': 'HIT'
          }
        });
      }

      const fabrics = await fetchActiveFabrics({ availableOnly: true });
      
      const response: ConfiguratorFabricsResponse = {
        fabrics,
        types: [], // Les types sont inclus dans les fabrics via la relation
        totalCount: fabrics.length,
        lastUpdate: new Date().toISOString()
      };

      // Mettre à jour le cache
      cachedData.fabrics = response;
      cachedData.timestamp = Date.now();

      return NextResponse.json(response, {
        headers: {
          'Cache-Control': 'public, max-age=300',
          'X-Cache': 'MISS'
        }
      });
    }

    // Endpoint: colors
    if (endpoint === 'colors') {
      // Vérifier le cache (uniquement si pas de productSlug spécifique)
      if (!forceRefresh && !productSlug && cachedData.colors && isCacheValid(cachedData.timestamp)) {
        return NextResponse.json(cachedData.colors, {
          headers: {
            'Cache-Control': 'public, max-age=300',
            'X-Cache': 'HIT'
          }
        });
      }

      const [colors, finishTypes] = await Promise.all([
        fetchFrameColors({ productSlug: productSlug || undefined }),
        fetchFinishTypes()
      ]);

      const response: ConfiguratorColorsResponse = {
        colors,
        finishTypes,
        totalCount: colors.length,
        lastUpdate: new Date().toISOString()
      };

      // Mettre à jour le cache (uniquement si pas de productSlug)
      if (!productSlug) {
        cachedData.colors = response;
        cachedData.timestamp = Date.now();
      }

      return NextResponse.json(response, {
        headers: {
          'Cache-Control': productSlug ? 'public, max-age=60' : 'public, max-age=300',
          'X-Cache': productSlug ? 'BYPASS' : 'MISS'
        }
      });
    }

    // Endpoint: all (données consolidées)
    if (endpoint === 'all') {
      const data = await fetchConfiguratorData();

      return NextResponse.json({
        success: true,
        data,
        lastUpdate: new Date().toISOString()
      }, {
        headers: {
          'Cache-Control': 'public, max-age=300'
        }
      });
    }

    return NextResponse.json(
      { error: 'Endpoint invalide. Utilisez: fabrics, colors, ou all' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Erreur API configurator:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/configurator/data
 * Permet de vider le cache manuellement (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.action === 'clear-cache') {
      cachedData = {};
      return NextResponse.json({ 
        success: true, 
        message: 'Cache vidé avec succès' 
      });
    }

    return NextResponse.json(
      { error: 'Action non reconnue' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Erreur POST configurator:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
