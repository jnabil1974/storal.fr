'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase';

export default function FluxChatbotPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

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

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-xl font-bold text-[#2c3e50] uppercase tracking-wider">Vérification...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      minHeight: '100vh',
      marginLeft: '-2rem',
      marginRight: '-2rem',
      marginTop: '-2rem',
      marginBottom: '-2rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#2c3e50',
          marginBottom: '10px',
          fontSize: '2.5em',
          fontWeight: 'bold'
        }}>
          🤖 Flux de Conversation - Chatbot Storal
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#7f8c8d',
          marginBottom: '40px',
          fontSize: '1.1em'
        }}>
          Diagramme complet du processus de configuration d'un store banne
        </p>

        {/* Légende */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
          margin: '30px 0',
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '10px',
          color: '#2c3e50'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9em', color: '#2c3e50' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
            <span><strong>Phase 1:</strong> Environnement (Diagnostic)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9em', color: '#2c3e50' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}></div>
            <span><strong>Phase 2:</strong> Validation du Projet</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9em', color: '#2c3e50' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}></div>
            <span><strong>Phase 3:</strong> Esthétique (Style)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9em', color: '#2c3e50' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}></div>
            <span><strong>Phase 4:</strong> Récapitulatif & Offre</span>
          </div>
        </div>

        {/* PHASE 1 */}
        <Phase1 />
        <Arrow />
        
        {/* PHASE 2 */}
        <Phase2 />
        <Arrow />
        
        {/* PHASE 3 */}
        <Phase3 />
        <Arrow />
        
        {/* PHASE 4 */}
        <Phase4 />

        {/* Points clés */}
        <PointsCles />

        {/* Footer */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#34495e',
          color: 'white',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <p><strong>📅 Dernière mise à jour :</strong> 15 février 2026 - 20h00</p>
          <p style={{ marginTop: '10px', opacity: 0.8 }}>Ce diagramme reflète la logique complète du prompt du chatbot Storal</p>
          <p style={{ marginTop: '5px', opacity: 0.7, fontSize: '0.9em' }}>✨ Ajout recommandation 6m systématique + validation 4m + clarification question dimensions + redirection contact</p>
        </div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div style={{ textAlign: 'center', fontSize: '2em', color: '#95a5a6', margin: '10px 0' }}>
      ⬇️
    </div>
  );
}

