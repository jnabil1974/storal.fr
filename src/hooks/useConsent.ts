'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ConsentState, ConsentPreferences } from '@/types/consent';
import { CONSENT_VERSION, CONSENT_STORAGE_KEY, CONSENT_DURATION_DAYS } from '@/types/consent';

const DEFAULT_PREFERENCES: ConsentPreferences = {
  necessary: true,    // Toujours accepté (cookies techniques)
  analytics: false,   // Refusé par défaut (CNIL)
  marketing: false,   // Refusé par défaut (CNIL)
  preferences: false, // Refusé par défaut
};

/**
 * Hook personnalisé pour gérer le consentement cookies
 * Conforme CNIL : pas de cookies tiers avant consentement explicite
 */
export function useConsent() {
  const [consentState, setConsentState] = useState<ConsentState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le consentement depuis localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) {
        setIsLoading(false);
        return;
      }

      const parsed: ConsentState = JSON.parse(stored);
      
      // Vérifier si le consentement est encore valide
      const now = Date.now();
      const expiryDate = parsed.timestamp + (CONSENT_DURATION_DAYS * 24 * 60 * 60 * 1000);
      const isExpired = now > expiryDate;
      const isOldVersion = parsed.version !== CONSENT_VERSION;

      if (isExpired || isOldVersion) {
        // Consentement expiré ou ancienne version → redemander
        localStorage.removeItem(CONSENT_STORAGE_KEY);
        setConsentState(null);
      } else {
        setConsentState(parsed);
      }
    } catch (error) {
      console.error('[useConsent] Erreur lecture localStorage:', error);
      localStorage.removeItem(CONSENT_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sauvegarder le consentement
  const saveConsent = useCallback((preferences: ConsentPreferences) => {
    const newState: ConsentState = {
      timestamp: Date.now(),
      version: CONSENT_VERSION,
      preferences: {
        ...preferences,
        necessary: true, // Force toujours les cookies nécessaires
      },
      hasResponded: true,
    };

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newState));
      setConsentState(newState);

      // Déclencher événement personnalisé pour recharger scripts
      window.dispatchEvent(new CustomEvent('consentUpdated', { 
        detail: newState.preferences 
      }));

      return true;
    } catch (error) {
      console.error('[useConsent] Erreur sauvegarde:', error);
      return false;
    }
  }, []);

  // Accepter tous les cookies
  const acceptAll = useCallback(() => {
    return saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  }, [saveConsent]);

  // Refuser tous les cookies (sauf nécessaires)
  const rejectAll = useCallback(() => {
    return saveConsent(DEFAULT_PREFERENCES);
  }, [saveConsent]);

  // Réinitialiser le consentement (pour tester ou si l'utilisateur veut revoir le banner)
  const resetConsent = useCallback(() => {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    setConsentState(null);
    window.dispatchEvent(new CustomEvent('consentReset'));
  }, []);

  return {
    consentState,
    isLoading,
    hasConsent: consentState?.hasResponded ?? false,
    preferences: consentState?.preferences ?? DEFAULT_PREFERENCES,
    acceptAll,
    rejectAll,
    saveConsent,
    resetConsent,
  };
}
