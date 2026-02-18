import Link from 'next/link';

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de Confidentialité (RGPD)</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsable du traitement</h2>
            <p className="text-gray-700">
              Société <strong>STORAL</strong><br />
              58 rue de Monceau CS 48756<br />
              75380 Paris Cedex 08
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Données collectées</h2>
            <p className="text-gray-700 mb-4">
              Dans le cadre de l'utilisation du site storal.fr, nous collectons :
            </p>
            
            <ul className="space-y-3 text-gray-700 ml-4">
              <li>
                <strong>Identité :</strong> Nom, prénom, adresse, téléphone (pour la livraison).
              </li>
              <li>
                <strong>Contact :</strong> Email (pour le suivi de commande et la création de compte).
              </li>
              <li>
                <strong>Connexion :</strong> Adresse IP, logs de connexion (sécurité).
              </li>
            </ul>

            <p className="text-gray-700 mt-4 bg-blue-50 p-4 rounded border border-blue-200">
              Les données bancaires sont traitées exclusivement par notre prestataire <strong>Stripe</strong> 
              et ne sont jamais stockées sur nos serveurs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Finalité des données</h2>
            <p className="text-gray-700">
              Vos données sont nécessaires pour :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3 ml-2">
              <li>Expédier votre commande</li>
              <li>Vous envoyer les notifications de suivi</li>
              <li>Établir la facture</li>
              <li>Assurer le service après-vente</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Partage des données</h2>
            <p className="text-gray-700 mb-4">
              Nous ne vendons pas vos données. Elles sont transmises uniquement :
            </p>
            
            <ul className="space-y-3 text-gray-700 ml-4">
              <li>
                <strong>À nos fournisseurs et transporteurs</strong> (pour la livraison).
              </li>
              <li>
                <strong>À notre hébergeur OVH</strong> (stockage sécurisé en France/UE).
              </li>
              <li>
                <strong>À notre prestataire d'emailing Resend</strong> (notifications).
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Conservation des données</h2>
            <p className="text-gray-700 mb-4">
              Pour des raisons de sécurité, les informations sensibles collectées lors de votre commande 
              sont traitées avec attention particulière :
            </p>
            <ul className="space-y-3 text-gray-700 ml-4">
              <li>
                <strong>Adresse postale et numéro de téléphone</strong> : ces données ne seront 
                <strong> pas conservées après la livraison</strong> de votre commande et seront supprimées 
                définitivement.
              </li>
              <li>
                <strong>Email et historique des commandes</strong> : conservés pour le service après-vente 
                et conformément aux obligations légales (durée : 3 ans).
              </li>
              <li>
                <strong>Données bancaires</strong> : ne sont jamais stockées sur nos serveurs 
                (gérées par Stripe).
              </li>
            </ul>
          </section>

          <section className="mb-8">            <h2 className="text-2xl font-bold text-gray-900 mb-4">Utilisation de l&apos;assistant IA conversationnel</h2>
            <p className="text-gray-700 mb-6">
              Le site utilise <strong>Google Gemini</strong> (version professionnelle), un service d&apos;intelligence 
              artificielle conversationnelle, pour vous assister dans vos recherches et configurations de stores bannes.
            </p>
            
            {/* Garantie principale avec badge */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-5 rounded-lg mb-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">🔐</span>
                Protection de vos conversations - Garantie Non-Entraînement
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                STORAL utilise une <strong>version professionnelle de Google Gemini API</strong> pour son assistant 
                conversationnel. Cette version entreprise bénéficie de la <strong>protection des données d&apos;entreprise</strong>, 
                ce qui signifie que <strong>vos données sont strictement isolées</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed font-semibold">
                Le modèle IA que nous utilisons est configuré avec une option de{' '}
                <span className="text-green-700 font-black underline">non-entraînement</span>. Cela signifie que{' '}
                <strong className="text-green-700">vos conversations ne sont PAS utilisées par Google pour améliorer 
                ses modèles d&apos;intelligence artificielle</strong>. Vos échanges restent votre propriété exclusive 
                et celle de STORAL.
              </p>
            </div>

            {/* Tableau détaillé des données */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">📊 Données collectées et finalités</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-3 font-bold text-gray-700">Type de donnée</th>
                      <th className="text-left p-3 font-bold text-gray-700">Finalité</th>
                      <th className="text-left p-3 font-bold text-gray-700">Conservation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="bg-white">
                      <td className="p-3 font-medium text-gray-900">Messages et questions</td>
                      <td className="p-3 text-gray-700">Génération de réponses personnalisées en temps réel</td>
                      <td className="p-3 text-gray-700">Session uniquement</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium text-gray-900">Données de configuration</td>
                      <td className="p-3 text-gray-700">Dimensions (M1, M2, H), orientation, fixation, options LED</td>
                      <td className="p-3 text-gray-700">Session uniquement</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-3 font-medium text-gray-900">Préférences esthétiques</td>
                      <td className="p-3 text-gray-700">Type de store, design, couleurs (RAL armature/toile)</td>
                      <td className="p-3 text-gray-700">Session uniquement</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium text-gray-900">Historique conversationnel</td>
                      <td className="p-3 text-gray-700">Maintien du contexte durant la session (max 50 échanges)</td>
                      <td className="p-3 text-gray-700">Session uniquement</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-3 font-medium text-gray-900">Configuration finale validée</td>
                      <td className="p-3 text-gray-700">Génération de devis et enregistrement de commande</td>
                      <td className="p-3 text-gray-700 font-semibold">3 ans (durée légale)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Traitement et sécurité */}
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg mb-6">
              <h3 className="font-bold text-gray-900 mb-3">🔒 Traitement et sécurité des données</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Traitement des données :</strong><br />
                  Les conversations sont transmises à l&apos;API Google Gemini uniquement pour générer les réponses 
                  en temps réel. Google s&apos;engage contractuellement à ne pas utiliser ces données pour entraîner 
                  ses modèles IA globaux, conformément aux{' '}
                  <a 
                    href="https://ai.google.dev/gemini-api/terms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    conditions d&apos;utilisation de l&apos;API Gemini pour entreprises
                  </a>.
                </p>
                
                <p>
                  <strong>Transferts internationaux (RGPD) :</strong><br />
                  Les données sont traitées sur les serveurs Google Cloud (USA). Ce transfert est encadré par les{' '}
                  <strong>Clauses Contractuelles Types (CCT)</strong> approuvées par la Commission Européenne, 
                  garantissant un niveau de protection équivalent au RGPD européen.
                </p>

                <p>
                  <strong>Mesures de sécurité techniques :</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Validation et filtrage des entrées (protection XSS, injections)</li>
                  <li>Protection anti-bot avec honeypot</li>
                  <li>Limitation de session à 50 échanges maximum</li>
                  <li>Limitation de longueur de message (1000 caractères max)</li>
                  <li>Pas de stockage permanent des conversations par STORAL</li>
                </ul>
              </div>
            </div>

            {/* Conservation des données */}
            <div className="bg-purple-50 border border-purple-200 p-5 rounded-lg mb-6">
              <h3 className="font-bold text-gray-900 mb-2">⏱️ Conservation des données</h3>
              <p className="text-gray-700">
                <strong>STORAL ne conserve pas l&apos;historique complet de vos conversations</strong>. Les échanges 
                avec l&apos;assistant sont traités en temps réel et ne sont pas stockés de manière permanente sur nos 
                serveurs. Seules les <strong>configurations finales validées</strong> (devis ou commandes) sont 
                enregistrées avec votre consentement explicite, pour une durée de <strong>3 ans</strong> (durée légale 
                de conservation des devis commerciaux).
              </p>
            </div>

            {/* Bonnes pratiques */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>💡</span>
                Bonnes pratiques de sécurité
              </h3>
              <p className="text-gray-700 mb-3">
                Même si vos données sont protégées par notre infrastructure sécurisée et qu&apos;elles ne sont pas 
                utilisées pour l&apos;entraînement de modèles IA, nous vous recommandons de suivre ces bonnes pratiques :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Ne communiquez jamais</strong> de mots de passe ou codes d&apos;accès</li>
                <li><strong>Ne partagez pas</strong> de coordonnées bancaires complètes (IBAN, numéros de carte)</li>
                <li><strong>Évitez de transmettre</strong> des copies de documents d&apos;identité (CNI, passeport)</li>
                <li><strong>Pour les données sensibles</strong>, contactez directement un conseiller humain au{' '}
                  <a href="tel:0185093446" className="text-amber-700 font-bold underline">01 85 09 34 46</a>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vos droits</h2>
            <p className="text-gray-700 mb-4">
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression 
              de vos données.
            </p>
            <p className="text-gray-700 bg-green-50 p-4 rounded border border-green-200">
              Pour l'exercer, envoyez un email à <a href="mailto:commandes@storal.fr" className="text-blue-600 hover:underline font-semibold">commandes@storal.fr</a>
            </p>
          </section>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
