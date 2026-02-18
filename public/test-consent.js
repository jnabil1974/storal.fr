// Script de test pour le système de consentement cookies
// À exécuter dans la console du navigateur (F12)

console.log('🧪 TEST DU SYSTÈME DE CONSENTEMENT COOKIES');
console.log('==========================================\n');

// Test 1 : Vérifier le localStorage
console.log('✅ TEST 1 : État du consentement dans localStorage');
const consent = localStorage.getItem('storal_cookie_consent');
if (consent) {
  const parsed = JSON.parse(consent);
  console.log('   Consentement trouvé:', parsed);
  console.log('   Timestamp:', new Date(parsed.timestamp).toLocaleString('fr-FR'));
  console.log('   Version:', parsed.version);
  console.log('   Préférences:', parsed.preferences);
} else {
  console.log('   ❌ Aucun consentement enregistré');
}
console.log('\n');

// Test 2 : Vérifier les cookies Google Analytics
console.log('✅ TEST 2 : Cookies Google Analytics');
const gaCookies = document.cookie.split(';').filter(c => 
  c.trim().startsWith('_ga') || c.trim().startsWith('_gid')
);
if (gaCookies.length > 0) {
  console.log('   ✅ Cookies Google trouvés:', gaCookies.length);
  gaCookies.forEach(c => console.log('      -', c.trim()));
} else {
  console.log('   ❌ Aucun cookie Google (normal si refusé)');
}
console.log('\n');

// Test 3 : Vérifier que gtag est chargé
console.log('✅ TEST 3 : Fonction gtag Google');
if (typeof window.gtag !== 'undefined') {
  console.log('   ✅ window.gtag est défini');
  console.log('   DataLayer entries:', window.dataLayer?.length || 0);
} else {
  console.log('   ❌ window.gtag non défini (normal si refusé)');
}
console.log('\n');

// Test 4 : Tester l'événement personnalisé
console.log('✅ TEST 4 : Événement de mise à jour du consentement');
window.addEventListener('consentUpdated', (e) => {
  console.log('   🎉 Événement consentUpdated reçu:', e.detail);
});
console.log('   Écouteur ajouté. Modifiez le consentement pour tester.');
console.log('\n');

// Fonctions utiles pour tester
console.log('📚 FONCTIONS UTILES :');
console.log('   - resetConsent() : Réinitialiser le consentement');
console.log('   - checkAnalytics() : Vérifier si Analytics est actif');
console.log('   - simulateExpiry() : Simuler expiration du consentement');
console.log('\n');

window.resetConsent = function() {
  localStorage.removeItem('storal_cookie_consent');
  console.log('✅ Consentement réinitialisé. Rechargez la page.');
};

window.checkAnalytics = function() {
  const hasGtag = typeof window.gtag !== 'undefined';
  const hasCookies = document.cookie.includes('_ga');
  console.log('Analytics actif:', hasGtag && hasCookies ? '✅ OUI' : '❌ NON');
  return hasGtag && hasCookies;
};

window.simulateExpiry = function() {
  const consent = localStorage.getItem('storal_cookie_consent');
  if (consent) {
    const parsed = JSON.parse(consent);
    // Mettre un timestamp vieux de 14 mois
    parsed.timestamp = Date.now() - (14 * 30 * 24 * 60 * 60 * 1000);
    localStorage.setItem('storal_cookie_consent', JSON.stringify(parsed));
    console.log('✅ Timestamp modifié (14 mois en arrière). Rechargez la page.');
  } else {
    console.log('❌ Aucun consentement à modifier');
  }
};

console.log('🎉 Tests prêts ! Tapez les fonctions ci-dessus dans la console.\n');
