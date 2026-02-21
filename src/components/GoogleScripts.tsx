'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useConsent } from '@/hooks/useConsent';

/**
 * Composant pour charger conditionnellement les scripts Google
 * (Analytics, Ads) UNIQUEMENT si le consentement est accordé.
 * 
 * Conformité CNIL :
 * ✅ Aucun chargement de script avant consentement explicite
 * ✅ Respect du refus de consentement (scripts jamais chargés)
 * ✅ Rechargement dynamique si consentement modifié
 */

// ⚠️ IMPORTANT : Remplacez ces IDs par vos vrais identifiants Google
const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GADS_ID || 'AW-17449014086';

export default function GoogleScripts() {
  const { preferences, hasConsent } = useConsent();

  // Écouter les changements de consentement en temps réel
  useEffect(() => {
    const handleConsentUpdate = (event: CustomEvent) => {
      console.log('[GoogleScripts] Consentement mis à jour:', event.detail);
      
      // Si l'utilisateur retire son consentement, on peut nettoyer les cookies
      if (event.detail.analytics === false) {
        // Supprimer cookies Google Analytics
        document.cookie.split(";").forEach((c) => {
          if (c.trim().startsWith('_ga') || c.trim().startsWith('_gid')) {
            const cookieName = c.split('=')[0].trim();
            document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
          }
        });
      }
    };

    window.addEventListener('consentUpdated' as any, handleConsentUpdate);
    return () => window.removeEventListener('consentUpdated' as any, handleConsentUpdate);
  }, []);

  // Ne charger aucun script si l'utilisateur n'a pas encore répondu ou a refusé
  if (!hasConsent) {
    return null;
  }

  return (
    <>
      {/* GOOGLE ANALYTICS - Chargé uniquement si consentement analytics */}
      {preferences.analytics && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                
                // Configuration Google Analytics avec anonymisation IP
                gtag('config', '${GOOGLE_ANALYTICS_ID}', {
                  anonymize_ip: true,              // Anonymiser les IPs (RGPD)
                  cookie_flags: 'SameSite=None;Secure', // Sécurité cookies
                  cookie_expires: 63072000,        // 2 ans (CNIL max 25 mois recommandé)
                });

                console.log('[GoogleScripts] Google Analytics chargé');
              `,
            }}
          />
        </>
      )}

      {/* GOOGLE ADS - Chargé uniquement si consentement marketing */}
      {preferences.marketing && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          />
          <Script
            id="google-ads"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                
                // Configuration Google Ads
                gtag('config', '${GOOGLE_ADS_ID}', {
                  cookie_flags: 'SameSite=None;Secure',
                });

                console.log('[GoogleScripts] Google Ads chargé');
              `,
            }}
          />
        </>
      )}

      {/* MESSAGE DE DEBUG (à retirer en production) */}
      <Script
        id="consent-debug"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            console.log('[GoogleScripts] État du consentement:', ${JSON.stringify(preferences)});
          `,
        }}
      />
    </>
  );
}
