/**
 * Types pour la gestion du consentement cookies (CNIL)
 * Conforme aux recommandations RGPD/ePrivacy
 */

export type CookieCategory = 'necessary' | 'analytics' | 'marketing' | 'preferences';

export interface ConsentPreferences {
  necessary: boolean;      // Toujours true (cookies techniques obligatoires)
  analytics: boolean;      // Google Analytics
  marketing: boolean;      // Google Ads, Meta Pixel, etc.
  preferences: boolean;    // Langues, thème, préférences utilisateur
}

export interface ConsentState {
  timestamp: number;           // Date du consentement
  version: string;             // Version de la politique (pour forcer nouvelle demande si changement)
  preferences: ConsentPreferences;
  hasResponded: boolean;       // L'utilisateur a-t-il répondu ?
}

export const CONSENT_VERSION = '1.0'; // Incrémenter si politique change
export const CONSENT_STORAGE_KEY = 'storal_cookie_consent';
export const CONSENT_DURATION_DAYS = 365; // 13 mois maximum CNIL