function Phase1() {
  return (
    <div style={{
      margin: '30px 0',
      padding: '25px',
      borderRadius: '15px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{ fontSize: '1.8em', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', color: 'white' }}>
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '15px',
          fontSize: '1.2em',
          color: '#2c3e50',
          fontWeight: 'bold'
        }}>1</div>
        <div>PHASE 1 : ENVIRONNEMENT (Le Diagnostic Technique)</div>
      </div>

      <Step title="📐 ÉTAPE 1A - DIMENSIONS" content={
        <>
          Question : "Quelles sont les dimensions de votre <strong>terrasse/espace à couvrir</strong> ?"
          <br />• <strong>Largeur de votre terrasse</strong> : ? mètres
          <br />• <strong>Profondeur de votre terrasse</strong> : ? mètres
          <br /><br />→ Déduction 30cm automatique (dimensions TERRASSE → dimensions STORE)
          <br />→ <strong>NOUVEAU :</strong> Si largeur &gt; 6.00m : Recommandation SYSTÉMATIQUE d'optimiser à 6m (quelle que soit la dimension)
          <br />→ Client peut insister pour conserver sa largeur supérieure
        </>
      } />

      <div style={{
        background: 'rgba(255,193,7,0.9)',
        padding: '15px',
        borderRadius: '10px',
        borderLeft: '4px solid #ffc107',
        margin: '15px 0',
        color: '#1a1a1a'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.15em', marginBottom: '12px', color: '#d32f2f' }}>
          ⚠️ ÉTAPE 1A-VALIDATION - LIMITE AVANCÉE 4 MÈTRES (CRITIQUE)
        </div>
        <div style={{ fontSize: '0.95em', lineHeight: 1.6, color: '#1a1a1a' }}>
          <strong>VÉRIFICATION AUTOMATIQUE :</strong> Si avancée du store &gt; 4.00m
          <br /><br />
          <strong>🏗️ Détection :</strong> Après calcul dimensions store (profondeur terrasse -30cm)
          <br />→ Si résultat &gt; 4.00m → Arrêt immédiat du processus standard
          <br /><br />
          <strong>💬 Message au client :</strong>
          <br />"🏗️ Configuration Technique Avancée Détectée
          <br /><br />Votre projet nécessite une <span style={{ background: 'rgba(0,0,0,0.2)', padding: '3px 8px', borderRadius: '5px', fontWeight: 'bold', color: 'white' }}>avancée de [X]m</span>, ce qui dépasse la limite standard de 4 mètres.
          <br /><br />📏 <strong>Pourquoi cette limite ?</strong>
          <br />• Calculs structurels spécifiques requis (étude de charges)
          <br />• Renforcements techniques nécessaires (bras, moteur, fixations)
          <br />• Contexte architectural à analyser (vents, exposition)
          <br />• Budget substantiellement différent des configurations standard
          <br /><br />💼 Ces configurations sont destinées aux <strong>projets professionnels</strong> (CHR, hôtels, commerces) ou <strong>résidentiels haut de gamme</strong>."
          <br /><br />
          <div style={{ background: 'rgba(255,152,0,0.5)', border: '2px dashed rgba(255,152,0,0.9)', padding: '15px', borderRadius: '10px', marginTop: '15px', color: '#1a1a1a' }}>
            <strong style={{ color: '#1a1a1a' }}>🎯 2 OPTIONS PROPOSÉES :</strong>
            <br /><br />
            <div style={{ background: 'rgba(76,175,80,0.3)', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #4caf50', margin: '10px 0', color: '#1a1a1a' }}>
              <strong style={{ color: '#1a1a1a' }}>Option 1 :</strong> Ajuster à 4.00m (limite configurations standard)
              <br />→ Continuer le processus normalement
              <br />→ Devis immédiat avec nos outils automatisés
            </div>
            <div style={{ background: 'rgba(33,150,243,0.3)', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #2196f3', margin: '10px 0', color: '#1a1a1a' }}>
              <strong style={{ color: '#1a1a1a' }}>Option 2 :</strong> Conserver [X]m et contacter notre bureau d'études
              <br />→ <strong>REDIRECTION AUTOMATIQUE</strong> vers formulaire contact pré-rempli
              <br />→ Appel tool <span style={{ background: 'rgba(0,0,0,0.15)', padding: '3px 8px', borderRadius: '5px', fontWeight: 'bold', color: '#1a1a1a' }}>redirect_to_contact</span>
              <br />→ Délai 2 secondes → Ouverture /contact?subject=...&message=...
              <br />→ Formulaire contient : dimensions, raison technique
            </div>
          </div>
          <br />
          <strong style={{ color: '#d32f2f' }}>🔒 RÈGLE ABSOLUE :</strong> JAMAIS calculer de prix ni proposer de modèles pour avancée &gt; 4.00m
          <br />→ Ces projets nécessitent étude personnalisée obligatoire
        </div>
      </div>

      <DecisionBox 
        title="⚠️ ÉTAPE 1A-BIS - VALIDATION MODÈLE PRÉ-SÉLECTIONNÉ (CRITIQUE)"
        options={[
          {
            label: '✅ SI MODÈLE MENTIONNÉ AU DÉPART',
            content: <>
              (ex: "Je veux un KISS IMY")
              <br />1. Identifier le modèle + son type (coffre/monobloc/traditionnel)
              <br />2. Consulter largeur max et avancée max
              <br />3. Comparer avec dimensions demandées
            </>
          },
          {
            label: '➡️ SI AUCUN MODÈLE MENTIONNÉ',
            content: 'Continuer normalement à l\'ÉTAPE 1B'
          }
        ]}
      />

      <Step title="📌 ÉTAPE 1B - OBSTACLES" content={
        <>
          "Y a-t-il des obstacles (mur, arbre, poteau) ?" (Oui/Non)
          <br />→ Si dimensions &gt; 6m × 4m : Vérification PRÉCISE
          <br />→ Adapter rectangle si obstacles présents
        </>
      } />

      <Step title="🧭 ÉTAPE 1C - ORIENTATION & RISQUES" content={
        <>
          "Vers quelle direction : Nord, Sud, Est ou Ouest ?"
          <br />→ Si Ouest/Est : Recommander Lambrequin Enroulable
          <br />→ "Êtes-vous en bord de mer ?" (Certifications Qualimarine/Qualicoat)
        </>
      } />

      <Step title="📏 ÉTAPE 1D - HAUTEUR & ÉLECTRICITÉ" content={
        <>
          "À quelle hauteur souhaitez-vous installer le store ?"
          <br />"De quel côté la sortie de câble électrique ? (Gauche/Droite)"
        </>
      } />

      <Step title="💡 ÉTAPE 1E - ÉCLAIRAGE" content={
        <>
          "Pensez-vous utiliser le store le soir ?"
          <br />→ Si oui : Proposer LED Bras ou LED Coffre
        </>
      } />

      <Step title="💳 ÉTAPE 1F - POSE & TVA" content={
        <>
          "Installation par vous-même ou nos experts ?"
          <br />→ Si maison &gt; 2 ans + pose Storal : TVA 10% (au lieu de 20%)
        </>
      } />
    </div>
  );
}

function Phase2() {
  return (
    <div style={{
      margin: '30px 0',
      padding: '25px',
      borderRadius: '15px',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white'
    }}>
      <div style={{ fontSize: '1.8em', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', color: 'white' }}>
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '15px',
          fontSize: '1.2em',
          color: '#2c3e50',
          fontWeight: 'bold'
        }}>2</div>
        <div>PHASE 2 : VALIDATION DU PROJET (Le Verrouillage)</div>
      </div>

      <Step title="📋 RÉCAPITULATIF TECHNIQUE" content={
        <>
          Afficher un résumé complet :
          <br />• Dimensions : largeur × avancée <strong>(plafonné à 4.00m pour configurations standard)</strong>
          <br />• Orientation & Environnement
          <br />• Hauteur de pose & Sortie câble
          <br />• Options : LED, Pose Storal, TVA
          <br /><br />
          <span style={{ background: 'rgba(0,0,0,0.2)', padding: '3px 8px', borderRadius: '5px', fontWeight: 'bold', color: 'white' }}>⚠️ NE PAS mentionner de modèle spécifique ici</span>
        </>
      } />

      <Step title="✅ QUESTION DE VALIDATION" content={
        <>
          "Ce diagnostic technique vous semble-t-il complet pour passer à la personnalisation ?"
          <br />→ Si NON : Reposer les questions nécessaires
          <br />→ Si OUI : Passer à PHASE 3
        </>
      } />
    </div>
  );
}

function Phase3() {
  return (
    <div style={{
      margin: '30px 0',
      padding: '25px',
      borderRadius: '15px',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: 'white'
    }}>
      <div style={{ fontSize: '1.8em', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', color: 'white' }}>
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '15px',
          fontSize: '1.2em',
          color: '#2c3e50',
          fontWeight: 'bold'
        }}>3</div>
        <div>PHASE 3 : ESTHÉTIQUE (Le Style)</div>
      </div>

      <DecisionBox 
        title="⚠️ DÉTECTION PRÉALABLE RENFORCÉE (3 CAS POSSIBLES)"
        options={[
          {
            label: 'CAS A - Modèle VALIDÉ en ÉTAPE 1A-BIS',
            content: <>
              Le client a mentionné un modèle ET accepté le résultat de la vérification dimensions
              <br />→ <strong>ACTION :</strong> SKIP complètement open_model_selector
              <br />→ Passer DIRECTEMENT à open_color_selector
            </>
          },
          {
            label: 'CAS B - Modèle mentionné MAIS pas validé',
            content: <>
              Modèle cité mais ÉTAPE 1A-BIS pas franchie OU client a choisi "Option 2"
              <br />→ <strong>ACTION :</strong> SKIP questions Type/Design
              <br />→ APPELER open_model_selector avec ce modèle + 2 alternatives du MÊME TYPE
            </>
          },
          {
            label: 'CAS C - Aucun modèle mentionné',
            content: <>
              Le client arrive sans pré-sélection de modèle
              <br />→ <strong>ACTION :</strong> Poser questions "Type de store ?" et "Design ?"
              <br />→ APPELER open_model_selector avec 3 modèles compatibles
            </>
          }
        ]}
      />

      <Step title="🎨 ÉTAPE 3A - COULEUR ARMATURE" content={
        <>
          APPELER <span style={{ background: 'rgba(0,0,0,0.2)', padding: '3px 8px', borderRadius: '5px', fontWeight: 'bold', color: 'white' }}>open_color_selector</span> pour afficher les pastilles RAL
          <br />→ NE JAMAIS décrire les couleurs en texte
        </>
      } />

      <Step title="🎨 ÉTAPE 3B - CHOIX TOILE" content={
        <>
          APPELER <span style={{ background: 'rgba(0,0,0,0.2)', padding: '3px 8px', borderRadius: '5px', fontWeight: 'bold', color: 'white' }}>open_fabric_selector</span> pour afficher les toiles disponibles
          <br />→ NE JAMAIS décrire les toiles en texte
        </>
      } />
    </div>
  );
}

function Phase4() {
  return (
    <div style={{
      margin: '30px 0',
      padding: '25px',
      borderRadius: '15px',
      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      color: 'white'
    }}>
      <div style={{ fontSize: '1.8em', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', color: 'white' }}>
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '15px',
          fontSize: '1.2em',
          color: '#2c3e50',
          fontWeight: 'bold'
        }}>4</div>
        <div>PHASE 4 : RÉCAPITULATIF & OFFRE (La Conclusion)</div>
      </div>

      <Step title="📋 RÉCAPITULATIF COMPLET" content={
        <>
          Afficher TOUS les choix du client :
          <br />• Modèle + Dimensions
          <br />• Couleurs (armature + toile)
          <br />• Options (LED, Lambrequin, Auvent, etc.)
          <br />• Pose + TVA
        </>
      } />

      <Step title="✅ VALIDATION FINALE" content={
        <>
          "Est-ce que cette configuration correspond exactement à votre projet ?"
          <br />→ Si NON : Ajuster les éléments nécessaires
          <br />→ Si OUI : Générer le devis personnalisé
        </>
      } />

      <DecisionBox 
        title="💰 GÉNÉRATION DU DEVIS PERSONNALISÉ"
        options={[
          {
            label: '',
            content: <>
              APPELER <span style={{ background: 'rgba(0,0,0,0.2)', padding: '3px 8px', borderRadius: '5px', fontWeight: 'bold', color: 'white' }}>display_single_offer</span> (1 SEULE offre)
              <br /><br />
              <strong>Contenu du devis :</strong>
              <br />• Prix de base du store (HT)
              <br />• + Prix des options choisies par le client (LED, Lambrequin, etc.)
              <br />• + Pose (si choisie)
              <br />• + TVA (10% ou 20%)
              <br />• = PRIX TOTAL TTC
              <br /><br />
              <span style={{ background: 'rgba(0,0,0,0.2)', padding: '3px 8px', borderRadius: '5px', fontWeight: 'bold', color: 'white' }}>⚠️ NE PLUS proposer 3 offres (Eco/Standard/Premium)</span>
              <br />Afficher UNIQUEMENT ce que le client a demandé ✅
            </>
          }
        ]}
      />

      <Step title="🔄 SI CLIENT VEUT MODIFIER" content={
        <>
          Si "c'est trop cher" ou "je veux enlever X" :
          <br />→ Proposer de retirer des options (LED, Lambrequin)
          <br />→ Recalculer et afficher nouveau devis
          <br />→ NE PAS changer de type de store sauf si demandé explicitement
        </>
      } />
    </div>
  );
}

function PointsCles() {
  return (
    <div style={{ marginTop: '40px', padding: '30px', background: '#ecf0f1', borderRadius: '15px', textAlign: 'center' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '15px', fontWeight: 'bold', fontSize: '1.5em' }}>🎯 Points Clés du Flux</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px', textAlign: 'left' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
          <strong style={{ color: '#e74c3c' }}>1️⃣ Vérification immédiate</strong>
          <p style={{ marginTop: '10px', color: '#7f8c8d' }}>Si modèle pré-sélectionné, vérifier compatibilité dimensions AVANT toutes les autres questions</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
          <strong style={{ color: '#3498db' }}>2️⃣ Respect du choix client</strong>
          <p style={{ marginTop: '10px', color: '#7f8c8d' }}>Si modèle validé en ÉTAPE 1A-BIS, ne PAS reproposer 3 modèles en PHASE 3</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
          <strong style={{ color: '#2ecc71' }}>3️⃣ Cohérence du type</strong>
          <p style={{ marginTop: '10px', color: '#7f8c8d' }}>Alternatives toujours du MÊME TYPE : coffre→coffre, monobloc→monobloc</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
          <strong style={{ color: '#f39c12' }}>4️⃣ Une seule offre</strong>
          <p style={{ marginTop: '10px', color: '#7f8c8d' }}>Afficher uniquement les options choisies par le client, pas 3 offres pré-définies</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '3px solid #d32f2f' }}>
          <strong style={{ color: '#d32f2f' }}>5️⃣ NOUVEAU : Limite 4m avancée</strong>
          <p style={{ marginTop: '10px', color: '#7f8c8d' }}>Si avancée &gt; 4.00m → Arrêt + 2 options : ajuster OU redirection formulaire contact pré-rempli</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '3px solid #2196f3' }}>
          <strong style={{ color: '#2196f3' }}>6️⃣ NOUVEAU : Question clarifiée</strong>
          <p style={{ marginTop: '10px', color: '#7f8c8d' }}>« Dimensions de votre <strong>terrasse</strong> » (pas « espace ») pour éviter confusion avec dimensions du store</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '3px solid #9c27b0' }}>
          <strong style={{ color: '#9c27b0' }}>7️⃣ NOUVEAU : Recommandation 6m systématique</strong>
          <p style={{ marginTop: '10px', color: '#7f8c8d' }}>Si largeur &gt; 6.00m → Recommandation SYSTÉMATIQUE d'optimiser à 6m (budget, fiabilité, installation). Client peut insister pour conserver sa largeur.</p>
        </div>
      </div>
    </div>
  );
}

