/**
 * Script de test pour vérifier la règle métier des 4m.
 * Exécuter avec : npx tsx scripts/test-chat-scenario.ts
 */

async function testScenario() {
  const API_URL = 'http://localhost:3000/api/chat';
  
  console.log('🧪 TEST SCÉNARIO : Règle des 4m (Avancée > 4000mm)');
  console.log('------------------------------------------------');

  // Simulation de l'historique de conversation
  const messages = [
    { 
      role: 'assistant', 
      content: 'Bonjour ! Quel est votre besoin ? Protéger l\'intérieur de la maison ou manger en terrasse ?' 
    },
    { 
      role: 'user', 
      content: 'Manger en terrasse' 
    },
    { 
      role: 'assistant', 
      content: 'Quelles sont les dimensions de votre terrasse (Longueur le long du mur x Profondeur/Avancée vers le jardin) et son exposition ?' 
    },
    { 
      role: 'user', 
      content: 'Elle fait 6m de large et 5m de profondeur.' // 🚨 Cas critique : 5m > 4m
    }
  ];

  console.log('📤 Envoi du message user : "5m de profondeur"');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
    }

    const rawResponse = await response.text();
    
    console.log('\n📥 Réponse reçue de l\'IA :');
    // Nettoyage sommaire du format stream Vercel AI (0:"text") pour l'affichage
    const cleanText = rawResponse.replace(/^\d+:"/gm, '').replace(/"$/gm, '').replace(/\\n/g, '\n');
    console.log(cleanText);

    console.log('\n📊 RÉSULTAT DU TEST :');
    if (rawResponse.includes('4,5m') || rawResponse.includes('professionnels')) {
      console.log('✅ SUCCÈS : La règle des 4m s\'est déclenchée.');
      console.log('   L\'IA a proposé de revenir à 4m comme prévu.');
    } else {
      console.log('❌ ÉCHEC : La règle ne semble pas s\'être déclenchée.');
      console.log('   Vérifiez que le prompt système dans route.ts contient bien la RÈGLE MÉTIER 1.');
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution du test :', error);
    console.log('💡 Conseil : Assurez-vous que le serveur tourne sur localhost:3000 (npm run dev)');
  }
}

testScenario();