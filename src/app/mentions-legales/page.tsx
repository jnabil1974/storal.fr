import Link from 'next/link';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa] py-12 font-['Epilogue',sans-serif]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
          <div className="mb-10">
            <span className="inline-block px-4 py-1.5 bg-[#ff7024]/10 text-[#ff7024] rounded-full text-xs font-black uppercase tracking-widest border border-[#ff7024]/30 mb-6">
              Informations légales
            </span>
            <h1 className="text-5xl font-black text-[#2c3e50] uppercase tracking-tight">
              Mentions Légales
            </h1>
          </div>
          
          <section className="mb-10">
            <h2 className="text-3xl font-black text-[#2c3e50] mb-6 uppercase tracking-wide">
              Éditeur du site
            </h2>
            <div className="space-y-4 bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
              <p className="text-gray-700 leading-relaxed font-medium">
                Le site <span className="font-black text-[#2c3e50]">storal.fr</span> est édité par la société{' '}
                <span className="font-black text-[#2c3e50]">STORAL</span>, Société par Actions Simplifiée 
                Unipersonnelle (SASU) au capital de <span className="font-black">1 500 euros</span>, immatriculée 
                au Registre du Commerce et des Sociétés (RCS) de Paris.
              </p>
              
              <ul className="space-y-3 text-gray-700 font-medium">
                <li className="flex items-start gap-3">
                  <span className="font-black text-[#2c3e50] min-w-[140px]">Siège social :</span>
                  <span>58 rue de Monceau CS 48756, 75380 Paris</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-[#2c3e50] min-w-[140px]">Capital :</span>
                  <span>1 500 €</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-[#2c3e50] min-w-[140px]">Président :</span>
                  <span>M. Nabil JLAIEL</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-[#2c3e50] min-w-[140px]">Téléphone :</span>
                  <span>01 85 09 34 46</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-[#2c3e50] min-w-[140px]">Email :</span>
                  <a href="mailto:commandes@storal.fr" className="text-[#ff7024] hover:underline font-bold">
                    commandes@storal.fr
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-[#2c3e50] min-w-[140px]">RCS :</span>
                  <span>100 710 318 R.C.S. Paris</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-[#2c3e50] min-w-[140px]">Publication :</span>
                  <span>M. Nabil JLAIEL</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-black text-[#2c3e50] mb-6 uppercase tracking-wide">
              Hébergement
            </h2>
            <div className="space-y-3 bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
              <p className="text-gray-700 font-medium mb-4">
                Le site est hébergé par <span className="font-black text-[#2c3e50]">OVH SAS</span>
              </p>
              <ul className="space-y-3 text-gray-700 font-medium">
                <li className="flex items-start gap-3">
                  <span className="font-black text-[#2c3e50] min-w-[100px]">Adresse :</span>
                  <span>2 rue Kellermann, 59100 Roubaix, France</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black text-[#2c3e50] min-w-[100px]">Site web :</span>
                  <a 
                    href="https://www.ovhcloud.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#ff7024] hover:underline font-bold"
                  >
                    www.ovhcloud.com
                  </a>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-black text-[#2c3e50] mb-6 uppercase tracking-wide">
              TVA et Tarifs
            </h2>
            <div className="space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center text-2xl font-black">
                  %
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 text-lg mb-3">
                    TVA à taux réduit (10 %)
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-medium mb-4">
                    Ce taux préférentiel s&apos;applique exclusivement dans le cadre d&apos;une{' '}
                    <span className="font-black text-blue-900">prestation de fourniture et de pose réalisée par l&apos;un de nos installateurs agréés</span>, 
                    et sous réserve que votre habitation (maison ou appartement) soit{' '}
                    <span className="font-black text-blue-900">achevée depuis plus de 2 ans</span>.
                  </p>
                  <p className="text-gray-700 leading-relaxed font-medium mb-4">
                    En cas de <strong>fourniture seule</strong> (sans pose par nos équipes) ou pour une{' '}
                    <strong>construction neuve de moins de 2 ans</strong>, le taux de TVA normal de{' '}
                    <span className="font-black text-red-700">20 %</span> sera appliqué conformément 
                    à la législation fiscale en vigueur.
                  </p>
                  <div className="p-4 bg-white border-l-4 border-blue-500 rounded-lg">
                    <p className="text-sm text-gray-600 font-medium italic">
                      📄 Une attestation simplifiée vous sera demandée lors de la facturation de la pose.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-black text-[#2c3e50] mb-6 uppercase tracking-wide">
              Propriété intellectuelle
            </h2>
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
              <p className="text-gray-700 leading-relaxed font-medium">
                L&apos;ensemble de ce site relève de la législation française et internationale sur le droit 
                d&apos;auteur et la propriété intellectuelle. Tous les éléments de ce site, y compris les textes, 
                images, graphismes, logos, icônes, sons, logiciels, sont la propriété exclusive de{' '}
                <span className="font-black text-[#2c3e50]">STORAL</span>. Toute reproduction, représentation, 
                modification, publication, adaptation de tout ou partie des éléments du site, quel que soit 
                le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-black text-[#2c3e50] mb-6 uppercase tracking-wide">
              Assistant conversationnel IA
            </h2>
            <div className="space-y-6 bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100">
              
              {/* Introduction */}
              <p className="text-gray-700 leading-relaxed font-medium text-lg">
                Dans le cadre de l&apos;optimisation de l&apos;expérience utilisateur et de l&apos;aide à la 
                configuration technique des stores bannes, le site <span className="font-black text-[#2c3e50]">storal.fr</span> utilise 
                un agent conversationnel basé sur la technologie{' '}
                <span className="font-black text-[#2c3e50]">Google Gemini</span> (version professionnelle).
              </p>
              
              {/* Garantie principale */}
              <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg">
                <h3 className="font-black text-gray-900 text-lg mb-2 flex items-center gap-2">
                  <span className="text-2xl">🔒</span>
                  Garantie de Confidentialité et Non-Entraînement
                </h3>
                <p className="text-gray-700 font-medium leading-relaxed">
                  Nous utilisons une <strong>version professionnelle et sécurisée</strong> de cette technologie 
                  (Google Gemini API pour entreprises). Contrairement aux versions grand public, les données 
                  techniques et personnelles transmises lors de vos échanges sont{' '}
                  <span className="font-black text-green-700">strictement isolées</span>. Elles ne sont{' '}
                  <span className="font-black text-green-700 underline">en aucun cas utilisées par Google</span> pour 
                  l&apos;entraînement, l&apos;amélioration ou l&apos;apprentissage de ses modèles d&apos;intelligence 
                  artificielle globaux. <strong>Vos données restent votre propriété exclusive et celle de STORAL.</strong>
                </p>
              </div>

              {/* Détails techniques */}
              <div className="space-y-4">
                <h3 className="font-black text-gray-900 text-lg">📋 Informations techniques</h3>
                <ul className="space-y-3 text-gray-700 font-medium">
                  <li className="flex items-start gap-3">
                    <span className="font-black text-[#2c3e50] min-w-[160px]">Fournisseur :</span>
                    <span>Google LLC (Mountain View, Californie, USA) - Gemini API</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-black text-[#2c3e50] min-w-[160px]">Service utilisé :</span>
                    <span>Google AI SDK (@ai-sdk/google) avec accès API sécurisé</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-black text-[#2c3e50] min-w-[160px]">Finalité :</span>
                    <span>Assistance à la configuration, diagnostic technique, calcul de prix, recommandations produits personnalisées</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-black text-[#2c3e50] min-w-[160px]">Durée de session :</span>
                    <span>Maximum 50 échanges par conversation (limitation technique à 100 messages)</span>
                  </li>
                </ul>
              </div>

              {/* Tableau des données collectées */}
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <h3 className="font-black text-gray-900 text-lg p-4 bg-gray-50 border-b border-gray-200">
                  🗂️ Détail des données collectées et finalités
                </h3>
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-3 font-black text-gray-700">Type de donnée</th>
                      <th className="text-left p-3 font-black text-gray-700">Finalité du traitement</th>
                      <th className="text-left p-3 font-black text-gray-700">Conservation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="bg-white">
                      <td className="p-3 font-medium text-gray-900">Dimensions techniques</td>
                      <td className="p-3 text-gray-700">Largeur (M1), Profondeur (M2), Hauteur (H) - Calcul de faisabilité et prix</td>
                      <td className="p-3 text-gray-700">Session uniquement</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium text-gray-900">Configuration environnement</td>
                      <td className="p-3 text-gray-700">Orientation, fixation (mur M1/M2/M3/M4), exposition (vent, mer)</td>
                      <td className="p-3 text-gray-700">Session uniquement</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-3 font-medium text-gray-900">Options techniques</td>
                      <td className="p-3 text-gray-700">Sortie câble, LED (bras/coffre), lambrequin, type de pose</td>
                      <td className="p-3 text-gray-700">Session uniquement</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium text-gray-900">Préférences de personnalisation</td>
                      <td className="p-3 text-gray-700">Type de store (coffre/monobloc/tradition), design, couleurs (armature, toile)</td>
                      <td className="p-3 text-gray-700">Session uniquement</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-3 font-medium text-gray-900">Historique conversationnel</td>
                      <td className="p-3 text-gray-700">Questions/réponses pour améliorer la pertinence et assurer le suivi du projet</td>
                      <td className="p-3 text-gray-700">Session uniquement*</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium text-gray-900">Configuration finale validée</td>
                      <td className="p-3 text-gray-700">Génération de devis et traitement de commande (avec consentement explicite)</td>
                      <td className="p-3 text-gray-700 font-semibold">3 ans (durée légale devis)</td>
                    </tr>
                  </tbody>
                </table>
                <div className="p-3 bg-blue-50 text-xs text-gray-600 italic border-t border-blue-100">
                  * <strong>Session uniquement</strong> = Les données sont traitées en temps réel et ne sont pas stockées de 
                  manière permanente par STORAL. L&apos;API Google Gemini traite les requêtes sans apprentissage.
                </div>
              </div>

              {/* Sécurité et Transferts */}
              <div className="space-y-4">
                <h3 className="font-black text-gray-900 text-lg">🌍 Sécurité et Transferts (RGPD)</h3>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                  <p className="text-gray-700 font-medium">
                    <span className="font-black text-blue-900">Transferts Hors Union Européenne :</span><br />
                    Le traitement des requêtes via l&apos;assistant intelligent implique un transfert technique de données 
                    vers les infrastructures sécurisées de Google Cloud (USA). Ce transfert est encadré par les{' '}
                    <strong>Clauses Contractuelles Types (CCT)</strong> de la Commission Européenne, garantissant un niveau 
                    de protection des données personnelles équivalent à celui en vigueur au sein de l&apos;UE (RGPD).
                  </p>
                  <p className="text-gray-700 font-medium">
                    <span className="font-black text-blue-900">Protections techniques mises en place :</span>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
                    <li><strong>Protection anti-bot</strong> : Honeypot et validation des requêtes</li>
                    <li><strong>Filtrage de contenu</strong> : Détection automatique de scripts malveillants (XSS, injections)</li>
                    <li><strong>Limitation de longueur</strong> : Maximum 1000 caractères par message</li>
                    <li><strong>Limite de session</strong> : Maximum 50 échanges pour éviter les abus</li>
                  </ul>
                </div>
              </div>

              {/* Intervention humaine */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-gray-700 font-medium">
                  <span className="font-black text-purple-900">🤝 Intervention Humaine :</span><br />
                  Bien que l&apos;assistant soit conçu pour fournir des informations précises basées sur notre catalogue 
                  (STORAL Armor, Excellence, Kube, Compact, etc.), <strong>aucune décision juridique ou contractuelle 
                  n&apos;est prise de manière 100% automatisée</strong>. Vous pouvez à tout moment demander une validation 
                  par un conseiller technique humain de l&apos;équipe STORAL au{' '}
                  <a href="tel:0185093446" className="font-black text-purple-700 underline">01 85 09 34 46</a>.
                </p>
              </div>

              {/* Recommandations */}
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg">
                <p className="text-gray-700 font-medium">
                  <span className="font-black text-amber-900">💡 Recommandation de sécurité :</span><br />
                  Même si vos données sont protégées par notre infrastructure sécurisée, nous vous recommandons de 
                  <strong> ne jamais communiquer</strong> de données personnelles sensibles dans les conversations avec 
                  l&apos;assistant (coordonnées bancaires, mots de passe, numéros de documents d&apos;identité, etc.).
                </p>
              </div>
            </div>
          </section>

          <div className="mt-10 pt-10 border-t border-gray-200">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-[#ff7024] text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-[#ff7024]/20"
            >
              <span>←</span>
              <span>Retour à l&apos;accueil</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