function Step({ title, content }: { title: string; content: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.2)',
      padding: '15px 20px',
      borderRadius: '10px',
      margin: '15px 0',
      borderLeft: '4px solid rgba(255,255,255,0.8)',
      color: 'white'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: '8px', color: 'white' }}>{title}</div>
      <div style={{ fontSize: '0.95em', lineHeight: 1.6, color: 'white' }}>{content}</div>
    </div>
  );
}

function DecisionBox({ title, options }: { title: string; options: Array<{ label: string; content: React.ReactNode }> }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.15)',
      padding: '20px',
      borderRadius: '12px',
      margin: '20px 0',
      border: '2px dashed rgba(255,255,255,0.8)',
      color: 'white'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.15em', marginBottom: '12px', textTransform: 'uppercase', color: 'white' }}>
        {title}
      </div>
      <div style={{ marginLeft: '20px' }}>
        {options.map((option, index) => (
          <div key={index} style={{
            margin: '10px 0',
            padding: '10px',
            background: 'rgba(0,0,0,0.25)',
            borderRadius: '8px',
            borderLeft: '3px solid rgba(255,255,255,0.9)',
            color: 'white'
          }}>
            {option.label && <strong style={{ color: 'white' }}>{option.label}</strong>}
            {option.label && <br />}
            {option.content}
          </div>
        ))}
      </div>
    </div>
  );
}
